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
        className="w-full py-3.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-500 font-medium text-sm cursor-not-allowed select-none"
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
          className="w-full py-3.5 rounded-xl bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Ticket className="w-4 h-4" />
          <span>Register for Event • {event.price === 0 ? "Free Entry" : `₹${event.price}`}</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 data-[state=open]:animate-fadeIn" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl z-50 p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Event Registration</span>
            </div>
            <Dialog.Close asChild>
              <button
                onClick={handleResetModal}
                className="text-zinc-400 hover:text-white p-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {step === "form" ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Event Details
                </span>
                <h3 className="font-bold text-lg text-white mt-0.5">
                  {event.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Fee: {event.price === 0 ? "Free Entry (₹0)" : `₹${event.price} ${event.is_per_head ? "per person" : "per team"}`} • {event.event_mode === "ONLINE" ? "Online" : "On-Campus Arena"}
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Vance"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 focus:border-white/30 text-sm text-white placeholder:text-zinc-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    College or Student Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.vance@university.edu"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 focus:border-white/30 text-sm text-white placeholder:text-zinc-500 outline-none"
                    />
                  </div>
                </div>

                {!isSolo && (
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Team Name ({event.min_teamsize}–{event.max_teamsize} Members)
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. Neural Vanguard"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 focus:border-white/30 text-sm text-white placeholder:text-zinc-500 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/[0.06] text-xs text-zinc-400">
                Your entry pass will be generated instantly and added to your personal festival hub with an offline QR code.
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Confirm &amp; Issue Pass
                </button>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    onClick={handleResetModal}
                    className="px-4 py-3 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 text-xs hover:text-white"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
              </div>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                  Registration Successful
                </span>
                <h3 className="font-bold text-2xl text-white mt-1">
                  You are registered!
                </h3>
              </div>

              {/* Digital Pass Card */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-white/10 text-left text-xs space-y-3 relative overflow-hidden shadow-xl">
                <div className="flex justify-between items-start border-b border-white/[0.08] pb-2.5">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-mono">PASS ID</span>
                    <div className="text-white font-mono font-bold text-sm">{ticketId}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 font-mono">STATUS</span>
                    <div className="text-emerald-400 font-mono font-semibold">Verified</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-500 text-[10px] font-mono block">ATTENDEE</span>
                    <span className="text-zinc-200 font-medium">{fullName}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] font-mono block">VENUE</span>
                    <span className="text-zinc-200">{event.schedules?.[0]?.venue || "Main Campus Arena"}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white text-zinc-950">
                      <QrCode className="w-8 h-8" />
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      Present at gate check-in
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono font-medium">
                    Offline Ready
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href="/dashboard"
                  className="flex-1 py-3 rounded-lg bg-white text-zinc-950 font-semibold text-xs text-center hover:bg-zinc-200 transition-colors"
                >
                  Go to My Passes
                </a>
                <Dialog.Close asChild>
                  <button
                    onClick={handleResetModal}
                    className="px-4 py-3 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 text-xs hover:text-white"
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
