import React from "react";
import Link from "next/link";
import {
  Terminal,
  Zap,
  ArrowRight,
  Shield,
  Cpu,
  Trophy,
  Users,
  Compass,
  Calendar,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { getEvents } from "@/lib/api";
import type { EventSummary } from "@/lib/types";
import { EventCard } from "@/components/event-card";
import { KickoffCountdown } from "@/components/kickoff-countdown";

export const revalidate = 60; // ISR revalidate

export default async function HomePage() {
  let events: EventSummary[] = [];
  try {
    events = await getEvents();
  } catch (err) {
    console.warn("[HomePage SSR] Could not load events:", err);
    events = [];
  }

  // 6 featured events from API
  const featuredEvents = events.filter((e) => e.is_featured);

  return (
    <div className="min-h-screen flex flex-col space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative w-full pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-cyber-grid border-b border-[#232635]">
        {/* Scanline subtle overlay */}
        <div className="scanline-overlay absolute inset-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col space-y-8">
          {/* Terminal Telemetry Badge */}
          <div className="flex flex-row items-center gap-2 px-3 py-1.5 bg-[#10121a] border border-[#232635] text-xs font-mono text-[#00ff66] w-fit">
            <Terminal className="w-3.5 h-3.5 text-[#00ff66]" />
            <span>NEXUSFEST // CAMPUS TECHFEST 2026 // PROTOCOL: OMEGA</span>
          </div>

          {/* Hero Main Headline */}
          <div className="flex flex-col space-y-3 max-w-4xl">
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tighter text-[#f4f5f8] uppercase leading-[0.95]">
              ENGINEERING <br />
              <span className="text-[#00ff66] underline decoration-4 decoration-[#00ff66]">
                THE UNCHARTED
              </span>
              .
            </h1>
            <p className="font-sans text-base sm:text-lg text-[#8b93a7] max-w-2xl pt-2 leading-relaxed">
              Welcome to NexusFest 2026: a cyber-brutalist collegiate technology symposium. Compete in 30 high-octane coding hackathons, autonomous combat robotics, and AI summits.
            </p>
          </div>

          {/* Kickoff Countdown Live Ticker in Flex Row */}
          <div className="pt-2 w-fit">
            <KickoffCountdown />
          </div>

          {/* Call to Actions (flex row with gaps) */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/events"
              className="px-6 py-4 bg-[#00ff66] text-[#090a0f] font-mono font-black text-sm shadow-brutal-zinc hover:shadow-brutal-acid hover:translate-x-0.5 hover:translate-y-0.5 transition-all inline-flex items-center gap-2.5 cursor-pointer"
            >
              <span>EXPLORE ALL 30 EVENTS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="px-6 py-4 bg-[#10121a] text-[#f4f5f8] border-2 border-[#232635] hover:border-[#00f0ff] hover:text-[#00f0ff] font-mono text-sm inline-flex items-center gap-2 transition-colors"
            >
              <Zap className="w-4 h-4 text-[#00f0ff]" />
              <span>MY DIGITAL PASS HUB</span>
            </Link>
          </div>

          {/* TOTAL COMPETITIONS stats in a CSS Grid with 4 columns, padding, and borders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 mt-8 bg-[#0a0b10] border border-[#232635]">
            <div className="p-5 bg-[#10121a] border border-[#232635] flex flex-col justify-between">
              <span className="text-[#555c70] block text-[10px] font-mono tracking-wider uppercase">
                TOTAL COMPETITIONS
              </span>
              <span className="text-2xl font-extrabold text-[#00ff66] font-mono mt-2">
                30 MODULES
              </span>
              <span className="text-xs text-[#8b93a7] block font-mono mt-1">
                Hackathons &amp; Arenas
              </span>
            </div>

            <div className="p-5 bg-[#10121a] border border-[#232635] flex flex-col justify-between">
              <span className="text-[#555c70] block text-[10px] font-mono tracking-wider uppercase">
                CUMULATIVE POOL
              </span>
              <span className="text-2xl font-extrabold text-[#00f0ff] font-mono mt-2">
                ₹150,000+
              </span>
              <span className="text-xs text-[#8b93a7] block font-mono mt-1">
                Direct Cash Bounty
              </span>
            </div>

            <div className="p-5 bg-[#10121a] border border-[#232635] flex flex-col justify-between">
              <span className="text-[#555c70] block text-[10px] font-mono tracking-wider uppercase">
                MODALITY
              </span>
              <span className="text-2xl font-extrabold text-[#f4f5f8] font-mono mt-2">
                HYBRID
              </span>
              <span className="text-xs text-[#8b93a7] block font-mono mt-1">
                Campus + Global Online
              </span>
            </div>

            <div className="p-5 bg-[#10121a] border border-[#232635] flex flex-col justify-between">
              <span className="text-[#555c70] block text-[10px] font-mono tracking-wider uppercase">
                EXPECTED DELEGATES
              </span>
              <span className="text-2xl font-extrabold text-[#ffb800] font-mono mt-2">
                5,000+
              </span>
              <span className="text-xs text-[#8b93a7] block font-mono mt-1">
                120+ Collegiate Units
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Showcase */}
      {featuredEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#232635] pb-4">
            <div className="flex flex-col space-y-1">
              <div className="flex flex-row items-center gap-2 text-xs font-mono text-[#00ff66]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>// FLAGSHIP RECON</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#f4f5f8]">
                FEATURED COMPETITIONS<span className="text-[#00ff66]">.</span>
              </h2>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-[#00ff66] hover:underline"
            >
              <span>VIEW COMPLETE PROTOCOL [30]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.slice(0, 6).map((evt, idx) => (
              <EventCard key={evt.id} event={evt} priority={idx === 0} />
            ))}
          </div>
        </section>
      )}

      {/* Scroll-Driven "What's On" Timeline Section */}
      <section
        id="timeline"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-8"
      >
        <div className="border-b border-[#232635] pb-4 flex flex-col space-y-1">
          <div className="flex flex-row items-center gap-2 text-xs font-mono text-[#00f0ff]">
            <Calendar className="w-3.5 h-3.5" />
            <span>// CHRONOLOGICAL DISPATCH</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#f4f5f8]">
            FESTIVAL SCHEDULE TIMELINE<span className="text-[#00f0ff]">.</span>
          </h2>
          <p className="font-sans text-xs text-[#8b93a7]">
            Three days of relentless execution. Hardware battle zones, distributed hackathons, and executive keynotes.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          {/* Day 1 */}
          <div className="p-6 bg-[#10121a] border-2 border-[#232635] hover:border-[#00ff66] transition-colors flex flex-col justify-between space-y-4">
            <div className="flex flex-row items-center justify-between border-b border-[#232635] pb-3 text-xs">
              <span className="text-[#00ff66] font-bold">DAY 01 // 26 OCT</span>
              <span className="text-[#8b93a7]">COMMENCEMENT</span>
            </div>
            <h3 className="font-display font-bold text-lg text-[#f4f5f8]">
              ALGORITHM &amp; DEV SPRINT
            </h3>
            <p className="font-sans text-xs text-[#8b93a7] leading-relaxed">
              Online preliminary algorithmic problem sets, full-stack open hackathon kickoff, and machine learning model design sprint.
            </p>
            <div className="pt-2 text-[11px] text-[#00ff66] space-y-1 border-t border-[#232635]">
              <div>&gt; 10:00 - CodeCurrent Marathon</div>
              <div>&gt; 14:00 - AI Computer Vision Challenge</div>
            </div>
          </div>

          {/* Day 2 */}
          <div className="p-6 bg-[#10121a] border-2 border-[#232635] hover:border-[#00f0ff] transition-colors flex flex-col justify-between space-y-4">
            <div className="flex flex-row items-center justify-between border-b border-[#232635] pb-3 text-xs">
              <span className="text-[#00f0ff] font-bold">DAY 02 // 05 NOV</span>
              <span className="text-[#8b93a7]">HARDWARE ARENA</span>
            </div>
            <h3 className="font-display font-bold text-lg text-[#f4f5f8]">
              ROBOTICS &amp; COMBAT ARENA
            </h3>
            <p className="font-sans text-xs text-[#8b93a7] leading-relaxed">
              Autonomous drone obstacle courses, 30kg combat robotics deathmatches, and cyber security offensive/defensive CTFs.
            </p>
            <div className="pt-2 text-[11px] text-[#00f0ff] space-y-1 border-t border-[#232635]">
              <div>&gt; 09:30 - Robowars Round of 16</div>
              <div>&gt; 13:00 - Aerial Drone Grand Prix</div>
            </div>
          </div>

          {/* Day 3 */}
          <div className="p-6 bg-[#10121a] border-2 border-[#232635] hover:border-[#ffb800] transition-colors flex flex-col justify-between space-y-4">
            <div className="flex flex-row items-center justify-between border-b border-[#232635] pb-3 text-xs">
              <span className="text-[#ffb800] font-bold">DAY 03 // 10 NOV</span>
              <span className="text-[#8b93a7]">FINALS &amp; GALA</span>
            </div>
            <h3 className="font-display font-bold text-lg text-[#f4f5f8]">
              KEYNOTES &amp; PRIZE MINTING
            </h3>
            <p className="font-sans text-xs text-[#8b93a7] leading-relaxed">
              Grand hackathon demo pitches before venture judges, expert masterclasses, and distribution of ₹150,000+ prize bounties.
            </p>
            <div className="pt-2 text-[11px] text-[#ffb800] space-y-1 border-t border-[#232635]">
              <div>&gt; 15:00 - Venture Pitch Showcase</div>
              <div>&gt; 18:30 - Grand Valedictory Ceremony</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category / Modality Quick Portals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-6">
        <div className="border-b border-[#232635] pb-3 font-mono text-xs text-[#8b93a7]">
          [SECTOR QUICK LAUNCH // SELECT SPECIALIZATION]
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 font-mono text-xs">
          {[
            { label: "CODING", icon: Terminal, href: "/events?category=Coding" },
            { label: "ROBOTICS", icon: Cpu, href: "/events?category=Robotics" },
            { label: "HACKATHONS", icon: Zap, href: "/events?type=EVENT" },
            { label: "WORKSHOPS", icon: Users, href: "/events?type=WORKSHOP" },
            { label: "ONLINE ONLY", icon: ExternalLink, href: "/events?mode=ONLINE" },
            { label: "FREE ENTRY", icon: Trophy, href: "/events?price=FREE" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="p-4 bg-[#10121a] border border-[#232635] hover:border-[#00ff66] hover:bg-[#171924] transition-all flex flex-col items-center justify-center gap-2 text-center group shadow-brutal-sm"
              >
                <Icon className="w-5 h-5 text-[#00ff66] group-hover:scale-110 transition-transform" />
                <span className="font-bold text-[#f4f5f8] group-hover:text-[#00ff66]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-[#10121a] border-2 border-[#00ff66] shadow-brutal-acid flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10 flex flex-col">
            <span className="text-xs font-mono text-[#00ff66] font-bold">
              // READY TO SECURE YOUR ENTRY?
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#f4f5f8]">
              ASSEMBLE YOUR CREW. CLAIM YOUR SEAT.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#8b93a7] max-w-lg">
              Limited seats remain across technical hackathons and robotics arena battles. Zero registration friction.
            </p>
          </div>

          <Link
            href="/events"
            className="px-8 py-4 bg-[#00ff66] text-[#090a0f] font-mono font-black text-sm shadow-brutal-zinc hover:translate-x-0.5 hover:translate-y-0.5 transition-all shrink-0 z-10 inline-flex items-center gap-2"
          >
            <span>JOIN NEXUSFEST NOW</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
