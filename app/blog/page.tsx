import { getPostsPaginated, getAllCategories } from "@/lib/wordpress";
import { BlogPage } from "@/components/pages/blog-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on web development, SEO, design, and digital strategy.",
};

export default async function Page() {
  const [postsData, categories] = await Promise.all([
    getPostsPaginated(1, 12),
    getAllCategories(),
  ]);
  return <BlogPage posts={postsData.data} categories={categories} />;
}
