import { getPageBySlug } from "@/lib/wordpress";
import { LegalPage } from "@/components/pages/legal-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Code550",
};

export default async function Page() {
  const page = await getPageBySlug("privacy");
  return (
    <LegalPage
      title="Privacy Policy"
      breadcrumbLabel="Privacy Policy"
      content={page?.content?.rendered || ""}
      lastUpdated={page?.modified || ""}
    />
  );
}
