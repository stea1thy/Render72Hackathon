import React from "react";

export function EventsSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse" aria-label="Loading events catalog">
      {/* Control Deck Skeleton */}
      <div className="p-5 rounded-none bg-[#1B0E40]/90 border-[3px] border-[#6B2BB5] shadow-[6px_6px_0px_#090318] space-y-4">
        <div className="h-10 bg-[#0E0624] border-2 border-[#492191] rounded-none w-full"></div>
        <div className="flex gap-2 pt-2">
          <div className="h-7 w-20 bg-[#12072B] border-2 border-[#492191] rounded-none"></div>
          <div className="h-7 w-24 bg-[#12072B] border-2 border-[#492191] rounded-none"></div>
          <div className="h-7 w-20 bg-[#12072B] border-2 border-[#492191] rounded-none"></div>
          <div className="h-7 w-28 bg-[#12072B] border-2 border-[#492191] rounded-none"></div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-none bg-[#1B0E40] border-[3px] border-[#492191] shadow-[6px_6px_0px_#090318] overflow-hidden"
          >
            <div className="h-9 bg-[#140930] border-b-2 border-[#38208C]"></div>
            <div className="aspect-video w-full bg-[#0E0624]"></div>
            <div className="p-5 space-y-3.5">
              <div className="h-5 bg-[#38208C]/40 rounded-none w-3/4"></div>
              <div className="h-3 bg-[#38208C]/30 rounded-none w-full"></div>
              <div className="h-3 bg-[#38208C]/30 rounded-none w-5/6"></div>
              <div className="pt-2 border-t-2 border-[#38208C]/30 flex justify-between">
                <div className="h-4 w-24 bg-[#38208C]/40 rounded-none"></div>
                <div className="h-4 w-16 bg-[#38208C]/40 rounded-none"></div>
              </div>
              <div className="h-2 w-full bg-[#0D0521] border border-white/10 rounded-none"></div>
              <div className="pt-3 border-t-2 border-[#38208C]/30 flex justify-between">
                <div className="h-5 w-16 bg-[#38208C]/40 rounded-none"></div>
                <div className="h-7 w-24 bg-[#140930] border-2 border-[#38208C] rounded-none"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
