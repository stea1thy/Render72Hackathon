"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[NexusFest Error Boundary]", error);
  }, [error]);

  const isOffline =
    typeof navigator !== "undefined" && navigator.onLine === false;
  const isTimeout =
    error.message?.toLowerCase().includes("timeout") ||
    error.message?.toLowerCase().includes("aborted");
  const is500 =
    error.message?.includes("500") ||
    error.message?.includes("502") ||
    error.message?.includes("503");

  let errorTitle = "Something went wrong";
  let explanation =
    "An unexpected error occurred while loading this page. Please try again or return home.";

  if (isOffline) {
    errorTitle = "You are currently offline";
    explanation =
      "Please check your internet connection and try reloading the page.";
  } else if (isTimeout) {
    errorTitle = "Connection timed out";
    explanation =
      "The server took longer than expected to respond. Please try reloading.";
  } else if (is500) {
    errorTitle = "Server temporarily unavailable";
    explanation =
      "The event server encountered a temporary error. Retrying will automatically attempt to reconnect.";
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 select-none">
      <div className="w-full max-w-lg p-8 sm:p-10 rounded-none bg-[#1B0E40] border-[3px] border-[#E63E9B] shadow-[8px_8px_0px_#090318] text-center space-y-6">
        <div className="w-14 h-14 rounded-none bg-[#12072B] border-2 border-[#E63E9B] mx-auto flex items-center justify-center text-[#E63E9B] shadow-[3px_3px_0px_#090318]">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="font-pixel-block text-lg sm:text-xl text-white">
            {errorTitle}
          </h1>
          <p className="font-mono text-xs sm:text-sm text-[#D8E2FF]/80 leading-relaxed max-w-sm mx-auto">
            {explanation}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#FFFDF2] text-[#1B0E40] border-2 border-[#100526] font-pixel-clean font-bold text-xs uppercase shadow-[3px_3px_0px_#E63E9B] hover:bg-[#FFE699] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
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
