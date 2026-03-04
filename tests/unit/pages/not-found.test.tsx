import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

describe('NotFound page', () => {
  it('renders 404 heading', () => {
    render(<NotFound />);
    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
  });

  it('renders descriptive message', () => {
    render(<NotFound />);
    expect(screen.getByText(/Sorry, the page you are looking for does not exist/)).toBeInTheDocument();
  });

  it('renders "Return Home" link', () => {
    render(<NotFound />);
    const link = screen.getByText('Return Home');
    expect(link.closest('a')).toHaveAttribute('href', '/');
  });
});
