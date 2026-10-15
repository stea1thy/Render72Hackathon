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
  Sparkles,
  ChevronDown,
  Info,
  Clock,
  Layers,
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

  // Read initial states from URL query string
  const urlSearch = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "ALL";
  const urlType = searchParams.get("type") || "ALL";
  const urlMode = searchParams.get("mode") || "ALL";
  const urlTech = searchParams.get("tech") || "ALL";
  const urlPrice = searchParams.get("price") || "ALL";
  const urlRegStatus = searchParams.get("reg") || "ALL";
  const urlSort = searchParams.get("sort") || "soonest";

  // Local state for debounced search input
  const [searchInput, setSearchInput] = useState(urlSearch);

  // Sync search input with URL if URL changes externally
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // Extract all unique categories from events
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialEvents.forEach((e) => {
      if (e.category) set.add(e.category);
    });
    return ["ALL", ...Array.from(set).sort()];
  }, [initialEvents]);

  // Update URL helper
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

  // Debounce search update to URL
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

  // Filtered and sorted events
  const filteredEvents = useMemo(() => {
    return initialEvents
      .filter((item) => {
        // Query search
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

        // Category filter
        if (urlCategory !== "ALL" && item.category !== urlCategory) {
          return false;
        }

        // Event Type filter
        if (urlType !== "ALL" && item.event_type !== urlType) {
          return false;
        }

        // Event Mode filter
        if (urlMode !== "ALL" && item.event_mode !== urlMode) {
          return false;
        }

        // Tech vs Cultural
        if (urlTech === "TECHNICAL" && !item.is_technical) return false;
        if (urlTech === "CULTURAL" && item.is_technical) return false;

        // Price filter
        if (urlPrice === "FREE" && item.price !== 0) return false;
        if (urlPrice === "PAID" && item.price === 0) return false;

        // Registration status
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

        // default: soonest start date
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

  // Active filter count
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
      <div className="p-4 sm:p-6 bg-[#10121a] border border-[#232635] shadow-brutal-zinc space-y-5">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00ff66]" aria-hidden="true" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="SEARCH PROTOCOLS BY TITLE, TAG, CATEGORY OR STACK..."
              className="w-full pl-10 pr-10 py-3 bg-[#090a0f] border border-[#232635] focus:border-[#00ff66] text-xs sm:text-sm font-mono text-[#f4f5f8] placeholder:text-[#555c70] transition-colors"
              aria-label="Search events"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b93a7] hover:text-[#f4f5f8]"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-xs text-[#8b93a7] hidden sm:inline">SORT:</span>
            <div className="relative">
              <select
                value={urlSort}
                onChange={(e) => updateQuery("sort", e.target.value)}
                className="appearance-none px-4 py-3 pr-8 bg-[#090a0f] border border-[#232635] text-xs font-mono text-[#f4f5f8] hover:border-[#00ff66] focus:border-[#00ff66] cursor-pointer"
                aria-label="Sort events"
              >
                <option value="soonest">DATE // SOONEST FIRST</option>
                <option value="price_low">FEE // LOWEST TO HIGHEST</option>
                <option value="price_high">FEE // HIGHEST TO LOWEST</option>
                <option value="seats">SEATS // MOST AVAILABLE</option>
                <option value="name">ALPHABETICAL // A-Z</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8b93a7] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#232635] text-xs font-mono">
          <span className="text-[#8b93a7] text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#00ff66]" /> FILTERS:
          </span>

          {/* Mode Pill */}
          <button
            onClick={() => updateQuery("mode", urlMode === "ONLINE" ? "ALL" : "ONLINE")}
            className={`px-2.5 py-1 border transition-colors ${
              urlMode === "ONLINE"
                ? "bg-[#00f0ff] text-[#090a0f] border-[#00f0ff] font-bold"
                : "bg-[#090a0f] text-[#8b93a7] border-[#232635] hover:border-[#00f0ff] hover:text-[#f4f5f8]"
            }`}
          >
            [ONLINE ONLY]
          </button>

          <button
            onClick={() => updateQuery("mode", urlMode === "OFFLINE" ? "ALL" : "OFFLINE")}
            className={`px-2.5 py-1 border transition-colors ${
              urlMode === "OFFLINE"
                ? "bg-[#f4f5f8] text-[#090a0f] border-[#f4f5f8] font-bold"
                : "bg-[#090a0f] text-[#8b93a7] border-[#232635] hover:border-[#f4f5f8] hover:text-[#f4f5f8]"
            }`}
          >
            [IN-PERSON CAMPUS]
          </button>

          {/* Free vs Paid */}
          <button
            onClick={() => updateQuery("price", urlPrice === "FREE" ? "ALL" : "FREE")}
            className={`px-2.5 py-1 border transition-colors ${
              urlPrice === "FREE"
                ? "bg-[#00ff66] text-[#090a0f] border-[#00ff66] font-bold"
                : "bg-[#090a0f] text-[#8b93a7] border-[#232635] hover:border-[#00ff66] hover:text-[#f4f5f8]"
            }`}
          >
            [FREE ENTRY: ₹0]
          </button>

          {/* Event Type */}
          <button
            onClick={() => updateQuery("type", urlType === "WORKSHOP" ? "ALL" : "WORKSHOP")}
            className={`px-2.5 py-1 border transition-colors ${
              urlType === "WORKSHOP"
                ? "bg-[#ffb800] text-[#090a0f] border-[#ffb800] font-bold"
                : "bg-[#090a0f] text-[#8b93a7] border-[#232635] hover:border-[#ffb800] hover:text-[#f4f5f8]"
            }`}
          >
            [WORKSHOPS]
          </button>

          {/* Registration Open Only */}
          <button
            onClick={() => updateQuery("reg", urlRegStatus === "OPEN" ? "ALL" : "OPEN")}
            className={`px-2.5 py-1 border transition-colors ${
              urlRegStatus === "OPEN"
                ? "bg-[#00ff66] text-[#090a0f] border-[#00ff66] font-bold"
                : "bg-[#090a0f] text-[#8b93a7] border-[#232635] hover:border-[#00ff66] hover:text-[#f4f5f8]"
            }`}
          >
            [REGISTRATION OPEN]
          </button>

          {/* Technical vs Cultural */}
          <button
            onClick={() => updateQuery("tech", urlTech === "TECHNICAL" ? "ALL" : "TECHNICAL")}
            className={`px-2.5 py-1 border transition-colors ${
              urlTech === "TECHNICAL"
                ? "bg-[#00ff66] text-[#090a0f] border-[#00ff66] font-bold"
                : "bg-[#090a0f] text-[#8b93a7] border-[#232635] hover:border-[#00ff66] hover:text-[#f4f5f8]"
            }`}
          >
            [TECH DEV ONLY]
          </button>
        </div>

        {/* Category Horizontal Scroll Strip */}
        <div className="pt-2 border-t border-[#232635] flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-[11px]">
          <span className="text-[#555c70] shrink-0 mr-1">CATEGORY:</span>
          {categories.map((cat) => {
            const isSelected = urlCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => updateQuery("category", cat)}
                className={`px-2 py-1 shrink-0 whitespace-nowrap transition-colors border ${
                  isSelected
                    ? "bg-[#171924] text-[#00ff66] border-[#00ff66] font-bold shadow-brutal-sm"
                    : "bg-[#090a0f] text-[#8b93a7] border-[#232635] hover:text-[#f4f5f8] hover:border-[#555c70]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header + Active Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-[#232635] font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#00ff66] font-bold">
            [{filteredEvents.length} OF {initialEvents.length} RECORDS MATCHED]
          </span>
          {isPending && (
            <span className="text-[#00f0ff] animate-pulse">// REFLOWING...</span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#8b93a7] text-[11px]">ACTIVE CRITERIA:</span>

            {urlCategory !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#171924] border border-[#00ff66] text-[#00ff66] text-[10px]">
                CAT: {urlCategory}
                <button
                  onClick={() => updateQuery("category", "ALL")}
                  className="hover:text-white"
                  aria-label="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {urlMode !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#171924] border border-[#00f0ff] text-[#00f0ff] text-[10px]">
                MODE: {urlMode}
                <button
                  onClick={() => updateQuery("mode", "ALL")}
                  className="hover:text-white"
                  aria-label="Remove mode filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {urlPrice !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#171924] border border-[#00ff66] text-[#00ff66] text-[10px]">
                PRICE: {urlPrice}
                <button
                  onClick={() => updateQuery("price", "ALL")}
                  className="hover:text-white"
                  aria-label="Remove price filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {urlType !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#171924] border border-[#ffb800] text-[#ffb800] text-[10px]">
                TYPE: {urlType}
                <button
                  onClick={() => updateQuery("type", "ALL")}
                  className="hover:text-white"
                  aria-label="Remove type filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {urlRegStatus !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#171924] border border-[#00ff66] text-[#00ff66] text-[10px]">
                REG: OPEN
                <button
                  onClick={() => updateQuery("reg", "ALL")}
                  className="hover:text-white"
                  aria-label="Remove registration status filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchInput && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#171924] border border-[#f4f5f8] text-[#f4f5f8] text-[10px]">
                QUERY: &quot;{searchInput}&quot;
                <button
                  onClick={() => setSearchInput("")}
                  className="hover:text-white"
                  aria-label="Clear search filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#ff3344]/10 border border-[#ff3344] text-[#ff3344] text-[10px] hover:bg-[#ff3344] hover:text-[#090a0f] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              CLEAR ALL
            </button>
          </div>
        )}
      </div>

      {/* Main Grid View or Empty State */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 bg-[#10121a] border-2 border-dashed border-[#232635] text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-[#171924] border border-[#232635] flex items-center justify-center text-[#ffb800]">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#f4f5f8]">
            NO CORRESPONDING NODES FOUND
          </h3>
          <p className="font-sans text-xs text-[#8b93a7] max-w-md mx-auto">
            Zero festival events matched your selected filter parameters or search term. Try resetting your filters to explore all 30 activities.
          </p>
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00ff66] text-[#090a0f] font-mono font-bold text-xs shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET ALL FILTERS
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
