import { describe, it, expect } from 'vitest';
import { mainMenu, contentMenu, navigationMenu, type NavigationMenuItem } from '@/menu.config';

describe('menu.config', () => {
  describe('mainMenu', () => {
    it('should have a home entry pointing to /', () => {
      expect(mainMenu.home).toBe('/');
    });

    it('should have string values for all entries', () => {
      for (const [key, value] of Object.entries(mainMenu)) {
        expect(typeof value).toBe('string');
        expect(value).toMatch(/^\//);
      }
    });
  });

  describe('contentMenu', () => {
    it('should have categories, tags, and authors entries', () => {
      expect(contentMenu.categories).toBeDefined();
      expect(contentMenu.tags).toBeDefined();
      expect(contentMenu.authors).toBeDefined();
    });

    it('should have paths starting with /posts/', () => {
      for (const value of Object.values(contentMenu)) {
        expect(value).toMatch(/^\/posts\//);
      }
    });
  });

  describe('navigationMenu', () => {
    it('should have at least one navigation item', () => {
      expect(Object.keys(navigationMenu).length).toBeGreaterThan(0);
    });

    it('each item should have a title', () => {
      for (const item of Object.values(navigationMenu)) {
        expect(item.title).toBeTruthy();
      }
    });

    it('link items should have an href', () => {
      for (const item of Object.values(navigationMenu)) {
        if ('href' in item) {
          expect(typeof item.href).toBe('string');
          expect(item.href).toMatch(/^\//);
        }
      }
    });

    it('dropdown items should have an items record with string values', () => {
      for (const item of Object.values(navigationMenu)) {
        if ('items' in item && !('type' in item)) {
          expect(typeof item.items).toBe('object');
          for (const [label, href] of Object.entries(item.items)) {
            expect(typeof label).toBe('string');
            expect(typeof href).toBe('string');
          }
        }
      }
    });

    it('mega menu items should have sections with proper structure', () => {
      for (const item of Object.values(navigationMenu)) {
        if ('type' in item && item.type === 'mega') {
          expect(item.sections).toBeDefined();
          for (const section of Object.values(item.sections)) {
            expect(section.title).toBeTruthy();
            expect(section.items).toBeDefined();
            for (const menuItem of Object.values(section.items)) {
              expect(menuItem.href).toBeTruthy();
            }
          }
        }
      }
    });
  });
});
