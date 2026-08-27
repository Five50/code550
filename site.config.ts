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

type BrandLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type ContactDetails = {
  email: string;
  phone: string | null;
  location: string | null;
};

type SocialLinks = {
  twitter: string | null;
  github: string | null;
  linkedin: string | null;
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
  tagline: string;
  logo: BrandLogo;
  contact: ContactDetails;
  social: SocialLinks;

  // Language
  defaultLanguage: TLangs[number];
  supportedLanguages: TLangs;
  languageLabels: Record<TLangs[number], LanguageLabel>;

  // Typography (Tailwind font families)
  fonts: FontConfig;

  // Stylesheet providing the families above. Null if fonts are self-hosted.
  googleFontsUrl: string | null;

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
  tagline: "Build Digital Products That Convert",
  logo: {
    src: "/images/code550-logo.png",
    alt: "Code550",
    width: 240,
    height: 32,
  },
  contact: {
    email: "hello@code550.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
  },
  social: {
    twitter: null,
    github: null,
    linkedin: null,
  },

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

  googleFontsUrl:
    "https://fonts.googleapis.com/css2?family=Syne:wght@400..800&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:wght@400;500;600&display=swap",

  // Theme
  darkMode: true,

  // WordPress plugin namespace
  wpPluginNamespace: "code550-wp",

  // Fallback homepage
  fallbackHomepage: {
    heading: "Build Digital Products That Convert",
    description: "We craft high-performance websites and applications that drive measurable results.",
    ctaUrl: null,
    ctaLabel: "Get in Touch",
    supportEmail: "hello@code550.com",
  },

  // Footer
  footerDescription: "We craft high-performance websites and applications that drive measurable results. From strategy to deployment, we're your technical partner for growth.",

  // Copyright
  copyrightHolder: "Code550",
};

// Derived types for consumers
export type SupportedLanguage = typeof siteConfig.supportedLanguages[number];
