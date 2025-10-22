import { Link } from 'next-view-transitions';
import { ComponentProps } from 'react';

interface TransitionLinkProps extends ComponentProps<typeof Link> {
  children: React.ReactNode;
  href: string;
}

export function TransitionLink({ href, children, ...props }: TransitionLinkProps) {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}