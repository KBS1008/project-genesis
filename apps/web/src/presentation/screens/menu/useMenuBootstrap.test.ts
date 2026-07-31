// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMenuBootstrap } from '@/presentation/screens/menu/useMenuBootstrap';

vi.mock('@/presentation/adapters/api/query-client', () => ({
  fetchSessionStatus: vi.fn(async () => ({
    hasActiveSession: false,
    companyId: null,
    companyName: null,
    playerId: null,
    savePath: 'saves/browser-session.json',
  })),
}));

describe('useMenuBootstrap', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('clears the loading timer on unmount', async () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    const { unmount } = renderHook(() => useMenuBootstrap());

    await act(async () => {
      vi.advanceTimersByTime(1600);
      await Promise.resolve();
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
