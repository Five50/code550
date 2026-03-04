import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FrontPageTemplate } from '@/components/templates/front-page';

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

vi.mock('html-react-parser', () => ({
  default: (html: string) => html,
}));

// Mock PostCard as async server component
vi.mock('@/components/posts/post-card', () => ({
  PostCard: ({ post }: any) => <div data-testid="post-card">{post.title.rendered}</div>,
}));

describe('FrontPageTemplate', () => {
  it('renders static page content when page is provided', () => {
    const page = { content: { rendered: '<h1>Welcome</h1>' } };
    render(<FrontPageTemplate page={page} />);
    // html-react-parser mock returns raw string
    expect(screen.getByText('<h1>Welcome</h1>')).toBeInTheDocument();
  });

  it('renders injected styles when provided with page', () => {
    const page = { content: { rendered: '<p>Hello</p>' } };
    const { container } = render(<FrontPageTemplate page={page} styles="body { color: red; }" />);
    const style = container.querySelector('style');
    expect(style).toBeInTheDocument();
  });

  it('renders blog posts when no page is set', () => {
    const posts = [
      { id: 1, title: { rendered: 'Post One' }, slug: 'post-one' },
      { id: 2, title: { rendered: 'Post Two' }, slug: 'post-two' },
    ];
    render(<FrontPageTemplate posts={posts} />);
    expect(screen.getByText('Post One')).toBeInTheDocument();
    expect(screen.getByText('Post Two')).toBeInTheDocument();
  });

  it('shows "View All Posts" link in posts mode', () => {
    const posts = [{ id: 1, title: { rendered: 'Post' }, slug: 'post' }];
    render(<FrontPageTemplate posts={posts} />);
    expect(screen.getByText('View All Posts')).toBeInTheDocument();
  });

  it('shows empty state when no posts are available', () => {
    render(<FrontPageTemplate posts={[]} />);
    expect(screen.getByText('No posts available.')).toBeInTheDocument();
  });

  it('shows empty state when posts is undefined', () => {
    render(<FrontPageTemplate />);
    expect(screen.getByText('No posts available.')).toBeInTheDocument();
  });
});
