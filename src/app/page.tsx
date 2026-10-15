import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getEvents } from "@/lib/api";
import type { EventSummary } from "@/lib/types";
import { FeaturedEventsCarousel } from "@/components/featured-events-carousel";
import HeroSection from "@/components/hero-section";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  AnimatedStatCartridges,
  AnimatedThreeDaySection,
  AnimatedCategoryTiles,
} from "@/components/HomeSections";

export const revalidate = 60; // ISR revalidate

// Tactile arcade press response shared by primary/secondary CTAs
const PIXEL_PRESS =
  "transition-[translate,box-shadow,background-color] duration-150 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#E63E9B] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#090318]";

export default async function HomePage() {
  let events: EventSummary[] = [];
  try {
    events = await getEvents();
  } catch (err) {
    console.warn("[HomePage SSR] Could not load events:", err);
    events = [];
  }

  // Featured events from API
  const featuredEvents = events.filter((e) => e.is_featured);

  return (
    <div className="min-h-screen flex flex-col space-y-20 pb-24 nexus-page-bg text-white selection:bg-[#E63E9B] selection:text-white select-none">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen:wght@400;700&display=swap');
        .font-pixel-block { font-family: 'Press Start 2P', monospace; }
        .font-pixel-clean { font-family: 'Silkscreen', monospace; }
      `}</style>

      {/* Hero Section with 8-Bit Dithered Sunset & Giant 3D Pixel Wordmark */}
      <HeroSection totalEvents={events.length || 30} />

      {/* 4 Cartridge Stats Modules (cascade pop-up 0 / 90 / 180 / 270ms) */}
      <section className="max-w-7xl mx-auto px-6 w-full overflow-x-clip">
        <AnimatedStatCartridges />
      </section>

      {/* Featured Events Showcase */}
      {featuredEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 w-full space-y-8 overflow-x-clip">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[#38208C]/40 pb-6">
            <ScrollReveal variant="slide-left">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-[#E63E9B] text-[#FFFDF2] border-2 border-[#100526] px-2.5 py-1 font-pixel-clean text-xs shadow-[2px_2px_0px_#090318]">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>FEATURED COMPETITIONS</span>
                </div>
                <h2 className="font-pixel-block text-xl sm:text-3xl text-[#FFFDF2] drop-shadow-[3px_3px_0px_#090318]">
                  Flagship Challenges
                </h2>
                <p className="font-mono text-sm text-[#D8E2FF]/80 max-w-lg">
                  Curated hackathons, robotics face-offs, and masterclasses headlined by industry engineers.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="slide-right" delayMs={120} className="self-start sm:self-auto shrink-0">
              <Link
                href="/events"
                className={`inline-flex items-center gap-2 min-h-[44px] bg-[#FFFDF2] text-[#1B0E40] border-2 border-[#100526] px-4 py-2 font-pixel-clean text-xs font-bold shadow-[3px_3px_0px_#E63E9B] hover:bg-[#FFE699] ${PIXEL_PRESS}`}
              >
                <span>VIEW ALL 30 EVENTS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </ScrollReveal>
          </div>

          <FeaturedEventsCarousel events={featuredEvents} />
        </section>
      )}

      {/* Schedule Timeline Section */}
      <section id="schedule" className="max-w-7xl mx-auto px-6 w-full overflow-x-clip">
        <AnimatedThreeDaySection />
      </section>

      {/* Category Quick Launch Grid */}
      <section className="max-w-7xl mx-auto px-6 w-full overflow-x-clip">
        <AnimatedCategoryTiles />
      </section>

      {/* High-Contrast Conversion Banner */}
      <section className="max-w-7xl mx-auto px-6 w-full overflow-x-clip">
        <ScrollReveal variant="pop-up">
          <div className="p-8 sm:p-12 bg-[#1B0E40] border-[3px] border-[#492191] rounded-none shadow-[6px_6px_0px_#090318] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="space-y-2 text-center md:text-left z-10">
              <span className="font-pixel-clean text-xs uppercase tracking-wider text-[#E63E9B] font-bold">
                READY TO TAKE THE STAGE?
              </span>
              <h2 className="font-pixel-block text-xl sm:text-3xl text-white drop-shadow-[2px_2px_0px_#090318] leading-snug">
                Assemble your team. Claim your spot.
              </h2>
              <p className="font-mono text-sm text-[#D8E2FF]/80 max-w-lg">
                Registration is open across all 30 competitive rounds and workshops. Generate your virtual QR pass in seconds.
              </p>
            </div>

            <Link
              href="/events"
              className={`px-6 py-3.5 min-h-[44px] rounded-none bg-[#FFFDF2] text-[#1B0E40] border-2 border-[#100526] font-pixel-clean font-bold text-xs uppercase shadow-[4px_4px_0px_#E63E9B] hover:bg-[#FFE699] inline-flex items-center gap-2 shrink-0 z-10 ${PIXEL_PRESS}`}
            >
              <span>Explore All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
