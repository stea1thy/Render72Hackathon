import React from "react";
import type { Metadata } from "next";
import { getEvents } from "@/lib/api";
import type { EventSummary } from "@/lib/types";
import { EventsPageClient } from "@/components/events-page-client";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Events Catalog • NexusFest 2026",
  description:
    "Explore 30 flagship hackathons, competitive robotics arenas, and technical workshops at NexusFest 2026.",
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
    <div className="w-full min-h-screen py-12 px-6 max-w-7xl mx-auto space-y-8 bg-[#09090b]">
      {/* Page Header */}
      <div className="border-b border-white/[0.08] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs text-zinc-300 font-mono mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>30 Events • Coimbatore &amp; Online</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Where Builders Compete.
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
              Three days of high-stakes hackathons, autonomous robotics arenas, and hands-on engineering masterclasses with ₹1,50,000+ in total prizes.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 bg-zinc-900/60 px-3.5 py-2 rounded-lg border border-white/10 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant Registration</span>
          </div>
        </div>
      </div>

      {/* Events Client Interactive Interface */}
      <EventsPageClient initialEvents={initialEvents} />
    </div>
  );
}
