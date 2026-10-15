"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Ticket,
  QrCode,
  Calendar,
  MapPin,
  Clock,
  Download,
  ArrowRight,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface TicketData {
  ticketId: string;
  eventId: string;
  eventName: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  mode: string;
  attendeeName: string;
  email: string;
  teamName?: string;
  registeredAt: string;
}

export default function DashboardPage() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const storedTickets = JSON.parse(
        localStorage.getItem("nexusfest_tickets") || "[]"
      );
      if (storedTickets.length === 0) {
        const demoTicket: TicketData = {
          ticketId: "NF26-VIP-491",
          eventId: "0fdc5427-4be3-59d8-9f17-1d7fc20d515a",
          eventName: "CodeCurrent: Monsoon Algorithm Round",
          category: "Coding",
          date: "2026-10-16",
          time: "10:00",
          venue: "Main Campus Arena",
          mode: "ONLINE",
          attendeeName: "Rahul Sharma",
          email: "rahul.sharma@college.edu",
          registeredAt: new Date().toISOString(),
        };
        setTickets([demoTicket]);
      } else {
        setTickets(storedTickets);
      }

      const storedBookmarks = JSON.parse(
        localStorage.getItem("nexusfest_bookmarks") || "[]"
      );
      setBookmarks(storedBookmarks);
    } catch {}
  }, []);

  const handleRemoveTicket = (id: string) => {
    const updated = tickets.filter((t) => t.ticketId !== id);
    setTickets(updated);
    try {
      localStorage.setItem("nexusfest_tickets", JSON.stringify(updated));
    } catch {}
    toast.info("Pass Removed", {
      description: `Ticket pass #${id} removed from your wallet.`,
    });
  };

  const handlePrint = (ticket: TicketData) => {
    toast.success("Printing Voucher", {
      description: `Preparing printable pass for ${ticket.eventName}...`,
    });
  };

  return (
    <div className="w-full min-h-screen py-12 px-6 max-w-7xl mx-auto space-y-10 bg-[#09090b]">
      {/* Dashboard Header */}
      <div className="border-b border-white/[0.08] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-emerald-400 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Attendee Digital Wallet</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              My Festival Passes
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
              Access your verified entry passes, instant QR check-in codes, and schedule itinerary.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/10">
              <span className="text-zinc-500 block text-[10px] uppercase">Active Passes</span>
              <span className="text-white font-bold text-lg">
                {mounted ? tickets.length : 0}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/10">
              <span className="text-zinc-500 block text-[10px] uppercase">Saved Events</span>
              <span className="text-emerald-400 font-bold text-lg">
                {mounted ? bookmarks.length : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Virtual Passes Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-xs">
          <span className="font-semibold text-white tracking-tight flex items-center gap-2">
            <Ticket className="w-4 h-4 text-emerald-400" /> Issued Entry Passes
          </span>
          <span className="text-zinc-500 font-mono">
            Show QR code at venue registration desk
          </span>
        </div>

        {tickets.length === 0 ? (
          <div className="p-16 rounded-2xl bg-zinc-900/30 border border-white/[0.08] text-center space-y-4">
            <Ticket className="w-8 h-8 text-zinc-600 mx-auto" />
            <div className="text-white font-semibold text-lg">No tickets in your wallet yet</div>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              You haven&apos;t enrolled in any events yet. Explore the catalog and claim your entry pass.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors"
            >
              Browse 30 Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((t) => (
              <div
                key={t.ticketId}
                className="relative rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-white/15 p-6 flex flex-col justify-between shadow-2xl overflow-hidden"
              >
                {/* Ticket Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="font-mono text-xs font-semibold text-white tracking-wider">
                      Pass #{t.ticketId}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-zinc-300 bg-white/5 border border-white/10">
                    {t.mode === "ONLINE" ? "Online" : "Campus Arena"}
                  </span>
                </div>

                {/* Ticket Details */}
                <div className="py-5 space-y-4">
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                      {t.category}
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                      {t.eventName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/[0.06] text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono block">ATTENDEE</span>
                      <span className="text-zinc-200 font-medium">{t.attendeeName}</span>
                      {t.teamName && (
                        <span className="text-[11px] text-zinc-400 block mt-0.5">
                          Team: {t.teamName}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono block">SCHEDULE &amp; VENUE</span>
                      <span className="text-zinc-200 font-mono">{t.date} • {t.time}</span>
                      <span className="text-[11px] text-zinc-400 block">{t.venue}</span>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-white text-zinc-950">
                        <QrCode className="w-12 h-12" />
                      </div>
                      <div className="text-xs space-y-0.5 font-mono text-zinc-400">
                        <div className="text-emerald-400 font-semibold">Verified Entry Pass</div>
                        <div className="text-[11px] text-zinc-500">{t.email}</div>
                        <div className="text-[10px] text-zinc-600">ID: {t.ticketId}</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handlePrint(t)}
                        className="p-2.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
                        title="Print Voucher"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveTicket(t.ticketId)}
                        className="p-2.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                        title="Remove Pass"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-3 border-t border-white/[0.06] text-[11px] text-zinc-500 flex justify-between font-mono">
                  <span>NexusFest 2026 Official Entry Pass</span>
                  <span className="text-emerald-400">Verified</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Itinerary Schedule */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="md:col-span-2 rounded-2xl bg-zinc-900/40 border border-white/[0.08] p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-white/[0.08] pb-3">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Important Check-in Information</span>
          </div>

          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Campus registration gates open at 09:00 IST on festival days. Please download your virtual QR passes or keep this dashboard open on your device for rapid gate check-in.
          </p>

          <div className="space-y-2.5 pt-2 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.06] flex justify-between items-center">
              <span className="text-zinc-200">Day 1: Algorithm Marathon &amp; Hackathon Check-in</span>
              <span className="text-emerald-400 font-semibold">10:00 IST</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.06] flex justify-between items-center">
              <span className="text-zinc-200">Day 2: Robotics Combat &amp; Drone Heats</span>
              <span className="text-blue-400 font-semibold">14:00 IST</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.06] flex justify-between items-center">
              <span className="text-zinc-200">Day 3: Grand Demo Day &amp; Award Ceremony</span>
              <span className="text-amber-400 font-semibold">18:30 IST</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-900/40 border border-white/[0.08] p-6 space-y-4">
          <div className="text-white font-semibold text-base border-b border-white/[0.08] pb-3">
            Quick Links
          </div>
          <ul className="space-y-2 text-xs">
            <li>
              <Link
                href="/events"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/[0.06] hover:border-white/20 text-zinc-300 hover:text-white transition-colors"
              >
                <span>Browse All 30 Events</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </Link>
            </li>
            <li>
              <Link
                href="/events?price=FREE"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/[0.06] hover:border-white/20 text-zinc-300 hover:text-white transition-colors"
              >
                <span>Free Entry Contests</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
