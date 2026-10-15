"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EventCard } from "./event-card";
import { useInView, REVEAL_HIDDEN, REVEAL_SHOWN, REVEAL_TRANSITION } from "./ScrollReveal";
import type { EventSummary } from "@/lib/types";

export interface FeaturedEventsCarouselProps {
  events: EventSummary[];
  onShare?: (event: EventSummary, e: React.MouseEvent) => void;
  onBookmark?: (eventId: string, e: React.MouseEvent) => void;
  bookmarkedIds?: Set<string>;
}

export function FeaturedEventsCarousel({
  events,
  onShare,
  onBookmark,
  bookmarkedIds,
}: FeaturedEventsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const { ref: trackRef, isVisible: trackInView } = useInView<HTMLDivElement>();

  // Responsive visible card count:
  // Desktop (>=1024px): 3 cards
  // Tablet (768px–1023px): 2 cards
  // Mobile (<768px): 1 card
  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;
      let nextVisible = 3;
      if (width >= 1024) {
        nextVisible = 3;
      } else if (width >= 768) {
        nextVisible = 2;
      } else {
        nextVisible = 1;
      }
      setVisibleCards(nextVisible);
      setCurrentIndex((prev) => Math.min(prev, Math.max(0, events.length - nextVisible)));
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, [events.length]);

  const maxIndex = Math.max(0, events.length - visibleCards);
  const safeCurrentIndex = Math.min(currentIndex, maxIndex);

  // Step 1 card at a time
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  // Touch swipe handlers for mobile/tablet ergonomics
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY =
      touchStartY !== null ? e.changedTouches[0].clientY - touchStartY : 0;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX > 0) handlePrev();
      else handleNext();
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  if (!events || events.length === 0) return null;

  return (
    <div
      className="relative w-full focus:outline-none"
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Flagship Challenges Carousel"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          handlePrev();
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          handleNext();
        }
      }}
    >
      {/* Top Carousel Controls Bar */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <span className="font-pixel-clean text-xs uppercase tracking-wider text-[#A5E8FF]">
            SHOWING {Math.min(events.length, safeCurrentIndex + 1)}–
            {Math.min(events.length, safeCurrentIndex + visibleCards)} OF{" "}
            {events.length} FLAGSHIP EVENTS
          </span>
        </div>

        {/* Left / Right 1-Card-Step Pixel Buttons (>= 44x44px touch targets) */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrev}
            disabled={safeCurrentIndex === 0}
            aria-label="Previous flagship event"
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] bg-[#1B0E40] border-2 border-[#492191] text-[#FFF3B8] hover:border-[#FFF3B8] hover:bg-[#231154] disabled:opacity-40 disabled:pointer-events-none shadow-[4px_4px_0px_#090318] active:translate-x-[2px] active:translate-y-[2px] transition-all rounded-none cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={safeCurrentIndex >= maxIndex}
            aria-label="Next flagship event"
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] bg-[#1B0E40] border-2 border-[#492191] text-[#FFF3B8] hover:border-[#FFF3B8] hover:bg-[#231154] disabled:opacity-40 disabled:pointer-events-none shadow-[4px_4px_0px_#090318] active:translate-x-[2px] active:translate-y-[2px] transition-all rounded-none cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Strictly Clipped Horizontal Track (Zero Page Horizontal Scroll) */}
      <div
        ref={trackRef}
        className="overflow-hidden w-full pb-2 pr-1"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            gap: "24px",
            transform: `translate3d(calc(-${safeCurrentIndex} * ((100% + 24px) / ${visibleCards})), 0, 0)`,
          }}
        >
          {events.map((event, idx) => (
            <div
              key={event.id}
              style={{
                flex: `0 0 calc((100% - ${(visibleCards - 1) * 24}px) / ${visibleCards})`,
                maxWidth: `calc((100% - ${(visibleCards - 1) * 24}px) / ${visibleCards})`,
              }}
              className="min-w-0"
            >
              {/* Stagger-pop the initially visible cards when the track scrolls into view */}
              <div
                style={{
                  transitionDelay:
                    trackInView && idx < visibleCards ? `${idx * 90}ms` : "0ms",
                }}
                className={`h-full ${REVEAL_TRANSITION} ${
                  trackInView ? REVEAL_SHOWN : REVEAL_HIDDEN["pop-up"]
                }`}
              >
                <EventCard
                  event={event}
                  priority={idx < 3}
                  hideFeaturedBadge={true}
                  onShare={onShare}
                  onBookmark={onBookmark}
                  isBookmarked={bookmarkedIds?.has(event.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Pixel Step Indicators */}
      {maxIndex > 0 && (
        <div
          className="flex items-center justify-center gap-2 mt-5"
          role="tablist"
          aria-label="Carousel positions"
        >
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => {
            const isActive = idx === safeCurrentIndex;
            return (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setCurrentIndex(idx)}
                className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] -mx-2 focus:outline-none cursor-pointer"
              >
                <span
                  className={`block h-2.5 transition-all rounded-none border ${
                    isActive
                      ? "w-7 bg-[#E63E9B] border-[#FFF3B8] shadow-[2px_2px_0px_#090318]"
                      : "w-2.5 bg-[#1B0E40] border-[#492191] hover:border-[#A5E8FF]"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
