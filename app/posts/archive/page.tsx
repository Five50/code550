import { Suspense } from "react";
import {
  getPostsPaginated,
  getAllCategories,
  getAllTags,
  getAllAuthors,
} from "@/lib/wordpress";

import { Section, Container } from "@/components/craft";
import { PostCard } from "@/components/posts/post-card";
import { FilterPosts } from "@/components/posts/filter";
import { SearchInput } from "@/components/posts/search-input";

import Balancer from "react-wrap-balancer";

export const metadata = {
  title: "Posts Archive",
  description: "Browse all blog posts",
};

interface PostsArchivePageProps {
  searchParams: Promise<{
    page?: string;
    author?: string;
    tag?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function PostsArchivePage({ searchParams }: PostsArchivePageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const postsPerPage = 9;

  const [
    { data: posts, headers },
    categories,
    tags,
    authors,
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
  ]);

  const { total, totalPages } = headers;

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold">
              <Balancer>All Posts</Balancer>
            </h1>
            <p className="text-lg text-muted-foreground">
              <Balancer>
                Showing {posts.length} of {total} posts
                {params.search && ` for "${params.search}"`}
              </Balancer>
            </p>
          </div>

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

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <a
                  href={`/posts/archive?page=${page - 1}${params.author ? `&author=${params.author}` : ''}${params.category ? `&category=${params.category}` : ''}${params.tag ? `&tag=${params.tag}` : ''}${params.search ? `&search=${params.search}` : ''}`}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Previous
                </a>
              )}
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <a
                  href={`/posts/archive?page=${page + 1}${params.author ? `&author=${params.author}` : ''}${params.category ? `&category=${params.category}` : ''}${params.tag ? `&tag=${params.tag}` : ''}${params.search ? `&search=${params.search}` : ''}`}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
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
}