import { getServiceBySlug, getAllServices } from "@/lib/wordpress";
import { ServiceDetailPage } from "@/components/pages/service-detail-page";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  try {
    const services = await getAllServices();
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  return {
    title: service
      ? `${service.title.rendered} — Code550`
      : "Service — Code550",
    description: service?.acf?.description || "",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();
  return <ServiceDetailPage service={service} />;
}
