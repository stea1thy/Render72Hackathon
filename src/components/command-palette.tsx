"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { SearchModal } from "./search-modal";
import type { EventSummary } from "@/lib/types";

interface CommandPaletteProps {
  events?: EventSummary[];
}

export function CommandPalette({ events = [] }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        aria-label="Search events"
        className="inline-flex items-center gap-2.5 min-h-[40px] px-4 py-2 bg-[#1B0E40] border-2 border-[#492191] hover:border-[#FFF3B8] hover:bg-[#231154] text-[#D6E4FF] hover:text-[#FFF3B8] font-pixel-clean text-xs uppercase tracking-wider shadow-[3px_3px_0px_#090318] active:translate-x-[1px] active:translate-y-[1px] transition-all rounded-none cursor-pointer"
      >
        <Search className="w-3.5 h-3.5 text-[#E63E9B] shrink-0" />
        <span>SEARCH</span>
      </button>

      <SearchModal
        isOpen={open}
        onClose={() => setOpen(false)}
        events={events}
      />
    </>
  );
}

export default CommandPalette;
