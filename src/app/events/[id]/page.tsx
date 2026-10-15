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
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Share2,
  Bookmark,
  Mail,
  User,
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
      title: `${event.name} // NexusFest 2026`,
      description: event.blurb || "NexusFest 2026 event protocol details.",
      openGraph: {
        title: `${event.name} // NexusFest 2026`,
        description: event.blurb,
        images: imageUrl ? [{ url: imageUrl }] : undefined,
      },
    };
  } catch {
    return {
      title: "Event Details // NexusFest 2026",
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
    // If not found or error, let error boundary or 404 handle
    notFound();
  }

  // Find prev / next event for seamless navigation
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
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#232635] pb-4">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 font-mono text-xs text-[#8b93a7] hover:text-[#00ff66] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&lt; BACK TO EVENTS CATALOG</span>
        </Link>

        {/* Prev / Next Event Switcher */}
        <div className="flex items-center gap-4 font-mono text-xs">
          {prevEvent ? (
            <Link
              href={`/events/${prevEvent.id}`}
              className="inline-flex items-center gap-1.5 text-[#8b93a7] hover:text-[#00ff66] transition-colors"
              title={prevEvent.name}
            >
              <ArrowLeft className="w-3 h-3" />
              <span>PREV NODE</span>
            </Link>
          ) : (
            <span className="text-[#555c70]">PREV NODE</span>
          )}
          <span className="text-[#232635]">|</span>
          {nextEvent ? (
            <Link
              href={`/events/${nextEvent.id}`}
              className="inline-flex items-center gap-1.5 text-[#8b93a7] hover:text-[#00ff66] transition-colors"
              title={nextEvent.name}
            >
              <span>NEXT NODE</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          ) : (
            <span className="text-[#555c70]">NEXT NODE</span>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cover / Banner Visual */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-video w-full bg-[#10121a] border-2 border-[#232635] overflow-hidden shadow-brutal-zinc">
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
              <div className="w-full h-full flex items-center justify-center bg-cyber-grid text-[#8b93a7] font-mono">
                [NO VISUAL NODE]
              </div>
            )}

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <span
                className={`px-2.5 py-1 text-xs font-mono font-bold tracking-wider border ${
                  event.event_mode === "ONLINE"
                    ? "bg-[#090a0f]/90 text-[#00f0ff] border-[#00f0ff]"
                    : "bg-[#090a0f]/90 text-[#f4f5f8] border-[#8b93a7]"
                }`}
              >
                {event.event_mode}
              </span>
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-[#090a0f]/90 text-[#00ff66] border border-[#00ff66]">
                {event.category.toUpperCase()}
              </span>
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-[#090a0f]/90 text-[#8b93a7] border border-[#232635]">
                {event.event_type}
              </span>
            </div>

            {/* Floating Registration Tag */}
            <div className="absolute bottom-3 right-3">
              {isSoldOut ? (
                <span className="px-3 py-1 font-mono font-bold text-xs bg-[#ff3344] text-[#090a0f]">
                  CAPACITY SOLD OUT
                </span>
              ) : isRegOpen ? (
                <span className="px-3 py-1 font-mono font-bold text-xs bg-[#00ff66] text-[#090a0f]">
                  REGISTRATIONS OPEN
                </span>
              ) : (
                <span className="px-3 py-1 font-mono font-bold text-xs bg-[#ffb800] text-[#090a0f]">
                  REGISTRATION CLOSED
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              <span className="text-[#555c70] text-[11px] mr-1">TAGS:</span>
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-[#10121a] border border-[#232635] text-[#8b93a7]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hero Meta & Registration Card */}
        <div className="lg:col-span-5 space-y-6 bg-[#10121a] border border-[#232635] p-6 shadow-brutal-zinc">
          <div>
            <div className="text-[11px] font-mono text-[#00ff66] tracking-wider mb-1">
              NODE ID: {event.id}
            </div>
            <h1
              className="font-display font-extrabold text-2xl sm:text-3xl text-[#f4f5f8] leading-tight"
              style={{ viewTransitionName: `event-title-${event.id}` }}
            >
              {event.name}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#8b93a7] mt-3 leading-relaxed">
              {event.blurb}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#232635] font-mono text-xs">
            <div className="p-3 bg-[#090a0f] border border-[#232635]">
              <span className="text-[10px] text-[#555c70] block">ENTRY FEE</span>
              <span className="text-base font-extrabold text-[#f4f5f8]">
                {event.price === 0 ? "FREE" : `₹${event.price}`}
              </span>
              {event.price > 0 && (
                <span className="text-[10px] text-[#8b93a7] block">
                  {event.is_per_head ? "Per Head" : "Per Team"}
                </span>
              )}
            </div>

            <div className="p-3 bg-[#090a0f] border border-[#232635]">
              <span className="text-[10px] text-[#555c70] block">TEAM FORMAT</span>
              <span className="text-sm font-bold text-[#f4f5f8]">
                {event.min_teamsize === 1 && event.max_teamsize === 1
                  ? "Solo Entry"
                  : `${event.min_teamsize} - ${event.max_teamsize} Members`}
              </span>
              <span className="text-[10px] text-[#00f0ff] block">
                {event.is_technical ? "Technical Track" : "Cultural Track"}
              </span>
            </div>
          </div>

          {/* Seat Capacity Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b93a7]">
                CAPACITY: {seatsFilled} / {totalSeats} FILLED
              </span>
              <span
                className={
                  percentFilled >= 90
                    ? "text-[#ff3344] font-bold"
                    : percentFilled >= 70
                    ? "text-[#ffb800]"
                    : "text-[#00ff66]"
                }
              >
                {isSoldOut ? "FULL" : `${seatsLeft} REMAINING`}
              </span>
            </div>
            <div
              className="w-full h-2 bg-[#171924] overflow-hidden"
              role="progressbar"
              aria-valuenow={percentFilled}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`h-full ${
                  percentFilled >= 90
                    ? "bg-[#ff3344]"
                    : percentFilled >= 70
                    ? "bg-[#ffb800]"
                    : "bg-[#00ff66]"
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
          </div>

          {/* Deadline Ticker */}
          {event.registration_deadline && isRegOpen && (
            <div className="p-3 bg-[#1a1608] border border-[#ffb800]/40 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#8b93a7]">
                ENROLLMENT WINDOW:
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
            <section className="bg-[#10121a] border border-[#232635] p-6 space-y-4">
              <h2 className="font-display font-bold text-xl text-[#f4f5f8] border-b border-[#232635] pb-3 flex items-center gap-2">
                <span className="text-[#00ff66]">&gt;</span> OVERVIEW &amp; MISSION BRIEF
              </h2>
              <div className="font-sans text-sm text-[#8b93a7] leading-relaxed space-y-3 whitespace-pre-line">
                {event.description}
              </div>
            </section>
          )}

          {/* Highlights */}
          {event.highlights && event.highlights.length > 0 && (
            <section className="bg-[#10121a] border border-[#232635] p-6 space-y-4">
              <h2 className="font-display font-bold text-xl text-[#f4f5f8] border-b border-[#232635] pb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00ff66]" /> HIGHLIGHTS
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs text-[#f4f5f8]">
                {event.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 p-3 bg-[#090a0f] border border-[#232635]"
                  >
                    <CheckCircle className="w-4 h-4 text-[#00ff66] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Rules & Guidelines */}
          {event.rules && event.rules.length > 0 && (
            <section className="bg-[#10121a] border border-[#232635] p-6 space-y-4">
              <h2 className="font-display font-bold text-xl text-[#f4f5f8] border-b border-[#232635] pb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00f0ff]" /> PROTOCOL RULES
              </h2>
              <ol className="space-y-2.5 font-mono text-xs text-[#8b93a7]">
                {event.rules.map((rule, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-3 bg-[#090a0f] border border-[#232635]"
                  >
                    <span className="text-[#00f0ff] font-bold">
                      [{idx + 1}]
                    </span>
                    <span className="text-[#f4f5f8]">{rule}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Prize Pools */}
          {event.prizes && event.prizes.length > 0 && (
            <section className="bg-[#10121a] border border-[#232635] p-6 space-y-4">
              <h2 className="font-display font-bold text-xl text-[#f4f5f8] border-b border-[#232635] pb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#ffb800]" /> PRIZE POOL MATRIX
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {event.prizes.map((prize, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#090a0f] border border-[#232635] space-y-2 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center text-xs font-mono text-[#8b93a7]">
                      <span>RANK {prize.rank}</span>
                      <Trophy
                        className={`w-4 h-4 ${
                          prize.rank === 1
                            ? "text-[#ffb800]"
                            : prize.rank === 2
                            ? "text-[#f4f5f8]"
                            : "text-[#00f0ff]"
                        }`}
                      />
                    </div>
                    <div className="font-display font-bold text-lg text-[#f4f5f8]">
                      {prize.title}
                    </div>
                    <div className="font-mono text-xl font-extrabold text-[#00ff66]">
                      ₹{prize.amount.toLocaleString("en-IN")}
                    </div>
                    {prize.description && (
                      <p className="font-sans text-[11px] text-[#8b93a7]">
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
            <section className="bg-[#10121a] border border-[#232635] p-6 space-y-4">
              <h2 className="font-display font-bold text-xl text-[#f4f5f8] border-b border-[#232635] pb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#00ff66]" /> FREQUENTLY ASKED QUESTIONS
              </h2>
              <div className="space-y-3 font-mono text-xs">
                {event.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="p-4 bg-[#090a0f] border border-[#232635] space-y-2"
                  >
                    <h3 className="font-bold text-[#f4f5f8]">
                      Q: {faq.question}
                    </h3>
                    <p className="font-sans text-[#8b93a7] text-xs leading-relaxed">
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
          <div className="bg-[#10121a] border border-[#232635] p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-[#f4f5f8] border-b border-[#232635] pb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00ff66]" /> TIMELINE &amp; VENUE
            </h3>
            {event.schedules && event.schedules.length > 0 ? (
              <div className="space-y-3 font-mono text-xs">
                {event.schedules.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#090a0f] border border-[#232635] space-y-1.5"
                  >
                    <div className="flex justify-between text-[#00ff66] font-bold">
                      <span>{s.event_date}</span>
                      <span>
                        {s.start_time} - {s.end_time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#f4f5f8]">
                      <MapPin className="w-3.5 h-3.5 text-[#00f0ff] shrink-0" />
                      <span>{s.venue}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="font-mono text-xs text-[#8b93a7]">
                Schedule dates: {event.schedule_summary?.start_date} (
                {event.schedule_summary?.start_time})
              </div>
            )}
          </div>

          {/* Coordinators & Organizers */}
          {event.coordinators && event.coordinators.length > 0 && (
            <div className="bg-[#10121a] border border-[#232635] p-6 space-y-4">
              <h3 className="font-display font-bold text-lg text-[#f4f5f8] border-b border-[#232635] pb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#00f0ff]" /> EVENT DIRECTORS
              </h3>
              <div className="space-y-3 font-mono text-xs">
                {event.coordinators.map((coord) => (
                  <div
                    key={coord.id}
                    className="p-3 bg-[#090a0f] border border-[#232635] space-y-1"
                  >
                    <div className="font-bold text-[#f4f5f8]">
                      {coord.name}
                    </div>
                    <div className="text-[11px] text-[#00ff66]">
                      {coord.role}
                    </div>
                    {coord.contact && (
                      <div className="flex items-center gap-1.5 text-[10px] text-[#8b93a7]">
                        <Mail className="w-3 h-3 text-[#555c70]" />
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
            <div className="p-4 bg-[#090a0f] border border-[#232635] font-mono text-xs">
              <span className="text-[10px] text-[#555c70] block uppercase">
                HOSTED BY
              </span>
              <span className="font-bold text-[#00ff66]">
                {event.organizers[0].name}
              </span>
              <span className="text-[#8b93a7] text-[10px] ml-2">
                [{event.organizers[0].org_type}]
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
