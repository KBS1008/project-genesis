import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('alpha', 250));

    expect(result.current).toBe('alpha');
  });

  it('debounces subsequent value changes', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value, delayMs }) => useDebouncedValue(value, delayMs),
      {
        initialProps: { value: 'alpha', delayMs: 250 },
      },
    );

    rerender({ value: 'beta', delayMs: 250 });
    expect(result.current).toBe('alpha');

    act(() => {
      vi.advanceTimersByTime(249);
    });
    expect(result.current).toBe('alpha');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('beta');

    vi.useRealTimers();
  });
});
