import "../styles/input.css";

import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeaderProvider } from "@/lib/header-context";
import { ThemeProvider } from "@/components/theme-provider";
import { TemplateUpdater } from "@/components/template-updater";
import { getPrimaryNavigation, getGlobalStyles, getTemplateForPath } from "@/lib/wordpress";
import { headers } from "next/headers";

import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: siteConfig.site_name,
  description: siteConfig.site_description,
  metadataBase: new URL(siteConfig.site_domain),
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch navigation menu from WordPress
  const navigationItems = await getPrimaryNavigation('en');

  // Fetch WordPress global styles to inject before Tailwind
  const globalStyles = await getGlobalStyles();

  // Get current pathname and determine WordPress template
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  const template = await getTemplateForPath(pathname);

  const isProductionDomain = process.env.VERCEL_ENV === 'production';

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
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
          <TemplateUpdater initialTemplate={template} />
          <HeaderProvider>
            {!isProductionDomain && <Header />}
            {children}
            {!isProductionDomain && <Footer />}
          </HeaderProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}


