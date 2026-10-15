# NexusFest 2026 // Campus Techfest Platform

> High-energy, cyber-brutalist collegiate technology symposium platform built with Next.js 16 (App Router), TypeScript, Tailwind CSS, TanStack Query, and Zod.

---

## ⚡ Architecture & Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components + ISR revalidation at 60s)
- **Language**: TypeScript (strict mode, non-null guarantees)
- **Styling**: Tailwind CSS v4 + Cyber-Brutalism theme (`@tailwindcss/turbopack`)
- **Typography**: Google Fonts via `next/font`
  - Display: **Syne** (700/800 bold, commanding display)
  - Monospace Data: **JetBrains Mono** (dates, prices, ticket IDs, counters)
  - Body UI: **Inter** (readable long-form descriptions & FAQs)
- **Data & Caching**: TanStack Query v5 with background refresh and request deduplication
- **Validation**: Zod runtime schema validation with graceful degradation (bad records skipped without crashing)
- **Command Palette**: `cmdk` (accessible keyboard navigation via Ctrl+K)
- **Feedback & Notifications**: `sonner` (cyber-brutalist toasts)
- **Icons**: `lucide-react` (vector SVG only, zero emojis)
- **Testing**: Playwright (viewport matrix & overflow checks) + Vitest (API resilience unit tests)

---

## 🛡️ Resilience & Failure Handling

NexusFest is designed to remain operational under severe upstream failures:
1. **8s Timeout Protection**: Requests are managed with `AbortController`. Any request exceeding 8,000ms aborts cleanly without hanging.
2. **Selective Exponential Retries**: Automatic 3-attempt retry loop with exponential backoff and randomized jitter for network faults, timeouts, and HTTP 5xx responses. HTTP 4xx (e.g. 404) errors fail immediately without wasteful retries.
3. **Single Bad Record Skipping**: When processing the 30 events array, individual malformed or corrupted records are safely skipped, preserving the rest of the catalog.
4. **Last-Known-Good (LKG) Persistence**: Successful cluster responses are preserved in local storage and in-memory caches. If upstream fails, the site serves the cached snapshot with a non-alarming status banner and manual retry action.
5. **Real-Time Offline Detection**: Browser online/offline event listeners automatically surface network state warnings.
6. **Graceful 404 Sector**: Custom cyber-brutalist 404 page for invalid event UUIDs with one-click return to safety.

---

## 🎨 Design System: Cyber-Brutalism

- **Color Palette**:
  - Background: Deep Charcoal Zinc (`#090a0f`, `#10121a`, `#171924`)
  - Neon Accent 1: **Acid Green** (`#00ff66`) — terminal luminescence, 14.5:1 contrast against `#090a0f`
  - Neon Accent 2: **Electric Cyan** (`#00f0ff`) — data telemetry link, 16.0:1 contrast
  - Warning / Ticker: **Laser Amber** (`#ffb800`)
  - Danger / Sold Out: **Signal Crimson** (`#ff3344`)
- **Key Effects**:
  - `border-radius: 0` (strict sharp edges)
  - Hard brutalist drop shadows (`box-shadow: 4px 4px 0px 0px #00ff66`)
  - Spotlight hover tracking mouse coordinates via `requestAnimationFrame` (disabled on touch devices)
  - Zero layout shift countdown ticker with `tabular-nums`
  - View Transitions API integration for card-to-hero morphing

---

## 📱 Viewport Verification

Tested across the full responsive matrix via automated Playwright checks:
- **320px** (Mobile S) — Zero horizontal overflow
- **375px** (Mobile M) — Zero horizontal overflow
- **414px** (Mobile L) — Zero horizontal overflow
- **768px** (Tablet) — Zero horizontal overflow
- **1024px** (Desktop) — Zero horizontal overflow
- **1280px** (Wide Screen) — Zero horizontal overflow
- **1536px** (Extra Wide) — Zero horizontal overflow
- **Mobile Landscape** (667x375) — Zero horizontal overflow

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
pnpm install

# 2. Run API resilience unit tests
pnpm vitest run

# 3. Build optimized production bundle
pnpm build

# 4. Run Playwright end-to-end and viewport tests
npx playwright test

# 5. Start production server
pnpm start -p 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
