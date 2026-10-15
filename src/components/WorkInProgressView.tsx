import React from "react";
import Link from "next/link";
import { Compass, Home, Sparkles, Calendar, QrCode, Wrench } from "lucide-react";

interface WorkInProgressViewProps {
  variant: "passes" | "schedule";
  backgroundImageUrl?: string;
}

export function WorkInProgressView({
  variant,
  backgroundImageUrl = "/stage-wip-bg.jpg",
}: WorkInProgressViewProps) {
  const isPasses = variant === "passes";

  return (
    <section className="relative min-h-[calc(100vh-4.5rem)] w-full bg-[#120829] overflow-hidden flex items-center justify-center px-4 py-16">
      {/* 1. Bold, Clearly Visible 8-Bit Concert Stage Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 overflow-hidden"
      >
        {/* Stage Artwork: Crisp, high-visibility opacity with vibrant lighting */}
        <img
          src={backgroundImageUrl}
          alt=""
          className="w-full h-full object-cover object-center opacity-85 scale-[1.01] filter brightness-90 contrast-110 saturate-115"
        />

        {/* Targeted radial scrim directly behind the center card so text never clashes */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(18,8,41,0.80)_0%,rgba(18,8,41,0.30)_60%,rgba(18,8,41,0.88)_100%)]" />

        {/* Top fade (melts into navbar) */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#120829] to-transparent" />

        {/* Bottom fade (melts into footer) */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#120829] to-transparent" />

        {/* Retro 8-bit CRT scanline overlay */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(9,3,24,0.6) 0px, rgba(9,3,24,0.6) 1px, transparent 1px, transparent 3px)",
          }}
        />
      </div>

      {/* 2. High-Contrast 8-Bit "Work in Progress" Centerpiece Frame (Opaque Surface = Zero Text Clashing) */}
      <div className="relative z-10 max-w-2xl w-full bg-[#140930]/95 backdrop-blur-md border-2 border-[#FFF3B8] shadow-[8px_8px_0px_#090318] p-6 sm:p-10 text-center rounded-none">
        {/* Inner pixel frame border */}
        <div className="pointer-events-none absolute inset-1.5 border border-[#492191]" />

        {/* 4 Corner Pixel Rivets */}
        <span className="pointer-events-none absolute top-3 left-3 w-2.5 h-2.5 bg-[#FFF3B8]" />
        <span className="pointer-events-none absolute top-3 right-3 w-2.5 h-2.5 bg-[#FFF3B8]" />
        <span className="pointer-events-none absolute bottom-3 left-3 w-2.5 h-2.5 bg-[#FFF3B8]" />
        <span className="pointer-events-none absolute bottom-3 right-3 w-2.5 h-2.5 bg-[#FFF3B8]" />

        {/* Top Magenta Pixel Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#E63E9B] border border-[#FFF3B8] text-white font-pixel-clean text-[11px] uppercase tracking-widest shadow-[3px_3px_0px_#090318] mb-6">
          <Wrench className="w-3.5 h-3.5 text-[#FFF3B8]" />
          <span>WORK IN PROGRESS // COMING SOON</span>
        </div>

        {/* 8-Bit Icon Cartridge */}
        <div className="mx-auto mb-5 w-16 h-16 bg-[#1B0E40] border-2 border-[#A5E8FF] shadow-[4px_4px_0px_#090318] flex items-center justify-center text-[#A5E8FF]">
          {isPasses ? <QrCode className="w-7 h-7" /> : <Calendar className="w-7 h-7" />}
        </div>

        {/* Main 8-Bit Title */}
        <h1 className="font-pixel-block text-xl sm:text-2xl md:text-3xl text-white leading-snug tracking-wide uppercase">
          {isPasses ? "My Passes" : "Festival Schedule"}
        </h1>

        <p className="mt-2 font-pixel-clean text-xs sm:text-sm text-[#FFF3B8] uppercase tracking-widest">
          ✦ THIS SECTION IS CURRENTLY WORK IN PROGRESS ✦
        </p>

        {/* Clean Description */}
        <p className="mt-4 font-mono text-xs sm:text-sm text-[#D6E4FF]/90 leading-relaxed max-w-lg mx-auto">
          {isPasses
            ? "We are building the digital pass wallet and live QR check-in generator for NEXUSFEST 2026. Browse the 30 flagship events and lock in your spots while we finish this module."
            : "We are finalizing the master 3-day stage and arena timetable for October 16–18, 2026. You can already check individual event dates and timings directly on every event card."}
        </p>

        {/* 8-Bit Segmented Build Progress Meter */}
        <div className="mt-7 max-w-md mx-auto bg-[#1B0E40] border-2 border-[#492191] p-3.5 shadow-[4px_4px_0px_#090318]">
          <div className="flex items-center justify-between font-pixel-clean text-[10px] uppercase tracking-wider mb-2">
            <span className="inline-flex items-center gap-1.5 text-[#A5E8FF]">
              <Sparkles className="w-3 h-3 text-[#E63E9B]" />
              BUILD STATUS: IN PROGRESS
            </span>
            <span className="text-[#FFF3B8]">OCT 16–18, 2026</span>
          </div>
          <div className="grid grid-cols-10 gap-1.5">
            {Array.from({ length: 10 }).map((_, idx) => (
              <span
                key={idx}
                className={`h-2.5 rounded-none ${
                  idx < 7
                    ? "bg-[#E63E9B] border border-[#FFF3B8]/60"
                    : "bg-[#120829] border border-[#492191]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons (>= 44px touch targets) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 bg-[#FFFDF2] text-[#1B0E40] border-2 border-[#1B0E40] font-pixel-clean text-xs uppercase tracking-wider shadow-[4px_4px_0px_#E63E9B] hover:bg-[#FFF3B8] active:translate-x-[2px] active:translate-y-[2px] transition-all rounded-none"
          >
            <Compass className="w-4 h-4 text-[#E63E9B]" />
            <span>EXPLORE 30 EVENTS</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 bg-[#1B0E40] text-[#FFF3B8] border-2 border-[#FFF3B8] font-pixel-clean text-xs uppercase tracking-wider shadow-[4px_4px_0px_#090318] hover:bg-[#231154] active:translate-x-[2px] active:translate-y-[2px] transition-all rounded-none"
          >
            <Home className="w-4 h-4 text-[#A5E8FF]" />
            <span>BACK TO HOME</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
