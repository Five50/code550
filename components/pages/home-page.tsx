"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { StatCounter } from "@/components/stat-counter";
import { FAQSection } from "@/components/faq-section";
import {
  ArrowRight,
  Code2,
  Palette,
  BarChart3,
  Layers,
  CheckCircle2,
  Star,
  TrendingUp,
} from "lucide-react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const fallbackServices = [
  {
    icon: Code2,
    name: "WordPress Development",
    description:
      "Custom themes, plugins, and WooCommerce solutions that scale",
    features: [
      "Custom Themes",
      "Plugin Development",
      "WooCommerce",
      "Maintenance",
    ],
    image:
      "https://images.unsplash.com/photo-1649451844931-57e22fc82de3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3JkcHJlc3MlMjBkZXZlbG9wbWVudCUyMHNjcmVlbnxlbnwxfHx8fDE3NzI3NTg0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    link: "/services#wordpress",
  },
  {
    icon: Layers,
    name: "Next.js / React",
    description:
      "Lightning-fast web applications with modern frameworks",
    features: ["React Apps", "Next.js", "TypeScript", "API Integration"],
    image:
      "https://images.unsplash.com/photo-1591267990439-bc68529677c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFjdCUyMGNvZGUlMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NzI3NTg0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    link: "/services#react",
  },
  {
    icon: BarChart3,
    name: "SEO & Performance",
    description:
      "Technical optimization for search rankings and speed",
    features: [
      "Technical SEO",
      "Speed Optimization",
      "Core Web Vitals",
      "Analytics",
    ],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJzaXRlJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3Mjc1ODQyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    link: "/services#seo",
  },
  {
    icon: Palette,
    name: "UI/UX Design",
    description:
      "Beautiful interfaces that users love to interact with",
    features: [
      "Interface Design",
      "User Research",
      "Prototyping",
      "Design Systems",
    ],
    image:
      "https://images.unsplash.com/photo-1699040309386-11c615ed64d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1aSUyMGRlc2lnbiUyMGludGVyZmFjZXxlbnwxfHx8fDE3NzI2NjE3MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    link: "/services#design",
  },
];

const benefits = [
  "98% Client Satisfaction Rate",
  "Average 2.5x Performance Improvement",
  "24/7 Support & Maintenance",
  "Dedicated Project Manager",
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, TechStart",
    image:
      "https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3Mjc0NzExM3ww&ixlib=rb-4.1.0&q=80&w=400",
    content:
      "Code550 transformed our digital presence. The team delivered a blazing-fast website that converted 3x better than our old one.",
  },
  {
    name: "Michael Rodriguez",
    role: "Founder, GrowthLab",
    image:
      "https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3Mjc0NzExM3ww&ixlib=rb-4.1.0&q=80&w=400",
    content:
      "Working with Code550 was seamless. They understood our vision and delivered beyond expectations with attention to every detail.",
  },
];

const faqs = [
  {
    question: "How long does a typical project take?",
    answer:
      "Project timelines vary based on scope and complexity. A standard website typically takes 6-8 weeks from kickoff to launch. More complex applications can range from 3-6 months. We provide detailed timelines during the proposal phase.",
  },
  {
    question: "What's your development process like?",
    answer:
      "We follow an agile methodology with regular check-ins and milestone reviews. You'll have a dedicated project manager, access to our project board, and weekly progress updates. We prioritize transparency and collaboration throughout the entire process.",
  },
  {
    question: "Do you provide ongoing support after launch?",
    answer:
      "Absolutely! We offer various maintenance and support packages including 24/7 monitoring, regular updates, security patches, and performance optimization. Most clients choose to keep us on retainer for peace of mind.",
  },
  {
    question: "What makes Code550 different from other agencies?",
    answer:
      "We combine technical excellence with business strategy. Every project starts with understanding your goals and metrics that matter. We're not just developers—we're growth partners who focus on measurable results, not just deliverables.",
  },
  {
    question: "What technologies do you specialize in?",
    answer:
      "We specialize in WordPress, React/Next.js, and modern JavaScript frameworks. Our tech stack is chosen based on your specific needs—we prioritize performance, scalability, and maintainability over trendy solutions.",
  },
  {
    question: "How do you price your projects?",
    answer:
      "We offer fixed-price project quotes and monthly retainer options. Pricing depends on project scope, timeline, and complexity. After our discovery call, we'll provide a detailed proposal with transparent pricing and deliverables.",
  },
];

interface HomePageProps {
  services?: unknown[];
}

export function HomePage({ services: _services }: HomePageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const services = fallbackServices;

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="absolute inset-0 gradient-mesh" />
          <motion.div
            className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 rounded-full glow-primary opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 rounded-full glow-blue opacity-20"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        <motion.div
          className="container mx-auto px-4 md:px-6 relative z-10"
          style={{ opacity, scale }}
        >
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6 px-4 py-1.5 text-xs font-mono rounded-full">
                DIGITAL EXCELLENCE SINCE 2016
              </Badge>
            </motion.div>

            <motion.h1
              className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Build Digital Products That{" "}
              <span className="bg-gradient-to-br from-primary via-primary to-accent-soft bg-clip-text text-transparent">
                Convert
              </span>
            </motion.h1>

            <motion.p
              className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              We craft high-performance websites and applications that drive
              measurable results. From strategy to deployment, we&apos;re your
              technical partner for growth.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button size="lg" asChild className="group text-sm">
                <Link href="/contact">
                  Start Your Project
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16 md:mt-20"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <StatCounter end={150} suffix="+" label="Projects Delivered" />
              <StatCounter end={98} suffix="%" label="Client Satisfaction" />
              <StatCounter end={2.5} suffix="x" label="Avg Speed Boost" />
              <StatCounter end={24} suffix="/7" label="Support Available" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Social Proof - Benefits */}
      <section className="py-20 border-y border-border/50 bg-card/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-background/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 text-xs font-mono">OUR SERVICES</Badge>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl mb-4">
              What We Build
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              End-to-end solutions designed for performance, scalability, and
              conversion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Link href={service.link}>
                    <div className="relative overflow-hidden rounded-2xl gradient-border-soft hover:border-primary/50 transition-all duration-500">
                      {/* Background Grid */}
                      <div className="absolute inset-0 bg-dot-pattern opacity-20" />

                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/90 to-transparent" />
                        <div className="absolute inset-0 glow-primary opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                        </div>

                        <h3 className="font-[family-name:var(--font-display)] text-2xl mb-3 group-hover:text-primary transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {service.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {service.features.map((feature, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-2 transition-transform">
                          Learn more
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-sm"
            >
              <Link href="/services">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-card/30 border-y border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 text-xs font-mono">TESTIMONIALS</Badge>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl mb-4">
              Client Success Stories
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-2xl border border-border/50 bg-background/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="relative max-w-4xl mx-auto text-center p-12 md:p-16 rounded-3xl border border-primary/20 bg-card/30 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 glow-primary opacity-20 blur-3xl" />
            <div className="relative z-10">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl mb-4">
                Ready to Scale Your Business?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Let&apos;s build something exceptional together. Get a free
                consultation and project estimate.
              </p>
              <Button size="lg" asChild className="text-sm">
                <Link href="/contact">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-4 font-mono">
                Free consultation &bull; No obligation &bull; Fast response
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection faqs={faqs} />
    </div>
  );
}
