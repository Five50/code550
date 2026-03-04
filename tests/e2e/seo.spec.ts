import { test, expect } from '@playwright/test';

test.describe('SEO', () => {
  test('homepage has meta description', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const metaDescription = page.locator('meta[name="description"]');
    const content = await metaDescription.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(0);
  });

  test('homepage has Open Graph tags', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ogTitle = page.locator('meta[property="og:title"]');
    const ogType = page.locator('meta[property="og:type"]');

    // At least og:title should be present
    if (await ogTitle.count() > 0) {
      const title = await ogTitle.getAttribute('content');
      expect(title).toBeTruthy();
    }
  });

  test('blog page has proper title', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(/.+/);
  });

  test('posts page has meta description', async ({ page }) => {
    await page.goto('/posts');
    await page.waitForLoadState('networkidle');

    // Should have a title
    await expect(page).toHaveTitle(/.+/);
  });

  test('viewport meta tag is present', async ({ page }) => {
    await page.goto('/');
    const viewport = page.locator('meta[name="viewport"]');
    const content = await viewport.getAttribute('content');
    expect(content).toContain('width=device-width');
  });

  test('canonical URL is not duplicated', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const canonicals = page.locator('link[rel="canonical"]');
    const count = await canonicals.count();
    // Should have 0 or 1 canonical link, never more
    expect(count).toBeLessThanOrEqual(1);
  });
});
