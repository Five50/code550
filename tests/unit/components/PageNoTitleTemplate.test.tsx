import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageNoTitleTemplate } from '@/components/templates/page-no-title';

vi.mock('html-react-parser', () => ({
  default: (html: string) => html,
}));

describe('PageNoTitleTemplate', () => {
  it('renders page content without title', () => {
    const page = { content: { rendered: 'No title page' } };
    render(<PageNoTitleTemplate page={page} />);
    expect(screen.getByText('No title page')).toBeInTheDocument();
  });

  it('renders injected styles', () => {
    const page = { content: { rendered: 'Content' } };
    const { container } = render(<PageNoTitleTemplate page={page} styles="h1 { display: none; }" />);
    expect(container.querySelector('style')).toBeInTheDocument();
  });

  it('returns null when page is missing', () => {
    const { container } = render(<PageNoTitleTemplate page={null as any} />);
    expect(container.innerHTML).toBe('');
  });
});
