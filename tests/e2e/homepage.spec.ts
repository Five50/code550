import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/AltoFuel/);
  });

  test('displays navigation menu', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Check for main navigation links
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /posts/i })).toBeVisible();
  });

  test('displays logo and site name', async ({ page }) => {
    await expect(page.getByAltText('Logo')).toBeVisible();
    await expect(page.getByText(/AltoFuel/i)).toBeVisible();
  });

  test('has no accessibility violations', async ({ page }) => {
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  });

  test('navigation works correctly', async ({ page }) => {
    // Test posts navigation
    await page.getByRole('link', { name: /posts/i }).click();
    await expect(page).toHaveURL(/\/posts/);

    // Navigate back home
    await page.getByRole('link', { name: /home/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('mobile navigation works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Mobile nav should be visible on small screens
    const mobileNav = page.locator('[data-testid="mobile-nav"]');
    await expect(mobileNav).toBeVisible();
  });

  test('loads without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known harmless errors
    const significantErrors = errors.filter(error =>
      !error.includes('favicon') &&
      !error.includes('Extension')
    );

    expect(significantErrors).toHaveLength(0);
  });
});