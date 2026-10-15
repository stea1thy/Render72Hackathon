"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  FolderKanban,
  ChevronDown,
  X,
  RotateCcw,
} from "lucide-react";

export interface EventsFilterState {
  search: string;
  sortBy: "soonest" | "price" | "seats_left" | "name";
  onlineOnly: boolean;
  inPersonCampus: boolean;
  freeEntry: boolean;
  workshopsOnly: boolean;
  openRegistration: boolean;
  technicalTrack: boolean;
  category: string; // "ALL" or category name
}

export interface EventsFilterBarProps {
  filters: EventsFilterState;
  categories: string[];
  onChange: (updated: Partial<EventsFilterState>) => void;
  onResetAll: () => void;
}

export function EventsFilterBar({
  filters,
  categories,
  onChange,
  onResetAll,
}: EventsFilterBarProps) {
  // Both sections collapsed by default so event cards are immediately visible above the fold
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const togglePills = [
    {
      key: "onlineOnly" as const,
      label: "ONLINE ONLY",
      active: filters.onlineOnly,
    },
    {
      key: "inPersonCampus" as const,
      label: "IN-PERSON CAMPUS",
      active: filters.inPersonCampus,
    },
    {
      key: "freeEntry" as const,
      label: "FREE ENTRY",
      active: filters.freeEntry,
    },
    {
      key: "workshopsOnly" as const,
      label: "WORKSHOPS",
      active: filters.workshopsOnly,
    },
    {
      key: "openRegistration" as const,
      label: "OPEN REGISTRATION",
      active: filters.openRegistration,
    },
    {
      key: "technicalTrack" as const,
      label: "TECHNICAL TRACK",
      active: filters.technicalTrack,
    },
  ];

  const activeFilterCount = togglePills.filter((p) => p.active).length;
  const hasActiveCategory =
    filters.category && filters.category !== "ALL" && filters.category !== "ALL CATEGORIES";
  const totalActiveCount =
    activeFilterCount + (hasActiveCategory ? 1 : 0) + (filters.search.trim() ? 1 : 0);

  return (
    <div className="w-full bg-[#140930] border-2 border-[#492191] shadow-[6px_6px_0px_#090318] p-4 sm:p-6 rounded-none space-y-4">
      {/* 1. Top Row: Search Input + Sort Dropdown */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 flex items-center h-12 px-3.5 bg-[#120829] border-2 border-[#492191] focus-within:border-[#A5E8FF] transition-colors">
          <Search className="w-4 h-4 text-[#A5E8FF] shrink-0 mr-3" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search by event title, category, or tags..."
            aria-label="Search by event title, category, or tags"
            className="w-full bg-transparent font-mono text-xs sm:text-sm text-white placeholder:text-[#D6E4FF]/45 focus:outline-none"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ search: "" })}
              aria-label="Clear search query"
              className="ml-2 p-1 text-[#D6E4FF]/70 hover:text-[#FFF3B8] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-3 shrink-0">
          <label
            htmlFor="events-sort-select"
            className="font-pixel-clean text-xs uppercase tracking-wider text-[#A5E8FF] shrink-0"
          >
            SORT BY:
          </label>
          <select
            id="events-sort-select"
            value={filters.sortBy}
            onChange={(e) =>
              onChange({ sortBy: e.target.value as EventsFilterState["sortBy"] })
            }
            className="min-h-[48px] px-4 py-2 bg-[#120829] border-2 border-[#492191] hover:border-[#FFF3B8] focus:border-[#FFF3B8] font-mono text-xs sm:text-sm text-white rounded-none focus:outline-none cursor-pointer"
          >
            <option value="soonest">Date: Soonest First</option>
            <option value="price">Price: Low to High</option>
            <option value="seats_left">Seats Left: Fewest First</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* 2. Collapsible Toggle Buttons Row for FILTERS & CATEGORY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#492191]/70">
        {/* Toggle FILTERS Button */}
        <button
          type="button"
          onClick={() => setIsFiltersOpen((prev) => !prev)}
          aria-expanded={isFiltersOpen}
          aria-label="Toggle filters panel"
          className={`flex items-center justify-between min-h-[44px] px-4 py-2.5 border-2 font-pixel-clean text-xs uppercase tracking-wider transition-all rounded-none shadow-[3px_3px_0px_#090318] cursor-pointer ${
            isFiltersOpen || activeFilterCount > 0
              ? "bg-[#1B0E40] border-[#FFF3B8] text-white"
              : "bg-[#120829] border-[#492191] text-[#D6E4FF] hover:border-[#A5E8FF]"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#E63E9B] shrink-0" />
            <span>FILTERS</span>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 bg-[#E63E9B] text-white text-[10px] border border-[#FFF3B8]">
                {activeFilterCount} ACTIVE
              </span>
            )}
          </span>

          <span className="inline-flex items-center gap-1.5 text-[10px] text-[#A5E8FF]">
            <span>{isFiltersOpen ? "HIDE" : "SHOW"}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isFiltersOpen ? "rotate-180 text-[#FFF3B8]" : ""
              }`}
            />
          </span>
        </button>

        {/* Toggle CATEGORY Button */}
        <button
          type="button"
          onClick={() => setIsCategoriesOpen((prev) => !prev)}
          aria-expanded={isCategoriesOpen}
          aria-label="Toggle category panel"
          className={`flex items-center justify-between min-h-[44px] px-4 py-2.5 border-2 font-pixel-clean text-xs uppercase tracking-wider transition-all rounded-none shadow-[3px_3px_0px_#090318] cursor-pointer ${
            isCategoriesOpen || hasActiveCategory
              ? "bg-[#1B0E40] border-[#FFF3B8] text-white"
              : "bg-[#120829] border-[#492191] text-[#D6E4FF] hover:border-[#A5E8FF]"
          }`}
        >
          <span className="inline-flex items-center gap-2 min-w-0 truncate">
            <FolderKanban className="w-3.5 h-3.5 text-[#A5E8FF] shrink-0" />
            <span className="shrink-0">CATEGORY:</span>
            <span className="px-1.5 py-0.5 bg-[#FFFDF2] text-[#1B0E40] text-[10px] font-bold truncate">
              {hasActiveCategory ? filters.category : "ALL CATEGORIES"}
            </span>
          </span>

          <span className="inline-flex items-center gap-1.5 text-[10px] text-[#A5E8FF] shrink-0 ml-2">
            <span>{isCategoriesOpen ? "HIDE" : `ALL (${categories.length})`}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isCategoriesOpen ? "rotate-180 text-[#FFF3B8]" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* 3. Collapsible FILTERS Panel */}
      <div
        className={`grid transition-all duration-200 ease-out ${
          isFiltersOpen
            ? "grid-rows-[1fr] opacity-100 pt-2 border-t border-[#492191]/60"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2.5 py-1">
            <span className="font-pixel-clean text-xs uppercase tracking-wider text-[#A5E8FF] mr-1 inline-flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#E63E9B]" />
              FILTERS:
            </span>
            {togglePills.map((pill) => (
              <button
                key={pill.key}
                type="button"
                onClick={() => onChange({ [pill.key]: !pill.active })}
                className={`min-h-[40px] px-3.5 py-2 font-pixel-clean text-[11px] uppercase tracking-wider border-2 transition-all rounded-none cursor-pointer ${
                  pill.active
                    ? "bg-[#FFFDF2] text-[#1B0E40] border-[#1B0E40] shadow-[3px_3px_0px_#E63E9B] font-bold"
                    : "bg-[#120829] text-[#D6E4FF]/85 border-[#492191] hover:border-[#A5E8FF] hover:text-white"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Collapsible CATEGORY Panel */}
      <div
        className={`grid transition-all duration-200 ease-out ${
          isCategoriesOpen
            ? "grid-rows-[1fr] opacity-100 pt-2 border-t border-[#492191]/60"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 py-1">
            <span className="font-pixel-clean text-xs uppercase tracking-wider text-[#A5E8FF] mr-1">
              CATEGORY:
            </span>

            {/* All Categories Button */}
            <button
              type="button"
              onClick={() => onChange({ category: "ALL" })}
              className={`min-h-[38px] px-3 py-1.5 font-pixel-clean text-[11px] uppercase tracking-wider border-2 transition-all rounded-none cursor-pointer ${
                !hasActiveCategory
                  ? "bg-[#FFFDF2] text-[#1B0E40] border-[#1B0E40] shadow-[3px_3px_0px_#E63E9B] font-bold"
                  : "bg-[#120829] text-[#D6E4FF]/85 border-[#492191] hover:border-[#A5E8FF] hover:text-white"
              }`}
            >
              ALL CATEGORIES
            </button>

            {/* Individual Category Buttons */}
            {categories.map((cat) => {
              const isSelected = filters.category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    onChange({ category: isSelected ? "ALL" : cat })
                  }
                  className={`min-h-[38px] px-3 py-1.5 font-pixel-clean text-[11px] uppercase tracking-wider border-2 transition-all rounded-none cursor-pointer ${
                    isSelected
                      ? "bg-[#FFFDF2] text-[#1B0E40] border-[#1B0E40] shadow-[3px_3px_0px_#E63E9B] font-bold"
                      : "bg-[#120829] text-[#D6E4FF]/85 border-[#492191] hover:border-[#A5E8FF] hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Active Filter Chips Summary Strip (Visible Even When Panels Are Collapsed) */}
      {totalActiveCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#492191]/70">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-pixel-clean text-[10px] uppercase tracking-widest text-[#FFF3B8]">
              ACTIVE:
            </span>

            {hasActiveCategory && (
              <button
                type="button"
                onClick={() => onChange({ category: "ALL" })}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1B0E40] border border-[#FFF3B8] font-pixel-clean text-[10px] text-[#FFF3B8] uppercase hover:bg-[#E63E9B] hover:text-white transition-colors cursor-pointer"
              >
                <span>{filters.category}</span>
                <X className="w-3 h-3" />
              </button>
            )}

            {togglePills
              .filter((p) => p.active)
              .map((pill) => (
                <button
                  key={pill.key}
                  type="button"
                  onClick={() => onChange({ [pill.key]: false })}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1B0E40] border border-[#A5E8FF] font-pixel-clean text-[10px] text-[#A5E8FF] uppercase hover:bg-[#E63E9B] hover:text-white transition-colors cursor-pointer"
                >
                  <span>{pill.label}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
          </div>

          <button
            type="button"
            onClick={onResetAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#120829] border border-[#E63E9B] hover:bg-[#E63E9B] font-pixel-clean text-[10px] text-white uppercase tracking-wider transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET ALL</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default EventsFilterBar;
