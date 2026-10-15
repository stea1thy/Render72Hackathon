import {
  EventSummarySchema,
  EventDetailSchema,
  type EventSummary,
  type EventDetail,
  type ApiClientError,
  type ApiClientErrorType,
} from "./types";

export const API_BASE_URL = "https://render72.pages.dev";
export const DEFAULT_TIMEOUT_MS = 8000;
export const MAX_RETRIES = 3;

export class FestivalApiError extends Error implements ApiClientError {
  type: ApiClientErrorType;
  statusCode?: number;
  isRetryable: boolean;
  originalError?: unknown;

  constructor(options: {
    type: ApiClientErrorType;
    message: string;
    statusCode?: number;
    isRetryable?: boolean;
    originalError?: unknown;
  }) {
    super(options.message);
    this.name = "FestivalApiError";
    this.type = options.type;
    this.statusCode = options.statusCode;
    this.isRetryable =
      options.isRetryable ??
      (options.type === "TIMEOUT" ||
        options.type === "NETWORK_ERROR" ||
        options.type === "HTTP_5XX");
    this.originalError = options.originalError;
  }
}

// In-memory fallback snapshot store (works on both server and client)
const inMemoryCache = new Map<string, { data: unknown; timestamp: number }>();

const LKG_PREFIX = "nexusfest_lkg_";

export function saveLastKnownGood(key: string, data: unknown): void {
  const timestamp = Date.now();
  inMemoryCache.set(key, { data, timestamp });
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        `${LKG_PREFIX}${key}`,
        JSON.stringify({ data, timestamp })
      );
    } catch {
      // Ignore quota errors
    }
  }
}

export function getLastKnownGood<T>(
  key: string
): { data: T; timestamp: number } | null {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(`${LKG_PREFIX}${key}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed as { data: T; timestamp: number };
      }
    } catch {
      // Fallback to memory
    }
  }
  const memoryEntry = inMemoryCache.get(key);
  if (memoryEntry) {
    return memoryEntry as { data: T; timestamp: number };
  }
  return null;
}

/**
 * Robust fetch with AbortController timeout, exponential backoff, jitter, and selective retry
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit & { timeoutMs?: number; maxRetries?: number } = {}
): Promise<Response> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxRetries = options.maxRetries ?? MAX_RETRIES;

  let attempt = 0;
  let lastError: FestivalApiError | null = null;

  while (attempt <= maxRetries) {
    // Check client offline status in browser before network call
    if (
      typeof window !== "undefined" &&
      typeof navigator !== "undefined" &&
      navigator.onLine === false
    ) {
      throw new FestivalApiError({
        type: "OFFLINE",
        message: "Network link unavailable. Device is offline.",
        isRetryable: true,
      });
    }

    const controller = new AbortController();
    const timerId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const mergedHeaders = {
        Accept: "application/json",
        ...(options.headers || {}),
      };

      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: mergedHeaders,
      });

      clearTimeout(timerId);

      if (res.ok) {
        return res;
      }

      // Handle 4xx vs 5xx
      const is5xx = res.status >= 500 && res.status < 600;
      const is404 = res.status === 404;
      const errorType: ApiClientErrorType = is404
        ? "NOT_FOUND"
        : is5xx
        ? "HTTP_5XX"
        : "HTTP_4XX";

      const err = new FestivalApiError({
        type: errorType,
        statusCode: res.status,
        message: `HTTP ${res.status}: ${res.statusText}`,
        isRetryable: is5xx,
      });

      // 4xx errors must never retry
      if (!is5xx) {
        throw err;
      }

      lastError = err;
    } catch (err: unknown) {
      clearTimeout(timerId);

      if (err instanceof FestivalApiError && !err.isRetryable) {
        throw err;
      }

      let apiErr: FestivalApiError;
      if (err instanceof FestivalApiError) {
        apiErr = err;
      } else if (err instanceof DOMException && err.name === "AbortError") {
        apiErr = new FestivalApiError({
          type: "TIMEOUT",
          message: `Request timed out after ${timeoutMs}ms`,
          isRetryable: true,
          originalError: err,
        });
      } else if (err instanceof TypeError) {
        apiErr = new FestivalApiError({
          type: "NETWORK_ERROR",
          message: `Network transmission failure: ${err.message}`,
          isRetryable: true,
          originalError: err,
        });
      } else {
        apiErr = new FestivalApiError({
          type: "UNKNOWN",
          message: err instanceof Error ? err.message : "Unknown communication error",
          isRetryable: false,
          originalError: err,
        });
      }

      lastError = apiErr;
      if (!apiErr.isRetryable) {
        throw apiErr;
      }
    }

    attempt++;
    if (attempt <= maxRetries) {
      // Exponential backoff: base 250ms * 2^attempt + jitter (0-100ms)
      const backoffMs = Math.pow(2, attempt - 1) * 250 + Math.random() * 100;
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }

  throw (
    lastError ||
    new FestivalApiError({
      type: "NETWORK_ERROR",
      message: "Exhausted all retry attempts",
      isRetryable: false,
    })
  );
}

/**
 * Fetch all events with schema validation, skipping bad records gracefully
 */
export async function getEvents(): Promise<EventSummary[]> {
  const url = `${API_BASE_URL}/api/test/events`;

  try {
    const res = await fetchWithRetry(url, {
      next: { revalidate: 60 },
    });

    const json = await res.json();

    if (!json || typeof json !== "object" || !Array.isArray(json.events)) {
      throw new FestivalApiError({
        type: "PARSE_ERROR",
        message: "API payload schema invalid: missing events list",
        isRetryable: false,
      });
    }

    // Single bad record protection: parse each record, skip corrupt records
    const validEvents: EventSummary[] = [];
    for (const rawItem of json.events) {
      const parsed = EventSummarySchema.safeParse(rawItem);
      if (parsed.success) {
        validEvents.push(parsed.data);
      } else {
        console.warn(
          "[NexusFest API] Skipped malformed event record:",
          rawItem?.id,
          parsed.error.issues
        );
      }
    }

    // Save as Last-Known-Good snapshot
    saveLastKnownGood("events_list", validEvents);

    return validEvents;
  } catch (err) {
    // Check if we have Last-Known-Good data
    const lkg = getLastKnownGood<EventSummary[]>("events_list");
    if (lkg && lkg.data.length > 0) {
      console.warn("[NexusFest API] Serving Last-Known-Good cached data due to fetch error:", err);
      // Return LKG data
      return lkg.data;
    }
    throw err;
  }
}

/**
 * Fetch single event detail with Zod validation
 */
export async function getEventById(id: string): Promise<EventDetail> {
  const url = `${API_BASE_URL}/api/test/events/${id}`;
  const cacheKey = `event_detail_${id}`;

  try {
    const res = await fetchWithRetry(url, {
      next: { revalidate: 60 },
    });

    const json = await res.json();

    if (!json || typeof json !== "object" || !json.event) {
      throw new FestivalApiError({
        type: "PARSE_ERROR",
        message: "Event detail payload missing 'event' container",
        isRetryable: false,
      });
    }

    const parsed = EventDetailSchema.safeParse(json.event);
    if (!parsed.success) {
      console.error("[NexusFest API] Validation error in event detail:", parsed.error);
      throw new FestivalApiError({
        type: "PARSE_ERROR",
        message: "Event detail schema validation mismatch",
        isRetryable: false,
        originalError: parsed.error,
      });
    }

    saveLastKnownGood(cacheKey, parsed.data);
    return parsed.data;
  } catch (err) {
    const lkg = getLastKnownGood<EventDetail>(cacheKey);
    if (lkg && lkg.data) {
      console.warn(`[NexusFest API] Serving LKG snapshot for event ${id}`);
      return lkg.data;
    }
    throw err;
  }
}
