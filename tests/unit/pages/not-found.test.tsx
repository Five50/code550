import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

describe('NotFound page', () => {
  it('renders 404 heading', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders descriptive message', () => {
    render(<NotFound />);
    expect(screen.getByText(/The page you are looking for/)).toBeInTheDocument();
  });

  it('renders "Go Home" link', () => {
    render(<NotFound />);
    const link = screen.getByText('Go Home');
    expect(link.closest('a')).toHaveAttribute('href', '/');
  });
});
