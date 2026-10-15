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
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 bg-[#09090b]">
      <div className="w-full max-w-lg p-8 rounded-2xl bg-zinc-900/40 border border-white/10 shadow-2xl text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 mx-auto flex items-center justify-center text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {errorTitle}
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {explanation}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 text-zinc-300 border border-white/10 text-xs hover:text-white hover:border-white/20 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
