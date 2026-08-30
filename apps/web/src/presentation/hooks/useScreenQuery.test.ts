// @vitest-environment jsdom

import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { queryInvalidationStore } from '@/presentation/commands/query-invalidation';
import { useScreenQuery } from '@/presentation/hooks/useScreenQuery';

describe('useScreenQuery', () => {
  it('shows initial loading until the first result resolves', async () => {
    let resolveLoader!: (value: string) => void;
    const loader = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          resolveLoader = resolve;
        }),
    );

    const { result } = renderHook(() =>
      useScreenQuery('world-map:0', loader, true),
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.data).toBeNull();

    await act(async () => {
      resolveLoader('first');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBe('first');
    expect(result.current.isRefreshing).toBe(false);
  });

  it('keeps renderable data and skips initial loading during tick invalidation refresh', async () => {
    const loader = vi
      .fn<() => Promise<string>>()
      .mockResolvedValueOnce('tick-1')
      .mockImplementation(
        () =>
          new Promise<string>((resolve) => {
            window.setTimeout(() => resolve('tick-2'), 20);
          }),
      );

    const { result } = renderHook(() =>
      useScreenQuery('world-map:1', loader, true, { debounceMs: 0 }),
    );

    await waitFor(() => {
      expect(result.current.data).toBe('tick-1');
    });

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      queryInvalidationStore.invalidate(['screen.world-map']);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe('tick-1');
    expect(result.current.isRefreshing).toBe(true);

    await waitFor(() => {
      expect(result.current.data).toBe('tick-2');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isRefreshing).toBe(false);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('preserves prior data when a background refresh fails', async () => {
    const loader = vi
      .fn<() => Promise<string>>()
      .mockResolvedValueOnce('stable')
      .mockRejectedValueOnce(new Error('refresh failed'));

    const { result } = renderHook(() =>
      useScreenQuery('production:1', loader, true, { debounceMs: 0 }),
    );

    await waitFor(() => {
      expect(result.current.data).toBe('stable');
    });

    await act(async () => {
      queryInvalidationStore.invalidate(['screen.production']);
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBeTruthy();
    });

    expect(result.current.data).toBe('stable');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isRefreshing).toBe(false);
  });
});
