import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { TemplateUpdater } from '@/components/template-updater';

vi.mock('next/navigation', () => ({
  usePathname: () => '/about',
}));

describe('TemplateUpdater', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ template: 'page' }),
    });
  });

  it('renders nothing (returns null)', () => {
    const { container } = render(<TemplateUpdater initialTemplate="default" />);
    expect(container.innerHTML).toBe('');
  });

  it('fetches template for current pathname on mount', async () => {
    render(<TemplateUpdater initialTemplate="default" />);
    // Wait for the useEffect to fire
    await vi.waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/template?path=%2Fabout'
      );
    });
  });

  it('sets data-template attribute on body', async () => {
    render(<TemplateUpdater initialTemplate="default" />);
    await vi.waitFor(() => {
      expect(document.body.getAttribute('data-template')).toBe('page');
    });
  });
});
