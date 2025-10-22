import { NextRequest, NextResponse } from 'next/server';

// Supported languages
export const supportedLanguages = ['en', 'es'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

export const defaultLanguage: SupportedLanguage = 'en';

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
    pathname.startsWith('/blog') || // Skip blog page
    pathname.startsWith('/posts/') || // Keep /posts/ for archive pages
    pathname.startsWith('/pages/') || // Keep /pages/ for archive pages
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
    // If URL already has a language prefix, continue
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
  // This allows direct URLs like /my-post or /my-page to work in English
  if (detectedLanguage !== defaultLanguage) {
    // Check if this is a potential post/page slug (not an archive page)
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 1) {
      const redirectUrl = new URL(`/${detectedLanguage}${pathname}`, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // For default language (English), we don't add a prefix
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

function detectLanguage(acceptLanguage: string): SupportedLanguage {
  // Parse Accept-Language header
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

  // Find first supported language
  for (const lang of languages) {
    if (supportedLanguages.includes(lang.code as SupportedLanguage)) {
      return lang.code as SupportedLanguage;
    }
  }

  return defaultLanguage;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc.)
    '/((?!api/|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};