import { notFound, redirect } from 'next/navigation';
import {
  getPostBySlugWithLanguage,
  getPageBySlugWithLanguage,
  getPostWithSEO,
  getPageWithSEO,
  getPostStyles,
  getAllPostSlugs,
  getAllPages,
  getBlogPageContent
} from '@/lib/wordpress';
import { filterWpStyles } from '@/lib/filter-wp-styles';
import { getLanguageFromPathname, normalizeLanguage, removeLanguagePrefix } from '@/lib/i18n';
import { SingleTemplate } from '@/components/templates/single';
import { PageTemplate } from '@/components/templates/page';
import { PageNoTitleTemplate } from '@/components/templates/page-no-title';
import { StructuredData } from '@/components/seo/structured-data';
import { siteConfig } from '@/site.config';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

// Determine if slug is a post or page by checking WordPress
async function getContentBySlug(slug: string, language?: string) {
  // Check if this is the blog page (page_for_posts)
  try {
    const blogPageContent = await getBlogPageContent(language);
    if (blogPageContent.page && blogPageContent.page.slug === slug) {
      // This is the blog page, redirect to /blog
      return { content: null, type: 'redirect' as const, redirectTo: '/blog' };
    }
  } catch (error) {
    // Continue with normal logic
  }

  try {
    // Try to get as post first
    const post = await getPostWithSEO(slug, language);
    if (post) {
      return { content: post, type: 'post' as const };
    }
  } catch (error) {
    // Post not found, try page
  }

  try {
    // Try to get as page
    const page = await getPageWithSEO(slug, language);
    if (page) {
      return { content: page, type: 'page' as const };
    }
  } catch (error) {
    // Page not found
  }

  return null;
}

export async function generateStaticParams() {
  try {
    const [postSlugs, pages] = await Promise.all([
      getAllPostSlugs(),
      getAllPages()
    ]);

    const params = [];

    // Add post slugs for both languages
    for (const { slug } of postSlugs) {
      params.push(
        { slug: [slug] }, // English (no prefix)
        { slug: ['es', slug] } // Spanish
      );
    }

    // Add page slugs for both languages
    for (const page of pages) {
      params.push(
        { slug: [page.slug] }, // English (no prefix)
        { slug: ['es', page.slug] } // Spanish
      );
    }

    return params;
  } catch (error) {
    console.warn('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug: slugArray } = await params;
    const fullPath = '/' + slugArray.join('/');
    const language = getLanguageFromPathname(fullPath);
    const cleanPath = removeLanguagePrefix(fullPath);
    const slug = cleanPath.replace('/', '') || slugArray[slugArray.length - 1];

    const result = await getContentBySlug(slug, language);

    if (!result) {
      return {};
    }

    const { content, type } = result;

    if (!content) {
      return {};
    }

    // Use RankMath SEO data if available, fallback to WordPress data
    const title = content.seo?.title || content.title.rendered;
    const description = content.seo?.description ||
      (type === 'post' ? content.excerpt.rendered.replace(/<[^>]*>/g, "").trim() : content.content.rendered.replace(/<[^>]*>/g, "").slice(0, 160));

    const canonicalUrl = content.seo?.canonical_url ||
      `${siteConfig.site_domain}${language !== 'en' ? '/' + language : ''}/${slug}`;

    const metadata: Metadata = {
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
        title: content.seo?.og_title || title,
        description: content.seo?.og_description || description,
        type: type === 'post' ? 'article' : 'website',
        url: canonicalUrl,
        images: content.seo?.og_image ? [content.seo.og_image] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: content.seo?.twitter_title || title,
        description: content.seo?.twitter_description || description,
        images: content.seo?.twitter_image ? [content.seo.twitter_image] : [],
      },
    };

    return metadata;
  } catch (error) {
    console.warn('Error generating metadata:', error);
    return {};
  }
}

export default async function DynamicPage({ params }: PageProps) {
  try {
    const { slug: slugArray } = await params;
    const fullPath = '/' + slugArray.join('/');
    const language = getLanguageFromPathname(fullPath);
    const cleanPath = removeLanguagePrefix(fullPath);
    const slug = cleanPath.replace('/', '') || slugArray[slugArray.length - 1];

    const result = await getContentBySlug(slug, language);

    if (!result) {
      notFound();
    }

    if (result.type === 'redirect') {
      redirect(result.redirectTo);
    }

    const { content, type } = result;

    if (type === 'post') {
      return <PostPage post={content} />;
    } else {
      return <PageContent page={content} />;
    }
  } catch (error) {
    console.error('Error rendering dynamic page:', error);
    notFound();
  }
}

// Post component
async function PostPage({ post }: { post: any }) {
  // Fetch post-specific styles from WordPress
  const rawStyles = await getPostStyles(post.id);
  const postStyles = filterWpStyles(rawStyles);

  return (
    <>
      {post.seo?.schema && <StructuredData schema={post.seo.schema} />}
      <SingleTemplate post={post} styles={postStyles} />
    </>
  );
}

// Page component
async function PageContent({ page }: { page: any }) {
  // Fetch page-specific styles from WordPress
  const rawStyles = await getPostStyles(page.id);
  const pageStyles = filterWpStyles(rawStyles);

  // Check if this page uses the no-title template
  const isNoTitle = page.template === 'page-no-title';

  return (
    <>
      {page.seo?.schema && <StructuredData schema={page.seo.schema} />}
      {isNoTitle ? (
        <PageNoTitleTemplate page={page} styles={pageStyles} />
      ) : (
        <PageTemplate page={page} styles={pageStyles} />
      )}
    </>
  );
}