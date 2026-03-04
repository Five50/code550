import { describe, it, expect } from 'vitest';
import { filterWpStyles } from '@/lib/filter-wp-styles';

describe('filterWpStyles', () => {
  it('should remove the :root :where(a:where(:not(.wp-element-button))) rule', () => {
    const styles = `
      body { margin: 0; }
      :root :where(a:where(:not(.wp-element-button))) { text-decoration: underline; transition: color 0.2s; }
      h1 { font-size: 2rem; }
    `;
    const result = filterWpStyles(styles);
    expect(result).not.toContain(':root :where(a:where(:not(.wp-element-button)))');
    expect(result).toContain('body { margin: 0; }');
    expect(result).toContain('h1 { font-size: 2rem; }');
  });

  it('should handle styles without the problematic rule', () => {
    const styles = 'body { margin: 0; } h1 { color: red; }';
    const result = filterWpStyles(styles);
    expect(result).toBe(styles);
  });

  it('should return empty string for empty input', () => {
    expect(filterWpStyles('')).toBe('');
  });

  it('should return empty string for falsy input', () => {
    expect(filterWpStyles(null as any)).toBe('');
    expect(filterWpStyles(undefined as any)).toBe('');
  });

  it('should handle multiple occurrences of the problematic rule', () => {
    const styles = `
      :root :where(a:where(:not(.wp-element-button))) { text-decoration: underline; }
      p { color: black; }
      :root :where(a:where(:not(.wp-element-button))) { transition: color 0.3s; }
    `;
    const result = filterWpStyles(styles);
    expect(result).not.toContain(':root :where(a:where(:not(.wp-element-button)))');
    expect(result).toContain('p { color: black; }');
  });
});
