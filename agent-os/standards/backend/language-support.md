# Language Support (WPML)

All data-fetching functions must accept an optional `language?: string` parameter.

```ts
export async function getPostBySlug(slug: string, language?: string): Promise<Post> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { slug }, language)
    .then(posts => posts[0]);
}
```

- Pass `language` as the 3rd argument to `wordpressFetch` -- it adds `?lang=` automatically
- Even if content isn't translated yet, include the parameter for forward compatibility
- Language codes follow WPML format: `en`, `es`, etc.
- Language is extracted from the URL path via `lib/i18n.ts` helpers
