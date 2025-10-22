import Link from 'next/link';
import { ReactNode } from 'react';

interface ViewTransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function ViewTransitionLink({ href, children, className }: ViewTransitionLinkProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
