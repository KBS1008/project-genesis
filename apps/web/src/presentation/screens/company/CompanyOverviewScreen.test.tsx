// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CompanyOverviewScreen } from '@/presentation/screens/company/CompanyOverviewScreen';

vi.mock('@/presentation/state/GameWorkspaceProvider', () => ({
  useGameWorkspace: () => ({
    viewData: {
      session: { hasGame: true },
    },
    companyViewData: {
      companyName: 'Test Corp',
      headerSubtitle: 'Tick 1',
      labels: {
        resource: (id: string) => id,
        building: (id: string) => id,
        recipe: (id: string) => id,
        technology: (id: string) => id,
        employee: (id: string) => id,
      },
      overview: { cards: [] },
      inventoryItems: [],
      financeTransactions: [],
      productionJobs: [],
      researchJobs: [],
      logisticsStatusMessage: null,
      detail: {
        hasFinance: false,
        financeEntries: [],
      },
    },
    regions: [],
    navigateToTarget: vi.fn(),
  }),
}));

vi.mock('@/presentation/hooks/useScreenQuery', () => ({
  useScreenQuery: () => ({
    data: [],
    isLoading: false,
    errorMessage: null,
  }),
}));

describe('CompanyOverviewScreen', () => {
  it('renders company overview sections', () => {
    render(<CompanyOverviewScreen onOpenOperations={() => {}} />);

    expect(screen.getByText('Test Corp')).toBeInTheDocument();
    expect(screen.getByText('Finanzübersicht')).toBeInTheDocument();
    expect(screen.getByText('Regionale Präsenz')).toBeInTheDocument();
  });
});
