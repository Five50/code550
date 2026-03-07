"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, ArrowUpRight, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export function Footer() {
  const [language, setLanguage] = useState("en");

  const navigation = {
    services: [
      { name: "WordPress Development", href: "/services#wordpress" },
      { name: "Next.js / React", href: "/services#react" },
      { name: "SEO & Performance", href: "/services#seo" },
      { name: "UI/UX Design", href: "/services#design" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Work", href: "/work" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
    social: [
      { name: "Twitter", icon: Twitter, href: "#" },
      { name: "GitHub", icon: Github, href: "#" },
      { name: "LinkedIn", icon: Linkedin, href: "#" },
      { name: "Email", icon: Mail, href: "mailto:hello@code550.com" },
    ],
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-32 border-t border-border/50 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-border/50">
          <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative p-6 sm:p-8 md:p-12 rounded-2xl md:rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-transparent overflow-hidden">
                <div className="absolute inset-0 glow-primary opacity-20 blur-3xl" />
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      <span className="text-xs font-mono text-primary uppercase tracking-wider">
                        Newsletter
                      </span>
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl mb-2 md:mb-3">
                      Stay in the Loop
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Get the latest insights on web development, design trends, and digital strategy.
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="flex-1 px-4 py-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                      <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-sm font-medium flex items-center justify-center gap-2 group whitespace-nowrap">
                        Subscribe
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 font-mono">
                      Join 2,000+ subscribers. No spam, ever.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 mb-12">
            {/* Brand Column */}
            <div className="sm:col-span-2 lg:col-span-5">
              <Link href="/" className="inline-flex items-center mb-6 group">
                <div className="relative">
                  <div className="absolute inset-0 glow-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                  <img src="/images/code550-logo.png" alt="Code550" className="h-6 md:h-8 relative z-10" />
                </div>
              </Link>
              <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 max-w-sm leading-relaxed">
                Crafting exceptional digital experiences through innovative web development, design, and strategy.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {navigation.social.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group relative p-2.5 md:p-3 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 bg-card/30 hover:bg-card/50"
                      aria-label={item.name}
                    >
                      <Icon className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <div className="absolute inset-0 glow-primary opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300 rounded-xl" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Services Column */}
            <div className="lg:col-span-3">
              <h4 className="font-[family-name:var(--font-display)] text-sm md:text-base mb-4 md:mb-6">
                Services
              </h4>
              <ul className="space-y-2.5 md:space-y-3">
                {navigation.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 mr-2 opacity-30 group-hover:opacity-100 transition-all duration-200" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div className="lg:col-span-2">
              <h4 className="font-[family-name:var(--font-display)] text-sm md:text-base mb-4 md:mb-6">
                Company
              </h4>
              <ul className="space-y-2.5 md:space-y-3">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 mr-2 opacity-30 group-hover:opacity-100 transition-all duration-200" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div className="lg:col-span-2">
              <h4 className="font-[family-name:var(--font-display)] text-sm md:text-base mb-4 md:mb-6">
                Contact
              </h4>
              <div className="space-y-3 md:space-y-4">
                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-1 uppercase tracking-wider">
                    Email
                  </p>
                  <a
                    href="mailto:hello@code550.com"
                    className="text-sm text-foreground hover:text-primary transition-colors break-all"
                  >
                    hello@code550.com
                  </a>
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-1 uppercase tracking-wider">
                    Phone
                  </p>
                  <a
                    href="tel:+15551234567"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-1 uppercase tracking-wider">
                    Location
                  </p>
                  <p className="text-sm text-foreground">
                    San Francisco, CA
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-6 md:pt-8 border-t border-border/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-6 w-full md:w-auto">
                <div className="text-xs text-muted-foreground font-mono text-center sm:text-left">
                  &copy; {currentYear} Code550. All rights reserved.
                </div>

                {/* Language Selector */}
                <Select value={language} onValueChange={(value) => setLanguage(value)}>
                  <SelectTrigger className="w-[140px] h-8 text-xs bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Espanol</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
                <Link
                  href="/privacy"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/cookies"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
                >
                  Cookie Policy
                </Link>
                <a
                  href="#"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
                >
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
