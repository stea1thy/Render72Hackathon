"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Users,
  ArrowRight,
  Bookmark,
  Share2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { CountdownBadge } from "./countdown-badge";
import type { EventSummary } from "@/lib/types";

interface EventCardProps {
  event: EventSummary;
  priority?: boolean;
}

export function EventCard({ event, priority = false }: EventCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const totalSeats = event.total_seats || 100;
  const seatsFilled = event.seats_filled || 0;
  const seatsLeft = Math.max(0, totalSeats - seatsFilled);
  const percentFilled = Math.min(100, Math.round((seatsFilled / totalSeats) * 100));

  const isSoldOut = event.registration_status === "SOLD_OUT" || seatsLeft === 0;
  const isRegOpen = event.registration_status === "OPEN" && !isSoldOut;
  const isCompleted = event.event_status === "COMPLETED";

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/events/${event.id}`;
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard", {
        description: `Direct link to ${event.name} is ready to share.`,
      });
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked) {
      toast.success("Saved to your pass wallet", {
        description: `Added "${event.name}" to your saved schedule.`,
      });
      try {
        const stored = JSON.parse(localStorage.getItem("nexusfest_bookmarks") || "[]");
        if (!stored.includes(event.id)) {
          localStorage.setItem("nexusfest_bookmarks", JSON.stringify([...stored, event.id]));
        }
      } catch {}
    } else {
      toast.info("Removed from saved passes");
      try {
        const stored = JSON.parse(localStorage.getItem("nexusfest_bookmarks") || "[]");
        localStorage.setItem(
          "nexusfest_bookmarks",
          JSON.stringify(stored.filter((id: string) => id !== event.id))
        );
      } catch {}
    }
  };

  return (
    <article
      className={`group relative flex flex-col rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/80 border border-white/[0.08] hover:border-white/20 transition-all duration-300 overflow-hidden shadow-xl ${
        isCompleted ? "opacity-75" : ""
      }`}
    >
      {/* Top Banner Category & Action Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-zinc-950/40 text-xs">
        <div className="flex items-center gap-2 truncate">
          <span className="font-mono text-[11px] text-emerald-400 font-medium">
            {event.category}
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-[11px] text-zinc-400 font-mono">
            {event.is_technical ? "Technical" : "Cultural"}
          </span>
          {event.is_featured && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-medium flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Featured
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleBookmark}
            type="button"
            className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark event"}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                isBookmarked ? "fill-emerald-400 text-emerald-400" : ""
              }`}
            />
          </button>
          <button
            onClick={handleShare}
            type="button"
            className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
            aria-label="Share event link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cover Image Container */}
      <Link
        href={`/events/${event.id}`}
        className="relative aspect-video w-full overflow-hidden bg-zinc-950 block focus-visible:outline-none"
        tabIndex={-1}
        aria-hidden="true"
      >
        {event.cover_image_url && !imageError ? (
          <Image
            src={event.cover_image_url}
            alt={event.cover_image_alt || event.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
            style={{ viewTransitionName: `event-cover-${event.id}` }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-zinc-950 text-zinc-500 text-xs">
            <span className="font-semibold text-zinc-400 text-sm mb-1">{event.name}</span>
            <span>NexusFest 2026</span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium backdrop-blur-md border ${
              event.event_mode === "ONLINE"
                ? "bg-zinc-950/80 text-blue-400 border-blue-500/30"
                : "bg-zinc-950/80 text-zinc-200 border-white/15"
            }`}
          >
            {event.event_mode === "ONLINE" ? "Online" : "Campus Arena"}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono text-zinc-300 bg-zinc-950/80 border border-white/10 backdrop-blur-md">
            {event.event_type === "WORKSHOP" ? "Workshop" : "Competition"}
          </span>
        </div>

        {/* Status Pill on Image */}
        <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none">
          {isCompleted ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-zinc-900/90 text-zinc-400 border border-white/10 backdrop-blur-md">
              Completed
            </span>
          ) : isSoldOut ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30 backdrop-blur-md">
              Sold Out
            </span>
          ) : isRegOpen ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
              Open Now
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
              Closed
            </span>
          )}
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5 space-y-3.5">
        {/* Title */}
        <Link
          href={`/events/${event.id}`}
          className="focus-visible:outline-none"
        >
          <h2
            className="font-bold text-lg text-white group-hover:text-zinc-200 transition-colors line-clamp-1 tracking-tight"
            style={{ viewTransitionName: `event-title-${event.id}` }}
          >
            {event.name}
          </h2>
        </Link>

        {/* Blurb */}
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed flex-1">
          {event.blurb || "Join this event at NexusFest 2026. Explore schedule, rules, and entry passes."}
        </p>

        {/* Event Schedule Info */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
            <span>
              {event.schedule_summary?.start_date || "Oct 2026"} • {event.schedule_summary?.start_time || "10:00"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
            <span>
              {event.min_teamsize === 1 && event.max_teamsize === 1
                ? "Solo"
                : `Team (${event.min_teamsize}–${event.max_teamsize})`}
            </span>
          </div>
        </div>

        {/* Capacity / Seats Left Gauge */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-zinc-400">
              Capacity: {seatsFilled} / {totalSeats}
            </span>
            <span
              className={
                percentFilled >= 90
                  ? "text-rose-400 font-medium"
                  : percentFilled >= 70
                  ? "text-amber-400"
                  : "text-emerald-400"
              }
            >
              {isSoldOut ? "Full" : `${seatsLeft} seats left`}
            </span>
          </div>
          <div
            className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={percentFilled}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${seatsFilled} of ${totalSeats} seats filled`}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentFilled >= 90
                  ? "bg-rose-500"
                  : percentFilled >= 70
                  ? "bg-amber-500"
                  : "bg-emerald-400"
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        </div>

        {/* Deadline Ticker (if active and upcoming) */}
        {isRegOpen && event.registration_deadline && (
          <div className="pt-1 flex items-center justify-between">
            <CountdownBadge deadlineIso={event.registration_deadline} />
          </div>
        )}

        {/* Price & Primary CTA */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <div className="font-mono">
            <span className="text-base font-bold text-white">
              {event.price === 0 ? "Free" : `₹${event.price}`}
            </span>
            {event.price > 0 && (
              <span className="text-[11px] text-zinc-500 ml-1">
                /{event.is_per_head ? "person" : "team"}
              </span>
            )}
          </div>

          <Link
            href={`/events/${event.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-white text-zinc-200 hover:text-zinc-950 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
