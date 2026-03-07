"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";

interface BentoItemProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
}

export function BentoItem({ children, className = "", gradient = false }: BentoItemProps) {
  return (
    <motion.div
      className={`relative rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 overflow-hidden group ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {gradient && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-soft/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -inset-px bg-gradient-to-br from-primary/20 via-transparent to-accent-soft/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = "" }: BentoGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto ${className}`}>
      {children}
    </div>
  );
}
