// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { PGContextMenu } from '@/presentation/components/shell/PGContextMenu';
import { PGGlobalSearch } from '@/presentation/components/shell/PGGlobalSearch';
import { PGSidebar } from '@/presentation/components/shell/PGSidebar';
import { buildGlobalSearchIndex } from '@/presentation/components/shell/build-global-search-index';
import { EMPTY_COMPANY_DASHBOARD_VIEW_DATA } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';
import { vi } from 'vitest';

expect.extend(matchers);

vi.mock('@/presentation/state/GameWorkspaceProvider', () => ({
  useGameWorkspace: () => ({
    navigation: { screen: 'company', entitySelection: { kind: 'none' } },
    companyViewData: EMPTY_COMPANY_DASHBOARD_VIEW_DATA,
    viewData: {
      session: {
        hasGame: true,
        companyId: 'company-1',
        companyName: 'Test AG',
        playerId: 'player-1',
        savePath: 'saves/browser-session.json',
      },
      simulation: {
        tickNumber: 12,
        simulationTime: 3600,
        isPaused: false,
        speedMultiplier: 1,
        hasActiveSession: true,
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

describe('shell accessibility', () => {
  it('PGSidebar has no axe violations', async () => {
    const { container } = renderPresentation(<PGSidebar />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('PGGlobalSearch has no axe violations', async () => {
    const items = buildGlobalSearchIndex(EMPTY_COMPANY_DASHBOARD_VIEW_DATA, []);
    const { container } = renderPresentation(
      <PGGlobalSearch
        items={items}
        filterItems={(allItems) => allItems}
        onClose={vi.fn()}
        onSelect={vi.fn()}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('PGContextMenu has no axe violations', async () => {
    const { container } = renderPresentation(
      <PGContextMenu
        x={0}
        y={0}
        items={[{ id: 'copy', label: 'Kopieren', onSelect: vi.fn() }]}
        onClose={vi.fn()}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
