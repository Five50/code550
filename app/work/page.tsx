import { getAllCaseStudies, getProjectCategories } from "@/lib/wordpress";
import { WorkPage } from "@/components/pages/work-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work — Code550",
  description:
    "Case studies showcasing our best web development projects.",
};

export default async function Page() {
  const [caseStudies, categories] = await Promise.all([
    getAllCaseStudies("en"),
    getProjectCategories(),
  ]);
  return <WorkPage caseStudies={caseStudies} categories={categories} />;
}
