// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useSimulationTickLoop } from '@/presentation/simulation/useSimulationTickLoop';

const runSimulationTick = vi.fn(async () => undefined);

let workspaceState = {
  viewData: {
    session: { hasGame: true },
    simulation: { isPaused: false, speedMultiplier: 1 },
  },
  isBusy: false,
  runSimulationTick,
};

vi.mock('@/presentation/state/GameWorkspaceProvider', () => ({
  useGameWorkspace: () => workspaceState,
}));

describe('useSimulationTickLoop', () => {
  afterEach(() => {
    vi.useRealTimers();
    runSimulationTick.mockClear();
    workspaceState = {
      viewData: {
        session: { hasGame: true },
        simulation: { isPaused: false, speedMultiplier: 1 },
      },
      isBusy: false,
      runSimulationTick,
    };
  });

  it('advances simulation automatically while unpaused', async () => {
    vi.useFakeTimers();
    renderHook(() => useSimulationTickLoop());

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(runSimulationTick).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(runSimulationTick).toHaveBeenCalledTimes(2);
  });

  it('does not schedule ticks while paused', async () => {
    vi.useFakeTimers();
    workspaceState.viewData.simulation.isPaused = true;

    renderHook(() => useSimulationTickLoop());

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(runSimulationTick).not.toHaveBeenCalled();
  });
});
