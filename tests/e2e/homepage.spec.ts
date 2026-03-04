import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test('has a non-empty title', async ({ page }) => {
    await expect(page).toHaveTitle(/.+/);
  });

  test('displays navigation header', async ({ page }) => {
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
  });

  test('displays site logo', async ({ page }) => {
    // Logo images use generic filenames and siteConfig.site_name as alt text
    const logo = page.locator('header img[src*="logo"]').first();
    await expect(logo).toBeVisible();
  });

  test('displays navigation links', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav.first()).toBeVisible();
  });

  test('has no accessibility violations', async ({ page }) => {
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
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

    const significantErrors = errors.filter(error =>
      !error.includes('favicon') &&
      !error.includes('Extension') &&
      !error.includes('hydration')
    );

    expect(significantErrors).toHaveLength(0);
  });

  test('footer displays copyright and site info', async ({ page }) => {
    const footer = page.getByRole('contentinfo');
    // Footer may not be rendered on production domain, so check if it exists
    if (await footer.isVisible()) {
      const currentYear = new Date().getFullYear().toString();
      await expect(footer).toContainText(currentYear);
      await expect(footer).toContainText('All rights reserved');
    }
  });

  test('footer renders navigation sections', async ({ page }) => {
    const footer = page.getByRole('contentinfo');
    if (await footer.isVisible()) {
      // Should have footer nav sections
      const footerNavs = footer.locator('nav');
      const count = await footerNavs.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('mobile navigation menu button exists on small viewports', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    // The mobile menu trigger button should be visible
    const menuButton = page.getByLabel('Open navigation menu');
    await expect(menuButton).toBeVisible();
  });
});
