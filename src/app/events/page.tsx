import React from "react";
import type { Metadata } from "next";
import { getEvents } from "@/lib/api";
import type { EventSummary } from "@/lib/types";
import { EventsPageClient } from "@/components/events-page-client";
import { Terminal, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "Events Catalog // NexusFest 2026",
  description:
    "Explore, filter and register for hackathons, competitive programming tournaments, robotics arena battles, and tech workshops at NexusFest 2026.",
};

export const revalidate = 60; // ISR 60 seconds

export default async function EventsPage() {
  let initialEvents: EventSummary[] = [];
  try {
    initialEvents = await getEvents();
  } catch (err) {
    console.error("[EventsPage SSR] Failed to fetch events for SSR:", err);
    initialEvents = [];
  }

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#232635] pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00ff66] mb-2">
          <Terminal className="w-3.5 h-3.5" />
          <span>INDEX &gt; EVENTS_CATALOG &gt; 30 NODES ACTIVE</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#f4f5f8] tracking-tight">
              EVENT PROTOCOLS<span className="text-[#00ff66]">.</span>
            </h1>
            <p className="font-sans text-sm text-[#8b93a7] mt-2 max-w-2xl">
              Browse 30 flagship hackathons, competitive robotics, AI symposiums, and masterclasses. Filter dynamically by stack, format, and seat availability.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[#8b93a7] bg-[#10121a] px-3 py-1.5 border border-[#232635] shrink-0">
            <Database className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>CACHED: ISR 60S</span>
            <span className="text-[#555c70]">|</span>
            <span className="text-[#00ff66]">LIVE SYNC</span>
          </div>
        </div>
      </div>

      {/* Events Client Interactive Interface */}
      <EventsPageClient initialEvents={initialEvents} />
    </div>
  );
}
