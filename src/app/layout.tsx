import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getEvents } from "@/lib/api";
import type { EventSummary } from "@/lib/types";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NexusFest 2026 — Where Builders Compete",
  description:
    "National annual college technology and cultural festival. 30 flagship hackathons, autonomous robotics competitions, and deep-dive engineering workshops with ₹1,50,000+ in prizes.",
  openGraph: {
    title: "NexusFest 2026 — Where Builders Compete",
    description:
      "Join 5,000+ developers, designers, and roboticists across 30 events in Coimbatore and online.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialEvents: EventSummary[] = [];
  try {
    initialEvents = await getEvents();
  } catch {
    initialEvents = [];
  }

  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable} dark`}
    >
      <body className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100 antialiased selection:bg-emerald-500 selection:text-zinc-950 font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-zinc-950 focus:font-medium focus:rounded-md shadow-lg"
        >
          Skip to content
        </a>

        <Providers>
          <Navbar events={initialEvents} />
          <main id="main-content" className="flex-1 w-full flex flex-col min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
