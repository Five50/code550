import { describe, it, expect } from 'vitest';
import {
  getLanguageFromPathname,
  removeLanguagePrefix,
  addLanguagePrefix,
  generateAlternateUrls,
  isValidLanguage,
  normalizeLanguage,
  languageConfig,
} from '@/lib/i18n';
import { siteConfig } from '@/site.config';

describe('i18n utility functions', () => {
  describe('languageConfig', () => {
    it('should match siteConfig.languageLabels', () => {
      expect(languageConfig).toBe(siteConfig.languageLabels);
    });

    it('should have entries for all supported languages', () => {
      for (const lang of siteConfig.supportedLanguages) {
        expect(languageConfig[lang]).toBeDefined();
        expect(languageConfig[lang].name).toBeTruthy();
        expect(languageConfig[lang].nativeName).toBeTruthy();
        expect(languageConfig[lang].flag).toBeTruthy();
      }
    });
  });

  describe('getLanguageFromPathname', () => {
    it('should return the language from a pathname with a language prefix', () => {
      expect(getLanguageFromPathname('/en/about')).toBe('en');
    });

    it('should return the default language for a pathname without a language prefix', () => {
      expect(getLanguageFromPathname('/about')).toBe(siteConfig.defaultLanguage);
    });

    it('should return the default language for the root path', () => {
      expect(getLanguageFromPathname('/')).toBe(siteConfig.defaultLanguage);
    });

    it('should return the default language for an unsupported language prefix', () => {
      expect(getLanguageFromPathname('/fr/about')).toBe(siteConfig.defaultLanguage);
    });
  });

  describe('removeLanguagePrefix', () => {
    it('should remove a valid language prefix from the pathname', () => {
      expect(removeLanguagePrefix('/en/about')).toBe('/about');
    });

    it('should return the same pathname if no language prefix exists', () => {
      expect(removeLanguagePrefix('/about')).toBe('/about');
    });

    it('should handle root path', () => {
      expect(removeLanguagePrefix('/')).toBe('/');
    });

    it('should handle deeply nested paths', () => {
      expect(removeLanguagePrefix('/en/posts/my-post')).toBe('/posts/my-post');
    });

    it('should not remove an unsupported language prefix', () => {
      expect(removeLanguagePrefix('/fr/about')).toBe('/fr/about');
    });
  });

  describe('addLanguagePrefix', () => {
    it('should not add prefix for the default language', () => {
      expect(addLanguagePrefix('/about', siteConfig.defaultLanguage as any)).toBe('/about');
    });

    it('should add prefix for a non-default language', () => {
      // Only test if there are multiple supported languages
      const nonDefault = siteConfig.supportedLanguages.find(
        (l) => l !== siteConfig.defaultLanguage
      );
      if (nonDefault) {
        expect(addLanguagePrefix('/about', nonDefault as any)).toBe(`/${nonDefault}/about`);
      }
    });

    it('should not double-prefix a path', () => {
      const nonDefault = siteConfig.supportedLanguages.find(
        (l) => l !== siteConfig.defaultLanguage
      );
      if (nonDefault) {
        expect(addLanguagePrefix(`/${nonDefault}/about`, nonDefault as any)).toBe(`/${nonDefault}/about`);
      }
    });
  });

  describe('generateAlternateUrls', () => {
    it('should generate URLs for all supported languages', () => {
      const urls = generateAlternateUrls('/about');
      for (const lang of siteConfig.supportedLanguages) {
        expect(urls[lang]).toBeDefined();
      }
    });

    it('should include baseUrl when provided', () => {
      const urls = generateAlternateUrls('/about', 'https://example.com');
      for (const lang of siteConfig.supportedLanguages) {
        expect(urls[lang]).toContain('https://example.com');
      }
    });

    it('should produce relative URLs when no baseUrl is provided', () => {
      const urls = generateAlternateUrls('/about');
      for (const lang of siteConfig.supportedLanguages) {
        expect(urls[lang]).toMatch(/^\//);
      }
    });
  });

  describe('isValidLanguage', () => {
    it('should return true for supported languages', () => {
      for (const lang of siteConfig.supportedLanguages) {
        expect(isValidLanguage(lang)).toBe(true);
      }
    });

    it('should return false for unsupported languages', () => {
      expect(isValidLanguage('xx')).toBe(false);
      expect(isValidLanguage('')).toBe(false);
      expect(isValidLanguage('français')).toBe(false);
    });
  });

  describe('normalizeLanguage', () => {
    it('should return the language if it is valid', () => {
      expect(normalizeLanguage('en')).toBe('en');
    });

    it('should return the default language for an invalid language', () => {
      expect(normalizeLanguage('xx')).toBe(siteConfig.defaultLanguage);
    });

    it('should return the default language for undefined', () => {
      expect(normalizeLanguage(undefined)).toBe(siteConfig.defaultLanguage);
    });

    it('should return the default language for empty string', () => {
      expect(normalizeLanguage('')).toBe(siteConfig.defaultLanguage);
    });
  });
});
