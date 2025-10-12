import "../styles/output.css";

import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeaderProvider } from "@/lib/header-context";
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

  // Hide header/footer in production (landing page has its own)
  const isProduction = true; // process.env.NODE_ENV === 'production';

  return (
    <html lang="en">
      <head />
      <body className={cn(
        "min-h-screen font-sans antialiased",
        isProduction
          ? "bg-blue-950 text-slate-400"
          : "text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900"
      )}>
        <HeaderProvider>
          {!isProduction && <Header navigationItems={navigationItems} />}
          {isProduction ? (
            children
          ) : (
            <main style={{ viewTransitionName: 'main' }}>{children}</main>
          )}
          {!isProduction && <Footer />}
        </HeaderProvider>
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


