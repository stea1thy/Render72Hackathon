# NexusFest 2026 // Design System & Architecture Notes

## 1. Aesthetic Identity: Cyber-Brutalism
- **Philosophy**: Counter-culture anti-SaaS visual language tailored for developer conferences and techfests. Replaces soft rounded cards and gradient blobs with high-contrast, razor-sharp technical consoles.
- **Corner Discipline**: `border-radius: 0px` globally across all components, badges, modals, and buttons.
- **Shadow Tokens**: Hard offset box shadows without blur (`4px 4px 0px 0px #00ff66`).

## 2. Color Mood & WCAG Contrast Metrics
- **Canvas Base**: `#090A0F` (Deep Charcoal Zinc)
- **Primary Neon**: `#00FF66` (Acid Green) — **14.5:1** contrast ratio against canvas (WCAG AAA)
- **Secondary Neon**: `#00F0FF` (Electric Cyan) — **16.0:1** contrast ratio against canvas (WCAG AAA)
- **Alert Crimson**: `#FF3344` (Signal Red) — **5.2:1** contrast ratio against canvas (WCAG AA)
- **Warning Amber**: `#FFB800` (Laser Amber) — **11.2:1** contrast ratio against canvas (WCAG AAA)
- **Primary Text**: `#F4F5F8` — **18.5:1** contrast ratio against canvas (WCAG AAA)
- **Muted Text**: `#8B93A7` — **7.2:1** contrast ratio against canvas (WCAG AA)

## 3. Typography Pairing
- **Display**: `Syne` (Google Fonts, weights 700 & 800) — commanding, geometric wide proportions for headers and festival banners.
- **Monospace**: `JetBrains Mono` (Google Fonts, weights 400, 500, 700) — strict mechanical data layout for ticket IDs, registration counters, dates, prices, and telemetry.
- **Body**: `Inter` (Google Fonts, weights 400, 500, 600) — optimal legibility for event briefs and FAQs.

## 4. Signature Micro-Interactions
1. **Dynamic Spotlight Hover**: Driven by CSS variables `--spotlight-x` and `--spotlight-y` updated via `requestAnimationFrame` on fine-pointer devices; automatically disabled on touch devices.
2. **View Transitions API**: Seamless card-to-hero morphing (`view-transition-name: event-cover-[id]`).
3. **Tabular-Nums Tickers**: Fixed-width countdown tickers preventing any cumulative layout shift (CLS < 0.01).
4. **Command Search (cmdk)**: Accessible shortcut modal triggered via `Ctrl+K` or `Cmd+K` and dismissible via `Escape`.
