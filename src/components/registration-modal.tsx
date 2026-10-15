"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Ticket,
  CheckCircle,
  X,
  QrCode,
  User,
  Mail,
  Users,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import type { EventDetail } from "@/lib/types";

interface RegistrationModalProps {
  event: EventDetail;
}

export function RegistrationModal({ event }: RegistrationModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "confirmed">("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [teamName, setTeamName] = useState("");
  const [ticketId, setTicketId] = useState("");

  const isSolo = event.min_teamsize === 1 && event.max_teamsize === 1;
  const isSoldOut = event.registration_status === "SOLD_OUT" || (event.total_seats - event.seats_filled) <= 0;
  const isClosed = event.registration_status === "CLOSED" || event.event_status === "COMPLETED";

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error("MISSING REQUIRED FIELDS", {
        description: "Please provide both Full Name and valid College Email.",
      });
      return;
    }

    const generatedId = `NF26-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setTicketId(generatedId);

    // Save ticket to localStorage for Dashboard access
    try {
      const existing = JSON.parse(localStorage.getItem("nexusfest_tickets") || "[]");
      const newTicket = {
        ticketId: generatedId,
        eventId: event.id,
        eventName: event.name,
        category: event.category,
        date: event.schedule_summary?.start_date,
        time: event.schedule_summary?.start_time,
        venue: event.schedules?.[0]?.venue || "Main Arena",
        mode: event.event_mode,
        attendeeName: fullName,
        email,
        teamName: isSolo ? undefined : teamName,
        registeredAt: new Date().toISOString(),
      };
      localStorage.setItem("nexusfest_tickets", JSON.stringify([newTicket, ...existing]));
    } catch {}

    setStep("confirmed");
    toast.success("REGISTRATION CONFIRMED", {
      description: `Access pass issued with Ticket ID #${generatedId}.`,
    });
  };

  const handleResetModal = () => {
    setOpen(false);
    setTimeout(() => {
      setStep("form");
      setFullName("");
      setEmail("");
      setTeamName("");
    }, 300);
  };

  if (isClosed || isSoldOut) {
    return (
      <button
        disabled
        className="w-full py-4 bg-[#171924] border border-[#232635] text-[#555c70] font-mono font-bold text-sm cursor-not-allowed select-none"
      >
        {isSoldOut ? "[REGISTRATION SOLD OUT]" : "[REGISTRATION CLOSED]"}
      </button>
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="w-full py-4 bg-[#00ff66] text-[#090a0f] font-mono font-extrabold text-sm shadow-brutal-zinc hover:shadow-brutal-acid hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Ticket className="w-4 h-4" />
          <span>REGISTER ENTRY NOW // {event.price === 0 ? "FREE" : `₹${event.price}`}</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 data-[state=open]:animate-fadeIn" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#090a0f] border-2 border-[#00ff66] shadow-brutal-acid z-50 p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-[#232635] pb-4 mb-6">
            <div className="flex items-center gap-2 font-mono text-xs text-[#00ff66] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>NEXUSFEST ENROLLMENT PROTOCOL</span>
            </div>
            <Dialog.Close asChild>
              <button
                onClick={handleResetModal}
                className="text-[#8b93a7] hover:text-[#f4f5f8] p-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {step === "form" ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-[#00f0ff] uppercase tracking-wider">
                  TARGET EVENT
                </span>
                <h3 className="font-display font-bold text-lg text-[#f4f5f8]">
                  {event.name}
                </h3>
                <p className="font-mono text-xs text-[#8b93a7] mt-0.5">
                  FEE: {event.price === 0 ? "FREE ENTRY (₹0)" : `₹${event.price} ${event.is_per_head ? "PER HEAD" : "PER TEAM"}`} • {event.event_mode}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-mono text-[#f4f5f8] mb-1">
                    ATTENDEE FULL NAME *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555c70]" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Vance"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#10121a] border border-[#232635] focus:border-[#00ff66] text-xs font-mono text-[#f4f5f8] placeholder:text-[#555c70] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#f4f5f8] mb-1">
                    STUDENT / CORPORATE EMAIL *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555c70]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.vance@university.edu"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#10121a] border border-[#232635] focus:border-[#00ff66] text-xs font-mono text-[#f4f5f8] placeholder:text-[#555c70] outline-none"
                    />
                  </div>
                </div>

                {!isSolo && (
                  <div>
                    <label className="block text-xs font-mono text-[#f4f5f8] mb-1">
                      TEAM / SQUAD NAME ({event.min_teamsize} - {event.max_teamsize} MEMBERS)
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555c70]" />
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. CyberVanguard"
                        className="w-full pl-9 pr-3 py-2.5 bg-[#10121a] border border-[#232635] focus:border-[#00ff66] text-xs font-mono text-[#f4f5f8] placeholder:text-[#555c70] outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-[#10121a] border border-[#232635] text-[11px] font-mono text-[#8b93a7]">
                Notice: Instant pass issuance is enabled for this frontend prototype. Data persists to your browser digital hub.
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#00ff66] text-[#090a0f] font-mono font-bold text-xs shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                >
                  CONFIRM &amp; MINT DIGITAL TICKET
                </button>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    onClick={handleResetModal}
                    className="px-4 py-3 bg-[#171924] border border-[#232635] text-[#8b93a7] font-mono text-xs hover:text-[#f4f5f8]"
                  >
                    CANCEL
                  </button>
                </Dialog.Close>
              </div>
            </form>
          ) : (
            /* Confirmation View: Stylized Cyber Ticket */
            <div className="space-y-6 text-center">
              <div className="w-12 h-12 mx-auto bg-[#00ff66]/10 border border-[#00ff66] text-[#00ff66] flex items-center justify-center">
                <CheckCircle className="w-6 h-6 animate-pulse" />
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#00ff66] font-bold tracking-widest">
                  // ENTRY PASS GRANTED
                </span>
                <h3 className="font-display font-bold text-2xl text-[#f4f5f8] mt-1">
                  YOU ARE ENROLLED
                </h3>
              </div>

              {/* Digital Pass Mock Ticket */}
              <div className="p-4 bg-[#10121a] border border-[#00ff66] text-left font-mono text-xs space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-start border-b border-[#232635] pb-2">
                  <div>
                    <span className="text-[9px] text-[#8b93a7]">TICKET ID</span>
                    <div className="text-[#00ff66] font-bold text-sm">{ticketId}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-[#8b93a7]">STATUS</span>
                    <div className="text-[#00f0ff] font-bold">VERIFIED</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#555c70] block">ATTENDEE</span>
                    <span className="text-[#f4f5f8] font-medium">{fullName}</span>
                  </div>
                  <div>
                    <span className="text-[#555c70] block">VENUE</span>
                    <span className="text-[#f4f5f8]">{event.schedules?.[0]?.venue || "Main Arena"}</span>
                  </div>
                </div>

                {/* Stylized QR Code Pattern */}
                <div className="pt-2 border-t border-[#232635] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-8 h-8 text-[#00ff66]" />
                    <span className="text-[9px] text-[#8b93a7]">
                      SCAN AT ENTRY DESK
                    </span>
                  </div>
                  <span className="text-[10px] text-[#ffb800] font-bold">
                    [OFFLINE READY]
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href="/dashboard"
                  className="flex-1 py-3 bg-[#00ff66] text-[#090a0f] font-mono font-bold text-xs shadow-brutal-sm text-center"
                >
                  GO TO MY DIGITAL HUB
                </a>
                <Dialog.Close asChild>
                  <button
                    onClick={handleResetModal}
                    className="px-4 py-3 bg-[#171924] border border-[#232635] text-[#8b93a7] font-mono text-xs hover:text-[#f4f5f8]"
                  >
                    DISMISS
                  </button>
                </Dialog.Close>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
