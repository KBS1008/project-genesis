import { createElement, Fragment } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { EconomySectionViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import {
  buildOperationsEconomyPanel,
  mapMarketPriceRows,
  mapOperationsEmployeeRows,
  mapOperationsFinanceLedgerRows,
  mapOperationsProductionJobs,
  mapOperationsSiteInventoryRows,
  mapOperationsWarehouseBlocks,
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

  it('mapMarketPriceRows maps regional prices with trade volume', () => {
    const rows = mapMarketPriceRows(
      [
        {
          resourceId: 'wood',
          basePrice: 10,
          lastPrice: 12,
          tradeVolume: 25,
          updatedAt: 1,
          totalSupply: 100,
          baselineDemand: 80,
          pressureIndex: 1.1,
          changeFromBase: 2,
          changePercent: 20,
          trend: 'UP',
        },
      ],
      (resourceId) => (resourceId === 'wood' ? 'Holz' : resourceId),
    );

    expect(rows[0]?.id).toBe('wood');
    expect(rows[0]?.cells[0]).toBe('Holz');
    expect(rows[0]?.cells[1]).toBe('12 GC');
    expect(rows[0]?.cells[7]).toBe('25');
  });

  it('mapOperationsSiteInventoryRows preserves resourceId and decorates the label cell', () => {
    const rows = mapOperationsSiteInventoryRows([
      {
        resourceId: 'wood',
        resourceLabel: 'Holz',
        quantity: 40,
        reserved: 5,
        available: 35,
      },
    ]);

    expect(rows[0]?.id).toBe('site-inventory:wood:0');
    expect(rows[0]?.cells[1]).toBe('5');
    expect(rows[0]?.cells[2]).toBe('35');

    const labelCell = rows[0]?.cells[0];
    expect(labelCell).toBeTruthy();
    expect(typeof labelCell).toBe('object');
  });

  it('mapOperationsSiteInventoryRows leaves unknown resources as text-only cells', () => {
    const rows = mapOperationsSiteInventoryRows([
      {
        resourceId: 'unknown_resource',
        resourceLabel: 'Unbekannt',
        quantity: 1,
        reserved: 0,
        available: 1,
      },
    ]);

    expect(rows[0]?.searchText).toContain('Unbekannt');
    expect(rows[0]?.cells[1]).toBe('0');
  });

  it('mapOperationsWarehouseBlocks decorates detail rows with ResourceIcon and preserves summary rows', () => {
    const blocks = mapOperationsWarehouseBlocks([
      {
        id: 'warehouse-1',
        buildingLabel: 'Lagerhaus',
        capacityLabel: '10/500',
        usedLabel: '10',
        items: [
          {
            resourceId: 'wood',
            resourceLabel: 'Holz',
            quantity: 10,
            reserved: 2,
            available: 8,
          },
          {
            resourceId: 'steel',
            resourceLabel: 'Stahl',
            quantity: 5,
            reserved: 0,
            available: 5,
          },
        ],
      },
    ]);

    expect(blocks).toHaveLength(1);
    expect(blocks[0]?.summaryRow.cells).toEqual(['Lagerhaus', '2', '15']);

    const woodDetail = blocks[0]?.detailRows[0];
    expect(woodDetail?.cells[1]).toBe('2');
    expect(woodDetail?.cells[2]).toBe('8');
    expect(typeof woodDetail?.cells[0]).toBe('object');

    render(createElement(Fragment, null, woodDetail?.cells[0]));
    expect(screen.getByText('Holz')).toBeTruthy();
    expect(screen.getByRole('presentation', { hidden: true })).toBeTruthy();
  });

  it('mapOperationsWarehouseBlocks keeps unknown warehouse resources as text-only detail cells', () => {
    const blocks = mapOperationsWarehouseBlocks([
      {
        id: 'warehouse-1',
        buildingLabel: 'Lagerhaus',
        capacityLabel: '1/500',
        usedLabel: '1',
        items: [
          {
            resourceId: 'unknown_resource',
            resourceLabel: 'Unbekannt',
            quantity: 1,
            reserved: 0,
            available: 1,
          },
        ],
      },
    ]);

    const detail = blocks[0]?.detailRows[0];
    expect(detail?.searchText).toContain('Unbekannt');
    expect(detail?.cells[1]).toBe('0');
    expect(detail?.cells[2]).toBe('1');

    render(createElement(Fragment, null, detail?.cells[0]));
    expect(screen.getByText('Unbekannt')).toBeTruthy();
    expect(screen.queryByRole('presentation', { hidden: true })).toBeNull();
  });
});
