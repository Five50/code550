import { getAllServices } from "@/lib/wordpress";
import { HomePage } from "@/components/pages/home-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code550 — Build Digital Products That Convert",
  description:
    "We craft high-performance websites and applications that drive measurable results.",
};

export default async function Page() {
  const services = await getAllServices("en");
  return <HomePage services={services} />;
}
