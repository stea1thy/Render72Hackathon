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
      toast.error("Missing information", {
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
    toast.success("Registration Confirmed", {
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
        className="w-full py-3.5 rounded-none bg-[#110626] border-2 border-[#492191] text-zinc-500 font-pixel-clean text-xs sm:text-sm font-bold uppercase cursor-not-allowed select-none shadow-[3px_3px_0px_#090318]"
      >
        {isSoldOut ? "Registration Sold Out" : "Registration Closed"}
      </button>
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="w-full py-3.5 rounded-none bg-[#FFFDF2] text-[#1B0E40] border-2 border-[#100526] font-pixel-clean font-bold text-xs sm:text-sm uppercase shadow-[4px_4px_0px_#E63E9B] hover:bg-[#FFE699] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Ticket className="w-4 h-4 text-[#E63E9B]" />
          <span>Register Now • {event.price === 0 ? "Free Entry" : `₹${event.price}`}</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#060210]/85 backdrop-blur-sm z-50 data-[state=open]:animate-fadeIn" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#1B0E40] border-[3px] border-[#6B2BB5] rounded-none shadow-[8px_8px_0px_#090318] z-50 p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b-2 border-[#38208C]/60 pb-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-pixel-clean text-[#A5E8FF] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#E63E9B]" />
              <span>EVENT REGISTRATION</span>
            </div>
            <Dialog.Close asChild>
              <button
                onClick={handleResetModal}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {step === "form" ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-pixel-clean text-[#A5E8FF] uppercase tracking-wider">
                  EVENT DETAILS
                </span>
                <h3 className="font-pixel-clean font-bold text-base sm:text-lg text-white">
                  {event.name}
                </h3>
                <p className="font-mono text-xs text-[#D8E2FF]/80 mt-1">
                  Fee: {event.price === 0 ? "Free Entry (₹0)" : `₹${event.price} ${event.is_per_head ? "per person" : "per team"}`} • {event.event_mode === "ONLINE" ? "Online" : "On-Campus Arena"}
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-xs font-pixel-clean text-[#D8E2FF] mb-1.5">
                    FULL NAME *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A5E8FF]" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Vance"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-none bg-[#0E0624] border-2 border-[#492191] focus:border-[#FFF3B8] text-xs sm:text-sm font-mono text-white placeholder:text-[#D8E2FF]/40 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-pixel-clean text-[#D8E2FF] mb-1.5">
                    COLLEGE OR STUDENT EMAIL *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A5E8FF]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.vance@university.edu"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-none bg-[#0E0624] border-2 border-[#492191] focus:border-[#FFF3B8] text-xs sm:text-sm font-mono text-white placeholder:text-[#D8E2FF]/40 outline-none"
                    />
                  </div>
                </div>

                {!isSolo && (
                  <div>
                    <label className="block text-xs font-pixel-clean text-[#D8E2FF] mb-1.5">
                      TEAM NAME ({event.min_teamsize}–{event.max_teamsize} MEMBERS)
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A5E8FF]" />
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. Neural Vanguard"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-none bg-[#0E0624] border-2 border-[#492191] focus:border-[#FFF3B8] text-xs sm:text-sm font-mono text-white placeholder:text-[#D8E2FF]/40 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-none bg-[#12072B] border-2 border-[#492191] text-xs font-mono text-[#D8E2FF]/80">
                Your entry pass will be generated instantly and added to your personal festival hub with an offline QR code.
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-none bg-[#FFFDF2] text-[#1B0E40] border-2 border-[#100526] font-pixel-clean font-bold text-xs uppercase shadow-[3px_3px_0px_#E63E9B] hover:bg-[#FFE699] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  Confirm &amp; Issue Pass
                </button>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    onClick={handleResetModal}
                    className="px-4 py-3 rounded-none bg-[#110626] border-2 border-[#492191] text-[#D8E2FF] font-pixel-clean text-xs hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
              </div>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-none bg-[#12072B] border-2 border-[#FFF3B8] text-[#FFF3B8] flex items-center justify-center shadow-[3px_3px_0px_#090318]">
                <CheckCircle className="w-6 h-6 text-[#A5E8FF]" />
              </div>

              <div>
                <span className="text-xs font-pixel-clean text-[#A5E8FF] font-bold uppercase tracking-wider">
                  REGISTRATION SUCCESSFUL
                </span>
                <h3 className="font-pixel-block text-lg sm:text-xl text-white mt-1">
                  YOU ARE REGISTERED!
                </h3>
              </div>

              {/* Digital Pass Card */}
              <div className="p-5 rounded-none bg-[#12072B] border-2 border-[#FFF3B8] text-left text-xs space-y-3 relative overflow-hidden shadow-[4px_4px_0px_#090318]">
                <div className="flex justify-between items-start border-b-2 border-[#38208C]/60 pb-2.5">
                  <div>
                    <span className="text-[10px] text-[#A5E8FF] font-pixel-clean">PASS ID</span>
                    <div className="text-white font-mono font-bold text-sm">{ticketId}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#FFF3B8] font-pixel-clean">STATUS</span>
                    <div className="text-[#A5E8FF] font-pixel-clean font-bold">VERIFIED</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[#D8E2FF]/60 text-[10px] block font-pixel-clean">ATTENDEE</span>
                    <span className="text-white font-medium">{fullName}</span>
                  </div>
                  <div>
                    <span className="text-[#D8E2FF]/60 text-[10px] block font-pixel-clean">VENUE</span>
                    <span className="text-white">{event.schedules?.[0]?.venue || "Main Campus Arena"}</span>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-[#38208C]/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-none bg-white text-[#1B0E40]">
                      <QrCode className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] text-[#D8E2FF]/80 font-mono">
                      Present at gate check-in
                    </span>
                  </div>
                  <span className="text-xs text-[#FFF3B8] font-pixel-clean font-bold">
                    OFFLINE READY
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href="/passes"
                  className="flex-1 py-3 rounded-none bg-[#FFFDF2] text-[#1B0E40] border-2 border-[#100526] font-pixel-clean font-bold text-xs uppercase shadow-[3px_3px_0px_#E63E9B] hover:bg-[#FFE699] text-center transition-all"
                >
                  Go to My Passes
                </a>
                <Dialog.Close asChild>
                  <button
                    onClick={handleResetModal}
                    className="px-4 py-3 rounded-none bg-[#110626] border-2 border-[#492191] text-[#D8E2FF] font-pixel-clean text-xs hover:text-white cursor-pointer"
                  >
                    Done
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
