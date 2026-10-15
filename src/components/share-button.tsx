"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";

export function ShareButton({ eventName }: { eventName: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard", {
        description: `Direct share link for ${eventName} ready to send.`,
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      type="button"
      className="w-full py-2.5 rounded-none bg-[#110626] border-2 border-[#492191] text-[#D8E2FF] hover:text-white hover:border-[#FFF3B8] font-pixel-clean text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-[3px_3px_0px_#090318] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-[#A5E8FF]" />
          <span className="text-[#A5E8FF]">Link Copied</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Event</span>
        </>
      )}
    </button>
  );
}
