import "../styles/output.css";

import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeaderProvider } from "@/lib/header-context";
import { ThemeProvider } from "@/components/theme-provider";
import { getPrimaryNavigation } from "@/lib/wordpress";
import Script from "next/script";

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

  // Only show landing page on actual production domain, not on preview/dev deployments
  const isProductionDomain = process.env.VERCEL_ENV === 'production' &&
    process.env.VERCEL_URL === siteConfig.site_domain.replace('https://', '');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={cn(
        "min-h-screen font-sans antialiased",
        isProductionDomain
          ? "bg-blue-950 text-slate-400"
          : "text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900"
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
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


