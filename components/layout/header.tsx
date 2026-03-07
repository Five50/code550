"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X, ArrowRight, Code2, Palette, BarChart3, Layers, MessageSquare, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

interface HeaderProps {
  onContactClick?: () => void;
}

export function Header({ onContactClick }: HeaderProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Work", path: "/work" },
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" },
  ];

  const services = [
    {
      icon: Code2,
      name: "WordPress Development",
      description: "Custom themes, plugins, and WooCommerce solutions",
      stats: "50+ Projects",
      href: "/services#wordpress"
    },
    {
      icon: Layers,
      name: "Next.js / React",
      description: "Modern web applications with React and Next.js",
      stats: "35+ Apps",
      href: "/services#react"
    },
    {
      icon: BarChart3,
      name: "SEO & Performance",
      description: "Technical SEO, speed optimization, and analytics",
      stats: "2.5x Avg. Speed",
      href: "/services#seo"
    },
    {
      icon: Palette,
      name: "UI/UX Design",
      description: "User-centered design and interface development",
      stats: "100+ Designs",
      href: "/services#design"
    },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group relative z-10"
            >
              <div className="relative">
                <div className="absolute inset-0 glow-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                <img src="/images/code550-logo.png" alt="Code550" className="h-5 md:h-6 lg:h-7 relative z-10 transition-transform duration-300 group-hover:scale-105" />
              </div>
            </Link>

            {/* Center Navigation - Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Services with Mega Menu */}
              <div
                className="relative group"
                onMouseEnter={() => setServicesMenuOpen(true)}
                onMouseLeave={() => setServicesMenuOpen(false)}
              >
                <button
                  className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm relative ${
                    pathname === "/services"
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/30"
                  }`}
                >
                  Services
                  {/* Hover underline indicator */}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-8" />
                </button>

                {/* Mega Menu Dropdown */}
                {servicesMenuOpen && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-screen max-w-4xl"
                    onMouseEnter={() => setServicesMenuOpen(true)}
                    onMouseLeave={() => setServicesMenuOpen(false)}
                  >
                    <div className="p-6 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                      <div className="grid grid-cols-2 gap-4">
                        {services.map((service, index) => {
                          const Icon = service.icon;
                          return (
                            <Link
                              key={index}
                              href={service.href}
                              className="group/item p-4 rounded-xl hover:bg-card/50 transition-all duration-200"
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors">
                                  <Icon className="w-5 h-5 text-primary group-hover/item:scale-110 transition-transform" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-medium text-sm group-hover/item:text-primary transition-colors">
                                      {service.name}
                                    </h3>
                                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-2">
                                    {service.description}
                                  </p>
                                  <span className="text-xs font-mono text-primary">
                                    {service.stats}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <Link
                          href="/services"
                          className="flex items-center justify-center gap-2 text-sm text-primary hover:gap-3 transition-all"
                        >
                          View All Services
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Other Nav Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm relative group ${
                    pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/30"
                  }`}
                >
                  {link.name}
                  {/* Hover underline indicator */}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-8" />
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle - Redesigned Compact */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden md:flex items-center justify-center p-2 rounded-lg bg-card/30 border border-border/50 hover:bg-card/50 hover:border-primary/30 transition-all group"
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 text-muted-foreground rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 group-hover:text-primary" />
                <Moon className="absolute h-4 w-4 text-muted-foreground rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 group-hover:text-primary" />
              </button>

              {/* Contact Button - Desktop */}
              <Button
                size="sm"
                onClick={onContactClick}
                className="hidden lg:flex items-center gap-2 text-sm px-6"
              >
                <MessageSquare className="w-4 h-4" />
                Let&apos;s Talk
              </Button>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-card/50 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-background/95 backdrop-blur-xl"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative h-full pt-20 px-4 pb-4 overflow-y-auto">
            <div className="flex flex-col gap-2">
              {/* Mobile Services Accordion */}
              <div className="mb-2">
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-sm ${
                    pathname === "/services"
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  }`}
                >
                  <span className="font-medium">Services</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileServicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Accordion Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    mobileServicesOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="space-y-1 pl-2">
                    {services.map((service, index) => {
                      const Icon = service.icon;
                      return (
                        <Link
                          key={index}
                          href={service.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-card/50 transition-colors"
                        >
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{service.name}</div>
                            <div className="text-xs text-muted-foreground">{service.stats}</div>
                          </div>
                        </Link>
                      );
                    })}
                    <Link
                      href="/services"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 p-3 text-sm text-primary hover:bg-primary/10 rounded-lg transition-all"
                    >
                      View All Services
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Mobile Nav Links */}
              <div className="border-t border-border/50 pt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg transition-all text-sm ${
                      pathname === link.path
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Contact Button */}
              <div className="mt-6 px-4">
                <Button
                  size="lg"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onContactClick?.();
                  }}
                  className="w-full text-sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Let&apos;s Talk
                </Button>
              </div>

              {/* Mobile Theme Toggle */}
              <div className="flex items-center justify-between px-4 py-3 mt-4 rounded-lg bg-card/50 border border-border/50">
                <span className="text-sm text-muted-foreground">Dark Mode</span>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    className="data-[state=checked]:bg-primary"
                  />
                  <Moon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
