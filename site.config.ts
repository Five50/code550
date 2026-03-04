// --- Reusable sub-types ---

type LanguageLabel = {
  name: string;
  nativeName: string;
  flag: string;
};

type FontConfig = {
  sans: readonly string[];
  heading: readonly string[];
  mono: readonly string[];
};

type FallbackHomepage = {
  heading: string;
  description: string;
  ctaUrl: string | null;
  ctaLabel: string;
  supportEmail: string | null;
};

type SiteConfig<TLangs extends readonly string[] = readonly string[]> = {
  // Identity
  site_name: string;
  site_description: string;
  site_domain: string;

  // Language
  defaultLanguage: TLangs[number];
  supportedLanguages: TLangs;
  languageLabels: Record<TLangs[number], LanguageLabel>;

  // Typography (Tailwind font families)
  fonts: FontConfig;

  // Theme
  darkMode: boolean;

  // WordPress custom plugin namespace
  // Your WP plugin must expose:
  //   /wp-json/{namespace}/v1/global-styles-css
  //   /wp-json/{namespace}/v1/post-styles/{id}
  wpPluginNamespace: string;

  // Fallback homepage content (used when WordPress front page isn't set)
  fallbackHomepage: FallbackHomepage;

  // Footer description
  footerDescription: string;

  // Copyright
  copyrightHolder: string;
};

// Use `as const` on supportedLanguages to preserve literal types,
// then Readonly on the full config to ensure immutability.
const supportedLanguages = ["en"] as const;

export const siteConfig: Readonly<SiteConfig<typeof supportedLanguages>> = {
  // Identity
  site_name: "My Site",
  site_description: "A Next.js + headless WordPress starter template",
  site_domain: "https://example.com",

  // Language
  defaultLanguage: "en",
  supportedLanguages,
  languageLabels: {
    en: { name: "English", nativeName: "English", flag: "🇺🇸" },
  },

  // Typography
  fonts: {
    sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
    heading: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
    mono: ["ui-monospace", "SFMono-Regular", "monospace"],
  },

  // Theme
  darkMode: true,

  // WordPress plugin namespace
  wpPluginNamespace: "starter-wp",

  // Fallback homepage
  fallbackHomepage: {
    heading: "Welcome",
    description: "Your site description here.",
    ctaUrl: null,
    ctaLabel: "Get Started",
    supportEmail: null,
  },

  // Footer
  footerDescription: "A modern headless WordPress site powered by Next.js.",

  // Copyright
  copyrightHolder: "My Site",
};

// Derived types for consumers
export type SupportedLanguage = typeof siteConfig.supportedLanguages[number];
