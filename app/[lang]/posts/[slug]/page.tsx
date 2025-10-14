import {
  getPostBySlug,
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
  getAllPostSlugs,
  getPostWithSEO,
} from "@/lib/wordpress";
import { processWPContent } from "@/lib/process-wp-content";

import { Section, Container, Article } from "@/components/craft";
import { badgeVariants } from "@/components/ui/badge";
import { StructuredData } from "@/components/seo/structured-data";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";

import Link from "next/link";
import Balancer from "react-wrap-balancer";

import type { Metadata } from "next";
import { normalizeLanguage } from "@/lib/i18n";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  const params = [];

  // Generate params for each language
  for (const { slug } of slugs) {
    params.push(
      { lang: 'en', slug },
      { lang: 'es', slug }
    );
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}): Promise<Metadata> {
  const { slug, lang } = await params;
  const language = normalizeLanguage(lang);
  const post = await getPostWithSEO(slug, language);

  if (!post) {
    return {};
  }

  // Use RankMath SEO data if available, fallback to WordPress data
  const title = post.seo?.title || post.title.rendered;
  const description = post.seo?.description || post.excerpt.rendered.replace(/<[^>]*>/g, "").trim();

  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", title);
  ogUrl.searchParams.append("description", description);

  const canonicalUrl = post.seo?.canonical_url || `${siteConfig.site_domain}/${language !== 'en' ? language + '/' : ''}posts/${post.slug}`;

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.site_domain),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteConfig.site_domain}/${slug}`,
        es: `${siteConfig.site_domain}/es/${slug}`,
      },
    },
    openGraph: {
      title: post.seo?.og_title || title,
      description: post.seo?.og_description || description,
      type: "article",
      url: canonicalUrl,
      images: [
        {
          url: post.seo?.og_image || ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo?.twitter_title || title,
      description: post.seo?.twitter_description || description,
      images: [post.seo?.twitter_image || ogUrl.toString()],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug, lang } = await params;
  const language = normalizeLanguage(lang);
  const post = await getPostWithSEO(slug, language);
  const featuredMedia = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const author = await getAuthorById(post.author);
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const category = await getCategoryById(post.categories[0]);

  return (
    <>
      {post.seo?.schema && <StructuredData schema={post.seo.schema} />}
      <Section>
        <Container>
        <div className="">
          <h1>
            <Balancer>
              <span
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              ></span>
            </Balancer>
          </h1>
          <div className="flex justify-between items-center gap-4 text-sm mb-4">
            <h5>
              Published {date} by{" "}
              {author.name && (
                <span>
                  <a href={`/posts/?author=${author.id}`}>{author.name}</a>{" "}
                </span>
              )}
            </h5>

            <Link
              href={`/posts/?category=${category.id}`}
              className={cn(
                badgeVariants({ variant: "outline" }),
                "!no-underline"
              )}
            >
              {category.name}
            </Link>
          </div>
          {featuredMedia?.source_url && (
            <div className="h-96 my-12 md:h-[500px] overflow-hidden flex items-center justify-center border rounded-lg bg-accent/25">
              {/* eslint-disable-next-line */}
              <img
                className="w-full h-full object-cover"
                src={featuredMedia.source_url}
                alt={post.title.rendered}
              />
            </div>
          )}
        </div>

        <Article dangerouslySetInnerHTML={{ __html: processWPContent(post.content.rendered) }} />
      </Container>
    </Section>
    </>
  );
}
