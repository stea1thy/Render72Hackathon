"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

// 4x4 Ordered Bayer Matrix (0..15)
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const SKY_HEX_PALETTE = [
  "#160A36",
  "#231154",
  "#36197A",
  "#52229E",
  "#752AB8",
  "#A133B5",
  "#CE3D99",
  "#EC4B76",
  "#FF6656",
  "#FF884C",
  "#FFAE59",
  "#FFD475",
  "#FFF0A8",
  "#FFFBE0",
];

// Module-level singleton caches so navigating away and back is 100% instant (0ms)
let cachedSkyCanvas: HTMLCanvasElement | null = null;
let cachedCityStaticCanvas: HTMLCanvasElement | null = null;

// Entrance choreography plays once per page load; client-side returns to "/" render static (zero flash)
let heroEntrancePlayed = false;

const heroDelay = (ms: number) => ({ "--nf-d": `${ms}ms` } as React.CSSProperties);

const GLINTS = [
  { pos: "top-[38%] -left-1 sm:left-[6%]", size: "w-3 h-3 sm:w-4 sm:h-4", color: "#A5E8FF", delay: "0.4s" },
  { pos: "top-[8%] right-[30%]", size: "w-3 h-3 sm:w-4 sm:h-4", color: "#FFF3B8", delay: "1.1s" },
  { pos: "bottom-[18%] left-[24%]", size: "w-3 h-3", color: "#E63E9B", delay: "1.7s" },
  { pos: "top-[46%] -right-1 sm:right-[7%]", size: "w-3 h-3 sm:w-4 sm:h-4", color: "#FFF3B8", delay: "0.8s" },
];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function getOrBuildSkyBuffer(W: number, H: number): HTMLCanvasElement {
  if (cachedSkyCanvas) return cachedSkyCanvas;

  const off = document.createElement("canvas");
  off.width = W;
  off.height = H;
  const ctx = off.getContext("2d");
  if (!ctx) return off;

  const imgData = ctx.createImageData(W, H);
  const data = imgData.data;
  const rgbPalette = SKY_HEX_PALETTE.map(hexToRgb);
  const bandHeight = H / (rgbPalette.length - 1);

  for (let y = 0; y < H; y++) {
    const exactBand = y / bandHeight;
    const bandIdx = Math.min(rgbPalette.length - 2, Math.floor(exactBand));
    const frac = exactBand - bandIdx;
    const c1 = rgbPalette[bandIdx];
    const c2 = rgbPalette[bandIdx + 1];
    const bayerRow = BAYER_4X4[y & 3];

    for (let x = 0; x < W; x++) {
      const threshold = (bayerRow[x & 3] + 0.5) / 16;
      const c = frac > threshold ? c2 : c1;
      const idx = (y * W + x) << 2;
      data[idx] = c[0];
      data[idx + 1] = c[1];
      data[idx + 2] = c[2];
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  cachedSkyCanvas = off;
  return off;
}

function getOrBuildCityBuffer(CW: number, CH: number): HTMLCanvasElement {
  if (cachedCityStaticCanvas) return cachedCityStaticCanvas;

  const off = document.createElement("canvas");
  off.width = CW;
  off.height = CH;
  const ctx = off.getContext("2d");
  if (!ctx) return off;
  ctx.imageSmoothingEnabled = false;

  const baseY = CH;

  // 1. FAR SKYLINE LAYER (Soft Royal Purple Silhouette against Cream Sky)
  const farTowers = [
    { x: 0, w: 18, h: 30 },
    { x: 16, w: 14, h: 42, step: true },
    { x: 28, w: 20, h: 26 },
    { x: 46, w: 15, h: 38, spire: true },
    { x: 60, w: 22, h: 24 },
    { x: 80, w: 16, h: 46, step: true },
    { x: 94, w: 18, h: 32 },
    { x: 110, w: 20, h: 22 },
    { x: 128, w: 14, h: 34 },
    { x: 140, w: 24, h: 20 },
    { x: 318, w: 22, h: 22 },
    { x: 338, w: 16, h: 36, step: true },
    { x: 352, w: 20, h: 28 },
    { x: 370, w: 16, h: 48, spire: true },
    { x: 384, w: 22, h: 32 },
    { x: 404, w: 15, h: 42, step: true },
    { x: 418, w: 20, h: 26 },
    { x: 436, w: 18, h: 44, spire: true },
    { x: 452, w: 16, h: 34 },
    { x: 466, w: 18, h: 28 },
  ];

  farTowers.forEach((b) => {
    const by = baseY - b.h;
    ctx.fillStyle = "#622794";
    ctx.fillRect(b.x, by, b.w, b.h);
    // Warm sunlit top highlight rim
    ctx.fillStyle = "#FFAE59";
    ctx.fillRect(b.x, by, b.w, 1);

    if (b.step) {
      ctx.fillStyle = "#622794";
      ctx.fillRect(b.x + 3, by - 5, b.w - 6, 5);
      ctx.fillStyle = "#FFAE59";
      ctx.fillRect(b.x + 3, by - 5, b.w - 6, 1);
    }
    if (b.spire) {
      const sx = b.x + Math.floor(b.w / 2);
      ctx.fillStyle = "#622794";
      ctx.fillRect(sx, by - 10, 1, 10);
    }

    // Subtle distant pixel windows
    ctx.fillStyle = "#9633C4";
    for (let wy = by + 4; wy < baseY - 12; wy += 4) {
      for (let wx = b.x + 3; wx < b.x + b.w - 3; wx += 4) {
        if ((wx + wy) % 3 !== 0) {
          ctx.fillRect(wx, wy, 2, 2);
        }
      }
    }
  });

  // 2. MIDGROUND SKYLINE LAYER (Deep Violet Skyscrapers with Gold/Pink Lit Windows)
  const midTowers = [
    { x: 4, w: 20, h: 38, roof: "dome", accent: "#FFF3B8" },
    { x: 22, w: 16, h: 28, roof: "flat", accent: "#FF6656" },
    { x: 36, w: 22, h: 46, roof: "spire", accent: "#FFF3B8" },
    { x: 56, w: 18, h: 32, roof: "slant", accent: "#A5E8FF" },
    { x: 72, w: 20, h: 40, roof: "spire", accent: "#FFF3B8" },
    { x: 90, w: 16, h: 24, roof: "flat", accent: "#FF6656" },
    { x: 104, w: 20, h: 30, roof: "dome", accent: "#FFF3B8" },
    { x: 122, w: 18, h: 20, roof: "flat", accent: "#A5E8FF" },
    // Center low-profile bridge & plaza buildings (under the buttons)
    { x: 140, w: 26, h: 15, roof: "flat", accent: "#FFF3B8" },
    { x: 168, w: 28, h: 18, roof: "dome", accent: "#FF6656" },
    { x: 198, w: 32, h: 14, roof: "flat", accent: "#FFF3B8" },
    { x: 232, w: 28, h: 19, roof: "spire", accent: "#A5E8FF" },
    { x: 262, w: 26, h: 16, roof: "flat", accent: "#FFF3B8" },
    { x: 290, w: 22, h: 22, roof: "flat", accent: "#FF6656" },
    // Right wing towers
    { x: 310, w: 20, h: 32, roof: "dome", accent: "#FFF3B8" },
    { x: 328, w: 18, h: 25, roof: "flat", accent: "#A5E8FF" },
    { x: 344, w: 22, h: 42, roof: "spire", accent: "#FFF3B8" },
    { x: 364, w: 18, h: 34, roof: "slant", accent: "#FF6656" },
    { x: 380, w: 24, h: 48, roof: "spire", accent: "#FFF3B8" },
    { x: 402, w: 18, h: 30, roof: "flat", accent: "#A5E8FF" },
    { x: 418, w: 22, h: 40, roof: "dome", accent: "#FFF3B8" },
    { x: 438, w: 20, h: 34, roof: "spire", accent: "#FF6656" },
    { x: 456, w: 24, h: 44, roof: "flat", accent: "#FFF3B8" },
  ];

  midTowers.forEach((t, idx) => {
    const by = baseY - t.h;
    ctx.fillStyle = "#2D1354";
    ctx.fillRect(t.x, by, t.w, t.h);

    // Side & Top Rim Highlights
    ctx.fillStyle = "#EC4B76";
    ctx.fillRect(t.x, by, t.w, 1);
    ctx.fillRect(t.x, by, 1, t.h);

    // Architectural Rooftop Details
    if (t.roof === "dome") {
      ctx.fillStyle = "#2D1354";
      ctx.fillRect(t.x + 4, by - 4, t.w - 8, 4);
      ctx.fillStyle = "#FF884C";
      ctx.fillRect(t.x + 4, by - 4, t.w - 8, 1);
    } else if (t.roof === "spire") {
      const cx = t.x + Math.floor(t.w / 2);
      ctx.fillStyle = "#2D1354";
      ctx.fillRect(cx - 3, by - 4, 6, 4);
      ctx.fillRect(cx, by - 13, 1, 9);
    } else if (t.roof === "slant") {
      for (let s = 0; s < 5; s++) {
        ctx.fillStyle = "#2D1354";
        ctx.fillRect(t.x + s * 2, by - (5 - s), t.w - s * 2, 1);
      }
    }

    // Crisp Pixel Window Patterns
    for (let wy = by + 4; wy < baseY - 8; wy += 4) {
      for (let wx = t.x + 3; wx < t.x + t.w - 3; wx += 4) {
        const seed = (wx * 7 + wy * 13 + idx) % 11;
        if (seed < 6) {
          ctx.fillStyle = seed === 0 ? "#FFFFFF" : seed < 3 ? t.accent : "#752AB8";
          ctx.fillRect(wx, wy, 2, 2);
        }
      }
    }
  });

  // Elevated Monorail Track Deck Running Across Horizon (y = baseY - 12)
  ctx.fillStyle = "#1B0B38";
  ctx.fillRect(0, baseY - 11, CW, 2);
  for (let px = 12; px < CW; px += 28) {
    ctx.fillRect(px, baseY - 9, 3, 9);
  }

  // 3. FOREGROUND SKYLINE SILHOUETTE (Matches #120829 Below-the-Fold Background Seamlessly!)
  const fgTowers = [
    { x: 0, w: 16, h: 22 },
    { x: 14, w: 18, h: 30 },
    { x: 30, w: 14, h: 18 },
    { x: 42, w: 20, h: 26 },
    { x: 60, w: 16, h: 16 },
    { x: 74, w: 22, h: 28 },
    { x: 94, w: 18, h: 14 },
    { x: 110, w: 24, h: 10 },
    { x: 132, w: 348, h: 6 }, // Continuous ground base
    { x: 348, w: 20, h: 14 },
    { x: 366, w: 18, h: 24 },
    { x: 382, w: 16, h: 18 },
    { x: 396, w: 22, h: 30 },
    { x: 416, w: 16, h: 20 },
    { x: 430, w: 20, h: 28 },
    { x: 448, w: 18, h: 18 },
    { x: 464, w: 20, h: 26 },
  ];

  fgTowers.forEach((f, idx) => {
    const by = baseY - f.h;
    ctx.fillStyle = "#120829";
    ctx.fillRect(f.x, by, f.w, f.h);

    if (f.h > 10) {
      ctx.fillStyle = "#492191";
      ctx.fillRect(f.x, by, f.w, 1);

      // Tiny glowing cyan/gold foreground windows
      for (let wy = by + 3; wy < baseY - 3; wy += 4) {
        for (let wx = f.x + 3; wx < f.x + f.w - 3; wx += 4) {
          if ((wx + wy + idx) % 4 === 0) {
            ctx.fillStyle = (wx + wy) % 8 === 0 ? "#A5E8FF" : "#FFE699";
            ctx.fillRect(wx, wy, 1, 2);
          }
        }
      }
    }
  });

  cachedCityStaticCanvas = off;
  return off;
}

export function HeroSection({ totalEvents = 30 }: { totalEvents?: number }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 20, mins: 4, secs: 42 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hoveredWord, setHoveredWord] = useState<"create" | "win" | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const skyCanvasRef = useRef<HTMLCanvasElement>(null);
  const cityCanvasRef = useRef<HTMLCanvasElement>(null);
  const isVisibleRef = useRef<boolean>(true);

  // SSR + first hydration: play entrance. Client-side navigation back to "/": static.
  const [playEntrance] = useState(() =>
    typeof window === "undefined" ? true : !heroEntrancePlayed
  );
  useEffect(() => {
    heroEntrancePlayed = true;
  }, []);

  // 1. Pause Canvas Loops When Scrolled Out of View (Saves CPU/Battery on all devices)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // 2. Live Countdown Clock
  useEffect(() => {
    const target = new Date("2026-10-16T14:00:00+05:30").getTime();
    const updateClock = () => {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Instant Cached Sky + Dedicated Bottom Cityscape Render Loop
  useEffect(() => {
    const skyCanvas = skyCanvasRef.current;
    const cityCanvas = cityCanvasRef.current;
    if (!skyCanvas || !cityCanvas) return;

    const skyCtx = skyCanvas.getContext("2d");
    const cityCtx = cityCanvas.getContext("2d");
    if (!skyCtx || !cityCtx) return;

    const SW = 460;
    const SH = 270;
    skyCanvas.width = SW;
    skyCanvas.height = SH;
    skyCtx.imageSmoothingEnabled = false;

    const CW = 480;
    const CH = 64;
    cityCanvas.width = CW;
    cityCanvas.height = CH;
    cityCtx.imageSmoothingEnabled = false;

    // Fetch singleton pre-computed buffers (0ms on repeat visits!)
    const skyBuffer = getOrBuildSkyBuffer(SW, SH);
    const cityBuffer = getOrBuildCityBuffer(CW, CH);

    // Paint frame 0 immediately before requestAnimationFrame even ticks
    skyCtx.drawImage(skyBuffer, 0, 0);
    cityCtx.drawImage(cityBuffer, 0, 0);

    const stars = Array.from({ length: 34 }, (_, i) => ({
      x: (i * 47 + 19) % SW,
      y: (i * 29 + 11) % 120,
      big: i % 5 === 0,
      phase: i * 0.7,
      color: i % 4 === 0 ? "#FFF3B8" : i % 3 === 0 ? "#A5E8FF" : "#FFFFFF",
    }));

    const clouds = [
      { x: 38, y: 42, speed: 0.05, tint: "cool" },
      { x: 355, y: 34, speed: -0.04, tint: "cool" },
      { x: 330, y: 108, speed: 0.035, tint: "warm" },
      { x: 24, y: 120, speed: 0.06, tint: "warm" },
    ];

    const beaconCoords = [
      { x: 47, y: CH - 59 },
      { x: 82, y: CH - 53 },
      { x: 246, y: CH - 32 },
      { x: 355, y: CH - 55 },
      { x: 392, y: CH - 61 },
      { x: 448, y: CH - 47 },
    ];

    let trainX = -60;
    let carX = CW + 20;
    let frame = 0;
    let animId: number;

    const drawDetailedCloud = (cx: number, cy: number, tint: string) => {
      const x = Math.round(cx);
      const y = Math.round(cy);
      skyCtx.fillStyle = "#1B0E40";
      skyCtx.fillRect(x + 9, y - 1, 22, 1);
      skyCtx.fillRect(x + 1, y + 7, 38, 1);
      skyCtx.fillStyle = "#FFFFFF";
      skyCtx.fillRect(x + 10, y, 20, 2);
      skyCtx.fillRect(x + 6, y + 2, 28, 2);
      skyCtx.fillStyle = tint === "cool" ? "#B5EEFF" : "#FFE4B5";
      skyCtx.fillRect(x + 2, y + 4, 36, 2);
      skyCtx.fillStyle = tint === "cool" ? "#62B6E8" : "#F08CAE";
      skyCtx.fillRect(x + 3, y + 6, 34, 1);
    };

    const render = () => {
      if (isVisibleRef.current) {
        frame++;

        // --- SKY CANVAS UPDATE ---
        skyCtx.drawImage(skyBuffer, 0, 0);

        stars.forEach((s) => {
          const blink = Math.sin(frame * 0.05 + s.phase);
          if (blink > -0.25) {
            skyCtx.fillStyle = s.color;
            if (s.big && blink > 0.25) {
              skyCtx.fillRect(s.x - 3, s.y, 7, 1);
              skyCtx.fillRect(s.x, s.y - 3, 1, 7);
              skyCtx.fillStyle = "#FFFFFF";
              skyCtx.fillRect(s.x - 1, s.y - 1, 3, 3);
            } else {
              skyCtx.fillRect(s.x, s.y, 2, 2);
            }
          }
        });

        clouds.forEach((c) => {
          c.x += c.speed;
          if (c.speed > 0 && c.x > SW + 50) c.x = -50;
          if (c.speed < 0 && c.x < -50) c.x = SW + 50;
          drawDetailedCloud(c.x, c.y, c.tint);
        });

        // --- BOTTOM CITYSCAPE CANVAS UPDATE ---
        cityCtx.clearRect(0, 0, CW, CH);

        // Moving Neon Monorail Train Gliding Behind Foreground Towers (y = CH - 13)
        trainX += 1.1;
        if (trainX > CW + 80) trainX = -80;
        const tx = Math.round(trainX);
        cityCtx.fillStyle = "#1B0E40";
        cityCtx.fillRect(tx, CH - 14, 38, 3);
        cityCtx.fillStyle = "#00F0FF";
        for (let w = 2; w < 34; w += 5) {
          cityCtx.fillRect(tx + w, CH - 13, 3, 1);
        }
        cityCtx.fillStyle = "#FF2A6D";
        cityCtx.fillRect(tx - 8, CH - 13, 8, 1);

        // Stamp Static 3-Layer City Buildings Over Monorail Track
        cityCtx.drawImage(cityBuffer, 0, 0);

        // Flying Hover-Car Streaking Across Upper Skyline
        carX -= 1.4;
        if (carX < -30) carX = CW + 40;
        const hx = Math.round(carX);
        cityCtx.fillStyle = "#FFFFFF";
        cityCtx.fillRect(hx, CH - 42, 3, 1);
        cityCtx.fillStyle = "#00F0FF";
        cityCtx.fillRect(hx + 3, CH - 42, 9, 1);

        // Blinking Rooftop Aviation Beacons on Skyscraper Spires
        beaconCoords.forEach((b, idx) => {
          const isLit = Math.floor((frame + idx * 9) / 22) % 2 === 0;
          if (isLit) {
            cityCtx.fillStyle = idx % 2 === 0 ? "#FF2A6D" : "#00F0FF";
            cityCtx.fillRect(b.x, b.y, 2, 2);
          }
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: nx * 10, y: ny * 8 });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        /* Instant SSR Fallback Gradient so navigating NEVER flashes black */
        background:
          "linear-gradient(180deg, #160A36 0%, #36197A 18%, #752AB8 35%, #CE3D99 52%, #FF6656 68%, #FFAE59 82%, #FFF0A8 94%, #120829 100%)",
      }}
      className={`relative min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-between pt-5 pb-14 sm:pt-7 sm:pb-16 px-3 sm:px-6 overflow-hidden select-none ${
        playEntrance ? "" : "nf-hero-static"
      }`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen:wght@400;700&display=swap');

        .font-pixel-block {
          font-family: 'Press Start 2P', monospace;
        }
        .font-pixel-clean {
          font-family: 'Silkscreen', monospace;
        }
        .pixel-canvas {
          image-rendering: -moz-crisp-edges;
          image-rendering: -webkit-crisp-edges;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }

        .discord-pixel-gradient {
          background: linear-gradient(
            180deg,
            #FFFFFF 0%,
            #FFFFFF 18%,
            #D6E4FF 19%,
            #D6E4FF 38%,
            #9BB5FF 39%,
            #9BB5FF 50%,
            #FFFFFF 51%,
            #FFFFFF 64%,
            #8AA2FF 65%,
            #8AA2FF 82%,
            #5B6EE1 83%,
            #5B6EE1 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .pixel-3d-extrude {
          filter:
            drop-shadow(0px -3px 0px #14072E)
            drop-shadow(3px 0px 0px #14072E)
            drop-shadow(-3px 0px 0px #14072E)
            drop-shadow(0px 3px 0px #14072E)
            drop-shadow(2px 4px 0px #5239B5)
            drop-shadow(4px 8px 0px #3B2291)
            drop-shadow(6px 12px 0px #210E54)
            drop-shadow(8px 16px 0px #11052C);
        }

        .pixel-digit-bevel {
          background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 55%, #D8E2FF 56%, #D8E2FF 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter:
            drop-shadow(-2px -2px 0px #1B0E40)
            drop-shadow(2px -2px 0px #1B0E40)
            drop-shadow(-2px 2px 0px #1B0E40)
            drop-shadow(2px 2px 0px #1B0E40)
            drop-shadow(0px 5px 0px #1B0E40);
        }

        .pixel-label-outline {
          color: #FFFFFF;
          text-shadow:
            -2px -2px 0 #1B0E40,
             2px -2px 0 #1B0E40,
            -2px  2px 0 #1B0E40,
             2px  2px 0 #1B0E40,
             0px  3px 0 #1B0E40;
        }

        @keyframes sparklePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.6); opacity: 0.4; }
        }
        .animate-sparkle {
          animation: sparklePulse 1.8s steps(2) infinite;
        }
      `}</style>

      {/* 1. CACHED 4x4 BAYER-DITHERED SUNSET SKY CANVAS */}
      <canvas
        ref={skyCanvasRef}
        className="pixel-canvas pointer-events-none absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* 2. DEDICATED BOTTOM PIXEL-ART CITYSCAPE SKYLINE STRIP (NEVER CROPPED!) */}
      <canvas
        ref={cityCanvasRef}
        className="pixel-canvas pointer-events-none absolute bottom-0 inset-x-0 w-full h-[96px] sm:h-[128px] md:h-[148px] z-[5]"
      />

      {/* 3. TOP PRESENTER BADGE */}
      <div className="relative z-10 pt-1 nf-hero-rise" style={heroDelay(0)}>
        <div className="inline-flex items-center gap-2.5 bg-[#160933]/95 border-2 border-[#FFF3B8] px-3.5 py-1 font-pixel-clean text-[10px] sm:text-xs font-bold tracking-widest text-[#FFF3B8] shadow-[4px_4px_0px_#100526]">
          <span className="h-2 w-2 bg-[#E63E9B]" />
          <span>COIMBATORE // OCT 16–18, 2026</span>
          <span className="h-2 w-2 bg-[#A5E8FF]" />
        </div>
      </div>

      {/* 4. GIANT 3D PIXEL WORDMARK ("NEXUS FEST") */}
      <div
        style={{
          transform: `translate3d(${tilt.x}px, ${tilt.y}px, 0)`,
        }}
        className="relative z-10 w-full max-w-4xl my-auto flex flex-col items-center pt-3 pb-4 sm:py-4 transition-transform duration-150 ease-out"
      >
        {/* Pixel Moon Behind Top-Right */}
        <svg
          viewBox="0 0 36 36"
          className="pixel-canvas pointer-events-none absolute -top-4 right-2 sm:-top-7 sm:right-10 w-20 h-20 sm:w-32 sm:h-32 z-0"
          shapeRendering="crispEdges"
        >
          <rect x="10" y="2" width="16" height="32" fill="#14072E" />
          <rect x="6" y="4" width="24" height="28" fill="#14072E" />
          <rect x="4" y="6" width="28" height="24" fill="#14072E" />
          <rect x="2" y="10" width="32" height="16" fill="#14072E" />
          <rect x="10" y="4" width="16" height="28" fill="#FFFFFF" />
          <rect x="6" y="6" width="24" height="24" fill="#FFFFFF" />
          <rect x="4" y="10" width="28" height="16" fill="#FFFFFF" />
          <rect x="22" y="8" width="6" height="20" fill="#D8E2FF" />
          <rect x="26" y="10" width="4" height="16" fill="#9BB5FF" />
          <rect x="12" y="10" width="4" height="4" fill="#E4ECFF" />
          <rect x="16" y="20" width="6" height="4" fill="#D8E2FF" />
          <rect x="10" y="22" width="3" height="3" fill="#B8C7FF" />
        </svg>

        {/* Top-Left Overlapping Pixel Cloud */}
        <svg
          viewBox="0 0 40 16"
          className="pixel-canvas pointer-events-none absolute -top-2 left-1 sm:-top-4 sm:left-8 w-24 sm:w-32 z-20"
          shapeRendering="crispEdges"
        >
          <rect x="10" y="1" width="20" height="2" fill="#14072E" />
          <rect x="10" y="3" width="20" height="2" fill="#FFFFFF" />
          <rect x="6" y="5" width="28" height="3" fill="#FFFFFF" />
          <rect x="3" y="8" width="34" height="3" fill="#B5EEFF" />
          <rect x="5" y="11" width="30" height="2" fill="#62B6E8" />
          <rect x="6" y="13" width="28" height="2" fill="#14072E" />
        </svg>

        {/* Metallic Sparkle Glints */}
        <svg
          viewBox="0 0 11 11"
          className="pointer-events-none absolute top-1 left-[14%] sm:left-[18%] w-5 h-5 sm:w-6 sm:h-6 z-30 animate-sparkle"
          shapeRendering="crispEdges"
        >
          <rect x="5" y="0" width="1" height="11" fill="#FFFFFF" />
          <rect x="0" y="5" width="11" height="1" fill="#FFFFFF" />
          <rect x="4" y="4" width="3" height="3" fill="#FFF3B8" />
        </svg>
        <svg
          viewBox="0 0 11 11"
          className="pointer-events-none absolute bottom-8 right-[16%] sm:right-[22%] w-4 h-4 sm:w-5 sm:h-5 z-30 animate-sparkle"
          shapeRendering="crispEdges"
        >
          <rect x="5" y="0" width="1" height="11" fill="#FFFFFF" />
          <rect x="0" y="5" width="11" height="1" fill="#FFFFFF" />
          <rect x="4" y="4" width="3" height="3" fill="#A5E8FF" />
        </svg>

        {/* Twinkling + star glints around the letters */}
        {GLINTS.map((g) => (
          <svg
            key={g.pos}
            viewBox="0 0 11 11"
            aria-hidden="true"
            style={{ animationDelay: g.delay }}
            className={`pointer-events-none absolute ${g.pos} ${g.size} z-30 animate-pixel-glint`}
            shapeRendering="crispEdges"
          >
            <rect x="5" y="0" width="1" height="11" fill="#FFFFFF" />
            <rect x="0" y="5" width="11" height="1" fill="#FFFFFF" />
            <rect x="4" y="4" width="3" height="3" fill={g.color} />
          </svg>
        ))}

        {/* Drop-and-pop entrance (wrapper) → continuous pixel levitation (inner) → 3D extruded wordmark.
            Kept on separate elements so neither animation overrides the extrude drop-shadow filter. */}
        <div className="relative z-10 w-full animate-hero-logo-pop" style={heroDelay(80)}>
          <div className="animate-pixel-float">
            <div className="relative w-full text-center leading-[0.95] select-none">
              <div className="font-pixel-block text-[16.5vw] sm:text-7xl md:text-8xl lg:text-[106px] tracking-tight discord-pixel-gradient pixel-3d-extrude">
                NEXUS
              </div>
              <div className="font-pixel-block text-[14.5vw] sm:text-6xl md:text-7xl lg:text-[88px] tracking-tight discord-pixel-gradient pixel-3d-extrude mt-1 sm:mt-0">
                FEST
              </div>
            </div>
          </div>
        </div>

        {/* Bottom-Right Overlapping Pixel Cloud */}
        <svg
          viewBox="0 0 40 16"
          className="pixel-canvas pointer-events-none absolute bottom-0 right-4 sm:right-16 w-24 sm:w-28 z-20"
          shapeRendering="crispEdges"
        >
          <rect x="10" y="1" width="20" height="2" fill="#14072E" />
          <rect x="10" y="3" width="20" height="2" fill="#FFFFFF" />
          <rect x="6" y="5" width="28" height="3" fill="#FFFFFF" />
          <rect x="3" y="8" width="34" height="3" fill="#B5EEFF" />
          <rect x="5" y="11" width="30" height="2" fill="#62B6E8" />
          <rect x="6" y="13" width="28" height="2" fill="#14072E" />
        </svg>
      </div>

      {/* 5. BEVELED 3D PIXEL COUNTDOWN */}
      <div className="relative z-10 flex flex-col items-center space-y-2.5 my-auto nf-hero-rise" style={heroDelay(240)}>
        <div className="font-pixel-clean text-xs sm:text-sm font-bold tracking-widest pixel-label-outline uppercase flex items-center gap-2">
          <span>✦</span>
          <span>KICKOFF COUNTDOWN</span>
          <span>✦</span>
        </div>

        <div className="flex items-start justify-center gap-2 sm:gap-5 text-center">
          {[
            { label: "DAYS", value: timeLeft.days },
            { label: "HOURS", value: timeLeft.hours },
            { label: "MINUTES", value: timeLeft.mins },
            { label: "SECONDS", value: timeLeft.secs },
          ].map((item, idx) => (
            <React.Fragment key={item.label}>
              <div className="flex flex-col items-center">
                <div className="font-pixel-block text-3xl sm:text-5xl md:text-6xl tabular-nums pixel-digit-bevel">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="font-pixel-clean text-[9px] sm:text-xs font-bold tracking-widest pixel-label-outline mt-2">
                  {item.label}
                </div>
              </div>
              {idx < 3 && (
                <span className="font-pixel-block text-xl sm:text-3xl pixel-label-outline pt-1 sm:pt-2">
                  :
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 6. BOTTOM PIXEL DIALOG CARD + BUTTONS (FRAMED BY THE SKYLINE TOWERS!) */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center space-y-3.5 pt-2">
        <div className="w-full flex items-center justify-center gap-3 nf-hero-rise" style={heroDelay(360)}>
          <span className="font-pixel-block text-xs text-[#FFFDF2] drop-shadow-[2px_2px_0px_#120829] hidden sm:inline">
            ◄
          </span>

          <div className="relative flex-1 bg-[#FFFDF2] text-[#1B0E40] border-[3px] border-[#1B0E40] p-1 shadow-[5px_5px_0px_#120829]">
            <div className="relative border-2 border-[#1B0E40]/25 px-4 sm:px-5 py-2.5 text-center">
              <span className="absolute top-1 left-1 w-1.5 h-1.5 bg-[#1B0E40]" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#1B0E40]" />
              <span className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-[#1B0E40]" />
              <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-[#1B0E40]" />

              <p className="font-pixel-clean text-xs sm:text-sm font-bold">
                Three days to{" "}
                <span
                  onMouseEnter={() => setHoveredWord("create")}
                  onMouseLeave={() => setHoveredWord(null)}
                  onClick={() => setHoveredWord(hoveredWord === "create" ? null : "create")}
                  className="relative cursor-pointer text-[#6B2BB5] underline decoration-2 underline-offset-4"
                >
                  {hoveredWord === "create" && (
                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1B0E40] text-[#FFF3B8] border-2 border-[#FFF3B8] px-2.5 py-1 text-[10px] font-pixel-clean shadow-[3px_3px_0px_#000] z-30">
                      30 CURATED EVENTS ACROSS 6 TRACKS
                    </span>
                  )}
                  create.
                </span>{" "}
                One shot to{" "}
                <span
                  onMouseEnter={() => setHoveredWord("win")}
                  onMouseLeave={() => setHoveredWord(null)}
                  onClick={() => setHoveredWord(hoveredWord === "win" ? null : "win")}
                  className="relative cursor-pointer text-[#E63E9B] underline decoration-2 underline-offset-4"
                >
                  {hoveredWord === "win" && (
                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1B0E40] text-[#FFF3B8] border-2 border-[#FFF3B8] px-2.5 py-1 text-[10px] font-pixel-clean shadow-[3px_3px_0px_#000] z-30">
                      TECH, DESIGN &amp; CULTURAL • 72H MARATHON
                    </span>
                  )}
                  win.
                </span>
              </p>
              <p className="font-mono text-[11px] sm:text-xs text-[#38208C] mt-1 font-semibold">
                Compete across <strong>{totalEvents} flagship events</strong> •{" "}
                <strong>₹1,50,000+ Prize Pool</strong> • Campus &amp; Online
              </p>
            </div>
          </div>

          <span className="font-pixel-block text-xs text-[#FFFDF2] drop-shadow-[2px_2px_0px_#120829] hidden sm:inline">
            ►
          </span>
        </div>

        {/* High-Contrast Pixel CTA Buttons */}
        <div className="w-full sm:w-auto grid grid-cols-2 sm:flex items-center justify-center gap-3 nf-hero-rise" style={heroDelay(460)}>
          <Link
            href="/events"
            className="font-pixel-clean inline-flex items-center justify-center gap-2 min-h-[44px] bg-[#1B0E40] text-[#FFFDF2] border-[3px] border-[#FFFDF2] px-4 sm:px-6 py-3 text-[11px] sm:text-sm font-bold uppercase shadow-[4px_4px_0px_#E63E9B] hover:bg-[#6B2BB5] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#E63E9B] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#090318] transition-[translate,box-shadow,background-color] duration-150"
          >
            <span>Explore {totalEvents} Events</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          </Link>

          <Link
            href="/events?is_featured=true"
            className="font-pixel-clean inline-flex items-center justify-center gap-1.5 min-h-[44px] bg-[#FFFDF2] text-[#1B0E40] border-[3px] border-[#1B0E40] px-4 sm:px-5 py-3 text-[11px] sm:text-sm font-bold uppercase shadow-[4px_4px_0px_#120829] hover:bg-[#FFE699] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#E63E9B] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#090318] transition-[translate,box-shadow,background-color] duration-150"
          >
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#E63E9B] shrink-0" />
            <span>Flagships</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
