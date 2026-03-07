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

vi.mock('@/proxy', () => ({
  supportedLanguages: ['en'],
}));

import sitemap from '@/app/sitemap';

const DOMAIN = 'https://code550.com';

describe('sitemap', () => {
  it('returns static URLs', async () => {
    const result = await sitemap();
    const urls = result.map(entry => entry.url);
    expect(urls).toContain(`${DOMAIN}`);
    expect(urls).toContain(`${DOMAIN}/posts/archive`);
    expect(urls).toContain(`${DOMAIN}/posts/categories`);
    expect(urls).toContain(`${DOMAIN}/posts/authors`);
    expect(urls).toContain(`${DOMAIN}/posts/tags`);
  });

  it('generates post URLs from WordPress data', async () => {
    const result = await sitemap();
    const urls = result.map(entry => entry.url);
    expect(urls).toContain(`${DOMAIN}/hello-world`);
    expect(urls).toContain(`${DOMAIN}/second-post`);
  });

  it('generates page URLs from WordPress data', async () => {
    const result = await sitemap();
    const urls = result.map(entry => entry.url);
    expect(urls).toContain(`${DOMAIN}/about`);
  });

  it('sets correct priorities', async () => {
    const result = await sitemap();
    const homepage = result.find(e => e.url === `${DOMAIN}`);
    expect(homepage?.priority).toBe(1);

    const postEntry = result.find(e => e.url === `${DOMAIN}/hello-world`);
    expect(postEntry?.priority).toBe(0.7);

    const pageEntry = result.find(e => e.url === `${DOMAIN}/about`);
    expect(pageEntry?.priority).toBe(0.6);
  });

  it('includes lastModified dates for posts', async () => {
    const result = await sitemap();
    const postEntry = result.find(e => e.url === `${DOMAIN}/hello-world`);
    expect(postEntry?.lastModified).toBeDefined();
  });
});
