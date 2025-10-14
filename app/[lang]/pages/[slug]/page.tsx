import { getPageBySlug, getAllPages, getTemplateBySlug } from "@/lib/wordpress";
import { processWPContent, applyTemplate } from "@/lib/process-wp-content";
import { Section } from "@/components/craft";
import { siteConfig } from "@/site.config";
import Balancer from "react-wrap-balancer";
import parse from "html-react-parser";

import type { Metadata } from "next";

// Revalidate pages every hour
export const revalidate = 3600;

export async function generateStaticParams() {
  const pages = await getAllPages();

  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {};
  }

  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", page.title.rendered);
  // Strip HTML tags for description and limit length
  const description = page.excerpt?.rendered
    ? page.excerpt.rendered.replace(/<[^>]*>/g, "").trim()
    : page.content.rendered
        .replace(/<[^>]*>/g, "")
        .trim()
        .slice(0, 200) + "...";
  ogUrl.searchParams.append("description", description);

  return {
    title: page.title.rendered,
    description: description,
    openGraph: {
      title: page.title.rendered,
      description: description,
      type: "article",
      url: `${siteConfig.site_domain}/pages/${page.slug}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: page.title.rendered,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title.rendered,
      description: description,
      images: [ogUrl.toString()],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  // Fetch the WordPress template
  const template = await getTemplateBySlug('page');

  if (template) {
    // Apply template with content
    const templatedContent = applyTemplate(template.content.raw, {
      title: page.title.rendered,
      content: page.content.rendered,
    });

    // Process WordPress classes to Tailwind
    const processedContent = processWPContent(templatedContent);

    return <>{parse(processedContent)}</>;
  }

  // Fallback if template not available
  return (
    <Section>
      <h2>
        <Balancer>{page.title.rendered}</Balancer>
      </h2>
      {parse(processWPContent(page.content.rendered))}
    </Section>
  );
}
