// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EMPTY_COMPANY_DASHBOARD_VIEW_DATA } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { PGContextMenu } from '@/presentation/components/shell/PGContextMenu';
import { PGGlobalSearch } from '@/presentation/components/shell/PGGlobalSearch';
import { PGSidebar } from '@/presentation/components/shell/PGSidebar';
import { buildGlobalSearchIndex } from '@/presentation/components/shell/build-global-search-index';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

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
    isSessionDirty: false,
    navigateToScreen,
    selectEntity: vi.fn(),
    clearEntitySelection: vi.fn(),
    refreshSession: vi.fn(),
    runCommand: vi.fn(),
    markSessionSaved: vi.fn(),
    navigateToTarget: vi.fn(),
  }),
}));

describe('shell components', () => {
  it('PGSidebar marks the active screen and navigates on selection', async () => {
    const user = userEvent.setup();
    navigateToScreen.mockClear();

    render(<PGSidebar />);

    expect(screen.getByRole('button', { name: 'Unternehmen' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await user.click(screen.getByRole('button', { name: 'Märkte' }));
    expect(navigateToScreen).toHaveBeenCalledWith('markets');
  });

  it('PGSidebar navigates with arrow keys', () => {
    navigateToScreen.mockClear();

    render(<PGSidebar />);

    fireEvent.keyDown(screen.getByRole('navigation', { name: 'Hauptnavigation' }), {
      key: 'ArrowDown',
    });

    expect(navigateToScreen).toHaveBeenCalledWith('markets');
  });

  it('PGGlobalSearch filters and selects results', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const items = buildGlobalSearchIndex(EMPTY_COMPANY_DASHBOARD_VIEW_DATA, []);

    renderPresentation(
      <PGGlobalSearch
        items={items}
        filterItems={(allItems, query) =>
          allItems.filter((item) => item.label.toLocaleLowerCase('de-DE').includes(query))
        }
        onClose={vi.fn()}
        onSelect={onSelect}
      />,
    );

    await user.type(screen.getByRole('searchbox'), 'finanz');
    await user.click(screen.getByRole('option', { name: /Finanzen/i }));

    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'screen:finance' }));
  });

  it('PGContextMenu invokes item handlers', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    renderPresentation(
      <PGContextMenu
        x={12}
        y={24}
        items={[{ id: 'action', label: 'Aktion ausführen', onSelect }]}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('menuitem', { name: 'Aktion ausführen' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
