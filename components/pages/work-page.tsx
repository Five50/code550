"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const fallbackProjects = [
  {
    slug: "techflow-ecommerce",
    title: "TechFlow E-Commerce Platform",
    client: "TechFlow Inc.",
    category: "WordPress",
    description:
      "Complete WooCommerce rebuild with custom checkout flow, inventory management, and payment integrations. Optimized for conversion and mobile shopping experience.",
    tags: ["WordPress", "WooCommerce", "Payment Integration", "Mobile-First"],
    image:
      "https://images.unsplash.com/photo-1649451844931-57e22fc82de3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3JkcHJlc3MlMjBkZXZlbG9wbWVudCUyMHNjcmVlbnxlbnwxfHx8fDE3NzI3NTg0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    metrics: [
      { label: "Conversion Rate", value: "+47%", trend: "up" },
      { label: "Page Speed", value: "95/100", trend: "up" },
      { label: "Revenue Growth", value: "+128%", trend: "up" },
    ],
    results:
      "Within 3 months of launch, TechFlow saw a 128% increase in online revenue and 47% improvement in conversion rates.",
  },
  {
    slug: "",
    title: "DataView Analytics SaaS",
    category: "React",
    client: "DataView Systems",
    description:
      "Real-time analytics dashboard built with Next.js and React. Features include custom data visualizations, export functionality, and role-based access control.",
    tags: ["Next.js", "React", "TypeScript", "Data Viz"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJzaXRlJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3Mjc1ODQyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    metrics: [
      { label: "Load Time", value: "0.8s", trend: "up" },
      { label: "Active Users", value: "15k+", trend: "up" },
      { label: "Uptime", value: "99.9%", trend: "stable" },
    ],
    results:
      "Platform now serves 15,000+ daily active users with sub-second load times and 99.9% uptime.",
  },
  {
    slug: "",
    title: "GrowthLab Marketing Site",
    category: "SEO",
    client: "GrowthLab Agency",
    description:
      "High-performance marketing website with advanced SEO optimization, conversion tracking, and integrated CRM. Built to generate and capture qualified leads.",
    tags: ["Next.js", "SEO", "Analytics", "Conversion Optimization"],
    image:
      "https://images.unsplash.com/photo-1533750349088-cd871a92f312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwc3RyYXRlZ3l8ZW58MXx8fHwxNzcyNzU0NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    metrics: [
      { label: "Organic Traffic", value: "+245%", trend: "up" },
      { label: "Lead Generation", value: "+180%", trend: "up" },
      { label: "Bounce Rate", value: "-35%", trend: "up" },
    ],
    results:
      "Organic traffic increased by 245% in 6 months, with 180% more qualified leads entering the sales pipeline.",
  },
  {
    slug: "",
    title: "UrbanEats Mobile App",
    category: "Design",
    client: "UrbanEats",
    description:
      "UI/UX design and development for a food delivery progressive web app. Features include real-time order tracking, offline mode, and push notifications.",
    tags: ["UI/UX", "PWA", "Mobile Design", "React"],
    image:
      "https://images.unsplash.com/photo-1699040309386-11c615ed64d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1aSUyMGRlc2lnbiUyMGludGVyZmFjZXxlbnwxfHx8fDE3NzI2NjE3MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    metrics: [
      { label: "User Engagement", value: "+89%", trend: "up" },
      { label: "Install Rate", value: "42%", trend: "up" },
      { label: "Performance", value: "98/100", trend: "up" },
    ],
    results:
      "App achieved 42% install rate with 89% increase in user engagement compared to the previous native app.",
  },
  {
    slug: "",
    title: "GlobalCorp Enterprise Site",
    category: "WordPress",
    client: "GlobalCorp International",
    description:
      "Multi-language corporate website with custom CMS, brand management system, and advanced security features. Supports 12 languages and regional content.",
    tags: ["WordPress", "Multilingual", "Enterprise", "Security"],
    image:
      "https://images.unsplash.com/photo-1758691736843-90f58dce465e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHRlYW0lMjBjb2xsYWJvcmF0aW9uJTIwb2ZmaWNlfGVufDF8fHx8MTc3MjY2MzMzMHww&ixlib=rb-4.1.0&q=80&w=1080",
    metrics: [
      { label: "Languages", value: "12", trend: "stable" },
      { label: "Page Speed", value: "94/100", trend: "up" },
      { label: "Security", value: "A+", trend: "up" },
    ],
    results:
      "Successfully deployed across 12 markets with centralized management and consistent brand experience.",
  },
  {
    slug: "",
    title: "FinSecure Platform",
    category: "React",
    client: "FinSecure",
    description:
      "Secure financial management platform with real-time transaction processing, advanced encryption, and compliance features. Built for enterprise-grade security.",
    tags: ["Next.js", "Security", "Fintech", "API Integration"],
    image:
      "https://images.unsplash.com/photo-1591267990439-bc68529677c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFjdCUyMGNvZGUlMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NzI3NTg0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    metrics: [
      { label: "Transactions", value: "1M+/mo", trend: "up" },
      { label: "Response Time", value: "50ms", trend: "up" },
      { label: "Security Score", value: "A+", trend: "stable" },
    ],
    results:
      "Processing over 1 million transactions monthly with 50ms average response time and zero security incidents.",
  },
];

const fallbackFilters = ["All", "WordPress", "React", "SEO", "Design"];

interface WorkPageProps {
  caseStudies?: unknown[];
  categories?: unknown[];
}

export function WorkPage({
  caseStudies: _caseStudies,
  categories: _categories,
}: WorkPageProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const projects = fallbackProjects;
  const filters = fallbackFilters;

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <div className="min-h-screen pt-24 relative">
      {/* Grid Background */}
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />

      {/* Hero Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-6 text-xs font-mono">OUR WORK</Badge>
            <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl mb-6">
              Case Studies
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Real results from real projects. See how we&apos;ve helped
              businesses grow through strategic design and development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-y border-border/50 bg-card/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="flex flex-wrap gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50"
                }`}
              >
                {filter}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-20 max-w-6xl mx-auto">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Image */}
                  <motion.div
                    className={`relative rounded-2xl overflow-hidden border border-border/50 ${
                      index % 2 === 1 ? "md:order-2" : ""
                    }`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="aspect-[4/3] relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60" />
                      <div className="absolute inset-0 glow-primary opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                    </div>
                    <Badge className="absolute top-6 right-6 text-xs">
                      {project.category}
                    </Badge>
                  </motion.div>

                  {/* Content */}
                  <div className={index % 2 === 1 ? "md:order-1" : ""}>
                    <p className="text-xs font-mono text-primary mb-2 uppercase tracking-wider">
                      {project.client}
                    </p>
                    <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl mb-4">
                      {project.title}
                    </h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-xl bg-card/30 border border-border/50">
                      {project.metrics.map((metric, i) => (
                        <div key={i} className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <span className="font-[family-name:var(--font-display)] text-xl text-primary">
                              {metric.value}
                            </span>
                            {metric.trend === "up" && (
                              <TrendingUp className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Results */}
                    <p className="text-sm text-foreground mb-6 p-4 bg-primary/5 border-l-2 border-primary rounded">
                      <strong>Results:</strong> {project.results}
                    </p>

                    {project.slug ? (
                      <Button
                        variant="outline"
                        asChild
                        className="text-sm group/btn"
                      >
                        <Link href={`/work/${project.slug}`}>
                          View Case Study
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="text-sm group/btn"
                      >
                        View Case Study
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card/30 border-y border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            {[
              { value: "150+", label: "Projects Completed" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "$50M+", label: "Client Revenue Generated" },
              { value: "2.5x", label: "Avg Performance Boost" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="font-[family-name:var(--font-display)] text-5xl mb-2 bg-gradient-to-br from-primary to-accent-soft bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-mono uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="relative max-w-4xl mx-auto text-center p-12 md:p-16 rounded-3xl border border-primary/20 bg-card/30 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 glow-primary opacity-20 blur-3xl" />
            <div className="relative z-10">
              <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl mb-4">
                Ready to Be Our Next Success Story?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Let&apos;s create something exceptional together. Get started
                with a free consultation.
              </p>
              <Button size="lg" asChild className="text-sm">
                <Link href="/contact">
                  Start Your Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
