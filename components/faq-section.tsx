"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "motion/react";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  faqs: FAQ[];
}

export function FAQSection({ title = "Frequently Asked Questions", faqs }: FAQSectionProps) {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-soft/20 rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl mb-4">
              {title}
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about our services
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border border-border/50 rounded-xl px-6 bg-card/30 backdrop-blur-sm data-[state=open]:bg-card/50 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="font-medium pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
