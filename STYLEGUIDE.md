# STYLEGUIDE.md

## Table of Contents
1. [Brand Guidelines](#brand-guidelines)
2. [Code Formatting](#code-formatting)
3. [TypeScript Guidelines](#typescript-guidelines)
4. [Component Architecture](#component-architecture)
5. [CSS & Styling](#css--styling)
6. [File Organization](#file-organization)
7. [Naming Conventions](#naming-conventions)
8. [WordPress Integration](#wordpress-integration)
9. [Testing Standards](#testing-standards)
10. [Performance & Optimization](#performance--optimization)
11. [Accessibility](#accessibility)
12. [Git & Version Control](#git--version-control)

---

## Brand Guidelines

### Color Palette

#### Primary Colors
```typescript
// Primary Brand Color
--color-primary: #2b7fff;        // AltoFuel Blue - Primary brand color
--color-primary-hover: #1e6eef;  // Hover state for primary

// Base Colors
--color-dark: #0a0a0a;           // Deep black - Dark backgrounds
--color-light: #ffffff;          // White - Light backgrounds/text
```

#### Neutral Colors (Zinc Scale)
```typescript
// Dark Neutrals
--color-zinc-900: #18181b;       // Darkest - Dark mode backgrounds
--color-zinc-800: #27272a;       // Dark - Elevated surfaces
--color-zinc-700: #3f3f46;       // Medium dark - Borders, dividers

// Mid Neutrals
--color-zinc-600: #52525b;       // Medium - Disabled states
--color-zinc-500: #71717a;       // Medium light - Secondary text
--color-zinc-400: #a1a1aa;       // Light - Tertiary text, placeholders

// Light Neutrals
--color-zinc-300: #d4d4d8;       // Very light - Subtle borders
--color-zinc-200: #e4e4e7;       // Lighter - Light mode borders
--color-zinc-100: #f4f4f5;       // Lightest - Light mode backgrounds
--color-zinc-50: #fafafa;        // Almost white - Subtle backgrounds
```

#### Accent Colors
```typescript
// Blue Variants
--color-blue-600: #2563eb;       // Darker blue - Active states
--color-blue-500: #3b82f6;       // Standard blue - Links, accents
--color-blue-400: #60a5fa;       // Light blue - Hover states

// Slate Variants (Secondary)
--color-slate-900: #0f172a;      // Dark slate - Alternative dark bg
--color-slate-500: #64748b;      // Medium slate - Body text
--color-slate-200: #e2e8f0;      // Light slate - Subtle borders
```

#### Semantic Colors
```typescript
// Success
--color-success: #22c55e;        // Green - Success states
--color-success-bg: #dcfce7;     // Light green background

// Warning
--color-warning: #f59e0b;        // Amber - Warning states
--color-warning-bg: #fef3c7;     // Light amber background

// Error
--color-error: #ef4444;          // Red - Error states
--color-error-bg: #fee2e2;       // Light red background

// Info
--color-info: #3b82f6;           // Blue - Info states
--color-info-bg: #dbeafe;        // Light blue background
```

### Color Usage Guidelines

#### Dark Theme (Primary)
```css
/* Header & Navigation */
background: #0a0a0a;
border: #27272a (zinc-800);
text: #a1a1aa (zinc-400);
text-hover: #ffffff;

/* Body Content */
background: #18181b (zinc-900);
text: #e4e4e7 (zinc-200);
headings: #ffffff;

/* Interactive Elements */
button-primary: #2b7fff;
button-secondary: #27272a (zinc-800);
links: #3b82f6 (blue-500);
links-hover: #2b7fff (primary);
```

#### Light Theme (Secondary)
```css
/* Header & Navigation */
background: #ffffff;
border: #e4e4e7 (zinc-200);
text: #52525b (zinc-600);
text-hover: #18181b (zinc-900);

/* Body Content */
background: #fafafa (zinc-50);
text: #3f3f46 (zinc-700);
headings: #0a0a0a (dark);

/* Interactive Elements */
button-primary: #2b7fff;
button-secondary: #f4f4f5 (zinc-100);
links: #2563eb (blue-600);
links-hover: #2b7fff (primary);
```

### Typography

#### Font Families
```typescript
// Primary Font Stack (Body Text)
--font-primary: 'Fira Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

// Heading Font Stack
--font-heading: 'Saira', 'Fira Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

// Monospace Font Stack (Code)
--font-mono: 'Fira Mono', 'Courier New', Consolas, Monaco, monospace;
```

#### Font Weights
```typescript
// Fira Sans Weights
--font-weight-light: 300;        // Light text, de-emphasized content
--font-weight-regular: 400;      // Body text (default)
--font-weight-medium: 500;       // Emphasized text, buttons
--font-weight-semibold: 600;     // Subheadings, strong emphasis
--font-weight-bold: 700;         // Headings, important text

// Saira Weights (Variable Font)
--font-weight-heading-regular: 400;
--font-weight-heading-semibold: 600;
--font-weight-heading-bold: 700;

// Fira Mono Weights
--font-weight-mono-regular: 400;
--font-weight-mono-medium: 500;
--font-weight-mono-bold: 700;
```

#### Font Sizes
```typescript
// Scale (using rem units)
--font-size-xs: 0.75rem;         // 12px - Fine print, captions
--font-size-sm: 0.875rem;        // 14px - Small text, labels
--font-size-base: 1rem;          // 16px - Body text (default)
--font-size-lg: 1.125rem;        // 18px - Large body text
--font-size-xl: 1.25rem;         // 20px - Small headings
--font-size-2xl: 1.5rem;         // 24px - H4
--font-size-3xl: 1.875rem;       // 30px - H3
--font-size-4xl: 2.25rem;        // 36px - H2
--font-size-5xl: 3rem;           // 48px - H1
--font-size-6xl: 3.75rem;        // 60px - Hero text
--font-size-7xl: 4.5rem;         // 72px - Large hero text
```

#### Line Heights
```typescript
--line-height-tight: 1.2;        // Headings
--line-height-snug: 1.4;         // Large text
--line-height-normal: 1.6;       // Body text (default)
--line-height-relaxed: 1.75;     // Comfortable reading
--line-height-loose: 2;          // Airy text spacing
```

#### Letter Spacing
```typescript
--letter-spacing-tighter: -0.05em;  // Large headings
--letter-spacing-tight: -0.025em;   // Small headings
--letter-spacing-normal: 0;         // Body text (default)
--letter-spacing-wide: 0.025em;     // Emphasized text
--letter-spacing-wider: 0.05em;     // Uppercase text, labels
--letter-spacing-widest: 0.1em;     // Very spaced text
```

### Typography Usage Examples

#### Headings
```css
/* H1 - Hero/Page Title */
font-family: var(--font-heading);
font-size: var(--font-size-5xl);      /* 48px */
font-weight: var(--font-weight-bold);
line-height: var(--line-height-tight);
letter-spacing: var(--letter-spacing-tight);

/* H2 - Section Heading */
font-family: var(--font-heading);
font-size: var(--font-size-4xl);      /* 36px */
font-weight: var(--font-weight-semibold);
line-height: var(--line-height-tight);

/* H3 - Subsection Heading */
font-family: var(--font-heading);
font-size: var(--font-size-3xl);      /* 30px */
font-weight: var(--font-weight-semibold);
line-height: var(--line-height-snug);

/* H4-H6 - Smaller Headings */
font-family: var(--font-heading);
font-size: var(--font-size-xl);       /* 20px */
font-weight: var(--font-weight-medium);
line-height: var(--line-height-snug);
```

#### Body Text
```css
/* Regular Body */
font-family: var(--font-primary);
font-size: var(--font-size-base);     /* 16px */
font-weight: var(--font-weight-regular);
line-height: var(--line-height-normal);

/* Large Body */
font-family: var(--font-primary);
font-size: var(--font-size-lg);       /* 18px */
font-weight: var(--font-weight-regular);
line-height: var(--line-height-relaxed);

/* Small Text */
font-family: var(--font-primary);
font-size: var(--font-size-sm);       /* 14px */
font-weight: var(--font-weight-regular);
line-height: var(--line-height-normal);
```

#### Code/Monospace
```css
/* Inline Code */
font-family: var(--font-mono);
font-size: var(--font-size-sm);       /* 14px */
font-weight: var(--font-weight-mono-regular);
background: var(--color-zinc-100);
padding: 0.125rem 0.375rem;
border-radius: 0.25rem;

/* Code Blocks */
font-family: var(--font-mono);
font-size: var(--font-size-sm);       /* 14px */
font-weight: var(--font-weight-mono-regular);
line-height: var(--line-height-relaxed);
background: var(--color-zinc-900);
padding: 1rem;
border-radius: 0.5rem;
```

### Brand Assets Location

#### Logos
```
/public/altofuel-dark-emblem.svg      # Logo mark (dark theme)
/public/altofuel-dark-inline.svg      # Full logo (dark theme)
/public/altofuel-light-inline.svg     # Full logo (light theme)
```

#### Fonts
```
/public/fonts/fira-sans/              # Fira Sans font files (body)
/public/fonts/fira-mono/              # Fira Mono font files (code)
/public/fonts/saira/                  # Saira font files (headings)
```

---

## Code Formatting
### General Rules
- **Indentation**: 2 spaces (not tabs)
- **Line Length**: Max 100 characters
- **Quotes**: Single quotes for strings, double quotes for JSX attributes
- **Semicolons**: Always use semicolons
- **Trailing Commas**: Use in multiline objects/arrays
- **ESLint**: Run `npm run lint` before commits

### Prettier Configuration
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```

---

## TypeScript Guidelines

### Type Definitions
- **Location**: All WordPress types in `lib/wordpress.d.ts`
- **Interface vs Type**: Prefer interfaces for objects, types for unions/intersections
- **Exports**: Export types used across multiple files
- **Avoid `any`**: Use `unknown` if type is truly unknown

### Examples
```typescript
// ✅ Good
interface Post {
  id: number;
  title: string;
  slug: string;
}

// ❌ Bad
const data: any = fetchData();

// ✅ Good
const data: unknown = fetchData();
if (isPost(data)) {
  // Type guard narrows to Post
}
```

### Type Imports
```typescript
// ✅ Explicit type imports
import type { Post, Category } from '@/lib/wordpress';
```

---

## Component Architecture

### Server vs Client Components
- **Default**: Server Components
- **Use 'use client' for**:
  - Event handlers (onClick, onChange)
  - React hooks (useState, useEffect)
  - Browser APIs
  - Third-party client libraries

### Component Structure
```typescript
// 1. Type/Interface imports
import type { Post } from '@/lib/wordpress';

// 2. React/Next.js imports
import { Suspense } from 'react';
import Link from 'next/link';

// 3. Third-party imports
import { formatDate } from 'date-fns';

// 4. Local imports
import { PostCard } from '@/components/posts/post-card';

// 5. Types/Interfaces specific to component
interface PostListProps {
  posts: Post[];
  showExcerpt?: boolean;
}

// 6. Component definition
export function PostList({ posts, showExcerpt = true }: PostListProps) {
  // Component logic
}
```

### Data Fetching Pattern
```typescript
// ✅ Parallel data fetching
async function PageComponent({ params }: PageProps) {
  const [post, categories, relatedPosts] = await Promise.all([
    getPost(params.slug),
    getCategories(),
    getRelatedPosts(params.slug),
  ]);

  return <div>{/* ... */}</div>;
}
```

---

## CSS & Styling

### Tailwind CSS
- **Utility-First**: Use Tailwind utilities over custom CSS
- **Custom Classes**: Only for complex, reusable patterns
- **Class Order**: Use Prettier plugin for consistent ordering
- **Responsive**: Mobile-first (default → sm: → md: → lg: → xl:)

### Design Tokens
```typescript
// Use CSS variables from globals.css
--brand-primary: #[value];
--brand-secondary: #[value];
--text-body: [font-stack];
--text-heading: [font-stack];
```

### Component Variants
```typescript
// Use CVA (Class Variance Authority) for component variants
import { cva } from 'class-variance-authority';

const buttonVariants = cva('base-classes', {
  variants: {
    variant: {
      default: '...',
      outline: '...',
    },
    size: {
      sm: '...',
      md: '...',
      lg: '...',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});
```

### Typography
- **Headings**: Use Saira variable font
- **Body**: Use Fira Sans
- **Code/Mono**: Use Fira Mono
- **Scale**: Follow design system hierarchy

---

## File Organization

### Directory Structure
```
app/
├── [slug]/              # Dynamic page routes
├── posts/               # Blog-related pages
│   ├── [slug]/         # Single post
│   ├── authors/        # Author archive
│   ├── categories/     # Category archive
│   └── tags/           # Tag archive
├── api/                # API routes
└── layout.tsx          # Root layout

components/
├── ui/                 # shadcn/ui components
├── layout/             # Layout components (Header, Footer)
├── posts/              # Post-related components
├── nav/                # Navigation components
└── seo/                # SEO components

lib/
├── wordpress.ts        # WordPress API functions
├── wordpress.d.ts      # WordPress type definitions
└── utils.ts            # Utility functions

tests/
├── unit/              # Component & utility tests
├── integration/       # API & feature tests
├── e2e/              # Playwright tests
└── mocks/            # MSW handlers
```

### File Naming
- **Components**: `kebab-case.tsx` (e.g., `post-card.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `formatDate.ts`)
- **Types**: `PascalCase.d.ts` (e.g., `WordPress.d.ts`)
- **Tests**: `*.test.tsx` or `*.spec.ts`

---

## Naming Conventions

### Variables & Functions
```typescript
// ✅ camelCase for variables and functions
const postCount = 10;
function fetchPosts() {}

// ✅ PascalCase for React components
function PostCard() {}

// ✅ UPPERCASE for constants
const API_TIMEOUT = 5000;
const POSTS_PER_PAGE = 9;
```

### Boolean Variables
```typescript
// ✅ Use is/has/can prefix
const isLoading = true;
const hasError = false;
const canEdit = checkPermissions();
```

### Event Handlers
```typescript
// ✅ Use handle prefix for handlers
function handleClick() {}
function handleSubmit() {}
function handleChange() {}
```

---

## WordPress Integration

### API Functions
```typescript
// All in lib/wordpress.ts
// Must include cache tags for revalidation
export async function getPost(slug: string): Promise<Post> {
  const res = await fetch(`${WP_URL}/posts?slug=${slug}`, {
    next: {
      revalidate: 3600,
      tags: ['posts', `post-${slug}`]
    }
  });

  if (!res.ok) {
    throw new WordPressAPIError(`Failed to fetch post: ${slug}`, res.status);
  }

  return res.json();
}
```

### Cache Strategy
- **Default TTL**: 1 hour (`revalidate: 3600`)
- **Tags**: Use granular tags (`'posts'`, `'post-${slug}'`, `'category-${id}'`)
- **ISR**: Leverage Incremental Static Regeneration
- **Webhook**: WordPress triggers revalidation on content changes

### Error Handling
```typescript
// Use custom WordPressAPIError
try {
  const post = await getPost(slug);
} catch (error) {
  if (error instanceof WordPressAPIError) {
    // Handle WordPress-specific errors
  }
  throw error;
}
```

---

## Testing Standards

### Unit Tests (Vitest)
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('PostCard', () => {
  it('renders post title and excerpt', () => {
    const post = { title: 'Test', excerpt: 'Test excerpt' };
    render(<PostCard post={post} />);

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Test excerpt')).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)
```typescript
import { test, expect } from '@playwright/test';

test('displays posts on homepage', async ({ page }) => {
  await page.goto('/');

  const posts = page.locator('[data-testid="post-card"]');
  await expect(posts).toHaveCount(9); // Default per page
});
```

### Testing Checklist
- [ ] Write tests before implementation (TDD)
- [ ] Unit tests for utilities and components
- [ ] Integration tests for API interactions
- [ ] E2E tests for critical user flows
- [ ] Accessibility tests included
- [ ] >80% coverage on critical paths

---

## Performance & Optimization

### Images
- Use Next.js `<Image>` component
- Specify width/height for layout stability
- Use `priority` for above-the-fold images
- WordPress images served through Next.js image optimization

### Loading States
```typescript
// Use Suspense for async boundaries
<Suspense fallback={<PostCardSkeleton />}>
  <PostList />
</Suspense>
```

### Bundle Size
- Dynamic imports for large components
- Tree-shake unused exports
- Monitor bundle with `npm run build`

---

## Accessibility

### Requirements
- **WCAG 2.1 Level AA** compliance
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Color contrast ratios

### Testing
- Run axe-core in E2E tests
- Manual keyboard testing
- Screen reader testing (VoiceOver/NVDA)

### Examples
```typescript
// ✅ Semantic HTML
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// ✅ ARIA labels
<button aria-label="Close menu" onClick={handleClose}>
  <X />
</button>
```

---

## Git & Version Control

### Commit Messages
```
type(scope): subject

body (optional)

footer (optional)
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Examples**:
```
feat(posts): add pagination to post archive
fix(api): handle 404 errors in WordPress API
docs(readme): update setup instructions
```

### Branch Naming
- `feature/short-description`
- `fix/bug-description`
- `refactor/what-was-refactored`

### Pull Request Checklist
- [ ] Tests pass (`npm run test:all`)
- [ ] Lint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors/warnings
- [ ] Types are correct
- [ ] Accessibility checked
- [ ] Responsive on mobile/tablet/desktop
