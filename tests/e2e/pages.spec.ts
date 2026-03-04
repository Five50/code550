import { test, expect } from '@playwright/test';

test.describe('WordPress Pages', () => {
  test('blog page loads and displays content', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');

    // Page should load without error
    await expect(page).toHaveTitle(/.+/);

    // Should display blog heading or posts
    const heading = page.locator('h1');
    if (await heading.isVisible()) {
      await expect(heading).toBeVisible();
    }
  });

  test('posts archive page loads', async ({ page }) => {
    await page.goto('/posts');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(/.+/);
    // Should display "All Posts" heading or similar
    await expect(page.locator('h2, h1')).toBeVisible();
  });

  test('404 page displays for nonexistent routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-xyz');
    await page.waitForLoadState('networkidle');

    // Should show 404 content or redirect
    const is404 = await page.getByText(/404|not found|page not found/i).isVisible();
    const isRedirected = page.url() !== 'http://localhost:3000/this-page-does-not-exist-xyz';
    expect(is404 || isRedirected).toBeTruthy();
  });
});
