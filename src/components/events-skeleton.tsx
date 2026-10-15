import React from "react";

export function EventsSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse" aria-label="Loading events catalog">
      {/* Control Deck Skeleton */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-4">
        <div className="h-11 bg-zinc-800/50 rounded-xl w-full"></div>
        <div className="flex gap-2 pt-2">
          <div className="h-7 w-20 bg-zinc-800/40 rounded-full"></div>
          <div className="h-7 w-24 bg-zinc-800/40 rounded-full"></div>
          <div className="h-7 w-20 bg-zinc-800/40 rounded-full"></div>
          <div className="h-7 w-28 bg-zinc-800/40 rounded-full"></div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl bg-zinc-900/40 border border-white/[0.08] overflow-hidden"
          >
            <div className="h-9 bg-zinc-950/40 border-b border-white/[0.06]"></div>
            <div className="aspect-video w-full bg-zinc-800/30"></div>
            <div className="p-5 space-y-3.5">
              <div className="h-5 bg-zinc-800/50 rounded w-3/4"></div>
              <div className="h-3 bg-zinc-800/30 rounded w-full"></div>
              <div className="h-3 bg-zinc-800/30 rounded w-5/6"></div>
              <div className="pt-2 border-t border-white/[0.06] flex justify-between">
                <div className="h-4 w-24 bg-zinc-800/40 rounded"></div>
                <div className="h-4 w-16 bg-zinc-800/40 rounded"></div>
              </div>
              <div className="h-1.5 w-full bg-zinc-800/40 rounded-full"></div>
              <div className="pt-3 border-t border-white/[0.06] flex justify-between">
                <div className="h-5 w-16 bg-zinc-800/50 rounded"></div>
                <div className="h-7 w-24 bg-zinc-800/60 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
