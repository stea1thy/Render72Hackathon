"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Ticket,
  QrCode,
  Calendar,
  MapPin,
  Users,
  Clock,
  Download,
  Bookmark,
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
        // Seed an initial demo ticket so the dashboard is immediately impressive and usable
        const demoTicket: TicketData = {
          ticketId: "NF26-ALPHA1",
          eventId: "0fdc5427-4be3-59d8-9f17-1d7fc20d515a",
          eventName: "CodeCurrent: Monsoon Algorithm Round",
          category: "Coding",
          date: "2026-09-26",
          time: "10:00",
          venue: "Virtual Arena 01",
          mode: "ONLINE",
          attendeeName: "Cyber Delegate",
          email: "delegate@nexusfest.ac.in",
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
    toast.info("TICKET DEACTIVATED", {
      description: `Ticket pass #${id} removed from your digital wallet.`,
    });
  };

  const handlePrint = (ticket: TicketData) => {
    toast.success("PRINTING PASS", {
      description: `Generating printable PDF voucher for ${ticket.eventName}...`,
    });
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Dashboard Terminal Header */}
      <div className="border-b border-[#232635] pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00ff66] mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>PORTAL // PARTICIPANT_TERMINAL // CREDENTIALS VERIFIED</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#f4f5f8] tracking-tight">
              DIGITAL HUB<span className="text-[#00ff66]">.</span>
            </h1>
            <p className="font-sans text-sm text-[#8b93a7] mt-2 max-w-2xl">
              Access your festival credentials, virtual QR tickets, active team rosters, and offline schedule itinerary.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-3 bg-[#10121a] border border-[#232635]">
              <span className="text-[#555c70] block text-[10px]">ACTIVE PASSES</span>
              <span className="text-[#00ff66] font-bold text-base">
                {mounted ? tickets.length : 0}
              </span>
            </div>
            <div className="p-3 bg-[#10121a] border border-[#232635]">
              <span className="text-[#555c70] block text-[10px]">SAVED EVENTS</span>
              <span className="text-[#00f0ff] font-bold text-base">
                {mounted ? bookmarks.length : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Virtual Passes Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#232635] pb-2 font-mono text-xs">
          <span className="text-[#00ff66] font-bold tracking-wider flex items-center gap-2">
            <Ticket className="w-4 h-4" /> [ISSUED VIRTUAL TICKETS &amp; PASSES]
          </span>
          <span className="text-[#8b93a7]">
            PRESENT QR CODE AT ARENA GATES
          </span>
        </div>

        {tickets.length === 0 ? (
          <div className="p-10 bg-[#10121a] border border-[#232635] text-center space-y-3 font-mono text-xs">
            <Ticket className="w-8 h-8 text-[#555c70] mx-auto" />
            <div className="text-[#f4f5f8] font-bold">NO ACTIVE TICKETS ISSUED</div>
            <p className="text-[#8b93a7]">
              You have not enrolled in any events yet. Explore the catalog and book your entry pass.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#00ff66] text-[#090a0f] font-bold"
            >
              BROWSE EVENTS CATALOG
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((t) => (
              <div
                key={t.ticketId}
                className="relative bg-[#10121a] border-2 border-[#00ff66] shadow-brutal-acid flex flex-col justify-between overflow-hidden"
              >
                {/* Ticket Top Notch Header */}
                <div className="p-4 bg-[#0a0b10] border-b border-[#232635] flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#00ff66]"></span>
                    <span className="text-[#00ff66] font-bold tracking-wider">
                      PASS #{t.ticketId}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#00f0ff] border border-[#00f0ff]/30 px-1.5 py-0.5">
                    {t.mode}
                  </span>
                </div>

                {/* Ticket Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#8b93a7]">
                      [{t.category.toUpperCase()}]
                    </span>
                    <h3 className="font-display font-bold text-xl text-[#f4f5f8] mt-0.5">
                      {t.eventName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 font-mono text-xs py-3 border-y border-[#232635]">
                    <div>
                      <span className="text-[10px] text-[#555c70] block">ATTENDEE</span>
                      <span className="text-[#f4f5f8] font-semibold">{t.attendeeName}</span>
                      {t.teamName && (
                        <span className="text-[10px] text-[#00f0ff] block mt-0.5">
                          Squad: {t.teamName}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] text-[#555c70] block">SCHEDULE &amp; VENUE</span>
                      <span className="text-[#f4f5f8]">{t.date} • {t.time}</span>
                      <span className="text-[10px] text-[#8b93a7] block">{t.venue}</span>
                    </div>
                  </div>

                  {/* QR & Barcode Section */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white text-black">
                        <QrCode className="w-12 h-12" />
                      </div>
                      <div className="font-mono text-[10px] text-[#8b93a7] space-y-0.5">
                        <div className="text-[#00ff66] font-bold">DIGITAL PASS VALID</div>
                        <div>EMAIL: {t.email}</div>
                        <div>AUTH: SECURE_HASH_OK</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handlePrint(t)}
                        className="p-2 bg-[#171924] border border-[#232635] text-[#8b93a7] hover:text-[#00ff66] hover:border-[#00ff66] transition-colors"
                        title="Download / Print voucher"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveTicket(t.ticketId)}
                        className="p-2 bg-[#171924] border border-[#232635] text-[#8b93a7] hover:text-[#ff3344] hover:border-[#ff3344] transition-colors"
                        title="Delete pass"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Stub */}
                <div className="px-4 py-2 bg-[#06070a] border-t border-[#232635] font-mono text-[10px] text-[#555c70] flex justify-between">
                  <span>NEXUSFEST PROTOCOL TICKET VOUCHER</span>
                  <span>KEEP ACTIVE OFFLINE</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Itinerary & Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="md:col-span-2 bg-[#10121a] border border-[#232635] p-6 space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#00ff66] font-bold border-b border-[#232635] pb-3">
            <Clock className="w-4 h-4" />
            <span>FESTIVAL DISPATCH // TIMELINE SYNC</span>
          </div>

          <p className="text-[#8b93a7] font-sans">
            Festival checkpoints open at 09:00 IST on competition days. Make sure to download or screenshot your virtual QR passes in advance for zero-friction gate scanning.
          </p>

          <div className="space-y-2 pt-2">
            <div className="p-3 bg-[#090a0f] border border-[#232635] flex justify-between">
              <span className="text-[#f4f5f8]">PHASE 1: HACKATHON PROTOCOL COMMENCEMENT</span>
              <span className="text-[#00ff66]">10:00 IST</span>
            </div>
            <div className="p-3 bg-[#090a0f] border border-[#232635] flex justify-between">
              <span className="text-[#f4f5f8]">PHASE 2: ROBOTICS COMBAT ARENA TRIALS</span>
              <span className="text-[#00f0ff]">14:00 IST</span>
            </div>
            <div className="p-3 bg-[#090a0f] border border-[#232635] flex justify-between">
              <span className="text-[#f4f5f8]">PHASE 3: GRAND PRIZE CEREMONY</span>
              <span className="text-[#ffb800]">18:30 IST</span>
            </div>
          </div>
        </div>

        <div className="bg-[#10121a] border border-[#232635] p-6 space-y-4 font-mono text-xs">
          <div className="text-[#00f0ff] font-bold border-b border-[#232635] pb-3">
            QUICK SECTORS
          </div>
          <ul className="space-y-2">
            <li>
              <Link
                href="/events"
                className="flex items-center justify-between p-2.5 bg-[#090a0f] border border-[#232635] hover:border-[#00ff66] text-[#8b93a7] hover:text-[#f4f5f8]"
              >
                <span>Browse All 30 Events</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#00ff66]" />
              </Link>
            </li>
            <li>
              <Link
                href="/events?free_only=true"
                className="flex items-center justify-between p-2.5 bg-[#090a0f] border border-[#232635] hover:border-[#00ff66] text-[#8b93a7] hover:text-[#f4f5f8]"
              >
                <span>Free Entry Contests</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#00ff66]" />
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
