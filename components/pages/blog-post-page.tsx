"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { WPContent } from "@/lib/wp-content-renderer";
import { Clock, User, Calendar } from "lucide-react";
import { motion } from "motion/react";
import type { Post, Author, Category } from "@/lib/wordpress.d";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadTime(content: string) {
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
}

interface BlogPostPageProps {
  post: Post;
  relatedPosts: Post[];
  author: Author | null;
  category: Category | null;
}

export function BlogPostPage({ post, relatedPosts, author, category }: BlogPostPageProps) {
  const readTime = estimateReadTime(post.content.rendered);
  const postDate = formatDate(post.date);
  const authorName = author?.name || "Code550 Team";
  const categoryName = category?.name || "Article";

  return (
    <div className="min-h-screen pt-24">
      {/* Header with Breadcrumbs */}
      <section className="pb-8 border-b border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Breadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              { label: post.title.rendered.replace(/&amp;/g, "&").replace(/&#8217;/g, "'").replace(/&quot;/g, '"') },
            ]}
          />
        </div>
      </section>

      {/* Article Header
          Note: WordPress content is trusted CMS content rendered via dangerouslySetInnerHTML.
          This is the standard pattern for WordPress headless sites. */}
      <article className="container mx-auto px-4 md:px-6 pb-20 pt-8">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-6 text-xs font-mono">{categoryName}</Badge>

          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl mb-6 leading-tight"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          <div className="text-xl text-muted-foreground mb-8"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-12 pb-8 border-b border-border/50">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{authorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{postDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readTime}</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.featured_media > 0 && (
            <div className="relative rounded-2xl overflow-hidden mb-12 border border-border/50">
              <img
                src={`/api/media/${post.featured_media}`}
                alt={post.title.rendered.replace(/<[^>]*>/g, "")}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            </div>
          )}

          {/* Content - WordPress CMS content with class transformation */}
          <WPContent
            html={post.content.rendered}
            className="prose prose-invert max-w-none
              prose-headings:font-[family-name:var(--font-display)]
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
              prose-ul:my-6 prose-li:text-muted-foreground prose-li:mb-2
              prose-strong:text-foreground"
          />
        </motion.div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-card/30 border-y border-border/50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-[family-name:var(--font-display)] text-3xl mb-12 text-center">
              More Articles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <motion.div
                    className="rounded-2xl border border-border/50 overflow-hidden bg-background/50 hover:border-primary/50 transition-all duration-300"
                    whileHover={{ y: -8 }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      {relatedPost.featured_media > 0 ? (
                        <img
                          src={`/api/media/${relatedPost.featured_media}`}
                          alt={relatedPost.title.rendered.replace(/<[^>]*>/g, "")}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    </div>

                    <div className="p-6">
                      <Badge className="mb-3 text-xs font-mono">{categoryName}</Badge>
                      <h3
                        className="font-[family-name:var(--font-display)] text-xl mb-3 group-hover:text-primary transition-colors"
                        dangerouslySetInnerHTML={{ __html: relatedPost.title.rendered }}
                      />
                      <div className="text-sm text-muted-foreground mb-4 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: relatedPost.excerpt.rendered }}
                      />
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatDate(relatedPost.date)}</span>
                        <span>&bull;</span>
                        <span>{estimateReadTime(relatedPost.content.rendered)}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
