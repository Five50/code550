"use client";

import * as React from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Force dark mode on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      if (!html.classList.contains('dark')) {
        html.classList.add('dark');
      }
    }
  }, []);

  return <>{children}</>;
}
