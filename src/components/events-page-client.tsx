"use client";

import React, { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/lib/api";
import { EventsCatalog } from "./events-catalog";
import { EventsSkeleton } from "./events-skeleton";
import { ResilienceBanner } from "./resilience-banner";
import { AlertCircle, RotateCcw } from "lucide-react";
import type { EventSummary } from "@/lib/types";

export function EventsPageClient({
  initialEvents,
}: {
  initialEvents: EventSummary[];
}) {
  const {
    data: events,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    initialData: initialEvents,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return (
    <div className="w-full">
      <ResilienceBanner isFetching={isFetching} onRetry={() => refetch()} />

      {error && (!events || events.length === 0) ? (
        <div className="p-8 bg-[#10121a] border-2 border-[#ff3344] shadow-brutal-crimson text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-[#ff3344] mx-auto animate-pulse" />
          <h2 className="font-display font-bold text-xl text-[#f4f5f8]">
            FAILED TO RETRIEVE EVENT DATA
          </h2>
          <p className="font-sans text-xs text-[#8b93a7] max-w-md mx-auto">
            {error instanceof Error
              ? error.message
              : "Remote API cluster did not respond within required parameters."}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00ff66] text-[#090a0f] font-mono font-bold text-xs shadow-brutal-sm cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RETRY LIVE CLUSTER
          </button>
        </div>
      ) : (
        <Suspense fallback={<EventsSkeleton />}>
          <EventsCatalog initialEvents={events || []} />
        </Suspense>
      )}
    </div>
  );
}
