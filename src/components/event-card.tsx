"use client";

import React, { useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Users,
  MapPin,
  ArrowUpRight,
  Bookmark,
  Share2,
  Check,
  AlertCircle,
  Clock,
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const rafId = useRef<number | null>(null);

  // Spotlight hover via requestAnimationFrame
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.setProperty("--spotlight-x", `${x}px`);
        cardRef.current.style.setProperty("--spotlight-y", `${y}px`);
      }
    });
  }, []);

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
      toast.success("COORDINATES COPIED", {
        description: `Direct link to ${event.name} copied to clipboard.`,
      });
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked) {
      toast.success("EVENT SAVED TO HUB", {
        description: `Added "${event.name}" to your offline itinerary.`,
      });
      try {
        const stored = JSON.parse(localStorage.getItem("nexusfest_bookmarks") || "[]");
        if (!stored.includes(event.id)) {
          localStorage.setItem("nexusfest_bookmarks", JSON.stringify([...stored, event.id]));
        }
      } catch {}
    } else {
      toast.info("EVENT REMOVED FROM HUB");
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
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col bg-[#10121a] border border-[#232635] hover:border-[#00ff66] transition-colors spotlight-card shadow-brutal-zinc hover:shadow-brutal-acid ${
        isCompleted ? "opacity-75 grayscale-[20%]" : ""
      }`}
    >
      {/* Top Banner Tag Line */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#232635] bg-[#0c0d13] text-[10px] font-mono">
        <div className="flex items-center gap-2 truncate">
          <span className="text-[#00ff66] font-bold">[{event.category.toUpperCase()}]</span>
          <span className="text-[#555c70]">|</span>
          <span className="text-[#8b93a7]">
            {event.is_technical ? "TECHNICAL" : "CULTURAL"}
          </span>
          {event.is_featured && (
            <span className="px-1 py-0.2 bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 font-bold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> FEATURED
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleBookmark}
            type="button"
            className="p-1 text-[#8b93a7] hover:text-[#00ff66] transition-colors"
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark event"}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                isBookmarked ? "fill-[#00ff66] text-[#00ff66]" : ""
              }`}
            />
          </button>
          <button
            onClick={handleShare}
            type="button"
            className="p-1 text-[#8b93a7] hover:text-[#00f0ff] transition-colors"
            aria-label="Share event link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cover Image Container */}
      <Link
        href={`/events/${event.id}`}
        className="relative aspect-video w-full overflow-hidden bg-[#06070a] block focus-visible:outline-none"
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
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            style={{ viewTransitionName: `event-cover-${event.id}` }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-cyber-grid text-[#8b93a7] font-mono text-xs">
            <span className="text-[#00ff66] font-bold text-lg mb-1">[NF_IMAGE]</span>
            <span>{event.name}</span>
          </div>
        )}

        {/* Floating Mode & Status Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          <span
            className={`px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider border ${
              event.event_mode === "ONLINE"
                ? "bg-[#090a0f]/90 text-[#00f0ff] border-[#00f0ff]"
                : "bg-[#090a0f]/90 text-[#f4f5f8] border-[#8b93a7]"
            }`}
          >
            {event.event_mode}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider bg-[#090a0f]/90 text-[#8b93a7] border border-[#232635]">
            {event.event_type}
          </span>
        </div>

        {/* Registration status banner on image */}
        <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
          {isCompleted ? (
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#171924]/90 text-[#8b93a7] border border-[#232635]">
              COMPLETED
            </span>
          ) : isSoldOut ? (
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#ff3344] text-[#090a0f]">
              SOLD OUT
            </span>
          ) : isRegOpen ? (
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#00ff66] text-[#090a0f]">
              REG OPEN
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#ffb800] text-[#090a0f]">
              CLOSED
            </span>
          )}
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 space-y-3">
        {/* Title */}
        <Link
          href={`/events/${event.id}`}
          className="focus-visible:outline-none"
        >
          <h2
            className="font-display font-bold text-lg text-[#f4f5f8] group-hover:text-[#00ff66] transition-colors line-clamp-1"
            style={{ viewTransitionName: `event-title-${event.id}` }}
          >
            {event.name}
          </h2>
        </Link>

        {/* Blurb */}
        <p className="font-sans text-xs text-[#8b93a7] line-clamp-2 leading-relaxed flex-1">
          {event.blurb || "No detailed blurb provided for this module."}
        </p>

        {/* Event Schedule Info */}
        <div className="pt-2 border-t border-[#232635] flex items-center justify-between text-xs font-mono text-[#8b93a7]">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#00ff66]" aria-hidden="true" />
            <span>
              {event.schedule_summary?.start_date || "TBA"} • {event.schedule_summary?.start_time || ""}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#00f0ff]" aria-hidden="true" />
            <span>
              {event.min_teamsize === 1 && event.max_teamsize === 1
                ? "SOLO"
                : `SQUAD (${event.min_teamsize}-${event.max_teamsize})`}
            </span>
          </div>
        </div>

        {/* Capacity / Seats Left Gauge */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-[#8b93a7]">
              SEATS: {seatsFilled}/{totalSeats}
            </span>
            <span
              className={
                percentFilled >= 90
                  ? "text-[#ff3344] font-bold"
                  : percentFilled >= 70
                  ? "text-[#ffb800]"
                  : "text-[#00ff66]"
              }
            >
              {isSoldOut ? "CAPACITY FULL" : `${seatsLeft} REMAINING`}
            </span>
          </div>
          <div
            className="w-full h-1.5 bg-[#171924] overflow-hidden"
            role="progressbar"
            aria-valuenow={percentFilled}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${seatsFilled} of ${totalSeats} seats filled`}
          >
            <div
              className={`h-full transition-all duration-500 ${
                percentFilled >= 90
                  ? "bg-[#ff3344]"
                  : percentFilled >= 70
                  ? "bg-[#ffb800]"
                  : "bg-[#00ff66]"
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
        <div className="pt-3 border-t border-[#232635] flex items-center justify-between">
          <div className="font-mono">
            <span className="text-base font-extrabold text-[#f4f5f8]">
              {event.price === 0 ? "FREE" : `₹${event.price}`}
            </span>
            {event.price > 0 && (
              <span className="text-[10px] text-[#8b93a7] ml-1">
                /{event.is_per_head ? "HEAD" : "TEAM"}
              </span>
            )}
          </div>

          <Link
            href={`/events/${event.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold bg-[#171924] text-[#00ff66] border border-[#232635] hover:border-[#00ff66] hover:bg-[#00ff66] hover:text-[#090a0f] transition-all shadow-brutal-sm"
          >
            <span>DETAILS</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
