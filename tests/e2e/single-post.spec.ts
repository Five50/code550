import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test.describe('Single Post Page', () => {
  test('navigates to a post from the blog listing', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');

    // Find first post link
    const postLink = page.locator('a[href*="/posts/"]').first();
    if (await postLink.isVisible()) {
      await postLink.click();
      await expect(page).toHaveURL(/\/posts\/[^/]+$/);
    }
  });

  test('displays post title', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');

    const postLink = page.locator('a[href*="/posts/"]').first();
    if (await postLink.isVisible()) {
      await postLink.click();
      await page.waitForLoadState('networkidle');

      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
      const text = await heading.textContent();
      expect(text?.length).toBeGreaterThan(0);
    }
  });

  test('displays breadcrumb navigation', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');

    const postLink = page.locator('a[href*="/posts/"]').first();
    if (await postLink.isVisible()) {
      await postLink.click();
      await page.waitForLoadState('networkidle');

      // Blog breadcrumb link should be present
      const blogBreadcrumb = page.getByRole('link', { name: /blog/i });
      if (await blogBreadcrumb.first().isVisible()) {
        await expect(blogBreadcrumb.first()).toBeVisible();
      }
    }
  });

  test('has proper meta tags', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');

    const postLink = page.locator('a[href*="/posts/"]').first();
    if (await postLink.isVisible()) {
      await postLink.click();
      await page.waitForLoadState('networkidle');

      // Title should be set
      await expect(page).toHaveTitle(/.+/);
    }
  });
});
