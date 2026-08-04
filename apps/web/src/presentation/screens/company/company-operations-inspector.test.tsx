// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
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
  buildings: new Map(),
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
});
