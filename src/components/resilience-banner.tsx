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
          className="flex items-center justify-between p-3.5 rounded-none bg-[#1B0E40] border-2 border-[#E63E9B] text-[#FFFDF2] shadow-[4px_4px_0px_#090318] font-mono text-xs"
        >
          <div className="flex items-center gap-2.5">
            <WifiOff className="w-4 h-4 text-[#E63E9B] shrink-0" />
            <span>
              Offline Mode — Browsing cached event data. Reconnecting when internet is restored.
            </span>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1 bg-[#FFFDF2] text-[#1B0E40] border border-[#100526] font-pixel-clean font-bold text-xs rounded-none shadow-[2px_2px_0px_#E63E9B] hover:bg-[#FFE699] shrink-0 cursor-pointer"
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
          className="flex items-center gap-2.5 p-3.5 rounded-none bg-[#1B0E40] border-2 border-[#FFF3B8] text-[#FFF3B8] shadow-[4px_4px_0px_#090318] font-mono text-xs"
        >
          <Clock className="w-4 h-4 text-[#FFF3B8] animate-spin shrink-0" />
          <span>
            Connecting to server — live updates are taking longer than usual. Still attempting to sync...
          </span>
        </div>
      )}
    </div>
  );
}
