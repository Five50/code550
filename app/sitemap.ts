import { MetadataRoute } from "next";
import { getAllPosts, getAllPages } from "@/lib/wordpress";
import { siteConfig } from "@/site.config";
import { supportedLanguages } from "@/middleware";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, pages] = await Promise.all([
    getAllPosts(),
    getAllPages()
  ]);

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.site_domain}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${siteConfig.site_domain}/posts/archive`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.site_domain}/posts/categories`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/posts/authors`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/posts/tags`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Generate URLs for posts in WordPress style (direct slug)
  const postUrls: MetadataRoute.Sitemap = [];
  posts.forEach((post) => {
    supportedLanguages.forEach((lang) => {
      const url = lang === 'en'
        ? `${siteConfig.site_domain}/${post.slug}`
        : `${siteConfig.site_domain}/${lang}/${post.slug}`;

      postUrls.push({
        url,
        lastModified: new Date(post.modified),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });
  });

  // Generate URLs for pages in WordPress style (direct slug)
  const pageUrls: MetadataRoute.Sitemap = [];
  pages.forEach((page) => {
    supportedLanguages.forEach((lang) => {
      const url = lang === 'en'
        ? `${siteConfig.site_domain}/${page.slug}`
        : `${siteConfig.site_domain}/${lang}/${page.slug}`;

      pageUrls.push({
        url,
        lastModified: new Date(page.modified),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });
  });

  return [...staticUrls, ...postUrls, ...pageUrls];
}
