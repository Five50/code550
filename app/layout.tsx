import "../styles/input.css";

import { Analytics } from "@vercel/analytics/react";
import { HeaderWithContact } from "@/components/layout/header-with-contact";
import { Footer } from "@/components/layout/footer";
import { HeaderProvider } from "@/lib/header-context";
import { ThemeProvider } from "@/components/theme-provider";
import { TemplateUpdater } from "@/components/template-updater";
import { ContactModalProvider } from "@/lib/contact-modal-context";
import { ContactModal } from "@/components/contact-modal";
import {
  getPrimaryNavigation,
  getFooterNavigation,
  getGlobalStyles,
  getTemplateForPath,
} from "@/lib/wordpress";
import { headers } from "next/headers";

import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.site_name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.site_name}`,
  },
  description: siteConfig.site_description,
  metadataBase: new URL(siteConfig.site_domain),
  alternates: {
    canonical: "/",
  },
};

/** Quote family names that need it, then emit the CSS custom properties. */
function toFontStack(families: readonly string[]): string {
  return families
    .map((family) => (/\s/.test(family) ? `'${family}'` : family))
    .join(", ");
}

const fontVariables = `:root {
  --site-font-sans: ${toFontStack(siteConfig.fonts.sans)};
  --site-font-display: ${toFontStack(siteConfig.fonts.heading)};
  --site-font-mono: ${toFontStack(siteConfig.fonts.mono)};
}`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch navigation menus and global styles from WordPress in parallel
  const [primaryNavigation, footerNavigation, globalStyles] = await Promise.all([
    getPrimaryNavigation(siteConfig.defaultLanguage),
    getFooterNavigation(siteConfig.defaultLanguage),
    getGlobalStyles(),
  ]);

  // Get current pathname and determine WordPress template
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  const template = await getTemplateForPath(pathname);

  const isProductionDomain = process.env.VERCEL_ENV === 'production';

  return (
    <html
      lang={siteConfig.defaultLanguage}
      className="dark"
      suppressHydrationWarning
    >
      <head>
        {/* Font families come from site.config.ts so each site ships its own */}
        {siteConfig.googleFontsUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="anonymous"
            />
            <link rel="stylesheet" href={siteConfig.googleFontsUrl} />
          </>
        )}
        <style
          id="site-fonts"
          dangerouslySetInnerHTML={{ __html: fontVariables }}
        />
        {/* WordPress global styles - injected inline BEFORE Tailwind bundle loads */}
        {globalStyles && (
          <style
            id="wp-global-styles"
            dangerouslySetInnerHTML={{ __html: globalStyles }}
          />
        )}

        {/* WordPress Block Library Styles - proxied to hide WP origin */}
        <link
          rel="stylesheet"
          href="/api/wp-css"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.classList.add('dark');
              })();
            `,
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen font-sans antialiased"
        )}
        data-template={template}
      >
        <ThemeProvider>
          <ContactModalProvider>
            <TemplateUpdater initialTemplate={template} />
            <HeaderProvider>
              {!isProductionDomain && (
                <HeaderWithContact navItems={primaryNavigation} />
              )}
              {children}
              {!isProductionDomain && <Footer navItems={footerNavigation} />}
            </HeaderProvider>
            <ContactModal />
          </ContactModalProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}


