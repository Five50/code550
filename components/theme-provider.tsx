"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Force dark mode initialization on mount
  React.useEffect(() => {
    // Ensure dark class is on html element
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      if (!html.classList.contains('dark')) {
        html.classList.add('dark');
      }
    }
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
