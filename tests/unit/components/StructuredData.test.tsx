import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StructuredData } from '@/components/seo/structured-data';

describe('StructuredData', () => {
  it('renders a script tag with JSON-LD type', () => {
    const schema = '{"@context":"https://schema.org","@type":"Article"}';
    const { container } = render(<StructuredData schema={schema} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    expect(script!.innerHTML).toBe(schema);
  });

  it('returns null when schema is empty', () => {
    const { container } = render(<StructuredData schema="" />);
    expect(container.innerHTML).toBe('');
  });
});
