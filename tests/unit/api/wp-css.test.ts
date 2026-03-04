import { describe, it, expect, vi, beforeEach } from 'vitest';

import { GET } from '@/app/api/wp-css/route';

describe('GET /api/wp-css', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 404 when WORDPRESS_URL is not set', async () => {
    vi.stubEnv('WORDPRESS_URL', '');
    // Re-import to pick up new env
    const mod = await import('@/app/api/wp-css/route');
    // The route reads env at call time via process.env
    const res = await GET();
    // When WORDPRESS_URL is empty, wpUrl is falsy
    expect(res.status).toBe(404);
  });

  it('should proxy CSS on successful fetch', async () => {
    vi.stubEnv('WORDPRESS_URL', 'https://test.example.com');
    const mockCss = 'body { margin: 0; }';
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockCss),
    });

    const res = await GET();
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe(mockCss);
    expect(res.headers.get('Content-Type')).toBe('text/css');
    expect(res.headers.get('Cache-Control')).toContain('max-age=86400');
  });

  it('should return 502 when upstream fetch fails', async () => {
    vi.stubEnv('WORDPRESS_URL', 'https://test.example.com');
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const res = await GET();
    expect(res.status).toBe(502);
  });

  it('should return 502 when fetch throws', async () => {
    vi.stubEnv('WORDPRESS_URL', 'https://test.example.com');
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('network error'));

    const res = await GET();
    expect(res.status).toBe(502);
  });

  it('should include auth headers when credentials are available', async () => {
    vi.stubEnv('WORDPRESS_URL', 'https://test.example.com');
    vi.stubEnv('WORDPRESS_AUTH_USER', 'admin');
    vi.stubEnv('WORDPRESS_AUTH_PASSWORD', 'pass');

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('css'),
    });

    await GET();
    const fetchCall = vi.mocked(global.fetch).mock.calls[0];
    expect(fetchCall[1]?.headers).toHaveProperty('Authorization');
  });
});
