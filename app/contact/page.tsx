import { ContactPage } from "@/components/pages/contact-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch to discuss your next web project.",
};

export default function Page() {
  return <ContactPage />;
}
