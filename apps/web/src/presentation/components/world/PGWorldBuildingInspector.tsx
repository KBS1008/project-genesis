'use client';

import type { EntityDetailViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { PGInspectorPanel } from '@/presentation/components/layout';
import type { WorldBuildingInspectorNavigationViewData } from '@/presentation/components/world/world-building-inspector-navigation';
import type { WorldBuildingInspectorProductionViewData } from '@/presentation/components/world/world-building-inspector-production';
import { Button } from '@/presentation/primitives/Button';
import { ProductionProgressCell } from '@/presentation/screens/production/ProductionProgressCell';

/** Building detail inspector for the world map with production loop bridge (GCL-S1). */
export function PGWorldBuildingInspector({
  detail,
  buildingId,
  production,
  navigation,
  onClose,
  onOpenBuilding,
  onOpenProduction,
  onManageWorkforce,
}: {
  readonly detail: EntityDetailViewData;
  readonly buildingId: string;
  readonly production?: WorldBuildingInspectorProductionViewData | null;
  readonly navigation: WorldBuildingInspectorNavigationViewData;
  readonly onClose: () => void;
  readonly onOpenBuilding?: () => void;
  readonly onOpenProduction?: () => void;
  readonly onManageWorkforce?: () => void;
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

  const productionSection =
    production === undefined || production === null
      ? undefined
      : Object.freeze({
          id: 'production',
          title: 'Produktion',
          entries: Object.freeze([
            Object.freeze({ label: 'Status', value: production.headline }),
            ...(production.productLabel !== null
              ? [Object.freeze({ label: 'Produkt', value: production.productLabel })]
              : []),
            ...(production.progressLabel !== null
              ? [Object.freeze({ label: 'Fortschritt', value: production.progressLabel })]
              : []),
            ...(production.stallDetail !== null
              ? [Object.freeze({ label: 'Hinweis', value: production.stallDetail })]
              : []),
          ]),
        });

  const showOpenBuilding =
    navigation.showOpenBuilding && onOpenBuilding !== undefined;
  const showOpenProduction =
    navigation.showOpenProduction && onOpenProduction !== undefined;
  const showManageWorkforce =
    navigation.showManageWorkforce && onManageWorkforce !== undefined;

  const showProgress =
    production !== undefined &&
    production !== null &&
    production.progressPercent !== null &&
    production.progressLabel !== null;

  const hasNavigation = showOpenBuilding || showOpenProduction || showManageWorkforce;

  const identityActions = hasNavigation ? (
    <div className="pg-inspector-footer-actions">
      {showOpenBuilding ? (
        <Button type="button" variant="secondary" onClick={onOpenBuilding}>
          Gebäude öffnen
        </Button>
      ) : null}
      {showOpenProduction ? (
        <Button type="button" variant="secondary" onClick={onOpenProduction}>
          Produktion öffnen
        </Button>
      ) : null}
      {showManageWorkforce ? (
        <Button type="button" variant="secondary" onClick={onManageWorkforce}>
          Personal verwalten
        </Button>
      ) : null}
    </div>
  ) : undefined;

  const footer = showProgress ? (
    <ProductionProgressCell
      percent={production!.progressPercent!}
      label={production!.progressLabel!}
    />
  ) : undefined;

  return (
    <PGInspectorPanel
      title={detail.title}
      subtitle={detail.subtitle}
      entries={entries}
      sections={productionSection !== undefined ? [productionSection] : undefined}
      relatedTitle={detail.relatedTitle}
      relatedItems={relatedItems}
      onClose={onClose}
      identityActions={identityActions}
      scrollResetKey={buildingId}
      footer={footer}
      emptyTitle="Gebäude nicht gefunden"
      emptyHint={`Keine Detaildaten für ${buildingId}.`}
    />
  );
}
