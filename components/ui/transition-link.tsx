'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ComponentProps, MouseEvent, useTransition } from 'react';

interface TransitionLinkProps extends ComponentProps<typeof Link> {
  children: React.ReactNode;
  href: string;
}

export function TransitionLink({ href, children, onClick, ...props }: TransitionLinkProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Call the original onClick if provided
    onClick?.(e);

    // Don't override default behavior for modified clicks
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    e.preventDefault();

    // Check if View Transitions API is supported
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      // @ts-ignore - TypeScript doesn't have types for View Transitions API yet
      document.startViewTransition(() => {
        startTransition(() => {
          router.push(href.toString());
        });
      });
    } else {
      // Fallback for browsers that don't support View Transitions
      startTransition(() => {
        router.push(href.toString());
      });
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}