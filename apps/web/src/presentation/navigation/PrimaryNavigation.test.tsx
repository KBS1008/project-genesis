// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PrimaryNavigation } from '@/presentation/navigation/PrimaryNavigation';

const navigateToScreen = vi.fn();

vi.mock('@/presentation/state/GameWorkspaceProvider', () => ({
  useGameWorkspace: () => ({
    navigation: { screen: 'company', entitySelection: { kind: 'none' } },
    session: {
      hasGame: false,
      companyId: null,
      companyName: null,
      tickNumber: null,
      simulationTime: null,
      availableCash: null,
    },
    simulation: {
      tickNumber: null,
      simulationTime: null,
      isPaused: false,
      speedMultiplier: 1,
      hasActiveSession: false,
    },
    dashboard: null,
    isLoading: false,
    isLiveConnected: false,
    navigateToScreen,
    selectEntity: vi.fn(),
    clearEntitySelection: vi.fn(),
    refreshSession: vi.fn(),
  }),
}));

describe('PrimaryNavigation', () => {
  it('marks the active screen and navigates on selection', async () => {
    const user = userEvent.setup();
    navigateToScreen.mockClear();

    render(<PrimaryNavigation />);

    expect(screen.getByRole('button', { name: 'Unternehmen' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await user.click(screen.getByRole('button', { name: 'Märkte' }));
    expect(navigateToScreen).toHaveBeenCalledWith('markets');
  });
});
