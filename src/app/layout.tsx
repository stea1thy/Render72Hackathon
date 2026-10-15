import type { Metadata, Viewport } from "next";
import { Syne, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getEvents } from "@/lib/api";
import type { EventSummary } from "@/lib/types";

const fontDisplay = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NexusFest 2026 // College Techfest Protocol",
  description:
    "NexusFest 2026: High-energy cyber-brutalist college tech fest featuring hackathons, robotics, competitive programming, and creative tech symposiums.",
  keywords: [
    "NexusFest",
    "Techfest",
    "Hackathon",
    "Robotics",
    "Coding",
    "Workshops",
    "College Fest",
  ],
  authors: [{ name: "NexusFest Organizing Committee" }],
  openGraph: {
    title: "NexusFest 2026 // College Techfest Protocol",
    description:
      "Explore 30+ cutting-edge events, hackathons, and workshops at NexusFest 2026. Register solo or assemble your squad.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#090a0f",
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
    // Graceful fallback for initial layout render
    initialEvents = [];
  }

  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontMono.variable} ${fontSans.variable} dark`}
    >
      <body className="min-h-screen flex flex-col bg-[#090a0f] text-[#f4f5f8] antialiased selection:bg-[#00ff66] selection:text-[#090a0f]">
        {/* Accessible skip to main content link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00ff66] focus:text-[#090a0f] focus:font-mono focus:font-bold focus:shadow-brutal-zinc"
        >
          [SKIP TO CONTENT]
        </a>

        <Providers>
          <Navbar events={initialEvents} />
          <main id="main-content" className="flex-1 w-full min-h-screen flex flex-col">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
