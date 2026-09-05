'use client';

import { PGWidgetSurface } from '@/presentation/components/foundation/PGWidgetSurface';
import type { PGWidgetSurfaceProps } from '@/presentation/components/foundation/pg-widget-state';
import { PGOperationsTable, type PGOperationsTableRow } from '@/presentation/components/dashboard/PGOperationsTable';
import type { QueryColumn } from '@/presentation/screens/shared/QueryRows';

const INVENTORY_RESOURCE_TABLE_COLUMNS: readonly QueryColumn[] = [
  'Ressource',
  { label: 'Res.', title: 'Reserviert', ariaLabel: 'Reserviert' },
  { label: 'Verf.', title: 'Verfügbar', ariaLabel: 'Verfügbar' },
];

export type PGInventoryWarehouseBlock = {
  readonly id: string;
  readonly buildingLabel: string;
  readonly summaryRow: PGOperationsTableRow;
  readonly detailRows: readonly PGOperationsTableRow[];
};

/** Site inventory and warehouse storage for the operations dashboard. */
export function PGInventoryWidget({
  siteTitle = 'Inventar (Standort)',
  siteSubtitle = 'Material direkt an Produktionsgebäuden — bereit für sofortige Nutzung.',
  warehouseTitle = 'Lagerhaus',
  warehouseSubtitle = 'Marktkäufe landen hier. Transport bringt Material zum Produktionsstandort.',
  siteRows,
  warehouseBlocks,
  state = 'idle',
  errorMessage,
  siteEmptyTitle = 'Inventar erscheint nach Spielstart.',
  warehouseEmptyTitle = 'Kein Lagerhaus aktiv oder Lager leer.',
  warehouseEmptyHint = 'Kaufen Sie Ressourcen am Markt.',
  selectedWarehouseId,
  onWarehouseClick,
}: PGWidgetSurfaceProps & {
  readonly siteTitle?: string;
  readonly siteSubtitle?: string;
  readonly warehouseTitle?: string;
  readonly warehouseSubtitle?: string;
  readonly siteRows: readonly PGOperationsTableRow[];
  readonly warehouseBlocks: readonly PGInventoryWarehouseBlock[];
  readonly siteEmptyTitle?: string;
  readonly warehouseEmptyTitle?: string;
  readonly warehouseEmptyHint?: string;
  readonly selectedWarehouseId?: string | null;
  readonly onWarehouseClick?: (warehouseId: string) => void;
}) {
  const hasWarehouseData = warehouseBlocks.length > 0;

  return (
    <div className="pg-inventory-widget-grid">
      <section className="pg-widget pg-inventory-widget" aria-labelledby="pg-inventory-widget-title">
        <div className="pg-widget-header">
          <h3 id="pg-inventory-widget-title" className="pg-widget-title">
            {siteTitle}
          </h3>
        </div>
        <p className="pg-widget-subtitle">{siteSubtitle}</p>
        <PGWidgetSurface
          state={siteRows.length === 0 && state === 'idle' ? 'empty' : state}
          errorMessage={errorMessage}
          emptyTitle={siteEmptyTitle}
        >
          <PGOperationsTable
            columns={INVENTORY_RESOURCE_TABLE_COLUMNS}
            columnCount={3}
            rows={siteRows}
            searchable
            searchPlaceholder="Inventar suchen…"
            emptyTitle="Am Standort ist kein Material."
            emptyHint="Produzieren oder transportieren Sie Ressourcen zum Standort."
            ariaLabel="Standort-Inventar"
          />
        </PGWidgetSurface>
      </section>

      <section className="pg-widget pg-warehouse-widget" aria-labelledby="pg-warehouse-widget-title">
        <div className="pg-widget-header">
          <h3 id="pg-warehouse-widget-title" className="pg-widget-title">
            {warehouseTitle}
          </h3>
        </div>
        <p className="pg-widget-subtitle">{warehouseSubtitle}</p>
        <PGWidgetSurface
          state={!hasWarehouseData && state === 'idle' ? 'empty' : state}
          errorMessage={errorMessage}
          emptyTitle={warehouseEmptyTitle}
          emptyHint={warehouseEmptyHint}
        >
          {hasWarehouseData ? (
            <>
              <PGOperationsTable
                columns={['Lagerhaus', 'Zeilen', 'Einheiten']}
                columnCount={3}
                rows={warehouseBlocks.map((block) => block.summaryRow)}
                searchable
                searchPlaceholder="Lagerhäuser suchen…"
                selectedRowId={selectedWarehouseId}
                onRowClick={onWarehouseClick}
                emptyTitle="Kein Lagerhaus aktiv."
                emptyHint="Schalten Sie das Lagerhaus-Meilenstein frei und bauen Sie es."
                ariaLabel="Lagerhäuser"
              />
              {warehouseBlocks.map((block) => (
                <div key={block.id} className="pg-warehouse-block">
                  <h4 className="pg-warehouse-block-title">{block.buildingLabel}</h4>
                  <PGOperationsTable
                    columns={INVENTORY_RESOURCE_TABLE_COLUMNS}
                    columnCount={3}
                    rows={block.detailRows}
                    searchable
                    searchPlaceholder="Lager suchen…"
                    emptyTitle="Lager ist leer."
                    ariaLabel={`Lager ${block.buildingLabel}`}
                  />
                </div>
              ))}
            </>
          ) : null}
        </PGWidgetSurface>
      </section>
    </div>
  );
}
