import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TabTitleSync } from "@/components/tab-title-sync";
import { FirstLoadIntro } from "@/components/FirstLoadIntro";
import { FIRST_LOAD_INTRO_SCRIPT } from "@/lib/first-load-intro-script";
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
  title: {
    default: "Nexus Fest '26",
    template: "%s • Nexus Fest '26",
  },
  description:
    "National annual college technology and cultural festival. 30 flagship hackathons, autonomous robotics competitions, and deep-dive engineering workshops with ₹1,50,000+ in prizes.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Nexus Fest '26",
    description:
      "Join 5,000+ developers, designers, and roboticists across 30 events in Coimbatore and online.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#14082E",
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
      suppressHydrationWarning
    >
      <head>
        {/* Render-blocking first-visit check: hides the intro instantly for returning visitors */}
        <script dangerouslySetInnerHTML={{ __html: FIRST_LOAD_INTRO_SCRIPT }} />
      </head>
      <body className="min-h-screen flex flex-col nexus-page-bg text-[#FFFDF2] antialiased selection:bg-[#E63E9B] selection:text-white font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-zinc-950 focus:font-medium focus:rounded-none shadow-lg"
        >
          Skip to content
        </a>

        <FirstLoadIntro />

        <Providers>
          <TabTitleSync />
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
