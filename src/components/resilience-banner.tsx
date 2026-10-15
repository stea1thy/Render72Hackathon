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
    <div className="w-full space-y-2 font-mono text-xs mb-4">
      {/* Offline Alert Banner */}
      {isOffline && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-between p-3 bg-[#171012] border-2 border-[#ff3344] text-[#ff3344] shadow-brutal-crimson"
        >
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 animate-bounce" />
            <span className="font-bold">
              [SYSTEM OFFLINE] Network transceiver disconnected. Operating on local cache.
            </span>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1 bg-[#ff3344] text-[#090a0f] font-bold text-[10px] hover:bg-white transition-colors"
            >
              RECONNECT
            </button>
          )}
        </div>
      )}

      {/* Slow Connection Diagnostic Hint */}
      {showSlowHint && !isOffline && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 p-3 bg-[#1a1608] border border-[#ffb800] text-[#ffb800]"
        >
          <Clock className="w-4 h-4 animate-spin" />
          <span>
            [CLUSTER LATENCY HIGH] Upstream server response is taking &gt;3000ms. Still attempting handshake...
          </span>
        </div>
      )}
    </div>
  );
}
