import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-cyber-grid">
      <div className="w-full max-w-xl p-8 bg-[#10121a] border-2 border-[#ff3344] shadow-brutal-crimson">
        <div className="flex items-center gap-3 text-[#ff3344] font-mono text-xs font-bold mb-4">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
          <span>[SYSTEM ERROR 404: NODE_NOT_FOUND]</span>
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#f4f5f8] mb-3">
          SECTOR UNRESOLVED
        </h1>

        <p className="font-sans text-sm text-[#8b93a7] mb-6 leading-relaxed">
          The requested route, event record, or coordinate does not exist in the NexusFest 2026 database cluster. It may have been unlisted, concluded, or rerouted.
        </p>

        {/* Mock Terminal Output */}
        <div className="p-4 bg-[#06070a] border border-[#232635] font-mono text-xs text-[#00f0ff] mb-6 space-y-1">
          <div>&gt; lookup_node(requested_uri) ... FAIL</div>
          <div>&gt; response: ERR_RECORD_NULL</div>
          <div>&gt; fallback: return_to_cluster_index</div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00ff66] text-[#090a0f] font-mono font-bold text-xs shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <Compass className="w-4 h-4" />
            BROWSE EVENTS CATALOG
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#171924] text-[#f4f5f8] border border-[#232635] font-mono text-xs hover:border-[#00ff66] transition-colors"
          >
            <Home className="w-4 h-4 text-[#00ff66]" />
            RETURN TO ROOT
          </Link>
        </div>
      </div>
    </div>
  );
}
