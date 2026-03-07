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
  site_name: "Code550",
  site_description: "We craft high-performance websites and applications that drive measurable results.",
  site_domain: "https://code550.com",

  // Language
  defaultLanguage: "en",
  supportedLanguages,
  languageLabels: {
    en: { name: "English", nativeName: "English", flag: "🇺🇸" },
  },

  // Typography
  fonts: {
    sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
    heading: ["Syne", "ui-sans-serif", "system-ui", "sans-serif"],
    mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
  },

  // Theme
  darkMode: true,

  // WordPress plugin namespace
  wpPluginNamespace: "code550-wp",

  // Fallback homepage
  fallbackHomepage: {
    heading: "Next Generation Alternative Fuel Intelligence",
    description: "Advanced analytics and insights for the alternative fuel industry. Powered by real-time data and industry expertise.",
    ctaUrl: "https://app.altofuel.com",
    ctaLabel: "Access Platform",
    supportEmail: "info@altofuel.com",
  },

  // Footer
  footerDescription: "We craft high-performance websites and applications that drive measurable results. From strategy to deployment, we're your technical partner for growth.",

  // Copyright
  copyrightHolder: "Code550",
};

// Derived types for consumers
export type SupportedLanguage = typeof siteConfig.supportedLanguages[number];
