import { getPageBySlug } from "@/lib/wordpress";
import { LegalPage } from "@/components/pages/legal-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — Code550",
};

export default async function Page() {
  const page = await getPageBySlug("cookies");
  return (
    <LegalPage
      title="Cookie Policy"
      breadcrumbLabel="Cookie Policy"
      content={page?.content?.rendered || ""}
      lastUpdated={page?.modified || ""}
    />
  );
}
