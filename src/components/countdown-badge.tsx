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
      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
        <Clock className="w-3 h-3 text-zinc-600" />
        <span>Calculating deadline...</span>
      </span>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 font-medium">
        <Clock className="w-3 h-3 text-rose-400" />
        <span>Registration closed</span>
      </span>
    );
  }

  const formatted =
    timeLeft.days > 0
      ? `${timeLeft.days}d ${timeLeft.hours.toString().padStart(2, "0")}h`
      : `${timeLeft.hours.toString().padStart(2, "0")}h ${timeLeft.minutes
          .toString()
          .padStart(2, "0")}m ${timeLeft.seconds.toString().padStart(2, "0")}s`;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 tabular-nums select-none"
      title={`Closes at ${deadlineIso}`}
    >
      <Clock className="w-3 h-3 text-amber-400 shrink-0" />
      <span className="tracking-tight">{formatted} left to register</span>
    </span>
  );
}
