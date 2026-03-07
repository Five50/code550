"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, User, Briefcase, Sparkles, X, CheckCircle2, Mail, Building2, DollarSign, Clock, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContactModal } from "@/lib/contact-modal-context";

const stepImages = [
  "https://images.unsplash.com/photo-1769839271827-e7e287319dd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NzI2NzU0OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1759844197486-5b3612c7d534?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwcHJvamVjdCUyMHBsYW5uaW5nJTIwd29ya3NwYWNlfGVufDF8fHx8MTc3Mjc2MTExMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1730382624761-af8112d26209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHN1Y2Nlc3MlMjBncm93dGglMjBjaGFydHxlbnwxfHx8fDE3NzI3NjExMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
];

export function ContactModal() {
  const router = useRouter();
  const { isOpen, closeModal } = useContactModal();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
    goals: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    closeModal();
    router.push("/thank-you");
    setStep(1);
    setFormData({
      name: "",
      email: "",
      company: "",
      projectType: "",
      budget: "",
      timeline: "",
      message: "",
      goals: [],
    });
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const goalOptions = [
    "Increase Conversions",
    "Improve Performance",
    "Modern Redesign",
    "SEO Optimization",
    "Custom Features",
    "E-commerce"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card border border-border/50 rounded-3xl shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <header className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border/50 bg-card/95 backdrop-blur-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-mono text-primary uppercase tracking-wider">
                      Step {step} of 3
                    </span>
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl">
                    {step === 1 && "Tell us about yourself"}
                    {step === 2 && "Project details"}
                    {step === 3 && "What are your goals?"}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-background/50 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </header>

              {/* Progress Bar */}
              <div className="h-1 bg-background">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent-soft"
                  initial={{ width: "33%" }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 md:p-8">
                {/* Step 1: Personal Info */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2" htmlFor="name">
                        <User className="w-4 h-4 text-primary" />
                        Your Name *
                      </label>
                      <Input
                        id="name"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-background/50 border-border/50 h-12 text-base focus:border-primary/50 transition-all"
                        autoFocus
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2" htmlFor="email">
                        <Mail className="w-4 h-4 text-primary" />
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        required
                        type="email"
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-background/50 border-border/50 h-12 text-base focus:border-primary/50 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2" htmlFor="company">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        Company / Organization
                        <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                      </label>
                      <Input
                        id="company"
                        placeholder="Your Company Inc."
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="bg-background/50 border-border/50 h-12 text-base focus:border-primary/50 transition-all"
                      />
                    </div>

                    <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <p className="text-sm text-muted-foreground flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>We respect your privacy. Your information is secure and will only be used to contact you about your project.</span>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Project Details */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2" htmlFor="projectType">
                        <Briefcase className="w-4 h-4 text-primary" />
                        What type of project? *
                      </label>
                      <Select
                        value={formData.projectType}
                        onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                      >
                        <SelectTrigger id="projectType" className="bg-background/50 border-border/50 h-12 text-base">
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wordpress">WordPress Development</SelectItem>
                          <SelectItem value="react">Next.js / React App</SelectItem>
                          <SelectItem value="seo">SEO &amp; Performance</SelectItem>
                          <SelectItem value="design">UI/UX Design</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2" htmlFor="budget">
                          <DollarSign className="w-4 h-4 text-primary" />
                          Budget Range *
                        </label>
                        <Select
                          value={formData.budget}
                          onValueChange={(value) => setFormData({ ...formData, budget: value })}
                        >
                          <SelectTrigger id="budget" className="bg-background/50 border-border/50 h-12 text-base">
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

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2" htmlFor="timeline">
                          <Clock className="w-4 h-4 text-primary" />
                          Timeline *
                        </label>
                        <Select
                          value={formData.timeline}
                          onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                        >
                          <SelectTrigger id="timeline" className="bg-background/50 border-border/50 h-12 text-base">
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
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2" htmlFor="message">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        Tell us about your project
                        <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                      </label>
                      <Textarea
                        id="message"
                        placeholder="What are you looking to build? Any specific requirements or challenges?"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="min-h-32 bg-background/50 border-border/50 resize-none text-base focus:border-primary/50 transition-all"
                      />
                    </div>

                    <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <p className="text-sm text-muted-foreground flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Share as much detail as you&apos;d like! This helps us prepare a more accurate proposal for you.</span>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Goals */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Select all that apply (helps us tailor our approach)
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        {goalOptions.map((goal) => (
                          <button
                            key={goal}
                            type="button"
                            onClick={() => toggleGoal(goal)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              formData.goals.includes(goal)
                                ? "border-primary bg-primary/10"
                                : "border-border/50 hover:border-primary/50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-1 rounded-md ${
                                formData.goals.includes(goal) ? "bg-primary" : "bg-background"
                              }`}>
                                {formData.goals.includes(goal) && (
                                  <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                                )}
                              </div>
                              <span className="text-sm font-medium">{goal}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        What happens next?
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          We&apos;ll review your project within 24 hours
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          Schedule a free 30-minute consultation call
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          Receive a custom proposal with timeline and pricing
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <footer className="flex justify-between items-center gap-4 mt-8 pt-6 border-t border-border/50">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep(step - 1)}
                      className="text-sm"
                    >
                      Back
                    </Button>
                  )}

                  <div className="flex-1" />

                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="text-sm group"
                      disabled={
                        (step === 1 && (!formData.name || !formData.email)) ||
                        (step === 2 && (!formData.projectType || !formData.budget || !formData.timeline))
                      }
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="text-sm group"
                    >
                      Send Project Details
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </footer>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
