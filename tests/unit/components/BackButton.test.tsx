import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BackButton from '@/components/back';

const mockBack = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: mockBack }),
}));

describe('BackButton', () => {
  it('renders a "Go Back" button', () => {
    render(<BackButton />);
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('calls router.back() on click', () => {
    render(<BackButton />);
    fireEvent.click(screen.getByText('Go Back'));
    expect(mockBack).toHaveBeenCalled();
  });
});
