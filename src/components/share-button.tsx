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
      toast.success("LINK COPIED TO CLIPBOARD", {
        description: `Direct coordinate link for ${eventName} ready to share.`,
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      type="button"
      className="w-full py-2.5 bg-[#171924] border border-[#232635] text-[#8b93a7] hover:text-[#00f0ff] hover:border-[#00f0ff] font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-[#00ff66]" />
          <span className="text-[#00ff66]">COORDINATE LINK COPIED</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          <span>SHARE EVENT NODE</span>
        </>
      )}
    </button>
  );
}
