import { z } from "zod";

const safeString = (fallback = "") =>
  z.preprocess((v) => (typeof v === "string" ? v : fallback), z.string());

const safeNumber = (fallback = 0) =>
  z.preprocess(
    (v) => (typeof v === "number" && !isNaN(v) ? v : fallback),
    z.number()
  );

const safeBoolean = (fallback = false) =>
  z.preprocess((v) => (typeof v === "boolean" ? v : fallback), z.boolean());

const safeStringArray = () =>
  z.preprocess(
    (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []),
    z.array(z.string())
  );

export const ScheduleSummarySchema = z.object({
  start_date: safeString(""),
  start_time: safeString(""),
  end_date: safeString(""),
  end_time: safeString(""),
});

export const EventSummarySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Event name is required"),
  blurb: safeString(""),
  cover_image_url: safeString(""),
  cover_image_alt: safeString("NexusFest Event Cover"),
  category: safeString("General"),
  tags: safeStringArray(),
  event_type: safeString("EVENT"),
  event_mode: safeString("OFFLINE"),
  event_status: safeString("ACTIVE"),
  is_featured: safeBoolean(false),
  is_technical: safeBoolean(true),
  price: safeNumber(0),
  is_per_head: safeBoolean(true),
  min_teamsize: safeNumber(1),
  max_teamsize: safeNumber(1),
  total_seats: safeNumber(100),
  seats_filled: safeNumber(0),
  registration_status: safeString("OPEN"),
  registration_deadline: safeString(""),
  schedule_summary: z.preprocess(
    (v) => (v && typeof v === "object" ? v : {}),
    ScheduleSummarySchema
  ),
});

export type EventSummary = z.infer<typeof EventSummarySchema>;

export const PrizeSchema = z.object({
  rank: safeNumber(1),
  title: safeString("Winner"),
  amount: safeNumber(0),
  description: safeString(""),
});
export type Prize = z.infer<typeof PrizeSchema>;

export const FAQSchema = z.object({
  question: safeString(""),
  answer: safeString(""),
});
export type FAQ = z.infer<typeof FAQSchema>;

export const ScheduleItemSchema = z.object({
  event_date: safeString(""),
  start_time: safeString(""),
  end_time: safeString(""),
  venue: safeString("Main Arena"),
});
export type ScheduleItem = z.infer<typeof ScheduleItemSchema>;

export const OrganizerSchema = z.object({
  id: safeString(""),
  name: safeString("Organizing Committee"),
  org_type: safeString("CLUB"),
});
export type Organizer = z.infer<typeof OrganizerSchema>;

export const CoordinatorSchema = z.object({
  id: safeString(""),
  name: safeString("Coordinator"),
  role: safeString("Lead"),
  contact: safeString(""),
});
export type Coordinator = z.infer<typeof CoordinatorSchema>;

export const EventDetailSchema = EventSummarySchema.extend({
  description: safeString(""),
  banner_image_url: safeString(""),
  banner_image_alt: safeString("NexusFest Event Banner"),
  gallery_images: safeStringArray(),
  highlights: safeStringArray(),
  what_to_expect: safeStringArray(),
  eligibility: safeStringArray(),
  prerequisites: safeStringArray(),
  rules: safeStringArray(),
  prizes: z.preprocess(
    (v) => (Array.isArray(v) ? v : []),
    z.array(PrizeSchema)
  ),
  faqs: z.preprocess(
    (v) => (Array.isArray(v) ? v : []),
    z.array(FAQSchema)
  ),
  schedules: z.preprocess(
    (v) => (Array.isArray(v) ? v : []),
    z.array(ScheduleItemSchema)
  ),
  organizers: z.preprocess(
    (v) => (Array.isArray(v) ? v : []),
    z.array(OrganizerSchema)
  ),
  coordinators: z.preprocess(
    (v) => (Array.isArray(v) ? v : []),
    z.array(CoordinatorSchema)
  ),
});

export type EventDetail = z.infer<typeof EventDetailSchema>;

export type ApiClientErrorType =
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "HTTP_5XX"
  | "HTTP_4XX"
  | "NOT_FOUND"
  | "PARSE_ERROR"
  | "OFFLINE"
  | "UNKNOWN";

export interface ApiClientError {
  type: ApiClientErrorType;
  message: string;
  statusCode?: number;
  isRetryable: boolean;
  originalError?: unknown;
}
