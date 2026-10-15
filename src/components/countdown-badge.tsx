"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CountdownBadgeProps {
  deadlineIso: string;
}

export function CountdownBadge({ deadlineIso }: CountdownBadgeProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  } | null>(null);

  useEffect(() => {
    if (!deadlineIso) return;

    const target = new Date(deadlineIso).getTime();
    if (isNaN(target)) return;

    const calculate = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [deadlineIso]);

  if (!deadlineIso) return null;
  if (!timeLeft) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-pixel-clean text-[#D8E2FF]/60">
        <Clock className="w-3 h-3 text-[#A5E8FF]" />
        <span>CALCULATING...</span>
      </span>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none text-[10px] font-pixel-clean text-[#FFFDF2] bg-[#E63E9B] border-2 border-[#100526] font-bold shadow-[2px_2px_0px_#090318]">
        <Clock className="w-3 h-3 text-white" />
        <span>REGISTRATION CLOSED</span>
      </span>
    );
  }

  const formatted =
    timeLeft.days > 0
      ? `${timeLeft.days}D ${timeLeft.hours.toString().padStart(2, "0")}H`
      : `${timeLeft.hours.toString().padStart(2, "0")}H ${timeLeft.minutes
          .toString()
          .padStart(2, "0")}M ${timeLeft.seconds.toString().padStart(2, "0")}S`;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none text-[10px] font-pixel-clean text-[#FFF3B8] bg-[#140930] border border-[#FFF3B8]/40 tabular-nums select-none shadow-[2px_2px_0px_#090318]"
      title={`Closes at ${deadlineIso}`}
    >
      <Clock className="w-3 h-3 text-[#FFF3B8] shrink-0" />
      <span className="tracking-tight">{formatted} LEFT TO REGISTER</span>
    </span>
  );
}
