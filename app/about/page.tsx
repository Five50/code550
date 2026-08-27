import { getAllTeamMembers } from "@/lib/wordpress";
import { siteConfig } from "@/site.config";
import { AboutPage } from "@/components/pages/about-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the team behind Code550. We combine technical excellence with business strategy.",
};

export default async function Page() {
  const teamMembers = await getAllTeamMembers(siteConfig.defaultLanguage);
  return <AboutPage teamMembers={teamMembers} />;
}
