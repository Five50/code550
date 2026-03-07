"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Users,
  Target,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { motion } from "motion/react";

const fallbackTeam = [
  {
    name: "Alex Thompson",
    role: "Founder & Lead Developer",
    image:
      "https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3Mjc0NzExM3ww&ixlib=rb-4.1.0&q=80&w=400",
    bio: "10+ years building scalable web applications. Specialized in React, Next.js, and performance optimization.",
  },
  {
    name: "Sarah Chen",
    role: "Design Director",
    image:
      "https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3Mjc0NzExM3ww&ixlib=rb-4.1.0&q=80&w=400",
    bio: "Award-winning designer passionate about creating intuitive, accessible user experiences that convert.",
  },
  {
    name: "Michael Rodriguez",
    role: "SEO & Performance Lead",
    image:
      "https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3Mjc0NzExM3ww&ixlib=rb-4.1.0&q=80&w=400",
    bio: "Technical SEO expert with proven track record of improving search rankings and site performance.",
  },
  {
    name: "Emma Wilson",
    role: "WordPress Specialist",
    image:
      "https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3Mjc0NzExM3ww&ixlib=rb-4.1.0&q=80&w=400",
    bio: "WordPress developer with expertise in custom themes, plugins, and WooCommerce solutions.",
  },
];

const values = [
  {
    icon: Target,
    title: "Results-Driven",
    description:
      "Every decision we make is focused on delivering measurable business results for our clients.",
  },
  {
    icon: Zap,
    title: "Performance First",
    description:
      "We build fast, optimized experiences that users love and search engines reward.",
  },
  {
    icon: Users,
    title: "Client Partnership",
    description:
      "We're not just vendors\u2014we're strategic partners invested in your long-term success.",
  },
  {
    icon: Award,
    title: "Quality Obsessed",
    description:
      "We sweat the details and won't ship anything we're not proud to put our name on.",
  },
];

const achievements = [
  "150+ successful projects delivered",
  "98% client satisfaction rate",
  "$50M+ in client revenue generated",
  "Average 2.5x performance improvement",
  "24/7 support & maintenance",
  "Award-winning design team",
];

interface AboutPageProps {
  teamMembers?: unknown[];
}

export function AboutPage({ teamMembers: _teamMembers }: AboutPageProps) {
  const team = fallbackTeam;

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
            <Badge className="mb-6 text-xs font-mono">ABOUT US</Badge>
            <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl mb-6">
              We Build Digital Products That Scale
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Code550 is a full-service digital agency specializing in
              high-performance web applications. Since 2016, we&apos;ve helped
              businesses grow through strategic design, development, and
              optimization.
            </p>
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
              src="https://images.unsplash.com/photo-1758691736843-90f58dce465e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHRlYW0lMjBjb2xsYWJvcmF0aW9uJTIwb2ZmaWNlfGVufDF8fHx8MTc3MjY2MzMzMHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Code550 Team"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl mb-6">
                Our Mission
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                We exist to help businesses thrive in the digital age. Our
                mission is to create exceptional web experiences that combine
                beautiful design, cutting-edge technology, and
                conversion-focused strategy.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you&apos;re launching a new product, rebuilding your
                digital presence, or scaling your business, we&apos;re here to
                be your technical partner every step of the way.
              </p>
            </motion.div>

            {/* Achievements Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/30"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{achievement}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-card/30 border-y border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 text-xs font-mono">OUR VALUES</Badge>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl mb-4">
              What Drives Us
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  className="p-6 rounded-2xl border border-border/50 bg-background/50 hover:border-primary/50 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-xl mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 text-xs font-mono">OUR TEAM</Badge>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl mb-4">
              Meet the Team
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Talented individuals united by a passion for creating exceptional
              digital experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-card/30 hover:border-primary/50 transition-all">
                  <div className="relative aspect-square overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-[family-name:var(--font-display)] text-xl mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary mb-3 font-mono">
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border/50">
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
                Let&apos;s Work Together
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Ready to take your digital presence to the next level?
                Let&apos;s start a conversation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-sm">
                  <Link href="/contact">
                    Get in Touch
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-sm"
                >
                  <Link href="/work">View Our Work</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
