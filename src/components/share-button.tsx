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
      className="w-full py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-medium">Link Copied</span>
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
