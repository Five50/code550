import { getAllPages } from "@/lib/wordpress";
import { Section } from "@/components/craft";
import { Metadata } from "next";
import BackButton from "@/components/back";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Pages",
  description: "Browse all pages of our blog posts",
  alternates: {
    canonical: "/posts/pages",
  },
};

export default async function Page() {
  const pages = await getAllPages();

  return (
    <Section>
      
        <div className="mb-8">
          <h2>All Pages</h2>
          <ul className="grid">
            {pages.map((page: any) => (
              <li key={page.id}>
                <Link href={`/pages/${page.slug}`}>{page.title.rendered}</Link>
              </li>
            ))}
          </ul>
        </div>
        <BackButton />
      
    </Section>
  );
}
