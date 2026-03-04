import {
  getPostBySlug,
  getAllPostSlugs,
  getPostStyles,
} from "@/lib/wordpress";
import { filterWpStyles } from "@/lib/filter-wp-styles";

import { SingleTemplate } from "@/components/templates/single";
import { siteConfig } from "@/site.config";

import type { Metadata } from "next";

export async function generateStaticParams() {
  try {
    return await getAllPostSlugs();
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
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", post.title.rendered);
  // Strip HTML tags for description
  const description = post.excerpt.rendered.replace(/<[^>]*>/g, "").trim();
  ogUrl.searchParams.append("description", description);

  return {
    title: post.title.rendered,
    description: description,
    openGraph: {
      title: post.title.rendered,
      description: description,
      type: "article",
      url: `${siteConfig.site_domain}/posts/${post.slug}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title.rendered,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title.rendered,
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

  // Fetch post with embedded data (author, categories, tags, featured media)
  const post = await getPostBySlug(slug);

  // Fetch post-specific styles from WordPress
  const rawStyles = await getPostStyles(post.id);
  const postStyles = filterWpStyles(rawStyles);

  return <SingleTemplate post={post} styles={postStyles} />;
}
