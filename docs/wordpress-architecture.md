# Code550 WordPress Architecture

This document outlines the WordPress content architecture for the code550-wp theme powering the Code550 Next.js frontend.

## Architecture Philosophy

WordPress is the visual content editor. Next.js is the visual renderer. Content is authored in Gutenberg using standard and custom blocks, then delivered via the REST API as rendered HTML. Next.js maps WordPress block markup and CSS classes to Tailwind-styled components.

**No ACF. No meta field walls. Content lives in the editor.**

---

## theme.json

The `theme.json` file aligns the Gutenberg editor palette and typography with the Next.js Tailwind theme so editors see accurate colors while authoring.

### Color Palette

```json
{
  "$schema": "https://schemas.wp.org/wp/6.7/theme.json",
  "version": 3,
  "settings": {
    "color": {
      "defaultPalette": false,
      "defaultGradients": false,
      "palette": [
        { "slug": "primary", "color": "#7c3aed", "name": "Primary" },
        { "slug": "primary-foreground", "color": "#faf5ff", "name": "Primary Foreground" },
        { "slug": "secondary", "color": "#d4c4f0", "name": "Secondary" },
        { "slug": "secondary-foreground", "color": "#1a1625", "name": "Secondary Foreground" },
        { "slug": "accent", "color": "#7c3aed", "name": "Accent" },
        { "slug": "accent-foreground", "color": "#faf5ff", "name": "Accent Foreground" },
        { "slug": "accent-soft", "color": "#a78bfa", "name": "Accent Soft" },
        { "slug": "muted", "color": "#ddd6e8", "name": "Muted" },
        { "slug": "muted-foreground", "color": "#6b6080", "name": "Muted Foreground" },
        { "slug": "destructive", "color": "#d4183d", "name": "Destructive" },
        { "slug": "background", "color": "#faf8fc", "name": "Background" },
        { "slug": "foreground", "color": "#1a1625", "name": "Foreground" },
        { "slug": "card", "color": "#f3eff8", "name": "Card" },
        { "slug": "card-foreground", "color": "#1a1625", "name": "Card Foreground" },
        { "slug": "border", "color": "#c4b8d6", "name": "Border" }
      ],
      "gradients": [
        {
          "slug": "primary-gradient",
          "name": "Primary Gradient",
          "gradient": "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)"
        },
        {
          "slug": "primary-to-accent",
          "name": "Primary to Accent Soft",
          "gradient": "linear-gradient(to bottom right, #7c3aed, #a78bfa)"
        }
      ]
    },
    "typography": {
      "defaultFontSizes": false,
      "fontFamilies": [
        {
          "slug": "display",
          "name": "Display (Syne)",
          "fontFamily": "'Syne', sans-serif",
          "fontFace": [
            {
              "fontFamily": "Syne",
              "fontWeight": "400 800",
              "fontStyle": "normal",
              "src": ["https://fonts.googleapis.com/css2?family=Syne:wght@400..800&display=swap"]
            }
          ]
        },
        {
          "slug": "sans",
          "name": "Body (DM Sans)",
          "fontFamily": "'DM Sans', sans-serif",
          "fontFace": [
            {
              "fontFamily": "DM Sans",
              "fontWeight": "100 1000",
              "fontStyle": "normal",
              "src": ["https://fonts.googleapis.com/css2?family=DM+Sans:wght@100..1000&display=swap"]
            }
          ]
        },
        {
          "slug": "mono",
          "name": "Mono (JetBrains Mono)",
          "fontFamily": "'JetBrains Mono', monospace",
          "fontFace": [
            {
              "fontFamily": "JetBrains Mono",
              "fontWeight": "400 600",
              "fontStyle": "normal",
              "src": ["https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"]
            }
          ]
        }
      ],
      "fontSizes": [
        { "slug": "xs", "size": "0.75rem", "name": "Extra Small" },
        { "slug": "sm", "size": "0.875rem", "name": "Small" },
        { "slug": "base", "size": "1rem", "name": "Base" },
        { "slug": "lg", "size": "1.125rem", "name": "Large" },
        { "slug": "xl", "size": "1.25rem", "name": "Extra Large" },
        { "slug": "2xl", "size": "1.5rem", "name": "2XL" },
        { "slug": "3xl", "size": "1.875rem", "name": "3XL" },
        { "slug": "4xl", "size": "2.25rem", "name": "4XL" },
        { "slug": "5xl", "size": "3rem", "name": "5XL" },
        { "slug": "6xl", "size": "3.75rem", "name": "6XL" },
        { "slug": "7xl", "size": "4.5rem", "name": "7XL" }
      ]
    },
    "spacing": {
      "spacingSizes": [
        { "slug": "4", "size": "1rem", "name": "4 (1rem)" },
        { "slug": "6", "size": "1.5rem", "name": "6 (1.5rem)" },
        { "slug": "8", "size": "2rem", "name": "8 (2rem)" },
        { "slug": "10", "size": "2.5rem", "name": "10 (2.5rem)" },
        { "slug": "12", "size": "3rem", "name": "12 (3rem)" },
        { "slug": "16", "size": "4rem", "name": "16 (4rem)" },
        { "slug": "20", "size": "5rem", "name": "20 (5rem)" },
        { "slug": "24", "size": "6rem", "name": "24 (6rem)" },
        { "slug": "32", "size": "8rem", "name": "32 (8rem)" }
      ]
    },
    "layout": {
      "contentSize": "768px",
      "wideSize": "1280px"
    },
    "border": {
      "radius": true,
      "color": true,
      "style": true,
      "width": true
    }
  },
  "styles": {
    "color": {
      "background": "var(--wp--preset--color--background)",
      "text": "var(--wp--preset--color--foreground)"
    },
    "typography": {
      "fontFamily": "var(--wp--preset--font-family--sans)",
      "fontSize": "var(--wp--preset--font-size--base)",
      "lineHeight": "1.6"
    },
    "elements": {
      "heading": {
        "typography": {
          "fontFamily": "var(--wp--preset--font-family--display)",
          "fontWeight": "500"
        }
      },
      "button": {
        "border": {
          "radius": "9999px"
        },
        "color": {
          "background": "var(--wp--preset--color--primary)",
          "text": "var(--wp--preset--color--primary-foreground)"
        },
        "typography": {
          "fontFamily": "var(--wp--preset--font-family--sans)",
          "fontSize": "var(--wp--preset--font-size--sm)",
          "fontWeight": "500"
        }
      },
      "link": {
        "color": {
          "text": "var(--wp--preset--color--primary)"
        }
      }
    },
    "blocks": {
      "core/code": {
        "typography": {
          "fontFamily": "var(--wp--preset--font-family--mono)"
        }
      }
    }
  }
}
```

### WordPress Class to Tailwind Mapping

When Next.js receives `content.rendered` from the REST API, it maps WordPress CSS classes to Tailwind equivalents:

| WordPress Class | Tailwind Class | Notes |
|---|---|---|
| `has-primary-color` | `text-primary` | Text color |
| `has-primary-foreground-color` | `text-primary-foreground` | Light text on primary bg |
| `has-primary-background-color` | `bg-primary` | Background color |
| `has-secondary-color` | `text-secondary-foreground` | Text color |
| `has-secondary-background-color` | `bg-secondary` | Background color |
| `has-accent-color` | `text-accent` | Text color |
| `has-accent-foreground-color` | `text-accent-foreground` | Light text on accent bg |
| `has-accent-soft-color` | `text-accent-soft` | Softer purple text |
| `has-muted-color` | `text-muted` | Muted background as text |
| `has-muted-foreground-color` | `text-muted-foreground` | Subdued text |
| `has-destructive-color` | `text-destructive` | Error/warning text |
| `has-background-color` | `text-background` | Background as text |
| `has-foreground-color` | `text-foreground` | Main text color |
| `has-card-background-color` | `bg-card` | Card surface |
| `has-card-foreground-color` | `text-card-foreground` | Card text |
| `has-border-color` | `text-border` | Border as text |
| `has-primary-gradient-background` | `bg-gradient-to-br from-primary to-primary/80` | Primary gradient bg |
| `has-primary-to-accent-gradient-background` | `bg-gradient-to-br from-primary to-accent-soft` | Primary to accent gradient |
| `has-display-font-family` | `font-display` | Syne headings |
| `has-sans-font-family` | `font-sans` | DM Sans body |
| `has-mono-font-family` | `font-mono` | JetBrains Mono |
| `has-xs-font-size` | `text-xs` | 0.75rem |
| `has-sm-font-size` | `text-sm` | 0.875rem |
| `has-base-font-size` | `text-base` | 1rem |
| `has-lg-font-size` | `text-lg` | 1.125rem |
| `has-xl-font-size` | `text-xl` | 1.25rem |
| `has-2-xl-font-size` | `text-2xl` | 1.5rem |
| `has-3-xl-font-size` | `text-3xl` | 1.875rem |
| `has-4-xl-font-size` | `text-4xl` | 2.25rem |
| `has-5-xl-font-size` | `text-5xl` | 3rem |
| `has-6-xl-font-size` | `text-6xl` | 3.75rem |
| `has-7-xl-font-size` | `text-7xl` | 4.5rem |
| `has-text-align-center` | `text-center` | Text alignment |
| `has-text-align-right` | `text-right` | Text alignment |
| `has-text-align-left` | `text-left` | Text alignment |
| `wp-block-button__link` | Button component | Pill-shaped, primary bg |
| `is-style-outline` | `variant="outline"` | Outline button style |
| `wp-block-columns` | `grid` / `flex` | Column layouts |
| `alignwide` | `max-w-6xl mx-auto` | Wide alignment |
| `alignfull` | `w-full` | Full width |

---

## Custom Post Types

CPTs exist for **querying and routing** — not for storing structured field data. Content is authored in the Gutenberg editor.

### 1. Service (`service`)

Each service is a Gutenberg-authored page within the `service` CPT.

**Registration:**
```php
register_post_type('service', [
    'label' => 'Services',
    'public' => true,
    'show_in_rest' => true,
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
    'has_archive' => true,
    'rewrite' => ['slug' => 'services'],
    'menu_icon' => 'dashicons-admin-tools',
    'template' => [
        ['core/paragraph', ['placeholder' => 'Service description...']],
        ['code550/stats-grid'],
        ['core/heading', ['level' => 2, 'content' => 'What\'s Included']],
        ['code550/checklist'],
        ['core/heading', ['level' => 2, 'content' => 'Key Benefits']],
        ['code550/checklist'],
        ['code550/process-steps'],
        ['code550/cta-block'],
    ],
]);
```

**Meta fields (minimal):**

| Field | Type | Purpose |
|---|---|---|
| `icon` | string | Lucide icon name (e.g. `"code-2"`, `"palette"`, `"bar-chart-3"`, `"layers"`) |
| `sort_order` | number | Display order on listings |

Everything else (description, features, benefits, process steps, stats) is block content.

**REST API:** `/wp-json/wp/v2/service`

---

### 2. Case Study (`case-study`)

Portfolio projects authored in Gutenberg.

**Registration:**
```php
register_post_type('case-study', [
    'label' => 'Case Studies',
    'public' => true,
    'show_in_rest' => true,
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
    'has_archive' => true,
    'rewrite' => ['slug' => 'work'],
    'menu_icon' => 'dashicons-portfolio',
    'template' => [
        ['core/paragraph', ['placeholder' => 'Project tagline...']],
        ['code550/project-meta'],
        ['code550/results-grid'],
        ['core/heading', ['level' => 2, 'content' => 'The Challenge']],
        ['core/paragraph', ['placeholder' => 'Describe the challenge...']],
        ['core/heading', ['level' => 2, 'content' => 'Our Solution']],
        ['core/paragraph', ['placeholder' => 'Describe the solution...']],
        ['core/gallery'],
        ['code550/tech-stack'],
        ['code550/checklist'],
        ['code550/testimonial-card'],
        ['code550/cta-block'],
    ],
]);
```

**Meta fields (minimal):**

| Field | Type | Purpose |
|---|---|---|
| `sort_order` | number | Display order on listings |

**Taxonomy:** `project-category` (WordPress, React, SEO, Design) for filtering on the Work page.

```php
register_taxonomy('project-category', 'case-study', [
    'label' => 'Project Categories',
    'public' => true,
    'show_in_rest' => true,
    'hierarchical' => true,
    'rewrite' => ['slug' => 'project-category'],
]);
```

**REST API:** `/wp-json/wp/v2/case-study`

---

### 3. Team Member (`team-member`)

**Registration:**
```php
register_post_type('team-member', [
    'label' => 'Team Members',
    'public' => true,
    'show_in_rest' => true,
    'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
    'has_archive' => false,
    'rewrite' => ['slug' => 'team'],
    'menu_icon' => 'dashicons-groups',
    'template' => [
        ['core/paragraph', ['placeholder' => 'Role / job title...']],
        ['core/paragraph', ['placeholder' => 'Short bio...']],
    ],
]);
```

**Meta fields (minimal):**

| Field | Type | Purpose |
|---|---|---|
| `role` | string | Job title (used in listings where rendered content isn't shown) |
| `sort_order` | number | Display order on about page |

Avatar/photo uses the featured image (post thumbnail). Bio is editor content.

**REST API:** `/wp-json/wp/v2/team-member`

---

## Custom Gutenberg Blocks

These blocks provide UI elements that don't exist in core WordPress. Each block outputs semantic HTML with WordPress CSS classes. Next.js maps the output to Tailwind-styled components.

### `code550/stats-grid`

Displays a row of stat counters (e.g. "150+ Projects Delivered").

**Editor:** Repeatable group — value input + label input.

**Output:**
```html
<div class="wp-block-code550-stats-grid">
  <div class="code550-stat">
    <span class="code550-stat__value">150+</span>
    <span class="code550-stat__label">Projects Delivered</span>
  </div>
  <div class="code550-stat">
    <span class="code550-stat__value">98%</span>
    <span class="code550-stat__label">Client Satisfaction</span>
  </div>
</div>
```

**Next.js rendering:** Maps to animated `StatCounter` component with gradient text and mono label.

---

### `code550/checklist`

A list with checkmark icons (used for features, benefits, deliverables, achievements).

**Editor:** Repeatable text inputs.

**Output:**
```html
<ul class="wp-block-code550-checklist">
  <li class="code550-checklist__item">Custom Theme Development</li>
  <li class="code550-checklist__item">Plugin Development & Customization</li>
</ul>
```

**Next.js rendering:** `CheckCircle2` icon + text, styled with `text-primary` icon and `text-foreground` text.

---

### `code550/process-steps`

Numbered process/timeline steps (e.g. Discovery, Strategy, Design...).

**Editor:** Repeatable group — title + description.

**Output:**
```html
<div class="wp-block-code550-process-steps">
  <div class="code550-step" data-step="1">
    <span class="code550-step__number">Step 1</span>
    <h3 class="code550-step__title">Discovery</h3>
    <p class="code550-step__description">We analyze your requirements and goals</p>
  </div>
</div>
```

**Next.js rendering:** Cards in a 3-column grid with `font-mono text-primary` step number, `font-display` title, `text-muted-foreground` description.

---

### `code550/results-grid`

Before/after metrics table for case studies.

**Editor:** Repeatable group — metric name, before value, after value, change percentage.

**Output:**
```html
<div class="wp-block-code550-results-grid">
  <div class="code550-result">
    <span class="code550-result__metric">Conversion Rate</span>
    <span class="code550-result__change">+47%</span>
    <span class="code550-result__detail">1.8% &rarr; 2.6%</span>
  </div>
</div>
```

**Next.js rendering:** Cards with gradient text for the change value, `TrendingUp` icon, mono metric label.

---

### `code550/project-meta`

Meta information bar for case studies (duration, team size, industry).

**Editor:** Three text fields — duration, team size, industry.

**Output:**
```html
<div class="wp-block-code550-project-meta">
  <div class="code550-meta-item" data-icon="calendar">
    <span>12 weeks</span>
  </div>
  <div class="code550-meta-item" data-icon="users">
    <span>4 specialists</span>
  </div>
  <div class="code550-meta-item" data-icon="industry">
    <span>Consumer Electronics</span>
  </div>
</div>
```

**Next.js rendering:** Flex row with Lucide icons (`Calendar`, `Users`) and `text-muted-foreground` text.

---

### `code550/tech-stack`

Technology badge list for case studies.

**Editor:** Repeatable text input for technology names.

**Output:**
```html
<div class="wp-block-code550-tech-stack">
  <span class="code550-tech-badge">WordPress</span>
  <span class="code550-tech-badge">WooCommerce</span>
  <span class="code550-tech-badge">Next.js</span>
</div>
```

**Next.js rendering:** `Badge` components with `variant="outline"`.

---

### `code550/testimonial-card`

Client testimonial with quote, author, role, and optional photo.

**Editor:** Quote textarea, author name, role, image upload.

**Output:**
```html
<blockquote class="wp-block-code550-testimonial-card">
  <p class="code550-testimonial__quote">Code550 transformed our business...</p>
  <footer class="code550-testimonial__footer">
    <img src="..." alt="Sarah Chen" class="code550-testimonial__image" />
    <cite class="code550-testimonial__author">Sarah Chen</cite>
    <span class="code550-testimonial__role">CEO, TechStart</span>
  </footer>
</blockquote>
```

**Next.js rendering:** Rounded card with `border-primary/20`, gradient background, star rating, `font-mono` role text.

---

### `code550/cta-block`

Call-to-action section with heading, description, and buttons.

**Editor:** Heading, description paragraph, primary button text/URL, optional secondary button text/URL.

**Output:**
```html
<div class="wp-block-code550-cta-block">
  <h2 class="code550-cta__heading">Ready to Scale Your Business?</h2>
  <p class="code550-cta__description">Let's build something exceptional together.</p>
  <div class="code550-cta__buttons">
    <a href="/contact" class="code550-cta__button-primary">Get Started Today</a>
    <a href="/work" class="code550-cta__button-secondary">View Case Studies</a>
  </div>
</div>
```

**Next.js rendering:** Centered section with `rounded-3xl`, `border-primary/20`, `glow-primary` background effect, pill-shaped buttons.

---

### `code550/icon-card`

Card with a Lucide icon, heading, and description (used for values, service cards on listings).

**Editor:** Icon name select, heading, description.

**Output:**
```html
<div class="wp-block-code550-icon-card" data-icon="target">
  <h3 class="code550-icon-card__title">Results-Driven</h3>
  <p class="code550-icon-card__description">Every decision we make is focused on delivering measurable results.</p>
</div>
```

**Next.js rendering:** Card with `rounded-2xl`, icon in `bg-primary/10` pill, `font-display` title, hover lift animation.

---

### `code550/badge`

Inline label/badge (e.g. "DIGITAL EXCELLENCE SINCE 2016", "OUR SERVICES").

**Editor:** Text input.

**Output:**
```html
<span class="wp-block-code550-badge">DIGITAL EXCELLENCE SINCE 2016</span>
```

**Next.js rendering:** `Badge` component with `font-mono text-xs rounded-full`.

---

## Pages (Gutenberg)

Pages are built entirely in the Gutenberg editor using standard blocks + custom blocks above. Next.js detects the page by slug and applies the appropriate template/layout.

### Home (`/`)
Set as static front page in Settings > Reading. Uses: `code550/badge`, `code550/stats-grid`, `code550/icon-card` (for services preview), `code550/testimonial-card`, `code550/cta-block`, standard FAQ via accordion blocks.

### About (`/about`)
Uses: `code550/badge`, `code550/checklist` (achievements), `code550/icon-card` (values). Team members are pulled from the `team-member` CPT.

### Services (`/services`)
Brief hero content. Service cards are rendered from the `service` CPT data.

### Work (`/work`)
Brief hero content. Case study cards are rendered from the `case-study` CPT data with `project-category` taxonomy filtering.

### Contact (`/contact`)
Uses: `code550/checklist` (trust indicators), standard blocks for contact info and hours. The contact form is handled by Next.js (React multi-step form).

### Thank You (`/thank-you`)
Uses: `code550/process-steps` (for next steps: Email Confirmation, Team Review, Initial Contact).

### Legal Pages (`/privacy`, `/terms`, `/cookies`)
Standard long-form content using core blocks (headings, paragraphs, lists). No custom blocks needed.

### Blog
Standard `post` type. No custom fields — REST API handles title, excerpt, content, featured image, categories, tags, author, date.

---

## Menu Locations

```php
register_nav_menus([
    'primary' => 'Primary Navigation',
    'footer'  => 'Footer Navigation',
]);
```

| Location | Usage |
|---|---|
| `primary` | Header — Services (with mega menu), Work, About, Blog |
| `footer` | Footer columns — Services links, Company links |

---

## Theme Support

```php
add_theme_support('post-thumbnails');
add_theme_support('title-tag');
add_theme_support('custom-logo');
add_theme_support('editor-styles');
add_theme_support('wp-block-styles');
add_theme_support('responsive-embeds');
```

---

## REST API Checklist

- [ ] `service` CPT registered with `show_in_rest => true`
- [ ] `case-study` CPT registered with `show_in_rest => true`
- [ ] `team-member` CPT registered with `show_in_rest => true`
- [ ] `project-category` taxonomy registered with `show_in_rest => true`
- [ ] `icon` and `sort_order` meta fields registered with `show_in_rest => true`
- [ ] `role` meta field on team-member registered with `show_in_rest => true`
- [ ] Featured images included in REST responses (`_embed` support)
- [ ] Menu locations registered and accessible via navigation endpoint
- [ ] Custom blocks registered with `register_block_type()` and REST-compatible
- [ ] Block content renders as HTML in `content.rendered`

## Next.js Content Rendering

The Next.js frontend receives `content.rendered` from the REST API and:

1. Parses the HTML string
2. Identifies WordPress block wrapper classes (`wp-block-code550-*`)
3. Maps them to React components with Tailwind styling
4. Maps WordPress color/font/spacing classes to Tailwind equivalents (see mapping table above)
5. Passes standard HTML blocks through with base Tailwind prose styling

This keeps all content authoring in WordPress while letting Next.js handle the visual presentation layer.
