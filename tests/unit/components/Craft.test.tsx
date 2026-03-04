import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Section, Article, Prose, Box } from '@/components/craft';

describe('Craft components', () => {
  describe('Section', () => {
    it('renders children in a section element', () => {
      render(<Section>Content</Section>);
      expect(screen.getByText('Content').tagName).toBe('SECTION');
    });

    it('applies custom className', () => {
      render(<Section className="custom">Content</Section>);
      expect(screen.getByText('Content')).toHaveClass('custom');
    });

    it('applies id', () => {
      render(<Section id="test-section">Content</Section>);
      expect(screen.getByText('Content')).toHaveAttribute('id', 'test-section');
    });
  });

  describe('Article', () => {
    it('renders children in an article element', () => {
      render(<Article>Article content</Article>);
      expect(screen.getByText('Article content').tagName).toBe('ARTICLE');
    });

    it('applies custom className', () => {
      render(<Article className="prose">Text</Article>);
      expect(screen.getByText('Text')).toHaveClass('prose');
    });
  });

  describe('Prose', () => {
    it('renders children in a div', () => {
      render(<Prose>Prose text</Prose>);
      expect(screen.getByText('Prose text').tagName).toBe('DIV');
    });
  });

  describe('Box', () => {
    it('renders as flex by default', () => {
      render(<Box>Box content</Box>);
      const el = screen.getByText('Box content');
      expect(el).toHaveClass('flex');
    });

    it('renders as grid when cols is provided', () => {
      render(<Box cols={3}>Grid content</Box>);
      const el = screen.getByText('Grid content');
      expect(el).toHaveClass('grid');
      expect(el).toHaveClass('grid-cols-3');
    });

    it('applies gap classes', () => {
      render(<Box gap={4}>Gap content</Box>);
      expect(screen.getByText('Gap content')).toHaveClass('gap-4');
    });

    it('applies direction classes', () => {
      render(<Box direction="col">Column</Box>);
      expect(screen.getByText('Column')).toHaveClass('flex-col');
    });

    it('applies responsive direction', () => {
      render(<Box direction={{ base: 'col', md: 'row' }}>Responsive</Box>);
      const el = screen.getByText('Responsive');
      expect(el).toHaveClass('flex-col');
      expect(el).toHaveClass('md:flex-row');
    });

    it('applies wrap classes', () => {
      render(<Box wrap="wrap">Wrapped</Box>);
      expect(screen.getByText('Wrapped')).toHaveClass('flex-wrap');
    });
  });
});
