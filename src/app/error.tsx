"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";

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

  let errorTitle = "UNEXPECTED SYSTEM ANOMALY";
  let explanation =
    "A transmission fault occurred while communicating with the cluster. The system caught the exception gracefully.";

  if (isOffline) {
    errorTitle = "OFFLINE LINK DETECTED";
    explanation =
      "Your network transceiver lost connection. Please check your WiFi / mobile data and retry.";
  } else if (isTimeout) {
    errorTitle = "TRANSMISSION TIMEOUT (8000ms EXCEEDED)";
    explanation =
      "The server took longer than 8 seconds to respond. The request was aborted to prevent hanging.";
  } else if (is500) {
    errorTitle = "UPSTREAM SERVER FAULT (HTTP 5xx)";
    explanation =
      "The remote event cluster encountered an internal error. Retrying will trigger exponential backoff.";
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-cyber-grid">
      <div className="w-full max-w-xl p-8 bg-[#10121a] border-2 border-[#ff3344] shadow-brutal-crimson">
        <div className="flex items-center gap-2 text-[#ff3344] font-mono text-xs font-bold mb-4">
          <AlertOctagon className="w-5 h-5 animate-pulse" />
          <span>[SYSTEM EXCEPTION CAUGHT]</span>
        </div>

        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#f4f5f8] mb-3">
          {errorTitle}
        </h1>

        <p className="font-sans text-sm text-[#8b93a7] mb-6 leading-relaxed">
          {explanation}
        </p>

        <div className="p-3 bg-[#06070a] border border-[#232635] font-mono text-xs text-[#ff3344] mb-6 overflow-x-auto">
          <code>&gt; {error.message || "Unknown error"}</code>
          {error.digest && (
            <div className="text-[#555c70] text-[10px] mt-1">
              DIGEST: {error.digest}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00ff66] text-[#090a0f] font-mono font-bold text-xs shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            RETRY TRANSMISSION
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#171924] text-[#f4f5f8] border border-[#232635] font-mono text-xs hover:border-[#00ff66] transition-colors"
          >
            <Home className="w-4 h-4 text-[#00ff66]" />
            SAFE RETURN TO HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
