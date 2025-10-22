// craft-ds, v0.3.2
// This is a design system for building responsive layouts in React

import React from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to merge class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Base interface for common props
export interface BaseProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

// HTML props interface for dangerouslySetInnerHTML
export interface HTMLProps {
  dangerouslySetInnerHTML?: { __html: string };
}

// Available breakpoints as a const object for better type safety
export const BREAKPOINTS = {
  base: "base",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  "2xl": "2xl",
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// Numeric constraints for better type safety
export const GRID_VALUES = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
} as const;

export const GAP_VALUES = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  8: 8,
  10: 10,
  12: 12,
} as const;

export type GridValue = keyof typeof GRID_VALUES;
export type GapValue = keyof typeof GAP_VALUES;

// Responsive property type with better type inference
export type ResponsiveValue<T> =
  | T
  | {
      [K in Breakpoint]?: T;
    };

// Box-specific props with improved type safety
export interface BoxProps extends BaseProps {
  direction?: ResponsiveValue<"row" | "col">;
  wrap?: ResponsiveValue<"wrap" | "nowrap">;
  gap?: ResponsiveValue<GapValue>;
  cols?: ResponsiveValue<GridValue>;
  rows?: ResponsiveValue<GridValue>;
}

// Style configurations
const styles = {
  typography: {
    base: [
      "font-sans antialiased",
      // Headings (without spacing)
      "[&_h1]:text-4xl [&_h1]:font-medium [&_h1]:tracking-tight",
      "[&_h2]:text-3xl [&_h2]:font-medium [&_h2]:tracking-tight",
      "[&_h3]:text-2xl [&_h3]:font-medium [&_h3]:tracking-tight",
      "[&_h4]:text-xl [&_h4]:font-medium [&_h4]:tracking-tight",
      "[&_h5]:text-lg [&_h5]:font-medium [&_h5]:tracking-tight",
      "[&_h6]:text-base [&_h6]:font-medium [&_h6]:tracking-tight",
      // Text elements
      "[&_p]:text-base [&_p]:leading-7 [&_p]:mb-4",
      "[&_strong]:font-semibold",
      "[&_em]:italic",
      "[&_del]:line-through",
      "[&_small]:text-sm [&_small]:font-medium [&_small]:leading-none",
      "[&_sub]:text-sm [&_sup]:text-sm",
    ],
    headerSpacing: [
      "[&_h1]:mt-8 [&_h1]:mb-4",
      "[&_h2]:mt-8 [&_h2]:mb-4",
      "[&_h3]:mt-6 [&_h3]:mb-3",
      "[&_h4]:mt-6 [&_h4]:mb-3",
      "[&_h5]:mt-4 [&_h5]:mb-2",
      "[&_h6]:mt-4 [&_h6]:mb-2",
    ],
    links: [
      "[&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-primary/50 [&_a]:transition-colors",
      "hover:[&_a]:decoration-primary hover:[&_a]:text-primary",
    ],
    lists: [
      // Unordered lists
      "[&_ul]:pl-0 [&_ul]:list-none [&_ul]:space-y-2",
      "[&_ul_li]:relative [&_ul_li]:pl-6",
      "[&_ul_li]:before:absolute [&_ul_li]:before:left-1 [&_ul_li]:before:top-[0.6875em] [&_ul_li]:before:h-1.5 [&_ul_li]:before:w-1.5 [&_ul_li]:before:rounded-full [&_ul_li]:before:bg-foreground/80",
      // Ordered lists
      "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2",
      "[&_ol_ol]:list-[lower-alpha] [&_ol_ol]:pl-6",
      "[&_ol_ol_ol]:list-[lower-roman] [&_ol_ol_ol]:pl-6",
      // List item styles
      "[&_li]:pl-2",
      "[&_ol>li]:marker:text-foreground/80",
      // Nested lists spacing
      "[&_li_ul]:mt-2 [&_li_ol]:mt-2",
      "[&_li_ul]:mb-0 [&_li_ol]:mb-0",
      // Nested unordered list styles
      "[&_ul_ul_li]:before:bg-foreground/60",
      "[&_ul_ul_ul_li]:before:bg-foreground/40",
      // Task lists
      "[&_li]:has([type=checkbox]):pl-8",
      "[&_li]:has([type=checkbox]):list-none",
      "[&_li_input[type=checkbox]]:absolute [&_li_input[type=checkbox]]:left-0 [&_li_input[type=checkbox]]:top-1 [&_li_input[type=checkbox]]:mt-0.5",
      // Mixed lists
      "[&_ol_ul]:pl-6",
      "[&_ul_ol]:pl-6",
    ],
  },
  layout: {
    spacing: "",
    article: "",
    section: "w-full",
  },
};

// Combine all typography styles
const baseTypographyStyles = "";

const articleTypographyStyles = "";

// Components
export const Layout = ({ children, className }: BaseProps) => (
  <html
    lang="en"
    suppressHydrationWarning
    className={cn("scroll-smooth antialiased focus:scroll-auto", className)}
  >
    {children}
  </html>
);

export const Section = ({ children, className, id }: BaseProps) => (
  <section className={cn(styles.layout.section, className)} id={id}>
    {children}
  </section>
);

export const Article = ({
  children,
  className,
  id,
  dangerouslySetInnerHTML,
}: BaseProps & HTMLProps) => (
  <article
    dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    className={cn(
      articleTypographyStyles,
      styles.layout.spacing,
      styles.layout.article,
      className
    )}
    id={id}
  >
    {children}
  </article>
);

export const Prose = ({
  children,
  className,
  id,
  dangerouslySetInnerHTML,
}: BaseProps & HTMLProps) => (
  <div
    dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    className={cn(baseTypographyStyles, styles.layout.spacing, className)}
    id={id}
  >
    {children}
  </div>
);

// Utility function for responsive classes
const getResponsiveClass = <T extends string | number>(
  value: ResponsiveValue<T> | undefined,
  classMap: Record<T, string>
): string => {
  if (!value) return "";
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([breakpoint, val]) => {
        const prefix = breakpoint === "base" ? "" : `${breakpoint}:`;
        return val ? `${prefix}${classMap[val as T]}` : "";
      })
      .filter(Boolean)
      .join(" ");
  }
  return classMap[value];
};

export const Box = ({
  children,
  className,
  direction = "row",
  wrap = "nowrap",
  gap = 0,
  cols,
  rows,
  id,
}: BoxProps) => {
  const directionClasses = {
    row: "flex-row",
    col: "flex-col",
  };

  const wrapClasses = {
    wrap: "flex-wrap",
    nowrap: "flex-nowrap",
  };

  const gapClasses = {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
    10: "gap-10",
    12: "gap-12",
  };

  const colsClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
    9: "grid-cols-9",
    10: "grid-cols-10",
    11: "grid-cols-11",
    12: "grid-cols-12",
  };

  return (
    <div
      className={cn(
        cols || rows ? "grid" : "flex",
        getResponsiveClass(direction, directionClasses),
        getResponsiveClass(wrap, wrapClasses),
        getResponsiveClass(gap, gapClasses),
        cols && getResponsiveClass(cols, colsClasses),
        rows && getResponsiveClass(rows, colsClasses),
        className
      )}
      id={id}
    >
      {children}
    </div>
  );
};
