/**
 * Apply WordPress template structure to content
 * Replaces WordPress block comments with actual content
 */
export function applyTemplate(templateContent: string, content: {
  title?: string;
  content?: string;
  featuredImage?: string;
  meta?: string;
}): string {
  let output = templateContent;

  // Remove template part blocks (header/footer)
  output = output.replace(/<!--\s*wp:template-part[\s\S]*?\/-->/gi, '');

  // Replace post-title block with actual title or remove it
  if (content.title) {
    output = output.replace(
      /<!--\s*wp:post-title[\s\S]*?\/-->/gi,
      `<h1>${content.title}</h1>`
    );
  } else {
    output = output.replace(/<!--\s*wp:post-title[\s\S]*?\/-->/gi, '');
  }

  // Replace post-content block with actual content
  if (content.content) {
    output = output.replace(
      /<!--\s*wp:post-content[\s\S]*?\/-->/gi,
      content.content
    );
  } else {
    output = output.replace(/<!--\s*wp:post-content[\s\S]*?\/-->/gi, '');
  }

  // Replace post-featured-image block with actual image or remove it
  if (content.featuredImage) {
    output = output.replace(
      /<!--\s*wp:post-featured-image[\s\S]*?\/-->/gi,
      `<img src="${content.featuredImage}" alt="${content.title || ''}" />`
    );
  } else {
    output = output.replace(/<!--\s*wp:post-featured-image[\s\S]*?\/-->/gi, '');
  }

  // Remove other post blocks that we don't support yet
  output = output.replace(/<!--\s*wp:post-date[\s\S]*?\/-->/gi, '');
  output = output.replace(/<!--\s*wp:post-author[\s\S]*?\/-->/gi, '');
  output = output.replace(/<!--\s*wp:post-terms[\s\S]*?\/-->/gi, '');

  // Remove ALL remaining WordPress block comments
  output = output.replace(/<!--\s*\/?wp:[\s\S]*?-->/gi, '');

  return output;
}

/**
 * Process WordPress content and replace WordPress classes with Tailwind classes
 */
export function processWPContent(html: string): string {
  if (!html) return html;

  // Add view-transition-name to WordPress <main> tags for smooth transitions
  html = html.replace(/<main(\s[^>]*)?>/gi, (match, attributes) => {
    // Check if already has the view-transition-name style
    if (match.includes('view-transition-name')) {
      return match;
    }

    if (attributes && attributes.includes('style=')) {
      // Add to existing style attribute
      return match.replace(/style=["']([^"']*)["']/i, (styleMatch, styleContent) => {
        return `style="${styleContent}; view-transition-name: main"`;
      });
    } else {
      // Add new style attribute
      return `<main${attributes || ''} style="view-transition-name: main">`;
    }
  });

  // Button variants - matching Button component exactly
  const buttonBaseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-6 py-2 cursor-pointer';

  const buttonVariants = {
    default: 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-[length:200%_100%] bg-left hover:bg-right focus-visible:bg-right text-white border border-blue-500',
    outline: 'border border-slate-200 dark:border-blue-500/25 hover:text-slate-800 hover:bg-blue-700 hover:border-blue-500 dark:hover:bg-white',
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
    /class=["']([^"']*\bwp-block-buttons\b[^"']*)["']/gi,
    (_match, classes) => {
      let tailwindClasses = 'flex flex-wrap gap-3 my-6';

      // Handle justification classes
      if (classes.includes('is-content-justification-center')) {
        tailwindClasses += ' justify-center';
      } else if (classes.includes('is-content-justification-right')) {
        tailwindClasses += ' justify-end';
      } else if (classes.includes('is-content-justification-left')) {
        tailwindClasses += ' justify-start';
      } else if (classes.includes('is-content-justification-space-between')) {
        tailwindClasses += ' justify-between';
      }

      return `class="${tailwindClasses}"`;
    }
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

  // Replace WordPress columns container classes
  processedHtml = processedHtml.replace(
    /class=["']([^"']*\bwp-block-columns\b[^"']*)["']/gi,
    (_match, classes) => {
      let tailwindClasses = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

      // Handle alignwide for wider layouts
      if (classes.includes('alignwide')) {
        tailwindClasses += ' max-w-7xl mx-auto';
      }

      return `class="${tailwindClasses}"`;
    }
  );

  // Replace WordPress column classes (individual columns)
  processedHtml = processedHtml.replace(
    /class=["']([^"']*\bwp-block-column\b(?!s)[^"']*)["']/gi,
    'class="flex flex-col"'
  );

  // Replace WordPress cover block classes
  // Cover block container (handle alignfull for full viewport width)
  // Only match the main wp-block-cover class, not __inner-container or other variants
  processedHtml = processedHtml.replace(
    /class=["']([^"']*\bwp-block-cover(?!__)[^"']*)["']/gi,
    (match) => {
      // Skip if this is an inner-container or other sub-element
      if (match.includes('wp-block-cover__')) {
        return match;
      }
      if (match.includes('alignfull')) {
        return 'class="relative w-screen max-w-full min-h-[430px] flex items-center justify-center overflow-hidden"';
      }
      return 'class="relative w-full min-h-[430px] flex items-center justify-center overflow-hidden"';
    }
  );

  // Cover video background
  processedHtml = processedHtml.replace(
    /class=["']([^"']*\bwp-block-cover__video-background\b[^"']*)["']/gi,
    'class="absolute inset-0 w-full h-full object-cover"'
  );

  // Cover background overlay
  processedHtml = processedHtml.replace(
    /class=["']([^"']*\bwp-block-cover__background\b[^"']*)["']/gi,
    (match) => {
      // Check for dim levels
      if (match.includes('has-background-dim-0')) {
        return 'class="absolute inset-0 bg-black/0"';
      } else if (match.includes('has-background-dim-10')) {
        return 'class="absolute inset-0 bg-black/10"';
      } else if (match.includes('has-background-dim-20')) {
        return 'class="absolute inset-0 bg-black/20"';
      } else if (match.includes('has-background-dim-30')) {
        return 'class="absolute inset-0 bg-black/30"';
      } else if (match.includes('has-background-dim-40')) {
        return 'class="absolute inset-0 bg-black/40"';
      } else if (match.includes('has-background-dim-50')) {
        return 'class="absolute inset-0 bg-black/50"';
      } else if (match.includes('has-background-dim-60')) {
        return 'class="absolute inset-0 bg-black/60"';
      } else if (match.includes('has-background-dim-70')) {
        return 'class="absolute inset-0 bg-black/70"';
      } else if (match.includes('has-background-dim-80')) {
        return 'class="absolute inset-0 bg-black/80"';
      } else if (match.includes('has-background-dim-90')) {
        return 'class="absolute inset-0 bg-black/90"';
      } else if (match.includes('has-background-dim-100')) {
        return 'class="absolute inset-0 bg-black"';
      }
      // Default 50% dim
      return 'class="absolute inset-0 bg-black/50"';
    }
  );

  // Cover inner container
  processedHtml = processedHtml.replace(
    /class=["']([^"']*\bwp-block-cover__inner-container\b[^"']*)["']/gi,
    'class="relative z-10 w-full text-white"'
  );

  // Remove inline background-color styles from cover block overlays
  processedHtml = processedHtml.replace(
    /(<span[^>]*class="[^"]*wp-block-cover__background[^"]*"[^>]*)\s+style="[^"]*background-color:[^"]*"([^>]*>)/gi,
    '$1$2'
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

  // Replace WordPress block group classes with Tailwind
  // wp-block-group with has-global-padding and is-layout-constrained
  processedHtml = processedHtml.replace(
    /class=["']([^"']*\bwp-block-group\b[^"']*)["']/gi,
    (match, classes) => {
      // Base classes for block groups
      let tailwindClasses = [];

      // Check for specific WordPress classes and map to Tailwind
      if (classes.includes('has-global-padding')) {
        tailwindClasses.push('px-6');
      }

      // Add alignwide support for wider content (1280px)
      if (classes.includes('alignwide')) {
        tailwindClasses.push('max-w-[1280px] mx-auto');
      }
      // Add alignfull support for full-width sections
      else if (classes.includes('alignfull')) {
        tailwindClasses.push('w-screen max-w-full');
      }
      // Default constrained layout (900px)
      else if (classes.includes('is-layout-constrained')) {
        tailwindClasses.push('max-w-[900px] mx-auto');
      }

      return tailwindClasses.length > 0 ? `class="${tailwindClasses.join(' ')}"` : '';
    }
  );

  // Replace entry-content and wp-block-post-content classes
  processedHtml = processedHtml.replace(
    /class=["']([^"']*\b(?:entry-content|wp-block-post-content)\b[^"']*)["']/gi,
    (match, classes) => {
      let tailwindClasses = [];

      if (classes.includes('has-global-padding')) {
        tailwindClasses.push('px-6');
      }

      // Add alignwide support for wider content (1280px)
      if (classes.includes('alignwide')) {
        tailwindClasses.push('max-w-[1280px] mx-auto');
      }
      // Add alignfull support for full-width sections
      else if (classes.includes('alignfull')) {
        tailwindClasses.push('w-screen max-w-full');
      }
      // Default constrained layout (900px)
      else if (classes.includes('is-layout-constrained')) {
        tailwindClasses.push('max-w-[900px] mx-auto');
      }

      // Add content-specific classes
      if (classes.includes('entry-content') || classes.includes('wp-block-post-content')) {
        tailwindClasses.push('w-full');
      }

      return tailwindClasses.length > 0 ? `class="${tailwindClasses.join(' ')}"` : '';
    }
  );

  // Handle WordPress text alignment classes
  processedHtml = processedHtml.replace(
    /class=["']([^"']*)has-text-align-center([^"']*)["']/gi,
    (match, before, after) => {
      return `class="${before}text-center${after}"`;
    }
  );

  processedHtml = processedHtml.replace(
    /class=["']([^"']*)has-text-align-left([^"']*)["']/gi,
    (match, before, after) => {
      return `class="${before}text-left${after}"`;
    }
  );

  processedHtml = processedHtml.replace(
    /class=["']([^"']*)has-text-align-right([^"']*)["']/gi,
    (match, before, after) => {
      return `class="${before}text-right${after}"`;
    }
  );

  // Handle WordPress font size classes
  processedHtml = processedHtml.replace(
    /class=["']([^"']*)has-large-font-size([^"']*)["']/gi,
    (match, before, after) => {
      return `class="${before}text-2xl${after}"`;
    }
  );

  processedHtml = processedHtml.replace(
    /class=["']([^"']*)has-medium-font-size([^"']*)["']/gi,
    (match, before, after) => {
      return `class="${before}text-xl${after}"`;
    }
  );

  processedHtml = processedHtml.replace(
    /class=["']([^"']*)has-small-font-size([^"']*)["']/gi,
    (match, before, after) => {
      return `class="${before}text-sm${after}"`;
    }
  );

  // Convert WordPress spacing variables to Tailwind classes in inline styles
  // Handle style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--16);..."
  processedHtml = processedHtml.replace(
    /style=["']([^"']*)["']/gi,
    (match, styleContent) => {
      let tailwindClasses: string[] = [];

      // Parse WordPress spacing variables
      const spacingMap: { [key: string]: string } = {
        '--wp--preset--spacing--4': '4',   // 1rem
        '--wp--preset--spacing--6': '6',   // 1.5rem
        '--wp--preset--spacing--8': '8',   // 2rem
        '--wp--preset--spacing--10': '10', // 2.5rem
        '--wp--preset--spacing--12': '12', // 3rem
        '--wp--preset--spacing--16': '16', // 4rem
        '--wp--preset--spacing--20': '20', // 5rem
        '--wp--preset--spacing--24': '24', // 6rem
      };

      // Track which style properties we've converted
      let convertedStyles: string[] = [];

      // Convert padding from WordPress spacing variables
      Object.entries(spacingMap).forEach(([wpVar, twValue]) => {
        if (styleContent.includes(`padding-top:var(${wpVar})`)) {
          tailwindClasses.push(`pt-${twValue}`);
          convertedStyles.push('padding-top');
        }
        if (styleContent.includes(`padding-bottom:var(${wpVar})`)) {
          tailwindClasses.push(`pb-${twValue}`);
          convertedStyles.push('padding-bottom');
        }
        if (styleContent.includes(`padding-left:var(${wpVar})`)) {
          tailwindClasses.push(`pl-${twValue}`);
          convertedStyles.push('padding-left');
        }
        if (styleContent.includes(`padding-right:var(${wpVar})`)) {
          tailwindClasses.push(`pr-${twValue}`);
          convertedStyles.push('padding-right');
        }
      });

      // Convert direct CSS padding values to Tailwind arbitrary values if not already converted
      if (!convertedStyles.includes('padding-top')) {
        const paddingTopMatch = styleContent.match(/padding-top:\s*([^;]+)/i);
        if (paddingTopMatch && !paddingTopMatch[1].includes('var(')) {
          const value = paddingTopMatch[1].trim();
          tailwindClasses.push(`pt-[${value}]`);
          convertedStyles.push('padding-top');
        }
      }

      if (!convertedStyles.includes('padding-bottom')) {
        const paddingBottomMatch = styleContent.match(/padding-bottom:\s*([^;]+)/i);
        if (paddingBottomMatch && !paddingBottomMatch[1].includes('var(')) {
          const value = paddingBottomMatch[1].trim();
          tailwindClasses.push(`pb-[${value}]`);
          convertedStyles.push('padding-bottom');
        }
      }

      if (!convertedStyles.includes('padding-left')) {
        const paddingLeftMatch = styleContent.match(/padding-left:\s*([^;]+)/i);
        if (paddingLeftMatch && !paddingLeftMatch[1].includes('var(')) {
          const value = paddingLeftMatch[1].trim();
          tailwindClasses.push(`pl-[${value}]`);
          convertedStyles.push('padding-left');
        }
      }

      if (!convertedStyles.includes('padding-right')) {
        const paddingRightMatch = styleContent.match(/padding-right:\s*([^;]+)/i);
        if (paddingRightMatch && !paddingRightMatch[1].includes('var(')) {
          const value = paddingRightMatch[1].trim();
          tailwindClasses.push(`pr-[${value}]`);
          convertedStyles.push('padding-right');
        }
      }

      // Convert margin
      if (styleContent.includes('margin-top:0') && styleContent.includes('margin-bottom:0')) {
        tailwindClasses.push('my-0');
        convertedStyles.push('margin-top', 'margin-bottom');
      }

      // Convert border styles
      // Detect border-style:solid and border-width:1px
      if (styleContent.includes('border-style:solid') &&
          (styleContent.includes('border-width:1px') || styleContent.includes('border-width: 1px'))) {
        tailwindClasses.push('border', 'border-slate-200', 'dark:border-slate-800');
        convertedStyles.push('border-style', 'border-width');
      }

      // Convert border-radius
      if (styleContent.includes('border-radius:0.5em') || styleContent.includes('border-radius: 0.5em')) {
        tailwindClasses.push('rounded-lg');
        convertedStyles.push('border-radius');
      } else if (styleContent.includes('border-radius:1em') || styleContent.includes('border-radius: 1em')) {
        tailwindClasses.push('rounded-xl');
        convertedStyles.push('border-radius');
      } else if (styleContent.includes('border-radius:0.25em') || styleContent.includes('border-radius: 0.25em')) {
        tailwindClasses.push('rounded-md');
        convertedStyles.push('border-radius');
      }

      // Convert blockGap to gap- classes
      Object.entries(spacingMap).forEach(([wpVar, twValue]) => {
        // Match both blockGap and block-gap in CSS format
        if (styleContent.includes(`blockGap:var(${wpVar})`) || styleContent.includes(`block-gap:var(${wpVar})`)) {
          tailwindClasses.push(`gap-${twValue}`);
          convertedStyles.push('blockGap', 'block-gap');
        }
      });

      // Also handle WordPress JSON format: "blockGap":"var:preset|spacing|10"
      const blockGapMatch = styleContent.match(/var:preset\|spacing\|(\d+)/);
      if (blockGapMatch) {
        const gapValue = blockGapMatch[1];
        // Map common spacing values
        const gapMap: { [key: string]: string } = {
          '4': '4',
          '6': '6',
          '8': '8',
          '10': '10',
          '12': '12',
          '16': '16',
          '20': '20',
          '24': '24',
        };
        if (gapMap[gapValue]) {
          tailwindClasses.push(`gap-${gapMap[gapValue]}`);
          convertedStyles.push('blockGap');
        }
      }

      // Build remaining style string with unconverted properties
      let remainingStyles: string[] = [];

      // Split styleContent into individual style declarations
      const styleDeclarations = styleContent.split(';').filter((s: string) => s.trim());

      for (const declaration of styleDeclarations) {
        const [property] = declaration.split(':').map((s: string) => s.trim());

        // Check if this property was NOT converted
        const isConverted = convertedStyles.some(convertedProp =>
          property.includes(convertedProp) || convertedProp.includes(property)
        );

        if (!isConverted && property && declaration.includes(':')) {
          remainingStyles.push(declaration.trim());
        }
      }

      // Build the return string
      if (tailwindClasses.length > 0 || remainingStyles.length > 0) {
        let result = '';

        if (tailwindClasses.length > 0) {
          result += `class="${tailwindClasses.join(' ')}"`;
        }

        if (remainingStyles.length > 0) {
          const styleAttr = remainingStyles.join('; ');
          result += (result ? ' ' : '') + `style="${styleAttr}"`;
        }

        return result || match;
      }

      return match;
    }
  );

  // Clean up any duplicate class attributes that may have been created
  processedHtml = processedHtml.replace(
    /class=["']([^"']*)["']\s+class=["']([^"']*)["']/gi,
    (_match, class1, class2) => {
      // Merge the two class attributes
      const combinedClasses = `${class1} ${class2}`.split(' ').filter((c, i, arr) => arr.indexOf(c) === i).join(' ');
      return `class="${combinedClasses}"`;
    }
  );

  // Remove WordPress-specific layout container classes that we don't need
  processedHtml = processedHtml.replace(
    /\b(?:wp-container-[a-z-]+-is-layout-[a-z0-9]+|wp-block-[a-z-]+-is-layout-[a-z-]+|is-light)\b\s*/gi,
    ''
  );

  // Clean up empty class attributes
  processedHtml = processedHtml.replace(/class=["']\s*["']/gi, '');

  // Clean up extra whitespace in class attributes
  processedHtml = processedHtml.replace(/class=["']([^"']+)["']/gi, (_match, classes) => {
    const cleanedClasses = classes.trim().replace(/\s+/g, ' ');
    return cleanedClasses ? `class="${cleanedClasses}"` : '';
  });

  return processedHtml;
}
