import { http, HttpResponse } from 'msw';
import type { Post, Category, Tag, Author, FeaturedMedia } from '@/lib/wordpress.d';

// Mock data
const mockPost: Post = {
  id: 1,
  date: '2025-01-01T00:00:00',
  date_gmt: '2025-01-01T00:00:00',
  modified: '2025-01-01T00:00:00',
  modified_gmt: '2025-01-01T00:00:00',
  slug: 'test-post',
  status: 'publish',
  link: 'https://example.com/test-post',
  guid: { rendered: 'https://example.com/?p=1' },
  title: { rendered: 'Test Post' },
  content: { rendered: '<p>This is a test post content.</p>', protected: false },
  excerpt: { rendered: '<p>This is a test excerpt.</p>', protected: false },
  author: 1,
  featured_media: 1,
  comment_status: 'open',
  ping_status: 'open',
  sticky: false,
  template: '',
  format: 'standard',
  meta: {},
  categories: [1],
  tags: [1]
};

const mockCategory: Category = {
  id: 1,
  count: 1,
  description: 'Test category',
  link: 'https://example.com/category/test',
  name: 'Test Category',
  slug: 'test-category',
  taxonomy: 'category',
  parent: 0,
  meta: {}
};

const mockTag: Tag = {
  id: 1,
  count: 1,
  description: 'Test tag',
  link: 'https://example.com/tag/test',
  name: 'Test Tag',
  slug: 'test-tag',
  taxonomy: 'post_tag',
  meta: {}
};

const mockAuthor: Author = {
  id: 1,
  name: 'Test Author',
  url: 'https://example.com',
  description: 'Test author description',
  link: 'https://example.com/author/test',
  slug: 'test-author',
  avatar_urls: {
    '24': 'https://example.com/avatar-24.jpg',
    '48': 'https://example.com/avatar-48.jpg',
    '96': 'https://example.com/avatar-96.jpg'
  },
  meta: {}
};

const mockFeaturedMedia: FeaturedMedia = {
  id: 1,
  date: '2025-01-01T00:00:00',
  date_gmt: '2025-01-01T00:00:00',
  modified: '2025-01-01T00:00:00',
  modified_gmt: '2025-01-01T00:00:00',
  slug: 'test-image',
  status: 'publish',
  link: 'https://example.com/test-image',
  guid: { rendered: 'https://example.com/wp-content/uploads/test-image.jpg' },
  title: { rendered: 'Test Image' },
  author: 1,
  caption: { rendered: 'Test image caption' },
  alt_text: 'Test image alt text',
  media_type: 'image',
  mime_type: 'image/jpeg',
  media_details: {
    width: 1200,
    height: 800,
    file: 'test-image.jpg',
    sizes: {
      thumbnail: {
        file: 'test-image-150x150.jpg',
        width: 150,
        height: 150,
        mime_type: 'image/jpeg',
        source_url: 'https://example.com/wp-content/uploads/test-image-150x150.jpg'
      },
      medium: {
        file: 'test-image-300x200.jpg',
        width: 300,
        height: 200,
        mime_type: 'image/jpeg',
        source_url: 'https://example.com/wp-content/uploads/test-image-300x200.jpg'
      },
      large: {
        file: 'test-image-1024x683.jpg',
        width: 1024,
        height: 683,
        mime_type: 'image/jpeg',
        source_url: 'https://example.com/wp-content/uploads/test-image-1024x683.jpg'
      },
      full: {
        file: 'test-image.jpg',
        width: 1200,
        height: 800,
        mime_type: 'image/jpeg',
        source_url: 'https://example.com/wp-content/uploads/test-image.jpg'
      }
    }
  },
  source_url: 'https://example.com/wp-content/uploads/test-image.jpg'
};

// Request handlers
export const handlers = [
  // Posts
  http.get('*/wp-json/wp/v2/posts', () => {
    return HttpResponse.json([mockPost], {
      headers: {
        'X-WP-Total': '1',
        'X-WP-TotalPages': '1'
      }
    });
  }),

  http.get('*/wp-json/wp/v2/posts/:id', () => {
    return HttpResponse.json(mockPost);
  }),

  // Categories
  http.get('*/wp-json/wp/v2/categories', () => {
    return HttpResponse.json([mockCategory]);
  }),

  http.get('*/wp-json/wp/v2/categories/:id', () => {
    return HttpResponse.json(mockCategory);
  }),

  // Tags
  http.get('*/wp-json/wp/v2/tags', () => {
    return HttpResponse.json([mockTag]);
  }),

  http.get('*/wp-json/wp/v2/tags/:id', () => {
    return HttpResponse.json(mockTag);
  }),

  // Users/Authors
  http.get('*/wp-json/wp/v2/users', () => {
    return HttpResponse.json([mockAuthor]);
  }),

  http.get('*/wp-json/wp/v2/users/:id', () => {
    return HttpResponse.json(mockAuthor);
  }),

  // Media
  http.get('*/wp-json/wp/v2/media/:id', () => {
    return HttpResponse.json(mockFeaturedMedia);
  }),

  // Pages
  http.get('*/wp-json/wp/v2/pages', () => {
    return HttpResponse.json([]);
  }),
];