"use client";

import { useRef, useEffect } from "react";

/**
 * Lightweight animation hooks that replace GSAP with CSS-based animations.
 * These return refs that can be attached to elements for scroll-triggered fade/slide effects.
 */

export function useGsapFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = "0";
    el.style.transition = `opacity 0.6s ease ${delay}s`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return ref;
}

export function useGsapSlideIn(direction: "up" | "down" | "left" | "right" = "up", delay = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const transforms: Record<string, string> = {
      up: "translateY(24px)",
      down: "translateY(-24px)",
      left: "translateX(24px)",
      right: "translateX(-24px)",
    };

    el.style.opacity = "0";
    el.style.transform = transforms[direction];
    el.style.transition = `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translate(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, direction]);

  return ref;
}
