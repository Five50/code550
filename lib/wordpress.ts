// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wp.d.ts`

import querystring from "query-string";
import type {
  Post,
  Category,
  Tag,
  Page,
  Author,
  FeaturedMedia,
  Language,
  RankMathSEO,
  Menu,
  MenuItem,
  MenuLocation,
  WordPressTemplate,
} from "./wordpress.d";

const baseUrl = process.env.WORDPRESS_URL;

if (!baseUrl) {
  throw new Error("WORDPRESS_URL environment variable is not defined");
}

class WordPressAPIError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

// New types for pagination support
export interface WordPressPaginationHeaders {
  total: number;
  totalPages: number;
}

export interface WordPressResponse<T> {
  data: T;
  headers: WordPressPaginationHeaders;
}

// Keep original function for backward compatibility
async function wordpressFetch<T>(
  path: string,
  query?: Record<string, any>,
  language?: string,
  requiresAuth: boolean = false
): Promise<T> {
  // Add language parameter for WPML support
  if (language && query) {
    query.lang = language;
  } else if (language) {
    query = { lang: language };
  }

  // Normalize URL to avoid double slashes
  const normalizedBaseUrl = baseUrl?.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${normalizedBaseUrl}${normalizedPath}${
    query ? `?${querystring.stringify(query)}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  const headers: HeadersInit = {
    "User-Agent": userAgent,
  };

  // Add authentication for protected endpoints
  if (requiresAuth && process.env.WORDPRESS_AUTH_USER && process.env.WORDPRESS_AUTH_PASSWORD) {
    const credentials = Buffer.from(
      `${process.env.WORDPRESS_AUTH_USER}:${process.env.WORDPRESS_AUTH_PASSWORD}`
    ).toString('base64');
    headers.Authorization = `Basic ${credentials}`;
  }

  const response = await fetch(url, {
    headers,
    next: {
      tags: language ? ["wordpress", `lang-${language}`] : ["wordpress"],
      revalidate: 3600, // 1 hour cache
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}

// New function for paginated requests
async function wordpressFetchWithPagination<T>(
  path: string,
  query?: Record<string, any>
): Promise<WordPressResponse<T>> {
  // Normalize URL to avoid double slashes
  const normalizedBaseUrl = baseUrl?.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${normalizedBaseUrl}${normalizedPath}${
    query ? `?${querystring.stringify(query)}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
    next: {
      tags: ["wordpress"],
      revalidate: 3600, // 1 hour cache
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  const data = await response.json();

  return {
    data,
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

// New function for paginated posts
export async function getPostsPaginated(
  page: number = 1,
  perPage: number = 9,
  filterParams?: {
    author?: string;
    tag?: string;
    category?: string;
    search?: string;
  }
): Promise<WordPressResponse<Post[]>> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: perPage,
    page,
  };

  // Build cache tags based on filters
  const cacheTags = ["wordpress", "posts"];

  if (filterParams?.search) {
    query.search = filterParams.search;
    cacheTags.push("posts-search");
  }
  if (filterParams?.author) {
    query.author = filterParams.author;
    cacheTags.push(`posts-author-${filterParams.author}`);
  }
  if (filterParams?.tag) {
    query.tags = filterParams.tag;
    cacheTags.push(`posts-tag-${filterParams.tag}`);
  }
  if (filterParams?.category) {
    query.categories = filterParams.category;
    cacheTags.push(`posts-category-${filterParams.category}`);
  }

  // Add page-specific cache tag for granular invalidation
  cacheTags.push(`posts-page-${page}`);

  // Normalize URL to avoid double slashes
  const normalizedBaseUrl = baseUrl?.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const url = `${normalizedBaseUrl}/wp-json/wp/v2/posts${
    query ? `?${querystring.stringify(query)}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
    next: {
      tags: cacheTags,
      revalidate: 3600, // 1 hour cache
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  const data = await response.json();

  return {
    data,
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

export async function getAllPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<Post[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
  };

  if (filterParams?.search) {
    query.search = filterParams.search;

    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  } else {
    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  }

  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", query);
}

export async function getPostById(id: number): Promise<Post> {
  return wordpressFetch<Post>(`/wp-json/wp/v2/posts/${id}`);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { slug }).then(
    (posts) => posts[0]
  );
}

export async function getAllCategories(): Promise<Category[]> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories");
}

export async function getCategoryById(id: number): Promise<Category> {
  return wordpressFetch<Category>(`/wp-json/wp/v2/categories/${id}`);
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories", { slug }).then(
    (categories) => categories[0]
  );
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    categories: categoryId,
  });
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { tags: tagId });
}

export async function getTagsByPost(postId: number): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", { post: postId });
}

export async function getAllTags(): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags");
}

export async function getTagById(id: number): Promise<Tag> {
  return wordpressFetch<Tag>(`/wp-json/wp/v2/tags/${id}`);
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", { slug }).then(
    (tags) => tags[0]
  );
}

export async function getAllPages(): Promise<Page[]> {
  return wordpressFetch<Page[]>("/wp-json/wp/v2/pages");
}

export async function getPageById(id: number): Promise<Page> {
  return wordpressFetch<Page>(`/wp-json/wp/v2/pages/${id}`);
}

export async function getPageBySlug(slug: string): Promise<Page> {
  return wordpressFetch<Page[]>("/wp-json/wp/v2/pages", { slug }).then(
    (pages) => pages[0]
  );
}

export async function getAllAuthors(): Promise<Author[]> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users");
}

export async function getAuthorById(id: number): Promise<Author> {
  return wordpressFetch<Author>(`/wp-json/wp/v2/users/${id}`);
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users", { slug }).then(
    (users) => users[0]
  );
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { author: authorId });
}

export async function getPostsByAuthorSlug(
  authorSlug: string
): Promise<Post[]> {
  const author = await getAuthorBySlug(authorSlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { author: author.id });
}

export async function getPostsByCategorySlug(
  categorySlug: string
): Promise<Post[]> {
  const category = await getCategoryBySlug(categorySlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    categories: category.id,
  });
}

export async function getPostsByTagSlug(tagSlug: string): Promise<Post[]> {
  const tag = await getTagBySlug(tagSlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { tags: tag.id });
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia> {
  return wordpressFetch<FeaturedMedia>(`/wp-json/wp/v2/media/${id}`);
}

export async function searchCategories(query: string): Promise<Category[]> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories", {
    search: query,
    per_page: 100,
  });
}

export async function searchTags(query: string): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", {
    search: query,
    per_page: 100,
  });
}

export async function searchAuthors(query: string): Promise<Author[]> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users", {
    search: query,
    per_page: 100,
  });
}

// Function specifically for generateStaticParams - fetches ALL posts
export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  const allSlugs: { slug: string }[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await wordpressFetchWithPagination<Post[]>(
      "/wp-json/wp/v2/posts",
      {
        per_page: 100,
        page,
        _fields: "slug", // Only fetch slug field for performance
      }
    );

    const posts = response.data;
    allSlugs.push(...posts.map((post) => ({ slug: post.slug })));

    hasMore = page < response.headers.totalPages;
    page++;
  }

  return allSlugs;
}

// Enhanced pagination functions for specific queries
export async function getPostsByCategoryPaginated(
  categoryId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    categories: categoryId,
  };

  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);
}

export async function getPostsByTagPaginated(
  tagId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    tags: tagId,
  };

  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);
}

export async function getPostsByAuthorPaginated(
  authorId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    author: authorId,
  };

  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);
}

// WordPress Settings Functions
export async function getWordPressSettings(): Promise<{
  page_on_front: number;
  page_for_posts: number;
  blogname: string;
  blogdescription: string;
}> {
  try {
    // Try to fetch authenticated settings first
    if (process.env.WORDPRESS_AUTH_USER && process.env.WORDPRESS_AUTH_PASSWORD) {
      try {
        const settings = await wordpressFetch<any>("/wp-json/wp/v2/settings", {}, undefined, true);
        return {
          page_on_front: settings.page_on_front || 0,
          page_for_posts: settings.page_for_posts || 0,
          blogname: settings.title || "",
          blogdescription: settings.description || "",
        };
      } catch (authError) {
        console.warn("Authenticated settings request failed, falling back to public data:", authError);
      }
    }

    // Fallback to public site info endpoint
    const siteInfo = await wordpressFetch<any>("/wp-json/");
    return {
      page_on_front: siteInfo.page_on_front || 0,
      page_for_posts: siteInfo.page_for_posts || 0,
      blogname: siteInfo.name || "",
      blogdescription: siteInfo.description || "",
    };
  } catch (error) {
    console.warn("WordPress site info not available:", error);
    return {
      page_on_front: 0,
      page_for_posts: 0,
      blogname: "",
      blogdescription: "",
    };
  }
}

export async function getFrontPageContent(language?: string): Promise<{
  type: 'page' | 'posts';
  content?: any;
  settings: any;
}> {
  const settings = await getWordPressSettings();

  if (settings.page_on_front > 0) {
    // Static front page from WordPress settings
    try {
      // Try with edit context first (includes template field, requires auth)
      let page;
      try {
        page = await wordpressFetch<any>(`/wp-json/wp/v2/pages/${settings.page_on_front}`, { context: 'edit' }, language, true);
      } catch (authError) {
        // Fallback to view context (public, but might not include template)
        console.warn("Edit context failed, trying view context:", authError);
        page = await wordpressFetch<any>(`/wp-json/wp/v2/pages/${settings.page_on_front}`, {}, language);
      }

      return {
        type: 'page',
        content: page,
        settings,
      };
    } catch (error) {
      console.warn("Front page not found, falling back to posts:", error);
    }
  }

  // Latest posts (blog) front page
  return {
    type: 'posts',
    settings,
  };
}

export async function getBlogPageContent(language?: string): Promise<{
  page?: any;
  settings: any;
}> {
  const settings = await getWordPressSettings();

  if (settings.page_for_posts > 0) {
    try {
      const page = await wordpressFetch<any>(`/wp-json/wp/v2/pages/${settings.page_for_posts}`, {}, language);
      return {
        page,
        settings,
      };
    } catch (error) {
      console.warn("Blog page not found:", error);
    }
  }

  return { settings };
}

// WPML Language Functions
export async function getAvailableLanguages(): Promise<Language[]> {
  try {
    return wordpressFetch<Language[]>("/wp-json/wpml/v1/languages");
  } catch (error) {
    console.warn("WPML not available or not configured properly:", error);
    return [];
  }
}

export async function getCurrentLanguage(): Promise<string> {
  try {
    const response = await wordpressFetch<{ current_language: string }>(
      "/wp-json/wpml/v1/current-language"
    );
    return response.current_language;
  } catch (error) {
    console.warn("WPML not available, defaulting to English:", error);
    return "en";
  }
}

// Enhanced functions with language support
export async function getPostBySlugWithLanguage(
  slug: string,
  language?: string
): Promise<Post> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { slug }, language).then(
    (posts) => posts[0]
  );
}

export async function getPageBySlugWithLanguage(
  slug: string,
  language?: string
): Promise<Page> {
  return wordpressFetch<Page[]>("/wp-json/wp/v2/pages", { slug }, language).then(
    (pages) => pages[0]
  );
}

export async function getAllPostsWithLanguage(
  language?: string,
  filterParams?: {
    author?: string;
    tag?: string;
    category?: string;
    search?: string;
  }
): Promise<Post[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
  };

  if (filterParams?.search) {
    query.search = filterParams.search;
    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  } else {
    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  }

  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", query, language);
}

export async function getAllCategoriesWithLanguage(
  language?: string
): Promise<Category[]> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories", {}, language);
}

export async function getAllTagsWithLanguage(language?: string): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", {}, language);
}

// RankMath SEO Functions
export async function getRankMathSEO(url: string): Promise<RankMathSEO | null> {
  try {
    const response = await wordpressFetch<{ head: string }>(
      "/wp-json/rankmath/v1/getHead",
      { url },
      undefined,
      true
    );

    // Parse the head content to extract SEO data
    return parseRankMathHead(response.head);
  } catch (error) {
    console.warn("RankMath SEO data not available:", error);
    return null;
  }
}

export async function getPostWithSEO(slug: string, language?: string): Promise<Post & { seo?: RankMathSEO }> {
  const post = await getPostBySlugWithLanguage(slug, language);
  const seo = await getRankMathSEO(post.link);

  return {
    ...post,
    seo: seo || undefined,
  };
}

export async function getPageWithSEO(slug: string, language?: string): Promise<Page & { seo?: RankMathSEO }> {
  const page = await getPageBySlugWithLanguage(slug, language);
  const seo = await getRankMathSEO(page.link);

  return {
    ...page,
    seo: seo || undefined,
  };
}

// Helper function to parse RankMath head content
function parseRankMathHead(headContent: string): RankMathSEO {
  const seoData: RankMathSEO = {};

  // Parse title
  const titleMatch = headContent.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch) {
    seoData.title = titleMatch[1];
  }

  // Parse meta description
  const descMatch = headContent.match(/<meta[^>]*name=['""]description['""][^>]*content=['""]([^'"]*)['""][^>]*>/i);
  if (descMatch) {
    seoData.description = descMatch[1];
  }

  // Parse canonical URL
  const canonicalMatch = headContent.match(/<link[^>]*rel=['""]canonical['""][^>]*href=['""]([^'"]*)['""][^>]*>/i);
  if (canonicalMatch) {
    seoData.canonical_url = canonicalMatch[1];
  }

  // Parse Open Graph data
  const ogTitleMatch = headContent.match(/<meta[^>]*property=['""]og:title['""][^>]*content=['""]([^'"]*)['""][^>]*>/i);
  if (ogTitleMatch) {
    seoData.og_title = ogTitleMatch[1];
  }

  const ogDescMatch = headContent.match(/<meta[^>]*property=['""]og:description['""][^>]*content=['""]([^'"]*)['""][^>]*>/i);
  if (ogDescMatch) {
    seoData.og_description = ogDescMatch[1];
  }

  const ogImageMatch = headContent.match(/<meta[^>]*property=['""]og:image['""][^>]*content=['""]([^'"]*)['""][^>]*>/i);
  if (ogImageMatch) {
    seoData.og_image = ogImageMatch[1];
  }

  // Parse Twitter data
  const twitterTitleMatch = headContent.match(/<meta[^>]*name=['""]twitter:title['""][^>]*content=['""]([^'"]*)['""][^>]*>/i);
  if (twitterTitleMatch) {
    seoData.twitter_title = twitterTitleMatch[1];
  }

  const twitterDescMatch = headContent.match(/<meta[^>]*name=['""]twitter:description['""][^>]*content=['""]([^'"]*)['""][^>]*>/i);
  if (twitterDescMatch) {
    seoData.twitter_description = twitterDescMatch[1];
  }

  const twitterImageMatch = headContent.match(/<meta[^>]*name=['""]twitter:image['""][^>]*content=['""]([^'"]*)['""][^>]*>/i);
  if (twitterImageMatch) {
    seoData.twitter_image = twitterImageMatch[1];
  }

  // Parse JSON-LD schema data
  const schemaMatch = headContent.match(/<script[^>]*type=['""]application\/ld\+json['""][^>]*class=['""]rank-math-schema['""][^>]*>([\s\S]*?)<\/script>/i);
  if (schemaMatch) {
    seoData.schema = schemaMatch[1].trim();
  }

  return seoData;
}

// Template utility functions for Gutenberg block themes
export function checkTemplate(template: string | undefined, templateType: string): boolean {
  if (!template) return false;

  // Gutenberg block theme template patterns
  const patterns = [
    templateType,
    `page-${templateType}`,
    `post-${templateType}`,
    `single-${templateType}`,
    `single-post-${templateType}`,
    `page-${templateType}.html`,
    `post-${templateType}.html`,
    `single-${templateType}.html`,
    `single-post-${templateType}.html`,
    // Also support legacy PHP templates for compatibility
    `template-${templateType}.php`,
    `template-${templateType}`,
  ];

  return patterns.some(pattern =>
    template === pattern || template.includes(templateType)
  );
}

// Enhanced template checking that looks at multiple sources
export function checkPostTemplate(post: any, templateType: string): boolean {
  // Check the template field
  if (checkTemplate(post.template, templateType)) {
    return true;
  }

  // Check class_list for template indicators
  if (post.class_list && Array.isArray(post.class_list)) {
    const hasTemplateClass = post.class_list.some((className: string) =>
      className.includes(templateType) ||
      className.includes(`page-template-${templateType}`) ||
      className.includes(`template-${templateType}`)
    );
    if (hasTemplateClass) return true;
  }

  // Check meta fields for template information
  if (post.meta) {
    // Common meta field names for templates
    const templateMeta = post.meta._wp_page_template ||
                        post.meta.page_template ||
                        post.meta.template ||
                        post.meta._template;

    if (templateMeta && checkTemplate(templateMeta, templateType)) {
      return true;
    }
  }

  return false;
}

// Updated functions that work with both template string and full post object
export function isNoTitleTemplate(templateOrPost: string | undefined | any): boolean {
  if (typeof templateOrPost === 'string' || templateOrPost === undefined) {
    return checkTemplate(templateOrPost, 'no-title');
  }
  return checkPostTemplate(templateOrPost, 'no-title');
}

export function isNoMetaTemplate(templateOrPost: string | undefined | any): boolean {
  if (typeof templateOrPost === 'string' || templateOrPost === undefined) {
    return checkTemplate(templateOrPost, 'no-meta') || checkTemplate(templateOrPost, 'no-title');
  }
  return checkPostTemplate(templateOrPost, 'no-meta') || checkPostTemplate(templateOrPost, 'no-title');
}

export function isFullWidthTemplate(templateOrPost: string | undefined | any): boolean {
  if (typeof templateOrPost === 'string' || templateOrPost === undefined) {
    return checkTemplate(templateOrPost, 'full-width') ||
           checkTemplate(templateOrPost, 'fullwidth') ||
           checkTemplate(templateOrPost, 'wide');
  }
  return checkPostTemplate(templateOrPost, 'full-width') ||
         checkPostTemplate(templateOrPost, 'fullwidth') ||
         checkPostTemplate(templateOrPost, 'wide');
}

export function isBlankTemplate(templateOrPost: string | undefined | any): boolean {
  if (typeof templateOrPost === 'string' || templateOrPost === undefined) {
    return checkTemplate(templateOrPost, 'blank') ||
           checkTemplate(templateOrPost, 'empty') ||
           checkTemplate(templateOrPost, 'canvas');
  }
  return checkPostTemplate(templateOrPost, 'blank') ||
         checkPostTemplate(templateOrPost, 'empty') ||
         checkPostTemplate(templateOrPost, 'canvas');
}

// Helper function to parse WordPress navigation content
function parseNavigationContent(html: string): MenuItem[] {
  if (!html) return [];

  const items: MenuItem[] = [];

  // Extract all navigation items from the HTML
  // WordPress navigation structure: <li class="wp-block-navigation-item">
  //   <a class="wp-block-navigation-item__content" href="...">
  //     <span class="wp-block-navigation-item__label">Title</span>
  //   </a>
  // </li>

  // Match anchor tags with wp-block-navigation-item__content class
  const linkRegex = /<a\s+[^>]*?class="[^"]*wp-block-navigation-item__content[^"]*"[^>]*?>([\s\S]*?)<\/a>/g;
  let match;
  let order = 1;

  while ((match = linkRegex.exec(html)) !== null) {
    const fullMatch = match[0];
    const innerContent = match[1];

    // Extract href from the anchor tag
    const hrefMatch = fullMatch.match(/href="([^"]*)"/);
    const url = hrefMatch ? hrefMatch[1] : '';

    // Extract title from the label span or from the inner content
    const labelMatch = innerContent.match(/<span[^>]*class="[^"]*wp-block-navigation-item__label[^"]*"[^>]*>(.*?)<\/span>/);
    const title = labelMatch ? labelMatch[1].trim() : innerContent.replace(/<[^>]*>/g, '').trim();

    if (title && url) {
      items.push({
        id: order,
        title,
        url,
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        target: '',
        classes: [],
        xfn: '',
        description: '',
        object_id: 0,
        object: 'custom',
        object_slug: '',
        type: 'custom',
        type_label: 'Custom Link',
        parent: 0,
        menu_order: order,
        attr_title: '',
      });

      order++;
    }
  }

  return items;
}

// WordPress Menu Functions
export async function getAllMenus(language?: string): Promise<Menu[]> {
  try {
    // Use WordPress core navigation endpoint
    const navItems = await wordpressFetch<any[]>("/wp-json/wp/v2/navigation", { per_page: 100 }, language);

    // Transform WordPress navigation format to Menu format
    return navItems.map(nav => {
      // Parse the menu items from the content
      const menuItems = parseNavigationContent(nav.content?.rendered || '');

      return {
        id: nav.id,
        name: nav.title?.rendered || nav.title || 'Untitled',
        slug: nav.slug,
        description: nav.description || '',
        count: menuItems.length,
        items: menuItems,
        meta: {
          links: {
            collection: '',
            self: ''
          }
        }
      };
    });
  } catch (error) {
    console.warn("Navigation endpoints not available:", error);
    return [];
  }
}

export async function getMenuBySlug(slug: string, language?: string): Promise<Menu | null> {
  try {
    // Get all menus and find by slug
    const menus = await wordpressFetch<any[]>("/wp-json/wp/v2/navigation", { per_page: 100, slug }, language);

    if (!menus || menus.length === 0) {
      return null;
    }

    const nav = menus[0];

    // Parse the menu items from the content
    const menuItems = parseNavigationContent(nav.content?.rendered || '');

    return {
      id: nav.id,
      name: nav.title?.rendered || nav.title || 'Untitled',
      slug: nav.slug,
      description: nav.description || '',
      count: menuItems.length,
      items: menuItems,
      meta: {
        links: {
          collection: '',
          self: ''
        }
      }
    };
  } catch (error) {
    console.warn(`Menu "${slug}" not found:`, error);
    return null;
  }
}

export async function getMenuById(id: number, language?: string): Promise<Menu | null> {
  try {
    const nav = await wordpressFetch<any>(`/wp-json/wp/v2/navigation/${id}`, {}, language);

    // Parse the menu items from the content
    const menuItems = parseNavigationContent(nav.content?.rendered || '');

    return {
      id: nav.id,
      name: nav.title?.rendered || nav.title || 'Untitled',
      slug: nav.slug,
      description: nav.description || '',
      count: menuItems.length,
      items: menuItems,
      meta: {
        links: {
          collection: '',
          self: ''
        }
      }
    };
  } catch (error) {
    console.warn(`Menu with ID "${id}" not found:`, error);
    return null;
  }
}

export async function getMenuLocations(language?: string): Promise<MenuLocation> {
  try {
    // WordPress core doesn't have menu locations endpoint
    // Return empty object - use slug-based lookup instead
    return {};
  } catch (error) {
    console.warn("Menu locations not available:", error);
    return {};
  }
}

export async function getMenuByLocation(location: string, language?: string): Promise<Menu | null> {
  try {
    // For WordPress core navigation, we'll try to find by slug matching the location name
    return await getMenuBySlug(location, language);
  } catch (error) {
    console.warn(`Menu for location "${location}" not found:`, error);
    return null;
  }
}

// Helper function to build hierarchical menu structure
export function buildMenuTree(items: MenuItem[]): MenuItem[] {
  const itemMap = new Map<number, MenuItem>();
  const rootItems: MenuItem[] = [];

  // Create a map of all items
  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // Build the tree structure
  items.forEach(item => {
    const menuItem = itemMap.get(item.id)!;

    if (item.parent === 0) {
      // Root level item
      rootItems.push(menuItem);
    } else {
      // Child item - add to parent's children array
      const parent = itemMap.get(item.parent);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(menuItem);
      } else {
        // Parent not found, treat as root item
        rootItems.push(menuItem);
      }
    }
  });

  // Sort by menu_order
  const sortByOrder = (a: MenuItem, b: MenuItem) => a.menu_order - b.menu_order;
  rootItems.sort(sortByOrder);

  rootItems.forEach(item => {
    if (item.children && item.children.length > 0) {
      item.children.sort(sortByOrder);
    }
  });

  return rootItems;
}

// Convert WordPress absolute URLs to relative paths for Next.js
export function convertMenuUrlToRelative(url: string): string {
  try {
    const wpUrl = new URL(process.env.WORDPRESS_URL || '');
    const itemUrl = new URL(url);

    // If the URL is from the WordPress site, convert to relative
    if (itemUrl.hostname === wpUrl.hostname) {
      return itemUrl.pathname + itemUrl.search + itemUrl.hash;
    }

    // External link, return as is
    return url;
  } catch (error) {
    // If URL parsing fails, return as is
    return url;
  }
}

// Transform menu items for Next.js usage
export function transformMenuItems(items: MenuItem[]): MenuItem[] {
  return items.map(item => ({
    ...item,
    url: convertMenuUrlToRelative(item.url),
    children: item.children ? transformMenuItems(item.children) : undefined,
  }));
}

// Get primary navigation menu (with language support)
export async function getPrimaryNavigation(language?: string): Promise<MenuItem[]> {
  try {
    // Try to get menu by location first
    const menu = await getMenuByLocation('primary', language);

    if (menu && menu.items) {
      const hierarchicalItems = buildMenuTree(menu.items);
      return transformMenuItems(hierarchicalItems);
    }

    // Fallback: try to get a menu named "primary", "navigation", or "main"
    const menus = await getAllMenus(language);
    const primaryMenu = menus.find(m =>
      m.slug === 'primary' ||
      m.slug === 'navigation' ||
      m.slug === 'main' ||
      m.slug === 'main-menu' ||
      m.slug === 'primary-menu' ||
      m.name.toLowerCase().includes('primary') ||
      m.name.toLowerCase().includes('main')
    );

    if (primaryMenu && primaryMenu.items) {
      const hierarchicalItems = buildMenuTree(primaryMenu.items);
      return transformMenuItems(hierarchicalItems);
    }

    console.warn('Primary navigation menu not found');
    return [];
  } catch (error) {
    console.warn('Error fetching primary navigation:', error);
    return [];
  }
}

// Get footer navigation menu (with language support)
export async function getFooterNavigation(language?: string): Promise<MenuItem[]> {
  try {
    const menu = await getMenuByLocation('footer', language);

    if (menu && menu.items) {
      const hierarchicalItems = buildMenuTree(menu.items);
      return transformMenuItems(hierarchicalItems);
    }

    // Fallback: try to get a menu named "footer"
    const menus = await getAllMenus(language);
    const footerMenu = menus.find(m =>
      m.slug === 'footer' ||
      m.slug === 'footer-menu' ||
      m.name.toLowerCase().includes('footer')
    );

    if (footerMenu && footerMenu.items) {
      const hierarchicalItems = buildMenuTree(footerMenu.items);
      return transformMenuItems(hierarchicalItems);
    }

    return [];
  } catch (error) {
    console.warn('Error fetching footer navigation:', error);
    return [];
  }
}

// WordPress Template Functions
export async function getAllTemplates(): Promise<WordPressTemplate[]> {
  try {
    return await wordpressFetch<WordPressTemplate[]>(
      "/wp-json/wp/v2/templates",
      { per_page: 100 },
      undefined,
      true
    );
  } catch (error) {
    console.warn("Templates not available:", error);
    return [];
  }
}

export async function getTemplateBySlug(slug: string): Promise<WordPressTemplate | null> {
  try {
    const templates = await wordpressFetch<WordPressTemplate[]>(
      "/wp-json/wp/v2/templates",
      { slug, per_page: 1 },
      undefined,
      true
    );
    return templates && templates.length > 0 ? templates[0] : null;
  } catch (error) {
    console.warn(`Template "${slug}" not found:`, error);
    return null;
  }
}

export async function getTemplateById(id: string): Promise<WordPressTemplate | null> {
  try {
    return await wordpressFetch<WordPressTemplate>(
      `/wp-json/wp/v2/templates/${encodeURIComponent(id)}`,
      {},
      undefined,
      true
    );
  } catch (error) {
    console.warn(`Template with ID "${id}" not found:`, error);
    return null;
  }
}

export { WordPressAPIError };
