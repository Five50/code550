import { getAllCaseStudies, getProjectCategories } from "@/lib/wordpress";
import { siteConfig } from "@/site.config";
import { WorkPage } from "@/components/pages/work-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Case studies showcasing our best web development projects.",
};

export default async function Page() {
  const [caseStudies, categories] = await Promise.all([
    getAllCaseStudies(siteConfig.defaultLanguage),
    getProjectCategories(),
  ]);
  return <WorkPage caseStudies={caseStudies} categories={categories} />;
}
