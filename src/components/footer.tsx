"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-gradient-to-b from-[#14082E] via-[#0B041C] to-[#060210] text-white border-t-4 border-[#492191] overflow-hidden select-none">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen:wght@400;700&display=swap');
        .font-pixel-block { font-family: 'Press Start 2P', monospace; }
        .font-pixel-clean { font-family: 'Silkscreen', monospace; }

        .nexus-faded-watermark {
          background: linear-gradient(
            180deg,
            rgba(230, 62, 155, 0.38) 0%,
            rgba(107, 43, 181, 0.22) 48%,
            rgba(27, 14, 64, 0.04) 88%,
            transparent 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-stroke: 1px rgba(165, 232, 255, 0.12);
        }
      `}</style>

      {/* Top Pixel Dither Accent Strip */}
      <div className="h-2 w-full bg-[repeating-linear-gradient(90deg,#492191_0px,#492191_8px,#1B0E40_8px,#1B0E40_16px)]" />

      <div className="mx-auto max-w-7xl px-6 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b-2 border-[#38208C]/60">
          
          {/* Left: Brand Identity (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="h-9 w-9 bg-[#12072B] border-2 border-[#FFFDF2] shadow-[3px_3px_0px_#E63E9B] flex items-center justify-center">
                <svg viewBox="0 0 16 16" className="w-6 h-6" shapeRendering="crispEdges">
                  <rect x="7" y="1" width="2" height="2" fill="#E63E9B" />
                  <rect x="7" y="13" width="2" height="2" fill="#E63E9B" />
                  <rect x="1" y="7" width="2" height="2" fill="#E63E9B" />
                  <rect x="13" y="7" width="2" height="2" fill="#E63E9B" />
                  <rect x="7" y="3" width="2" height="10" fill="#FFE699" />
                  <rect x="3" y="7" width="10" height="2" fill="#FFE699" />
                  <rect x="5" y="5" width="6" height="6" fill="#A5E8FF" />
                  <rect x="6" y="6" width="4" height="4" fill="#FFFFFF" />
                  <rect x="7" y="7" width="2" height="2" fill="#1B0E40" />
                </svg>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-pixel-block text-sm tracking-tight text-white">
                  NEXUS<span className="text-[#A5E8FF]">FEST</span>
                </span>
                <span className="font-pixel-clean bg-[#E63E9B] text-[#FFFDF2] border-2 border-[#100526] px-1.5 py-0.5 text-[10px] font-bold leading-none">
                  2026
                </span>
              </div>
            </Link>

            <p className="font-mono text-xs sm:text-sm text-[#D8E2FF]/75 max-w-md leading-relaxed">
              Annual national technology, design, and cultural festival. Three days of
              high-stakes hackathons, autonomous robotics arenas, and flagship stage showdowns.
            </p>

            <div className="inline-flex items-center gap-2 bg-[#1B0E40] border-2 border-[#492191] px-3 py-1 font-pixel-clean text-[11px] text-[#FFF3B8]">
              <span className="h-2 w-2 bg-[#E63E9B]" />
              <span>OCT 16–18, 2026 • COIMBATORE &amp; ONLINE</span>
            </div>
          </div>

          {/* Right: Clean 2-Column Navigation Links (5 cols) */}
          <div className="md:col-span-5 grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-pixel-clean text-xs font-bold uppercase tracking-wider text-[#FFF3B8]">
                NAVIGATION
              </h3>
              <ul className="space-y-2.5 font-pixel-clean text-xs text-[#D8E2FF]/80">
                <li>
                  <Link href="/" className="hover:text-[#FFF3B8] transition-colors">
                    ► Home
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="hover:text-[#FFF3B8] transition-colors">
                    ► All 30 Events
                  </Link>
                </li>
                <li>
                  <Link href="/schedule" className="hover:text-[#FFF3B8] transition-colors">
                    ► 3-Day Schedule
                  </Link>
                </li>
                <li>
                  <Link href="/passes" className="hover:text-[#FFF3B8] transition-colors">
                    ► My Passes
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-pixel-clean text-xs font-bold uppercase tracking-wider text-[#A5E8FF]">
                ARENAS
              </h3>
              <ul className="space-y-2.5 font-pixel-clean text-xs text-[#D8E2FF]/80">
                <li>
                  <Link
                    href="/events?is_featured=true"
                    className="hover:text-[#A5E8FF] transition-colors"
                  >
                    ► Flagships
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events?is_technical=true"
                    className="hover:text-[#A5E8FF] transition-colors"
                  >
                    ► Technical Track
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events?event_type=WORKSHOP"
                    className="hover:text-[#A5E8FF] transition-colors"
                  >
                    ► Workshops
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events?event_mode=ONLINE"
                    className="hover:text-[#A5E8FF] transition-colors"
                  >
                    ► Online Events
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Metadata Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-pixel-clean text-[11px] text-[#D8E2FF]/60">
          <div>© 2026 NEXUSFEST • AMRITA VISHWA VIDYAPEETHAM</div>

          <div className="flex items-center gap-2 text-[#D8E2FF]/80">
            <span>THREE DAYS TO CREATE, ONE SHOT TO WIN</span>
            <span className="text-[#E63E9B]">✦</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-[#FFF3B8] hover:text-white transition-colors cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Giant Faded Pixel Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none w-full overflow-hidden flex justify-center pt-2 -mb-3 sm:-mb-6"
      >
        <div className="font-pixel-block text-[10.8vw] leading-none tracking-tighter whitespace-nowrap nexus-faded-watermark">
          NEXUSFEST
        </div>
      </div>
    </footer>
  );
}

export default Footer;
