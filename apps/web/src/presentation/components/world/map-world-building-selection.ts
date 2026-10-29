import type { EntityDetailViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type { WorldBuildingMarkerViewData } from '@/presentation/adapters/view-data/world-view-data';

/** Merges company building detail with map marker coordinates for the world inspector. */
export function buildWorldMapBuildingInspectorDetail(
  buildingId: string,
  detail: EntityDetailViewData | undefined,
  marker: WorldBuildingMarkerViewData | undefined,
  regionName: string | null,
): EntityDetailViewData | null {
  if (detail === undefined && marker === undefined) {
    return null;
  }

  const baseEntries = detail?.entries ?? [];
  const markerMapEntries: Array<readonly [string, string]> =
    marker !== undefined
      ? [
          ['Region', regionName ?? marker.regionId],
          ['Region-ID', marker.regionId],
          ['Position (Karte)', `${marker.domainX}, ${marker.domainY}`],
        ]
      : [];
  const mapEntries: Array<readonly [string, string]> = [
    ['Gebäude-ID', buildingId],
    ...markerMapEntries,
  ];

  const seen = new Set(baseEntries.map(([label]) => label));
  const mergedEntries = [
    ...baseEntries,
    ...mapEntries.filter(([label]) => !seen.has(label)),
  ] as EntityDetailViewData['entries'];

  return Object.freeze({
    title: detail?.title ?? marker?.label ?? buildingId,
    subtitle: detail?.subtitle ?? marker?.statusLabel ?? '',
    entries: mergedEntries,
    relatedItems: detail?.relatedItems,
    relatedTitle: detail?.relatedTitle,
  });
}
