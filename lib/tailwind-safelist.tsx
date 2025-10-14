/**
 * Tailwind Safelist
 *
 * This file exists to ensure Tailwind CSS generates utility classes
 * that are added dynamically by processWPContent() at runtime.
 *
 * These classes are referenced here so Tailwind's content scanner
 * can detect them and include them in the output CSS.
 *
 * DO NOT DELETE THIS FILE - it's required for WordPress content styling.
 */

export const SAFELIST_CLASSES = [
  // Padding top
  'pt-4', 'pt-6', 'pt-8', 'pt-10', 'pt-12', 'pt-16', 'pt-20', 'pt-24',
  // Padding right
  'pr-4', 'pr-6', 'pr-8', 'pr-10', 'pr-12', 'pr-16', 'pr-20', 'pr-24',
  // Padding bottom
  'pb-4', 'pb-6', 'pb-8', 'pb-10', 'pb-12', 'pb-16', 'pb-20', 'pb-24',
  // Padding left
  'pl-4', 'pl-6', 'pl-8', 'pl-10', 'pl-12', 'pl-16', 'pl-20', 'pl-24',
  // Flexbox layout
  'flex', 'flex-col', 'flex-row',
  // Gap
  'gap-4', 'gap-6', 'gap-8', 'gap-10', 'gap-12', 'gap-16', 'gap-20', 'gap-24',
  // Margin
  'my-0',
  // Border
  'border', 'border-slate-200', 'dark:border-slate-800',
  // Border radius
  'rounded-md', 'rounded-lg', 'rounded-xl',
  // Text sizes (WordPress font size classes)
  'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl',
  'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl',
  'text-7xl', 'text-8xl', 'text-9xl',
  // Text alignment (WordPress alignment classes)
  'text-left', 'text-center', 'text-right', 'text-justify',
  // Constrained width for wp-block-group children (direct child variants)
  '*:max-w-3xl', '*:max-w-7xl',
  // Important max-width for alignwide override
  '!max-w-7xl',
];

/**
 * Safelist component - Never rendered, only used for Tailwind scanning
 */
export function SafelistComponent() {
  return (
    <div className="hidden">
      {/* Padding top */}
      <div className="pt-4 pt-6 pt-8 pt-10 pt-12 pt-16 pt-20 pt-24" />
      {/* Padding right */}
      <div className="pr-4 pr-6 pr-8 pr-10 pr-12 pr-16 pr-20 pr-24" />
      {/* Padding bottom */}
      <div className="pb-4 pb-6 pb-8 pb-10 pb-12 pb-16 pb-20 pb-24" />
      {/* Padding left */}
      <div className="pl-4 pl-6 pl-8 pl-10 pl-12 pl-16 pl-20 pl-24" />
      {/* Flexbox layout */}
      <div className="flex flex-col flex-row" />
      {/* Gap */}
      <div className="gap-4 gap-6 gap-8 gap-10 gap-12 gap-16 gap-20 gap-24" />
      {/* Margin */}
      <div className="my-0" />
      {/* Border */}
      <div className="border border-slate-200 dark:border-slate-800" />
      {/* Border radius */}
      <div className="rounded-md rounded-lg rounded-xl" />
      {/* Text sizes */}
      <div className="text-xs text-sm text-base text-lg text-xl text-2xl text-3xl text-4xl text-5xl text-6xl text-7xl text-8xl text-9xl" />
      {/* Text alignment */}
      <div className="text-left text-center text-right text-justify" />
      {/* Constrained width for wp-block-group children */}
      <div className="*:max-w-3xl *:max-w-7xl" />
      {/* Important max-width for alignwide override */}
      <div className="!max-w-7xl" />
    </div>
  );
}
