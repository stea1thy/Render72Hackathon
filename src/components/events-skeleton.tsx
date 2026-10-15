import React from "react";

export function EventsSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse" aria-label="Loading events catalog">
      {/* Control Deck Skeleton */}
      <div className="p-6 bg-[#10121a] border border-[#232635] space-y-4">
        <div className="h-10 bg-[#171924] w-full"></div>
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-20 bg-[#171924]"></div>
          <div className="h-6 w-24 bg-[#171924]"></div>
          <div className="h-6 w-20 bg-[#171924]"></div>
          <div className="h-6 w-28 bg-[#171924]"></div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col bg-[#10121a] border border-[#232635] overflow-hidden"
          >
            <div className="h-8 bg-[#0c0d13] border-b border-[#232635]"></div>
            <div className="aspect-video w-full bg-[#171924]"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-[#171924] w-3/4"></div>
              <div className="h-3 bg-[#171924] w-full"></div>
              <div className="h-3 bg-[#171924] w-5/6"></div>
              <div className="pt-2 border-t border-[#232635] flex justify-between">
                <div className="h-4 w-24 bg-[#171924]"></div>
                <div className="h-4 w-16 bg-[#171924]"></div>
              </div>
              <div className="h-1.5 w-full bg-[#171924]"></div>
              <div className="pt-3 border-t border-[#232635] flex justify-between">
                <div className="h-5 w-16 bg-[#171924]"></div>
                <div className="h-7 w-20 bg-[#171924]"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
