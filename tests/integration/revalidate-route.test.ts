import { createHmac } from 'node:crypto';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const revalidateTag = vi.fn();
const revalidatePath = vi.fn();

vi.mock('next/cache', () => ({
  revalidateTag: (...args: unknown[]) => revalidateTag(...args),
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));

const SECRET = 'test-webhook-secret';

/** Mirrors NextPulse Dispatcher::sign_request(). */
function signedRequest(
  payload: Record<string, unknown>,
  overrides: { secret?: string; timestamp?: number; signature?: string } = {}
) {
  const body = JSON.stringify(payload);
  const timestamp = overrides.timestamp ?? Math.floor(Date.now() / 1000);
  const signature =
    overrides.signature ??
    createHmac('sha256', SECRET).update(`${timestamp}.${body}`).digest('hex');

  return new Request('https://example.com/api/revalidate', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-webhook-secret': overrides.secret ?? SECRET,
      'x-webhook-signature': signature,
      'x-webhook-timestamp': String(timestamp),
    },
    body,
  });
}

async function post(request: Request) {
  const { POST } = await import('@/app/api/revalidate/route');
  return POST(request as never);
}

describe('POST /api/revalidate (NextPulse webhook)', () => {
  beforeEach(() => {
    vi.stubEnv('WORDPRESS_WEBHOOK_SECRET', SECRET);
    revalidateTag.mockClear();
    revalidatePath.mockClear();
  });

  it('accepts a correctly signed pulse and revalidates the wordpress tag', async () => {
    const response = await post(
      signedRequest({ contentType: 'post', contentId: 12, paths: ['/blog/hello/'] })
    );

    expect(response.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith('wordpress', 'max');
  });

  it('strips the WordPress trailing slash before revalidating a path', async () => {
    await post(signedRequest({ contentType: 'post', paths: ['/blog/hello/'] }));

    expect(revalidatePath).toHaveBeenCalledWith('/blog/hello');
  });

  it('falls back to a layout revalidation for site-wide content types', async () => {
    await post(signedRequest({ contentType: 'menu', paths: ['/blog/hello/'] }));

    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
  });

  it('falls back to a layout revalidation when no paths are sent', async () => {
    await post(signedRequest({ contentType: 'page' }));

    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
  });

  it('rejects a tampered signature', async () => {
    const response = await post(
      signedRequest({ contentType: 'post' }, { signature: 'deadbeef' })
    );

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('rejects a wrong secret', async () => {
    const response = await post(
      signedRequest({ contentType: 'post' }, { secret: 'not-the-secret' })
    );

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('rejects a replayed timestamp outside the tolerance window', async () => {
    const stale = Math.floor(Date.now() / 1000) - 3600;
    const response = await post(signedRequest({ contentType: 'post' }, { timestamp: stale }));

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('rejects an unknown content type', async () => {
    const response = await post(signedRequest({ contentType: 'widget' }));

    expect(response.status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('accepts every content type NextPulse can send', async () => {
    const types = ['post', 'page', 'term', 'author', 'media', 'menu', 'custom', 'all'];

    for (const contentType of types) {
      const response = await post(signedRequest({ contentType }));
      expect(response.status, contentType).toBe(200);
    }
  });
});
