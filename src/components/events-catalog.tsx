"use client";

import React, { useState, useMemo, useEffect, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { EventCard } from "./event-card";
import type { EventSummary } from "@/lib/types";

interface EventsCatalogProps {
  initialEvents: EventSummary[];
}

export function EventsCatalog({ initialEvents }: EventsCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlSearch = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "ALL";
  const urlType = searchParams.get("type") || "ALL";
  const urlMode = searchParams.get("mode") || "ALL";
  const urlTech = searchParams.get("tech") || "ALL";
  const urlPrice = searchParams.get("price") || "ALL";
  const urlRegStatus = searchParams.get("reg") || "ALL";
  const urlSort = searchParams.get("sort") || "soonest";

  const [searchInput, setSearchInput] = useState(urlSearch);

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    initialEvents.forEach((e) => {
      if (e.category) set.add(e.category);
    });
    return ["ALL", ...Array.from(set).sort()];
  }, [initialEvents]);

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== urlSearch) {
        updateQuery("q", searchInput);
      }
    }, 280);
    return () => clearTimeout(timer);
  }, [searchInput, urlSearch]);

  const clearAllFilters = () => {
    setSearchInput("");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  const filteredEvents = useMemo(() => {
    return initialEvents
      .filter((item) => {
        if (searchInput.trim()) {
          const q = searchInput.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchBlurb = (item.blurb || "").toLowerCase().includes(q);
          const matchCategory = item.category.toLowerCase().includes(q);
          const matchTags = (item.tags || []).some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchBlurb && !matchCategory && !matchTags) {
            return false;
          }
        }

        if (urlCategory !== "ALL" && item.category !== urlCategory) {
          return false;
        }

        if (urlType !== "ALL" && item.event_type !== urlType) {
          return false;
        }

        if (urlMode !== "ALL" && item.event_mode !== urlMode) {
          return false;
        }

        if (urlTech === "TECHNICAL" && !item.is_technical) return false;
        if (urlTech === "CULTURAL" && item.is_technical) return false;

        if (urlPrice === "FREE" && item.price !== 0) return false;
        if (urlPrice === "PAID" && item.price === 0) return false;

        if (urlRegStatus === "OPEN" && item.registration_status !== "OPEN") return false;

        return true;
      })
      .sort((a, b) => {
        if (urlSort === "price_low") return a.price - b.price;
        if (urlSort === "price_high") return b.price - a.price;
        if (urlSort === "seats") {
          const leftA = (a.total_seats || 100) - (a.seats_filled || 0);
          const leftB = (b.total_seats || 100) - (b.seats_filled || 0);
          return leftB - leftA;
        }
        if (urlSort === "name") return a.name.localeCompare(b.name);

        const dateA = a.schedule_summary?.start_date || "9999";
        const dateB = b.schedule_summary?.start_date || "9999";
        return dateA.localeCompare(dateB);
      });
  }, [
    initialEvents,
    searchInput,
    urlCategory,
    urlType,
    urlMode,
    urlTech,
    urlPrice,
    urlRegStatus,
    urlSort,
  ]);

  const activeFilterCount = [
    urlCategory !== "ALL",
    urlType !== "ALL",
    urlMode !== "ALL",
    urlTech !== "ALL",
    urlPrice !== "ALL",
    urlRegStatus !== "ALL",
    Boolean(searchInput.trim()),
  ].filter(Boolean).length;

  return (
    <section className="w-full space-y-6">
      {/* Control Deck: Search bar + Quick Filters */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-5">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" aria-hidden="true" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by event title, category, or tags..."
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-950/80 border border-white/10 focus:border-white/30 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-colors"
              aria-label="Search events"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xs text-zinc-400 font-medium hidden sm:inline">Sort by:</span>
            <div className="relative">
              <select
                value={urlSort}
                onChange={(e) => updateQuery("sort", e.target.value)}
                className="appearance-none px-4 py-3 pr-9 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-zinc-200 hover:border-white/20 focus:border-white/30 cursor-pointer font-medium"
                aria-label="Sort events"
              >
                <option value="soonest">Date: Soonest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="seats">Seats: Most Available</option>
                <option value="name">Alphabetical (A–Z)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/[0.06] text-xs">
          <span className="text-zinc-400 text-xs mr-1 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5 text-zinc-400" /> Filters:
          </span>

          <button
            onClick={() => updateQuery("mode", urlMode === "ONLINE" ? "ALL" : "ONLINE")}
            className={`px-3 py-1.5 rounded-full border transition-colors ${
              urlMode === "ONLINE"
                ? "bg-blue-500/20 text-blue-300 border-blue-500/40 font-medium"
                : "bg-zinc-950/60 text-zinc-400 border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            Online Only
          </button>

          <button
            onClick={() => updateQuery("mode", urlMode === "OFFLINE" ? "ALL" : "OFFLINE")}
            className={`px-3 py-1.5 rounded-full border transition-colors ${
              urlMode === "OFFLINE"
                ? "bg-white text-zinc-950 border-white font-medium"
                : "bg-zinc-950/60 text-zinc-400 border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            In-Person Campus
          </button>

          <button
            onClick={() => updateQuery("price", urlPrice === "FREE" ? "ALL" : "FREE")}
            className={`px-3 py-1.5 rounded-full border transition-colors ${
              urlPrice === "FREE"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-medium"
                : "bg-zinc-950/60 text-zinc-400 border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            Free Entry
          </button>

          <button
            onClick={() => updateQuery("type", urlType === "WORKSHOP" ? "ALL" : "WORKSHOP")}
            className={`px-3 py-1.5 rounded-full border transition-colors ${
              urlType === "WORKSHOP"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-medium"
                : "bg-zinc-950/60 text-zinc-400 border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            Workshops
          </button>

          <button
            onClick={() => updateQuery("reg", urlRegStatus === "OPEN" ? "ALL" : "OPEN")}
            className={`px-3 py-1.5 rounded-full border transition-colors ${
              urlRegStatus === "OPEN"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-medium"
                : "bg-zinc-950/60 text-zinc-400 border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            Open for Registration
          </button>

          <button
            onClick={() => updateQuery("tech", urlTech === "TECHNICAL" ? "ALL" : "TECHNICAL")}
            className={`px-3 py-1.5 rounded-full border transition-colors ${
              urlTech === "TECHNICAL"
                ? "bg-zinc-800 text-white border-white/30 font-medium"
                : "bg-zinc-950/60 text-zinc-400 border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            Technical Track
          </button>
        </div>

        {/* Category Horizontal Scroll Strip */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-zinc-500 shrink-0 mr-1 text-[11px] font-medium">Category:</span>
          {categories.map((cat) => {
            const isSelected = urlCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => updateQuery("category", cat)}
                className={`px-3 py-1 rounded-full shrink-0 whitespace-nowrap transition-colors border text-xs ${
                  isSelected
                    ? "bg-white text-zinc-950 border-white font-medium"
                    : "bg-zinc-950/60 text-zinc-400 border-white/10 hover:text-white hover:border-white/20"
                }`}
              >
                {cat === "ALL" ? "All Categories" : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header + Active Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-white/[0.08] text-xs">
        <div className="flex items-center gap-2">
          <span className="text-zinc-300 font-medium">
            Showing {filteredEvents.length} of {initialEvents.length} events
          </span>
          {isPending && (
            <span className="text-emerald-400 animate-pulse text-[11px] font-mono">• Updating...</span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-zinc-500 text-xs">Active filters:</span>

            {urlCategory !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/15 text-zinc-200 text-xs">
                {urlCategory}
                <button
                  onClick={() => updateQuery("category", "ALL")}
                  className="hover:text-white ml-0.5"
                  aria-label="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {urlMode !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/15 text-zinc-200 text-xs">
                {urlMode === "ONLINE" ? "Online" : "In-Person"}
                <button
                  onClick={() => updateQuery("mode", "ALL")}
                  className="hover:text-white ml-0.5"
                  aria-label="Remove mode filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {urlPrice !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/15 text-zinc-200 text-xs">
                {urlPrice === "FREE" ? "Free Only" : "Paid Only"}
                <button
                  onClick={() => updateQuery("price", "ALL")}
                  className="hover:text-white ml-0.5"
                  aria-label="Remove price filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {urlType !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/15 text-zinc-200 text-xs">
                {urlType === "WORKSHOP" ? "Workshops" : "Competitions"}
                <button
                  onClick={() => updateQuery("type", "ALL")}
                  className="hover:text-white ml-0.5"
                  aria-label="Remove type filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {urlRegStatus !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/15 text-zinc-200 text-xs">
                Open Registration
                <button
                  onClick={() => updateQuery("reg", "ALL")}
                  className="hover:text-white ml-0.5"
                  aria-label="Remove registration filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchInput && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/15 text-zinc-200 text-xs">
                &ldquo;{searchInput}&rdquo;
                <button
                  onClick={() => setSearchInput("")}
                  className="hover:text-white ml-0.5"
                  aria-label="Clear search text"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Main Grid View or Empty State */}
      {filteredEvents.length === 0 ? (
        <div className="p-16 rounded-2xl bg-zinc-900/30 border border-white/[0.08] text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-xl text-white">
            No events match your criteria
          </h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            We couldn&apos;t find any events matching your current filters. Try broadening your search or clearing active filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredEvents.map((evt, idx) => (
              <motion.div
                key={evt.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <EventCard event={evt} priority={idx < 3} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
