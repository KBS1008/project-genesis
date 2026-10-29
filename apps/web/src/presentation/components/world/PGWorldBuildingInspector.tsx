'use client';

import type { EntityDetailViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { PGInspectorPanel } from '@/presentation/components/layout';
import { Button } from '@/presentation/primitives/Button';

/** Read-only building detail inspector for the world map (Slice 2F-B). */
export function PGWorldBuildingInspector({
  detail,
  buildingId,
  onClose,
  onOpenProduction,
}: {
  readonly detail: EntityDetailViewData;
  readonly buildingId: string;
  readonly onClose: () => void;
  readonly onOpenProduction?: () => void;
}) {
  const entries = detail.entries.map(([label, value, valueClass]) =>
    Object.freeze({ label, value, valueClass }),
  );

  const relatedItems = detail.relatedItems?.map((item) =>
    Object.freeze({
      primary: item.primary,
      secondary: item.secondary,
      secondaryClass: item.secondaryClass,
      entityRef: item.entityRef,
    }),
  );

  return (
    <PGInspectorPanel
      title={detail.title}
      subtitle={detail.subtitle}
      entries={entries}
      relatedTitle={detail.relatedTitle}
      relatedItems={relatedItems}
      onClose={onClose}
      footer={
        onOpenProduction !== undefined ? (
          <Button type="button" variant="secondary" onClick={onOpenProduction}>
            Produktion öffnen
          </Button>
        ) : undefined
      }
      emptyTitle="Gebäude nicht gefunden"
      emptyHint={`Keine Detaildaten für ${buildingId}.`}
    />
  );
}
