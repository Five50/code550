"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

interface StatCounterProps {
  end: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

export function StatCounter({ end, label, suffix = "", prefix = "" }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [end, isInView]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl mb-2 bg-gradient-to-br from-primary via-primary to-accent-soft bg-clip-text text-transparent">
        {prefix}{count}{suffix}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground font-mono uppercase tracking-wider">{label}</div>
    </div>
  );
}
