import { getAllServices } from "@/lib/wordpress";
import { siteConfig } from "@/site.config";
import { ServicesPage } from "@/components/pages/services-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "End-to-end web development solutions designed for performance, scalability, and conversion.",
};

export default async function Page() {
  const services = await getAllServices(siteConfig.defaultLanguage);
  return <ServicesPage services={services} />;
}
