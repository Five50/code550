# Code550 WordPress Architecture

This document outlines the WordPress content architecture required for the code550-wp theme to power the Code550 Next.js frontend.

## Overview

The Next.js frontend handles all visual presentation — animations, grids, hover effects, card layouts. WordPress provides content data via the REST API. You do not need custom Gutenberg blocks that replicate the frontend's visual complexity.

---

## Custom Post Types

### 1. Services (`service`)

Each service is a separate post with custom fields exposed via REST API.

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `icon` | string | Icon identifier (e.g., lucide icon name: `"globe"`, `"code"`, `"search"`, `"palette"`) |
| `description` | text | Short description shown on service cards |
| `features` | repeater | List of feature strings (e.g., "Custom Theme Development", "Plugin Integration") |
| `deliverables` | repeater | List of deliverable strings shown as badges |
| `stats` | repeater | Each entry has `value` (string, e.g., "500+") and `label` (string, e.g., "Sites Built") |
| `process_steps` | repeater | Each entry has `title` (string) and `description` (text). Standard steps: Discovery, Strategy, Design, Development, Testing, Support |
| `hero_image` | image | Featured image for service detail page |
| `sort_order` | number | Display order on services listing page |

**Expected services (4 main):**
- WordPress Development
- Next.js / React Development
- SEO & Performance
- UI/UX Design

**Additional services (shown on services listing only):**
- Digital Marketing
- Web Applications

**REST API endpoint:** `/wp-json/wp/v2/service`

**Required REST API fields:** All custom fields should be registered with `show_in_rest => true` and exposed via `register_rest_field()` or a meta schema.

---

### 2. Case Studies (`case-study`)

Each case study is a portfolio project entry.

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `client_name` | string | Client/company name |
| `tagline` | text | Short tagline below the title |
| `industry` | string | Industry label (e.g., "E-Commerce", "SaaS") |
| `duration` | string | Project duration (e.g., "4 months") |
| `team_size` | string | Team size (e.g., "6 specialists") |
| `challenge` | textarea | The challenge/problem narrative |
| `solution` | repeater | Each entry is a bullet point describing the solution |
| `technologies` | repeater | Each entry is a technology name shown as a badge (e.g., "Next.js", "WordPress", "Tailwind") |
| `deliverables` | repeater | Each entry is a deliverable string with checkmark display |
| `results` | repeater | Each entry has: `metric` (string), `before` (string), `after` (string), `trend` (string: "up" or "down") |
| `testimonial_quote` | textarea | Client testimonial text |
| `testimonial_author` | string | Testimonial author name |
| `testimonial_role` | string | Testimonial author role/title |
| `gallery` | gallery/repeater | Project screenshots (2-column display) |
| `category` | taxonomy | Project category: WordPress, React, SEO, Design |

**REST API endpoint:** `/wp-json/wp/v2/case-study`

**Taxonomy:** Register a `project-category` taxonomy for filtering on the Work page. Categories: WordPress, React, SEO, Design.

---

### 3. Team Members (`team-member`)

Each team member is a separate entry.

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `role` | string | Job title (e.g., "Lead Developer & Founder") |
| `bio` | textarea | Short biography paragraph |
| `avatar` | image | Profile photo (displayed with grayscale-to-color hover effect) |
| `sort_order` | number | Display order on the about page |

**REST API endpoint:** `/wp-json/wp/v2/team-member`

---

## Pages (Gutenberg)

These pages are built in the WordPress editor using standard Gutenberg blocks. The Next.js frontend detects the page by slug and applies the appropriate visual template.

### Home (`/`)

Set as the static front page in Settings > Reading.

**Content to author in Gutenberg:**
- Hero heading (e.g., "Build Digital Products That Convert")
- Hero subtitle paragraph
- CTA button text and URL
- Benefits/trust signals (4 items)
- Testimonials section content (or use a shortcode/block that pulls from a testimonials CPT if desired)
- CTA section heading and button
- FAQ items (question + answer pairs)

**Stats shown on the homepage** (150+ projects, 98% satisfaction, etc.) can be:
- Custom fields on the page, or
- Hardcoded in the Next.js template initially, updated later

### About (`/about`)

**Content to author in Gutenberg:**
- Hero title and tagline
- Hero image
- Mission narrative paragraph
- Achievement items (6 items with checkmarks)
- Values section is rendered by the Next.js template using content from the page

### Contact (`/contact`)

**Content to author in Gutenberg:**
- Hero title and subtitle
- Trust indicator items (free consultation, 24-hour response, etc.)
- Contact info (email, phone, location)
- Office hours
- FAQ items specific to contact

**Note:** The contact form itself is handled by the Next.js frontend (or via a form API route). The contact modal is a multi-step form built in React.

### Thank You (`/thank-you`)

**Content to author in Gutenberg:**
- Success message heading
- Explanation paragraph
- Next steps (3 items: Email Confirmation, Team Review, Initial Contact)

### Legal Pages

Standard long-form content pages built entirely in Gutenberg:
- **Privacy Policy** (`/privacy`)
- **Terms of Service** (`/terms`)
- **Cookie Policy** (`/cookies`)

Each should include:
- Title and last updated date
- Sectioned content with h2/h3 headings
- Contact information box at the bottom

### Services (`/services`)

This page primarily displays the Services CPT entries. Author a brief hero section in Gutenberg:
- Title (e.g., "Our Services")
- Subtitle paragraph
- CTA content at the bottom

The service cards are rendered by the Next.js template from the Services CPT data.

### Work (`/work`)

This page primarily displays Case Study CPT entries. Author a brief hero section:
- Title (e.g., "Our Work")
- Stats section content (or custom fields)
- CTA content at the bottom

---

## Menu Locations

Register two menu locations in the theme:

| Location | Slug | Usage |
|----------|------|-------|
| **Primary Navigation** | `primary` | Header navigation — Services (with mega menu), Work, About, Blog |
| **Footer Navigation** | `footer` | Footer columns — Services links, Company links |

The Next.js frontend already supports fetching menus via `getPrimaryNavigation()` and `getFooterNavigation()`.

---

## Blog

Blog posts use the standard WordPress `post` type. No custom fields required — the existing REST API integration handles:
- Title, excerpt, content, featured image
- Categories and tags (used for filtering)
- Author information
- Date and reading time

The blog listing page should be set as the Posts page in Settings > Reading, or accessed via the `/blog` route.

---

## REST API Checklist

Ensure the following are exposed via the REST API:

- [ ] `service` CPT registered with `show_in_rest => true`
- [ ] `case-study` CPT registered with `show_in_rest => true`
- [ ] `team-member` CPT registered with `show_in_rest => true`
- [ ] `project-category` taxonomy registered with `show_in_rest => true`
- [ ] All custom fields registered with `show_in_rest => true` (via `register_post_meta()` or `register_rest_field()`)
- [ ] Repeater fields serialized as JSON arrays in REST responses
- [ ] Featured images included in REST responses (`_embed` support or `featured_media` field)
- [ ] Menu locations registered and accessible via navigation endpoint
- [ ] Pages support template detection (template field in REST response)

## Theme Support

Ensure the theme registers support for:

```php
add_theme_support('post-thumbnails');
add_theme_support('title-tag');
add_theme_support('custom-logo');
add_theme_support('editor-styles');
```

## Recommended Plugins

- **Advanced Custom Fields (ACF) Pro** — For repeater fields and flexible content on CPTs
- **ACF to REST API** — Exposes ACF fields in the REST API (or use ACF's built-in REST support in v6+)
- **RankMath SEO** — Already integrated in the Next.js frontend for meta tags, Open Graph, and JSON-LD
- **WPML** (optional) — Multi-language support if English/Spanish switching is needed
