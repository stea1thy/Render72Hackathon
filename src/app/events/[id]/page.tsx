import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
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
} from "lucide-react";
import { getEventById, getEvents, FestivalApiError } from "@/lib/api";
import { RegistrationModal } from "@/components/registration-modal";
import { CountdownBadge } from "@/components/countdown-badge";
import { ShareButton } from "@/components/share-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const event = await getEventById(id);
    const imageUrl = event.cover_image_url ? event.cover_image_url : undefined;
    return {
      title: `${event.name} — NexusFest 2026`,
      description: event.blurb || "NexusFest 2026 event details.",
      openGraph: {
        title: `${event.name} — NexusFest 2026`,
        description: event.blurb,
        images: imageUrl ? [{ url: imageUrl }] : undefined,
      },
    };
  } catch {
    return {
      title: "Event Details — NexusFest 2026",
    };
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;

  let event;
  let allEvents = [];
  try {
    [event, allEvents] = await Promise.all([
      getEventById(id),
      getEvents().catch(() => []),
    ]);
  } catch (err) {
    if (err instanceof FestivalApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    notFound();
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

  return (
    <div className="w-full min-h-screen py-8 px-6 max-w-7xl mx-auto space-y-10 bg-[#09090b]">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all events</span>
        </Link>

        {/* Prev / Next Event Switcher */}
        <div className="flex items-center gap-4 text-xs font-mono">
          {prevEvent ? (
            <Link
              href={`/events/${prevEvent.id}`}
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
              title={prevEvent.name}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Event</span>
            </Link>
          ) : (
            <span className="text-zinc-600">Previous Event</span>
          )}
          <span className="text-zinc-700">•</span>
          {nextEvent ? (
            <Link
              href={`/events/${nextEvent.id}`}
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
              title={nextEvent.name}
            >
              <span>Next Event</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <span className="text-zinc-600">Next Event</span>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cover / Banner Visual */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-video w-full rounded-2xl bg-zinc-950 border border-white/[0.08] overflow-hidden shadow-2xl">
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
              <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-500 font-mono">
                NexusFest 2026
              </div>
            )}

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-medium backdrop-blur-md border ${
                  event.event_mode === "ONLINE"
                    ? "bg-zinc-950/80 text-blue-300 border-blue-500/30"
                    : "bg-zinc-950/80 text-zinc-200 border-white/15"
                }`}
              >
                {event.event_mode === "ONLINE" ? "Online" : "Campus Arena"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                {event.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono text-zinc-300 bg-zinc-950/80 border border-white/10 backdrop-blur-md">
                {event.event_type === "WORKSHOP" ? "Workshop" : "Competition"}
              </span>
            </div>

            {/* Floating Registration Tag */}
            <div className="absolute bottom-3 right-3">
              {isSoldOut ? (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-rose-500 text-white">
                  Sold Out
                </span>
              ) : isRegOpen ? (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500 text-zinc-950">
                  Registration Open
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500 text-zinc-950">
                  Registration Closed
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <span className="text-zinc-500 text-[11px] mr-1">Tags:</span>
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hero Meta & Registration Card */}
        <div className="lg:col-span-5 space-y-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] p-6 shadow-2xl">
          <div>
            <div className="text-xs font-mono text-emerald-400 mb-1.5 font-medium">
              Event Details • NexusFest 2026
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight"
              style={{ viewTransitionName: `event-title-${event.id}` }}
            >
              {event.name}
            </h1>
            <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
              {event.blurb}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.08] font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/[0.06]">
              <span className="text-[10px] text-zinc-500 block uppercase">Registration Fee</span>
              <span className="text-lg font-bold text-white mt-0.5 block">
                {event.price === 0 ? "Free" : `₹${event.price}`}
              </span>
              {event.price > 0 && (
                <span className="text-[10px] text-zinc-400 block">
                  {event.is_per_head ? "Per Person" : "Per Team"}
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/[0.06]">
              <span className="text-[10px] text-zinc-500 block uppercase">Team Format</span>
              <span className="text-base font-semibold text-white mt-0.5 block">
                {event.min_teamsize === 1 && event.max_teamsize === 1
                  ? "Solo Entry"
                  : `${event.min_teamsize}–${event.max_teamsize} Members`}
              </span>
              <span className="text-[10px] text-zinc-400 block">
                {event.is_technical ? "Technical" : "Cultural"}
              </span>
            </div>
          </div>

          {/* Seat Capacity Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">
                Seats: {seatsFilled} of {totalSeats} filled
              </span>
              <span
                className={
                  percentFilled >= 90
                    ? "text-rose-400 font-medium"
                    : percentFilled >= 70
                    ? "text-amber-400"
                    : "text-emerald-400"
                }
              >
                {isSoldOut ? "Full" : `${seatsLeft} seats left`}
              </span>
            </div>
            <div
              className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={percentFilled}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`h-full rounded-full ${
                  percentFilled >= 90
                    ? "bg-rose-500"
                    : percentFilled >= 70
                    ? "bg-amber-500"
                    : "bg-emerald-400"
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
          </div>

          {/* Deadline Ticker */}
          {event.registration_deadline && isRegOpen && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">
                Deadline:
              </span>
              <CountdownBadge deadlineIso={event.registration_deadline} />
            </div>
          )}

          {/* Registration Trigger CTA */}
          <div className="pt-2 space-y-3">
            <RegistrationModal event={event} />
            <ShareButton eventName={event.name} />
          </div>
        </div>
      </div>

      {/* Detailed Content Tabs & Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Detailed Description */}
          {event.description && (
            <section className="rounded-2xl bg-zinc-900/40 border border-white/[0.08] p-6 space-y-4">
              <h2 className="font-bold text-xl text-white border-b border-white/[0.08] pb-3 tracking-tight">
                Event Overview
              </h2>
              <div className="text-sm text-zinc-300 leading-relaxed space-y-3 whitespace-pre-line">
                {event.description}
              </div>
            </section>
          )}

          {/* Highlights */}
          {event.highlights && event.highlights.length > 0 && (
            <section className="rounded-2xl bg-zinc-900/40 border border-white/[0.08] p-6 space-y-4">
              <h2 className="font-bold text-xl text-white border-b border-white/[0.08] pb-3 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" /> Event Highlights
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-200">
                {event.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.06]"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Rules & Guidelines */}
          {event.rules && event.rules.length > 0 && (
            <section className="rounded-2xl bg-zinc-900/40 border border-white/[0.08] p-6 space-y-4">
              <h2 className="font-bold text-xl text-white border-b border-white/[0.08] pb-3 tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" /> Rules &amp; Guidelines
              </h2>
              <ol className="space-y-2.5 text-xs text-zinc-300 font-mono">
                {event.rules.map((rule, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.06]"
                  >
                    <span className="text-blue-400 font-semibold">{idx + 1}.</span>
                    <span className="text-zinc-200 font-sans text-xs">{rule}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Prize Pools */}
          {event.prizes && event.prizes.length > 0 && (
            <section className="rounded-2xl bg-zinc-900/40 border border-white/[0.08] p-6 space-y-4">
              <h2 className="font-bold text-xl text-white border-b border-white/[0.08] pb-3 tracking-tight flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" /> Prize Pool Breakdown
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {event.prizes.map((prize, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-zinc-950/80 border border-white/[0.08] space-y-2 relative"
                  >
                    <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                      <span>Place #{prize.rank}</span>
                      <Trophy
                        className={`w-4 h-4 ${
                          prize.rank === 1
                            ? "text-amber-400"
                            : prize.rank === 2
                            ? "text-zinc-300"
                            : "text-blue-400"
                        }`}
                      />
                    </div>
                    <div className="font-semibold text-base text-white">
                      {prize.title}
                    </div>
                    <div className="font-mono text-xl font-bold text-emerald-400">
                      ₹{prize.amount.toLocaleString("en-IN")}
                    </div>
                    {prize.description && (
                      <p className="text-xs text-zinc-400">
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
            <section className="rounded-2xl bg-zinc-900/40 border border-white/[0.08] p-6 space-y-4">
              <h2 className="font-bold text-xl text-white border-b border-white/[0.08] pb-3 tracking-tight flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-zinc-400" /> Frequently Asked Questions
              </h2>
              <div className="space-y-3 text-xs">
                {event.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-zinc-950/60 border border-white/[0.06] space-y-1.5"
                  >
                    <h3 className="font-semibold text-white text-sm">
                      {faq.question}
                    </h3>
                    <p className="text-zinc-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar: Schedules, Venue, Coordinators */}
        <div className="lg:col-span-4 space-y-6">
          {/* Schedules & Venue */}
          <div className="rounded-2xl bg-zinc-900/40 border border-white/[0.08] p-6 space-y-4">
            <h3 className="font-bold text-lg text-white border-b border-white/[0.08] pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> Timeline &amp; Location
            </h3>
            {event.schedules && event.schedules.length > 0 ? (
              <div className="space-y-3 font-mono text-xs">
                {event.schedules.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/[0.06] space-y-1.5"
                  >
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>{s.event_date}</span>
                      <span>
                        {s.start_time} - {s.end_time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-300 font-sans text-xs">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span>{s.venue}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="font-mono text-xs text-zinc-400">
                Scheduled date: {event.schedule_summary?.start_date} (
                {event.schedule_summary?.start_time})
              </div>
            )}
          </div>

          {/* Coordinators & Organizers */}
          {event.coordinators && event.coordinators.length > 0 && (
            <div className="rounded-2xl bg-zinc-900/40 border border-white/[0.08] p-6 space-y-4">
              <h3 className="font-bold text-lg text-white border-b border-white/[0.08] pb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" /> Event Coordinators
              </h3>
              <div className="space-y-3 text-xs">
                {event.coordinators.map((coord) => (
                  <div
                    key={coord.id}
                    className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/[0.06] space-y-1"
                  >
                    <div className="font-semibold text-white">
                      {coord.name}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      {coord.role}
                    </div>
                    {coord.contact && (
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 pt-0.5 font-mono">
                        <Mail className="w-3 h-3 text-zinc-600" />
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
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/[0.06] text-xs">
              <span className="text-[10px] text-zinc-500 block uppercase font-mono">
                Organized by
              </span>
              <span className="font-semibold text-zinc-200 mt-0.5 block">
                {event.organizers[0].name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
