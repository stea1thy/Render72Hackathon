"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, QrCode, RotateCw, MapPin, Calendar, Ticket } from "lucide-react";

export default function HeroSection({ totalEvents = 30 }: { totalEvents?: number }) {
  // Interactive 3D Card State
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isFlipped, setIsFlipped] = useState(false);

  // Shared single ticking clock for countdown
  const [timeLeft, setTimeLeft] = useState({ days: 27, hours: 9, mins: 11, secs: 34 });

  useEffect(() => {
    const target = new Date("2026-11-10T09:00:00+05:30").getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotation({ x: rotateX, y: rotateY });
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 0.18 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] bg-[#09090B] text-zinc-50 flex items-center overflow-hidden border-b border-white/[0.08]">
      {/* Subtle radial ambient glow + ultra-faint architectural grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl w-full px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* LEFT COLUMN: Clean Editorial Tech-Fest Pitch */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-8">
          
          {/* Top Event Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-xs font-mono text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OCT 16–18, 2026</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">COIMBATORE &amp; ONLINE</span>
          </div>

          {/* High-Impact Headline (Clean, tight, not stretched) */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] text-white">
            Build the future. <br />
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              Ship under pressure.
            </span>
          </h1>

          {/* Human, authentic description */}
          <p className="max-w-xl text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            NexusFest is our annual national technology and cultural festival. 
            Join 5,000+ builders across {totalEvents} flagship hackathons, autonomous robotics 
            arenas, and deep-dive engineering workshops.
          </p>

          {/* Sleek Hairline Countdown Bar */}
          <div className="w-full max-w-md rounded-xl bg-zinc-900/60 border border-white/10 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-3">
              <span>Registration Closes In</span>
              <span className="text-emerald-400">● Live Window</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Mins", value: timeLeft.mins },
                { label: "Secs", value: timeLeft.secs },
              ].map((item) => (
                <div key={item.label} className="bg-zinc-950/80 border border-white/[0.06] rounded-lg py-2.5">
                  <div className="text-2xl sm:text-3xl font-semibold text-white tabular-nums">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 mt-0.5">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High-Contrast Vercel-Style Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/events"
              className="inline-flex items-center gap-2.5 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
            >
              <span>Explore All {totalEvents} Events</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/events?is_featured=true"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 border border-white/15 px-5 py-3.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800 hover:border-white/25"
            >
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Featured Flagships</span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive 3D Holographic Festival Pass Centerpiece */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y + (isFlipped ? 180 : 0)}deg)`,
              transformStyle: "preserve-3d",
            }}
            className="relative w-full max-w-[340px] h-[460px] cursor-pointer transition-transform duration-300 ease-out select-none"
            role="button"
            tabIndex={0}
            aria-label="Interactive Festival Pass. Click to flip."
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setIsFlipped(!isFlipped)}
          >
            {/* Lanyard Clip Slot at Top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-zinc-800 border border-white/20 rounded-t-md flex items-center justify-center z-20">
              <div className="w-8 h-1.5 rounded-full bg-zinc-950" />
            </div>

            {/* FRONT OF PASS */}
            <div
              style={{ backfaceVisibility: "hidden" }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-[#09090B] border border-white/15 p-6 flex flex-col justify-between shadow-2xl overflow-hidden"
            >
              {/* Dynamic Holographic Glare Overlay */}
              <div
                style={{
                  background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(16, 185, 129, 0.35), transparent 60%)`,
                  opacity: glare.opacity,
                }}
                className="pointer-events-none absolute inset-0 transition-opacity duration-200"
              />

              {/* Pass Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                    All-Access Credential
                  </p>
                  <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
                    NEXUSFEST &apos;26
                  </h2>
                </div>
                <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Ticket className="h-4 w-4 text-emerald-400" />
                </div>
              </div>

              {/* Center Graphic / Badge Info */}
              <div className="my-auto space-y-4 py-4">
                <div className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-medium">
                  VIP DELEGATE PASS
                </div>

                <div className="space-y-2 text-xs font-mono text-zinc-400">
                  <div className="flex items-center justify-between py-1.5 border-b border-white/[0.06]">
                    <span className="flex items-center gap-1.5 text-zinc-500">
                      <Calendar className="h-3.5 w-3.5" /> DATES
                    </span>
                    <span className="text-zinc-200">16–18 OCT 2026</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-white/[0.06]">
                    <span className="flex items-center gap-1.5 text-zinc-500">
                      <MapPin className="h-3.5 w-3.5" /> ARENA
                    </span>
                    <span className="text-zinc-200">MAIN CAMPUS + ONLINE</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-zinc-500">PRIZE POOL</span>
                    <span className="text-emerald-400 font-semibold">₹1,50,000+</span>
                  </div>
                </div>
              </div>

              {/* Pass Footer Barcode / Flip Hint */}
              <div className="pt-4 border-t border-dashed border-white/15 flex items-center justify-between">
                <div className="font-mono text-[11px] text-zinc-400">
                  <span className="block text-zinc-200 font-medium">CLICK TO FLIP PASS</span>
                  <span>ID: NF26-8841-X</span>
                </div>
                <QrCode className="h-10 w-10 text-zinc-300" />
              </div>
            </div>

            {/* BACK OF PASS (Flipped 180deg) */}
            <div
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
              className="absolute inset-0 rounded-2xl bg-zinc-900 border border-emerald-500/30 p-6 flex flex-col justify-between shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                  ● Verified Entry Pass
                </span>
                <RotateCw className="h-4 w-4 text-zinc-400" />
              </div>

              <div className="my-auto flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-xl bg-white text-zinc-950">
                  <QrCode className="h-28 w-28" />
                </div>
                <p className="text-xs font-mono text-zinc-300 max-w-[220px]">
                  Register for any event in the catalog to unlock your personal QR check-in pass.
                </p>
              </div>

              <Link
                href="/events"
                onClick={(e) => e.stopPropagation()}
                className="w-full py-3 rounded-lg bg-emerald-400 text-zinc-950 font-semibold text-xs font-mono uppercase tracking-wider text-center hover:bg-emerald-300 transition"
              >
                Claim Your Spot →
              </Link>
            </div>
          </div>

          <p className="mt-4 text-xs font-mono text-zinc-500 flex items-center gap-1.5">
            <RotateCw className="h-3 w-3" /> Hover to tilt • Click pass to flip
          </p>
        </div>

      </div>
    </section>
  );
}
