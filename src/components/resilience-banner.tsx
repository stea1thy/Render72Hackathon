"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, RefreshCw, AlertTriangle, Clock } from "lucide-react";
import { getLastKnownGood } from "@/lib/api";

interface ResilienceBannerProps {
  onRetry?: () => void;
  isFetching?: boolean;
}

export function ResilienceBanner({ onRetry, isFetching = false }: ResilienceBannerProps) {
  const [isOffline, setIsOffline] = useState(false);
  const [lkgInfo, setLkgInfo] = useState<{ timestamp: number } | null>(null);
  const [showSlowHint, setShowSlowHint] = useState(false);

  useEffect(() => {
    // Check initial online status
    if (typeof navigator !== "undefined") {
      setIsOffline(!navigator.onLine);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check if LKG snapshot exists in localStorage
    const saved = getLastKnownGood<unknown>("events_list");
    if (saved) {
      setLkgInfo({ timestamp: saved.timestamp });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Show slow hint after 3s of fetching
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isFetching) {
      timer = setTimeout(() => {
        setShowSlowHint(true);
      }, 3000);
    } else {
      setShowSlowHint(false);
    }
    return () => clearTimeout(timer);
  }, [isFetching]);

  const formattedTime = lkgInfo
    ? new Date(lkgInfo.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  return (
    <div className="w-full space-y-2 text-xs mb-4">
      {/* Offline Alert Banner */}
      {isOffline && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/90 border border-rose-500/20 text-rose-300 backdrop-blur-md"
        >
          <div className="flex items-center gap-2.5">
            <WifiOff className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-medium">
              Offline Mode — You&apos;re browsing cached event data. Reconnecting when internet is restored.
            </span>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1.5 bg-white text-zinc-950 font-semibold text-xs rounded-lg hover:bg-zinc-200 transition-colors shrink-0"
            >
              Reconnect
            </button>
          )}
        </div>
      )}

      {/* Slow Connection Diagnostic Hint */}
      {showSlowHint && !isOffline && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2.5 p-3.5 rounded-xl bg-zinc-900/90 border border-amber-500/20 text-amber-300 backdrop-blur-md"
        >
          <Clock className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
          <span>
            Connecting to server — live updates are taking longer than usual. Still attempting to sync...
          </span>
        </div>
      )}
    </div>
  );
}
