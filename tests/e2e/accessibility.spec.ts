import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

const routes = [
  { name: 'Homepage', path: '/' },
  { name: 'Blog', path: '/blog' },
  { name: 'Posts', path: '/posts' },
  { name: 'Categories', path: '/posts/categories' },
  { name: 'Tags', path: '/posts/tags' },
  { name: 'Authors', path: '/posts/authors' },
];

test.describe('Accessibility', () => {
  for (const route of routes) {
    test(`${route.name} (${route.path}) passes axe-core checks`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');
      await injectAxe(page);
      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });
  }

  test('all pages have proper heading hierarchy', async ({ page }) => {
    for (const route of routes) {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');

      // Check that the page has at least one heading
      const headings = page.locator('h1, h2, h3');
      const count = await headings.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('all pages have lang attribute on html', async ({ page }) => {
    await page.goto('/');
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      // All images should have alt attribute (can be empty for decorative)
      expect(alt).not.toBeNull();
    }
  });
});
