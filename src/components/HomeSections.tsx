"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Code2, Cpu, Zap, Users, Compass, Trophy, Clock } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const STAT_CARTRIDGES = [
  {
    label: "TOTAL EVENTS",
    value: "30 Events",
    valueColor: "text-[#FFFDF2]",
    sub: "Hackathons, robotics & cultural rounds",
  },
  {
    label: "TOTAL PRIZE POOL",
    value: "₹1,50,000+",
    valueColor: "text-[#FFF3B8]",
    sub: "Direct cash prizes & verified awards",
  },
  {
    label: "EVENT MODALITY",
    value: "Hybrid",
    valueColor: "text-[#A5E8FF]",
    sub: "On-campus arena + online global tracks",
  },
  {
    label: "EXPECTED ATTENDANCE",
    value: "5,000+",
    valueColor: "text-[#E63E9B]",
    sub: "Builders from 120+ colleges",
  },
];

const THREE_DAY_SCHEDULE = [
  {
    day: "DAY 01 • OCT 16",
    tag: "KICKOFF",
    dayColor: "text-[#A5E8FF]",
    dividerColor: "border-[#A5E8FF]/30",
    hoverBorder: "hover:border-[#A5E8FF]",
    title: "Hackathons & Algorithm Rounds",
    summary: "36-hour hackathons, algorithm sprints & mentor check-ins.",
    slots: [
      { name: "CodeCurrent Algorithm Sprint", time: "10:00 IST" },
      { name: "Full-Stack Hackathon Kickoff", time: "14:00 IST" },
    ],
  },
  {
    day: "DAY 02 • OCT 17",
    tag: "ARENA & CODE",
    dayColor: "text-[#E63E9B]",
    dividerColor: "border-[#E63E9B]/30",
    hoverBorder: "hover:border-[#E63E9B]",
    title: "Robotics & Aerial Grand Prix",
    summary: "On-campus robot combat, drone racing & CTF finals.",
    slots: [
      { name: "Robowars Arena Trials", time: "09:30 IST" },
      { name: "Drone Racing Heats", time: "13:00 IST" },
    ],
  },
  {
    day: "DAY 03 • OCT 18",
    tag: "FINALS & AWARDS",
    dayColor: "text-[#FFF3B8]",
    dividerColor: "border-[#FFF3B8]/30",
    hoverBorder: "hover:border-[#FFF3B8]",
    title: "Demo Pitches & Grand Finals",
    summary: "Jury demos, keynote sessions & ₹1,50,000+ prize awards.",
    slots: [
      { name: "Grand Demo Day", time: "15:00 IST" },
      { name: "Valedictory Ceremony", time: "18:30 IST" },
    ],
  },
];

// Hrefs match the query params the /events catalog actually reads.
const CATEGORY_TILES = [
  { label: "Coding", href: "/events?category=Coding", icon: Code2 },
  { label: "Robotics", href: "/events?category=Robotics", icon: Cpu },
  { label: "Hackathons", href: "/events?type=EVENT", icon: Zap },
  { label: "Workshops", href: "/events?type=WORKSHOP", icon: Users },
  { label: "Online Events", href: "/events?mode=ONLINE", icon: Compass },
  { label: "Free Events", href: "/events?price=FREE", icon: Trophy },
];

/* -------------------------------------------------------------------------- */
/*  Shared bits                                                               */
/* -------------------------------------------------------------------------- */

/** 4 corner rivets that light up (and pulse) gold when the parent `group` is hovered */
function CornerRivets({ inset = "1.5" }: { inset?: "1.5" | "2" }) {
  const pos = inset === "2" ? ["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"]
    : ["top-1.5 left-1.5", "top-1.5 right-1.5", "bottom-1.5 left-1.5", "bottom-1.5 right-1.5"];
  return (
    <>
      {pos.map((p) => (
        <span
          key={p}
          aria-hidden="true"
          className={`pointer-events-none absolute ${p} w-1.5 h-1.5 bg-[#6B2BB5] group-hover:bg-[#FFF3B8] group-hover:animate-[pixelPulseGlow_0.9s_steps(2,end)_infinite] transition-colors`}
        />
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  1. Stat Cartridges                                                        */
/* -------------------------------------------------------------------------- */

export function AnimatedStatCartridges() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {STAT_CARTRIDGES.map((stat, idx) => (
        <ScrollReveal key={stat.label} variant="pop-up" delayMs={idx * 90} className="h-full">
          <div className="group relative h-full flex flex-col justify-between space-y-3 bg-[#1B0E40] border-[3px] border-[#492191] hover:border-[#FFF3B8] p-5 rounded-none shadow-[4px_4px_0px_#090318] hover:shadow-[6px_6px_0px_#E63E9B] hover:-translate-y-1.5 hover:-translate-x-0.5 pixel-card-interactive">
            <CornerRivets />

            <span className="font-pixel-clean text-xs text-[#A5E8FF] uppercase tracking-wider">
              {stat.label}
            </span>
            <span
              className={`font-pixel-block text-xl sm:text-2xl mt-2 tracking-tight origin-left transition-transform duration-200 group-hover:scale-[1.03] ${stat.valueColor}`}
            >
              {stat.value}
            </span>
            <span className="text-xs text-[#D8E2FF]/70 font-mono">{stat.sub}</span>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  2. Three Days of Continuous Innovation                                    */
/* -------------------------------------------------------------------------- */

export function AnimatedThreeDaySection() {
  return (
    <div className="space-y-8">
      <ScrollReveal variant="slide-left">
        <div className="border-b-2 border-[#38208C]/40 pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#1B0E40] text-[#A5E8FF] border border-[#A5E8FF]/40 px-2.5 py-1 font-pixel-clean text-xs shadow-[2px_2px_0px_#090318]">
            <Calendar className="w-3.5 h-3.5 text-[#A5E8FF]" />
            <span>FESTIVAL TIMELINE</span>
          </div>
          <h2 className="font-pixel-block text-xl sm:text-3xl text-[#FFFDF2] drop-shadow-[3px_3px_0px_#090318]">
            Three Days of Continuous Innovation
          </h2>
          <p className="font-mono text-sm text-[#D8E2FF]/80">
            From the opening algorithm sprint to the championship valedictory ceremony.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {THREE_DAY_SCHEDULE.map((item, idx) => (
          <ScrollReveal key={item.day} variant="pop-up" delayMs={idx * 110} className="h-full">
            <article
              className={`group relative h-full flex flex-col bg-[#1B0E40] border-[3px] border-[#492191] ${item.hoverBorder} p-6 rounded-none shadow-[4px_4px_0px_#090318] hover:shadow-[6px_6px_0px_#090318] hover:-translate-y-1.5 pixel-card-interactive`}
            >
              <CornerRivets />

              {/* Day + track tag */}
              <div
                className={`flex items-center justify-between gap-2 border-b-2 ${item.dividerColor} pb-3 font-pixel-clean text-xs`}
              >
                <span className={`font-bold ${item.dayColor}`}>{item.day}</span>
                <span className="px-2 py-0.5 bg-[#120829] border border-[#492191] text-[10px] uppercase tracking-wider text-[#D8E2FF]/70 group-hover:border-[#FFF3B8] group-hover:text-[#FFF3B8] transition-colors">
                  {item.tag}
                </span>
              </div>

              {/* Title + one-line hook */}
              <h3 className="mt-4 font-pixel-clean font-bold text-base sm:text-lg text-white tracking-tight uppercase leading-snug group-hover:text-[#FFF3B8] transition-colors">
                {item.title}
              </h3>
              <p className="mt-1.5 font-mono text-xs text-[#D8E2FF]/80 leading-relaxed">
                {item.summary}
              </p>

              {/* Scannable time-slot rows (pinned to card bottom so all 3 align) */}
              <ul className="mt-auto pt-5 space-y-2">
                {item.slots.map((slot) => (
                  <li
                    key={slot.name}
                    className="flex items-center justify-between gap-3 px-3 py-2 bg-[#120829] border border-[#492191] group-hover:border-[#A5E8FF]/60 group-hover:translate-x-1 transition-[translate,border-color] duration-200"
                  >
                    <span className="min-w-0 font-pixel-clean text-[11px] text-white uppercase leading-snug">
                      {slot.name}
                    </span>
                    <span className="inline-flex items-center gap-1 shrink-0 px-1.5 py-0.5 bg-[#1B0E40] border border-[#FFF3B8]/40 font-pixel-clean text-[11px] text-[#FFF3B8]">
                      <Clock className="w-3 h-3 text-[#E63E9B]" aria-hidden="true" />
                      {slot.time}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  3. Explore by Category                                                    */
/* -------------------------------------------------------------------------- */

export function AnimatedCategoryTiles() {
  return (
    <div className="space-y-6">
      <ScrollReveal variant="slide-left">
        <div className="border-b-2 border-[#38208C]/40 pb-4">
          <h2 className="font-pixel-block text-lg sm:text-xl text-[#FFFDF2] drop-shadow-[2px_2px_0px_#090318]">
            Explore by Category
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
        {CATEGORY_TILES.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <ScrollReveal key={cat.label} variant="scale-pop" delayMs={idx * 70} className="h-full">
              <Link
                href={cat.href}
                className="group h-full min-h-[104px] p-5 flex flex-col items-center justify-center gap-2.5 text-center bg-[#1B0E40] hover:bg-[#231154] border-[3px] border-[#492191] hover:border-[#FFF3B8] rounded-none shadow-[4px_4px_0px_#090318] hover:shadow-[5px_5px_0px_#E63E9B] hover:-translate-y-1.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#090318] pixel-card-interactive"
              >
                <Icon className="w-5 h-5 text-[#A5E8FF] transition-[translate,scale,color] duration-200 group-hover:text-[#FFF3B8] group-hover:-translate-y-1 group-hover:scale-110" />
                <span className="text-[11px] font-pixel-clean text-[#D8E2FF] group-hover:text-[#FFF3B8] uppercase tracking-tight">
                  {cat.label}
                </span>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
