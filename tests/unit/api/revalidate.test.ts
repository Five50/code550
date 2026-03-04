import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

import { POST } from '@/app/api/revalidate/route';

function makeRequest(body: any, secret?: string) {
  const req = new NextRequest('http://localhost/api/revalidate', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: secret ? { 'x-webhook-secret': secret } : {},
  });
  return req;
}

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    vi.stubEnv('WORDPRESS_WEBHOOK_SECRET', 'test-secret');
  });

  it('should return 401 for invalid webhook secret', async () => {
    const req = makeRequest({ contentType: 'post' }, 'wrong-secret');
    const res = await POST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toBe('Invalid webhook secret');
  });

  it('should return 401 when no secret provided', async () => {
    const req = makeRequest({ contentType: 'post' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return 400 for missing content type', async () => {
    const req = makeRequest({}, 'test-secret');
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toBe('Missing content type');
  });

  it('should return 200 for valid post revalidation', async () => {
    const req = makeRequest({ contentType: 'post', contentId: 42 }, 'test-secret');
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toBe(true);
    expect(json.message).toContain('post');
  });

  it('should return 200 for category revalidation', async () => {
    const req = makeRequest({ contentType: 'category', contentId: 5 }, 'test-secret');
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toBe(true);
  });

  it('should return 200 for tag revalidation', async () => {
    const req = makeRequest({ contentType: 'tag' }, 'test-secret');
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it('should return 200 for author/user revalidation', async () => {
    const req = makeRequest({ contentType: 'author', contentId: 1 }, 'test-secret');
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it('should handle contentType without contentId', async () => {
    const req = makeRequest({ contentType: 'post' }, 'test-secret');
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toBe(true);
  });

  it('should return 500 for malformed JSON body', async () => {
    const req = new NextRequest('http://localhost/api/revalidate', {
      method: 'POST',
      body: 'not-json',
      headers: { 'x-webhook-secret': 'test-secret' },
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
