import { Suspense } from "react";
import {
  getPostsPaginated,
  getAllCategories,
  getAllTags,
  getAllAuthors,
  getBlogPageContent,
} from "@/lib/wordpress";
import { processWPContent } from "@/lib/process-wp-content";

import { Section, Container, Article } from "@/components/craft";
import { PostCard } from "@/components/posts/post-card";
import { FilterPosts } from "@/components/posts/filter";
import { SearchInput } from "@/components/posts/search-input";

import Balancer from "react-wrap-balancer";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const blogPage = await getBlogPageContent();

    if (blogPage.page) {
      return {
        title: blogPage.page.title.rendered,
        description: blogPage.page.excerpt?.rendered?.replace(/<[^>]*>/g, "").trim() || "Blog posts and articles",
      };
    }

    return {
      title: "Blog",
      description: "Latest blog posts and articles",
    };
  } catch (error) {
    return {
      title: "Blog",
      description: "Latest blog posts and articles",
    };
  }
}

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    author?: string;
    tag?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const postsPerPage = 9;

  try {
    const [
      { data: posts, headers },
      categories,
      tags,
      authors,
      blogPage,
    ] = await Promise.all([
      getPostsPaginated(page, postsPerPage, {
        author: params.author,
        category: params.category,
        tag: params.tag,
        search: params.search,
      }),
      getAllCategories(),
      getAllTags(),
      getAllAuthors(),
      getBlogPageContent(),
    ]);

    const { total, totalPages } = headers;

    return (
      <Section>
        <Container>
          <div className="flex flex-col gap-6">
            {/* Page Header - matches WordPress template hierarchy */}
            <div className="flex flex-col gap-4">
              {blogPage.page ? (
                // Custom page content if page_for_posts is set
                <>
                  <div className="">
                    <h1>
                      <Balancer>
                        <span dangerouslySetInnerHTML={{ __html: blogPage.page.title.rendered }} />
                      </Balancer>
                    </h1>
                  </div>
                  {blogPage.page.content.rendered && (
                    <Article dangerouslySetInnerHTML={{ __html: processWPContent(blogPage.page.content.rendered) }} />
                  )}
                </>
              ) : (
                // Default blog header
                <div>
                  <h1 className="text-4xl font-bold">
                    <Balancer>Blog</Balancer>
                  </h1>
                  <p className="text-lg text-muted-foreground mt-2">
                    <Balancer>Latest posts and articles</Balancer>
                  </p>
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                <Balancer>
                  Showing {posts.length} of {total} posts
                  {params.search && ` for "${params.search}"`}
                </Balancer>
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <Suspense fallback={<div>Loading search...</div>}>
                <SearchInput defaultValue={params.search} />
              </Suspense>
              <Suspense fallback={<div>Loading filters...</div>}>
                <FilterPosts
                  authors={authors}
                  tags={tags}
                  categories={categories}
                  selectedAuthor={params.author}
                  selectedTag={params.tag}
                  selectedCategory={params.category}
                />
              </Suspense>
            </div>

            {/* Posts Grid */}
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No posts found matching your criteria.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 items-center">
                {page > 1 && (
                  <a
                    href={`/blog?page=${page - 1}${buildQueryString(params, { page: undefined })}`}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Previous
                  </a>
                )}

                <span className="px-4 py-2 text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>

                {page < totalPages && (
                  <a
                    href={`/blog?page=${page + 1}${buildQueryString(params, { page: undefined })}`}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Next
                  </a>
                )}
              </div>
            )}
          </div>
        </Container>
      </Section>
    );
  } catch (error) {
    console.error("Error loading blog page:", error);

    return (
      <Section>
        <Container>
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-bold">
                <Balancer>Blog</Balancer>
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                <Balancer>Latest posts and articles</Balancer>
              </p>
            </div>
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Unable to load blog posts. Please check your WordPress connection.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    );
  }
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