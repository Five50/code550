import { describe, it, expect, vi } from 'vitest';

// Mock next/og ImageResponse since it uses edge runtime APIs
vi.mock('next/og', () => ({
  ImageResponse: class MockImageResponse {
    constructor(public element: any, public options: any) {}
  },
}));

import { GET } from '@/app/api/og/route';
import { NextRequest } from 'next/server';

describe('GET /api/og', () => {
  it('should return an ImageResponse with title', async () => {
    const req = new NextRequest('http://localhost/api/og?title=Hello+World');
    const res = await GET(req);
    // MockImageResponse won't have standard Response properties,
    // but it should not throw
    expect(res).toBeDefined();
  });

  it('should handle title and description params', async () => {
    const req = new NextRequest(
      'http://localhost/api/og?title=Test+Title&description=Some+description'
    );
    const res = await GET(req);
    expect(res).toBeDefined();
  });

  it('should handle missing params without throwing', async () => {
    const req = new NextRequest('http://localhost/api/og');
    const res = await GET(req);
    expect(res).toBeDefined();
  });
});
