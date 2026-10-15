"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Calendar, Tag, ArrowRight, X } from "lucide-react";
import type { EventSummary } from "@/lib/types";

interface CommandPaletteProps {
  events?: EventSummary[];
}

export function CommandPalette({ events = [] }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigateTo = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        aria-label="Open search dialog"
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
      >
        <Search className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
        <span>Search events...</span>
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-zinc-800 border border-white/10 text-zinc-400">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command Search"
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-zinc-950 border border-white/15 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Command className="w-full">
              <div className="flex items-center border-b border-white/10 px-4 py-1">
                <Search className="w-4 h-4 text-zinc-400 mr-3 shrink-0" aria-hidden="true" />
                <Command.Input
                  placeholder="Search events, workshops, hackathons..."
                  className="w-full py-3.5 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                  autoFocus
                />
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded text-zinc-500 hover:text-zinc-300"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <Command.List className="max-h-80 overflow-y-auto p-2 text-xs">
                <Command.Empty className="p-6 text-center text-zinc-500">
                  No matching events found.
                </Command.Empty>

                <Command.Group heading="Quick Links" className="text-[11px] font-semibold text-zinc-500 px-3 py-2 uppercase tracking-wider font-mono">
                  <Command.Item
                    onSelect={() => navigateTo("/events")}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer hover:bg-zinc-900 text-zinc-200 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                      All Events Catalog
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">/events</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => navigateTo("/events?price=FREE")}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer hover:bg-zinc-900 text-zinc-200 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" />
                      Free Registration Events
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Free Only</span>
                  </Command.Item>
                </Command.Group>

                {events.length > 0 && (
                  <Command.Group heading="Events" className="text-[11px] font-semibold text-zinc-500 px-3 py-2 uppercase tracking-wider font-mono mt-2 border-t border-white/[0.06] pt-2">
                    {events.slice(0, 15).map((evt) => (
                      <Command.Item
                        key={evt.id}
                        value={`${evt.name} ${evt.category} ${evt.tags?.join(" ")}`}
                        onSelect={() => navigateTo(`/events/${evt.id}`)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer hover:bg-zinc-900 text-zinc-200 transition-colors"
                      >
                        <div className="flex flex-col truncate pr-2">
                          <span className="truncate font-medium">{evt.name}</span>
                          <span className="text-[11px] text-zinc-500 font-mono">
                            {evt.category} • {evt.price === 0 ? "Free" : `₹${evt.price}`}
                          </span>
                        </div>
                        <Calendar className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
              </Command.List>

              <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/10 bg-zinc-900/50 text-[11px] text-zinc-500 font-mono">
                <span>Navigate: ↑↓</span>
                <span>Select: ↵</span>
                <span>Dismiss: Esc</span>
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
