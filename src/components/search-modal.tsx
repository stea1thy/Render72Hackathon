"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ArrowRight,
  Tag,
  Calendar,
  Sparkles,
  Compass,
  Flame,
} from "lucide-react";
import type { EventSummary } from "@/lib/types";

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventSummary[];
}

type QuickFilter = "ALL" | "FREE" | "OPEN" | "TECH" | "CULTURE" | "WORKSHOP";

export function SearchModal({ isOpen, onClose, events }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<QuickFilter>("ALL");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Global Cmd+K / Ctrl+K & Escape handling + body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Auto-focus input when opened
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 20);

    return () => {
      document.body.style.overflow = prevOverflow;
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Filter events by query + quick filter chip
  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();

    return events.filter((ev) => {
      const seatsLeft = Math.max(0, ev.total_seats - ev.seats_filled);
      const isOpenStatus =
        ev.registration_status === "OPEN" &&
        ev.event_status === "ACTIVE" &&
        seatsLeft > 0;

      if (activeFilter === "FREE" && ev.price !== 0) return false;
      if (activeFilter === "OPEN" && !isOpenStatus) return false;
      if (activeFilter === "TECH" && !ev.is_technical) return false;
      if (activeFilter === "CULTURE" && ev.is_technical) return false;
      if (activeFilter === "WORKSHOP" && ev.event_type !== "WORKSHOP") return false;

      if (!q) return true;

      return (
        ev.name.toLowerCase().includes(q) ||
        ev.category.toLowerCase().includes(q) ||
        ev.blurb.toLowerCase().includes(q) ||
        ev.tags?.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [events, query, activeFilter]);

  // Reset highlighted index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeFilter]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredEvents.length > 0 ? (prev + 1) % filteredEvents.length : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredEvents.length > 0
            ? (prev - 1 + filteredEvents.length) % filteredEvents.length
            : 0
        );
      } else if (e.key === "Enter" && filteredEvents[selectedIndex]) {
        e.preventDefault();
        const target = filteredEvents[selectedIndex];
        onClose();
        router.push(`/events/${target.id}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredEvents, selectedIndex, onClose, router]);

  const filterChips: { id: QuickFilter; label: string }[] = [
    { id: "ALL", label: `ALL (${events.length})` },
    { id: "OPEN", label: "OPEN NOW" },
    { id: "FREE", label: "FREE ENTRY" },
    { id: "TECH", label: "TECH" },
    { id: "CULTURE", label: "CULTURAL" },
    { id: "WORKSHOP", label: "WORKSHOPS" },
  ];

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Search NexusFest Events"
    >
      {/* 1. Dimmed & Blurred Full-Screen Backdrop so Hero/Page Fades into Background */}
      <div
        className="fixed inset-0 bg-[#090318]/80 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Large Dead-Center Search Box (max-w-3xl) */}
      <div
        className="relative z-10 w-full max-w-3xl bg-[#140930] border-2 border-[#FFF3B8] shadow-[8px_8px_0px_#090318] rounded-none flex flex-col max-h-[82vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header & Search Input Bar */}
        <div className="p-4 sm:p-5 bg-[#1B0E40] border-b-2 border-[#492191] space-y-3.5">
          <div className="flex items-center gap-3">
            {/* Recessed Input Box */}
            <div className="flex-1 flex items-center gap-3 h-12 sm:h-14 px-4 bg-[#120829] border-2 border-[#492191] focus-within:border-[#A5E8FF] transition-colors">
              <Search className="w-5 h-5 text-[#A5E8FF] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events, workshops, robotics, AI, music..."
                className="w-full bg-transparent font-mono text-sm sm:text-base text-white placeholder:text-[#D6E4FF]/45 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="px-2 py-1 bg-[#1B0E40] border border-[#492191] hover:border-[#FFF3B8] font-pixel-clean text-[10px] text-[#D6E4FF] uppercase shrink-0 cursor-pointer"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Tactile 44x44px Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="inline-flex items-center justify-center min-w-[48px] min-h-[48px] sm:min-w-[56px] sm:min-h-[56px] bg-[#120829] border-2 border-[#492191] hover:border-[#E63E9B] text-[#D6E4FF] hover:text-white shadow-[3px_3px_0px_#090318] transition-colors rounded-none shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Instant Filter Chips Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {filterChips.map((chip) => {
              const active = activeFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setActiveFilter(chip.id)}
                  className={`px-3 py-1.5 font-pixel-clean text-[11px] uppercase tracking-wider border transition-all shrink-0 rounded-none cursor-pointer ${
                    active
                      ? "bg-[#E63E9B] text-white border-[#FFF3B8] shadow-[2px_2px_0px_#090318]"
                      : "bg-[#120829] text-[#D6E4FF]/80 border-[#492191] hover:border-[#A5E8FF] hover:text-white"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Results Area (With Custom Dark Pixel Scrollbar — No Grey Browser Scrollbar) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#120829] [&::-webkit-scrollbar-thumb]:bg-[#492191] hover:[&::-webkit-scrollbar-thumb]:bg-[#E63E9B]">
          {/* Quick Navigation Strip (Shown when query is empty) */}
          {!query.trim() && (
            <div>
              <div className="font-pixel-clean text-[11px] uppercase tracking-widest text-[#A5E8FF] mb-2.5">
                QUICK SHORTCUTS
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push("/events");
                  }}
                  className="flex items-center justify-between p-3 bg-[#1B0E40] border border-[#492191] hover:border-[#FFF3B8] text-left group transition-all shadow-[3px_3px_0px_#090318] cursor-pointer"
                >
                  <span className="inline-flex items-center gap-2.5 font-pixel-clean text-xs text-white group-hover:text-[#FFF3B8] uppercase">
                    <Compass className="w-4 h-4 text-[#E63E9B] shrink-0" />
                    ALL EVENTS CATALOG
                  </span>
                  <span className="font-pixel-clean text-[10px] text-[#FFF3B8] uppercase">
                    /EVENTS →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push("/events?price=free");
                  }}
                  className="flex items-center justify-between p-3 bg-[#1B0E40] border border-[#492191] hover:border-[#A5E8FF] text-left group transition-all shadow-[3px_3px_0px_#090318] cursor-pointer"
                >
                  <span className="inline-flex items-center gap-2.5 font-pixel-clean text-xs text-white group-hover:text-[#A5E8FF] uppercase">
                    <Tag className="w-4 h-4 text-[#A5E8FF] shrink-0" />
                    FREE REGISTRATION EVENTS
                  </span>
                  <span className="font-pixel-clean text-[10px] text-[#A5E8FF] uppercase">
                    FREE ONLY →
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Matching Events List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-pixel-clean text-[11px] uppercase tracking-widest text-[#A5E8FF]">
                {query.trim()
                  ? `MATCHING EVENTS (${filteredEvents.length})`
                  : `FESTIVAL EVENTS (${filteredEvents.length})`}
              </span>
              <span className="font-mono text-[11px] text-[#D6E4FF]/60 hidden sm:inline">
                Click any event to inspect rules &amp; register
              </span>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="py-12 px-4 text-center bg-[#120829] border border-[#492191]">
                <p className="font-pixel-clean text-sm text-white uppercase">
                  NO MATCHING EVENTS FOUND
                </p>
                <p className="mt-1.5 font-mono text-xs text-[#D6E4FF]/70">
                  Try clearing your search term or switching the filter chip above.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActiveFilter("ALL");
                  }}
                  className="mt-4 px-4 py-2 bg-[#1B0E40] border border-[#FFF3B8] font-pixel-clean text-xs text-[#FFF3B8] uppercase cursor-pointer"
                >
                  RESET SEARCH
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredEvents.map((ev, index) => {
                  const isSelected = index === selectedIndex;
                  const seatsLeft = Math.max(0, ev.total_seats - ev.seats_filled);
                  const isSoldOut =
                    ev.registration_status === "SOLD_OUT" ||
                    seatsLeft === 0 ||
                    ev.event_status !== "ACTIVE";
                  const isLowSeats = !isSoldOut && seatsLeft <= 5;

                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => {
                        onClose();
                        router.push(`/events/${ev.id}`);
                      }}
                      className={`w-full flex items-center justify-between gap-4 p-3.5 text-left border transition-all rounded-none cursor-pointer ${
                        isSelected
                          ? "bg-[#231154] border-[#FFF3B8] shadow-[4px_4px_0px_#090318]"
                          : "bg-[#1B0E40]/80 border-[#492191] hover:border-[#A5E8FF]"
                      }`}
                    >
                      {/* Left Column: Category + Name + Blurb/Schedule */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-pixel-clean text-[10px] uppercase tracking-wider text-[#A5E8FF]">
                            {ev.category}
                          </span>
                          <span className="text-[#492191]">•</span>
                          <span className="font-pixel-clean text-[10px] uppercase text-[#D6E4FF]/70">
                            {ev.event_mode === "OFFLINE" ? "CAMPUS" : "ONLINE"}
                          </span>
                          {ev.is_featured && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#E63E9B]/20 border border-[#E63E9B] font-pixel-clean text-[9px] text-[#FFF3B8] uppercase">
                              <Sparkles className="w-2.5 h-2.5 text-[#E63E9B]" />
                              FLAGSHIP
                            </span>
                          )}
                        </div>

                        <div className="font-pixel-clean text-sm sm:text-[15px] text-white uppercase tracking-wide truncate">
                          {ev.name}
                        </div>

                        <div className="mt-1 flex items-center gap-3 font-mono text-xs text-[#D6E4FF]/75 truncate">
                          <span className="inline-flex items-center gap-1 shrink-0 text-[#D6E4FF]/90">
                            <Calendar className="w-3 h-3 text-[#E63E9B]" />
                            {ev.schedule_summary?.start_date || "OCT 16"} •{" "}
                            {ev.schedule_summary?.start_time || "09:00"}
                          </span>
                          <span className="truncate opacity-80">{ev.blurb}</span>
                        </div>
                      </div>

                      {/* Right Column: Price + Urgency Pill + Arrow */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="font-pixel-block text-xs sm:text-sm text-[#FFF3B8]">
                            {ev.price === 0 ? "FREE" : `₹${ev.price}`}
                          </div>
                          <div className="mt-1">
                            {isSoldOut ? (
                              <span className="font-pixel-clean text-[10px] text-[#FF6656] uppercase">
                                SOLD OUT
                              </span>
                            ) : isLowSeats ? (
                              <span className="inline-flex items-center gap-1 font-pixel-clean text-[10px] text-[#FF6656] uppercase">
                                <Flame className="w-3 h-3 fill-[#FF6656]" />
                                {seatsLeft} LEFT!
                              </span>
                            ) : (
                              <span className="font-pixel-clean text-[10px] text-[#A5E8FF] uppercase">
                                {seatsLeft} SPOTS
                              </span>
                            )}
                          </div>
                        </div>

                        <div
                          className={`w-8 h-8 flex items-center justify-center border ${
                            isSelected
                              ? "bg-[#FFF3B8] text-[#120829] border-[#FFF3B8]"
                              : "bg-[#120829] text-[#D6E4FF] border-[#492191]"
                          }`}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Clean Footer Bar */}
        <div className="px-4 sm:px-5 py-2.5 bg-[#120829] border-t-2 border-[#492191] flex items-center justify-between font-pixel-clean text-[10px] text-[#D6E4FF]/70 uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span>↑↓ NAVIGATE</span>
            <span>↵ OPEN EVENT</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-[#FFF3B8] transition-colors cursor-pointer"
          >
            ESC TO CLOSE
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
