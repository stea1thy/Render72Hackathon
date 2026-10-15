import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 bg-[#09090b]">
      <div className="w-full max-w-lg p-8 rounded-2xl bg-zinc-900/40 border border-white/10 shadow-2xl text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/10 mx-auto flex items-center justify-center text-zinc-400 font-mono text-sm font-semibold">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Page Not Found
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The event or page you are looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors"
          >
            <Compass className="w-4 h-4" />
            Browse Events
          </Link>
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
