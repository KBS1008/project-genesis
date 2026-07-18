import { describe, expect, it } from 'vitest';
import { TickHistoryService } from './TickHistoryService.js';

function snapshot(
  tickNumber: number,
  cash = 1000,
  energy = 10,
  transports = 0,
  warehouseUnits = 0,
  onSiteUnits = 0,
  energyGeneration = 0,
  energyConsumption = 0,
  marketPrices: readonly {
    resourceId: string;
    lastPrice: number;
    totalSupply?: number;
    baselineDemand?: number;
    pressureIndex?: number;
  }[] = [],
) {
  return Object.freeze({
    tickNumber,
    simulationTime: tickNumber,
    availableCash: cash,
    energyReserve: energy,
    energyGeneration,
    energyConsumption,
    activeTransportCount: transports,
    warehouseTotalUnits: warehouseUnits,
    onSiteTotalUnits: onSiteUnits,
    marketPrices: Object.freeze(
      marketPrices.map((entry) =>
        Object.freeze({
          resourceId: entry.resourceId,
          lastPrice: entry.lastPrice,
          totalSupply: entry.totalSupply ?? 0,
          baselineDemand: entry.baselineDemand ?? 0,
          pressureIndex: entry.pressureIndex ?? 0,
        }),
      ),
    ),
  });
}

describe('TickHistoryService', () => {
  it('records and returns tick metrics in order', () => {
    const history = new TickHistoryService();

    history.record(snapshot(0, 250_000), 'company_001');
    history.record(snapshot(1, 249_000), 'company_001');

    const points = history.getHistory();

    expect(points).toHaveLength(2);
    expect(points[0]?.tickNumber).toBe(0);
    expect(points[1]?.availableCash).toBe(249_000);
  });

  it('replaces the last point when the same tick is recorded again', () => {
    const history = new TickHistoryService();

    history.record(snapshot(3, 1000), 'company_001');
    history.record(snapshot(3, 900), 'company_001');

    expect(history.getHistory()).toEqual([snapshot(3, 900)]);
  });

  it('clears history when the company changes', () => {
    const history = new TickHistoryService();

    history.record(snapshot(0), 'company_001');
    history.record(snapshot(1), 'company_002');

    expect(history.getHistory()).toEqual([snapshot(1)]);
  });

  it('applies fromTick, toTick and limit filters', () => {
    const history = new TickHistoryService();

    for (let tick = 0; tick < 10; tick += 1) {
      history.record(snapshot(tick), 'company_001');
    }

    const filtered = history.getHistory({ fromTick: 2, toTick: 7, limit: 3 });

    expect(filtered.map((point) => point.tickNumber)).toEqual([5, 6, 7]);
  });

  it('trims to the configured ring buffer size', () => {
    const history = new TickHistoryService(3);

    history.record(snapshot(0), 'company_001');
    history.record(snapshot(1), 'company_001');
    history.record(snapshot(2), 'company_001');
    history.record(snapshot(3), 'company_001');

    expect(history.getHistory().map((point) => point.tickNumber)).toEqual([1, 2, 3]);
  });

  it('exports and restores persisted history for a company', () => {
    const history = new TickHistoryService();

    history.record(snapshot(0, 250_000), 'company_001');
    history.record(snapshot(1, 249_000), 'company_001');

    expect(history.getCompanyId()).toBe('company_001');
    expect(history.exportForSave()).toHaveLength(2);

    history.replaceHistory('company_001', [snapshot(5, 200_000), snapshot(6, 199_000)]);

    expect(history.getHistory()).toEqual([snapshot(5, 200_000), snapshot(6, 199_000)]);
  });
});
