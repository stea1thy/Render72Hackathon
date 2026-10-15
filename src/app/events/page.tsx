import React from "react";
import type { Metadata } from "next";
import { getEvents } from "@/lib/api";
import type { EventSummary } from "@/lib/types";
import { EventsPageClient } from "@/components/events-page-client";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Explore 30 flagship hackathons, competitive robotics arenas, and technical workshops at Nexus Fest '26.",
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
    <div className="w-full min-h-screen py-10 px-6 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="border-b-2 border-[#38208C]/50 pb-8 space-y-4">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 bg-[#1B0E40] border-2 border-[#FFF3B8] text-[#FFF3B8] px-3 py-1 font-pixel-clean text-xs rounded-none shadow-[3px_3px_0px_#090318]">
          <span className="h-1.5 w-1.5 bg-[#E63E9B]" />
          <span>30 Events • Coimbatore &amp; Online</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="font-pixel-block text-2xl sm:text-4xl lg:text-[40px] text-[#FFFDF2] drop-shadow-[4px_4px_0px_#090318] leading-tight">
              Where Builders Compete.
            </h1>
            <p className="font-mono text-sm sm:text-base text-[#D8E2FF]/80 max-w-2xl leading-relaxed">
              Three days of high-stakes hackathons, autonomous robotics arenas, and hands-on engineering masterclasses with ₹1,50,000+ in total prizes.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-[#FFFDF2] text-[#1B0E40] border-2 border-[#100526] px-3.5 py-2 font-pixel-clean text-xs font-bold rounded-none shadow-[3px_3px_0px_#E63E9B] shrink-0 self-start md:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-[#E63E9B]" />
            <span>Instant Registration</span>
          </div>
        </div>
      </div>

      {/* Events Client Interactive Interface */}
      <EventsPageClient initialEvents={initialEvents} />
    </div>
  );
}
