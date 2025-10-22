import { getPageBySlug, getAllPages, getPostStyles } from "@/lib/wordpress";
import { filterWpStyles } from "@/lib/filter-wp-styles";

import { PageTemplate } from "@/components/templates/page";
import { PageNoTitleTemplate } from "@/components/templates/page-no-title";
import { siteConfig } from "@/site.config";

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

  // Fetch page-specific styles from WordPress
  const rawStyles = await getPostStyles(page.id);
  const pageStyles = filterWpStyles(rawStyles);

  // Check if this page uses the no-title template
  const isNoTitle = page.template === 'page-no-title';

  // Use appropriate template based on page settings
  if (isNoTitle) {
    return <PageNoTitleTemplate page={page} styles={pageStyles} />;
  }

  return <PageTemplate page={page} styles={pageStyles} />;
}
