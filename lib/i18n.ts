import { supportedLanguages, defaultLanguage, SupportedLanguage } from '../middleware';

// Language configuration
export const languageConfig = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
} as const;

// Get language from pathname
export function getLanguageFromPathname(pathname: string): SupportedLanguage {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (supportedLanguages.includes(firstSegment as SupportedLanguage)) {
    return firstSegment as SupportedLanguage;
  }

  return defaultLanguage;
}

// Remove language prefix from pathname
export function removeLanguagePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (supportedLanguages.includes(firstSegment as SupportedLanguage)) {
    return '/' + segments.slice(1).join('/');
  }

  return pathname;
}

// Add language prefix to pathname
export function addLanguagePrefix(pathname: string, language: SupportedLanguage): string {
  if (language === defaultLanguage) {
    return pathname;
  }

  const cleanPath = removeLanguagePrefix(pathname);
  return `/${language}${cleanPath}`;
}

// Generate alternate language URLs
export function generateAlternateUrls(pathname: string, baseUrl?: string): Record<SupportedLanguage, string> {
  const cleanPath = removeLanguagePrefix(pathname);
  const urls = {} as Record<SupportedLanguage, string>;

  supportedLanguages.forEach(lang => {
    const langPath = addLanguagePrefix(cleanPath, lang);
    urls[lang] = baseUrl ? `${baseUrl}${langPath}` : langPath;
  });

  return urls;
}

// Validation helpers
export function isValidLanguage(lang: string): lang is SupportedLanguage {
  return supportedLanguages.includes(lang as SupportedLanguage);
}

export function normalizeLanguage(lang?: string): SupportedLanguage {
  if (!lang || !isValidLanguage(lang)) {
    return defaultLanguage;
  }
  return lang;
}