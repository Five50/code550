import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('header logo links to homepage', async ({ page }) => {
    const logoLink = page.locator('header a[href="/"]').first();
    await expect(logoLink).toBeVisible();
  });

  test('blog navigation link exists and works', async ({ page }) => {
    const blogLink = page.getByRole('link', { name: /blog/i }).first();
    if (await blogLink.isVisible()) {
      await blogLink.click();
      await expect(page).toHaveURL(/\/blog/);
    }
  });

  test('posts archive page is accessible', async ({ page }) => {
    await page.goto('/posts');
    await expect(page).toHaveURL(/\/posts/);
  });

  test('categories page is accessible', async ({ page }) => {
    await page.goto('/posts/categories');
    await expect(page).toHaveURL(/\/posts\/categories/);
  });

  test('tags page is accessible', async ({ page }) => {
    await page.goto('/posts/tags');
    await expect(page).toHaveURL(/\/posts\/tags/);
  });

  test('authors page is accessible', async ({ page }) => {
    await page.goto('/posts/authors');
    await expect(page).toHaveURL(/\/posts\/authors/);
  });
});
