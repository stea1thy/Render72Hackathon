import React from "react";
import type { Metadata } from "next";
import { getEventById, getEvents } from "@/lib/api";
import { EventDetailClient } from "@/components/event-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

const FALLBACK_EVENT_IDS = [
  "0fdc5427-4be3-59d8-9f17-1d7fc20d515a",
  "cb79e7f0-c9fc-55a0-9fa5-e348b8ce64d3",
  "f4a7eca2-0363-5f01-96d8-40b80e7d3798",
  "4819d0b0-4b31-527d-ab30-44cf58ed3b11",
  "6dac7dc2-0d4a-5688-b6bb-323e58d07757",
  "721c1a93-4118-56e8-8cb1-724ef7462243",
  "3e0a5c84-eedf-507e-a9e8-3db7a70f9371",
  "b9148fa1-2795-563d-85a4-68d1f5ffe979",
  "a3e42d20-6d43-5a11-bb14-e25b6f3ea2d1",
  "91242273-2bfd-5f2a-a277-b1754636719a",
  "dff53692-cd0c-5464-9282-d90b791d9ecb",
  "42ba467c-d16a-5498-bcf2-f527bc29f957",
  "78401373-ca0f-5f0e-b00c-93bb4e2212ec",
  "9f14bfb9-e3ea-54ec-afdf-a1f07d8d17dd",
  "6ba46a8b-0197-5ada-873e-aeadddaf57c8",
  "f326be50-5933-5d50-b03b-86270f238b1e",
  "2debc524-b43f-54c5-affd-5246f57a51e7",
  "6aa44f45-fdd2-56a9-a05c-f64dba85bf40",
  "4a8ba284-612f-545b-be1d-0e271cc97657",
  "9a5c1819-17d6-5492-bac7-44d80df98f63",
  "d10fc80a-b1dc-56f3-9e21-37ee22f0d98b",
  "1b87d482-b95f-519d-9bb7-1a5c5e95a954",
  "1c991a44-7b75-5396-84f3-59f924d11fe4",
  "50f647f3-367c-5bac-bcbe-c9e63a072f3d",
  "f7cc220d-8035-57a5-9821-aa6fc7635fcb",
  "a6de479e-c82e-567a-a7a8-61207e455385",
  "e63f2307-8b6f-575e-af50-8ab4fe2e3203",
  "757a47ab-3e29-5ed2-936a-87cff1b818a2",
  "28e534ed-cf8a-5eb6-806c-44c3d61d5d36",
  "da4774c1-0acb-5caa-a7be-e875e2cc120e",
  "non-existent-uuid-12345",
];

export async function generateStaticParams() {
  try {
    const res = await fetch("https://render72.pages.dev/api/test/events", {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.events) && data.events.length > 0) {
        const ids = data.events.map((e: { id: string | number }) => ({
          id: String(e.id),
        }));
        // Include non-existent-uuid-12345 for testing resilient 404 state
        ids.push({ id: "non-existent-uuid-12345" });
        return ids;
      }
    }
  } catch (err) {
    console.warn(
      "[generateStaticParams] Network fetch failed, using fallback IDs:",
      err
    );
  }
  return FALLBACK_EVENT_IDS.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const event = await getEventById(id);
    const imageUrl = event.cover_image_url ? event.cover_image_url : undefined;
    return {
      title: event.name,
      description: event.blurb || "Nexus Fest '26 event details.",
      openGraph: {
        title: `${event.name} • Nexus Fest '26`,
        description: event.blurb,
        images: imageUrl ? [{ url: imageUrl }] : undefined,
      },
    };
  } catch {
    return {
      title: "Event Details • Nexus Fest '26",
    };
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;

  let event = null;
  let allEvents: Awaited<ReturnType<typeof getEvents>> = [];

  try {
    [event, allEvents] = await Promise.all([
      getEventById(id),
      getEvents().catch(() => []),
    ]);
  } catch {
    // If not found in API or fetch fails, event remains null
    event = null;
  }

  return (
    <EventDetailClient
      id={id}
      initialEvent={event}
      initialAllEvents={allEvents}
    />
  );
}
