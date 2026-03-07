# Code550 Design-to-Next.js Conversion Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert the Figma/Vite design reference (`the-design/`) into the production Next.js app, replacing the generic starter with Code550's premium agency design while preserving the existing WordPress integration.

**Architecture:** Server Components for data fetching and page shells; Client Components for interactivity (navigation, animations, forms, carousels). WordPress REST API provides all content — blog posts via existing functions, new CPTs (services, case studies, team members) via new API functions. Framer Motion replaces GSAP for animations.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Framer Motion (`motion`), shadcn/ui (Radix), react-slick, lucide-react, WordPress REST API

**Source reference:** All visual designs are in `the-design/src/` — copy design patterns faithfully, adapting React Router to Next.js App Router and hardcoded data to WordPress API calls.

---

## Task 1: Update Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install new dependencies**

```bash
npm install motion react-slick slick-carousel tw-animate-css
npm install --save-dev @types/react-slick
```

**Step 2: Remove unused dependencies**

```bash
npm uninstall gsap tailwindcss-animate
```

Note: `tw-animate-css` replaces `tailwindcss-animate` (used by the design). `motion` is the Framer Motion v12+ package.

**Step 3: Verify build**

```bash
npm run build
```

Expected: Build should still succeed (GSAP imports will break — that's fine, we'll fix them in subsequent tasks).

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: update deps — add motion, react-slick; remove gsap

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Replace Design System (Styling & Fonts)

**Files:**
- Rewrite: `styles/input.css` (replace with design's theme system)
- Modify: `site.config.ts` (update fonts and site identity)
- Modify: `tailwind.config.ts` (update font families)

**Step 1: Replace `styles/input.css`**

Replace the entire file with the design's styling system. Source: `the-design/src/styles/theme.css` + `the-design/src/styles/fonts.css` + `the-design/src/styles/tailwind.css`, merged into one file.

The new file should contain:
1. Google Fonts import for Syne, DM Sans, JetBrains Mono (from `the-design/src/styles/fonts.css`)
2. Tailwind v4 import with `tw-animate-css` (from `the-design/src/styles/tailwind.css`)
3. The full `@custom-variant dark`, `:root` and `.dark` CSS custom properties (from `the-design/src/styles/theme.css`)
4. The `@theme inline` block with font families and color mappings
5. The `@layer base` block with typography, grid patterns, gradient utilities
6. The `@layer utilities` block with neumorphic shadows, glow effects
7. The keyframe animations (scroll, fadeInUp)
8. Keep the existing WordPress spacing safelist classes and `no-scrollbar` utility
9. Keep the existing View Transitions CSS block

Key changes from current:
- Colors: Blue theme → Purple theme (oklch values)
- Fonts: Saira/Fira Sans → Syne (display), DM Sans (body), JetBrains Mono (mono)
- Remove old `@font-face` declarations for Saira and Fira Sans
- Add new CSS utilities: `bg-grid-pattern`, `bg-dot-pattern`, `gradient-mesh`, `gradient-border`, `gradient-border-soft`, `shadow-neu`, `glow-primary`, `glow-blue`
- Border radius: `--radius: 0.5rem` → `--radius: 0.625rem`, add `--radius-card: 1.25rem`

**Step 2: Update `site.config.ts`**

```typescript
// Update fonts
fonts: {
  sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
  heading: ["Syne", "ui-sans-serif", "system-ui", "sans-serif"],
  mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
},

// Update identity
site_name: "Code550",
site_description: "We craft high-performance websites and applications that drive measurable results.",
site_domain: "https://code550.com",

// Update footer
footerDescription: "We craft high-performance websites and applications that drive measurable results. From strategy to deployment, we're your technical partner for growth.",
copyrightHolder: "Code550",
```

**Step 3: Update `tailwind.config.ts`**

Update the font family references to match the new fonts from site.config.

**Step 4: Commit**

```bash
git add styles/input.css site.config.ts tailwind.config.ts
git commit -m "feat: replace design system with Code550 purple theme, new fonts

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Update Root Layout

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Update the root layout**

Key changes:
- Remove GSAP script loading
- Remove Alpine.js script loading (unless still needed)
- Update body classes to match design: `bg-background text-foreground font-sans antialiased`
- Remove the old blue gradient background (`bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950`)
- Keep: WordPress global styles, ThemeProvider, HeaderProvider, Analytics, dark mode script
- Keep: Template detection and TemplateUpdater
- Remove `isProductionDomain` gating on Header/Footer (or keep if needed for staging)

**Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: update root layout — remove GSAP, update body styles

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: WordPress API — Add CPT Functions

**Files:**
- Modify: `lib/wordpress.ts` (add new API functions)
- Modify: `lib/wordpress.d.ts` (add new types)

**Step 1: Add types to `lib/wordpress.d.ts`**

```typescript
// Service CPT
export interface Service extends WPEntity {
  title: RenderedTitle;
  content: RenderedContent;
  excerpt: RenderedContent;
  featured_media: number;
  template: string;
  meta: Record<string, unknown>;
  acf: {
    icon: string;
    description: string;
    features: string[];
    deliverables: string[];
    stats: Array<{ value: string; label: string }>;
    process_steps: Array<{ title: string; description: string }>;
    sort_order: number;
  };
}

// Case Study CPT
export interface CaseStudy extends WPEntity {
  title: RenderedTitle;
  content: RenderedContent;
  excerpt: RenderedContent;
  featured_media: number;
  template: string;
  meta: Record<string, unknown>;
  'project-category': number[];
  acf: {
    client_name: string;
    tagline: string;
    industry: string;
    duration: string;
    team_size: string;
    challenge: string;
    solution: string[];
    technologies: string[];
    deliverables: string[];
    results: Array<{
      metric: string;
      before: string;
      after: string;
      trend: 'up' | 'down';
    }>;
    testimonial_quote: string;
    testimonial_author: string;
    testimonial_role: string;
    gallery: number[]; // media IDs
  };
}

// Team Member CPT
export interface TeamMember extends WPEntity {
  title: RenderedTitle;
  content: RenderedContent;
  featured_media: number;
  meta: Record<string, unknown>;
  acf: {
    role: string;
    bio: string;
    sort_order: number;
  };
}

// Project Category taxonomy
export interface ProjectCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: 'project-category';
  parent: number;
  meta: Record<string, unknown>;
}
```

**Step 2: Add API functions to `lib/wordpress.ts`**

Add these functions following the existing patterns (use `fetchAPI`, same caching strategy with `revalidate: 3600`):

```typescript
// Services
export async function getAllServices(language?: string): Promise<Service[]>
export async function getServiceBySlug(slug: string, language?: string): Promise<Service | null>

// Case Studies
export async function getAllCaseStudies(language?: string): Promise<CaseStudy[]>
export async function getCaseStudyBySlug(slug: string, language?: string): Promise<CaseStudy | null>
export async function getProjectCategories(): Promise<ProjectCategory[]>

// Team Members
export async function getAllTeamMembers(language?: string): Promise<TeamMember[]>
```

Each function should:
- Call the appropriate endpoint (`/wp-json/wp/v2/service`, `/wp-json/wp/v2/case-study`, `/wp-json/wp/v2/team-member`)
- Include `_embed` parameter for featured images
- Include `per_page=100` and `orderby=menu_order` (or `meta_value_num` for sort_order)
- Handle errors gracefully (return empty array or null)
- Use cache tags: `["wordpress", "services"]`, `["wordpress", "case-studies"]`, `["wordpress", "team-members"]`

**Step 3: Commit**

```bash
git add lib/wordpress.ts lib/wordpress.d.ts
git commit -m "feat: add WordPress API functions for services, case studies, team members

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Shared Components — Navigation (Header)

**Files:**
- Rewrite: `components/layout/header.tsx`

**Step 1: Convert the design's navigation to Next.js**

Source: `the-design/src/app/components/navigation.tsx`

Key conversions:
- `Link` from `react-router` → `Link` from `next/link`
- `useLocation()` → `usePathname()` from `next/navigation`
- `logo` figma import → Next.js `Image` component with logo from `/public/` (or inline SVG)
- `useTheme()` from design's provider → keep or adapt existing theme provider
- `useLanguage()` references → remove for now (i18n handled differently in Next.js)
- Add `"use client"` directive at top
- Services data in mega menu: fetch from WordPress or use props passed from server component

The header should receive `services` as a prop (fetched server-side in layout) for the mega menu, or fetch them client-side.

**Approach:** The layout fetches services server-side and passes them as a prop to the Header component, alongside the existing `navigationItems`.

Modify `app/layout.tsx` to also fetch services:
```typescript
const services = await getAllServices('en');
```
Pass to Header: `<Header navigationItems={navigationItems} services={services} />`

**Step 2: Commit**

```bash
git add components/layout/header.tsx app/layout.tsx
git commit -m "feat: replace header with Code550 design — mega menu, mobile nav, theme toggle

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 6: Shared Components — Footer

**Files:**
- Rewrite: `components/layout/footer.tsx`

**Step 1: Convert the design's footer to Next.js**

Source: `the-design/src/app/components/footer.tsx`

Key conversions:
- Same Link/router conversions as navigation
- `useLanguage()` → hardcode English text for now, or use props
- `motion` from `motion/react` → keep as-is (already installed)
- Logo import → Next.js Image
- Newsletter form → can be a client component form that posts to an API route
- Footer nav links: hardcoded or passed from layout (WordPress footer menu)
- Add `"use client"` directive

**Step 2: Commit**

```bash
git add components/layout/footer.tsx
git commit -m "feat: replace footer with Code550 design — newsletter, social links, 4-col layout

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Shared Components — Contact Modal, FAQ, Testimonials, Breadcrumbs, Bento Grid

**Files:**
- Create: `components/contact-modal.tsx`
- Create: `components/faq-section.tsx`
- Create: `components/testimonial-carousel.tsx`
- Create: `components/breadcrumbs.tsx`
- Create: `components/bento-grid.tsx`
- Create: `components/mouse-card.tsx`
- Create: `components/stat-counter.tsx`

**Step 1: Convert each component from the design**

Sources:
- `the-design/src/app/components/contact-modal.tsx` → `components/contact-modal.tsx`
- `the-design/src/app/components/faq-section.tsx` → `components/faq-section.tsx`
- `the-design/src/app/components/testimonial-carousel.tsx` → `components/testimonial-carousel.tsx`
- `the-design/src/app/components/breadcrumbs.tsx` → `components/breadcrumbs.tsx`
- `the-design/src/app/components/bento-grid.tsx` → `components/bento-grid.tsx`
- `the-design/src/app/components/mouse-card.tsx` → `components/mouse-card.tsx`
- Extract `StatCounter` from `the-design/src/app/pages/home.tsx` → `components/stat-counter.tsx`

All components need:
- `"use client"` directive (they all use hooks/interactivity)
- `Link` from `next/link` instead of `react-router`
- `usePathname()` instead of `useLocation()` where applicable
- Import paths updated (`@/components/ui/...` instead of `./ui/...`)

For **contact-modal**:
- The `useNavigate()` redirect to `/thank-you` → use `useRouter()` from `next/navigation`
- Form submission can call an API route (`/api/contact`)

For **testimonial-carousel**:
- Import `slick-carousel/slick/slick.css` and `slick-carousel/slick/slick-theme.css`

For **breadcrumbs**:
- `Link` from `react-router` → `Link` from `next/link`
- `to` prop → `href` prop

**Step 2: Add contact modal to root layout**

The contact modal needs to be accessible from the header's "Let's Talk" button. Add a client-side context or state management for opening/closing the modal.

Create `lib/contact-modal-context.tsx`:
```typescript
"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface ContactModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ContactModalContext.Provider value={{
      isOpen,
      openModal: () => setIsOpen(true),
      closeModal: () => setIsOpen(false),
    }}>
      {children}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) throw new Error('useContactModal must be used within ContactModalProvider');
  return context;
}
```

Wire into `app/layout.tsx`:
```typescript
<ContactModalProvider>
  <Header ... />
  {children}
  <Footer />
  <ContactModal />
</ContactModalProvider>
```

**Step 3: Commit**

```bash
git add components/contact-modal.tsx components/faq-section.tsx components/testimonial-carousel.tsx components/breadcrumbs.tsx components/bento-grid.tsx components/mouse-card.tsx components/stat-counter.tsx lib/contact-modal-context.tsx app/layout.tsx
git commit -m "feat: add shared components — contact modal, FAQ, testimonials, breadcrumbs, bento grid

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 8: Homepage

**Files:**
- Rewrite: `app/page.tsx`
- Remove: `components/templates/front-page.tsx` (no longer needed in current form)

**Step 1: Convert the design's homepage**

Source: `the-design/src/app/pages/home.tsx`

The homepage is a mix of server and client components:

**Server part (`app/page.tsx`):**
- Fetch WordPress front page content (existing `getFrontPageContent()`)
- Fetch services from CPT (`getAllServices()`)
- Pass data to client component

**Client part (`components/pages/home-page.tsx`):**
- All the Framer Motion animations, scroll effects, stat counters
- Hero section, benefits row, services grid, testimonials, CTA, FAQ
- `"use client"` directive

Key data flow:
- Hero text: from WordPress front page content (or hardcoded initially)
- Services cards: from Services CPT data
- Testimonials: hardcoded initially (could become a CPT later)
- FAQ items: hardcoded initially (could come from page content)
- Stats: hardcoded initially

For `app/page.tsx`:
```typescript
import { getAllServices } from "@/lib/wordpress";
import { HomePage } from "@/components/pages/home-page";

export default async function Page() {
  const services = await getAllServices('en');
  return <HomePage services={services} />;
}
```

The `HomePage` client component receives services and renders the full design layout.

**Step 2: Add `generateMetadata`**

```typescript
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Code550 — Build Digital Products That Convert",
    description: "We craft high-performance websites and applications that drive measurable results.",
  };
}
```

**Step 3: Commit**

```bash
git add app/page.tsx components/pages/home-page.tsx
git commit -m "feat: homepage — hero, services grid, testimonials, FAQ, CTA sections

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 9: Services Pages

**Files:**
- Create: `app/services/page.tsx`
- Create: `app/services/[slug]/page.tsx`
- Create: `components/pages/services-page.tsx`
- Create: `components/pages/service-detail-page.tsx`

**Step 1: Services listing page**

Source: `the-design/src/app/pages/services.tsx`

`app/services/page.tsx` (server component):
- Fetch all services via `getAllServices()`
- Fetch the "services" WordPress page for hero content via `getPageBySlug('services')`
- Pass to `ServicesPage` client component

`components/pages/services-page.tsx` (client component):
- Render hero from WP page content
- Render 6 service cards in 12-column grid (alternating 8+4 col spans)
- CTA card at bottom
- Framer Motion animations

**Step 2: Service detail page**

Source: `the-design/src/app/pages/service-detail.tsx`

`app/services/[slug]/page.tsx` (server component):
- Fetch service by slug via `getServiceBySlug(params.slug)`
- Fetch featured image
- Pass to `ServiceDetailPage` client component

`components/pages/service-detail-page.tsx` (client component):
- Hero with icon and service name
- Hero image
- Stats section (3 columns)
- Description
- Features vs Benefits two-column
- Process steps (6 steps)
- CTA section

**Step 3: Add `generateStaticParams` and `generateMetadata` to both pages**

**Step 4: Commit**

```bash
git add app/services/page.tsx app/services/\[slug\]/page.tsx components/pages/services-page.tsx components/pages/service-detail-page.tsx
git commit -m "feat: services listing and detail pages

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 10: Work / Case Studies Pages

**Files:**
- Create: `app/work/page.tsx`
- Create: `app/work/[slug]/page.tsx`
- Create: `components/pages/work-page.tsx`
- Create: `components/pages/case-study-page.tsx`

**Step 1: Work listing page**

Source: `the-design/src/app/pages/work.tsx`

`app/work/page.tsx` (server component):
- Fetch all case studies via `getAllCaseStudies()`
- Fetch project categories via `getProjectCategories()`
- Fetch "work" WordPress page for hero content
- Pass to `WorkPage` client component

`components/pages/work-page.tsx` (client component):
- Category filter bar (All, WordPress, React, SEO, Design)
- Alternating 2-column project grid
- Project cards with image, category badge, metrics, results
- Stats section
- CTA

**Step 2: Case study detail page**

Source: `the-design/src/app/pages/case-study.tsx`

`app/work/[slug]/page.tsx` (server component):
- Fetch case study by slug
- Fetch featured image and gallery images

`components/pages/case-study-page.tsx` (client component):
- Breadcrumbs
- Hero with badge, title, tagline
- Meta info (duration, team size, industry)
- Hero image
- Key results grid (before/after metrics)
- Challenge and solution sections
- Gallery
- Technologies and deliverables
- Testimonial
- CTA

**Step 3: Add `generateStaticParams` and `generateMetadata`**

**Step 4: Commit**

```bash
git add app/work/page.tsx app/work/\[slug\]/page.tsx components/pages/work-page.tsx components/pages/case-study-page.tsx
git commit -m "feat: work listing and case study detail pages

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 11: About Page

**Files:**
- Create: `app/about/page.tsx`
- Create: `components/pages/about-page.tsx`

**Step 1: Convert the about page**

Source: `the-design/src/app/pages/about.tsx`

`app/about/page.tsx` (server component):
- Fetch "about" WordPress page for content
- Fetch team members via `getAllTeamMembers()`
- Pass to `AboutPage` client component

`components/pages/about-page.tsx` (client component):
- Hero with title and tagline
- Hero image
- Mission section with achievements
- Values section (4 value cards with icons)
- Team section (4-person grid with grayscale hover effect)

Values can be hardcoded initially or pulled from WordPress page content.

**Step 2: Commit**

```bash
git add app/about/page.tsx components/pages/about-page.tsx
git commit -m "feat: about page — mission, values, team grid

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 12: Blog Pages

**Files:**
- Rewrite: `app/blog/page.tsx`
- Create: `app/blog/[slug]/page.tsx`
- Create: `components/pages/blog-page.tsx`
- Create: `components/pages/blog-post-page.tsx`

**Step 1: Blog listing page**

Source: `the-design/src/app/pages/blog.tsx`

`app/blog/page.tsx` (server component):
- Fetch paginated posts via existing `getPostsPaginated()`
- Fetch categories via existing `getAllCategories()`
- Pass to `BlogPage` client component

`components/pages/blog-page.tsx` (client component):
- Category filter buttons
- Featured article (first post, large 2-column card)
- Articles grid (3-column)
- Newsletter CTA section
- Framer Motion animations

**Step 2: Blog post detail page**

Source: `the-design/src/app/pages/blog-post.tsx`

`app/blog/[slug]/page.tsx` (server component):
- Fetch post by slug via existing `getPostBySlug()`
- Fetch featured image, author, categories
- Fetch related posts (same category)
- Pass to `BlogPostPage` client component

`components/pages/blog-post-page.tsx` (client component):
- Breadcrumbs
- Header with badge, title, excerpt
- Meta (author, date, read time)
- Featured image
- Content with prose styling
- Related posts grid
- Navigation to other posts

**Step 3: Add `generateStaticParams` and `generateMetadata`**

**Step 4: Commit**

```bash
git add app/blog/page.tsx app/blog/\[slug\]/page.tsx components/pages/blog-page.tsx components/pages/blog-post-page.tsx
git commit -m "feat: blog listing and post detail pages with design styling

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 13: Contact & Thank You Pages

**Files:**
- Create: `app/contact/page.tsx`
- Create: `app/thank-you/page.tsx`
- Create: `components/pages/contact-page.tsx`
- Create: `components/pages/thank-you-page.tsx`
- Create: `app/api/contact/route.ts`

**Step 1: Contact page**

Source: `the-design/src/app/pages/contact.tsx`

`app/contact/page.tsx` (server component):
- Fetch "contact" WordPress page for content
- Pass to `ContactPage` client component

`components/pages/contact-page.tsx` (client component):
- Hero
- Trust indicators (6-column grid)
- 3-column layout: form (2 cols) + sidebar (1 col)
- Form fields: name, email, company, project type, budget, timeline, description
- Sidebar: contact info cards, office hours, quick links
- FAQ section

**Step 2: Contact API route**

`app/api/contact/route.ts`:
- Accept POST with form data
- Validate with zod
- Send email (or forward to a service)
- Return JSON response

**Step 3: Thank You page**

Source: `the-design/src/app/pages/thank-you.tsx`

Simple page with success animation, message, next steps, CTA buttons.

**Step 4: Commit**

```bash
git add app/contact/page.tsx app/thank-you/page.tsx components/pages/contact-page.tsx components/pages/thank-you-page.tsx app/api/contact/route.ts
git commit -m "feat: contact page with form, thank you page, contact API route

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 14: Legal Pages (Privacy, Terms, Cookies)

**Files:**
- Create: `app/privacy/page.tsx`
- Create: `app/terms/page.tsx`
- Create: `app/cookies/page.tsx`

**Step 1: Create legal page template**

These pages share a common structure. Create a shared component:

`components/pages/legal-page.tsx` (server component — no interactivity needed):
- Breadcrumbs
- Large title + last updated date
- WordPress page content rendered with prose styling
- Contact box at bottom

**Step 2: Create route files**

Each route file (`app/privacy/page.tsx`, etc.):
- Fetch WordPress page by slug (`getPageBySlug('privacy')`, etc.)
- Render with `LegalPage` component
- Add `generateMetadata`

Source for design reference: `the-design/src/app/pages/privacy.tsx`, `terms.tsx`, `cookies.tsx`

**Step 3: Commit**

```bash
git add app/privacy/page.tsx app/terms/page.tsx app/cookies/page.tsx components/pages/legal-page.tsx
git commit -m "feat: legal pages — privacy, terms, cookies with WordPress content

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 15: Route Cleanup & Redirects

**Files:**
- Modify: `next.config.ts` (add redirects)
- Remove or update: `app/[lang]/` routes (keep for future i18n but ensure `/blog` works)
- Remove: `app/[...slug]/page.tsx` catch-all (replace with proper 404)
- Update: `app/not-found.tsx`

**Step 1: Add redirects for old routes**

In `next.config.ts`, add redirects:
```typescript
async redirects() {
  return [
    { source: '/posts/:slug', destination: '/blog/:slug', permanent: true },
    { source: '/posts', destination: '/blog', permanent: true },
    { source: '/pages/:slug', destination: '/:slug', permanent: true },
  ];
},
```

**Step 2: Update 404 page**

Style the not-found page to match the Code550 design — dark background, primary color accents, display font.

**Step 3: Clean up unused files**

Remove templates/components that are no longer used:
- `components/templates/front-page.tsx` (replaced by `components/pages/home-page.tsx`)
- `components/templates/single.tsx` (replaced by `components/pages/blog-post-page.tsx`)
- `components/templates/page.tsx` (replaced by specific page components)
- `components/templates/page-no-title.tsx`
- `components/templates/index.tsx`
- `components/nav/mega-menu.tsx` (replaced by inline mega menu in header)
- `components/nav/mega-menu-container.tsx`
- `components/nav/mobile-nav.tsx` (replaced by inline mobile menu in header)
- `components/posts/post-card.tsx` (replaced by inline cards in blog-page)
- `components/posts/filter.tsx`
- `components/posts/search-input.tsx`
- `components/craft.tsx`
- `components/back.tsx`
- `lib/use-gsap.ts`

Keep:
- `components/ui/` (shadcn components — still used)
- `components/seo/structured-data.tsx`
- `components/theme-provider.tsx`
- `components/template-updater.tsx` (may still be useful)
- All `lib/` utilities except `use-gsap.ts`

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: route cleanup — redirects, remove old templates, update 404

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 16: Theme Provider Update

**Files:**
- Modify: `components/theme-provider.tsx`

**Step 1: Update theme provider**

Source: `the-design/src/app/components/theme-provider.tsx`

The design's theme provider supports light/dark/system modes with localStorage persistence. Update the existing theme provider to match:
- Support `"dark" | "light" | "system"` themes
- Persist to `localStorage` key `code550-theme`
- Toggle `dark` class on `document.documentElement`
- Export `useTheme()` hook

**Step 2: Commit**

```bash
git add components/theme-provider.tsx
git commit -m "feat: update theme provider — light/dark/system mode toggle

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 17: Logo & Static Assets

**Files:**
- Add: `public/images/logo.png` (or SVG) — extract from Figma or the-design assets
- Update: Header and Footer logo references

**Step 1: Extract logo**

The design uses a Figma asset import: `figma:asset/fd7dd65c33395ca8f7c2c23875e79d5f26e1f416.png`

This file exists at: `the-design/src/assets/fd7dd65c33395ca8f7c2c23875e79d5f26e1f416.png`

Copy it to `public/images/code550-logo.png`.

**Step 2: Update components**

Update Header and Footer to use:
```tsx
import Image from "next/image";
<Image src="/images/code550-logo.png" alt="Code550" height={28} width={120} />
```

**Step 3: Remove old logo files** from `public/` if they exist.

**Step 4: Commit**

```bash
git add public/images/code550-logo.png components/layout/header.tsx components/layout/footer.tsx
git commit -m "feat: add Code550 logo, update header/footer

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 18: Verify Build & Test

**Step 1: Run build**

```bash
npm run build
```

Fix any TypeScript errors or missing imports.

**Step 2: Run existing tests**

```bash
npm run test:unit
```

Fix any broken tests due to component changes. Update test mocks for new components.

**Step 3: Manual smoke test**

```bash
npm run dev
```

Visit each page and verify:
- [ ] Homepage renders with design styling
- [ ] Navigation mega menu works
- [ ] Mobile menu works
- [ ] Theme toggle works
- [ ] Footer renders correctly
- [ ] Services page loads (may show empty if no WP data)
- [ ] Work page loads
- [ ] About page loads
- [ ] Blog page loads
- [ ] Contact page and form work
- [ ] Legal pages load
- [ ] 404 page renders
- [ ] Contact modal opens/closes

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build errors and test failures after design conversion

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 19: Vercel Environment Variables

**Step 1: Ensure Vercel has required env vars**

Required for deployment:
- `WORDPRESS_URL` — e.g., `https://wp.code550.com`
- `WORDPRESS_HOSTNAME` — e.g., `wp.code550.com`
- `WORDPRESS_AUTH_USER` — WordPress application password username
- `WORDPRESS_AUTH_PASSWORD` — WordPress application password

**Step 2: Deploy**

```bash
git push origin main
```

Vercel should auto-deploy. Verify the build succeeds.

---

## Execution Order Summary

| Task | Description | Dependencies |
|------|-------------|-------------|
| 1 | Update dependencies | None |
| 2 | Replace design system (CSS/fonts) | Task 1 |
| 3 | Update root layout | Task 2 |
| 4 | WordPress API — CPT functions | None (can parallel with 2-3) |
| 5 | Navigation (Header) | Tasks 2, 4 |
| 6 | Footer | Task 2 |
| 7 | Shared components | Task 2 |
| 8 | Homepage | Tasks 5, 6, 7 |
| 9 | Services pages | Tasks 4, 7 |
| 10 | Work/Case Studies pages | Tasks 4, 7 |
| 11 | About page | Tasks 4, 7 |
| 12 | Blog pages | Task 7 |
| 13 | Contact & Thank You pages | Task 7 |
| 14 | Legal pages | Task 7 |
| 15 | Route cleanup | Tasks 8-14 |
| 16 | Theme provider update | Task 2 |
| 17 | Logo & assets | Tasks 5, 6 |
| 18 | Verify build & test | All above |
| 19 | Deploy | Task 18 |

**Parallelizable groups:**
- Tasks 1-4 can start in parallel
- Tasks 5-7 can be parallelized after task 2
- Tasks 8-14 can be parallelized after tasks 5-7
- Tasks 15-17 can be parallelized after content pages
