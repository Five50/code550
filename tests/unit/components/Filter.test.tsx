import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FilterPosts } from '@/components/posts/filter';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, ...props }: any) => <div data-testid="select">{children}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children, disabled }: any) => (
    <button disabled={disabled} data-testid="select-trigger">{children}</button>
  ),
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

const defaultProps = {
  authors: [{ id: 1, name: 'Author One' }],
  tags: [{ id: 1, name: 'Tag One' }],
  categories: [{ id: 1, name: 'Category One' }],
};

describe('FilterPosts', () => {
  it('renders without crashing', () => {
    render(<FilterPosts {...defaultProps} />);
    expect(screen.getByText('Reset Filters')).toBeInTheDocument();
  });

  it('renders tag options', () => {
    render(<FilterPosts {...defaultProps} />);
    expect(screen.getByText('Tag One')).toBeInTheDocument();
  });

  it('renders category options', () => {
    render(<FilterPosts {...defaultProps} />);
    expect(screen.getByText('Category One')).toBeInTheDocument();
  });

  it('renders author options', () => {
    render(<FilterPosts {...defaultProps} />);
    expect(screen.getByText('Author One')).toBeInTheDocument();
  });

  it('disables trigger when no tags available', () => {
    render(<FilterPosts authors={[]} tags={[]} categories={[]} />);
    const triggers = screen.getAllByTestId('select-trigger');
    triggers.forEach(trigger => {
      expect(trigger).toBeDisabled();
    });
  });

  it('renders reset button that navigates to /posts', () => {
    render(<FilterPosts {...defaultProps} />);
    const resetButton = screen.getByText('Reset Filters');
    resetButton.click();
    expect(mockPush).toHaveBeenCalledWith('/posts');
  });
});
