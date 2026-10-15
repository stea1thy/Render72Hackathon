import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Calendar,
  Code2,
  Cpu,
  Trophy,
  Users,
  Compass,
  Zap,
} from "lucide-react";
import { getEvents } from "@/lib/api";
import type { EventSummary } from "@/lib/types";
import { EventCard } from "@/components/event-card";
import HeroSection from "@/components/hero-section";

export const revalidate = 60; // ISR revalidate

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
    <div className="min-h-screen flex flex-col space-y-20 pb-24 bg-[#09090b]">
      {/* 2-Column Hero Section with Interactive 3D Festival Pass */}
      <HeroSection totalEvents={events.length || 30} />

      {/* Stats Overview */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] flex flex-col justify-between space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Total Events
            </span>
            <span className="text-3xl font-bold text-white tracking-tight">
              30 Events
            </span>
            <span className="text-xs text-zinc-400">
              Hackathons, robotics &amp; cultural rounds
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] flex flex-col justify-between space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Total Prize Pool
            </span>
            <span className="text-3xl font-bold text-emerald-400 tracking-tight">
              ₹1,50,000+
            </span>
            <span className="text-xs text-zinc-400">
              Direct cash prizes &amp; verified awards
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] flex flex-col justify-between space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Event Modality
            </span>
            <span className="text-3xl font-bold text-white tracking-tight">
              Hybrid
            </span>
            <span className="text-xs text-zinc-400">
              On-campus arena + online global tracks
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] flex flex-col justify-between space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Expected Attendance
            </span>
            <span className="text-3xl font-bold text-white tracking-tight">
              5,000+
            </span>
            <span className="text-xs text-zinc-400">
              Builders from 120+ colleges
            </span>
          </div>
        </div>
      </section>

      {/* Featured Events Showcase */}
      {featuredEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 w-full space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Competitions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Flagship Challenges
              </h2>
              <p className="text-sm text-zinc-400 max-w-lg">
                Curated hackathons, robotics face-offs, and masterclasses headlined by industry engineers.
              </p>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>View all 30 events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.slice(0, 6).map((evt, idx) => (
              <EventCard key={evt.id} event={evt} priority={idx === 0} />
            ))}
          </div>
        </section>
      )}

      {/* Schedule Timeline Section */}
      <section
        id="schedule"
        className="max-w-7xl mx-auto px-6 w-full space-y-8"
      >
        <div className="border-b border-white/[0.08] pb-6 space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Festival Timeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Three Days of Continuous Innovation
          </h2>
          <p className="text-sm text-zinc-400">
            From the opening hack sprint to the championship valedictory ceremony.
          </p>
        </div>

        {/* 3 Days Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] hover:border-white/20 transition-colors space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-xs font-mono">
              <span className="text-emerald-400 font-semibold">DAY 01 • OCT 16</span>
              <span className="text-zinc-500">Kickoff</span>
            </div>
            <h3 className="font-bold text-lg text-white tracking-tight">
              Hackathons &amp; Algorithm Rounds
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Online algorithm contests commence alongside 36-hour hackathon check-ins and mentor office hours.
            </p>
            <div className="pt-2 text-xs font-mono text-zinc-300 space-y-1.5 border-t border-white/[0.06]">
              <div className="flex justify-between">
                <span>CodeCurrent Algorithm Sprint</span>
                <span className="text-zinc-500">10:00 IST</span>
              </div>
              <div className="flex justify-between">
                <span>Full-Stack Hackathon Kickoff</span>
                <span className="text-zinc-500">14:00 IST</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] hover:border-white/20 transition-colors space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-xs font-mono">
              <span className="text-blue-400 font-semibold">DAY 02 • OCT 17</span>
              <span className="text-zinc-500">Hardware &amp; Combat</span>
            </div>
            <h3 className="font-bold text-lg text-white tracking-tight">
              Robotics &amp; Aerial Grand Prix
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              On-campus arena battles, obstacle course drone heats, and live cybersecurity capture-the-flag competitions.
            </p>
            <div className="pt-2 text-xs font-mono text-zinc-300 space-y-1.5 border-t border-white/[0.06]">
              <div className="flex justify-between">
                <span>Robowars Arena Trials</span>
                <span className="text-zinc-500">09:30 IST</span>
              </div>
              <div className="flex justify-between">
                <span>Drone Racing Heats</span>
                <span className="text-zinc-500">13:00 IST</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] hover:border-white/20 transition-colors space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-xs font-mono">
              <span className="text-amber-400 font-semibold">DAY 03 • OCT 18</span>
              <span className="text-zinc-500">Finals &amp; Awards</span>
            </div>
            <h3 className="font-bold text-lg text-white tracking-tight">
              Demo Pitches &amp; Cash Bounties
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Final presentations in front of venture judges, keynote presentations, and ₹1,50,000+ prize distributions.
            </p>
            <div className="pt-2 text-xs font-mono text-zinc-300 space-y-1.5 border-t border-white/[0.06]">
              <div className="flex justify-between">
                <span>Grand Demo Day</span>
                <span className="text-zinc-500">15:00 IST</span>
              </div>
              <div className="flex justify-between">
                <span>Valedictory Ceremony</span>
                <span className="text-zinc-500">18:30 IST</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Launch Grid */}
      <section className="max-w-7xl mx-auto px-6 w-full space-y-6">
        <div className="border-b border-white/[0.08] pb-4">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Explore by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: "Coding", icon: Code2, href: "/events?category=Coding" },
            { label: "Robotics", icon: Cpu, href: "/events?category=Robotics" },
            { label: "Hackathons", icon: Zap, href: "/events?type=EVENT" },
            { label: "Workshops", icon: Users, href: "/events?type=WORKSHOP" },
            { label: "Online Events", icon: Compass, href: "/events?mode=ONLINE" },
            { label: "Free Events", icon: Trophy, href: "/events?price=FREE" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="p-5 rounded-xl bg-zinc-900/40 border border-white/[0.08] hover:border-white/20 hover:bg-zinc-900/80 transition-all flex flex-col items-center justify-center gap-2.5 text-center group"
              >
                <Icon className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                <span className="text-xs font-medium text-zinc-200 group-hover:text-white">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* High-Contrast Conversion Banner */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Ready to take the stage?
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Assemble your team. Claim your spot.
            </h2>
            <p className="text-sm text-zinc-400 max-w-lg">
              Registration is open across all 30 competitive rounds and workshops. Generate your virtual QR pass in seconds.
            </p>
          </div>

          <Link
            href="/events"
            className="px-8 py-4 rounded-xl bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors shrink-0 z-10 inline-flex items-center gap-2"
          >
            <span>Explore All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
