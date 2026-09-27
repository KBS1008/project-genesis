// @vitest-environment jsdom

import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EMPTY_COMPANY_DASHBOARD_VIEW_DATA } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { GameWorkspaceShell } from '@/presentation/shell/GameWorkspaceShell';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/presentation/theme', () => ({
  useTheme: () => ({ theme: 'dark', toggleTheme: vi.fn() }),
}));

vi.mock('@/presentation/dialog/DialogProvider', () => ({
  useDialog: () => ({ openConfirmDialog: vi.fn() }),
}));

vi.mock('@/presentation/components/shell', () => ({
  ContextMenuProvider: ({ children }: { readonly children: ReactNode }) => children,
  GlobalSearchProvider: ({ children }: { readonly children: ReactNode }) => children,
  PGSidebar: () => null,
  useContextMenu: () => ({ openContextMenu: vi.fn() }),
  useGlobalSearch: () => ({ openSearch: vi.fn() }),
}));

vi.mock('@/presentation/simulation', () => ({
  SimulationTickLoop: () => null,
}));

vi.mock('@/presentation/shell/NotificationIndicator', () => ({
  NotificationIndicator: () => null,
}));

vi.mock('@/presentation/shell/SimulationControlsBar', () => ({
  SimulationControlsBar: () => null,
}));

vi.mock('@/presentation/state/GameWorkspaceProvider', () => ({
  useGameWorkspace: () => ({
    navigation: { screen: 'production', entitySelection: { kind: 'none' } },
    viewData: {
      session: {
        hasGame: true,
        companyName: 'Test Corp',
        savePath: 'saves/test.json',
      },
      simulation: {
        tickNumber: 12,
        simulationTime: 48,
        isPaused: false,
        speedMultiplier: 2,
        speedLabel: '×2',
      },
    },
    companyViewData: EMPTY_COMPANY_DASHBOARD_VIEW_DATA,
    regions: [],
    isLoading: false,
    isBusy: false,
    isLiveConnected: false,
    isSessionDirty: false,
    connectionState: 'connected',
    runtimeState: { dataFreshness: 'fresh', isAriaBusy: false },
    canRunCommands: true,
    runCommand: vi.fn(),
    clearEntitySelection: vi.fn(),
    markSessionSaved: vi.fn(),
  }),
}));

describe('GameWorkspaceShell', () => {
  it('shows player cycle position instead of tick terminology in header and status bar', () => {
    render(
      <GameWorkspaceShell>
        <div>content</div>
      </GameWorkspaceShell>,
    );

    expect(screen.getAllByText('Zyklus 12').length).toBeGreaterThan(0);
    expect(screen.queryByText(/Tick/i)).toBeNull();
    expect(screen.queryByText(/Simulationszeit/i)).toBeNull();
  });
});
