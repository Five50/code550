import { NextRequest, NextResponse } from 'next/server';
import { siteConfig, type SupportedLanguage } from './site.config';

// Re-export for consumers
export type { SupportedLanguage };
export const supportedLanguages = siteConfig.supportedLanguages;
export const defaultLanguage: SupportedLanguage = siteConfig.defaultLanguage;

// Language detection and routing proxy
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Create request headers with pathname for layout access
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // Skip proxy for certain paths
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml') ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/posts/') ||
    pathname.startsWith('/pages/') ||
    pathname.includes('.') ||
    pathname === '/'
  ) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Check if pathname starts with a supported language
  const pathnameHasLocale = supportedLanguages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // For WordPress-style URLs (direct post/page slugs), handle language detection
  const acceptLanguage = request.headers.get('accept-language') || '';
  const detectedLanguage = detectLanguage(acceptLanguage);

  // Only redirect to language prefix for non-default languages
  if (detectedLanguage !== defaultLanguage) {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 1) {
      const redirectUrl = new URL(`/${detectedLanguage}${pathname}`, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

function detectLanguage(acceptLanguage: string): SupportedLanguage {
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, quality = '1'] = lang.trim().split(';q=');
      return {
        code: code.split('-')[0].toLowerCase(),
        quality: parseFloat(quality)
      };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const lang of languages) {
    if (supportedLanguages.includes(lang.code as SupportedLanguage)) {
      return lang.code as SupportedLanguage;
    }
  }

  return defaultLanguage;
}

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
