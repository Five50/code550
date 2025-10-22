import { Suspense } from "react";
import {
  getPostsPaginated,
  getAllCategories,
  getAllTags,
  getAllAuthors,
  getBlogPageContent,
  getPostStyles,
} from "@/lib/wordpress";
import { filterWpStyles } from "@/lib/filter-wp-styles";

import { IndexTemplate } from "@/components/templates/index";
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

  try {
    const blogPage = await getBlogPageContent();

    // Fetch page-specific styles if there's a blog page set
    let pageStyles = '';
    if (blogPage.page) {
      const rawStyles = await getPostStyles(blogPage.page.id);
      pageStyles = filterWpStyles(rawStyles);
    }

    // Fetch posts
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
      <>
        {pageStyles && (
          <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
        )}
        <IndexTemplate
          posts={posts}
          total={total}
          totalPages={totalPages}
          page={page}
          categories={categories}
          tags={tags}
          authors={authors}
          params={params}
          pageTitle={blogPage.page?.title.rendered}
          pageContent={blogPage.page?.content.rendered}
        />
      </>
    );
  } catch (error) {
    console.error("Error loading blog page:", error);

    return (
      <IndexTemplate
        posts={[]}
        total={0}
        totalPages={0}
        page={1}
        categories={[]}
        tags={[]}
        authors={[]}
        params={{}}
      />
    );
  }
}