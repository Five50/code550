import { getPageBySlug } from "@/lib/wordpress";
import { LegalPage } from "@/components/pages/legal-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default async function Page() {
  const page = await getPageBySlug("terms");
  return (
    <LegalPage
      title="Terms of Service"
      breadcrumbLabel="Terms of Service"
      content={page?.content?.rendered || ""}
      lastUpdated={page?.modified || ""}
    />
  );
}
