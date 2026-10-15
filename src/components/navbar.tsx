"use client";

import React, { useState } from "react";
import Link from "next/navigation";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { Terminal, Menu, X, Radio, Ticket, Compass } from "lucide-react";
import { CommandPalette } from "./command-palette";
import type { EventSummary } from "@/lib/types";

export function Navbar({ events = [] }: { events?: EventSummary[] }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "HOME", code: "01" },
    { href: "/events", label: "CATALOG", code: "02" },
    { href: "/#timeline", label: "SCHEDULE", code: "03" },
    { href: "/dashboard", label: "MY_TICKETS", code: "04" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#232635] bg-[#090a0f]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <NextLink
          href="/"
          className="group flex items-center gap-3 focus-visible:outline-none"
          aria-label="NexusFest 2026 Homepage"
        >
          <div className="w-8 h-8 bg-[#00ff66] flex items-center justify-center text-[#090a0f] font-mono font-bold text-base shadow-brutal-sm group-hover:bg-[#00f0ff] transition-colors">
            NF
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-base tracking-wider text-[#f4f5f8] group-hover:text-[#00ff66] transition-colors">
              NEXUSFEST<span className="text-[#00ff66]">.26</span>
            </span>
            <span className="font-mono text-[9px] text-[#8b93a7] tracking-widest uppercase">
              // TECHFEST_CORE
            </span>
          </div>
        </NextLink>

        {/* Live System Signal Badge */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-[#10121a] border border-[#232635] text-[11px] font-mono text-[#8b93a7]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff66]"></span>
          </span>
          <span className="text-[#00ff66] font-medium">SYS.ACTIVE</span>
          <span className="text-[#555c70]">|</span>
          <span>LATENCY: 42MS</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-xs" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <NextLink
                key={link.href}
                href={link.href}
                className={`px-3 py-2 transition-colors border ${
                  isActive
                    ? "bg-[#171924] text-[#00ff66] border-[#00ff66] shadow-brutal-sm font-semibold"
                    : "border-transparent text-[#8b93a7] hover:text-[#f4f5f8] hover:border-[#232635]"
                }`}
              >
                <span className="text-[#555c70] text-[10px] mr-1.5">[{link.code}]</span>
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
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold bg-[#00ff66] text-[#090a0f] shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <Ticket className="w-3.5 h-3.5" aria-hidden="true" />
            <span>DISCOVER [30]</span>
          </NextLink>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="md:hidden p-2 text-[#8b93a7] hover:text-[#f4f5f8] border border-[#232635] bg-[#10121a]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#232635] bg-[#090a0f] px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <NextLink
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 font-mono text-sm border ${
                  isActive
                    ? "border-[#00ff66] bg-[#171924] text-[#00ff66] shadow-brutal-sm"
                    : "border-[#232635] text-[#8b93a7] hover:text-[#f4f5f8]"
                }`}
              >
                <span className="text-[#555c70] text-xs mr-2">[{link.code}]</span>
                {link.label}
              </NextLink>
            );
          })}
          <div className="pt-2">
            <NextLink
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#00ff66] text-[#090a0f] font-mono font-bold text-xs shadow-brutal-sm"
            >
              <Ticket className="w-4 h-4" />
              VIEW ALL EVENTS
            </NextLink>
          </div>
        </div>
      )}
    </header>
  );
}
