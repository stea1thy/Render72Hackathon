import React from "react";
import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-lg p-8 sm:p-10 rounded-none bg-[#1B0E40] border-[3px] border-[#6B2BB5] shadow-[8px_8px_0px_#090318] text-center space-y-6">
        <div className="w-14 h-14 rounded-none bg-[#12072B] border-2 border-[#FFF3B8] mx-auto flex items-center justify-center text-[#FFF3B8] font-pixel-block text-base shadow-[3px_3px_0px_#090318]">
          404
        </div>

        <div className="space-y-2">
          <h1 className="font-pixel-block text-xl sm:text-2xl text-white">
            Page Not Found
          </h1>
          <p className="font-mono text-xs sm:text-sm text-[#D8E2FF]/80 leading-relaxed max-w-sm mx-auto">
            The event arena or festival page you are looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#FFFDF2] text-[#1B0E40] border-2 border-[#100526] font-pixel-clean font-bold text-xs uppercase shadow-[3px_3px_0px_#E63E9B] hover:bg-[#FFE699] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <Compass className="w-4 h-4 text-[#E63E9B]" />
            Browse Events
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#110626] border-2 border-[#492191] text-[#D8E2FF] hover:text-white hover:border-[#FFF3B8] font-pixel-clean font-bold text-xs uppercase shadow-[3px_3px_0px_#090318] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <Home className="w-4 h-4 text-[#A5E8FF]" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
