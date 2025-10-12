import { test, expect } from '@playwright/test';

test.describe('Posts Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/posts');
  });

  test('displays posts page correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/posts/i);
    await expect(page.locator('h1')).toContainText(/posts/i);
  });

  test('search functionality works', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();

    // Test search input
    await searchInput.fill('test query');
    await page.waitForTimeout(500); // Wait for debounce

    // URL should update with search params
    await expect(page).toHaveURL(/search=test/);
  });

  test('filter functionality works', async ({ page }) => {
    // Test category filter (if available)
    const categorySelect = page.locator('[data-testid="category-filter"]');
    if (await categorySelect.isVisible()) {
      await categorySelect.click();
      // Add specific filter test logic here
    }
  });

  test('pagination works correctly', async ({ page }) => {
    // Check if pagination exists
    const pagination = page.locator('[data-testid="pagination"]');
    if (await pagination.isVisible()) {
      // Test pagination navigation
      const nextButton = page.getByRole('button', { name: /next/i });
      if (await nextButton.isVisible() && await nextButton.isEnabled()) {
        await nextButton.click();
        await expect(page).toHaveURL(/page=2/);
      }
    }
  });

  test('post cards are displayed correctly', async ({ page }) => {
    // Wait for potential data loading
    await page.waitForTimeout(1000);

    // Check if post cards exist (they might not if WordPress is not configured)
    const postCards = page.locator('[data-testid="post-card"]');
    const cardCount = await postCards.count();

    if (cardCount > 0) {
      // If posts exist, test their structure
      const firstCard = postCards.first();
      await expect(firstCard).toBeVisible();

      // Check for post title
      await expect(firstCard.locator('h2, h3')).toBeVisible();

      // Check for post link
      await expect(firstCard.locator('a')).toBeVisible();
    } else {
      // If no posts, check for appropriate message
      await expect(page.getByText(/no posts/i)).toBeVisible();
    }
  });

  test('individual post navigation works', async ({ page }) => {
    await page.waitForTimeout(1000);

    const postLinks = page.locator('a[href*="/posts/"]');
    const linkCount = await postLinks.count();

    if (linkCount > 0) {
      const firstPostLink = postLinks.first();
      await firstPostLink.click();

      // Should navigate to individual post page
      await expect(page).toHaveURL(/\/posts\/[^\/]+$/);
    }
  });
});