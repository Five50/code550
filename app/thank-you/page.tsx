import { ThankYouPage } from "@/components/pages/thank-you-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You — Code550",
  description: "Thank you for reaching out.",
};

export default function Page() {
  return <ThankYouPage />;
}
