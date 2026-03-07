"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Palette,
  BarChart3,
  Layers,
} from "lucide-react";
import { motion } from "motion/react";

const fallbackServices: Record<
  string,
  {
    icon: typeof Code2;
    name: string;
    tagline: string;
    description: string;
    image: string;
    features: string[];
    benefits: string[];
    process: { title: string; description: string }[];
    stats: { value: string; label: string }[];
  }
> = {
  wordpress: {
    icon: Code2,
    name: "WordPress Development",
    tagline: "Enterprise WordPress solutions that scale",
    description:
      "Custom WordPress development tailored to your business needs. From custom themes and plugins to WooCommerce stores and enterprise solutions.",
    image:
      "https://images.unsplash.com/photo-1649451844931-57e22fc82de3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3JkcHJlc3MlMjBkZXZlbG9wbWVudCUyMHNjcmVlbnxlbnwxfHx8fDE3NzI3NTg0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Custom Theme Development",
      "Plugin Development & Customization",
      "WooCommerce Solutions",
      "Performance Optimization",
      "Security Hardening",
      "Ongoing Maintenance & Support",
      "API Integration",
      "Multisite Setup",
    ],
    benefits: [
      "Lightning-fast load times with optimized code",
      "SEO-friendly structure built-in",
      "Mobile-responsive design",
      "Easy content management",
      "Scalable architecture",
      "24/7 monitoring and support",
    ],
    process: [
      {
        title: "Discovery",
        description: "We analyze your requirements and goals",
      },
      {
        title: "Planning",
        description: "Create detailed project roadmap and timeline",
      },
      {
        title: "Development",
        description: "Build with best practices and modern standards",
      },
      {
        title: "Testing",
        description: "Rigorous QA across devices and browsers",
      },
      {
        title: "Launch",
        description: "Deploy and monitor for smooth rollout",
      },
      {
        title: "Support",
        description: "Ongoing maintenance and optimization",
      },
    ],
    stats: [
      { value: "50+", label: "WordPress Projects" },
      { value: "99.9%", label: "Uptime Average" },
      { value: "2.5x", label: "Speed Improvement" },
    ],
  },
  react: {
    icon: Layers,
    name: "Next.js / React Development",
    tagline: "Modern web applications built for performance",
    description:
      "Build lightning-fast, scalable web applications with React and Next.js. From single-page applications to complex enterprise platforms.",
    image:
      "https://images.unsplash.com/photo-1591267990439-bc68529677c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFjdCUyMGNvZGUlMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NzI3NTg0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "React & Next.js Development",
      "TypeScript Integration",
      "Server-Side Rendering (SSR)",
      "Static Site Generation (SSG)",
      "API Development & Integration",
      "State Management (Redux, Zustand)",
      "Progressive Web Apps (PWA)",
      "Real-time Features",
    ],
    benefits: [
      "Blazing fast performance with optimized rendering",
      "SEO-optimized with SSR/SSG",
      "Type-safe development with TypeScript",
      "Scalable component architecture",
      "Modern development workflows",
      "Future-proof technology stack",
    ],
    process: [
      {
        title: "Architecture",
        description: "Design scalable system architecture",
      },
      {
        title: "Setup",
        description: "Configure optimal development environment",
      },
      {
        title: "Development",
        description: "Build with modern React patterns",
      },
      {
        title: "Integration",
        description: "Connect APIs and third-party services",
      },
      {
        title: "Optimization",
        description: "Performance tuning and code splitting",
      },
      {
        title: "Deployment",
        description: "CI/CD pipeline and monitoring",
      },
    ],
    stats: [
      { value: "35+", label: "React Projects" },
      { value: "<1s", label: "Time to Interactive" },
      { value: "100", label: "Lighthouse Score" },
    ],
  },
  seo: {
    icon: BarChart3,
    name: "SEO & Performance Optimization",
    tagline: "Rank higher, load faster, convert better",
    description:
      "Comprehensive SEO and performance optimization to improve your search rankings, user experience, and conversion rates.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJzaXRlJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3Mjc1ODQyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Technical SEO Audit",
      "On-Page Optimization",
      "Core Web Vitals Optimization",
      "Site Speed Enhancement",
      "Schema Markup Implementation",
      "Mobile Optimization",
      "Analytics Setup & Tracking",
      "Conversion Rate Optimization",
    ],
    benefits: [
      "Improved search engine rankings",
      "Better user experience and engagement",
      "Higher conversion rates",
      "Reduced bounce rates",
      "Data-driven insights",
      "Competitive advantage",
    ],
    process: [
      {
        title: "Audit",
        description: "Comprehensive site analysis and benchmarking",
      },
      {
        title: "Strategy",
        description: "Develop targeted optimization plan",
      },
      {
        title: "Technical SEO",
        description: "Fix crawlability and indexing issues",
      },
      {
        title: "Performance",
        description: "Optimize speed and Core Web Vitals",
      },
      {
        title: "Content",
        description: "Optimize on-page elements and content",
      },
      {
        title: "Monitor",
        description: "Track results and continuous optimization",
      },
    ],
    stats: [
      { value: "185%", label: "Avg Traffic Increase" },
      { value: "2.5x", label: "Speed Improvement" },
      { value: "3.2x", label: "Conversion Boost" },
    ],
  },
  design: {
    icon: Palette,
    name: "UI/UX Design",
    tagline: "Beautiful interfaces that convert",
    description:
      "User-centered design that combines aesthetics with functionality. Create memorable digital experiences that drive engagement and conversions.",
    image:
      "https://images.unsplash.com/photo-1699040309386-11c615ed64d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1aSUyMGRlc2lnbiUyMGludGVyZmFjZXxlbnwxfHx8fDE3NzI2NjE3MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "User Research & Analysis",
      "Wireframing & Prototyping",
      "UI Design & Visual Identity",
      "Design Systems",
      "Responsive Design",
      "Usability Testing",
      "Accessibility (WCAG)",
      "Design Handoff & Documentation",
    ],
    benefits: [
      "Increased user engagement and satisfaction",
      "Higher conversion rates",
      "Reduced development time with design systems",
      "Consistent brand experience",
      "Improved accessibility",
      "Data-driven design decisions",
    ],
    process: [
      {
        title: "Research",
        description: "User research and competitive analysis",
      },
      {
        title: "Wireframes",
        description: "Low-fidelity layouts and user flows",
      },
      {
        title: "Design",
        description: "High-fidelity mockups and prototypes",
      },
      {
        title: "Testing",
        description: "Usability testing and iteration",
      },
      {
        title: "System",
        description: "Build scalable design system",
      },
      {
        title: "Handoff",
        description: "Developer-ready specifications",
      },
    ],
    stats: [
      { value: "100+", label: "Design Projects" },
      { value: "4.8/5", label: "Client Rating" },
      { value: "2.8x", label: "User Engagement" },
    ],
  },
};

interface ServiceDetailPageProps {
  service?: {
    slug: string;
    title: { rendered: string };
    acf?: {
      description?: string;
      tagline?: string;
    };
    _embedded?: {
      "wp:featuredmedia"?: { source_url: string }[];
    };
  };
}

export function ServiceDetailPage({ service: wpService }: ServiceDetailPageProps) {
  const serviceKey =
    wpService?.slug || "wordpress";
  const service =
    fallbackServices[serviceKey] || fallbackServices.wordpress;
  const Icon = service.icon;

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 glow-primary opacity-10 blur-3xl" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-6">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl mb-6">
              {service.name}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {service.tagline}
            </p>
            <Button size="lg" asChild className="text-sm">
              <Link href="/contact">
                Get a Free Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-border/50"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border/50 bg-card/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {service.stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
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

      {/* Description */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.p
              className="text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {service.description}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="py-20 bg-card/30 border-y border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Features */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-[family-name:var(--font-display)] text-3xl mb-8">
                What&apos;s Included
              </h2>
              <div className="space-y-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-[family-name:var(--font-display)] text-3xl mb-8">
                Key Benefits
              </h2>
              <div className="space-y-4">
                {service.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 text-xs font-mono">OUR PROCESS</Badge>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl mb-4">
              How We Work
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {service.process.map((step, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl border border-border/50 bg-card/30 hover:border-primary/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-sm font-mono text-primary mb-2">
                  Step {index + 1}
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-xl mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
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
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Let&apos;s discuss your project and create a custom solution
                that meets your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-sm">
                  <Link href="/contact">
                    Request a Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-sm"
                >
                  <Link href="/work">View Case Studies</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
