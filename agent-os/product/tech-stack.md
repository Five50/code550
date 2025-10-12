# AltoFuel Marketing Website - Tech Stack

## Frontend Framework
- **Next.js 15.3.3**: React metaframework providing App Router, Server Components, Server Actions, and built-in performance optimizations
- **React 19.1.0**: UI library with latest concurrent features and improved hydration
- **TypeScript**: Strict mode enabled for type safety across components, API interactions, and data models

## Content Management System
- **WordPress (Headless)**: CMS hosted at `https://digest.altofuel.com` serving content via REST API
- **WordPress REST API**: Provides endpoints for pages, posts, media, categories, tags, authors, and custom post types
- **Gutenberg Block Editor**: Visual content editor enabling marketing team to create rich, structured content using blocks

## Styling & Design System
- **Tailwind CSS 4.1**: Utility-first CSS framework with custom configuration for brand colors, typography, and spacing
- **shadcn/ui Components**: Accessible, customizable React component library built on Radix UI primitives
- **Lucide React**: Icon library providing consistent iconography across the site
- **CSS Modules**: Component-scoped styles for custom components not covered by Tailwind utilities

## Internationalization (i18n)
- **Next.js Internationalized Routing**: Built-in i18n support via `[lang]` dynamic routes with middleware-based locale detection
- **URL-Based Language Switching**: Clean URL structure (`/en/features`, `/es/features`) with automatic locale persistence
- **WordPress Multisite or WPML**: WordPress plugin for managing translations and language-specific content
- **Accept-Language Header Detection**: Automatic locale detection based on browser preferences with manual override capability

## Data Layer & API Integration
- **Custom WordPress API Client** (`lib/wordpress.ts`): Type-safe API wrapper handling all WordPress REST API requests
- **TypeScript Interfaces** (`lib/wordpress.d.ts`): Strongly-typed models for Post, Page, Category, Tag, Author, Media, and Block data
- **WordPressAPIError Class**: Custom error handling for API failures with detailed error messages and status codes
- **Parallel Data Fetching**: `Promise.all()` pattern for fetching multiple API resources concurrently

## Caching & Revalidation
- **Next.js Cache Tags**: Granular cache invalidation using tags like `posts`, `post-${slug}`, `page-${slug}`, `category-${slug}`
- **Webhook-Based Revalidation**: WordPress plugin sends POST requests to `/api/revalidate` on content changes
- **Revalidation API Route**: Validates webhook secret and calls `revalidateTag()` for surgical cache updates
- **Default Cache Duration**: 1 hour (`revalidate: 3600`) for WordPress content with on-demand revalidation
- **ISR (Incremental Static Regeneration)**: Automatic background regeneration of pages after cache expiry

## Gutenberg Block Rendering
- **Block Parser**: Custom parser to convert WordPress block JSON/HTML into structured data
- **Block Component Mapper**: Maps WordPress block types (core/paragraph, core/heading, etc.) to React components
- **Style Preservation**: Maintains WordPress block classes, inline styles, and custom attributes during rendering
- **Nested Block Support**: Recursive rendering for nested blocks (columns, groups, cover blocks)
- **Custom Block Extensions**: Framework for adding custom AltoFuel-specific Gutenberg blocks

## SEO & Metadata
- **Next.js Metadata API**: Dynamic generation of meta tags, Open Graph images, and Twitter cards per page
- **Dynamic Sitemap** (`/sitemap.ts`): Auto-generated XML sitemap with multi-language support and lastmod timestamps
- **robots.txt**: Configured for search engine crawling with language-specific rules
- **Structured Data**: JSON-LD schema markup for Organization, Product, and BreadcrumbList
- **hreflang Tags**: Proper language and region targeting for multi-language SEO
- **Canonical URLs**: Prevent duplicate content issues across language versions

## Forms & Lead Capture
- **React Hook Form**: Declarative form handling with built-in validation and error management
- **Zod**: Runtime schema validation for form inputs and API data
- **Server Actions**: Next.js server-side form submission handling for secure data processing
- **CAPTCHA Protection**: Google reCAPTCHA v3 or hCaptcha for spam prevention on contact forms
- **Marketing Automation API**: Integration with HubSpot, Mailchimp, or similar for lead nurturing

## Analytics & Tracking
- **Google Analytics 4**: Event-based analytics tracking user journeys, conversions, and engagement
- **Google Tag Manager**: Tag management system for deploying tracking pixels without code changes
- **Conversion Tracking**: Custom events for trial sign-ups, contact form submissions, and CTA clicks
- **Cookie Consent Management**: GDPR/CCPA compliant cookie banner with preference management
- **Performance Monitoring**: Real User Monitoring (RUM) via Vercel Analytics or similar

## Testing Infrastructure
- **Vitest**: Fast unit testing framework for components, utilities, and API functions
- **React Testing Library**: User-centric testing for React components with accessibility focus
- **Jest-DOM**: Custom matchers for asserting on DOM nodes
- **Playwright**: End-to-end browser testing across Chrome, Firefox, and Safari
- **axe-core**: Automated accessibility testing integrated into e2e tests
- **MSW (Mock Service Worker)**: API mocking for unit and integration tests without modifying code
- **Coverage Reporting**: Built-in Vitest coverage with 80%+ target for critical paths

## Testing Structure
- `/tests/unit/`: Component and utility unit tests
- `/tests/integration/`: API client and feature integration tests
- `/tests/e2e/`: Browser-based end-to-end tests
- `/tests/mocks/`: MSW handlers for mocking WordPress REST API
- `/tests/setup.ts`: Global test configuration and environment setup

## Performance Optimization
- **Image Optimization**: Next.js automatic image optimization with WebP/AVIF conversion
- **Font Optimization**: Self-hosted fonts (Fira Sans, Fira Mono, Saira) with preload and font-display swap
- **Code Splitting**: Automatic route-based and dynamic import-based code splitting
- **Bundle Analysis**: Regular bundle size monitoring to prevent bloat
- **Server Components**: Maximize use of React Server Components to reduce client-side JavaScript
- **Streaming SSR**: Progressive HTML streaming for faster Time to First Byte (TTFB)

## Development Tools
- **ESLint**: Code linting with Next.js, React, TypeScript, and accessibility rules
- **Prettier**: Code formatting with consistent style across team
- **TypeScript Strict Mode**: Maximum type safety with strict compiler options
- **Git Hooks**: Pre-commit hooks for linting and formatting validation
- **Environment Variables**: `.env.local` for secrets with `.env.example` for documentation

## Deployment & Hosting
- **Vercel** (Recommended): Zero-config deployment with automatic previews, edge caching, and analytics
- **Alternative: Netlify or AWS Amplify**: Support for Next.js SSR with custom configuration
- **CDN**: Global edge network for static assets and cached pages
- **Environment Management**: Separate environments for development, staging, and production
- **Preview Deployments**: Automatic preview URLs for every git branch/PR

## Monitoring & Error Tracking
- **Sentry**: Real-time error tracking and performance monitoring for production issues
- **Uptime Monitoring**: Pingdom, UptimeRobot, or similar for availability alerts
- **Logging**: Structured logging with Winston or Pino for debugging and audit trails
- **Performance Budget**: Lighthouse CI to enforce performance thresholds in CI/CD pipeline

## Security
- **HTTPS Only**: Enforce secure connections across all pages
- **Content Security Policy**: CSP headers to prevent XSS attacks
- **Webhook Secret Validation**: Secure webhook endpoints with HMAC signature verification
- **Environment Variable Encryption**: Never commit secrets to repository
- **Dependency Scanning**: Automated vulnerability scanning with Dependabot or Snyk
- **Rate Limiting**: API route protection against abuse and DDoS attempts

## Build & CI/CD
- **npm**: Package manager with lock file for reproducible builds
- **Turbo Mode**: Next.js turbo mode for faster development builds
- **GitHub Actions** (Recommended): Automated testing, linting, and deployment on push/PR
- **Build Cache**: Leverage Next.js build cache for faster subsequent builds
- **Automated Testing Pipeline**: Run unit, integration, and e2e tests before deployment

## API Integrations (Future)
- **CRM Integration**: Salesforce, HubSpot, or Pipedrive for lead management
- **Email Service**: SendGrid, Postmark, or AWS SES for transactional emails
- **Marketing Automation**: Mailchimp, ActiveCampaign, or similar for email campaigns
- **Live Chat**: Intercom, Drift, or Zendesk Chat for real-time support
- **A/B Testing Platform**: Optimizely, VWO, or LaunchDarkly for experimentation
