import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { getAllPosts, getPostBySlug, getAllCategories, getAllAuthors } from '@/lib/wordpress';

describe('WordPress API Integration Tests', () => {
  beforeEach(() => {
    // Reset any runtime request handlers
    server.resetHandlers();
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