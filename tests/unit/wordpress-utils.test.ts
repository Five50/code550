import { describe, it, expect } from 'vitest';
import { sanitizeContentUrls } from '@/lib/wordpress';

describe('sanitizeContentUrls', () => {
  it('should rewrite WordPress image URLs to Next.js image proxy', () => {
    const html = '<img src="https://test.example.com/wp-content/uploads/2025/01/photo.jpg" alt="test">';
    const result = sanitizeContentUrls(html);

    // The direct WP URL should no longer appear as a src value
    expect(result).not.toContain('src="https://test.example.com');
    expect(result).toContain('/_next/image?url=');
    expect(result).toContain('w=1200');
    expect(result).toContain('q=75');
  });

  it('should handle multiple image URLs in content', () => {
    const html = `
      <p>Some text</p>
      <img src="https://test.example.com/wp-content/uploads/2025/01/photo1.jpg" alt="one">
      <p>More text</p>
      <img src="https://test.example.com/wp-content/uploads/2025/02/photo2.png" alt="two">
    `;
    const result = sanitizeContentUrls(html);

    expect(result).not.toContain('src="https://test.example.com');
    expect(result.match(/\/_next\/image/g)).toHaveLength(2);
  });

  it('should not modify non-WordPress URLs', () => {
    const html = '<img src="https://cdn.example.com/images/photo.jpg" alt="external">';
    const result = sanitizeContentUrls(html);

    expect(result).toBe(html);
  });

  it('should not modify non-upload WordPress URLs', () => {
    const html = '<a href="https://test.example.com/some-page">Link</a>';
    const result = sanitizeContentUrls(html);

    expect(result).toBe(html);
  });

  it('should handle empty or null-ish input', () => {
    expect(sanitizeContentUrls('')).toBe('');
  });

  it('should handle single-quoted src attributes', () => {
    const html = "<img src='https://test.example.com/wp-content/uploads/2025/01/photo.jpg' alt='test'>";
    const result = sanitizeContentUrls(html);

    expect(result).not.toContain("src='https://test.example.com");
    expect(result).toContain('/_next/image');
  });
});
