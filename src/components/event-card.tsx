/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  Clock,
  Bookmark,
  Share2,
  ArrowRight,
  Flame,
} from "lucide-react";
import { toast } from "sonner";
import type { EventSummary } from "@/lib/types";

export type { EventSummary };

export interface EventCardProps {
  event: EventSummary;
  /** Pass true on the Home Page carousel so the pink FEATURED pill is hidden */
  hideFeaturedBadge?: boolean;
  priority?: boolean;
  onShare?: (event: EventSummary, e: React.MouseEvent) => void;
  onBookmark?: (eventId: string, e: React.MouseEvent) => void;
  isBookmarked?: boolean;
}

function formatHumanDate(dateStr?: string, timeStr?: string): string {
  try {
    if (!dateStr) return "OCT 16 • 9:00 AM";
    const [, month, day] = dateStr.split("-").map(Number);
    const months = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];
    const mName = months[(month || 10) - 1] || "OCT";

    let formattedTime = timeStr || "9:00 AM";
    if (timeStr && timeStr.includes(":")) {
      const parts = timeStr.trim().split(" ");
      if (parts.length === 1) {
        const [hStr, mStr] = parts[0].split(":");
        const h = parseInt(hStr, 10);
        if (!isNaN(h)) {
          const ampm = h >= 12 ? "PM" : "AM";
          const h12 = h % 12 || 12;
          formattedTime = `${h12}:${mStr} ${ampm}`;
        }
      }
    }
    return `${mName} ${day || 16} • ${formattedTime}`;
  } catch {
    return `${dateStr || "OCT 16"} • ${timeStr || "9:00 AM"}`;
  }
}

function getDeadlineRemaining(deadlineIso?: string): string | null {
  try {
    if (!deadlineIso) return null;
    const diffMs = new Date(deadlineIso).getTime() - Date.now();
    if (Number.isNaN(diffMs) || diffMs <= 0) return null;
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    if (days > 0) return `${days}D ${hours}H LEFT`;
    return `${Math.max(1, hours)}H LEFT`;
  } catch {
    return null;
  }
}

export function EventCard({
  event,
  hideFeaturedBadge = false,
  priority = false,
  onShare,
  onBookmark,
  isBookmarked: isBookmarkedProp,
}: EventCardProps) {
  const [internalBookmarked, setInternalBookmarked] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Synchronize internal bookmark state on mount from localStorage if uncontrolled
  useEffect(() => {
    if (isBookmarkedProp === undefined && typeof window !== "undefined") {
      try {
        const stored = JSON.parse(
          localStorage.getItem("nexusfest_bookmarks") || "[]"
        );
        if (Array.isArray(stored) && stored.includes(event.id)) {
          setInternalBookmarked(true);
        }
      } catch {
        // Ignore localStorage read errors
      }
    }
  }, [event.id, isBookmarkedProp]);

  const bookmarked =
    isBookmarkedProp !== undefined ? isBookmarkedProp : internalBookmarked;

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBookmark) {
      onBookmark(event.id, e);
      return;
    }
    const nextState = !internalBookmarked;
    setInternalBookmarked(nextState);
    if (nextState) {
      toast.success("Saved to your pass wallet", {
        description: `Added "${event.name}" to your saved schedule.`,
      });
      try {
        const stored = JSON.parse(
          localStorage.getItem("nexusfest_bookmarks") || "[]"
        );
        if (!stored.includes(event.id)) {
          localStorage.setItem(
            "nexusfest_bookmarks",
            JSON.stringify([...stored, event.id])
          );
        }
      } catch {
        // Ignore quota errors
      }
    } else {
      toast.info("Removed from saved passes");
      try {
        const stored = JSON.parse(
          localStorage.getItem("nexusfest_bookmarks") || "[]"
        );
        localStorage.setItem(
          "nexusfest_bookmarks",
          JSON.stringify(stored.filter((id: string) => id !== event.id))
        );
      } catch {
        // Ignore errors
      }
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) {
      onShare(event, e);
      return;
    }
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/events/${event.id}`;
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard", {
        description: `Direct link to ${event.name} is ready to share.`,
      });
    }
  };

  const totalSeats = event.total_seats || 100;
  const seatsFilled = event.seats_filled || 0;
  const seatsLeft = Math.max(0, totalSeats - seatsFilled);
  const isSoldOut =
    event.registration_status === "SOLD_OUT" ||
    seatsLeft === 0 ||
    event.event_status !== "ACTIVE";
  const isOpen = event.registration_status === "OPEN" && !isSoldOut;
  const isCriticalScarcity = isOpen && seatsLeft > 0 && seatsLeft <= 5;
  const isModerateScarcity = isOpen && seatsLeft > 5 && seatsLeft <= 12;

  // 10-segment pixel bar calculation
  const totalSegments = 10;
  const fillRatio =
    totalSeats > 0 ? Math.min(1, seatsFilled / totalSeats) : 1;
  const filledSegments = isSoldOut
    ? 10
    : Math.max(1, Math.round(fillRatio * totalSegments));

  const teamLabel =
    event.max_teamsize <= 1
      ? "SOLO"
      : event.min_teamsize === event.max_teamsize
      ? `TEAM OF ${event.max_teamsize}`
      : `TEAM OF ${event.min_teamsize}–${event.max_teamsize}`;

  const deadlineText = isOpen
    ? getDeadlineRemaining(event.registration_deadline)
    : null;

  return (
    <article className="group relative flex flex-col bg-[#140930] border-2 border-[#492191] hover:border-[#FFF3B8] transition-colors duration-150 shadow-[4px_4px_0px_#090318] hover:shadow-[4px_4px_0px_#E63E9B] rounded-none h-full">
      {/* Top Header Strip */}
      <div className="flex items-center justify-between gap-2 px-3.5 py-2 border-b-2 border-[#492191] bg-[#1B0E40]">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <span className="font-pixel-clean text-[11px] tracking-wider uppercase text-[#A5E8FF] truncate">
            {event.category}
          </span>
          <span className="text-[#492191]">•</span>
          <span className="font-pixel-clean text-[11px] uppercase text-[#D6E4FF]/75">
            {event.is_technical ? "TECH" : "CULTURE"}
          </span>

          {/* Featured Badge: Hidden on Home Page when hideFeaturedBadge={true} */}
          {!hideFeaturedBadge && event.is_featured && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#E63E9B] text-white font-pixel-clean text-[10px] uppercase tracking-wider border border-[#FFF3B8]">
              ✦ FEATURED
            </span>
          )}
        </div>

        {/* Quick Actions (>=44px touch target wrappers) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleBookmarkClick}
            aria-label={
              bookmarked
                ? `Remove ${event.name} bookmark`
                : `Bookmark ${event.name}`
            }
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-[#D6E4FF]/70 hover:text-[#FFF3B8] focus:outline-none focus:ring-2 focus:ring-[#FFF3B8] transition-colors cursor-pointer"
          >
            <Bookmark
              className={`w-4 h-4 ${
                bookmarked ? "fill-[#FFF3B8] text-[#FFF3B8]" : ""
              }`}
            />
          </button>
          <button
            type="button"
            onClick={handleShareClick}
            aria-label={`Share ${event.name}`}
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-[#D6E4FF]/70 hover:text-[#A5E8FF] focus:outline-none focus:ring-2 focus:ring-[#A5E8FF] transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cover Image with Mode & Status Badges */}
      <Link
        href={`/events/${event.id}`}
        tabIndex={-1}
        aria-hidden="true"
        className="relative aspect-[16/10] w-full overflow-hidden bg-[#1B0E40] border-b-2 border-[#492191] block focus:outline-none"
      >
        {event.cover_image_url && !imageError ? (
          <img
            src={event.cover_image_url}
            alt={event.cover_image_alt || event.name}
            loading={priority ? "eager" : "lazy"}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#1B0E40] text-zinc-400 text-xs">
            <span className="font-pixel-clean font-bold text-white text-sm mb-1 text-center">
              {event.name}
            </span>
            <span className="font-mono text-[10px] text-[#A5E8FF]">
              NEXUSFEST 2026
            </span>
          </div>
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140930] via-transparent to-black/30 opacity-80"
        />

        {/* Top-Left Mode & Format Pills */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
          <span className="px-2 py-0.5 bg-[#120829]/95 border border-[#A5E8FF] text-[#A5E8FF] font-pixel-clean text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_#090318]">
            {event.event_mode === "OFFLINE" ? "CAMPUS" : "ONLINE"}
          </span>
          <span className="px-2 py-0.5 bg-[#120829]/95 border border-[#FFD475] text-[#FFD475] font-pixel-clean text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_#090318]">
            {event.event_type === "WORKSHOP" ? "WORKSHOP" : "ARENA"}
          </span>
        </div>

        {/* Bottom-Right Live Status Pill */}
        <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none">
          {isOpen ? (
            <span className="px-2 py-0.5 bg-[#120829]/95 border border-[#FFF3B8] text-[#FFF3B8] font-pixel-clean text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_#090318]">
              OPEN NOW
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-[#E63E9B] border border-[#FFF3B8] text-white font-pixel-clean text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_#090318]">
              {isSoldOut ? "SOLD OUT" : "CLOSED"}
            </span>
          )}
        </div>
      </Link>

      {/* Optimized High-Conversion Card Body */}
      <div className="flex flex-col flex-1 justify-between p-4 gap-3.5">
        {/* 1. Title & Punchy 2-Line Blurb */}
        <div>
          <Link
            href={`/events/${event.id}`}
            className="focus:outline-none focus:ring-1 focus:ring-[#FFF3B8] block"
          >
            <h3 className="font-pixel-clean text-sm sm:text-[15px] leading-snug text-white uppercase tracking-wide line-clamp-2 min-h-[2.6rem] group-hover:text-[#FFF3B8] transition-colors">
              {event.name}
            </h3>
          </Link>
          <p className="mt-1.5 font-mono text-xs leading-relaxed text-[#D6E4FF]/80 line-clamp-2 min-h-[2.4rem]">
            {event.blurb ||
              "Join this flagship event at NexusFest 2026. Explore schedule, rules, and entry passes."}
          </p>
        </div>

        {/* 2. Consolidated Meta & Urgency Block */}
        <div className="space-y-2.5 pt-2.5 border-t border-[#492191]/70">
          {/* Single-line Human Date + Team Size */}
          <div className="flex items-center justify-between gap-2 text-[11px] font-pixel-clean">
            <span className="inline-flex items-center gap-1.5 text-[#A5E8FF]">
              <Calendar className="w-3.5 h-3.5 text-[#E63E9B] shrink-0" />
              {formatHumanDate(
                event.schedule_summary?.start_date,
                event.schedule_summary?.start_time
              )}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#D6E4FF]/90">
              <Users className="w-3.5 h-3.5 text-[#E63E9B] shrink-0" />
              {teamLabel}
            </span>
          </div>

          {/* Impulsive Scarcity + Inline Deadline Row */}
          <div className="bg-[#1B0E40] border border-[#492191] p-2.5 space-y-2">
            <div className="flex items-center justify-between gap-2 font-pixel-clean text-[11px]">
              {isSoldOut ? (
                <span className="text-[#FF6656] uppercase tracking-wider">
                  SOLD OUT
                </span>
              ) : isCriticalScarcity ? (
                <span className="inline-flex items-center gap-1 text-[#FF6656] uppercase tracking-wider font-bold">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF6656] animate-pulse" />
                  <Flame className="w-3.5 h-3.5 fill-[#FF6656] text-[#FF6656] shrink-0" />
                  ONLY {seatsLeft} {seatsLeft === 1 ? "SPOT" : "SPOTS"} LEFT
                </span>
              ) : isModerateScarcity ? (
                <span className="inline-flex items-center gap-1 text-[#FFD475] uppercase tracking-wider">
                  <span>⚡</span>
                  {seatsLeft} SPOTS LEFT
                </span>
              ) : (
                <span className="text-[#A5E8FF] uppercase tracking-wider">
                  {seatsLeft} SPOTS LEFT
                </span>
              )}

              {deadlineText ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-[#FFF3B8]/90 uppercase shrink-0">
                  <Clock className="w-3 h-3 text-[#FFF3B8]" />
                  <span>⏳ {deadlineText}</span>
                </span>
              ) : (
                <span className="text-[10px] text-[#D6E4FF]/50 uppercase shrink-0">
                  {isSoldOut ? "REGISTRATION CLOSED" : "CLOSED"}
                </span>
              )}
            </div>

            {/* 10-Segment Pixel Meter */}
            <div
              className="grid grid-cols-10 gap-1"
              role="progressbar"
              aria-valuenow={seatsFilled}
              aria-valuemin={0}
              aria-valuemax={totalSeats}
              aria-label={`${seatsLeft} spots left out of ${totalSeats}`}
            >
              {Array.from({ length: totalSegments }).map((_, idx) => {
                const isFilled = idx < filledSegments;
                let activeColor = "bg-[#A5E8FF]";
                if (isSoldOut) activeColor = "bg-[#492191]/60";
                else if (isCriticalScarcity || fillRatio >= 0.8)
                  activeColor = "bg-[#E63E9B]";
                else if (isModerateScarcity || fillRatio >= 0.5)
                  activeColor = "bg-[#FFAE59]";

                return (
                  <span
                    key={idx}
                    className={`h-2 rounded-none transition-colors ${
                      isFilled
                        ? activeColor
                        : "bg-[#120829] border border-[#492191]/50"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. High-Conversion Footer Bar (Price + Impulsive Action Button) */}
        <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-[#492191]/70">
          <div>
            {event.price === 0 ? (
              <span className="font-pixel-block text-sm sm:text-base text-[#FFF3B8] tracking-wide">
                FREE
              </span>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="font-pixel-block text-sm sm:text-base text-white">
                  ₹{event.price}
                </span>
                <span className="font-pixel-clean text-[10px] text-[#D6E4FF]/70 uppercase">
                  /{event.is_per_head ? "PERSON" : "TEAM"}
                </span>
              </div>
            )}
          </div>

          <Link
            href={`/events/${event.id}`}
            className={`inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 font-pixel-clean text-xs uppercase tracking-wider rounded-none border-2 transition-all select-none active:translate-x-0.5 active:translate-y-0.5 ${
              isCriticalScarcity
                ? "bg-[#E63E9B] text-white border-[#FFF3B8] hover:bg-[#FFF3B8] hover:text-[#120829] shadow-[3px_3px_0px_#090318]"
                : isOpen
                ? "bg-[#231154] text-[#FFF3B8] border-[#FFF3B8] hover:bg-[#FFF3B8] hover:text-[#120829] shadow-[3px_3px_0px_#090318]"
                : "bg-[#140930] text-[#D6E4FF]/70 border-[#492191] hover:border-[#A5E8FF] hover:text-white"
            }`}
          >
            <span>
              {isCriticalScarcity
                ? "CLAIM SPOT"
                : isOpen
                ? "REGISTER NOW"
                : "VIEW INFO"}
            </span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
        </div>
      </div>
    </article>
  );
}
