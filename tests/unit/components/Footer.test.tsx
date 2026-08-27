import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/footer';
import { siteConfig } from '@/site.config';

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

// Mock motion/react
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, whileInView, viewport, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
}));

// Mock Select component
vi.mock('@/components/ui/select', () => ({
  Select: ({ children }: any) => <div>{children}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <div>{children}</div>,
  SelectTrigger: ({ children }: any) => <button>{children}</button>,
  SelectValue: () => <span>English</span>,
}));

describe('Footer Component', () => {
  it('renders without crashing', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('displays the copyright text', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer.textContent).toContain('Code550');
    expect(footer.textContent).toContain(new Date().getFullYear().toString());
  });

  it('renders service navigation links', () => {
    render(<Footer />);
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('WordPress Development')).toBeInTheDocument();
  });

  it('renders company navigation links', () => {
    render(<Footer />);
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getAllByText('Contact').length).toBeGreaterThanOrEqual(1);
  });

  it('renders legal links', () => {
    render(<Footer />);
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
  });

  it('renders only the social links configured in site.config', () => {
    render(<Footer />);

    // Email is always present; the rest render only when given a URL.
    expect(screen.getByLabelText('Email')).toBeInTheDocument();

    for (const [label, href] of [
      ['Twitter', siteConfig.social.twitter],
      ['GitHub', siteConfig.social.github],
      ['LinkedIn', siteConfig.social.linkedin],
    ] as const) {
      if (href) {
        expect(screen.getByLabelText(label)).toBeInTheDocument();
      } else {
        expect(screen.queryByLabelText(label)).not.toBeInTheDocument();
      }
    }
  });

  it('renders the newsletter section', () => {
    render(<Footer />);
    expect(screen.getByText('Stay in the Loop')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByText('Subscribe')).toBeInTheDocument();
  });
});
