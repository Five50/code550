import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-8"
    >
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className="flex items-center gap-2 text-sm"
      >
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <Link
            href="/"
            itemProp="item"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group"
          >
            <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span itemProp="name" className="font-mono text-xs">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {items.map((item, index) => (
          <li
            key={index}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="flex items-center gap-2"
          >
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
            {item.href ? (
              <Link
                href={item.href}
                itemProp="item"
                className="text-muted-foreground hover:text-primary transition-colors font-mono text-xs"
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span
                itemProp="name"
                className="text-foreground font-medium font-mono text-xs"
              >
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={String(index + 2)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
