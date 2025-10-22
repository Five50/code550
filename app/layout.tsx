import "../styles/input.css";

import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeaderProvider } from "@/lib/header-context";
import { ThemeProvider } from "@/components/theme-provider";
import { TemplateUpdater } from "@/components/template-updater";
import { getPrimaryNavigation, getGlobalStyles, getTemplateForPath } from "@/lib/wordpress";
import Script from "next/script";
import { headers } from "next/headers";

import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AltoFuel - Next Generation Alternative Fuel Intelligence",
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

  // Only show landing page on actual production domain, not on preview/dev deployments
  const isProductionDomain = process.env.VERCEL_ENV === 'production' &&
    process.env.VERCEL_URL === siteConfig.site_domain.replace('https://', '');

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

        {/* WordPress Block Library Styles - Core Gutenberg block styles */}
        <link
          rel="stylesheet"
          href="https://digest.altofuel.com/wp-includes/css/dist/block-library/style.min.css"
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
          "min-h-screen font-sans antialiased text-slate-400 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950"
        )}
        data-template={template}
      >
        <ThemeProvider>
          <TemplateUpdater initialTemplate={template} />
          <HeaderProvider>
            {!isProductionDomain && <Header navigationItems={navigationItems} />}
            {children}
            {!isProductionDomain && <Footer />}
          </HeaderProvider>
        </ThemeProvider>
        <Analytics />

        {/* Alpine.js */}
        <Script
          src="/js/alpine.min.js"
          strategy="beforeInteractive"
          defer
        />

        {/* GSAP */}
        <Script
          src="/js/gsap.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}


