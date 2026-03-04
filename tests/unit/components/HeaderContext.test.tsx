import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { HeaderProvider, useHeader } from '@/lib/header-context';

describe('HeaderProvider + useHeader', () => {
  it('should throw when useHeader is used outside HeaderProvider', () => {
    // Suppress React error boundary console output
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useHeader())).toThrow(
      'useHeader must be used within a HeaderProvider'
    );
    spy.mockRestore();
  });

  it('should provide default isFixedPosition as false', () => {
    const { result } = renderHook(() => useHeader(), {
      wrapper: ({ children }) => <HeaderProvider>{children}</HeaderProvider>,
    });
    expect(result.current.isFixedPosition).toBe(false);
  });

  it('should update isFixedPosition when setIsFixedPosition is called', () => {
    const { result } = renderHook(() => useHeader(), {
      wrapper: ({ children }) => <HeaderProvider>{children}</HeaderProvider>,
    });

    act(() => {
      result.current.setIsFixedPosition(true);
    });

    expect(result.current.isFixedPosition).toBe(true);
  });

  it('should propagate state to consuming components', () => {
    function Consumer() {
      const { isFixedPosition } = useHeader();
      return <div data-testid="status">{isFixedPosition ? 'fixed' : 'default'}</div>;
    }

    render(
      <HeaderProvider>
        <Consumer />
      </HeaderProvider>
    );

    expect(screen.getByTestId('status')).toHaveTextContent('default');
  });
});
