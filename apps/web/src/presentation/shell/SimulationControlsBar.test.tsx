// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SimulationControlsBar } from '@/presentation/shell/SimulationControlsBar';

const runCommand = vi.fn();
const openConfirmDialog = vi.fn((_config: unknown, onConfirm: () => void) => {
  onConfirm();
});

vi.mock('@/presentation/dialog/DialogProvider', () => ({
  useDialog: () => ({
    openConfirmDialog,
  }),
}));

vi.mock('@/presentation/state/GameWorkspaceProvider', () => ({
  useGameWorkspace: () => ({
    viewData: {
      session: {
        hasGame: true,
        companyId: 'company_001',
        companyName: 'Test Corp',
        playerId: 'player_001',
        savePath: 'saves/browser-session.json',
      },
      simulation: {
        tickNumber: 3,
        simulationTime: 3,
        isPaused: false,
        speedMultiplier: 1,
        hasActiveSession: true,
        speedLabel: '×1',
      },
      world: null,
      saves: [],
    },
    isBusy: false,
    runCommand,
  }),
}));

describe('SimulationControlsBar', () => {
  it('renders pause, step, and speed controls for an active session', async () => {
    const user = userEvent.setup();
    runCommand.mockClear();

    render(<SimulationControlsBar />);

    expect(screen.getByRole('region', { name: 'Simulationssteuerung' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Simulation pausieren' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Einen Simulationsschritt ausführen' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Simulationsgeschwindigkeit ×2' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );

    await user.click(screen.getByRole('button', { name: 'Simulationsgeschwindigkeit ×2' }));
    expect(runCommand).toHaveBeenCalledTimes(1);
  });

  it('confirms a simulation step while the simulation is running', async () => {
    const user = userEvent.setup();
    openConfirmDialog.mockClear();
    runCommand.mockClear();

    render(<SimulationControlsBar />);

    await user.click(screen.getByRole('button', { name: 'Einen Simulationsschritt ausführen' }));

    expect(openConfirmDialog).toHaveBeenCalledTimes(1);
    expect(runCommand).toHaveBeenCalledTimes(1);
  });
});
