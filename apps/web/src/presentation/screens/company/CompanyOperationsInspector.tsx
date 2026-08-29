'use client';

import { useMemo } from 'react';
import { resolveCompanyDetailInspector } from '@/presentation/adapters/mappers/company-detail-inspector-mappers';
import { mapOperationsMarketRows } from '@/presentation/adapters/mappers/company-operations-table-mappers';
import type {
  CompanyDetailViewData,
  MarketPriceChartViewData,
} from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { PGMarketWidget } from '@/presentation/components/dashboard';
import { PGInspectorPanel } from '@/presentation/components/layout';
import { Button } from '@/presentation/primitives/Button';
import type { DetailSelection } from '@/presentation/screens/company/company-detail-selection';

/** Operations dashboard inspector aligned with PGInspectorPanel (S19). */
export function CompanyOperationsInspector({
  detail,
  marketPrices,
  selection,
  onClearSelection,
  onSelectFinance,
  onSelectLogistics,
  onOpenProductionForBuilding,
  onSelectProductionJob,
}: {
  readonly detail: CompanyDetailViewData;
  readonly marketPrices: readonly MarketPriceChartViewData[];
  readonly selection: DetailSelection;
  readonly onClearSelection: () => void;
  readonly onSelectFinance: () => void;
  readonly onSelectLogistics: () => void;
  readonly onOpenProductionForBuilding?: (buildingId: string) => void;
  readonly onSelectProductionJob?: (jobId: string) => void;
}) {
  const inspector = useMemo(
    () => resolveCompanyDetailInspector(detail, marketPrices, selection),
    [detail, marketPrices, selection],
  );

  const sections = inspector.sections?.map((section) =>
    Object.freeze({
      ...section,
      onAction:
        section.id === 'finance'
          ? onSelectFinance
          : section.id === 'logistics'
            ? onSelectLogistics
            : undefined,
    }),
  );

  const marketRows =
    inspector.marketPrices !== undefined ? mapOperationsMarketRows(inspector.marketPrices) : [];

  const productionFooter =
    selection.kind === 'building' && onOpenProductionForBuilding !== undefined
      ? (
          <Button
            variant="secondary"
            onClick={() => {
              onOpenProductionForBuilding(selection.id);
            }}
          >
            Produktion öffnen
          </Button>
        )
      : undefined;

  return (
    <PGInspectorPanel
      title={inspector.title}
      subtitle={inspector.subtitle}
      entries={inspector.entries}
      sections={sections}
      relatedTitle={inspector.relatedTitle}
      relatedItems={inspector.relatedItems}
      onRelatedItemClick={
        onSelectProductionJob !== undefined
          ? (item) => {
              if (item.entityRef?.kind === 'production') {
                onSelectProductionJob(item.entityRef.id);
              }
            }
          : undefined
      }
      onClose={inspector.showClose ? onClearSelection : undefined}
      emptyTitle={selection.kind === 'overview' ? 'Keine aktive Session.' : 'Keine Auswahl'}
      emptyHint={
        selection.kind === 'overview'
          ? undefined
          : 'Wählen Sie ein Element aus, um Details anzuzeigen.'
      }
      footer={
        marketRows.length > 0 || productionFooter !== undefined
          ? (
              <>
                {productionFooter}
                {marketRows.length > 0 ? (
                  <PGMarketWidget title="Marktpreise" rows={marketRows} />
                ) : null}
              </>
            )
          : undefined
      }
    />
  );
}
