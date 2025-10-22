/**
 * Filter and sanitize WordPress styles
 * Removes unwanted global styles that conflict with custom styling
 */
export function filterWpStyles(styles: string): string {
  if (!styles) return '';

  // Remove the :root :where(a:where(:not(.wp-element-button))) rule
  // This rule adds underlines and transitions to all links
  const filteredStyles = styles.replace(
    /:root\s+:where\(a:where\(:not\(\.wp-element-button\)\)\)\s*\{[^}]*\}/g,
    ''
  );

  return filteredStyles;
}
