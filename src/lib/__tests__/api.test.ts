import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchWithRetry,
  getEvents,
  saveLastKnownGood,
  getLastKnownGood,
  FestivalApiError,
} from "../api";

describe("NexusFest Resilience Layer", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("does not retry on 404 error", async () => {
    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      return Promise.resolve({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });
    });

    await expect(
      fetchWithRetry("https://example.com/api/test/events/unknown-id", {
        maxRetries: 3,
        timeoutMs: 1000,
      })
    ).rejects.toThrow();

    expect(callCount).toBe(1); // 404 must NOT retry!
  });

  it("retries up to maxRetries on 500 error", async () => {
    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      return Promise.resolve({
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
      });
    });

    await expect(
      fetchWithRetry("https://example.com/api/test/events", {
        maxRetries: 2,
        timeoutMs: 500,
      })
    ).rejects.toThrow();

    expect(callCount).toBe(3); // 1 initial + 2 retries = 3
  });

  it("skips single malformed records while preserving valid ones", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          events: [
            {
              id: "valid-1",
              name: "Autonomous Drone Grand Prix",
              category: "Robotics",
              tags: ["Drones"],
              event_type: "EVENT",
              event_mode: "OFFLINE",
              event_status: "ACTIVE",
              is_featured: true,
              is_technical: true,
              price: 500,
              is_per_head: false,
              min_teamsize: 2,
              max_teamsize: 4,
              total_seats: 50,
              seats_filled: 20,
              registration_status: "OPEN",
              registration_deadline: "2026-11-01T18:00:00+05:30",
              schedule_summary: {
                start_date: "2026-11-05",
                start_time: "10:00",
                end_date: "2026-11-05",
                end_time: "17:00",
              },
            },
            {
              // Completely invalid record missing required fields
              something_broken: 12345,
            },
          ],
        }),
    });

    const events = await getEvents();
    expect(events.length).toBe(1);
    expect(events[0].id).toBe("valid-1");
  });

  it("falls back to Last-Known-Good when live fetch fails", async () => {
    saveLastKnownGood("events_list", [
      {
        id: "lkg-1",
        name: "LKG Event",
        category: "AI",
        tags: [],
        event_type: "EVENT",
        event_mode: "ONLINE",
        event_status: "ACTIVE",
        is_featured: false,
        is_technical: true,
        price: 0,
        is_per_head: true,
        min_teamsize: 1,
        max_teamsize: 1,
        total_seats: 100,
        seats_filled: 10,
        registration_status: "OPEN",
        registration_deadline: "",
        schedule_summary: {
          start_date: "2026-11-01",
          start_time: "10:00",
          end_date: "2026-11-01",
          end_time: "12:00",
        },
      },
    ]);

    // Live fetch fails with 500
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Server Error",
    });

    const events = await getEvents();
    expect(events.length).toBe(1);
    expect(events[0].id).toBe("lkg-1");
  });
});
