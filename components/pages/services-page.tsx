"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Code,
  Globe,
  Search,
  TrendingUp,
  Smartphone,
  Palette,
  CheckCircle2,
} from "lucide-react";

const fallbackServices = [
  {
    icon: Globe,
    name: "WordPress Development",
    description:
      "Enterprise-grade WordPress solutions that scale with your business needs.",
    deliverables: [
      "custom-themes",
      "plugin-dev",
      "woocommerce",
      "headless-wp",
      "maintenance",
      "migrations",
    ],
    features: [
      "Custom theme development from scratch",
      "Advanced Custom Fields integration",
      "WooCommerce e-commerce solutions",
      "Headless WordPress with REST API",
      "Performance optimization",
      "Security hardening and updates",
    ],
  },
  {
    icon: Code,
    name: "Next.js / React Development",
    description:
      "Modern, performant web applications built with the latest technologies.",
    deliverables: [
      "next.js",
      "react",
      "typescript",
      "tailwind",
      "ssr",
      "api-routes",
    ],
    features: [
      "Server-side rendering for better SEO",
      "Static site generation for speed",
      "TypeScript for type safety",
      "Tailwind CSS for rapid styling",
      "API route integration",
      "Progressive Web App capabilities",
    ],
  },
  {
    icon: Search,
    name: "SEO & Performance",
    description:
      "Technical optimization to rank higher and load faster.",
    deliverables: [
      "technical-seo",
      "core-web-vitals",
      "lighthouse",
      "schema-markup",
      "cdn-setup",
      "analytics",
    ],
    features: [
      "Technical SEO audits and fixes",
      "Core Web Vitals optimization",
      "Lighthouse score improvements",
      "Structured data implementation",
      "Image and asset optimization",
      "CDN and caching strategies",
    ],
  },
  {
    icon: TrendingUp,
    name: "Digital Marketing",
    description:
      "Data-driven marketing strategies that deliver measurable results.",
    deliverables: [
      "content-strategy",
      "ppc-ads",
      "email-marketing",
      "conversion-rate",
      "a/b-testing",
      "analytics-setup",
    ],
    features: [
      "Content marketing strategies",
      "PPC campaign management",
      "Email marketing automation",
      "Conversion rate optimization",
      "A/B testing and experimentation",
      "Analytics and reporting dashboards",
    ],
  },
  {
    icon: Smartphone,
    name: "Web Applications",
    description:
      "Custom web apps tailored to your business processes and workflows.",
    deliverables: [
      "saas-mvp",
      "dashboards",
      "auth-systems",
      "real-time",
      "integrations",
      "deployment",
    ],
    features: [
      "SaaS MVP development",
      "Custom admin dashboards",
      "Authentication and authorization",
      "Real-time data synchronization",
      "Third-party API integrations",
      "Cloud deployment and DevOps",
    ],
  },
  {
    icon: Palette,
    name: "UI/UX Design",
    description:
      "Beautiful, intuitive interfaces that enhance user experience.",
    deliverables: [
      "wireframes",
      "prototypes",
      "design-systems",
      "user-testing",
      "figma-handoff",
      "responsive",
    ],
    features: [
      "User research and personas",
      "Wireframing and prototyping",
      "Design system creation",
      "User testing and iteration",
      "Figma to code handoff",
      "Responsive design for all devices",
    ],
  },
];

interface ServicesPageProps {
  services?: unknown[];
}

export function ServicesPage({ services: _services }: ServicesPageProps) {
  const services = fallbackServices;

  return (
    <div className="min-h-screen relative">
      {/* Grid Background */}
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />

      <section className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl mb-6">
            Our Services
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Comprehensive digital solutions designed to help your business
            thrive in the modern web landscape.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isEven = index % 2 === 0;

            return (
              <Card
                key={index}
                className={`${
                  isEven
                    ? "col-span-12 lg:col-span-8"
                    : "col-span-12 lg:col-span-4"
                } p-8 hover:scale-[1.01] transition-all`}
              >
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-4 rounded-xl bg-primary/10">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="font-[family-name:var(--font-display)] text-3xl mb-3">
                    {service.name}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0 space-y-6">
                  <div>
                    <h4 className="font-[family-name:var(--font-display)] text-sm uppercase tracking-wider mb-3 text-muted-foreground">
                      Deliverables
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {service.deliverables.map((deliverable, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="text-xs"
                        >
                          {deliverable}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-[family-name:var(--font-display)] text-sm uppercase tracking-wider mb-3 text-muted-foreground">
                      What&apos;s Included
                    </h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Card */}
        <Card className="mt-12 p-12 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 backdrop-blur">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-[family-name:var(--font-display)] text-4xl mb-4">
              Let&apos;s Build Together
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Not sure which service fits your needs? Schedule a free
              consultation and we&apos;ll help you chart the best path forward.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">
                Schedule Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
