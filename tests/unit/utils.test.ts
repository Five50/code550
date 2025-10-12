import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
  });

  it('should handle conditional classes', () => {
    expect(cn('btn', false && 'btn-primary', 'btn-large')).toBe('btn btn-large');
  });

  it('should handle undefined and null values', () => {
    expect(cn('btn', undefined, null, 'btn-primary')).toBe('btn btn-primary');
  });

  it('should merge tailwind classes with conflicts', () => {
    expect(cn('px-2 py-1 bg-red-500', 'px-4 bg-blue-500')).toBe('py-1 px-4 bg-blue-500');
  });
});