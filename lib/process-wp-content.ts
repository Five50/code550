/**
 * Process WordPress content and replace WordPress classes with Tailwind classes
 */
export function processWPContent(html: string): string {
  if (!html) return html;

  // Button variants - matching Button component exactly
  const buttonBaseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-6 py-2 cursor-pointer';

  const buttonVariants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-500',
    outline: 'border border-slate-200 bg-white hover:bg-blue-50 hover:text-blue-700',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    ghost: 'hover:bg-blue-50 hover:text-blue-700',
  };

  // Heading classes
  const headingClasses = {
    h1: 'font-heading font-bold text-4xl leading-tight text-slate-900 dark:text-slate-50',
    h2: 'font-heading font-semibold text-3xl leading-snug text-slate-900 dark:text-slate-50',
    h3: 'font-heading font-semibold text-2xl leading-normal text-slate-900 dark:text-slate-50',
    h4: 'font-heading font-medium text-xl leading-normal text-slate-900 dark:text-slate-50',
    h5: 'font-heading font-medium text-lg leading-normal text-slate-900 dark:text-slate-50',
    h6: 'font-heading font-medium text-base leading-normal text-slate-900 dark:text-slate-50',
  };

  let processedHtml = html;

  // Replace button container classes first
  processedHtml = processedHtml.replace(
    /class=["']wp-block-buttons[^"']*["']/gi,
    'class="flex flex-wrap gap-3 my-6"'
  );

  // Process buttons with outline style (handles is-style-outline with any additional classes like is-style-outline--2)
  processedHtml = processedHtml.replace(
    /<div\s+class=["']([^"']*\bwp-block-button\b[^"']*\bis-style-outline\b[^"']*)["']>\s*<a\s+class=["']wp-block-button__link\s+wp-element-button["']/gi,
    `<div class="inline-flex"><a class="${buttonBaseClasses} ${buttonVariants.outline}"`
  );

  // Process buttons with secondary style
  processedHtml = processedHtml.replace(
    /<div\s+class=["']([^"']*\bwp-block-button\b[^"']*\bis-style-secondary\b[^"']*)["']>\s*<a\s+class=["']wp-block-button__link\s+wp-element-button["']/gi,
    `<div class="inline-flex"><a class="${buttonBaseClasses} ${buttonVariants.secondary}"`
  );

  // Process buttons with ghost style
  processedHtml = processedHtml.replace(
    /<div\s+class=["']([^"']*\bwp-block-button\b[^"']*\bis-style-ghost\b[^"']*)["']>\s*<a\s+class=["']wp-block-button__link\s+wp-element-button["']/gi,
    `<div class="inline-flex"><a class="${buttonBaseClasses} ${buttonVariants.ghost}"`
  );

  // Process default buttons (no style class) - must be last
  processedHtml = processedHtml.replace(
    /<div\s+class=["']wp-block-button(?!\s+is-style-)["']>\s*<a\s+class=["']wp-block-button__link\s+wp-element-button["']/gi,
    `<div class="inline-flex"><a class="${buttonBaseClasses} ${buttonVariants.default}"`
  );

  // Add aria-label to button links based on their text content
  // Match button links and extract their text content
  processedHtml = processedHtml.replace(
    /<a\s+class="([^"]*cursor-pointer[^"]*)"([^>]*)>([^<]+)<\/a>/gi,
    (match, classAttr, otherAttrs, buttonText) => {
      // Only add aria-label if it doesn't already exist
      if (!otherAttrs.includes('aria-label')) {
        // Strip extra whitespace from button text
        const cleanText = buttonText.trim();
        return `<a class="${classAttr}"${otherAttrs} aria-label="${cleanText}">${buttonText}</a>`;
      }
      return match;
    }
  );

  // Replace heading classes
  processedHtml = processedHtml.replace(
    /<h1\s+class=["']wp-block-heading["']/gi,
    `<h1 class="${headingClasses.h1}"`
  );
  processedHtml = processedHtml.replace(
    /<h2\s+class=["']wp-block-heading["']/gi,
    `<h2 class="${headingClasses.h2}"`
  );
  processedHtml = processedHtml.replace(
    /<h3\s+class=["']wp-block-heading["']/gi,
    `<h3 class="${headingClasses.h3}"`
  );
  processedHtml = processedHtml.replace(
    /<h4\s+class=["']wp-block-heading["']/gi,
    `<h4 class="${headingClasses.h4}"`
  );
  processedHtml = processedHtml.replace(
    /<h5\s+class=["']wp-block-heading["']/gi,
    `<h5 class="${headingClasses.h5}"`
  );
  processedHtml = processedHtml.replace(
    /<h6\s+class=["']wp-block-heading["']/gi,
    `<h6 class="${headingClasses.h6}"`
  );

  return processedHtml;
}
