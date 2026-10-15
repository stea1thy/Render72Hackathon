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
        <div className="p-8 rounded-2xl bg-zinc-900/40 border border-rose-500/20 text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h2 className="font-bold text-xl text-white">
            Unable to Load Events
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            {error instanceof Error
              ? error.message
              : "The events service is temporarily unreachable. Please check your connection or retry."}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
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
