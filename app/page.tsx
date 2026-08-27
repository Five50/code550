import { getAllServices } from "@/lib/wordpress";
import { siteConfig } from "@/site.config";
import { HomePage } from "@/components/pages/home-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.site_name} — ${siteConfig.tagline}`,
  },
  description: siteConfig.site_description,
};

export default async function Page() {
  const services = await getAllServices(siteConfig.defaultLanguage);
  return <HomePage services={services} />;
}
