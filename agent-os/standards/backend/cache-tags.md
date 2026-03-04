# Cache Tag Strategy

All WordPress fetches use Next.js cache tags for granular revalidation.

## Rules

- Every fetch must include the `wordpress` base tag
- Add resource-specific tags: `posts`, `categories`, `tags`, `authors`
- Add filter-specific tags: `posts-category-${id}`, `posts-tag-${id}`, `posts-author-${id}`
- Add page-specific tags for paginated queries: `posts-page-${page}`
- Language-scoped fetches add `lang-${code}` tag
- Default revalidation: `3600` (1 hour)

## Tag naming convention

`{resource}` or `{resource}-{filter}-{value}`

## Webhook revalidation

The `/api/revalidate` endpoint invalidates tags by content type. When adding new tags, ensure the webhook handler also revalidates them.
