import { describe, expect, it } from 'vitest';
import type { KpiStripViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import {
  buildOperationsKpiCards,
  buildOperationsOverviewCards,
} from '@/presentation/adapters/mappers/company-operations-view-mappers';

const SAMPLE_KPIS: KpiStripViewData = {
  availableCashLabel: '10.000 GC',
  availableCashTrend: '+2 %',
  energyReserveLabel: '120',
  energyTrend: 'Stabil',
  energyHasDeficit: false,
  activeTransportCount: 2,
  activeTransportTrend: '2 aktiv',
  warehouseTotalUnits: 48,
  warehouseCapacityHint: '48 / 200',
  onSiteResourceLines: 6,
  onSiteHint: 'Standort',
  assignedEmployeeCount: 3,
  employeeCount: 5,
  employeeCapacityHint: '3 / 5',
  payrollLabel: '1.200 GC',
  priceIndexLabel: '1,02',
  priceIndexHint: 'leicht über neutral',
  corporateTaxRateLabel: '15 %',
  taxTrendLabel: '2 Verträge',
  taxPaymentBlocked: false,
  pendingTaxLabel: null,
  runningProductionCount: 1,
  productionHint: '1 Job',
  activeResearchCount: 0,
  researchHint: 'Keine Forschung',
  completedMilestoneCount: 2,
  milestoneHint: '2 / 8',
  activeContractCount: 2,
  economyHint: 'Stabil',
  taxIntervalTicks: 30,
};

describe('company-operations-view-mappers', () => {
  it('buildOperationsKpiCards maps finance and logistics actions', () => {
    const cards = buildOperationsKpiCards(SAMPLE_KPIS);

    expect(cards).toHaveLength(8);
    expect(cards[0]?.action).toBe('finance');
    expect(cards.find((card) => card.id === 'transport')?.action).toBe('logistics');
    expect(cards.find((card) => card.id === 'transport')?.isActive).toBe(true);
  });

  it('buildOperationsOverviewCards marks transport card as logistics action', () => {
    const cards = buildOperationsOverviewCards({
      cards: Object.freeze([
        { label: 'Transport', value: '2', hint: 'Logistik stabil' },
        { label: 'Gebäude', value: '4', hint: 'Standorte' },
      ]),
    });

    expect(cards.find((card) => card.id === 'transport')?.action).toBe('logistics');
    expect(cards.find((card) => card.id === 'gebäude')?.action).toBeUndefined();
  });
});
