"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { Sparkles, Menu, X, Ticket } from "lucide-react";
import { CommandPalette } from "./command-palette";
import type { EventSummary } from "@/lib/types";

export function Navbar({ events = [] }: { events?: EventSummary[] }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events Catalog" },
    { href: "/#schedule", label: "Schedule" },
    { href: "/dashboard", label: "My Passes" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <NextLink
          href="/"
          className="group flex items-center gap-2.5 focus-visible:outline-none"
          aria-label="NexusFest 2026 Homepage"
        >
          <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-white/15 flex items-center justify-center text-white font-bold text-sm group-hover:border-emerald-400/50 transition-colors">
            NF
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base tracking-tight text-white group-hover:text-zinc-200 transition-colors">
              NexusFest
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              &apos;26
            </span>
          </div>
        </NextLink>

        {/* Live event indicator dot */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-white/10 text-xs text-zinc-300 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span>OCT 16–18 • COIMBATORE</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <NextLink
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-zinc-800/80 text-white font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                }`}
              >
                {link.label}
              </NextLink>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <CommandPalette events={events} />

          <NextLink
            href="/events"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 transition-colors"
          >
            <Ticket className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Explore 30 Events</span>
          </NextLink>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white border border-white/10 bg-zinc-900"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-zinc-950/95 px-6 py-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <NextLink
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-zinc-800 text-white font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {link.label}
              </NextLink>
            );
          })}
          <div className="pt-2">
            <NextLink
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white text-zinc-950 font-semibold text-xs text-center"
            >
              <Ticket className="w-4 h-4" />
              Explore All Events
            </NextLink>
          </div>
        </div>
      )}
    </header>
  );
}
