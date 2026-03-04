import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';

// Mock getTemplateForPath to avoid real WP API calls
vi.mock('@/lib/wordpress', () => ({
  getTemplateForPath: vi.fn(async (path: string) => {
    if (path === '/') return 'front-page';
    if (path === '/blog') return 'index';
    if (path.startsWith('/posts/')) return 'single';
    return 'page';
  }),
}));

import { GET } from '@/app/api/template/route';

describe('GET /api/template', () => {
  it('should default path to "/" when no param provided', async () => {
    const req = new NextRequest('http://localhost/api/template');
    const res = await GET(req);
    const json = await res.json();
    expect(json.template).toBe('front-page');
  });

  it('should return template for given path', async () => {
    const req = new NextRequest('http://localhost/api/template?path=/blog');
    const res = await GET(req);
    const json = await res.json();
    expect(json.template).toBe('index');
  });

  it('should return single template for post paths', async () => {
    const req = new NextRequest('http://localhost/api/template?path=/posts/hello');
    const res = await GET(req);
    const json = await res.json();
    expect(json.template).toBe('single');
  });

  it('should return "default" on error', async () => {
    const { getTemplateForPath } = await import('@/lib/wordpress');
    vi.mocked(getTemplateForPath).mockRejectedValueOnce(new Error('fail'));

    const req = new NextRequest('http://localhost/api/template?path=/broken');
    const res = await GET(req);
    const json = await res.json();
    expect(json.template).toBe('default');
    expect(res.status).toBe(500);
  });
});
