import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageTemplate } from '@/components/templates/page';

vi.mock('html-react-parser', () => ({
  default: (html: string) => html,
}));

describe('PageTemplate', () => {
  it('renders page content', () => {
    const page = { content: { rendered: 'Page content here' } };
    render(<PageTemplate page={page} />);
    expect(screen.getByText('Page content here')).toBeInTheDocument();
  });

  it('renders injected styles when provided', () => {
    const page = { content: { rendered: 'Content' } };
    const { container } = render(<PageTemplate page={page} styles=".custom { color: blue; }" />);
    const style = container.querySelector('style');
    expect(style).toBeInTheDocument();
  });

  it('returns null when page is missing', () => {
    const { container } = render(<PageTemplate page={null as any} />);
    expect(container.innerHTML).toBe('');
  });

  it('returns null when page content is missing', () => {
    const { container } = render(<PageTemplate page={{ content: null }} />);
    expect(container.innerHTML).toBe('');
  });
});
