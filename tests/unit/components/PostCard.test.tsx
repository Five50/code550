import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostCard } from '@/components/posts/post-card';
import type { Post } from '@/lib/wordpress.d';

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

vi.mock('@/lib/wordpress', () => ({
  getFeaturedMediaById: vi.fn().mockResolvedValue({
    source_url: 'https://example.com/image.jpg',
    alt_text: 'Test image',
  }),
  getAuthorById: vi.fn().mockResolvedValue({ name: 'Author Name' }),
  getCategoryById: vi.fn().mockResolvedValue({ name: 'Tech' }),
}));

const mockPost: Post = {
  id: 1,
  date: '2025-06-15T10:00:00',
  date_gmt: '2025-06-15T10:00:00',
  modified: '2025-06-15T10:00:00',
  modified_gmt: '2025-06-15T10:00:00',
  slug: 'test-post',
  status: 'publish',
  link: 'https://example.com/test-post',
  guid: { rendered: 'https://example.com/?p=1' },
  title: { rendered: 'Test Post Title' },
  content: { rendered: '<p>Content</p>', protected: false },
  excerpt: { rendered: '<p>This is a test excerpt with enough words to be truncated at twelve words boundary here.</p>', protected: false },
  author: 1,
  featured_media: 1,
  comment_status: 'open',
  ping_status: 'open',
  sticky: false,
  template: '',
  format: 'standard',
  meta: {},
  categories: [1],
  tags: [1],
};

describe('PostCard', () => {
  it('renders post title', async () => {
    render(await PostCard({ post: mockPost }));
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  it('renders formatted date', async () => {
    render(await PostCard({ post: mockPost }));
    expect(screen.getByText('June 15, 2025')).toBeInTheDocument();
  });

  it('renders category name', async () => {
    render(await PostCard({ post: mockPost }));
    expect(screen.getByText('Tech')).toBeInTheDocument();
  });

  it('renders featured image', async () => {
    render(await PostCard({ post: mockPost }));
    const img = screen.getByAltText('Test Post Title');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('renders truncated excerpt', async () => {
    render(await PostCard({ post: mockPost }));
    // Excerpt should be truncated to first 12 words + "..."
    const card = screen.getByText(/This is a test excerpt/);
    expect(card.textContent).toContain('...');
  });

  it('links to post slug', async () => {
    render(await PostCard({ post: mockPost }));
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test-post');
  });

  it('shows "No image available" when no featured media', async () => {
    const postNoMedia = { ...mockPost, featured_media: 0 };
    const { getFeaturedMediaById } = await import('@/lib/wordpress');
    vi.mocked(getFeaturedMediaById).mockResolvedValueOnce(null as any);

    render(await PostCard({ post: postNoMedia }));
    expect(screen.getByText('No image available')).toBeInTheDocument();
  });
});
