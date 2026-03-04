import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/wordpress', () => ({
  getAllPosts: vi.fn().mockResolvedValue([
    { slug: 'hello-world', modified: '2025-01-01T00:00:00' },
    { slug: 'second-post', modified: '2025-02-01T00:00:00' },
  ]),
  getAllPages: vi.fn().mockResolvedValue([
    { slug: 'about', modified: '2025-01-15T00:00:00' },
  ]),
}));

import sitemap from '@/app/sitemap';

describe('sitemap', () => {
  it('returns static URLs', async () => {
    const result = await sitemap();
    const urls = result.map(entry => entry.url);
    expect(urls).toContain('https://example.com');
    expect(urls).toContain('https://example.com/posts/archive');
    expect(urls).toContain('https://example.com/posts/categories');
    expect(urls).toContain('https://example.com/posts/authors');
    expect(urls).toContain('https://example.com/posts/tags');
  });

  it('generates post URLs from WordPress data', async () => {
    const result = await sitemap();
    const urls = result.map(entry => entry.url);
    expect(urls).toContain('https://example.com/hello-world');
    expect(urls).toContain('https://example.com/second-post');
  });

  it('generates page URLs from WordPress data', async () => {
    const result = await sitemap();
    const urls = result.map(entry => entry.url);
    expect(urls).toContain('https://example.com/about');
  });

  it('sets correct priorities', async () => {
    const result = await sitemap();
    const homepage = result.find(e => e.url === 'https://example.com');
    expect(homepage?.priority).toBe(1);

    const postEntry = result.find(e => e.url === 'https://example.com/hello-world');
    expect(postEntry?.priority).toBe(0.7);

    const pageEntry = result.find(e => e.url === 'https://example.com/about');
    expect(pageEntry?.priority).toBe(0.6);
  });

  it('includes lastModified dates for posts', async () => {
    const result = await sitemap();
    const postEntry = result.find(e => e.url === 'https://example.com/hello-world');
    expect(postEntry?.lastModified).toBeDefined();
  });
});
