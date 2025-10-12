import { notFound, redirect } from 'next/navigation';
import {
  getPostBySlugWithLanguage,
  getPageBySlugWithLanguage,
  getPostWithSEO,
  getPageWithSEO,
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
  getAllPostSlugs,
  getAllPages,
  getBlogPageContent
} from '@/lib/wordpress';
import { getLanguageFromPathname, normalizeLanguage, removeLanguagePrefix } from '@/lib/i18n';
import { Section, Container, Article } from '@/components/craft';
import { badgeVariants } from '@/components/ui/badge';
import { StructuredData } from '@/components/seo/structured-data';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/site.config';
import Link from 'next/link';
import Image from 'next/image';
import Balancer from 'react-wrap-balancer';
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
  const featuredMedia = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const author = await getAuthorById(post.author);
  const date = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const category = post.categories[0] ? await getCategoryById(post.categories[0]) : null;

  return (
    <>
      {post.seo?.schema && <StructuredData schema={post.seo.schema} />}
      <Section>
        <Container>
        <div className="view-transition-content">
          <h1>
            <Balancer>
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </Balancer>
          </h1>
          <div className="flex justify-between items-center gap-4 text-sm mb-4">
            <h5>
              Published {date} by{' '}
              {author.name && (
                <span>
                  <Link href={`/posts/?author=${author.id}`}>{author.name}</Link>
                </span>
              )}
            </h5>

            {category && (
              <Link
                href={`/posts/?category=${category.id}`}
                className={cn(
                  badgeVariants({ variant: 'outline' }),
                  '!no-underline'
                )}
              >
                {category.name}
              </Link>
            )}
          </div>
          {featuredMedia?.source_url && (
            <div className="h-96 my-12 md:h-[500px] overflow-hidden flex items-center justify-center border rounded-lg bg-accent/25">
              <Image
                className="w-full h-full object-cover"
                src={featuredMedia.source_url}
                alt={post.title.rendered}
                width={800}
                height={500}
              />
            </div>
          )}
        <Article dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        </div>
      </Container>
    </Section>
    </>
  );
}

// Page component
function PageContent({ page }: { page: any }) {
  return (
    <>
      {page.seo?.schema && <StructuredData schema={page.seo.schema} />}
      <Section>
        <Container>
        <div className="view-transition-content">
          <h1>
            <Balancer>
              <span dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
            </Balancer>
          </h1>

        <Article dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
        </div>
      </Container>
    </Section>
    </>
  );
}