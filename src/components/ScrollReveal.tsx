"use client";

import React, { useEffect, useRef, useState } from "react";

export type RevealVariant = "pop-up" | "slide-left" | "slide-right" | "scale-pop";

/**
 * Fires once when the element scrolls into view (threshold 0.12).
 * Reveals immediately when IntersectionObserver is unavailable or the user
 * prefers reduced motion, so content is never stranded invisible.
 */
export function useInView<T extends Element>(
  options: IntersectionObserverInit = { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      const timer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, isVisible };
}

/**
 * Hidden-state transforms. Only "scale-pop" scales — the other variants are
 * translate-only so measured sizes (e.g. 44px touch targets) are never shrunk.
 */
export const REVEAL_HIDDEN: Record<RevealVariant, string> = {
  "pop-up": "opacity-0 translate-y-7",
  "slide-left": "opacity-0 -translate-x-8",
  "slide-right": "opacity-0 translate-x-8",
  "scale-pop": "opacity-0 scale-90",
};

export const REVEAL_SHOWN = "opacity-100 translate-x-0 translate-y-0 scale-100";

export const REVEAL_TRANSITION =
  "transition-[opacity,translate,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delayMs?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  variant = "pop-up",
  delayMs = 0,
  className = "",
}: ScrollRevealProps) {
  const { ref, isVisible } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: isVisible ? `${delayMs}ms` : "0ms" }}
      className={`${REVEAL_TRANSITION} ${
        isVisible ? REVEAL_SHOWN : `${REVEAL_HIDDEN[variant]} will-change-transform`
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default ScrollReveal;
