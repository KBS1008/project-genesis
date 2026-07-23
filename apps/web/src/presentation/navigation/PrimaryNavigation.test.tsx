// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EMPTY_COMPANY_DASHBOARD_VIEW_DATA } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { PrimaryNavigation } from '@/presentation/navigation/PrimaryNavigation';

const navigateToScreen = vi.fn();

vi.mock('@/presentation/state/GameWorkspaceProvider', () => ({
  useGameWorkspace: () => ({
    navigation: { screen: 'company', entitySelection: { kind: 'none' } },
    companyViewData: EMPTY_COMPANY_DASHBOARD_VIEW_DATA,
    viewData: {
      session: {
        hasGame: false,
        companyId: null,
        companyName: null,
        playerId: null,
        savePath: 'saves/browser-session.json',
      },
      simulation: {
        tickNumber: null,
        simulationTime: null,
        isPaused: false,
        speedMultiplier: 1,
        hasActiveSession: false,
        speedLabel: '×1',
      },
      world: null,
      saves: [],
    },
    regions: [],
    isLoading: false,
    isBusy: false,
    isLiveConnected: false,
    navigateToScreen,
    selectEntity: vi.fn(),
    clearEntitySelection: vi.fn(),
    refreshSession: vi.fn(),
    runCommand: vi.fn(),
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
