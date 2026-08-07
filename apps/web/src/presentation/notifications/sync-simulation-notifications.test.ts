import { describe, expect, it } from 'vitest';
import type { EventLogEntryDto } from '@/presentation/adapters/api/query-client';
import {
  EMPTY_COMPANY_DASHBOARD_VIEW_DATA,
  type CompanyDashboardViewData,
} from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { buildSimulationNotificationFeed } from './sync-simulation-notifications';

function createRuntimeFixture(): CompanyDashboardViewData {
  return {
    ...EMPTY_COMPANY_DASHBOARD_VIEW_DATA,
    hasGame: true,
    energyHasDeficit: true,
    logisticsStatusMessage: 'Transport verzögert',
    chartPoints: Object.freeze([
      {
        tickNumber: 8,
        simulationTime: 240,
        availableCash: 1000,
        energyReserve: 10,
        energyGeneration: 5,
        energyConsumption: 15,
        activeTransportCount: 1,
        warehouseTotalUnits: 20,
        onSiteTotalUnits: 5,
        priceIndex: 1,
        marketPrices: Object.freeze([]),
      },
    ]),
    kpis: {
      availableCashLabel: '1.000 GC',
      availableCashTrend: 'stabil',
      energyReserveLabel: '10',
      energyTrend: 'Defizit',
      energyHasDeficit: true,
      activeTransportCount: 1,
      activeTransportTrend: '1 aktiv',
      warehouseTotalUnits: 20,
      warehouseCapacityHint: '20/100',
      onSiteResourceLines: 1,
      onSiteHint: '1',
      assignedEmployeeCount: 1,
      employeeCount: 2,
      employeeCapacityHint: '1/2',
      payrollLabel: '100 GC',
      priceIndexLabel: '1.00',
      priceIndexHint: 'stabil',
      corporateTaxRateLabel: '20 %',
      taxTrendLabel: 'offen',
      taxPaymentBlocked: false,
      runningProductionCount: 0,
      productionHint: '0',
      activeResearchCount: 0,
      researchHint: '0',
      completedMilestoneCount: 0,
      milestoneHint: '0',
      activeContractCount: 0,
      economyHint: '0',
      taxIntervalTicks: 10,
    },
  };
}

describe('buildSimulationNotificationFeed', () => {
  it('merges event log and runtime alerts without duplicate ids', () => {
    const entries: readonly EventLogEntryDto[] = Object.freeze([
      {
        id: 'event_research',
        tickNumber: 9,
        occurredAt: 270,
        category: 'RESEARCH',
        message: 'Forschung abgeschlossen',
        severity: 'INFO',
      },
    ]);

    const feed = buildSimulationNotificationFeed({
      eventLogEntries: entries,
      companyViewData: createRuntimeFixture(),
      previouslySeenIds: new Set(),
    });

    expect(feed.notifications.some((entry) => entry.notificationId === 'event_research')).toBe(true);
    expect(feed.notifications.some((entry) => entry.notificationId === 'runtime:energy-deficit')).toBe(true);
    expect(feed.notifications.some((entry) => entry.notificationId === 'runtime:logistics-status')).toBe(true);
    expect(feed.notifications.length).toBe(3);
  });

  it('deduplicates toast candidates for previously seen notification ids', () => {
    const entries: readonly EventLogEntryDto[] = Object.freeze([
      {
        id: 'event_blocked',
        tickNumber: 10,
        occurredAt: 300,
        category: 'PRODUCTION',
        message: 'Produktion blockiert',
        severity: 'WARNING',
      },
    ]);

    const feed = buildSimulationNotificationFeed({
      eventLogEntries: entries,
      companyViewData: EMPTY_COMPANY_DASHBOARD_VIEW_DATA,
      previouslySeenIds: new Set(['event_blocked']),
    });

    expect(feed.toastCandidates).toHaveLength(0);
  });

  it('selects assertive candidates for critical runtime alerts', () => {
    const companyViewData: CompanyDashboardViewData = {
      ...createRuntimeFixture(),
      kpis: {
        ...createRuntimeFixture().kpis!,
        taxPaymentBlocked: true,
      },
    };

    const feed = buildSimulationNotificationFeed({
      eventLogEntries: Object.freeze([]),
      companyViewData,
      previouslySeenIds: new Set(),
    });

    expect(feed.assertiveCandidates.some((entry) => entry.notificationId === 'runtime:tax-blocked')).toBe(true);
  });
});
