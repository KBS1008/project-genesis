'use client';

import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import { Card } from '@/presentation/primitives/Card';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { LoadingState } from '@/presentation/primitives/LoadingState';
import { fetchRegionDetails } from '@/presentation/adapters/api/query-client';
import { mapRegionDetailViewData } from '@/presentation/adapters/mappers/workspace-view-mappers';
import type { RegionDetailViewData } from '@/presentation/adapters/view-data/workspace-view-data';
import { useEffect, useState } from 'react';

/** World overview screen backed by query adapters. */
export function WorldScreen() {
  const { viewData, navigation, selectEntity } = useGameWorkspace();
  const [regionDetail, setRegionDetail] = useState<RegionDetailViewData | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    if (navigation.entitySelection.kind !== 'region') {
      setRegionDetail(null);
      return;
    }

    let active = true;
    setIsLoadingDetail(true);

    void fetchRegionDetails(navigation.entitySelection.id)
      .then((dto) => {
        if (active) {
          setRegionDetail(mapRegionDetailViewData(dto));
        }
      })
      .finally(() => {
        if (active) {
          setIsLoadingDetail(false);
        }
      });

    return () => {
      active = false;
    };
  }, [navigation.entitySelection]);

  if (viewData.world === null) {
    return <EmptyState title="Welt konnte nicht geladen werden." />;
  }

  return (
    <div className="pg-screen-placeholder">
      <Card title={viewData.world.worldName}>
        <p className="pg-workspace-subtitle">
          {viewData.world.regionCountLabel} Regionen · {viewData.world.cityCountLabel} Städte
        </p>
        <div className="pg-query-table">
          {viewData.world.regions.map((region) => (
            <button
              key={region.id}
              type="button"
              className="pg-query-row"
              aria-current={
                navigation.entitySelection.kind === 'region' &&
                navigation.entitySelection.id === region.id
                  ? 'true'
                  : undefined
              }
              onClick={() => {
                selectEntity({ kind: 'region', id: region.id });
              }}
            >
              <strong>{region.name}</strong>
              <span>{region.biomeId}</span>
              <span>{region.mapPositionLabel}</span>
              <span>{region.cityCount} Städte</span>
            </button>
          ))}
        </div>
      </Card>

      {navigation.entitySelection.kind === 'region' ? (
        <Card title="Regionsdetails">
          {isLoadingDetail ? (
            <LoadingState label="Region wird geladen…" />
          ) : regionDetail === null ? (
            <EmptyState title="Region nicht gefunden." hint="Die Auswahl wurde zurückgesetzt." />
          ) : (
            <>
              <p>{regionDetail.description}</p>
              <p className="pg-workspace-subtitle">Biom: {regionDetail.biomeId}</p>
              <h3 className="pg-card-title">Ressourcen</h3>
              <ul>
                {regionDetail.resources.map((resource) => (
                  <li key={resource.label}>
                    {resource.label}: {resource.amountLabel}
                  </li>
                ))}
              </ul>
              <h3 className="pg-card-title">Städte</h3>
              <ul>
                {regionDetail.cities.map((city) => (
                  <li key={city.id}>
                    {city.name} ({city.category})
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      ) : null}
    </div>
  );
}
