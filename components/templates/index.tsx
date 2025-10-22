"use client";

import { Section } from "@/components/craft";
import Image from "next/image";
import { useState } from "react";
import { ViewTransitionLink } from "@/components/view-transition-link";
import { useGsapFadeIn, useGsapStagger } from "@/lib/use-gsap";

interface IndexTemplateProps {
  posts: any[];
  total: number;
  totalPages: number;
  page: number;
  categories: any[];
  tags: any[];
  authors: any[];
  params: {
    author?: string;
    tag?: string;
    category?: string;
    search?: string;
  };
  pageTitle?: string;
  pageContent?: string;
}

/**
 * Index template - Used for blog listing pages
 * Matches WordPress "index" template
 */
export function IndexTemplate({
  posts,
  total,
  totalPages,
  page,
  categories,
  tags,
  authors,
  params,
  pageTitle,
  pageContent,
}: IndexTemplateProps) {
  const [searchQuery, setSearchQuery] = useState(params.search || "");
  const headerRef = useGsapFadeIn(0);
  const postsRef = useGsapStagger(0.1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    if (searchQuery) {
      url.searchParams.set("search", searchQuery);
    } else {
      url.searchParams.delete("search");
    }
    url.searchParams.delete("page");
    window.location.href = url.toString();
  };

  return (
    <Section>
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold">Blog</h1>

          {/* Categories and Search */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Categories Filter */}
            <div className="flex flex-wrap gap-2">
              <ViewTransitionLink
                href="/blog"
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  !params.category
                    ? "bg-foreground text-background"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                All
              </ViewTransitionLink>
              {categories.map((category) => (
                <ViewTransitionLink
                  key={category.id}
                  href={`/blog?category=${category.slug}`}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    params.category === category.slug
                      ? "bg-foreground text-background"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {category.name}
                </ViewTransitionLink>
              ))}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 text-sm border rounded-md bg-background min-w-[200px]"
              />
              <button
                type="submit"
                className="px-4 py-1.5 text-sm bg-foreground text-background rounded-md hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Posts Grid - 2 columns (50/50) */}
        {posts.length > 0 ? (
          <div ref={postsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <ViewTransitionLink
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group flex flex-col gap-4 transition-opacity hover:opacity-80"
              >
                {/* Featured Image */}
                {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                  <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={post._embedded["wp:featuredmedia"][0].source_url}
                      alt={post._embedded["wp:featuredmedia"][0].alt_text || post.title.rendered}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Post Meta */}
                <div className="flex flex-col gap-2">
                  {/* Author and Date */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {post._embedded?.author?.[0] && (
                      <span>{post._embedded.author[0].name}</span>
                    )}
                    {post._embedded?.author?.[0] && post.date && (
                      <span>·</span>
                    )}
                    {post.date && (
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    )}
                  </div>

                  {/* Title */}
                  <h2
                    className="text-xl font-semibold leading-tight"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />

                  {/* Excerpt */}
                  {post.excerpt?.rendered && (
                    <p
                      className="text-sm text-muted-foreground line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: post.excerpt.rendered.replace(/<[^>]*>/g, "")
                      }}
                    />
                  )}
                </div>
              </ViewTransitionLink>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No posts found.
            </p>
          </div>
        )}

        {/* Load More Button */}
        {page < totalPages && (
          <div className="flex justify-center">
            <ViewTransitionLink
              href={`/blog?page=${page + 1}${buildQueryString(params, { page: undefined })}`}
              className="px-6 py-3 bg-foreground text-background rounded-md hover:opacity-90 transition-opacity"
            >
              Load More
            </ViewTransitionLink>
          </div>
        )}
      </div>
    </Section>
  );
}

// Helper function to build query strings for pagination
function buildQueryString(
  params: Record<string, string | undefined>,
  overrides: Record<string, string | undefined> = {}
): string {
  const merged = { ...params, ...overrides };
  const filtered = Object.entries(merged)
    .filter(([key, value]) => value !== undefined && value !== "" && key !== "page")
    .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`)
    .join("&");

  return filtered ? `&${filtered}` : "";
}
