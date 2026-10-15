import React from "react";
import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#09090b] text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            NexusFest &apos;26
          </div>
          <p className="text-zinc-400 leading-relaxed text-xs">
            National college technology and cultural festival. Where 5,000+ builders assemble for three days of hackathons, robotics, and creative engineering.
          </p>
          <div className="text-[11px] text-zinc-500 font-mono">
            October 16–18, 2026 • Coimbatore &amp; Online
          </div>
        </div>

        <div>
          <h2 className="text-zinc-200 font-semibold mb-3 tracking-tight text-xs uppercase">
            Explore
          </h2>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/events" className="hover:text-white transition-colors">
                Events Catalog
              </Link>
            </li>
            <li>
              <Link href="/events?type=WORKSHOP" className="hover:text-white transition-colors">
                Hands-on Workshops
              </Link>
            </li>
            <li>
              <Link href="/events?is_technical=true" className="hover:text-white transition-colors">
                Technical Hackathons
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Attendee Pass Hub
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-zinc-200 font-semibold mb-3 tracking-tight text-xs uppercase">
            Platform &amp; Data
          </h2>
          <div className="space-y-2 text-xs">
            <p className="text-zinc-400">
              Live event cluster served via:
            </p>
            <a
              href="https://render72.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:underline font-mono"
            >
              render72.pages.dev
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-[11px] text-zinc-500 pt-1">
              ISR 60s revalidation, client-side caching with 8s timeouts and exponential retries.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-zinc-200 font-semibold mb-3 tracking-tight text-xs uppercase">
            Festival Info
          </h2>
          <div className="space-y-1.5 text-xs text-zinc-400">
            <p>• 30 Flagship Events &amp; Arenas</p>
            <p>• ₹1,50,000+ Cash Prize Pool</p>
            <p>• Keyboard Navigable &amp; Accessible</p>
            <p>• Instant Digital QR Check-in</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.06] py-6 bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
          <div>© 2026 NexusFest Organizing Committee. All rights reserved.</div>
          <div className="mt-2 sm:mt-0 font-mono text-[11px]">
            Designed for builders and creators.
          </div>
        </div>
      </div>
    </footer>
  );
}
