"use client";

import React, { useState, useMemo, useEffect, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { EventCard } from "./event-card";
import { EventsFilterBar, type EventsFilterState } from "./EventsFilterBar";
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

  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);
  const [searchInput, setSearchInput] = useState(urlSearch);

  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearchInput(urlSearch);
  }

  const categories = useMemo(() => {
    const set = new Set<string>();
    initialEvents.forEach((e) => {
      if (e.category && e.category !== "ALL") set.add(e.category);
    });
    return Array.from(set).sort();
  }, [initialEvents]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== urlSearch) {
        const params = new URLSearchParams(searchParams.toString());
        if (!searchInput.trim()) {
          params.delete("q");
        } else {
          params.set("q", searchInput);
        }
        startTransition(() => {
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
      }
    }, 280);
    return () => clearTimeout(timer);
  }, [searchInput, urlSearch, searchParams, pathname, router]);

  const clearAllFilters = () => {
    setSearchInput("");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  const currentSortBy: EventsFilterState["sortBy"] =
    urlSort === "price_low" || urlSort === "price"
      ? "price"
      : urlSort === "seats" || urlSort === "seats_left"
      ? "seats_left"
      : urlSort === "name"
      ? "name"
      : "soonest";

  const filterState: EventsFilterState = {
    search: searchInput,
    sortBy: currentSortBy,
    onlineOnly: urlMode === "ONLINE",
    inPersonCampus: urlMode === "OFFLINE",
    freeEntry: urlPrice === "FREE",
    workshopsOnly: urlType === "WORKSHOP",
    openRegistration: urlRegStatus === "OPEN",
    technicalTrack: urlTech === "TECHNICAL",
    category: urlCategory,
  };

  const handleFilterChange = (updated: Partial<EventsFilterState>) => {
    const params = new URLSearchParams(searchParams.toString());

    if ("search" in updated) {
      const q = updated.search ?? "";
      setSearchInput(q);
      if (!q.trim()) {
        params.delete("q");
      } else {
        params.set("q", q);
      }
    }

    if ("sortBy" in updated) {
      if (updated.sortBy === "soonest") {
        params.delete("sort");
      } else {
        params.set("sort", updated.sortBy!);
      }
    }

    if ("onlineOnly" in updated) {
      if (updated.onlineOnly) {
        params.set("mode", "ONLINE");
      } else if (urlMode === "ONLINE") {
        params.delete("mode");
      }
    }

    if ("inPersonCampus" in updated) {
      if (updated.inPersonCampus) {
        params.set("mode", "OFFLINE");
      } else if (urlMode === "OFFLINE") {
        params.delete("mode");
      }
    }

    if ("freeEntry" in updated) {
      if (updated.freeEntry) {
        params.set("price", "FREE");
      } else if (urlPrice === "FREE") {
        params.delete("price");
      }
    }

    if ("workshopsOnly" in updated) {
      if (updated.workshopsOnly) {
        params.set("type", "WORKSHOP");
      } else if (urlType === "WORKSHOP") {
        params.delete("type");
      }
    }

    if ("openRegistration" in updated) {
      if (updated.openRegistration) {
        params.set("reg", "OPEN");
      } else if (urlRegStatus === "OPEN") {
        params.delete("reg");
      }
    }

    if ("technicalTrack" in updated) {
      if (updated.technicalTrack) {
        params.set("tech", "TECHNICAL");
      } else if (urlTech === "TECHNICAL") {
        params.delete("tech");
      }
    }

    if ("category" in updated) {
      const cat = updated.category ?? "ALL";
      if (cat === "ALL" || cat === "ALL CATEGORIES" || !cat) {
        params.delete("category");
      } else {
        params.set("category", cat);
      }
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
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
        if (urlSort === "price_low" || urlSort === "price") return a.price - b.price;
        if (urlSort === "price_high") return b.price - a.price;
        if (urlSort === "seats" || urlSort === "seats_left") {
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

  return (
    <section className="w-full space-y-6">
      {/* Collapsible Filter & Category Bar */}
      <EventsFilterBar
        filters={filterState}
        categories={categories}
        onChange={handleFilterChange}
        onResetAll={clearAllFilters}
      />

      {/* Results Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b-2 border-[#38208C]/40 text-xs font-pixel-clean">
        <div className="flex items-center gap-2">
          <span className="text-[#A5E8FF] font-bold">
            SHOWING {filteredEvents.length} OF {initialEvents.length} EVENTS
          </span>
          {isPending && (
            <span className="text-[#FFF3B8] animate-pulse text-[11px]">• UPDATING...</span>
          )}
        </div>
      </div>

      {/* Main Grid View or Empty State */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-none bg-[#1B0E40] border-[3px] border-[#492191] shadow-[6px_6px_0px_#090318] text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-none bg-[#12072B] border-2 border-[#FFF3B8] flex items-center justify-center text-[#FFF3B8] shadow-[3px_3px_0px_#090318]">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <h3 className="font-pixel-block text-lg text-white">
            NO EVENTS MATCH YOUR CRITERIA
          </h3>
          <p className="font-mono text-xs sm:text-sm text-[#D8E2FF]/80 max-w-md mx-auto leading-relaxed">
            We couldn&apos;t find any events matching your current filters. Try broadening your search or clearing active filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#FFFDF2] text-[#1B0E40] border-2 border-[#100526] font-pixel-clean font-bold text-xs uppercase shadow-[3px_3px_0px_#E63E9B] hover:bg-[#FFE699] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
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

export default EventsCatalog;
