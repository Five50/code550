import { getCaseStudyBySlug, getAllCaseStudies } from "@/lib/wordpress";
import { CaseStudyPage } from "@/components/pages/case-study-page";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const caseStudies = await getAllCaseStudies();
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);
  return {
    title: caseStudy
      ? `${caseStudy.title.rendered} — Code550`
      : "Case Study — Code550",
    description: caseStudy?.acf?.tagline || "",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);
  if (!caseStudy) notFound();
  return <CaseStudyPage caseStudy={caseStudy} />;
}
