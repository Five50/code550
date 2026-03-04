import { describe, it, expect, beforeEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { getAllPosts, getPostBySlug, getAllCategories, getAllAuthors } from '@/lib/wordpress';

describe('WordPress API Integration Tests', () => {
  beforeEach(() => {
    // Reset any runtime request handlers
    server.resetHandlers();
  });

  it('should always include Authorization header when credentials are set', async () => {
    let capturedAuthHeader: string | null = null;

    server.use(
      http.get('*/wp-json/wp/v2/posts', ({ request }) => {
        capturedAuthHeader = request.headers.get('Authorization');
        return HttpResponse.json([{
          id: 1, slug: 'test-post', title: { rendered: 'Test' },
          content: { rendered: '', protected: false },
          excerpt: { rendered: '', protected: false },
          date: '', date_gmt: '', modified: '', modified_gmt: '',
          status: 'publish', link: '', guid: { rendered: '' },
          author: 1, featured_media: 0, comment_status: 'open',
          ping_status: 'open', sticky: false, template: '',
          format: 'standard', meta: {}, categories: [], tags: []
        }]);
      })
    );

    await getAllPosts();

    // Auth headers should be present since env vars are set in test setup
    if (process.env.WORDPRESS_AUTH_USER && process.env.WORDPRESS_AUTH_PASSWORD) {
      expect(capturedAuthHeader).toBeTruthy();
      expect(capturedAuthHeader).toMatch(/^Basic /);
    }
  });

  it('should fetch all posts successfully', async () => {
    const posts = await getAllPosts();

    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({
      id: 1,
      slug: 'test-post',
      title: { rendered: 'Test Post' },
      content: { rendered: '<p>This is a test post content.</p>' }
    });
  });

  it('should fetch post by slug successfully', async () => {
    const post = await getPostBySlug('test-post');

    expect(post).toMatchObject({
      id: 1,
      slug: 'test-post',
      title: { rendered: 'Test Post' }
    });
  });

  it('should fetch all categories successfully', async () => {
    const categories = await getAllCategories();

    expect(categories).toHaveLength(1);
    expect(categories[0]).toMatchObject({
      id: 1,
      name: 'Test Category',
      slug: 'test-category'
    });
  });

  it('should fetch all authors successfully', async () => {
    const authors = await getAllAuthors();

    expect(authors).toHaveLength(1);
    expect(authors[0]).toMatchObject({
      id: 1,
      name: 'Test Author',
      slug: 'test-author'
    });
  });

  it('should handle API errors gracefully', async () => {
    // Override the default handler to return an error
    server.use(
      http.get('*/wp-json/wp/v2/posts', () => {
        return new HttpResponse(null, { status: 404 });
      })
    );

    await expect(getAllPosts()).rejects.toThrow();
  });
});