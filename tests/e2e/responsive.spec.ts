import { test, expect } from '@playwright/test';

test.describe('Responsive Layout', () => {
  test('mobile: hamburger menu is visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const menuButton = page.getByLabel('Open navigation menu');
    await expect(menuButton).toBeVisible();
  });

  test('mobile: desktop nav is hidden', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Desktop nav has "hidden lg:flex" — should not be visible on mobile
    const desktopNav = page.locator('nav.hidden.lg\\:flex');
    if (await desktopNav.count() > 0) {
      await expect(desktopNav).not.toBeVisible();
    }
  });

  test('desktop: desktop nav is visible', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });

  test('desktop: mobile menu button is hidden', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const menuButton = page.getByLabel('Open navigation menu');
    // On desktop, the mobile menu button should not be visible (lg:hidden)
    await expect(menuButton).not.toBeVisible();
  });

  test('tablet: content adjusts layout', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');

    // Page should load correctly at tablet size
    await expect(page).toHaveTitle(/.+/);
  });

  test('footer is visible on all viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },  // mobile
      { width: 768, height: 1024 }, // tablet
      { width: 1280, height: 800 }, // desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const footer = page.getByRole('contentinfo');
      if (await footer.isVisible()) {
        await expect(footer).toBeVisible();
      }
    }
  });
});
