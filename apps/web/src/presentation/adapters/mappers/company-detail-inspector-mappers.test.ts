import { describe, expect, it } from 'vitest';
import { resolveCompanyDetailInspector } from '@/presentation/adapters/mappers/company-detail-inspector-mappers';
import type { CompanyDetailViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';

const BASE_DETAIL: CompanyDetailViewData = {
  hasFinance: true,
  hasLogistics: true,
  hasEnergy: true,
  currency: 'GC',
  companyEntries: Object.freeze([['Firma', 'Test Corp'] as const]),
  financeEntries: Object.freeze([['Kontostand', '1.000 GC'] as const]),
  logisticsEntries: Object.freeze([['Transporte', '2'] as const]),
  energyEntries: Object.freeze([['Reserve', '100 MW'] as const]),
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

describe('company-detail-inspector-mappers', () => {
  it('resolveCompanyDetailInspector builds overview sections', () => {
    const inspector = resolveCompanyDetailInspector(BASE_DETAIL, [], { kind: 'overview' });

    expect(inspector.mode).toBe('overview');
    expect(inspector.title).toBe('Unternehmensübersicht');
    expect(inspector.sections).toHaveLength(3);
    expect(inspector.showClose).toBe(false);
  });

  it('resolveCompanyDetailInspector maps finance focus with transactions', () => {
    const inspector = resolveCompanyDetailInspector(
      {
        ...BASE_DETAIL,
        recentTransactions: Object.freeze([
          {
            id: 'tx-1',
            typeLabel: 'Kauf',
            amountLabel: '-50 GC',
            balanceLabel: '950 GC',
            timestampLabel: 'Tick 1',
            directionClass: 'kv-value-error',
          },
        ]),
      },
      [],
      { kind: 'finance' },
    );

    expect(inspector.title).toBe('Finanzen');
    expect(inspector.relatedItems?.[0]?.secondaryClass).toBe('kv-value-error');
    expect(inspector.showClose).toBe(true);
  });
});
