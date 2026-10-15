"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function KickoffCountdown() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 27, hours: 9, minutes: 29, seconds: 45 });

  useEffect(() => {
    // Festival kickoff: November 10, 2026 09:00 IST
    const targetDate = new Date("2026-11-10T09:00:00+05:30").getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5 bg-[#10121a] border-2 border-[#00ff66] shadow-brutal-acid">
      {/* Label and pulse icon */}
      <div className="flex flex-row items-center gap-2.5 text-xs font-mono text-[#00ff66] font-bold border-b sm:border-b-0 sm:border-r border-[#232635] pb-2 sm:pb-0 sm:pr-4">
        <Clock className="w-4 h-4 text-[#00ff66] animate-pulse shrink-0" />
        <span className="tracking-wider">KICKOFF TICKER:</span>
      </div>

      {/* Horizontal flex row of countdown unit boxes with gaps */}
      <div className="flex flex-row items-center gap-2 sm:gap-3 font-mono tabular-nums">
        <div className="flex flex-col items-center justify-center px-3 py-2 bg-[#090a0f] border border-[#232635] min-w-[60px]">
          <span className="font-extrabold text-xl sm:text-2xl text-[#f4f5f8] leading-none">
            {timeLeft.days.toString().padStart(2, "0")}
          </span>
          <span className="text-[10px] text-[#8b93a7] font-semibold mt-1">DAYS</span>
        </div>

        <span className="text-[#00ff66] font-bold text-xl leading-none select-none">:</span>

        <div className="flex flex-col items-center justify-center px-3 py-2 bg-[#090a0f] border border-[#232635] min-w-[60px]">
          <span className="font-extrabold text-xl sm:text-2xl text-[#f4f5f8] leading-none">
            {timeLeft.hours.toString().padStart(2, "0")}
          </span>
          <span className="text-[10px] text-[#8b93a7] font-semibold mt-1">HOURS</span>
        </div>

        <span className="text-[#00ff66] font-bold text-xl leading-none select-none">:</span>

        <div className="flex flex-col items-center justify-center px-3 py-2 bg-[#090a0f] border border-[#232635] min-w-[60px]">
          <span className="font-extrabold text-xl sm:text-2xl text-[#00ff66] leading-none">
            {timeLeft.minutes.toString().padStart(2, "0")}
          </span>
          <span className="text-[10px] text-[#8b93a7] font-semibold mt-1">MINS</span>
        </div>

        <span className="text-[#00ff66] font-bold text-xl leading-none select-none">:</span>

        <div className="flex flex-col items-center justify-center px-3 py-2 bg-[#090a0f] border border-[#232635] min-w-[60px]">
          <span className="font-extrabold text-xl sm:text-2xl text-[#00f0ff] leading-none">
            {timeLeft.seconds.toString().padStart(2, "0")}
          </span>
          <span className="text-[10px] text-[#8b93a7] font-semibold mt-1">SECS</span>
        </div>
      </div>
    </div>
  );
}
