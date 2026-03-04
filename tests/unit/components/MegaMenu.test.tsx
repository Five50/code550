import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MegaMenu } from '@/components/nav/mega-menu';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

const defaultProps = {
  title: 'Products',
  sections: {
    analytics: {
      title: 'Analytics',
      description: 'Track your data',
      items: {
        Dashboard: { href: '/dashboard', description: 'Overview' },
        Reports: { href: '/reports' },
      },
    },
  },
  isDarkBackground: false,
  isActive: false,
  onActivate: vi.fn(),
  onDeactivate: vi.fn(),
};

describe('MegaMenu', () => {
  it('renders the trigger button with title', () => {
    render(<MegaMenu {...defaultProps} />);
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('does not show content when inactive', () => {
    render(<MegaMenu {...defaultProps} />);
    expect(screen.queryByText('Analytics')).not.toBeInTheDocument();
  });

  it('shows content when active', () => {
    render(<MegaMenu {...defaultProps} isActive={true} />);
    expect(screen.getAllByText('Analytics').length).toBeGreaterThanOrEqual(1);
  });

  it('renders section items as links', () => {
    render(<MegaMenu {...defaultProps} isActive={true} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  it('renders item descriptions when provided', () => {
    render(<MegaMenu {...defaultProps} isActive={true} />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  it('renders featured content when provided', () => {
    render(
      <MegaMenu
        {...defaultProps}
        isActive={true}
        featuredContent={{
          title: 'Featured Item',
          description: 'Check it out',
          href: '/featured',
        }}
      />
    );
    expect(screen.getByText('Featured Item')).toBeInTheDocument();
    expect(screen.getByText('Check it out')).toBeInTheDocument();
  });

  it('calls onActivate on mouseEnter', () => {
    const onActivate = vi.fn();
    const { container } = render(<MegaMenu {...defaultProps} onActivate={onActivate} />);
    fireEvent.mouseEnter(container.firstChild!);
    expect(onActivate).toHaveBeenCalled();
  });

  it('calls onDeactivate on mouseLeave', () => {
    const onDeactivate = vi.fn();
    const { container } = render(<MegaMenu {...defaultProps} onDeactivate={onDeactivate} />);
    fireEvent.mouseLeave(container.firstChild!);
    expect(onDeactivate).toHaveBeenCalled();
  });
});
