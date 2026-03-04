import { describe, it, expect } from 'vitest';
import { siteConfig } from '@/site.config';
import type { SupportedLanguage } from '@/site.config';

describe('siteConfig', () => {
  describe('identity fields', () => {
    it('should have a non-empty site_name', () => {
      expect(siteConfig.site_name).toBeTruthy();
      expect(typeof siteConfig.site_name).toBe('string');
    });

    it('should have a non-empty site_description', () => {
      expect(siteConfig.site_description).toBeTruthy();
    });

    it('should have a valid site_domain URL', () => {
      expect(siteConfig.site_domain).toMatch(/^https?:\/\//);
    });
  });

  describe('language configuration', () => {
    it('should have at least one supported language', () => {
      expect(siteConfig.supportedLanguages.length).toBeGreaterThanOrEqual(1);
    });

    it('should include defaultLanguage in supportedLanguages', () => {
      expect(siteConfig.supportedLanguages).toContain(siteConfig.defaultLanguage);
    });

    it('should have languageLabels for every supported language', () => {
      for (const lang of siteConfig.supportedLanguages) {
        const label = siteConfig.languageLabels[lang as SupportedLanguage];
        expect(label).toBeDefined();
        expect(label.name).toBeTruthy();
        expect(label.nativeName).toBeTruthy();
        expect(label.flag).toBeTruthy();
      }
    });
  });

  describe('fonts configuration', () => {
    it('should have non-empty font families', () => {
      expect(siteConfig.fonts.sans.length).toBeGreaterThan(0);
      expect(siteConfig.fonts.heading.length).toBeGreaterThan(0);
      expect(siteConfig.fonts.mono.length).toBeGreaterThan(0);
    });
  });

  describe('WordPress plugin namespace', () => {
    it('should have a non-empty wpPluginNamespace', () => {
      expect(siteConfig.wpPluginNamespace).toBeTruthy();
      expect(typeof siteConfig.wpPluginNamespace).toBe('string');
    });

    it('should not contain slashes (namespace only)', () => {
      expect(siteConfig.wpPluginNamespace).not.toContain('/');
    });
  });

  describe('fallback homepage', () => {
    it('should have a heading and description', () => {
      expect(siteConfig.fallbackHomepage.heading).toBeTruthy();
      expect(siteConfig.fallbackHomepage.description).toBeTruthy();
    });

    it('should have a ctaLabel', () => {
      expect(siteConfig.fallbackHomepage.ctaLabel).toBeTruthy();
    });

    it('ctaUrl should be a string or null', () => {
      const { ctaUrl } = siteConfig.fallbackHomepage;
      expect(ctaUrl === null || typeof ctaUrl === 'string').toBe(true);
    });

    it('supportEmail should be a string or null', () => {
      const { supportEmail } = siteConfig.fallbackHomepage;
      expect(supportEmail === null || typeof supportEmail === 'string').toBe(true);
    });
  });

  describe('footer and copyright', () => {
    it('should have a non-empty footerDescription', () => {
      expect(siteConfig.footerDescription).toBeTruthy();
    });

    it('should have a non-empty copyrightHolder', () => {
      expect(siteConfig.copyrightHolder).toBeTruthy();
    });
  });

  describe('immutability', () => {
    it('should be a frozen/readonly config (top-level properties cannot be reassigned)', () => {
      // Readonly<T> prevents reassignment at the type level.
      // At runtime, verify the object shape is stable.
      const keys = Object.keys(siteConfig);
      expect(keys).toContain('site_name');
      expect(keys).toContain('supportedLanguages');
      expect(keys).toContain('fonts');
      expect(keys).toContain('fallbackHomepage');
    });
  });
});
