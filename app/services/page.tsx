import { getAllServices } from "@/lib/wordpress";
import { ServicesPage } from "@/components/pages/services-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Code550",
  description:
    "End-to-end web development solutions designed for performance, scalability, and conversion.",
};

export default async function Page() {
  const services = await getAllServices("en");
  return <ServicesPage services={services} />;
}
