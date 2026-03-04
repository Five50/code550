# Graceful Degradation

The site must work with or without any optional WordPress plugin (WPML, RankMath, etc.).

## Pattern

Wrap optional plugin API calls in try/catch, return empty defaults:

```ts
export async function getAvailableLanguages(): Promise<Language[]> {
  try {
    return wordpressFetch<Language[]>("/wp-json/wpml/v1/languages");
  } catch (error) {
    console.warn("WPML not available:", error);
    return [];
  }
}
```

## Rules

- Optional features: try/catch + `console.warn` + return empty default
- Core features (posts, pages): let errors propagate via `WordPressAPIError`
- Default return values: `[]` for arrays, `null` for single objects, `""` for strings
- Never let an optional plugin failure crash the page
