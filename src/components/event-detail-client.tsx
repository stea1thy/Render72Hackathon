"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Mail,
  Sparkles,
  HelpCircle,
  Compass,
  Home,
} from "lucide-react";
import type { EventDetail, EventSummary } from "@/lib/types";
import { RegistrationModal } from "@/components/registration-modal";
import { CountdownBadge } from "@/components/countdown-badge";
import { ShareButton } from "@/components/share-button";

interface EventDetailClientProps {
  id: string;
  initialEvent: EventDetail | null;
  initialAllEvents: EventSummary[];
}

export function EventDetailClient({
  id,
  initialEvent,
  initialAllEvents,
}: EventDetailClientProps) {
  const [event, setEvent] = useState<EventDetail | null>(initialEvent);
  const [allEvents, setAllEvents] = useState<EventSummary[]>(initialAllEvents);
  const [isNotFound, setIsNotFound] = useState(!initialEvent);

  // Live client-side re-fetch on mount for real-time seat counts & invalid ID detection
  useEffect(() => {
    let isSubscribed = true;

    async function fetchLiveEvent() {
      try {
        const res = await fetch(
          `https://render72.pages.dev/api/test/events/${id}`
        );

        if (!isSubscribed) return;

        if (res.status === 404) {
          setIsNotFound(true);
          setEvent(null);
          return;
        }

        if (res.ok) {
          const json = await res.json();
          if (json && json.event) {
            setEvent(json.event);
            setIsNotFound(false);
          }
        }
      } catch (err) {
        console.warn("[Live Event Fetch Error]", err);
      }
    }

    async function fetchLiveAllEvents() {
      if (allEvents.length > 0) return;
      try {
        const res = await fetch("https://render72.pages.dev/api/test/events");
        if (res.ok && isSubscribed) {
          const json = await res.json();
          if (json && Array.isArray(json.events)) {
            setAllEvents(json.events);
          }
        }
      } catch (err) {
        console.warn("[Live All Events Fetch Error]", err);
      }
    }

    fetchLiveEvent();
    fetchLiveAllEvents();

    return () => {
      isSubscribed = false;
    };
  }, [id, allEvents.length]);

  // 8-Bit Custom 404 State
  if (isNotFound || !event) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 select-none">
        <div className="w-full max-w-lg p-8 sm:p-10 rounded-none bg-[#1B0E40] border-[3px] border-[#6B2BB5] shadow-[8px_8px_0px_#090318] text-center space-y-6">
          <div className="w-14 h-14 rounded-none bg-[#12072B] border-2 border-[#FFF3B8] mx-auto flex items-center justify-center text-[#FFF3B8] font-pixel-block text-base shadow-[3px_3px_0px_#090318]">
            404
          </div>

          <div className="space-y-2">
            <h1 className="font-pixel-block text-xl sm:text-2xl text-white">
              Page Not Found
            </h1>
            <p className="font-mono text-xs sm:text-sm text-[#D8E2FF]/80 leading-relaxed max-w-sm mx-auto">
              The event arena or festival page you are looking for doesn&apos;t exist, may have been removed, or the link is invalid.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#FFFDF2] text-[#1B0E40] border-2 border-[#100526] font-pixel-clean font-bold text-xs uppercase shadow-[3px_3px_0px_#E63E9B] hover:bg-[#FFE699] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Compass className="w-4 h-4 text-[#E63E9B]" />
              Browse Events
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#110626] border-2 border-[#492191] text-[#D8E2FF] hover:text-white hover:border-[#FFF3B8] font-pixel-clean font-bold text-xs uppercase shadow-[3px_3px_0px_#090318] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Home className="w-4 h-4 text-[#A5E8FF]" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = allEvents.findIndex((e) => e.id === id);
  const prevEvent = currentIndex > 0 ? allEvents[currentIndex - 1] : null;
  const nextEvent =
    currentIndex >= 0 && currentIndex < allEvents.length - 1
      ? allEvents[currentIndex + 1]
      : null;

  const totalSeats = event.total_seats || 100;
  const seatsFilled = event.seats_filled || 0;
  const seatsLeft = Math.max(0, totalSeats - seatsFilled);
  const percentFilled = Math.min(
    100,
    Math.round((seatsFilled / totalSeats) * 100)
  );
  const isSoldOut = event.registration_status === "SOLD_OUT" || seatsLeft === 0;
  const isRegOpen = event.registration_status === "OPEN" && !isSoldOut;

  // 15-segment pixel capacity meter
  const totalBlocks = 15;
  const isLowSeats = seatsLeft <= totalSeats * 0.2;
  const availableBlocks = isSoldOut
    ? 0
    : Math.max(1, Math.round((seatsLeft / totalSeats) * totalBlocks));
  const activeBlockColor = isLowSeats ? "bg-[#E63E9B]" : "bg-[#A5E8FF]";

  return (
    <div className="w-full min-h-screen py-8 px-6 max-w-7xl mx-auto space-y-10 select-none">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#38208C]/50 pb-4">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 bg-[#1B0E40] border-2 border-[#492191] hover:border-[#FFF3B8] px-3.5 py-2 font-pixel-clean text-xs text-[#FFF3B8] rounded-none shadow-[3px_3px_0px_#090318] active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO ALL EVENTS</span>
        </Link>

        {/* Prev / Next Event Switcher */}
        <div className="flex items-center gap-3 font-pixel-clean text-xs">
          {prevEvent ? (
            <Link
              href={`/events/${prevEvent.id}`}
              className="inline-flex items-center gap-1.5 bg-[#1B0E40] border-2 border-[#492191] hover:border-[#FFF3B8] px-3 py-1.5 text-xs text-[#FFF3B8] rounded-none shadow-[3px_3px_0px_#090318] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              title={prevEvent.name}
            >
              <ArrowLeft className="w-3 h-3" />
              <span>PREVIOUS</span>
            </Link>
          ) : (
            <span className="px-3 py-1.5 border border-white/10 text-[#D8E2FF]/30 rounded-none">
              PREVIOUS
            </span>
          )}

          <span className="text-[#38208C] font-bold">•</span>

          {nextEvent ? (
            <Link
              href={`/events/${nextEvent.id}`}
              className="inline-flex items-center gap-1.5 bg-[#1B0E40] border-2 border-[#492191] hover:border-[#FFF3B8] px-3 py-1.5 text-xs text-[#FFF3B8] rounded-none shadow-[3px_3px_0px_#090318] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              title={nextEvent.name}
            >
              <span>NEXT</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          ) : (
            <span className="px-3 py-1.5 border border-white/10 text-[#D8E2FF]/30 rounded-none">
              NEXT
            </span>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cover / Banner Visual & Tags */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-video w-full rounded-none border-[3px] border-[#FFF3B8] bg-[#0A041A] overflow-hidden shadow-[6px_6px_0px_#090318] after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(to_bottom,transparent_50%,rgba(18,8,41,0.35)_50%)] after:bg-[size:100%_4px]">
            {event.banner_image_url || event.cover_image_url ? (
              <Image
                src={event.banner_image_url || event.cover_image_url}
                alt={event.cover_image_alt || event.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                style={{ viewTransitionName: `event-cover-${event.id}` }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#0A041A] text-[#A5E8FF] font-pixel-clean text-sm">
                <span>{event.name}</span>
                <span className="text-xs text-[#FFF3B8] mt-1">NEXUSFEST 2026</span>
              </div>
            )}

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
              <span className="bg-[#120829]/95 text-[#FFFDF2] border-2 border-[#100526] px-2.5 py-0.5 font-pixel-clean text-[11px] rounded-none shadow-[2px_2px_0px_#000]">
                {event.event_mode === "ONLINE" ? "ONLINE TRACK" : "CAMPUS ARENA"}
              </span>
              <span className="bg-[#120829]/95 text-[#A5E8FF] border-2 border-[#100526] px-2.5 py-0.5 font-pixel-clean text-[11px] rounded-none shadow-[2px_2px_0px_#000]">
                {event.category}
              </span>
              <span className="bg-[#120829]/95 text-[#FFF3B8] border-2 border-[#100526] px-2.5 py-0.5 font-pixel-clean text-[11px] rounded-none shadow-[2px_2px_0px_#000]">
                {event.event_type === "WORKSHOP" ? "WORKSHOP" : "COMPETITION"}
              </span>
            </div>

            {/* Floating Registration Tag */}
            <div className="absolute bottom-3 right-3 z-10">
              {isSoldOut ? (
                <span className="bg-[#E63E9B] text-white border-2 border-[#100526] px-3 py-1 font-pixel-clean text-[11px] font-bold rounded-none shadow-[2px_2px_0px_#000]">
                  REGISTRATION SOLD OUT
                </span>
              ) : isRegOpen ? (
                <span className="bg-[#1B0E40] text-[#FFF3B8] border-2 border-[#FFF3B8] px-3 py-1 font-pixel-clean text-[11px] font-bold rounded-none shadow-[2px_2px_0px_#000]">
                  REGISTRATION OPEN
                </span>
              ) : (
                <span className="bg-[#2D1666] text-[#FFAE59] border-2 border-[#FFAE59]/60 px-3 py-1 font-pixel-clean text-[11px] font-bold rounded-none shadow-[2px_2px_0px_#000]">
                  REGISTRATION CLOSED
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
              <span className="font-pixel-clean text-xs text-[#A5E8FF] mr-1 font-bold">TAGS:</span>
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#1B0E40] border border-[#492191] text-[#A5E8FF] px-2.5 py-1 font-mono text-xs rounded-none shadow-[2px_2px_0px_#090318]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Hero Meta & Registration Card */}
        <div className="lg:col-span-5 space-y-6 rounded-none bg-[#1B0E40]/95 border-[3px] border-[#6B2BB5] p-6 sm:p-8 shadow-[8px_8px_0px_#090318]">
          <div>
            <div className="font-pixel-clean text-xs text-[#A5E8FF] uppercase tracking-wider font-bold">
              Event Details • NexusFest 2026
            </div>
            <h1
              className="font-pixel-clean text-2xl sm:text-3xl font-bold text-white leading-snug mt-2 tracking-tight"
              style={{ viewTransitionName: `event-title-${event.id}` }}
            >
              {event.name}
            </h1>
            <p className="font-mono text-sm text-[#D8E2FF]/90 leading-relaxed mt-3">
              {event.blurb}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t-2 border-[#38208C]/40">
            <div className="bg-[#110626] border-2 border-[#492191] p-4 rounded-none shadow-[3px_3px_0px_#090318] space-y-1">
              <span className="font-pixel-clean text-[10px] text-[#A5E8FF] block uppercase">
                Registration Fee
              </span>
              <span className="font-pixel-block text-base text-[#FFF3B8] block">
                {event.price === 0 ? "FREE" : `₹${event.price}`}
              </span>
              {event.price > 0 && (
                <span className="font-mono text-[11px] text-[#D8E2FF]/70 block">
                  {event.is_per_head ? "Per Person" : "Per Team"}
                </span>
              )}
            </div>

            <div className="bg-[#110626] border-2 border-[#492191] p-4 rounded-none shadow-[3px_3px_0px_#090318] space-y-1">
              <span className="font-pixel-clean text-[10px] text-[#A5E8FF] block uppercase">
                Team Format
              </span>
              <span className="font-pixel-clean text-sm font-bold text-white block">
                {event.min_teamsize === 1 && event.max_teamsize === 1
                  ? "Solo Entry"
                  : `${event.min_teamsize}–${event.max_teamsize} Members`}
              </span>
              <span className="font-mono text-[11px] text-[#D8E2FF]/70 block">
                {event.is_technical ? "Technical Arena" : "Cultural Arena"}
              </span>
            </div>
          </div>

          {/* 15-Segment Pixel Seat Capacity Bar */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-xs font-pixel-clean">
              <span className="text-[#D8E2FF]/75">
                SEATS: {seatsFilled} OF {totalSeats} FILLED
              </span>
              <span className={isLowSeats ? "text-[#E63E9B] font-bold" : "text-[#A5E8FF]"}>
                {isSoldOut ? "FULL" : `${seatsLeft} SEATS LEFT`}
              </span>
            </div>

            <div
              className="grid grid-cols-15 gap-1"
              style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}
              role="progressbar"
              aria-valuenow={percentFilled}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${seatsFilled} of ${totalSeats} seats filled`}
            >
              {Array.from({ length: totalBlocks }).map((_, i) => {
                const isLit = i < availableBlocks;
                return (
                  <span
                    key={i}
                    className={`h-2.5 rounded-none ${
                      isLit ? activeBlockColor : "bg-[#0D0521] border border-white/10"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Deadline Ticker */}
          {event.registration_deadline && isRegOpen && (
            <div className="p-3.5 rounded-none bg-[#140930] border-2 border-[#FFF3B8]/60 shadow-[3px_3px_0px_#090318] flex items-center justify-between font-pixel-clean text-xs">
              <span className="text-[#FFF3B8]">DEADLINE:</span>
              <CountdownBadge deadlineIso={event.registration_deadline} />
            </div>
          )}

          {/* Registration Trigger CTA & Share Button */}
          <div className="pt-2 space-y-3">
            <RegistrationModal event={event} />
            <ShareButton eventName={event.name} />
          </div>
        </div>
      </div>

      {/* Detailed Content Tabs & Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Details (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Detailed Description */}
          {event.description && (
            <section className="bg-[#1B0E40]/90 border-[3px] border-[#492191] p-6 rounded-none shadow-[6px_6px_0px_#090318] space-y-4">
              <h2 className="font-pixel-block text-base sm:text-lg text-white border-b-2 border-[#38208C]/40 pb-3">
                Event Overview
              </h2>
              <div className="font-mono text-xs sm:text-sm text-[#D8E2FF]/90 leading-relaxed space-y-3 whitespace-pre-line">
                {event.description}
              </div>
            </section>
          )}

          {/* Highlights */}
          {event.highlights && event.highlights.length > 0 && (
            <section className="bg-[#1B0E40]/90 border-[3px] border-[#492191] p-6 rounded-none shadow-[6px_6px_0px_#090318] space-y-4">
              <h2 className="font-pixel-block text-base sm:text-lg text-white border-b-2 border-[#38208C]/40 pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E63E9B]" /> Event Highlights
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                {event.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 p-3.5 rounded-none bg-[#110626] border border-[#492191] text-[#D8E2FF]"
                  >
                    <CheckCircle className="w-4 h-4 text-[#A5E8FF] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Rules & Guidelines */}
          {event.rules && event.rules.length > 0 && (
            <section className="bg-[#1B0E40]/90 border-[3px] border-[#492191] p-6 rounded-none shadow-[6px_6px_0px_#090318] space-y-4">
              <h2 className="font-pixel-block text-base sm:text-lg text-white border-b-2 border-[#38208C]/40 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#A5E8FF]" /> Rules &amp; Guidelines
              </h2>
              <ol className="space-y-2.5 text-xs font-mono text-[#D8E2FF]">
                {event.rules.map((rule, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-none bg-[#110626] border border-[#492191]"
                  >
                    <span className="font-pixel-clean text-[#FFF3B8] font-bold">{idx + 1}.</span>
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Prize Pools */}
          {event.prizes && event.prizes.length > 0 && (
            <section className="bg-[#1B0E40]/90 border-[3px] border-[#492191] p-6 rounded-none shadow-[6px_6px_0px_#090318] space-y-4">
              <h2 className="font-pixel-block text-base sm:text-lg text-white border-b-2 border-[#38208C]/40 pb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#FFF3B8]" /> Prize Pool Breakdown
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {event.prizes.map((prize, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-none bg-[#110626] border-2 border-[#FFF3B8]/40 shadow-[3px_3px_0px_#090318] space-y-2 relative"
                  >
                    <div className="flex justify-between items-center text-xs font-pixel-clean text-[#A5E8FF]">
                      <span>PLACE #{prize.rank}</span>
                      <Trophy
                        className={`w-4 h-4 ${
                          prize.rank === 1
                            ? "text-[#FFF3B8]"
                            : prize.rank === 2
                            ? "text-[#FFFDF2]"
                            : "text-[#E63E9B]"
                        }`}
                      />
                    </div>
                    <div className="font-pixel-clean text-xs font-bold text-white">
                      {prize.title}
                    </div>
                    <div className="font-pixel-block text-lg font-bold text-[#FFF3B8]">
                      ₹{prize.amount.toLocaleString("en-IN")}
                    </div>
                    {prize.description && (
                      <p className="font-mono text-[11px] text-[#D8E2FF]/70">
                        {prize.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQs */}
          {event.faqs && event.faqs.length > 0 && (
            <section className="bg-[#1B0E40]/90 border-[3px] border-[#492191] p-6 rounded-none shadow-[6px_6px_0px_#090318] space-y-4">
              <h2 className="font-pixel-block text-base sm:text-lg text-white border-b-2 border-[#38208C]/40 pb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#A5E8FF]" /> Frequently Asked Questions
              </h2>
              <div className="space-y-3 text-xs">
                {event.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-none bg-[#110626] border border-[#492191] space-y-1.5"
                  >
                    <h3 className="font-pixel-clean font-bold text-[#FFF3B8] text-xs">
                      {faq.question}
                    </h3>
                    <p className="font-mono text-[#D8E2FF]/80 leading-relaxed text-xs">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar: Schedules, Venue, Coordinators (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Schedules & Venue */}
          <div className="bg-[#1B0E40]/90 border-[3px] border-[#492191] p-6 rounded-none shadow-[6px_6px_0px_#090318] space-y-4">
            <h3 className="font-pixel-clean text-xs sm:text-sm font-bold text-white border-b-2 border-[#38208C]/40 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#E63E9B]" /> TIMELINE &amp; LOCATION
            </h3>
            {event.schedules && event.schedules.length > 0 ? (
              <div className="space-y-3 font-mono text-xs">
                {event.schedules.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-none bg-[#110626] border-2 border-[#492191] space-y-1.5"
                  >
                    <div className="flex justify-between text-[#FFF3B8] font-pixel-clean text-[11px] font-bold">
                      <span>{s.event_date}</span>
                      <span>
                        {s.start_time} - {s.end_time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#D8E2FF]/90 font-mono text-xs pt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#A5E8FF] shrink-0" />
                      <span>{s.venue}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="font-mono text-xs text-[#D8E2FF]/80">
                Scheduled: {event.schedule_summary?.start_date} ({event.schedule_summary?.start_time})
              </div>
            )}
          </div>

          {/* Coordinators & Organizers */}
          {event.coordinators && event.coordinators.length > 0 && (
            <div className="bg-[#1B0E40]/90 border-[3px] border-[#492191] p-6 rounded-none shadow-[6px_6px_0px_#090318] space-y-4">
              <h3 className="font-pixel-clean text-xs sm:text-sm font-bold text-white border-b-2 border-[#38208C]/40 pb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#A5E8FF]" /> EVENT COORDINATORS
              </h3>
              <div className="space-y-3 text-xs">
                {event.coordinators.map((coord) => (
                  <div
                    key={coord.id}
                    className="p-3.5 rounded-none bg-[#110626] border-2 border-[#492191] space-y-1"
                  >
                    <div className="font-pixel-clean font-bold text-white text-xs">
                      {coord.name}
                    </div>
                    <div className="text-[11px] text-[#A5E8FF] font-mono">
                      {coord.role}
                    </div>
                    {coord.contact && (
                      <div className="flex items-center gap-1.5 text-[11px] text-[#D8E2FF]/70 pt-0.5 font-mono">
                        <Mail className="w-3 h-3 text-[#E63E9B]" />
                        <span>{coord.contact}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Host Club / Organization */}
          {event.organizers && event.organizers.length > 0 && (
            <div className="p-4 rounded-none bg-[#110626] border-2 border-[#492191] text-xs shadow-[3px_3px_0px_#090318]">
              <span className="text-[10px] text-[#A5E8FF] block uppercase font-pixel-clean">
                ORGANIZED BY
              </span>
              <span className="font-pixel-clean text-xs font-bold text-white mt-1 block">
                {event.organizers[0].name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
