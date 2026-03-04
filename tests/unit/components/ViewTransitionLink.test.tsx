import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ViewTransitionLink } from '@/components/view-transition-link';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

describe('ViewTransitionLink', () => {
  it('renders children inside a link', () => {
    render(<ViewTransitionLink href="/about">About</ViewTransitionLink>);
    const link = screen.getByText('About');
    expect(link.closest('a')).toHaveAttribute('href', '/about');
  });

  it('passes className to the link', () => {
    render(
      <ViewTransitionLink href="/test" className="custom-class">
        Link
      </ViewTransitionLink>
    );
    expect(screen.getByText('Link').closest('a')).toHaveClass('custom-class');
  });
});
