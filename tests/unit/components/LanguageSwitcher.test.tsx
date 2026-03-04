import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSwitcher } from '@/components/language-switcher';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => '/about',
  useRouter: () => ({ push: mockPush }),
}));

describe('LanguageSwitcher', () => {
  it('renders current language button', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('toggles dropdown on click', () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole('button', { expanded: false });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('applies custom className', () => {
    const { container } = render(<LanguageSwitcher className="custom" />);
    expect(container.firstChild).toHaveClass('custom');
  });
});
