import { isValidLanguage, normalizeLanguage } from '../../lib/i18n';
import { siteConfig } from '../../site.config';
import { notFound } from 'next/navigation';

interface LanguageLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LanguageLayout({ children, params }: LanguageLayoutProps) {
  const { lang } = await params;

  // Validate language parameter
  if (!isValidLanguage(lang)) {
    notFound();
  }

  return <>{children}</>;
}

export async function generateStaticParams() {
  return siteConfig.supportedLanguages.map((lang) => ({ lang }));
}
