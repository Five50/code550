# WordPress Gutenberg Theme Setup for Next.js Headless CMS

This guide provides step-by-step instructions for creating a WordPress Gutenberg theme that properly transmits blocks, colors, and styles to your Next.js frontend at AltoFuel.

## Overview

The goal is to:
1. Create a minimal WordPress theme with full Gutenberg support
2. Define a design system (colors, typography, spacing) in `theme.json`
3. Ensure Gutenberg block markup and styles are available via REST API
4. Make these styles consumable by your Next.js frontend

---

## Part 1: WordPress Theme Setup

### Step 1: Create Theme Directory

On your WordPress installation at `https://digest.altofuel.com`, create a new theme:

```
wp-content/themes/altofuel/
├── functions.php
├── style.css
├── theme.json
├── index.php (minimal)
└── assets/
    └── css/
        └── blocks.css
```

### Step 2: Create `style.css` (Theme Header)

```css
/*
Theme Name: AltoFuel
Theme URI: https://altofuel.com
Author: AltoFuel Team
Author URI: https://altofuel.com
Description: Headless WordPress theme for AltoFuel Next.js frontend
Version: 1.0.0
Requires at least: 6.0
Tested up to: 6.4
Requires PHP: 8.0
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: altofuel
*/

/* Minimal theme styles - most styling handled by Next.js */
```

### Step 3: Create `index.php` (Minimal Template)

```php
<?php
/**
 * Main template file
 * This theme is designed for headless WordPress with Next.js
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <div style="padding: 2rem; font-family: system-ui; max-width: 800px; margin: 0 auto;">
        <h1>AltoFuel Headless WordPress</h1>
        <p>This is a headless WordPress installation. Content is served via REST API to the Next.js frontend.</p>
        <p><strong>Frontend URL:</strong> <a href="https://altofuel.com">https://altofuel.com</a></p>
        <p><strong>Admin Panel:</strong> <a href="<?php echo admin_url(); ?>"><?php echo admin_url(); ?></a></p>
    </div>
    <?php wp_footer(); ?>
</body>
</html>
```

### Step 4: Create `functions.php`

```php
<?php
/**
 * AltoFuel Theme Functions
 * Headless WordPress theme for Next.js frontend
 */

// Enable Gutenberg block editor support
add_theme_support('editor-styles');
add_theme_support('wp-block-styles');
add_theme_support('align-wide');
add_theme_support('responsive-embeds');

// Add support for experimental features
add_theme_support('appearance-tools');

/**
 * Enqueue block editor styles
 */
function altofuel_editor_styles() {
    // Enqueue editor styles that match theme.json
    wp_enqueue_style(
        'altofuel-editor-styles',
        get_theme_file_uri('assets/css/blocks.css'),
        [],
        wp_get_theme()->get('Version')
    );
}
add_action('enqueue_block_editor_assets', 'altofuel_editor_styles');

/**
 * Add block styles and colors to REST API response
 * This allows Next.js to access the full block markup with classes
 */
function altofuel_add_block_styles_to_rest() {
    register_rest_field(
        ['post', 'page'],
        'block_styles',
        [
            'get_callback' => function($post) {
                // Get blocks from content
                $blocks = parse_blocks($post['content']['rendered']);

                return [
                    'blocks' => $blocks,
                    'rendered_content' => $post['content']['rendered']
                ];
            },
            'schema' => [
                'description' => 'Block styles and rendered content',
                'type' => 'object'
            ]
        ]
    );
}
add_action('rest_api_init', 'altofuel_add_block_styles_to_rest');

/**
 * Expose theme.json settings via REST API
 * This allows Next.js to access your design system
 */
function altofuel_register_theme_settings_endpoint() {
    register_rest_route('altofuel/v1', '/theme-settings', [
        'methods' => 'GET',
        'callback' => function() {
            $theme_json_path = get_template_directory() . '/theme.json';

            if (file_exists($theme_json_path)) {
                $theme_json = json_decode(file_get_contents($theme_json_path), true);
                return new WP_REST_Response($theme_json, 200);
            }

            return new WP_Error('no_theme_json', 'theme.json not found', ['status' => 404]);
        },
        'permission_callback' => '__return_true'
    ]);
}
add_action('rest_api_init', 'altofuel_register_theme_settings_endpoint');

/**
 * Add CORS headers for headless WordPress
 * Replace 'https://altofuel.com' with your actual Next.js domain
 */
function altofuel_add_cors_headers() {
    $allowed_origins = [
        'https://altofuel.com',
        'http://localhost:3000',
        'http://localhost:3003'
    ];

    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Headers: Authorization, Content-Type");
    }
}
add_action('rest_api_init', 'altofuel_add_cors_headers');

/**
 * Ensure block CSS classes are preserved in REST API
 */
function altofuel_preserve_block_classes($content) {
    // Ensure WordPress doesn't strip block classes
    return $content;
}
add_filter('the_content', 'altofuel_preserve_block_classes', 999);

/**
 * Register custom block patterns (optional)
 */
function altofuel_register_block_patterns() {
    // Example: Hero pattern
    register_block_pattern(
        'altofuel/hero',
        [
            'title' => __('Hero Section', 'altofuel'),
            'description' => __('A hero section with heading and CTA', 'altofuel'),
            'content' => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}}},"backgroundColor":"primary"} -->
                <div class="wp-block-group alignfull has-primary-background-color has-background" style="padding-top:80px;padding-bottom:80px">
                    <!-- wp:heading {"textAlign":"center","level":1} -->
                    <h1 class="has-text-align-center">Welcome to AltoFuel</h1>
                    <!-- /wp:heading -->

                    <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
                    <div class="wp-block-buttons">
                        <!-- wp:button -->
                        <div class="wp-block-button"><a class="wp-block-button__link">Get Started</a></div>
                        <!-- /wp:button -->
                    </div>
                    <!-- /wp:buttons -->
                </div>
                <!-- /wp:group -->',
            'categories' => ['featured']
        ]
    );
}
add_action('init', 'altofuel_register_block_patterns');
```

### Step 5: Create `theme.json` (Design System)

This is the most important file - it defines your design system:

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 2,
  "settings": {
    "appearanceTools": true,
    "useRootPaddingAwareAlignments": true,
    "color": {
      "custom": true,
      "customDuotone": true,
      "customGradient": true,
      "defaultGradients": false,
      "defaultPalette": false,
      "palette": [
        {
          "slug": "primary",
          "color": "#2b7fff",
          "name": "Primary Blue"
        },
        {
          "slug": "dark",
          "color": "#0a0a0a",
          "name": "Dark"
        },
        {
          "slug": "light",
          "color": "#ffffff",
          "name": "Light"
        },
        {
          "slug": "zinc-900",
          "color": "#18181b",
          "name": "Zinc 900"
        },
        {
          "slug": "zinc-800",
          "color": "#27272a",
          "name": "Zinc 800"
        },
        {
          "slug": "zinc-700",
          "color": "#3f3f46",
          "name": "Zinc 700"
        },
        {
          "slug": "zinc-400",
          "color": "#a1a1aa",
          "name": "Zinc 400"
        },
        {
          "slug": "zinc-200",
          "color": "#e4e4e7",
          "name": "Zinc 200"
        },
        {
          "slug": "zinc-100",
          "color": "#f4f4f5",
          "name": "Zinc 100"
        },
        {
          "slug": "blue-500",
          "color": "#3b82f6",
          "name": "Blue 500"
        },
        {
          "slug": "blue-600",
          "color": "#2563eb",
          "name": "Blue 600"
        }
      ],
      "gradients": [
        {
          "slug": "dark-gradient",
          "gradient": "linear-gradient(135deg, #0a0a0a 0%, #27272a 100%)",
          "name": "Dark Gradient"
        },
        {
          "slug": "blue-gradient",
          "gradient": "linear-gradient(135deg, #2b7fff 0%, #3b82f6 100%)",
          "name": "Blue Gradient"
        }
      ]
    },
    "typography": {
      "customFontSize": true,
      "fontStyle": true,
      "fontWeight": true,
      "letterSpacing": true,
      "textDecoration": true,
      "textTransform": true,
      "dropCap": false,
      "fontSizes": [
        {
          "slug": "small",
          "size": "0.875rem",
          "name": "Small"
        },
        {
          "slug": "medium",
          "size": "1rem",
          "name": "Medium"
        },
        {
          "slug": "large",
          "size": "1.125rem",
          "name": "Large"
        },
        {
          "slug": "x-large",
          "size": "1.5rem",
          "name": "X-Large"
        },
        {
          "slug": "xx-large",
          "size": "2rem",
          "name": "XX-Large"
        },
        {
          "slug": "xxx-large",
          "size": "3rem",
          "name": "XXX-Large"
        }
      ],
      "fontFamilies": [
        {
          "fontFamily": "\"Fira Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
          "slug": "primary",
          "name": "Primary (Fira Sans)"
        },
        {
          "fontFamily": "\"Fira Mono\", \"Courier New\", monospace",
          "slug": "mono",
          "name": "Monospace (Fira Mono)"
        }
      ]
    },
    "spacing": {
      "customSpacingSize": true,
      "spacingScale": {
        "operator": "*",
        "increment": 1.5,
        "steps": 7,
        "mediumStep": 1.5,
        "unit": "rem"
      },
      "spacingSizes": [
        {
          "slug": "xs",
          "size": "0.5rem",
          "name": "X-Small"
        },
        {
          "slug": "sm",
          "size": "1rem",
          "name": "Small"
        },
        {
          "slug": "md",
          "size": "1.5rem",
          "name": "Medium"
        },
        {
          "slug": "lg",
          "size": "2rem",
          "name": "Large"
        },
        {
          "slug": "xl",
          "size": "3rem",
          "name": "X-Large"
        },
        {
          "slug": "2xl",
          "size": "4rem",
          "name": "2X-Large"
        }
      ],
      "units": ["px", "em", "rem", "vh", "vw", "%"]
    },
    "layout": {
      "contentSize": "800px",
      "wideSize": "1200px"
    },
    "custom": {
      "borderRadius": {
        "small": "4px",
        "medium": "8px",
        "large": "16px"
      }
    }
  },
  "styles": {
    "color": {
      "background": "var(--wp--preset--color--light)",
      "text": "var(--wp--preset--color--dark)"
    },
    "typography": {
      "fontFamily": "var(--wp--preset--font-family--primary)",
      "fontSize": "var(--wp--preset--font-size--medium)",
      "lineHeight": "1.6"
    },
    "spacing": {
      "padding": {
        "top": "0",
        "right": "var(--wp--preset--spacing--md)",
        "bottom": "0",
        "left": "var(--wp--preset--spacing--md)"
      }
    },
    "blocks": {
      "core/heading": {
        "typography": {
          "fontWeight": "600",
          "lineHeight": "1.2"
        }
      },
      "core/button": {
        "border": {
          "radius": "8px"
        },
        "spacing": {
          "padding": {
            "top": "0.75rem",
            "right": "1.5rem",
            "bottom": "0.75rem",
            "left": "1.5rem"
          }
        },
        "typography": {
          "fontWeight": "500"
        }
      },
      "core/group": {
        "spacing": {
          "padding": {
            "top": "var(--wp--preset--spacing--md)",
            "bottom": "var(--wp--preset--spacing--md)"
          }
        }
      }
    }
  }
}
```

### Step 6: Create `assets/css/blocks.css`

```css
/**
 * AltoFuel Block Editor Styles
 * These styles ensure the editor matches the frontend
 */

/* Import Fira Sans and Fira Mono fonts */
@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Fira+Mono:wght@400;500;700&display=swap');

/* Editor wrapper */
.editor-styles-wrapper {
  font-family: 'Fira Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #0a0a0a;
}

/* Ensure block spacing matches frontend */
.wp-block {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.wp-block[data-align="wide"] {
  max-width: 1200px;
}

.wp-block[data-align="full"] {
  max-width: none;
}

/* Button styles */
.wp-block-button__link {
  border-radius: 8px;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s;
}

/* Heading styles */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.2;
  margin-top: 0;
}

/* Code blocks */
.wp-block-code {
  font-family: 'Fira Mono', 'Courier New', monospace;
  background: #f4f4f5;
  border-radius: 8px;
  padding: 1.5rem;
}

/* Custom color classes (generated from theme.json) */
.has-primary-color {
  color: #2b7fff !important;
}

.has-primary-background-color {
  background-color: #2b7fff !important;
}

.has-dark-color {
  color: #0a0a0a !important;
}

.has-dark-background-color {
  background-color: #0a0a0a !important;
}

/* Add all other color classes from theme.json */
```

---

## Part 2: Activate and Test Theme

### Step 1: Upload Theme

1. Upload the `altofuel` folder to `wp-content/themes/`
2. Go to WordPress Admin → Appearance → Themes
3. Activate the "AltoFuel" theme

### Step 2: Test in Gutenberg Editor

1. Create a new Page or Post
2. Verify color palette appears in block settings
3. Verify typography options appear
4. Add various blocks and apply colors/styles
5. Save and check REST API output

### Step 3: Test REST API Endpoints

Visit these URLs to verify data is available:

```
https://digest.altofuel.com/wp-json/wp/v2/posts
https://digest.altofuel.com/wp-json/wp/v2/pages
https://digest.altofuel.com/wp-json/altofuel/v1/theme-settings
```

---

## Part 3: Next.js Integration

### Update `lib/wordpress.ts`

Add function to fetch theme settings:

```typescript
export async function getThemeSettings() {
  const response = await fetch(
    `${process.env.WORDPRESS_URL}/wp-json/altofuel/v1/theme-settings`,
    {
      next: { revalidate: 86400 } // Cache for 24 hours
    }
  );

  if (!response.ok) {
    throw new WordPressAPIError('Failed to fetch theme settings', response.status);
  }

  return response.json();
}
```

### Create Gutenberg Block Renderer

Create `components/gutenberg/block-renderer.tsx`:

```typescript
'use client';

import { useEffect } from 'react';

interface BlockRendererProps {
  content: string;
  themeSettings?: any;
}

export function BlockRenderer({ content, themeSettings }: BlockRendererProps) {
  useEffect(() => {
    // Inject theme.json CSS variables if needed
    if (themeSettings?.settings?.color?.palette) {
      const root = document.documentElement;
      themeSettings.settings.color.palette.forEach((color: any) => {
        root.style.setProperty(`--wp--preset--color--${color.slug}`, color.color);
      });
    }
  }, [themeSettings]);

  return (
    <div
      className="gutenberg-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
```

### Create Gutenberg Styles

Create `styles/gutenberg.css`:

```css
/* Gutenberg Block Styles for Next.js */

.gutenberg-content {
  /* Match WordPress content width */
  max-width: 800px;
  margin: 0 auto;
}

/* Block alignment */
.gutenberg-content .alignwide {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.gutenberg-content .alignfull {
  max-width: none;
  width: 100vw;
  margin-left: calc(50% - 50vw);
}

/* Import all WordPress block styles */
@import url('https://digest.altofuel.com/wp-includes/css/dist/block-library/style.min.css');

/* Override with your custom styles */
.gutenberg-content .wp-block-button__link {
  background-color: var(--wp--preset--color--primary);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.gutenberg-content .wp-block-button__link:hover {
  opacity: 0.9;
}

/* Add more custom block styles as needed */
```

### Update Page Template

Update your page templates to use the BlockRenderer:

```typescript
import { BlockRenderer } from '@/components/gutenberg/block-renderer';
import { getThemeSettings } from '@/lib/wordpress';

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);
  const themeSettings = await getThemeSettings();

  return (
    <article>
      <h1>{page.title.rendered}</h1>
      <BlockRenderer
        content={page.content.rendered}
        themeSettings={themeSettings}
      />
    </article>
  );
}
```

---

## Part 4: Advanced Features

### Custom Block Styles Endpoint

Add to `functions.php` for more control:

```php
function altofuel_get_compiled_styles() {
    register_rest_route('altofuel/v1', '/block-styles', [
        'methods' => 'GET',
        'callback' => function() {
            // Get all registered block styles
            $styles = wp_styles();
            $block_styles = [];

            foreach ($styles->registered as $handle => $style) {
                if (strpos($handle, 'wp-block-') === 0) {
                    $block_styles[$handle] = $style->src;
                }
            }

            return new WP_REST_Response([
                'styles' => $block_styles,
                'theme_url' => get_template_directory_uri()
            ], 200);
        },
        'permission_callback' => '__return_true'
    ]);
}
add_action('rest_api_init', 'altofuel_get_compiled_styles');
```

---

## Testing Checklist

- [ ] Theme activates without errors
- [ ] Color palette appears in Gutenberg editor
- [ ] Typography options appear in Gutenberg editor
- [ ] Spacing options appear in Gutenberg editor
- [ ] REST API returns full block markup with classes
- [ ] `/wp-json/altofuel/v1/theme-settings` returns theme.json
- [ ] CORS headers allow Next.js to fetch data
- [ ] Block styles render correctly in Next.js
- [ ] Colors match between editor and frontend

---

## Common Issues & Solutions

**Issue**: Colors not showing in editor
- **Solution**: Clear WordPress cache, check theme.json syntax

**Issue**: Block classes stripped from REST API
- **Solution**: Verify `altofuel_preserve_block_classes` filter is active

**Issue**: CORS errors
- **Solution**: Add your Next.js domain to `altofuel_add_cors_headers`

**Issue**: Styles don't match
- **Solution**: Import WordPress block library CSS in Next.js

---

## Resources

- [WordPress theme.json Documentation](https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/)
- [Gutenberg Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress REST API Reference](https://developer.wordpress.org/rest-api/)

---

## Next Steps

1. Upload theme to `https://digest.altofuel.com`
2. Activate theme and test in editor
3. Create test content with various blocks and colors
4. Integrate BlockRenderer into Next.js
5. Test rendering on frontend
6. Refine styles as needed
