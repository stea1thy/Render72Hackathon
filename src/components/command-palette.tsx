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
        aria-label="Open command search palette"
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-mono bg-[#10121a] text-[#8b93a7] border border-[#232635] hover:border-[#00ff66] hover:text-[#f4f5f8] transition-colors"
      >
        <Search className="w-3.5 h-3.5 text-[#00ff66]" aria-hidden="true" />
        <span>COMMAND SEARCH</span>
        <kbd className="px-1.5 py-0.5 text-[10px] bg-[#171924] border border-[#232635] text-[#8b93a7]">
          Ctrl+K
        </kbd>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command Search"
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-[#090a0f] border-2 border-[#00ff66] shadow-brutal-acid overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Command className="w-full">
              <div className="flex items-center border-b border-[#232635] px-3 bg-[#10121a]">
                <Search className="w-4 h-4 text-[#00ff66] mr-2 shrink-0" aria-hidden="true" />
                <Command.Input
                  placeholder="TYPE TO QUERY PROTOCOL (e.g. Hackathon, Robotics, Free)..."
                  className="w-full py-3.5 bg-transparent text-sm font-mono text-[#f4f5f8] outline-none placeholder:text-[#555c70]"
                  autoFocus
                />
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 text-[#8b93a7] hover:text-[#f4f5f8]"
                  aria-label="Close command palette"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <Command.List className="max-h-80 overflow-y-auto p-2 font-mono text-xs">
                <Command.Empty className="p-4 text-center text-[#8b93a7]">
                  [NO MATCHES LOCATED IN SYSTEM RECORD]
                </Command.Empty>

                <Command.Group heading="SYSTEM NAVIGATION" className="text-[11px] font-bold text-[#00ff66] px-2 py-1 tracking-wider">
                  <Command.Item
                    onSelect={() => navigateTo("/events")}
                    className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#171924] hover:text-[#00ff66] text-[#f4f5f8] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-[#00ff66]" />
                      Full Events Catalog [ALL]
                    </span>
                    <span className="text-[10px] text-[#8b93a7]">/events</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => navigateTo("/events?free_only=true")}
                    className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#171924] hover:text-[#00ff66] text-[#f4f5f8] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[#00f0ff]" />
                      Free Registration Events
                    </span>
                    <span className="text-[10px] text-[#8b93a7]">Filter: INR 0</span>
                  </Command.Item>
                </Command.Group>

                {events.length > 0 && (
                  <Command.Group heading="LIVE EVENTS DATABASE" className="text-[11px] font-bold text-[#00f0ff] px-2 py-1 tracking-wider mt-2 border-t border-[#232635] pt-2">
                    {events.slice(0, 15).map((evt) => (
                      <Command.Item
                        key={evt.id}
                        value={`${evt.name} ${evt.category} ${evt.tags?.join(" ")}`}
                        onSelect={() => navigateTo(`/events/${evt.id}`)}
                        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#171924] hover:text-[#00ff66] text-[#f4f5f8] transition-colors"
                      >
                        <div className="flex flex-col truncate pr-2">
                          <span className="truncate font-medium">{evt.name}</span>
                          <span className="text-[10px] text-[#8b93a7]">
                            [{evt.category}] • {evt.price === 0 ? "FREE" : `₹${evt.price}`}
                          </span>
                        </div>
                        <Calendar className="w-3.5 h-3.5 text-[#555c70] shrink-0" />
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
              </Command.List>

              <div className="flex items-center justify-between px-3 py-2 border-t border-[#232635] bg-[#10121a] text-[10px] font-mono text-[#8b93a7]">
                <span>NAVIGATE: ↑↓ ARROWS</span>
                <span>EXECUTE: ENTER</span>
                <span>DISMISS: ESC</span>
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
