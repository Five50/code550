# AltoFuel Marketing Website - Product Roadmap

1. [ ] Multi-Language Routing Infrastructure — Implement URL-based language detection with `/[lang]/` routing pattern, language switcher component, and locale persistence. Support English, Spanish, French, and German initially with extensible architecture for additional languages. `M`

2. [ ] WordPress Gutenberg Block Renderer — Build complete Gutenberg block parsing and rendering system that converts WordPress block JSON into Next.js components while preserving styles, classes, and nested structures. Support core blocks (paragraph, heading, image, list, quote, columns). `L`

3. [ ] Localized Content Management — Extend WordPress REST API integration to fetch and serve language-specific content based on URL locale. Implement per-language cache tags for granular revalidation and support for translated metadata (titles, descriptions, slugs). `M`

4. [ ] Core Marketing Pages — Create essential marketing pages including Homepage, Features, Pricing, Use Cases, About, and Contact using WordPress-managed content. Each page should be fully localized and optimized for conversions with strategic CTAs. `L`

5. [ ] Advanced Gutenberg Blocks — Add support for custom Gutenberg blocks including Feature Grid, Testimonial Carousel, Pricing Tables, Stats Counter, CTA Sections, and Video Embed. Ensure all blocks render correctly with responsive design. `L`

6. [ ] SEO Optimization Suite — Implement comprehensive SEO including dynamic sitemap generation (per language), robots.txt, structured data (Organization, Product, BreadcrumbList), canonical URLs, hreflang tags, and Open Graph image generation with language support. `M`

7. [ ] Lead Capture System — Build contact forms, trial sign-up flows, and newsletter subscription components with validation, spam protection, and integration to marketing automation (e.g., HubSpot/Mailchimp). Track form submissions and conversions. `M`

8. [ ] Analytics & Tracking Integration — Integrate Google Analytics 4, Google Tag Manager, and conversion tracking. Implement cookie consent management for GDPR compliance and event tracking for key user interactions (CTA clicks, form submissions, language switches). `S`

9. [ ] Performance Optimization — Optimize Core Web Vitals through image lazy loading, font optimization, code splitting, and bundle size reduction. Implement advanced caching strategies and CDN integration. Target 90+ Lighthouse scores across all pages. `M`

10. [ ] A/B Testing Framework — Build infrastructure for running A/B tests on headlines, CTAs, and page layouts using feature flags or third-party tools (e.g., Optimizely). Enable marketing team to run experiments without developer involvement. `M`

11. [ ] Blog & Content Marketing — Create blog system with category/tag filtering, author pages, related posts, and search functionality. Support multi-language blog posts with translated categories and tags. Optimize for content marketing and thought leadership. `L`

12. [ ] Advanced Search & Filtering — Implement site-wide search with language-aware results, instant search suggestions, and filters for content types (pages, posts, resources). Consider Algolia or similar for enhanced search experience. `M`

> Notes
> - Roadmap prioritizes delivering core marketing functionality (items 1-4) first to establish MVP
> - Items 1-3 form the technical foundation for multi-language Gutenberg rendering
> - Items 4-5 deliver essential marketing content and rich page building capabilities
> - Items 6-8 focus on conversion optimization and measurement
> - Items 9-12 enhance performance, experimentation, and content depth
> - Each item represents end-to-end functionality (frontend + backend + testing)
> - Order follows technical dependencies: routing → rendering → content → pages → optimization
