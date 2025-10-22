'use client';

import { Article } from "@/components/craft";
import parse from "html-react-parser";
import Image from "next/image";
import { ViewTransitionLink } from "@/components/view-transition-link";
import { useGsapFadeIn, useGsapSlideIn } from "@/lib/use-gsap";

interface SingleTemplateProps {
  post: any;
  styles?: string;
}

/**
 * Single template - Used for single blog posts
 * Matches WordPress "single" template
 * Inspired by Linear's blog post design
 */
export function SingleTemplate({ post, styles }: SingleTemplateProps) {
  const breadcrumbRef = useGsapFadeIn(0);
  const titleRef = useGsapSlideIn('up', 0.1);
  const imageRef = useGsapFadeIn(0.2);
  const metaRef = useGsapFadeIn(0.3);
  const contentRef = useGsapSlideIn('up', 0.4);
  const tagsRef = useGsapFadeIn(0.5);

  if (!post || !post.content || !post.content.rendered) {
    return null;
  }

  return (
    <>
      {styles && <style dangerouslySetInnerHTML={{ __html: styles }} />}
      <div className="w-full">
        {/* Centered Container */}
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
          {/* Breadcrumb */}
          <div ref={breadcrumbRef} className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <ViewTransitionLink href="/blog" className="hover:underline">
              Blog
            </ViewTransitionLink>
            {post._embedded?.["wp:term"]?.[0]?.[0] && (
              <>
                <span>›</span>
                <ViewTransitionLink
                  href={`/blog?category=${post._embedded["wp:term"][0][0].slug}`}
                  className="hover:underline"
                >
                  {post._embedded["wp:term"][0][0].name}
                </ViewTransitionLink>
              </>
            )}
          </div>

          {/* Centered Title */}
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-center mb-12"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {/* Featured Image */}
          {post._embedded?.["wp:featuredmedia"]?.[0] && (
            <div ref={imageRef} className="relative w-full aspect-video overflow-hidden rounded-lg mb-8">
              <Image
                src={post._embedded["wp:featuredmedia"][0].source_url}
                alt={post._embedded["wp:featuredmedia"][0].alt_text || post.title.rendered}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Author and Date */}
          <div ref={metaRef} className="flex items-center justify-center gap-3 text-sm text-muted-foreground mb-12 pb-12 border-b">
            {post._embedded?.author?.[0] && (
              <ViewTransitionLink
                href={`/posts/authors/${post._embedded.author[0].slug}`}
                className="hover:underline font-medium"
              >
                {post._embedded.author[0].name}
              </ViewTransitionLink>
            )}
            {post._embedded?.author?.[0] && post.date && (
              <span>·</span>
            )}
            {post.date && (
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>

          {/* Post Content - Prose Style */}
          <div ref={contentRef}>
            <Article className="prose prose-lg dark:prose-invert max-w-none view-transition-content">
              {parse(post.content.rendered)}
            </Article>
          </div>

          {/* Tags */}
          {post._embedded?.["wp:term"]?.[1] && post._embedded["wp:term"][1].length > 0 && (
            <div ref={tagsRef} className="flex flex-wrap gap-2 pt-12 mt-12 border-t">
              {post._embedded["wp:term"][1].map((tag: any) => (
                <ViewTransitionLink
                  key={tag.id}
                  href={`/blog?tag=${tag.slug}`}
                  className="text-sm bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-full transition-colors"
                >
                  {tag.name}
                </ViewTransitionLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
