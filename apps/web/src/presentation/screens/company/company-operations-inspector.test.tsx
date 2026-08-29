// @vitest-environment jsdom

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CompanyDetailViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { CompanyOperationsInspector } from '@/presentation/screens/company/CompanyOperationsInspector';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

const BASE_DETAIL: CompanyDetailViewData = {
  hasFinance: true,
  hasLogistics: false,
  hasEnergy: false,
  currency: 'GC',
  companyEntries: Object.freeze([['Firma', 'Test Corp'] as const]),
  financeEntries: Object.freeze([['Kontostand', '1.000 GC'] as const]),
  logisticsEntries: Object.freeze([]),
  energyEntries: Object.freeze([]),
  buildings: new Map([
    [
      'building_005',
      {
        title: 'Sägewerk Nord',
        subtitle: 'Gebäude · Sägewerk',
        entries: Object.freeze([['Status', 'ACTIVE'] as const]),
        relatedItems: Object.freeze([
          {
            primary: 'Bretter herstellen',
            secondary: 'Energie fehlt',
            entityRef: Object.freeze({ kind: 'production' as const, id: 'production_001' }),
          },
        ]),
      },
    ],
  ]),
  productionJobs: new Map(),
  transportOrders: new Map(),
  researchJobs: new Map(),
  employees: new Map(),
  transactions: new Map(),
  warehouseStorage: new Map(),
  recentTransactions: Object.freeze([]),
  warehouseSummaries: Object.freeze([]),
};

describe('CompanyOperationsInspector', () => {
  it('renders overview inspector with finance section action', () => {
    renderPresentation(
      <CompanyOperationsInspector
        detail={BASE_DETAIL}
        marketPrices={[]}
        selection={{ kind: 'overview' }}
        onClearSelection={vi.fn()}
        onSelectFinance={vi.fn()}
        onSelectLogistics={vi.fn()}
      />,
    );

    expect(screen.getByText('Unternehmensübersicht')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Details' })).toBeInTheDocument();
  });

  it('opens production for selected building and linked production jobs', async () => {
    const user = userEvent.setup();
    const onOpenProductionForBuilding = vi.fn();
    const onSelectProductionJob = vi.fn();

    renderPresentation(
      <CompanyOperationsInspector
        detail={BASE_DETAIL}
        marketPrices={[]}
        selection={{ kind: 'building', id: 'building_005' }}
        onClearSelection={vi.fn()}
        onSelectFinance={vi.fn()}
        onSelectLogistics={vi.fn()}
        onOpenProductionForBuilding={onOpenProductionForBuilding}
        onSelectProductionJob={onSelectProductionJob}
      />,
    );

    expect(screen.getByText('Produktion an diesem Standort')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Produktion öffnen' }));
    expect(onOpenProductionForBuilding).toHaveBeenCalledWith('building_005');

    await user.click(screen.getByRole('button', { name: /Bretter herstellen/ }));
    expect(onSelectProductionJob).toHaveBeenCalledWith('production_001');
  });
});
