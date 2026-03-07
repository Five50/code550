"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Phone, CheckCircle2, Clock, MessageSquare, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        window.location.href = "/thank-you";
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const reasons = [
    { icon: CheckCircle2, text: "Free initial consultation" },
    { icon: Clock, text: "24-hour response time" },
    { icon: MessageSquare, text: "Dedicated project manager" },
    { icon: CheckCircle2, text: "Transparent pricing" },
    { icon: CheckCircle2, text: "98% client satisfaction" },
    { icon: CheckCircle2, text: "Post-launch support included" }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@code550.com",
      link: "mailto:hello@code550.com"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      link: "tel:+15551234567"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "San Francisco, CA",
      link: "#"
    }
  ];

  const faqs = [
    {
      q: "What's your typical project timeline?",
      a: "Most projects take 6-12 weeks from kickoff to launch, depending on scope and complexity."
    },
    {
      q: "Do you offer ongoing support?",
      a: "Yes! We provide 24/7 monitoring, maintenance, and support packages for all our clients."
    },
    {
      q: "What's your development process?",
      a: "We follow an agile methodology with weekly sprints, regular demos, and continuous client feedback."
    },
    {
      q: "Can you work with our existing team?",
      a: "Absolutely! We often collaborate with in-house teams and integrate seamlessly into your workflow."
    }
  ];

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
            <Badge className="mb-6 text-xs font-mono">GET IN TOUCH</Badge>
            <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl mb-6">
              Start Your Project
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Tell us about your project and we&apos;ll get back to you within 24 hours with a custom proposal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-y border-border/50 bg-card/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 p-3 rounded-lg bg-background/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-xs font-medium">{reason.text}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="p-8 md:p-10 rounded-3xl border border-border/50 bg-card/30">
                <h2 className="font-[family-name:var(--font-display)] text-3xl mb-2">
                  Project Details
                </h2>
                <p className="text-muted-foreground mb-8">
                  The more details you provide, the better we can help you.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Your Name *
                      </label>
                      <Input
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-background border-border/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Email Address *
                      </label>
                      <Input
                        required
                        type="email"
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-background border-border/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Company / Organization
                    </label>
                    <Input
                      placeholder="Your Company Inc."
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="bg-background border-border/50"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Project Type *
                      </label>
                      <Select
                        value={formData.projectType}
                        onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                      >
                        <SelectTrigger className="bg-background border-border/50">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wordpress">WordPress Development</SelectItem>
                          <SelectItem value="react">Next.js / React App</SelectItem>
                          <SelectItem value="seo">SEO & Performance</SelectItem>
                          <SelectItem value="design">UI/UX Design</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Budget Range *
                      </label>
                      <Select
                        value={formData.budget}
                        onValueChange={(value) => setFormData({ ...formData, budget: value })}
                      >
                        <SelectTrigger className="bg-background border-border/50">
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10k-25k">$10k - $25k</SelectItem>
                          <SelectItem value="25k-50k">$25k - $50k</SelectItem>
                          <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                          <SelectItem value="100k+">$100k+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Timeline *
                    </label>
                    <Select
                      value={formData.timeline}
                      onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                    >
                      <SelectTrigger className="bg-background border-border/50">
                        <SelectValue placeholder="When do you need this?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">ASAP (1-2 weeks)</SelectItem>
                        <SelectItem value="month">Within a month</SelectItem>
                        <SelectItem value="quarter">Within 3 months</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Project Description *
                    </label>
                    <Textarea
                      required
                      placeholder="Tell us about your project, goals, and any specific requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="min-h-32 bg-background border-border/50 resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full md:w-auto text-sm group" disabled={submitting}>
                      {submitting ? "Sending..." : "Send Project Details"}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3 font-mono">
                      We&apos;ll respond within 24 hours with next steps
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* Contact Info */}
              <div className="p-6 rounded-2xl border border-border/50 bg-card/30">
                <h3 className="font-[family-name:var(--font-display)] text-xl mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <a
                        key={index}
                        href={info.link}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1 font-mono">
                            {info.title}
                          </div>
                          <div className="text-sm font-medium group-hover:text-primary transition-colors">
                            {info.content}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Office Hours */}
              <div className="p-6 rounded-2xl border border-border/50 bg-card/30">
                <h3 className="font-[family-name:var(--font-display)] text-xl mb-4">
                  Office Hours
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">9am - 6pm PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">10am - 4pm PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground font-mono">
                    24/7 emergency support available for active clients
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="p-6 rounded-2xl border border-border/50 bg-card/30">
                <h3 className="font-[family-name:var(--font-display)] text-xl mb-4">
                  Quick Links
                </h3>
                <div className="space-y-2 text-sm">
                  <Link href="/services" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <ArrowRight className="w-3 h-3" />
                    View Services
                  </Link>
                  <Link href="/work" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <ArrowRight className="w-3 h-3" />
                    Case Studies
                  </Link>
                  <Link href="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <ArrowRight className="w-3 h-3" />
                    Read Our Blog
                  </Link>
                  <Link href="/about" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <ArrowRight className="w-3 h-3" />
                    About Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-card/30 border-y border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 text-xs font-mono">FAQ</Badge>
            <h2 className="font-[family-name:var(--font-display)] text-4xl mb-4">
              Common Questions
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl border border-border/50 bg-background/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="font-medium mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
