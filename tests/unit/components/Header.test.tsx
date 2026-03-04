import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/layout/header';
import { siteConfig } from '@/site.config';

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

// Mock header context
vi.mock('@/lib/header-context', () => ({
  useHeader: () => ({ isFixedPosition: false }),
}));

// Mock radix UI components
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: any) => <div>{children}</div>,
  SheetContent: ({ children }: any) => <div>{children}</div>,
  SheetHeader: ({ children }: any) => <div>{children}</div>,
  SheetTitle: ({ children }: any) => <div>{children}</div>,
  SheetTrigger: ({ children }: any) => <div>{children}</div>,
}));

describe('Header Component', () => {
  it('renders without crashing', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders logo images with site_name as alt text', () => {
    render(<Header />);
    const logos = screen.getAllByAltText(siteConfig.site_name);
    expect(logos.length).toBe(2); // light + dark logos
  });

  it('renders logo images pointing to generic filenames', () => {
    render(<Header />);
    const logos = screen.getAllByAltText(siteConfig.site_name);
    const srcs = logos.map((img) => img.getAttribute('src'));
    expect(srcs).toContain('/logo-light.svg');
    expect(srcs).toContain('/logo-dark.svg');
  });

  it('renders homepage link with correct aria-label', () => {
    render(<Header />);
    const homeLink = screen.getByLabelText(`${siteConfig.site_name} homepage`);
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders static navigation when no WordPress items are provided', () => {
    render(<Header />);
    // Should render the static menu items from menu.config.ts
    expect(screen.getAllByText('Blog').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('About').length).toBeGreaterThanOrEqual(1);
  });

  it('renders WordPress navigation when items are provided', () => {
    const wpNavItems = [
      { id: 1, title: 'WP Home', url: '/', target: '', children: [] },
      { id: 2, title: 'WP About', url: '/about', target: '', children: [] },
    ];
    render(<Header navigationItems={wpNavItems as any} />);
    expect(screen.getAllByText('WP Home').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('WP About').length).toBeGreaterThanOrEqual(1);
  });

  it('applies custom className', () => {
    render(<Header className="custom-header" />);
    expect(screen.getByRole('banner')).toHaveClass('custom-header');
  });
});
