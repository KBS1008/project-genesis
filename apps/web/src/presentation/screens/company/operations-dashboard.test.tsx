// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { buildOperationsKpiCards } from '@/presentation/adapters/mappers/company-operations-view-mappers';
import type { KpiStripViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { PGOperationsTable } from '@/presentation/components/dashboard/PGOperationsTable';
import { PGLoadingOverlay } from '@/presentation/components/foundation/PGLoadingOverlay';
import { OperationsKpiStrip } from '@/presentation/screens/company/OperationsKpiStrip';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

const SAMPLE_KPIS: KpiStripViewData = {
  availableCashLabel: '10.000 GC',
  availableCashTrend: '+2 %',
  energyReserveLabel: '120',
  energyTrend: 'Stabil',
  energyHasDeficit: false,
  activeTransportCount: 1,
  activeTransportTrend: '1 aktiv',
  warehouseTotalUnits: 10,
  warehouseCapacityHint: '10 / 100',
  onSiteResourceLines: 2,
  onSiteHint: 'Standort',
  assignedEmployeeCount: 1,
  employeeCount: 2,
  employeeCapacityHint: '1 / 2',
  payrollLabel: '500 GC',
  priceIndexLabel: '1,00',
  priceIndexHint: 'neutral',
  corporateTaxRateLabel: '15 %',
  taxTrendLabel: '1 Vertrag',
  taxPaymentBlocked: false,
  pendingTaxLabel: null,
  runningProductionCount: 0,
  productionHint: 'Keine Jobs',
  activeResearchCount: 0,
  researchHint: 'Keine Forschung',
  completedMilestoneCount: 0,
  milestoneHint: '0 / 8',
  activeContractCount: 1,
  economyHint: 'Stabil',
  taxIntervalTicks: 30,
};

describe('operations dashboard components', () => {
  it('PGLoadingOverlay exposes accessible busy state', () => {
    renderPresentation(<PGLoadingOverlay active label="Speichern…" />);

    expect(screen.getByRole('status', { name: 'Speichern…' })).toBeInTheDocument();
  });

  it('OperationsKpiStrip routes finance and logistics clicks', async () => {
    const user = userEvent.setup();
    const onSelectFinance = vi.fn();
    const onSelectLogistics = vi.fn();

    render(
      <OperationsKpiStrip
        cards={buildOperationsKpiCards(SAMPLE_KPIS)}
        onSelectFinance={onSelectFinance}
        onSelectLogistics={onSelectLogistics}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Verfügbar' }));
    await user.click(screen.getByRole('button', { name: 'Transporte' }));

    expect(onSelectFinance).toHaveBeenCalledTimes(1);
    expect(onSelectLogistics).toHaveBeenCalledTimes(1);
  });

  it('PGOperationsTable filters searchable rows', async () => {
    const user = userEvent.setup();

    render(
      <PGOperationsTable
        columns={['Name', 'Typ']}
        searchable
        rows={[
          { id: '1', cells: ['Fabrik A', 'Produktion'], searchText: 'Fabrik A Produktion' },
          { id: '2', cells: ['Lager', 'Logistik'], searchText: 'Lager Logistik' },
        ]}
      />,
    );

    await user.type(screen.getByPlaceholderText('Tabelle durchsuchen…'), 'Lager');

    expect(screen.getByText('Lager')).toBeInTheDocument();
    expect(screen.queryByText('Fabrik A')).not.toBeInTheDocument();
  });
});
