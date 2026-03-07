"use client";

import { useRef, useState, MouseEvent, ReactNode } from "react";

interface MouseCardProps {
  children: ReactNode;
  className?: string;
}

export function MouseCard({ children, className = "" }: MouseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Mouse follower glow effect */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.15), transparent 40%)`,
          }}
        />
      )}

      {/* Border glow effect */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.4), transparent 40%)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            padding: '1px',
          }}
        />
      )}

      {children}
    </div>
  );
}
