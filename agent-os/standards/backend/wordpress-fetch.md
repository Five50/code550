# Centralized WordPress Fetch

All WordPress API calls must go through `wordpressFetch()` or `wordpressFetchWithPagination()` in `lib/wordpress.ts`.

**Never call `fetch()` directly** for WordPress endpoints.

## What the centralized functions provide

- URL normalization (no double slashes)
- `User-Agent` header
- Next.js cache tags + 1-hour revalidation
- Optional Basic Auth via env vars
- Optional WPML language parameter
- Consistent error handling via `WordPressAPIError`

## Usage

```ts
// Simple fetch
const posts = await wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { per_page: 10 });

// With pagination headers
const response = await wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", { page: 1 });
// response.data, response.headers.total, response.headers.totalPages

// With language
const posts = await wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {}, "es");

// With auth
const settings = await wordpressFetch<any>("/wp-json/wp/v2/settings", {}, undefined, true);
```

## Error handling

All errors throw `WordPressAPIError` with `status` and `endpoint` properties. Callers use `try/catch`.
