'use client';

import Link from 'next/link';
import { ComponentProps } from 'react';

interface TransitionLinkProps extends ComponentProps<typeof Link> {
  children: React.ReactNode;
  href: string;
}

export function TransitionLink({ href, children, ...props }: TransitionLinkProps) {
  // For now, just use the regular Link component
  // View transitions are enabled via CSS and will work automatically
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}