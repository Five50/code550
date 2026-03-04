# Slug-Based Lookups

The WordPress REST API has no direct get-by-slug endpoint. Use the collection endpoint with a slug filter.

```ts
// Correct: filter collection, take first result
export async function getPostBySlug(slug: string): Promise<Post> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { slug })
    .then(posts => posts[0]);
}
```

- Always use `.then(items => items[0])` for single-resource-by-slug lookups
- By-ID lookups use the direct endpoint: `/wp-json/wp/v2/posts/${id}`
- Applies to: posts, pages, categories, tags, authors
