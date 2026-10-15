"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, ArrowUpRight } from "lucide-react";
import { SearchModal } from "./search-modal";
import type { EventSummary } from "@/lib/types";

export function Navbar({
  onOpenCommandPalette,
  events = [],
}: {
  onOpenCommandPalette?: () => void;
  events?: EventSummary[];
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/events", label: "EVENTS" },
    { href: "/schedule", label: "SCHEDULE" },
    { href: "/passes", label: "MY PASSES" },
  ];

  // Global Cmd+K / Ctrl+K keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (onOpenCommandPalette) {
          onOpenCommandPalette();
        } else {
          setIsSearchOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenCommandPalette]);

  const handleOpenSearch = () => {
    if (onOpenCommandPalette) {
      onOpenCommandPalette();
    } else {
      setIsSearchOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1B0E40]/95 backdrop-blur-md border-b-2 border-[#38208C] text-white select-none">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen:wght@400;700&display=swap');
        .font-pixel-block { font-family: 'Press Start 2P', monospace; }
        .font-pixel-clean { font-family: 'Silkscreen', monospace; }
      `}</style>

      {/* Redesigned Central Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        events={events}
      />

      <div className="mx-auto max-w-7xl h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* LEFT: Custom 16x16 Pixel-Art Prism Emblem + Two-Tone Wordmark + Clean 2026 Tag */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Custom 16x16 Pixel-Art Star/Prism Icon Badge */}
          <div className="relative h-9 w-9 bg-[#12072B] border-2 border-[#FFFDF2] shadow-[3px_3px_0px_#E63E9B] flex items-center justify-center group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0px_#E63E9B] transition-all">
            <svg
              viewBox="0 0 16 16"
              className="w-6 h-6"
              shapeRendering="crispEdges"
            >
              {/* Outer Magenta Glow Pixels */}
              <rect x="7" y="1" width="2" height="2" fill="#E63E9B" />
              <rect x="7" y="13" width="2" height="2" fill="#E63E9B" />
              <rect x="1" y="7" width="2" height="2" fill="#E63E9B" />
              <rect x="13" y="7" width="2" height="2" fill="#E63E9B" />
              {/* Gold & Cyan 4-Point Pixel Star Body */}
              <rect x="7" y="3" width="2" height="10" fill="#FFE699" />
              <rect x="3" y="7" width="10" height="2" fill="#FFE699" />
              <rect x="5" y="5" width="6" height="6" fill="#A5E8FF" />
              {/* Pure White Core */}
              <rect x="6" y="6" width="4" height="4" fill="#FFFFFF" />
              <rect x="7" y="7" width="2" height="2" fill="#1B0E40" />
            </svg>
          </div>

          {/* Two-Tone Pixel Wordmark + Properly Centered 2026 Cartridge Pill */}
          <div className="flex items-center gap-2">
            <span className="font-pixel-block text-xs sm:text-sm tracking-tight text-white drop-shadow-[2px_2px_0px_#0D0521] flex items-center">
              <span>NEXUS</span>
              <span className="text-[#A5E8FF]">FEST</span>
            </span>

            <span className="font-pixel-clean inline-flex items-center justify-center bg-[#E63E9B] text-[#FFFDF2] border-2 border-[#100526] px-1.5 py-0.5 text-[10px] font-bold leading-none shadow-[2px_2px_0px_#100526]">
              2026
            </span>
          </div>
        </Link>

        {/* CENTER: Minimal Pixel Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-pixel-clean px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-[#FFFDF2] text-[#1B0E40] border-2 border-[#100526] shadow-[2px_2px_0px_#E63E9B]"
                    : "text-[#D8E2FF] hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Clean Navbar Search Trigger Button (No messy ⌘K box) + Pixel CTA */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenSearch}
            aria-label="Search events"
            className="inline-flex items-center gap-2.5 min-h-[40px] px-4 py-2 bg-[#1B0E40] border-2 border-[#492191] hover:border-[#FFF3B8] hover:bg-[#231154] text-[#D6E4FF] hover:text-[#FFF3B8] font-pixel-clean text-xs uppercase tracking-wider shadow-[3px_3px_0px_#090318] active:translate-x-[1px] active:translate-y-[1px] transition-all rounded-none cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#E63E9B] shrink-0" />
            <span>SEARCH</span>
          </button>

          <Link
            href="/events"
            className="font-pixel-clean inline-flex items-center gap-1.5 bg-[#FFFDF2] text-[#1B0E40] border-2 border-[#100526] px-3.5 py-1.5 text-xs font-bold uppercase shadow-[3px_3px_0px_#E63E9B] hover:bg-[#FFE699] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <span>EVENTS</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={handleOpenSearch}
            aria-label="Search events"
            className="inline-flex items-center justify-center min-h-[40px] min-w-[40px] p-2 bg-[#1B0E40] border-2 border-[#492191] hover:border-[#FFF3B8] text-[#FFF3B8] rounded-none cursor-pointer shadow-[2px_2px_0px_#090318]"
          >
            <Search className="h-4 w-4 text-[#E63E9B]" />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="p-2 bg-[#FFFDF2] text-[#1B0E40] border-2 border-[#100526] shadow-[2px_2px_0px_#E63E9B] rounded-none"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#160933] border-b-4 border-[#100526] px-4 py-4 space-y-2 font-pixel-clean">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 text-xs font-bold text-white hover:bg-[#6B2BB5]"
            >
              ► {link.label}
            </Link>
          ))}
          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-center py-2.5 mt-2 bg-[#FFFDF2] text-[#1B0E40] border-2 border-[#100526] text-xs font-bold shadow-[3px_3px_0px_#E63E9B]"
          >
            EXPLORE ALL 30 EVENTS →
          </Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;
