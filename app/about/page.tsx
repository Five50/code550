import { getAllTeamMembers } from "@/lib/wordpress";
import { AboutPage } from "@/components/pages/about-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Code550",
  description:
    "Meet the team behind Code550. We combine technical excellence with business strategy.",
};

export default async function Page() {
  const teamMembers = await getAllTeamMembers("en");
  return <AboutPage teamMembers={teamMembers} />;
}
