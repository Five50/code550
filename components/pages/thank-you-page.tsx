"use client";

import { motion } from "motion/react";
import { CheckCircle2, ArrowRight, Calendar, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ThankYouPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-accent-soft/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
            className="mb-6 md:mb-8 inline-block"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"
              />
              <div className="relative bg-primary/10 backdrop-blur-sm p-6 md:p-8 rounded-full border border-primary/20">
                <CheckCircle2 className="w-16 h-16 md:w-20 md:h-20 text-primary" />
              </div>
            </div>
          </motion.div>

          {/* Title & Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-6xl mb-4 md:mb-6">
              Thank You!
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-3 md:mb-4">
              We&apos;ve received your message
            </p>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed">
              Our team will review your request and get back to you within 24 hours.
              We&apos;re excited to learn more about your project and how we can help bring your vision to life.
            </p>
          </motion.div>

          {/* What Happens Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-10 md:mb-12"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl mb-6 md:mb-8">
              What happens next?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left">
              {[
                {
                  icon: Mail,
                  title: "1. Email Confirmation",
                  description: "You'll receive a confirmation email shortly with a summary of your request."
                },
                {
                  icon: Calendar,
                  title: "2. Team Review",
                  description: "Our specialists will analyze your project requirements and prepare a proposal."
                },
                {
                  icon: Phone,
                  title: "3. Initial Contact",
                  description: "We'll reach out within 24 hours to schedule a discovery call."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + (index * 0.1) }}
                  className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all group"
                >
                  <div className="mb-3 md:mb-4 inline-flex p-2.5 md:p-3 rounded-full bg-primary/10">
                    <step.icon className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-medium mb-2 text-sm md:text-base">{step.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <Button asChild size="lg" className="text-sm">
              <Link href="/" className="group">
                Back to Home
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-sm">
              <Link href="/work" className="group">
                View Our Work
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>

          {/* Additional Help */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-border/50"
          >
            <p className="text-xs sm:text-sm text-muted-foreground">
              Need immediate assistance?{" "}
              <a
                href="mailto:hello@code550.com"
                className="text-primary hover:underline font-medium"
              >
                Email us directly
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
