import { getPostBySlug, getAllPostSlugs, getAuthorById, getCategoryById, getPostsPaginated } from "@/lib/wordpress";
import { BlogPostPage } from "@/components/pages/blog-post-page";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug: slug.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return {
    title: post ? `${post.title.rendered} — Code550` : "Blog — Code550",
    description: post?.excerpt?.rendered?.replace(/<[^>]*>/g, '').slice(0, 160) || "",
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [author, category, relatedData] = await Promise.all([
    post.author ? getAuthorById(post.author) : null,
    post.categories?.[0] ? getCategoryById(post.categories[0]) : null,
    getPostsPaginated(1, 3),
  ]);

  const relatedPosts = relatedData.data.filter((p) => p.id !== post.id).slice(0, 2);
  return <BlogPostPage post={post} relatedPosts={relatedPosts} author={author} category={category} />;
}
