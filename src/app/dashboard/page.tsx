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
    } catch { }
  }, []);

  const handleRemoveTicket = (id: string) => {
    const updated = tickets.filter((t) => t.ticketId !== id);
    setTickets(updated);
    try {
      localStorage.setItem("nexusfest_tickets", JSON.stringify(updated));
    } catch { }
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
    <div className="w-full min-h-screen py-10 px-6 max-w-7xl mx-auto space-y-10 select-none">
      {/* Dashboard Header */}
      <div className="border-b-2 border-[#38208C]/50 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#1B0E40] border-2 border-[#FFF3B8] text-[#FFF3B8] px-3 py-1 font-pixel-clean text-xs rounded-none shadow-[3px_3px_0px_#090318]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E63E9B]" />
          <span>ATTENDEE DIGITAL WALLET</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="font-pixel-block text-2xl sm:text-4xl text-white drop-shadow-[4px_4px_0px_#090318] leading-tight">
              My Festival Passes
            </h1>
            <p className="font-mono text-sm sm:text-base text-[#D8E2FF]/80 max-w-2xl leading-relaxed">
              Access your verified entry passes, instant QR check-in codes, and schedule itinerary.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-pixel-clean shrink-0">
            <div className="p-3.5 rounded-none bg-[#1B0E40] border-2 border-[#492191] shadow-[3px_3px_0px_#090318]">
              <span className="text-[#A5E8FF] block text-[10px] uppercase">Active Passes</span>
              <span className="font-pixel-block text-white text-base mt-1 block">
                {mounted ? tickets.length : 0}
              </span>
            </div>
            <div className="p-3.5 rounded-none bg-[#1B0E40] border-2 border-[#492191] shadow-[3px_3px_0px_#090318]">
              <span className="text-[#A5E8FF] block text-[10px] uppercase">Saved Events</span>
              <span className="font-pixel-block text-[#FFF3B8] text-base mt-1 block">
                {mounted ? bookmarks.length : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Virtual Passes Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b-2 border-[#38208C]/40 pb-3 text-xs font-pixel-clean">
          <span className="font-bold text-white tracking-tight flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#E63E9B]" /> ISSUED ENTRY PASSES
          </span>
          <span className="text-[#D8E2FF]/60 font-mono text-xs">
            Present QR code at arena check-in
          </span>
        </div>

        {tickets.length === 0 ? (
          <div className="p-12 sm:p-16 rounded-none bg-[#1B0E40] border-[3px] border-[#492191] shadow-[6px_6px_0px_#090318] text-center space-y-4">
            <Ticket className="w-8 h-8 text-[#A5E8FF] mx-auto" />
            <div className="font-pixel-block text-lg text-white">NO TICKETS IN YOUR WALLET YET</div>
            <p className="font-mono text-xs sm:text-sm text-[#D8E2FF]/80 max-w-md mx-auto leading-relaxed">
              You haven&apos;t enrolled in any events yet. Explore the catalog and claim your entry pass.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#FFFDF2] text-[#1B0E40] border-2 border-[#100526] font-pixel-clean font-bold text-xs uppercase shadow-[3px_3px_0px_#E63E9B] hover:bg-[#FFE699] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              Browse 30 Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((t) => (
              <div
                key={t.ticketId}
                className="relative rounded-none bg-[#1B0E40] border-[3px] border-[#FFF3B8] p-6 flex flex-col justify-between shadow-[6px_6px_0px_#090318] overflow-hidden"
              >
                {/* Ticket Header */}
                <div className="flex items-center justify-between border-b-2 border-[#38208C]/60 pb-4 font-pixel-clean">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-[#E63E9B]" />
                    <span className="text-xs font-bold text-white tracking-wider">
                      PASS #{t.ticketId}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-none text-[11px] text-[#A5E8FF] bg-[#12072B] border border-[#492191]">
                    {t.mode === "ONLINE" ? "ONLINE TRACK" : "CAMPUS ARENA"}
                  </span>
                </div>

                {/* Ticket Details */}
                <div className="py-5 space-y-4">
                  <div>
                    <span className="text-[11px] font-pixel-clean text-[#A5E8FF] uppercase tracking-wider">
                      {t.category}
                    </span>
                    <h3 className="font-pixel-clean font-bold text-lg sm:text-xl text-white mt-1">
                      {t.eventName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-y-2 border-[#38208C]/40 text-xs">
                    <div>
                      <span className="text-[10px] text-[#A5E8FF] font-pixel-clean block">ATTENDEE</span>
                      <span className="text-white font-mono font-medium">{t.attendeeName}</span>
                      {t.teamName && (
                        <span className="text-[11px] text-[#D8E2FF]/70 font-mono block mt-0.5">
                          Team: {t.teamName}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] text-[#A5E8FF] font-pixel-clean block">SCHEDULE &amp; VENUE</span>
                      <span className="text-white font-mono">{t.date} • {t.time}</span>
                      <span className="text-[11px] text-[#D8E2FF]/70 font-mono block">{t.venue}</span>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-none bg-white text-[#1B0E40] shadow-[2px_2px_0px_#090318]">
                        <QrCode className="w-10 h-10" />
                      </div>
                      <div className="text-xs space-y-0.5 font-mono text-[#D8E2FF]/80">
                        <div className="text-[#A5E8FF] font-pixel-clean text-xs font-bold">VERIFIED PASS</div>
                        <div className="text-[11px] text-[#D8E2FF]/70">{t.email}</div>
                        <div className="text-[10px] text-[#FFF3B8]">ID: {t.ticketId}</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handlePrint(t)}
                        className="p-2 rounded-none bg-[#110626] border-2 border-[#492191] text-[#A5E8FF] hover:text-white hover:border-[#FFF3B8] transition-colors cursor-pointer"
                        title="Print Voucher"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveTicket(t.ticketId)}
                        className="p-2 rounded-none bg-[#110626] border-2 border-[#492191] text-[#E63E9B] hover:text-white hover:border-[#E63E9B] transition-colors cursor-pointer"
                        title="Remove Pass"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-3 border-t-2 border-[#38208C]/40 text-[11px] text-[#D8E2FF]/60 flex justify-between font-pixel-clean">
                  <span>NEXUSFEST 2026 OFFICIAL ENTRY PASS</span>
                  <span className="text-[#FFF3B8]">ACTIVE</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Itinerary Schedule */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="md:col-span-2 rounded-none bg-[#1B0E40]/90 border-[3px] border-[#492191] p-6 shadow-[6px_6px_0px_#090318] space-y-4">
          <div className="flex items-center gap-2 text-white font-pixel-block text-sm border-b-2 border-[#38208C]/40 pb-3">
            <Clock className="w-4 h-4 text-[#A5E8FF]" />
            <span>Important Check-in Information</span>
          </div>

          <p className="font-mono text-xs sm:text-sm text-[#D8E2FF]/80 leading-relaxed">
            Campus registration gates open at 09:00 IST on festival days. Please download your virtual QR passes or keep this dashboard open on your device for rapid gate check-in.
          </p>

          <div className="space-y-2.5 pt-2 text-xs font-mono">
            <div className="p-3.5 rounded-none bg-[#110626] border-2 border-[#492191] flex justify-between items-center">
              <span className="text-white">Day 1: Algorithm Marathon &amp; Hackathon Check-in</span>
              <span className="text-[#FFF3B8] font-pixel-clean text-xs">10:00 IST</span>
            </div>
            <div className="p-3.5 rounded-none bg-[#110626] border-2 border-[#492191] flex justify-between items-center">
              <span className="text-white">Day 2: Robotics Combat &amp; Drone Heats</span>
              <span className="text-[#A5E8FF] font-pixel-clean text-xs">14:00 IST</span>
            </div>
            <div className="p-3.5 rounded-none bg-[#110626] border-2 border-[#492191] flex justify-between items-center">
              <span className="text-white">Day 3: Grand Demo Day &amp; Award Ceremony</span>
              <span className="text-[#E63E9B] font-pixel-clean text-xs">18:30 IST</span>
            </div>
          </div>
        </div>

        <div className="rounded-none bg-[#1B0E40]/90 border-[3px] border-[#492191] p-6 shadow-[6px_6px_0px_#090318] space-y-4">
          <div className="font-pixel-block text-sm text-white border-b-2 border-[#38208C]/40 pb-3">
            Quick Links
          </div>
          <ul className="space-y-2.5 font-pixel-clean text-xs">
            <li>
              <Link
                href="/events"
                className="flex items-center justify-between p-3 rounded-none bg-[#110626] border-2 border-[#492191] hover:border-[#FFF3B8] text-white transition-colors"
              >
                <span>Browse All 30 Events</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#A5E8FF]" />
              </Link>
            </li>
            <li>
              <Link
                href="/events?price=FREE"
                className="flex items-center justify-between p-3 rounded-none bg-[#110626] border-2 border-[#492191] hover:border-[#FFF3B8] text-white transition-colors"
              >
                <span>Free Entry Contests</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFF3B8]" />
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
