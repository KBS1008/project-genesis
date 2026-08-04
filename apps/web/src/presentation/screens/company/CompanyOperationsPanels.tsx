'use client';

import { useMemo } from 'react';
import type { CompanyDashboardViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import {
  buildOperationsEconomyPanel,
  mapOperationsBuildingRows,
  mapOperationsEmployeeRows,
  mapOperationsFinanceLedgerRows,
  mapOperationsMarketRows,
  mapOperationsProductionJobs,
  mapOperationsResearchJobs,
  mapOperationsSiteInventoryRows,
  mapOperationsTransportOrders,
  mapOperationsWarehouseBlocks,
} from '@/presentation/adapters/mappers/company-operations-table-mappers';
import {
  PGBuildingsWidget,
  PGEmployeesWidget,
  PGEconomyWidget,
  PGFinanceWidget,
  PGInventoryWidget,
  PGMarketWidget,
  PGProductionWidget,
  PGResearchWidget,
  PGSupplyChainWidget,
} from '@/presentation/components/dashboard';
import { PGSkeleton } from '@/presentation/components/foundation/PGSkeleton';

export type OperationsDetailKind =
  | 'building'
  | 'production'
  | 'transport'
  | 'research'
  | 'employee'
  | 'transaction'
  | 'warehouse';

export type OperationsDetailSelection = {
  readonly kind: OperationsDetailKind | 'overview' | 'finance' | 'logistics';
  readonly id?: string;
};

function resolveSelectedId(
  selection: OperationsDetailSelection,
  kind: OperationsDetailKind,
): string | null {
  return selection.kind === kind && selection.id !== undefined ? selection.id : null;
}

/** PG widget panels replacing legacy DataTable sections in the operations dashboard. */
export function CompanyOperationsPanels({
  companyViewData,
  hasGame,
  isLoading,
  selection,
  onSelectDetail,
}: {
  readonly companyViewData: CompanyDashboardViewData;
  readonly hasGame: boolean;
  readonly isLoading: boolean;
  readonly selection: OperationsDetailSelection;
  readonly onSelectDetail: (kind: OperationsDetailKind, id: string) => void;
}) {
  const buildingRows = useMemo(
    () => mapOperationsBuildingRows(companyViewData.buildings),
    [companyViewData.buildings],
  );
  const employeeRows = useMemo(
    () => mapOperationsEmployeeRows(companyViewData.employees),
    [companyViewData.employees],
  );
  const economyPanel = useMemo(
    () => buildOperationsEconomyPanel(companyViewData.economy),
    [companyViewData.economy],
  );
  const marketRows = useMemo(
    () => mapOperationsMarketRows(companyViewData.marketPrices),
    [companyViewData.marketPrices],
  );
  const productionJobs = useMemo(
    () => mapOperationsProductionJobs(companyViewData.productionJobs),
    [companyViewData.productionJobs],
  );
  const researchJobs = useMemo(
    () => mapOperationsResearchJobs(companyViewData.researchJobs),
    [companyViewData.researchJobs],
  );
  const transportOrders = useMemo(
    () => mapOperationsTransportOrders(companyViewData.transportOrders),
    [companyViewData.transportOrders],
  );
  const ledgerRows = useMemo(
    () => mapOperationsFinanceLedgerRows(companyViewData.financeTransactions),
    [companyViewData.financeTransactions],
  );
  const siteInventoryRows = useMemo(
    () => mapOperationsSiteInventoryRows(companyViewData.inventoryItems),
    [companyViewData.inventoryItems],
  );
  const warehouseBlocks = useMemo(
    () => mapOperationsWarehouseBlocks(companyViewData.warehouseStorage),
    [companyViewData.warehouseStorage],
  );

  if (isLoading) {
    return (
      <div className="pg-operations-panels pg-operations-panels-loading">
        <PGSkeleton lines={3} />
        <PGSkeleton lines={3} />
      </div>
    );
  }

  return (
    <div className="pg-operations-panels">
      <PGBuildingsWidget
        rows={buildingRows}
        state={hasGame ? 'idle' : 'empty'}
        emptyTitle="Noch keine Gebäude."
        emptyHint="Nutzen Sie die Aktionen in der Seitenleiste, um ein Gebäude zu platzieren."
        selectedBuildingId={resolveSelectedId(selection, 'building')}
        onBuildingClick={(buildingId) => {
          onSelectDetail('building', buildingId);
        }}
      />

      <PGEmployeesWidget
        rows={employeeRows}
        state={hasGame ? 'idle' : 'empty'}
        emptyTitle="Noch keine Mitarbeiter."
        emptyHint="Stellen Sie Personal über die Seitenleiste ein."
        selectedEmployeeId={resolveSelectedId(selection, 'employee')}
        onEmployeeClick={(employeeId) => {
          onSelectDetail('employee', employeeId);
        }}
      />

      <PGEconomyWidget
        subtitle={economyPanel.subtitle}
        taxWarning={economyPanel.taxWarning}
        warning={economyPanel.warning}
        rows={economyPanel.contractRows}
        state={hasGame ? 'idle' : 'empty'}
        emptyTitle="Keine Lieferverträge."
        emptyHint="NPC-Verträge erscheinen nach Spielstart automatisch."
      />

      <PGMarketWidget
        rows={marketRows}
        state={hasGame ? 'idle' : 'empty'}
        emptyTitle="Noch keine Marktdaten."
        emptyHint="Starten Sie ein Spiel, um dynamische Preise zu sehen."
      />

      <div className="pg-operations-panels-grid">
        <PGProductionWidget
          activeCount={productionJobs.length}
          jobs={productionJobs}
          state={hasGame ? 'idle' : 'empty'}
          emptyTitle="Keine laufende Produktion."
          emptyHint="Bauen Sie eine Fabrik und starten Sie ein Rezept."
          selectedJobId={resolveSelectedId(selection, 'production')}
          onJobClick={(jobId) => {
            onSelectDetail('production', jobId);
          }}
        />

        <PGResearchWidget
          activeCount={researchJobs.length}
          jobs={researchJobs}
          completedLabels={companyViewData.completedResearchLabels}
          state={hasGame ? 'idle' : 'empty'}
          emptyTitle="Keine laufende Forschung."
          emptyHint="Starten Sie ein Projekt in der Seitenleiste."
          selectedJobId={resolveSelectedId(selection, 'research')}
          onJobClick={(jobId) => {
            onSelectDetail('research', jobId);
          }}
        />
      </div>

      <PGSupplyChainWidget
        title="Transport & Logistik"
        hint="Interner Transport vom Lagerhaus zum Produktionsgebäude (Dauer aus Routen-Content). Produktion startet nach Ankunft aller Lieferungen."
        activeCount={transportOrders.length}
        orders={transportOrders}
        detailed
        state={hasGame ? 'idle' : 'empty'}
        emptyTitle="Keine aktiven Transporte."
        emptyHint="Kaufen Sie Material am Markt — es landet im Lagerhaus."
        selectedOrderId={resolveSelectedId(selection, 'transport')}
        onOrderClick={(orderId) => {
          onSelectDetail('transport', orderId);
        }}
      />

      <PGFinanceWidget
        title="Finanzbuchungen"
        subtitle="Ledger-Einträge des Unternehmenskontos — neueste zuerst."
        ledgerMode
        ledgerRows={ledgerRows}
        state={hasGame ? 'idle' : 'empty'}
        emptyTitle="Keine Buchungen."
        emptyHint="Starten Sie ein Spiel, um Finanzbewegungen zu sehen."
        selectedTransactionId={resolveSelectedId(selection, 'transaction')}
        onTransactionClick={(transactionId) => {
          onSelectDetail('transaction', transactionId);
        }}
      />

      <PGInventoryWidget
        siteRows={siteInventoryRows}
        warehouseBlocks={warehouseBlocks}
        state={hasGame ? 'idle' : 'empty'}
        warehouseEmptyTitle={
          hasGame ? 'Kein Lagerhaus aktiv oder Lager leer.' : 'Kein Lagerhaus aktiv.'
        }
        warehouseEmptyHint={
          hasGame ? 'Kaufen Sie Ressourcen am Markt.' : 'Bauen Sie ein Lagerhaus, um Marktkäufe zu lagern.'
        }
        selectedWarehouseId={resolveSelectedId(selection, 'warehouse')}
        onWarehouseClick={(warehouseId) => {
          onSelectDetail('warehouse', warehouseId);
        }}
      />
    </div>
  );
}
