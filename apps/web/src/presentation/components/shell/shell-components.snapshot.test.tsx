// @vitest-environment jsdom

import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EMPTY_COMPANY_DASHBOARD_VIEW_DATA } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { PGGlobalSearch } from '@/presentation/components/shell/PGGlobalSearch';
import { PGSidebar } from '@/presentation/components/shell/PGSidebar';
import { buildGlobalSearchIndex } from '@/presentation/components/shell/build-global-search-index';
import { MainMenuHome } from '@/presentation/screens/menu/MainMenuHome';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

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
    isSessionDirty: false,
    navigateToScreen: vi.fn(),
    selectEntity: vi.fn(),
    clearEntitySelection: vi.fn(),
    refreshSession: vi.fn(),
    runCommand: vi.fn(),
    markSessionSaved: vi.fn(),
    navigateToTarget: vi.fn(),
  }),
}));

describe('shell and menu snapshots', () => {
  it('matches PGSidebar snapshot', () => {
    const { container } = render(<PGSidebar />);
    expect(container).toMatchSnapshot();
  });

  it('matches PGGlobalSearch snapshot', () => {
    const items = buildGlobalSearchIndex(EMPTY_COMPANY_DASHBOARD_VIEW_DATA, []);
    const { container } = renderPresentation(
      <PGGlobalSearch
        items={items}
        filterItems={(allItems) => allItems}
        onClose={vi.fn()}
        onSelect={vi.fn()}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('matches MainMenuHome snapshot', () => {
    const { container } = renderPresentation(
      <MainMenuHome
        sessionStatus={{
          hasActiveSession: true,
          companyId: 'company-1',
          companyName: 'Nordindustrie AG',
          playerId: 'player-1',
          savePath: 'saves/browser-session.json',
        }}
        errorMessage={null}
        onNavigate={vi.fn()}
        onContinue={vi.fn()}
        onExit={vi.fn()}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
