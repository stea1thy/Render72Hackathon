import React from "react";
import Link from "next/link";
import { Terminal, Shield, Cpu, Activity, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#232635] bg-[#06070a] text-[#8b93a7] font-mono text-xs">
      {/* Top Banner / System Telemetry Bar */}
      <div className="border-b border-[#232635] py-3 bg-[#090a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#00ff66]"></span>
            <span className="text-[#f4f5f8] font-bold tracking-wider">
              NEXUSFEST OS // BUILD 2026.10
            </span>
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <span className="text-[#00f0ff]">// 30 NODES ONLINE</span>
            <span className="text-[#ffb800]">// ARCHITECTURE: APP ROUTER</span>
            <span className="text-[#00ff66]">// LATENCY: &lt;200MS</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2 text-[#f4f5f8] font-display font-bold text-lg">
            <span className="text-[#00ff66]">&gt;</span> NEXUSFEST
          </div>
          <p className="text-xs text-[#8b93a7] leading-relaxed">
            The premier cyber-brutalist collegiate technology symposium. Hackathons, robotics, competitive coding, and creative tech frontiers.
          </p>
          <div className="text-[11px] text-[#555c70]">
            PROTOCOL_VERSION: v4.12.0-STABLE
          </div>
        </div>

        <div>
          <h2 className="text-[#f4f5f8] font-bold mb-4 tracking-wider text-xs">
            [DIRECTORY]
          </h2>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/events" className="hover:text-[#00ff66] transition-colors">
                &gt; Events Catalog
              </Link>
            </li>
            <li>
              <Link href="/events?type=WORKSHOP" className="hover:text-[#00ff66] transition-colors">
                &gt; Expert Workshops
              </Link>
            </li>
            <li>
              <Link href="/events?is_technical=true" className="hover:text-[#00ff66] transition-colors">
                &gt; Technical Competitions
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-[#00ff66] transition-colors">
                &gt; Virtual Pass Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-[#f4f5f8] font-bold mb-4 tracking-wider text-xs">
            [API ATTRIBUTION]
          </h2>
          <div className="space-y-2 text-xs">
            <p className="text-[#8b93a7]">
              Live event cluster served via:
            </p>
            <a
              href="https://render72.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#00f0ff] hover:underline"
            >
              render72.pages.dev
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-[11px] text-[#555c70] pt-1">
              Zero auth, resilient client-side caching with 8s timeouts and exponential retries.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-[#f4f5f8] font-bold mb-4 tracking-wider text-xs">
            [ACCESSIBILITY &amp; SPECS]
          </h2>
          <div className="space-y-1.5 text-[11px] text-[#8b93a7]">
            <p>• WCAG 2.1 AA Contrast Compliant (14.5:1)</p>
            <p>• Prefers-Reduced-Motion Full Fallback</p>
            <p>• Keyboard Navigable + ARIA Landmarks</p>
            <p>• Zero Layout Shift (CLS &lt; 0.05)</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#232635] py-4 bg-[#06070a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#555c70]">
          <div>© 2026 NEXUSFEST ORGANIZING COMMITTEE. ALL RIGHTS RESERVED.</div>
          <div className="mt-2 sm:mt-0">DESIGNED WITH HIGH-CONTRAST CYBER-BRUTALISM</div>
        </div>
      </div>
    </footer>
  );
}
