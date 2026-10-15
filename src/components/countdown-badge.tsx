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
      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8b93a7]">
        <Clock className="w-3 h-3 text-[#555c70]" />
        <span>CALCULATING...</span>
      </span>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#ff3344] font-semibold">
        <Clock className="w-3 h-3 text-[#ff3344]" />
        <span>[DEADLINE PASSED]</span>
      </span>
    );
  }

  // Fixed width monospace formatting prevents layout shift during ticking
  const formatted =
    timeLeft.days > 0
      ? `${timeLeft.days}d ${timeLeft.hours.toString().padStart(2, "0")}h`
      : `${timeLeft.hours.toString().padStart(2, "0")}h ${timeLeft.minutes
          .toString()
          .padStart(2, "0")}m ${timeLeft.seconds.toString().padStart(2, "0")}s`;

  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#ffb800] bg-[#1a1608] px-1.5 py-0.5 border border-[#ffb800]/40 tabular-nums select-none"
      title={`Closes at ${deadlineIso}`}
    >
      <Clock className="w-3 h-3 text-[#ffb800] shrink-0" />
      <span className="tracking-tight">{formatted} LEFT</span>
    </span>
  );
}
