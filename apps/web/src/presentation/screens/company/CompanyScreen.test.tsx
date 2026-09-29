// @vitest-environment jsdom

import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CompanyScreen } from '@/presentation/screens/company/CompanyScreen';

const workspace = vi.hoisted(() => ({
  pendingCompanyOperationsNavigation: null as
    | { readonly kind: 'milestone_overview' }
    | { readonly kind: 'workforce_assignment'; readonly buildingId: string }
    | null,
  clearPendingCompanyOperationsNavigation: vi.fn(),
  navigation: { screen: 'company' as const, entitySelection: { kind: 'none' as const } },
}));

vi.mock('@/presentation/screens/company/CompanyDashboardScreen', () => ({
  CompanyDashboardScreen: () => <div data-testid="operations-dashboard" />,
}));

vi.mock('@/presentation/screens/company/CompanyOverviewScreen', () => ({
  CompanyOverviewScreen: () => <div data-testid="company-overview" />,
}));

vi.mock('@/presentation/state/GameWorkspaceProvider', () => ({
  useGameWorkspace: () => ({
    navigation: workspace.navigation,
    pendingCompanyOperationsNavigation: workspace.pendingCompanyOperationsNavigation,
    clearPendingCompanyOperationsNavigation: workspace.clearPendingCompanyOperationsNavigation,
  }),
}));

describe('CompanyScreen pending operations navigation', () => {
  it('opens operations for milestone intent and clears it immediately', async () => {
    workspace.pendingCompanyOperationsNavigation = { kind: 'milestone_overview' };
    workspace.clearPendingCompanyOperationsNavigation.mockClear();

    const { getByTestId, queryByTestId } = render(<CompanyScreen />);

    await waitFor(() => {
      expect(getByTestId('operations-dashboard')).toBeInTheDocument();
    });
    expect(queryByTestId('company-overview')).toBeNull();
    expect(workspace.clearPendingCompanyOperationsNavigation).toHaveBeenCalled();
  });

  it('opens operations for workforce intent without clearing before dashboard consumes it', async () => {
    workspace.pendingCompanyOperationsNavigation = {
      kind: 'workforce_assignment',
      buildingId: 'building_005',
    };
    workspace.clearPendingCompanyOperationsNavigation.mockClear();

    const { getByTestId } = render(<CompanyScreen />);

    await waitFor(() => {
      expect(getByTestId('operations-dashboard')).toBeInTheDocument();
    });
    expect(workspace.clearPendingCompanyOperationsNavigation).not.toHaveBeenCalled();
  });
});
