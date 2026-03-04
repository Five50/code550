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

// Mock LanguageSwitcher
vi.mock('@/components/language-switcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">Language Switcher</div>,
}));

describe('Footer Component', () => {
  it('renders without crashing', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('displays the copyright holder from siteConfig', () => {
    render(<Footer />);
    expect(screen.getByText(siteConfig.copyrightHolder)).toBeInTheDocument();
  });

  it('displays the current year in copyright', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    const footer = screen.getByRole('contentinfo');
    expect(footer.textContent).toContain(currentYear);
  });

  it('displays the footer description from siteConfig', () => {
    render(<Footer />);
    expect(screen.getByText(siteConfig.footerDescription)).toBeInTheDocument();
  });

  it('renders logo images with site_name as alt text', () => {
    render(<Footer />);
    const logos = screen.getAllByAltText(siteConfig.site_name);
    expect(logos.length).toBeGreaterThanOrEqual(1);
  });

  it('renders footer navigation sections', () => {
    render(<Footer />);
    // Check for the navigation section titles
    expect(screen.getByText('Pages')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Footer />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('does not render LanguageSwitcher when only one language is supported', () => {
    render(<Footer />);
    if (siteConfig.supportedLanguages.length <= 1) {
      expect(screen.queryByTestId('language-switcher')).not.toBeInTheDocument();
    }
  });

  it('applies custom className', () => {
    render(<Footer className="custom-footer" />);
    expect(screen.getByRole('contentinfo')).toHaveClass('custom-footer');
  });
});
