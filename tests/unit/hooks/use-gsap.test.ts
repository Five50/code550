import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

// vi.mock is hoisted — cannot reference outer variables in the factory
vi.mock('gsap', () => ({
  default: {
    fromTo: vi.fn(),
    registerPlugin: vi.fn(),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

import { useGsapFadeIn, useGsapStagger, useGsapSlideIn, useGsapScale } from '@/lib/use-gsap';

describe('useGsapFadeIn', () => {
  it('should return a ref', () => {
    const { result } = renderHook(() => useGsapFadeIn());
    expect(result.current).toHaveProperty('current');
  });

  it('should not crash without a DOM element', () => {
    const { result } = renderHook(() => useGsapFadeIn(0.2));
    expect(result.current.current).toBeNull();
  });
});

describe('useGsapStagger', () => {
  it('should return a ref', () => {
    const { result } = renderHook(() => useGsapStagger());
    expect(result.current).toHaveProperty('current');
  });

  it('should accept custom stagger delay', () => {
    const { result } = renderHook(() => useGsapStagger(0.2));
    expect(result.current.current).toBeNull();
  });
});

describe('useGsapSlideIn', () => {
  it('should return a ref', () => {
    const { result } = renderHook(() => useGsapSlideIn('left'));
    expect(result.current).toHaveProperty('current');
  });

  it('should accept direction and delay parameters', () => {
    const { result } = renderHook(() => useGsapSlideIn('right', 0.5));
    expect(result.current.current).toBeNull();
  });
});

describe('useGsapScale', () => {
  it('should return a ref', () => {
    const { result } = renderHook(() => useGsapScale());
    expect(result.current).toHaveProperty('current');
  });

  it('should accept delay parameter', () => {
    const { result } = renderHook(() => useGsapScale(0.3));
    expect(result.current.current).toBeNull();
  });
});
