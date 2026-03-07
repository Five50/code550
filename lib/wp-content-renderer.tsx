"use client";

import React from "react";
import parse, {
  domToReact,
  type HTMLReactParserOptions,
  Element,
  type DOMNode,
} from "html-react-parser";
import { cn } from "@/lib/utils";
import { StatCounter } from "@/components/stat-counter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Calendar,
  Users,
  TrendingUp,
  Star,
  Target,
  Zap,
  Award,
  Code2,
  Palette,
  BarChart3,
  Layers,
  Globe,
  Rocket,
  Shield,
  Search,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ---------------------------------------------------------------------------
// WordPress class -> Tailwind class mapping
// ---------------------------------------------------------------------------

const CLASS_MAP: Record<string, string> = {
  // Colors – text
  "has-primary-color": "text-primary",
  "has-primary-foreground-color": "text-primary-foreground",
  "has-secondary-color": "text-secondary-foreground",
  "has-secondary-foreground-color": "text-secondary-foreground",
  "has-accent-color": "text-accent",
  "has-accent-foreground-color": "text-accent-foreground",
  "has-accent-soft-color": "text-accent-soft",
  "has-muted-color": "text-muted",
  "has-muted-foreground-color": "text-muted-foreground",
  "has-destructive-color": "text-destructive",
  "has-background-color": "text-background",
  "has-foreground-color": "text-foreground",
  "has-card-color": "text-card",
  "has-card-foreground-color": "text-card-foreground",
  "has-border-color": "text-border",

  // Colors – background
  "has-primary-background-color": "bg-primary",
  "has-primary-foreground-background-color": "bg-primary-foreground",
  "has-secondary-background-color": "bg-secondary",
  "has-accent-background-color": "bg-accent",
  "has-accent-soft-background-color": "bg-accent-soft",
  "has-muted-background-color": "bg-muted",
  "has-destructive-background-color": "bg-destructive",
  "has-background-background-color": "bg-background",
  "has-foreground-background-color": "bg-foreground",
  "has-card-background-color": "bg-card",
  "has-border-background-color": "bg-border",

  // Gradients
  "has-primary-gradient-background":
    "bg-gradient-to-br from-primary to-primary/80",
  "has-primary-to-accent-gradient-background":
    "bg-gradient-to-br from-primary to-accent-soft",

  // Typography – font family
  "has-display-font-family": "font-display",
  "has-sans-font-family": "font-sans",
  "has-mono-font-family": "font-mono",

  // Typography – font size
  "has-xs-font-size": "text-xs",
  "has-sm-font-size": "text-sm",
  "has-base-font-size": "text-base",
  "has-lg-font-size": "text-lg",
  "has-xl-font-size": "text-xl",
  "has-2-xl-font-size": "text-2xl",
  "has-3-xl-font-size": "text-3xl",
  "has-4-xl-font-size": "text-4xl",
  "has-5-xl-font-size": "text-5xl",
  "has-6-xl-font-size": "text-6xl",
  "has-7-xl-font-size": "text-7xl",

  // Text alignment
  "has-text-align-center": "text-center",
  "has-text-align-right": "text-right",
  "has-text-align-left": "text-left",

  // Layout alignment
  alignwide: "max-w-6xl mx-auto",
  alignfull: "w-full",
  aligncenter: "mx-auto",

  // WP block columns
  "wp-block-columns": "grid md:grid-cols-2 gap-6",
  "wp-block-column": "",

  // WP block group
  "wp-block-group": "",

  // WP block separator
  "wp-block-separator": "border-border my-8",

  // WP block image
  "wp-block-image": "my-6",

  // WP block quote
  "wp-block-quote":
    "border-l-4 border-primary/30 pl-6 my-6 italic text-muted-foreground",

  // WP block list
  "wp-block-list": "",

  // WP block code
  "wp-block-code": "font-mono bg-card rounded-xl p-4 my-6 overflow-x-auto",

  // WP buttons
  "wp-block-buttons": "flex flex-wrap gap-4",
  "wp-block-button": "",
  "wp-block-button__link":
    "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all",
  "is-style-outline":
    "border border-input bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground !bg-transparent",
};

// ---------------------------------------------------------------------------
// Lucide icon resolver
// ---------------------------------------------------------------------------

const ICON_MAP: Record<string, LucideIcon> = {
  "code-2": Code2,
  code2: Code2,
  palette: Palette,
  "bar-chart-3": BarChart3,
  barchart3: BarChart3,
  layers: Layers,
  target: Target,
  zap: Zap,
  award: Award,
  users: Users,
  globe: Globe,
  rocket: Rocket,
  shield: Shield,
  search: Search,
  calendar: Calendar,
  star: Star,
  "trending-up": TrendingUp,
  trendingup: TrendingUp,
};

function resolveIcon(name: string): LucideIcon | null {
  const normalized = name.toLowerCase().trim();
  return ICON_MAP[normalized] ?? null;
}

// ---------------------------------------------------------------------------
// Transform WordPress classes to Tailwind
// ---------------------------------------------------------------------------

function transformClasses(className: string): string {
  const classes = className.split(/\s+/);
  const result: string[] = [];

  for (const cls of classes) {
    if (CLASS_MAP[cls] !== undefined) {
      if (CLASS_MAP[cls]) result.push(CLASS_MAP[cls]);
    } else {
      result.push(cls);
    }
  }

  return result.join(" ");
}

// ---------------------------------------------------------------------------
// Custom block renderers
// ---------------------------------------------------------------------------

function isElement(node: DOMNode): node is Element {
  return node.type === "tag";
}

function getChildren(node: Element): DOMNode[] {
  return (node.children ?? []) as DOMNode[];
}

function getTextContent(node: DOMNode): string {
  if (node.type === "text") return (node as unknown as { data: string }).data;
  if (isElement(node))
    return getChildren(node).map(getTextContent).join("");
  return "";
}

function renderStatsGrid(node: Element): React.ReactNode {
  const stats: { value: string; label: string }[] = [];

  for (const child of getChildren(node)) {
    if (!isElement(child)) continue;
    const hasStatClass =
      child.attribs?.class?.includes("code550-stat") ?? false;
    if (!hasStatClass) continue;

    let value = "";
    let label = "";
    for (const sub of getChildren(child)) {
      if (!isElement(sub)) continue;
      const cls = sub.attribs?.class ?? "";
      if (cls.includes("code550-stat__value")) value = getTextContent(sub);
      if (cls.includes("code550-stat__label")) label = getTextContent(sub);
    }
    if (value || label) stats.push({ value, label });
  }

  // Parse the value to extract number, prefix, suffix for StatCounter
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 py-12 border-y border-border/50 bg-card/30">
      {stats.map((stat, i) => {
        const match = stat.value.match(/^([^0-9]*)([0-9.]+)(.*)$/);
        if (match) {
          const prefix = match[1];
          const num = parseFloat(match[2]);
          const suffix = match[3];
          return (
            <StatCounter
              key={i}
              prefix={prefix}
              end={num}
              suffix={suffix}
              label={stat.label}
            />
          );
        }
        // Fallback for non-numeric values
        return (
          <div key={i} className="text-center">
            <div className="font-display text-3xl sm:text-4xl md:text-5xl mb-2 bg-gradient-to-br from-primary via-primary to-accent-soft bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground font-mono uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function renderChecklist(node: Element): React.ReactNode {
  const items: string[] = [];

  for (const child of getChildren(node)) {
    if (!isElement(child)) continue;
    items.push(getTextContent(child));
  }

  return (
    <div className="space-y-4 my-6">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <span className="text-foreground">{item}</span>
        </div>
      ))}
    </div>
  );
}

function renderProcessSteps(node: Element): React.ReactNode {
  const steps: { number: string; title: string; description: string }[] = [];

  for (const child of getChildren(node)) {
    if (!isElement(child)) continue;
    const cls = child.attribs?.class ?? "";
    if (!cls.includes("code550-step")) continue;

    let number = child.attribs?.["data-step"] ?? "";
    let title = "";
    let description = "";

    for (const sub of getChildren(child)) {
      if (!isElement(sub)) continue;
      const subCls = sub.attribs?.class ?? "";
      if (subCls.includes("code550-step__number")) number = getTextContent(sub);
      if (subCls.includes("code550-step__title")) title = getTextContent(sub);
      if (subCls.includes("code550-step__description"))
        description = getTextContent(sub);
    }
    steps.push({ number: number ? `Step ${number}` : "", title, description });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
      {steps.map((step, i) => (
        <div
          key={i}
          className="p-6 rounded-xl border border-border/50 bg-card/30 hover:border-primary/50 transition-colors"
        >
          {step.number && (
            <div className="text-sm font-mono text-primary mb-2">
              {step.number}
            </div>
          )}
          <h3 className="font-display text-xl mb-2">{step.title}</h3>
          <p className="text-sm text-muted-foreground">{step.description}</p>
        </div>
      ))}
    </div>
  );
}

function renderResultsGrid(node: Element): React.ReactNode {
  const results: {
    metric: string;
    change: string;
    detail: string;
  }[] = [];

  for (const child of getChildren(node)) {
    if (!isElement(child)) continue;
    const cls = child.attribs?.class ?? "";
    if (!cls.includes("code550-result")) continue;

    let metric = "";
    let change = "";
    let detail = "";

    for (const sub of getChildren(child)) {
      if (!isElement(sub)) continue;
      const subCls = sub.attribs?.class ?? "";
      if (subCls.includes("code550-result__metric"))
        metric = getTextContent(sub);
      if (subCls.includes("code550-result__change"))
        change = getTextContent(sub);
      if (subCls.includes("code550-result__detail"))
        detail = getTextContent(sub);
    }
    results.push({ metric, change, detail });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
      {results.map((result, i) => (
        <div
          key={i}
          className="p-6 rounded-2xl border border-border/50 bg-background/50"
        >
          <div className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">
            {result.metric}
          </div>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-display text-3xl bg-gradient-to-br from-primary to-accent-soft bg-clip-text text-transparent">
              {result.change}
            </span>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="text-sm text-muted-foreground">{result.detail}</div>
        </div>
      ))}
    </div>
  );
}

function renderProjectMeta(node: Element): React.ReactNode {
  const items: { icon: string; text: string }[] = [];

  for (const child of getChildren(node)) {
    if (!isElement(child)) continue;
    const cls = child.attribs?.class ?? "";
    if (!cls.includes("code550-meta-item")) continue;
    const iconName = child.attribs?.["data-icon"] ?? "";
    const text = getTextContent(child);
    items.push({ icon: iconName, text });
  }

  const iconLookup: Record<string, LucideIcon> = {
    calendar: Calendar,
    users: Users,
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground my-8">
      {items.map((item, i) => {
        const Icon = iconLookup[item.icon];
        return (
          <div key={i} className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4" />}
            <span className={item.icon === "industry" ? "font-mono" : ""}>
              {item.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function renderTechStack(node: Element): React.ReactNode {
  const techs: string[] = [];

  for (const child of getChildren(node)) {
    if (!isElement(child)) continue;
    techs.push(getTextContent(child));
  }

  return (
    <div className="flex flex-wrap gap-2 my-6">
      {techs.map((tech, i) => (
        <Badge key={i} variant="outline">
          {tech}
        </Badge>
      ))}
    </div>
  );
}

function renderTestimonialCard(
  node: Element,
  options: HTMLReactParserOptions
): React.ReactNode {
  let quote = "";
  let author = "";
  let role = "";
  let imageSrc = "";
  let imageAlt = "";

  for (const child of getChildren(node)) {
    if (!isElement(child)) continue;
    const cls = child.attribs?.class ?? "";
    if (cls.includes("code550-testimonial__quote"))
      quote = getTextContent(child);
    if (cls.includes("code550-testimonial__footer")) {
      for (const sub of getChildren(child)) {
        if (!isElement(sub)) continue;
        const subCls = sub.attribs?.class ?? "";
        if (sub.name === "img" && subCls.includes("code550-testimonial__image")) {
          imageSrc = sub.attribs?.src ?? "";
          imageAlt = sub.attribs?.alt ?? "";
        }
        if (subCls.includes("code550-testimonial__author"))
          author = getTextContent(sub);
        if (subCls.includes("code550-testimonial__role"))
          role = getTextContent(sub);
      }
    }
  }

  return (
    <div className="relative p-8 md:p-12 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-transparent my-12">
      <div className="absolute inset-0 glow-primary opacity-20 blur-3xl" />
      <div className="relative z-10">
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
          ))}
        </div>
        <p className="text-xl md:text-2xl mb-8 leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>
        <footer className="flex items-center gap-4">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={imageAlt || author}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <cite className="font-medium not-italic block">{author}</cite>
            <div className="text-sm text-muted-foreground font-mono">
              {role}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function renderCtaBlock(node: Element): React.ReactNode {
  let heading = "";
  let description = "";
  let primaryText = "";
  let primaryHref = "";
  let secondaryText = "";
  let secondaryHref = "";

  for (const child of getChildren(node)) {
    if (!isElement(child)) continue;
    const cls = child.attribs?.class ?? "";
    if (cls.includes("code550-cta__heading")) heading = getTextContent(child);
    if (cls.includes("code550-cta__description"))
      description = getTextContent(child);
    if (cls.includes("code550-cta__buttons")) {
      for (const btn of getChildren(child)) {
        if (!isElement(btn)) continue;
        const btnCls = btn.attribs?.class ?? "";
        if (btnCls.includes("code550-cta__button-primary")) {
          primaryText = getTextContent(btn);
          primaryHref = btn.attribs?.href ?? "/contact";
        }
        if (btnCls.includes("code550-cta__button-secondary")) {
          secondaryText = getTextContent(btn);
          secondaryHref = btn.attribs?.href ?? "/work";
        }
      }
    }
  }

  return (
    <div className="relative max-w-4xl mx-auto text-center p-12 md:p-16 rounded-3xl border border-primary/20 bg-card/30 overflow-hidden my-20">
      <div className="absolute inset-0 glow-primary opacity-20 blur-3xl" />
      <div className="relative z-10">
        <h2 className="font-display text-4xl md:text-5xl mb-4">{heading}</h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryText && (
            <Button size="lg" asChild className="text-sm">
              <Link href={primaryHref}>{primaryText}</Link>
            </Button>
          )}
          {secondaryText && (
            <Button size="lg" variant="outline" asChild className="text-sm">
              <Link href={secondaryHref}>{secondaryText}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function renderIconCard(node: Element): React.ReactNode {
  const iconName = node.attribs?.["data-icon"] ?? "";
  let title = "";
  let description = "";

  for (const child of getChildren(node)) {
    if (!isElement(child)) continue;
    const cls = child.attribs?.class ?? "";
    if (cls.includes("code550-icon-card__title")) title = getTextContent(child);
    if (cls.includes("code550-icon-card__description"))
      description = getTextContent(child);
  }

  const Icon = resolveIcon(iconName);

  return (
    <div className="p-6 rounded-2xl border border-border/50 bg-background/50 hover:border-primary/50 transition-all">
      {Icon && (
        <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      )}
      <h3 className="font-display text-xl mb-3">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function renderBadge(node: Element): React.ReactNode {
  const text = getTextContent(node);
  return (
    <Badge className="mb-4 text-xs font-mono">{text}</Badge>
  );
}

// ---------------------------------------------------------------------------
// Custom block router
// ---------------------------------------------------------------------------

const BLOCK_RENDERERS: Record<
  string,
  (node: Element, options: HTMLReactParserOptions) => React.ReactNode
> = {
  "wp-block-code550-stats-grid": (node) => renderStatsGrid(node),
  "wp-block-code550-checklist": (node) => renderChecklist(node),
  "wp-block-code550-process-steps": (node) => renderProcessSteps(node),
  "wp-block-code550-results-grid": (node) => renderResultsGrid(node),
  "wp-block-code550-project-meta": (node) => renderProjectMeta(node),
  "wp-block-code550-tech-stack": (node) => renderTechStack(node),
  "wp-block-code550-testimonial-card": (node, opts) =>
    renderTestimonialCard(node, opts),
  "wp-block-code550-cta-block": (node) => renderCtaBlock(node),
  "wp-block-code550-icon-card": (node) => renderIconCard(node),
  "wp-block-code550-badge": (node) => renderBadge(node),
};

// ---------------------------------------------------------------------------
// Main parser options
// ---------------------------------------------------------------------------

function createParserOptions(): HTMLReactParserOptions {
  const options: HTMLReactParserOptions = {
    replace(domNode) {
      if (!isElement(domNode)) return;

      const className = domNode.attribs?.class ?? "";

      // Check for custom block matches
      for (const [blockClass, renderer] of Object.entries(BLOCK_RENDERERS)) {
        if (className.includes(blockClass)) {
          return <>{renderer(domNode, options)}</>;
        }
      }

      // Transform WordPress classes to Tailwind on all elements
      if (className) {
        const transformed = transformClasses(className);
        if (transformed !== className) {
          const attribs = domNode.attribs;

          // Convert <a> tags to Next.js Link for internal URLs
          if (domNode.name === "a" && attribs.href?.startsWith("/")) {
            return (
              <Link href={attribs.href} className={transformed}>
                {domToReact(getChildren(domNode), options)}
              </Link>
            );
          }

          // Convert <img> to Next.js Image when dimensions are available
          if (domNode.name === "img" && attribs.width && attribs.height) {
            return (
              <Image
                src={attribs.src}
                alt={attribs.alt ?? ""}
                width={parseInt(attribs.width)}
                height={parseInt(attribs.height)}
                className={transformed}
              />
            );
          }

          const props = { ...attribs } as Record<string, unknown>;
          delete props["class"];
          props["className"] = transformed;

          return React.createElement(
            domNode.name,
            props,
            domToReact(getChildren(domNode), options)
          );
        }
      }

      // Convert internal <a> to Link even without class transforms
      if (domNode.name === "a") {
        const href = domNode.attribs?.href ?? "";
        if (href.startsWith("/")) {
          return (
            <Link href={href} className={className || undefined}>
              {domToReact(getChildren(domNode), options)}
            </Link>
          );
        }
      }
    },
  };

  return options;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

interface WPContentProps {
  html: string;
  className?: string;
}

export function WPContent({ html, className }: WPContentProps) {
  if (!html) return null;

  const options = createParserOptions();

  return (
    <div className={cn("wp-content", className)}>
      {parse(html, options)}
    </div>
  );
}

/**
 * Transform a raw HTML string from WordPress, replacing WP classes with
 * Tailwind equivalents. Returns a new HTML string.
 * Use this when you need the transformed string rather than a React tree.
 */
export function transformWPHtml(html: string): string {
  return html.replace(
    /class="([^"]*)"/g,
    (_match, classes: string) => `class="${transformClasses(classes)}"`
  );
}
