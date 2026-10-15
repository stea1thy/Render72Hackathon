"use client";

import React, { useEffect, useState } from "react";

// The render-blocking <head> snippet lives in "@/lib/first-load-intro-script".

const BLOCK_COUNT = 10;

/**
 * First-visit 8-bit CRT shutter intro.
 *
 * - SSR-rendered so it covers the hero from the very first paint (no flash),
 *   while the hero DOM stays fully rendered underneath (LCP is unaffected:
 *   nothing in the hero is hidden with opacity: 0 or delayed).
 * - All timing is pure CSS (see `.nf-intro*` in globals.css), so it always
 *   clears in ~850ms even if JS hydration is slow.
 * - `pointer-events-none` — the page is interactive the whole time.
 * - Unmounts itself after the sequence to keep the DOM clean.
 */
export function FirstLoadIntro() {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const isPlaying = document.documentElement.getAttribute("data-nf-intro") === "play";
    const timer = window.setTimeout(() => setMounted(false), isPlaying ? 1000 : 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="nf-intro pointer-events-none fixed inset-0 z-[120] overflow-hidden flex flex-col justify-between"
    >
      {/* Top 8-Bit Shutter Half */}
      <div className="nf-intro-top relative w-full h-1/2 bg-[#120829] border-b-2 border-[#E63E9B]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(9,3,24,0.7) 0px, rgba(9,3,24,0.7) 1px, transparent 1px, transparent 3px)",
          }}
        />
      </div>

      {/* Bottom 8-Bit Shutter Half */}
      <div className="nf-intro-bottom relative w-full h-1/2 bg-[#120829] border-t-2 border-[#FFF3B8]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(9,3,24,0.7) 0px, rgba(9,3,24,0.7) 1px, transparent 1px, transparent 3px)",
          }}
        />
      </div>

      {/* Center 8-Bit Boot Box */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="nf-intro-box relative bg-[#140930] border-2 border-[#FFF3B8] shadow-[6px_6px_0px_#090318] p-5 max-w-xs w-full text-center rounded-none">
          {/* 4 Corner Pixel Rivets */}
          <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 bg-[#FFF3B8]" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FFF3B8]" />
          <span className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 bg-[#FFF3B8]" />
          <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 bg-[#FFF3B8]" />

          <div className="font-pixel-block text-xs sm:text-sm text-white tracking-wider uppercase">
            NEXUS<span className="text-[#A5E8FF]">FEST</span> 2026
          </div>
          <div className="mt-2 font-pixel-clean text-[10px] text-[#FFF3B8] uppercase tracking-widest">
            INITIALIZING NEXUSFEST 2026...
          </div>

          {/* 10-Block 8-Bit Progress Bar */}
          <div className="mt-3.5 grid grid-cols-10 gap-1 bg-[#120829] p-1.5 border border-[#492191]">
            {Array.from({ length: BLOCK_COUNT }).map((_, idx) => (
              <span
                key={idx}
                className="nf-intro-block h-2.5"
                style={{ "--i": idx } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirstLoadIntro;
