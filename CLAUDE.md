# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `npm run dev` - Start development server with turbo mode
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Testing Commands (TDD Setup)
- `npm run test` - Run unit tests with Vitest
- `npm run test:watch` - Run unit tests in watch mode
- `npm run test:ui` - Run unit tests with Vitest UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:unit` - Run only unit tests
- `npm run test:integration` - Run only integration tests
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run test:e2e:ui` - Run e2e tests with Playwright UI
- `npm run test:e2e:headed` - Run e2e tests in headed mode
- `npm run test:e2e:debug` - Debug e2e tests
- `npm run test:all` - Run all tests (unit + integration + e2e)

## Architecture Overview

This is a headless WordPress starter using Next.js 15 App Router with TypeScript. Key architectural patterns:

### Data Layer
- All WordPress API interactions go through `lib/wordpress.ts`
- Type definitions in `lib/wordpress.d.ts` define Post, Page, Category, Tag, Author, Media interfaces
- Error handling uses custom `WordPressAPIError` class
- Functions use Next.js cache tags for granular revalidation (e.g., `tags: ['posts', `post-${slug}`]`)

### Routing Structure
- Dynamic routes: `/posts/[slug]`, `/pages/[slug]`
- Archive pages: `/posts`, `/posts/authors`, `/posts/categories`, `/posts/tags`
- API routes: `/api/revalidate` (webhook), `/api/og` (OG images)

### Component Patterns
- Server Components for data fetching with parallel `Promise.all()` calls
- URL-based state management for search and filters
- Debounced search (300ms) with `useSearchParams`
- Pagination with 9 posts per page default

### Revalidation System
- WordPress plugin sends webhooks on content changes
- Next.js endpoint validates webhook secret and calls `revalidateTag()`
- Default cache duration: 1 hour (`revalidate: 3600`)

## Code Style

### TypeScript
- Use strict typing with interfaces defined in `lib/wordpress.d.ts`
- Prefer type annotations over type assertions
- Use type inference when the type is obvious

### Naming Conventions
- React components: PascalCase (e.g., `PostCard.tsx`)
- Functions and variables: camelCase
- Types and interfaces: PascalCase
- Constants: UPPERCASE_SNAKE_CASE for true constants

### File Structure
- Page components: `/app/**/*.tsx`
- Reusable UI components: `/components/**/*.tsx`  
- API and utility functions: `/lib/**/*.ts`
- WordPress data functions must use cache tags for proper revalidation

### Error Handling
- Use `try/catch` blocks for API calls
- Utilize `WordPressAPIError` class for consistent API error handling

## Environment Variables
Required environment variables (see `.env.example`):
- `WORDPRESS_URL` - Full URL of WordPress site
- `WORDPRESS_HOSTNAME` - Domain for image optimization
- `WORDPRESS_WEBHOOK_SECRET` - Secret for webhook validation

## Key Dependencies
- Next.js 15.3.3 with React 19.1.0
- TypeScript with strict mode
- Tailwind CSS 4.1 with shadcn/ui components
- React Hook Form for form handling
- Lucide React for icons

## Testing Stack
- **Unit/Integration Tests**: Vitest + React Testing Library + Jest-DOM
- **E2E Tests**: Playwright with accessibility testing via axe-core
- **API Mocking**: MSW (Mock Service Worker)
- **Coverage**: Built-in Vitest coverage reporting
- **Test Structure**:
  - `/tests/unit/` - Component and utility unit tests
  - `/tests/integration/` - API and feature integration tests
  - `/tests/e2e/` - End-to-end browser tests
  - `/tests/mocks/` - MSW handlers for API mocking
  - `/tests/setup.ts` - Global test configuration

## TDD Guidelines
1. **Write tests first** before implementing features
2. **Test structure**: Unit → Integration → E2E
3. **Naming**: Use descriptive test names that explain behavior
4. **Mocking**: Use MSW for API calls, avoid mocking React components
5. **Accessibility**: Include a11y tests in e2e specs
6. **Coverage**: Aim for >80% coverage on critical paths
7. **CI Integration**: All tests must pass before merging