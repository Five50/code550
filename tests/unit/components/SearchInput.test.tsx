import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchInput } from '@/components/posts/search-input';

const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/posts',
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock('use-debounce', () => ({
  useDebouncedCallback: (fn: Function) => fn,
}));

// Mock shadcn Input to ensure onChange fires
vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

describe('SearchInput', () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it('renders search input with placeholder', () => {
    render(<SearchInput />);
    expect(screen.getByPlaceholderText('Search posts...')).toBeInTheDocument();
  });

  it('renders with default value', () => {
    render(<SearchInput defaultValue="test query" />);
    const input = screen.getByPlaceholderText('Search posts...') as HTMLInputElement;
    expect(input.defaultValue).toBe('test query');
  });

  it('updates URL with search term on input change', () => {
    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Search posts...');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(mockReplace).toHaveBeenCalledWith('/posts?search=hello');
  });

  it('calls replace on each input change', () => {
    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Search posts...');
    fireEvent.change(input, { target: { value: 'world' } });
    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith('/posts?search=world');
  });
});
