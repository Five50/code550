"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import type { Post, Category } from "@/lib/wordpress.d";

const fallbackArticles = [
  {
    slug: "next-js-14-performance",
    title: "Next.js 14: Performance Optimization Techniques",
    category: "Development",
    excerpt: "Deep dive into the latest performance features in Next.js 14 and how to leverage them for faster applications",
    readTime: "8 min read",
    date: "March 5, 2026",
    author: "Alex Thompson",
    image: "https://images.unsplash.com/photo-1591267990439-bc68529677c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFjdCUyMGNvZGUlMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NzI3NTg0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    slug: "wordpress-security-2026",
    title: "WordPress Security Best Practices for 2026",
    category: "Security",
    excerpt: "Essential security measures every WordPress site owner should implement to protect against modern threats",
    readTime: "6 min read",
    date: "March 3, 2026",
    author: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1649451844931-57e22fc82de3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3JkcHJlc3MlMjBkZXZlbG9wbWVudCUyMHNjcmVlbnxlbnwxfHx8fDE3NzI3NTg0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    slug: "core-web-vitals-guide",
    title: "Complete Guide to Core Web Vitals in 2026",
    category: "SEO",
    excerpt: "Master Core Web Vitals to improve your site's performance and search rankings with this comprehensive guide",
    readTime: "10 min read",
    date: "March 1, 2026",
    author: "Michael Rodriguez",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJzaXRlJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3Mjc1ODQyOXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    slug: "ui-design-trends-2026",
    title: "UI Design Trends Shaping 2026",
    category: "Design",
    excerpt: "Explore the latest design trends from glassmorphism to spatial interfaces and how to apply them",
    readTime: "7 min read",
    date: "February 28, 2026",
    author: "Emma Wilson",
    image: "https://images.unsplash.com/photo-1699040309386-11c615ed64d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1aSUyMGRlc2lnbiUyMGludGVyZmFjZXxlbnwxfHx8fDE3NzI2NjE3MDV8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    slug: "react-server-components",
    title: "Understanding React Server Components",
    category: "Development",
    excerpt: "A practical guide to React Server Components and how they change the way we build applications",
    readTime: "12 min read",
    date: "February 25, 2026",
    author: "Alex Thompson",
    image: "https://images.unsplash.com/photo-1637937459053-c788742455be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGUlMjBzY3JlZW58ZW58MXx8fHwxNzcyNzI3NzE2fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    slug: "seo-strategy-2026",
    title: "Modern SEO Strategy for Growing Businesses",
    category: "SEO",
    excerpt: "Build a comprehensive SEO strategy that drives organic traffic and qualified leads to your business",
    readTime: "9 min read",
    date: "February 22, 2026",
    author: "Michael Rodriguez",
    image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwc3RyYXRlZ3l8ZW58MXx8fHwxNzcyNzU0NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

const defaultCategories = ["All", "Development", "SEO", "Security", "Design"];

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

function postToArticle(post: Post) {
  return {
    slug: post.slug,
    title: post.title.rendered,
    category: "",
    excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, "").trim(),
    readTime: estimateReadTime(post.content.rendered),
    date: formatDate(post.date),
    author: "",
    image: "",
  };
}

interface BlogPageProps {
  posts: Post[];
  categories: Category[];
}

export function BlogPage({ posts, categories }: BlogPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const hasWpPosts = posts && posts.length > 0;

  const articles = hasWpPosts
    ? posts.map((post) => {
        const article = postToArticle(post);
        const cat = categories.find((c) => post.categories?.includes(c.id));
        article.category = cat?.name || "Uncategorized";
        return article;
      })
    : fallbackArticles;

  const categoryNames = hasWpPosts
    ? ["All", ...categories.map((c) => c.name)]
    : defaultCategories;

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((article) => article.category === selectedCategory);

  return (
    <div className="min-h-screen pt-24 relative">
      {/* Grid Background */}
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />

      {/* Hero Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-6 text-xs font-mono">BLOG & INSIGHTS</Badge>
            <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl mb-6">
              Learn & Grow
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Expert insights on web development, design, performance, and digital strategy
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 border-y border-border/50 bg-card/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="flex flex-wrap gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {categoryNames.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      {selectedCategory === "All" && articles.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link href={`/blog/${articles[0].slug}`} className="group">
                <div className="relative rounded-3xl overflow-hidden border border-border/50 bg-card/30 hover:border-primary/50 transition-all">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="relative h-96 md:h-auto overflow-hidden">
                      {articles[0].image ? (
                        <img
                          src={articles[0].image}
                          alt={articles[0].title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card" />
                      <Badge className="absolute top-6 left-6 text-xs font-mono">
                        FEATURED
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <Badge className="mb-4 w-fit text-xs">{articles[0].category}</Badge>
                      <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl mb-4 group-hover:text-primary transition-colors">
                        {articles[0].title}
                      </h2>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {articles[0].excerpt}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{articles[0].date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{articles[0].readTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-2 transition-transform">
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredArticles.slice(selectedCategory === "All" ? 1 : 0).map((article, index) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Link href={`/blog/${article.slug}`} className="group block">
                  <div className="rounded-2xl overflow-hidden border border-border/50 bg-card/30 hover:border-primary/50 transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {article.image ? (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                      <div className="absolute inset-0 glow-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <Badge className="mb-3 text-xs">{article.category}</Badge>
                      <h3 className="font-[family-name:var(--font-display)] text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-[family-name:var(--font-display)] text-4xl mb-4">
              Stay in the Loop
            </h2>
            <p className="text-muted-foreground mb-8">
              Get the latest articles, insights, and updates delivered directly to your inbox
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <Button className="text-sm">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4 font-mono">
              Join 5,000+ developers and designers
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
