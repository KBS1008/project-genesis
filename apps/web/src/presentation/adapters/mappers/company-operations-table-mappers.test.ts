import { describe, expect, it } from 'vitest';
import type { EconomySectionViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import {
  buildOperationsEconomyPanel,
  mapOperationsEmployeeRows,
  mapOperationsFinanceLedgerRows,
  mapOperationsProductionJobs,
} from '@/presentation/adapters/mappers/company-operations-table-mappers';

const SAMPLE_ECONOMY: EconomySectionViewData = {
  corporateTaxRateLabel: '15 %',
  taxIntervalTicks: 30,
  priceIndexLabel: '1,02',
  taxPaymentBlocked: true,
  pendingTaxLabel: '500 GC',
  contracts: Object.freeze([
    {
      id: 'contract-1',
      resourceLabel: 'Eisen',
      amount: 10,
      paymentLabel: '100 GC',
      intervalLabel: '30 Ticks',
      statusLabel: 'Aktiv',
    },
  ]),
};

describe('company-operations-table-mappers', () => {
  it('buildOperationsEconomyPanel uses runtime tax labels without hardcoded fallback', () => {
    const panel = buildOperationsEconomyPanel(SAMPLE_ECONOMY);

    expect(panel.subtitle).toContain('15 %');
    expect(panel.subtitle).toContain('1,02');
    expect(panel.subtitle).not.toContain('Unternehmenssteuer 5 %');
    expect(panel.warning).toBe(true);
    expect(panel.taxWarning).toContain('500 GC');
    expect(panel.contractRows).toHaveLength(1);
  });

  it('mapOperationsEmployeeRows preserves searchable text', () => {
    const rows = mapOperationsEmployeeRows([
      {
        id: 'emp-1',
        displayName: 'Anna',
        employeeTypeLabel: 'Produktion',
        salaryLabel: '100 GC',
        productivityLabel: '1,0',
        assignmentLabel: 'Fabrik A',
      },
    ]);

    expect(rows[0]?.searchText).toContain('Anna');
    expect(rows[0]?.cells).toHaveLength(5);
  });

  it('mapOperationsProductionJobs maps widget rows', () => {
    const jobs = mapOperationsProductionJobs([
      {
        id: 'job-1',
        buildingLabel: 'Fabrik',
        recipeLabel: 'Stahl',
        statusLabel: 'Läuft',
        progressLabel: '50 %',
      },
    ]);

    expect(jobs[0]?.recipeLabel).toBe('Stahl');
  });

  it('mapOperationsFinanceLedgerRows maps ledger entries', () => {
    const rows = mapOperationsFinanceLedgerRows([
      {
        id: 'tx-1',
        typeLabel: 'Kauf',
        amountLabel: '-50 GC',
        balanceLabel: '950 GC',
        timestampLabel: 'Tick 12',
        directionClass: 'negative',
      },
    ]);

    expect(rows[0]?.cells).toEqual(['Kauf', '-50 GC', '950 GC', 'Tick 12']);
  });
});
