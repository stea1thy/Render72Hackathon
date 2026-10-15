"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function KickoffCountdown() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 3, hours: 18, minutes: 12, seconds: 0 });

  useEffect(() => {
    // Festival kickoff: October 19, 2026 18:00 IST (~3 days in future)
    const targetDate = new Date("2026-10-19T18:00:00+05:30").getTime();

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
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-none bg-[#1B0E40] border-2 border-[#492191] shadow-[4px_4px_0px_#090318] select-none">
      {/* Label and pulse icon */}
      <div className="flex flex-row items-center gap-2.5 text-xs font-pixel-clean text-[#FFF3B8] font-bold border-b sm:border-b-0 sm:border-r border-[#38208C]/50 pb-2 sm:pb-0 sm:pr-4">
        <Clock className="w-4 h-4 text-[#E63E9B] shrink-0" />
        <span className="tracking-wider uppercase">REGISTRATION CLOSES:</span>
      </div>

      {/* Horizontal flex row of countdown unit boxes with gaps */}
      <div className="flex flex-row items-center gap-2 sm:gap-3 font-mono tabular-nums">
        <div className="flex flex-col items-center justify-center px-3 py-2 bg-[#0E0624] border border-[#492191] rounded-none min-w-[55px]">
          <span className="font-pixel-block text-base sm:text-lg text-[#FFFDF2] leading-none">
            {timeLeft.days.toString().padStart(2, "0")}
          </span>
          <span className="text-[9px] text-[#A5E8FF] font-pixel-clean mt-1.5">DAYS</span>
        </div>

        <span className="text-[#38208C] font-bold text-lg leading-none select-none">:</span>

        <div className="flex flex-col items-center justify-center px-3 py-2 bg-[#0E0624] border border-[#492191] rounded-none min-w-[55px]">
          <span className="font-pixel-block text-base sm:text-lg text-[#FFFDF2] leading-none">
            {timeLeft.hours.toString().padStart(2, "0")}
          </span>
          <span className="text-[9px] text-[#A5E8FF] font-pixel-clean mt-1.5">HOURS</span>
        </div>

        <span className="text-[#38208C] font-bold text-lg leading-none select-none">:</span>

        <div className="flex flex-col items-center justify-center px-3 py-2 bg-[#0E0624] border border-[#492191] rounded-none min-w-[55px]">
          <span className="font-pixel-block text-base sm:text-lg text-[#FFFDF2] leading-none">
            {timeLeft.minutes.toString().padStart(2, "0")}
          </span>
          <span className="text-[9px] text-[#A5E8FF] font-pixel-clean mt-1.5">MINS</span>
        </div>

        <span className="text-[#38208C] font-bold text-lg leading-none select-none">:</span>

        <div className="flex flex-col items-center justify-center px-3 py-2 bg-[#0E0624] border border-[#492191] rounded-none min-w-[55px]">
          <span className="font-pixel-block text-base sm:text-lg text-[#E63E9B] leading-none">
            {timeLeft.seconds.toString().padStart(2, "0")}
          </span>
          <span className="text-[9px] text-[#E63E9B] font-pixel-clean mt-1.5">SECS</span>
        </div>
      </div>
    </div>
  );
}
