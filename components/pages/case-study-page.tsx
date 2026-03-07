"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const fallbackCaseStudy = {
  title: "TechFlow E-Commerce Platform",
  client: "TechFlow Inc.",
  category: "WordPress",
  industry: "Consumer Electronics",
  duration: "12 weeks",
  teamSize: "4 specialists",
  tagline:
    "Transforming a legacy e-commerce site into a high-converting powerhouse",
  description:
    "TechFlow came to us with a slow, outdated WooCommerce site that was losing customers at checkout. We rebuilt their entire platform from the ground up with a focus on speed, usability, and conversion optimization.",
  image:
    "https://images.unsplash.com/photo-1649451844931-57e22fc82de3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3JkcHJlc3MlMjBkZXZlbG9wbWVudCUyMHNjcmVlbnxlbnwxfHx8fDE3NzI3NTg0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  challenge:
    "TechFlow's existing WooCommerce site suffered from poor performance (40/100 Lighthouse score), a 68% cart abandonment rate, and mobile usability issues. They were losing sales to competitors with faster, more modern experiences.",
  solution:
    "We conducted a complete rebuild with a custom WordPress theme optimized for speed and conversions. Key improvements included:\n\n\u2022 Custom checkout flow reducing steps from 5 to 2\n\u2022 Advanced product filtering with instant search\n\u2022 Progressive image loading and lazy loading\n\u2022 Integrated inventory management system\n\u2022 Mobile-first design with touch-optimized interactions\n\u2022 Payment gateway optimization (Stripe, PayPal, Apple Pay)\n\u2022 Real-time shipping calculations\n\u2022 Personalized product recommendations",
  results: [
    {
      metric: "Conversion Rate",
      before: "1.8%",
      after: "2.6%",
      change: "+47%",
    },
    {
      metric: "Page Load Time",
      before: "6.2s",
      after: "1.4s",
      change: "-77%",
    },
    {
      metric: "Cart Abandonment",
      before: "68%",
      after: "42%",
      change: "-38%",
    },
    {
      metric: "Revenue",
      before: "$45k/mo",
      after: "$103k/mo",
      change: "+128%",
    },
    {
      metric: "Mobile Conversions",
      before: "0.9%",
      after: "2.1%",
      change: "+133%",
    },
    {
      metric: "Lighthouse Score",
      before: "40",
      after: "95",
      change: "+138%",
    },
  ],
  testimonial: {
    quote:
      "Code550 didn't just rebuild our website\u2014they transformed our entire business. We've more than doubled our online revenue and our customers love the new experience. The team was professional, responsive, and truly understood our needs.",
    author: "Jennifer Martinez",
    role: "CEO, TechFlow Inc.",
    image:
      "https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3Mjc0NzExM3ww&ixlib=rb-4.1.0&q=80&w=400",
  },
  technologies: [
    "WordPress",
    "WooCommerce",
    "PHP",
    "JavaScript",
    "Stripe API",
    "Google Analytics",
  ],
  deliverables: [
    "Custom WordPress theme",
    "WooCommerce customizations",
    "Payment gateway integrations",
    "Inventory management system",
    "Analytics & tracking setup",
    "Performance optimization",
    "Mobile app design",
    "Training & documentation",
  ],
  images: [
    "https://images.unsplash.com/photo-1649451844931-57e22fc82de3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3JkcHJlc3MlMjBkZXZlbG9wbWVudCUyMHNjcmVlbnxlbnwxfHx8fDE3NzI3NTg0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJzaXRlJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3Mjc1ODQyOXww&ixlib=rb-4.1.0&q=80&w=1080",
  ],
};

interface CaseStudyPageProps {
  caseStudy?: {
    slug: string;
    title: { rendered: string };
    acf?: Record<string, unknown>;
    _embedded?: {
      "wp:featuredmedia"?: { source_url: string }[];
    };
  };
}

export function CaseStudyPage({ caseStudy: _wpCaseStudy }: CaseStudyPageProps) {
  const study = fallbackCaseStudy;

  return (
    <div className="min-h-screen pt-24">
      <article itemScope itemType="https://schema.org/Article">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 md:px-6">
          <Breadcrumbs
            items={[
              { label: "Work", href: "/work" },
              { label: study.title },
            ]}
          />
        </div>

        {/* Hero Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="mb-4 text-xs">{study.category}</Badge>
              <h1
                className="font-[family-name:var(--font-display)] text-4xl md:text-6xl mb-4"
                itemProp="headline"
              >
                {study.title}
              </h1>
              <p
                className="text-xl text-muted-foreground mb-8"
                itemProp="description"
              >
                {study.tagline}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{study.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{study.teamSize}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{study.industry}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Hero Image */}
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            <motion.figure
              className="relative max-w-6xl mx-auto rounded-3xl overflow-hidden border border-border/50"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={study.image}
                alt={study.title}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </motion.figure>
          </div>
        </section>

        {/* Key Results */}
        <section className="py-20 bg-card/30 border-y border-border/50">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl mb-12 text-center">
                Key Results
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {study.results.map((result, index) => (
                  <motion.div
                    key={index}
                    className="p-6 rounded-2xl border border-border/50 bg-background/50"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                      {result.metric}
                    </div>
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="font-[family-name:var(--font-display)] text-3xl bg-gradient-to-br from-primary to-accent-soft bg-clip-text text-transparent">
                        {result.change}
                      </span>
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.before} &rarr; {result.after}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Challenge & Solution */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-[family-name:var(--font-display)] text-3xl mb-6">
                  The Challenge
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {study.challenge}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-[family-name:var(--font-display)] text-3xl mb-6">
                  Our Solution
                </h2>
                <div className="prose prose-invert max-w-none">
                  {study.solution.split("\n\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-muted-foreground leading-relaxed text-lg mb-4"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Visual Gallery */}
        {study.images.length > 1 && (
          <section className="py-20 bg-card/30 border-y border-border/50">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {study.images.map((image, index) => (
                  <motion.figure
                    key={index}
                    className="relative rounded-2xl overflow-hidden border border-border/50"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={`${study.title} screenshot ${index + 1}`}
                      className="w-full h-80 object-cover"
                    />
                  </motion.figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Technologies & Deliverables */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="font-[family-name:var(--font-display)] text-2xl mb-6">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {study.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="font-[family-name:var(--font-display)] text-2xl mb-6">
                  Deliverables
                </h3>
                <ul className="space-y-3">
                  {study.deliverables.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 bg-card/30 border-y border-border/50">
          <div className="container mx-auto px-4 md:px-6">
            <motion.blockquote
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative p-8 md:p-12 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-transparent">
                <div className="absolute inset-0 glow-primary opacity-20 blur-3xl" />
                <div className="relative z-10">
                  <p className="text-xl md:text-2xl mb-8 leading-relaxed">
                    &ldquo;{study.testimonial.quote}&rdquo;
                  </p>
                  <footer className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={study.testimonial.image}
                      alt={study.testimonial.author}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <cite className="font-medium not-italic block">
                        {study.testimonial.author}
                      </cite>
                      <div className="text-sm text-muted-foreground font-mono">
                        {study.testimonial.role}
                      </div>
                    </div>
                  </footer>
                </div>
              </div>
            </motion.blockquote>
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
                  Want Similar Results?
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  Let&apos;s discuss how we can help transform your digital
                  presence and drive real business growth.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="text-sm">
                    <Link href="/contact">
                      Start Your Project
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="text-sm"
                  >
                    <Link href="/work">View More Work</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </article>
    </div>
  );
}
