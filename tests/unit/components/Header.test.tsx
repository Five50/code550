import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/layout/header';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

// Mock theme provider
vi.mock('@/components/theme-provider', () => ({
  useTheme: () => ({ theme: 'dark', setTheme: vi.fn() }),
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('@/components/ui/switch', () => ({
  Switch: (props: any) => <input type="checkbox" role="switch" {...props} />,
}));

describe('Header Component', () => {
  it('renders without crashing', () => {
    render(<Header />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders logo image', () => {
    render(<Header />);
    const logo = screen.getByAltText('Code550');
    expect(logo).toBeInTheDocument();
  });

  it('renders homepage link', () => {
    render(<Header />);
    const links = screen.getAllByRole('link');
    const homeLink = links.find(link => link.getAttribute('href') === '/');
    expect(homeLink).toBeDefined();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getAllByText('Work').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('About').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Blog').length).toBeGreaterThanOrEqual(1);
  });

  it('renders theme toggle button', () => {
    render(<Header />);
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });

  it('renders mobile menu toggle', () => {
    render(<Header />);
    expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
  });

  it('renders contact button', () => {
    render(<Header />);
    expect(screen.getByText("Let's Talk")).toBeInTheDocument();
  });
});
