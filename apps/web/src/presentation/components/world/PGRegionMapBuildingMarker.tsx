'use client';

import { useState, type KeyboardEvent, type MouseEvent } from 'react';
import type { WorldBuildingMarkerViewData } from '@/presentation/adapters/view-data/world-view-data';
import { resolveWorldRegionBuildingVisualSpec } from '@/presentation/config/world-region-building-visual';

export const REGION_MAP_MARKER_GLYPH_PX = 28;
export const REGION_MAP_MARKER_HIT_PX = 44;

type PGRegionMapBuildingMarkerProps = {
  readonly marker: WorldBuildingMarkerViewData;
  readonly isSelected: boolean;
  readonly leftPx: number;
  readonly topPx: number;
  readonly onSelect?: (buildingId: string) => void;
};

/** Compact building marker for dedicated regional landscape maps (Slice 2A). */
export function PGRegionMapBuildingMarker({
  marker,
  isSelected,
  leftPx,
  topPx,
  onSelect,
}: PGRegionMapBuildingMarkerProps) {
  const spec = resolveWorldRegionBuildingVisualSpec(marker.buildingTypeId);
  const [imageFailed, setImageFailed] = useState(false);
  const artworkUrl = imageFailed ? null : spec.assetUrl;
  const underConstruction = marker.statusLabel.toUpperCase().includes('CONSTRUCTION');

  const activate = () => {
    onSelect?.(marker.id);
  };

  const onClick = (event: MouseEvent) => {
    event.stopPropagation();
    activate();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      activate();
    }
  };

  return (
    <button
      type="button"
      className={`pg-world-region-map-building-marker${isSelected ? ' is-selected' : ''}${underConstruction ? ' is-under-construction' : ''}`}
      style={{
        left: `${leftPx}px`,
        top: `${topPx}px`,
        width: spec.hitWidthPx,
        height: spec.hitHeightPx,
        transform: `translate(calc(${spec.anchorX} * -100%), calc(${spec.anchorY} * -100%))`,
        ['--pg-region-building-display-w' as string]: `${spec.displayWidthPx}px`,
        ['--pg-region-building-display-h' as string]: `${spec.displayHeightPx}px`,
      }}
      aria-label={`Gebäude ${marker.label}`}
      data-building-id={marker.id}
      data-building-type-id={marker.buildingTypeId}
      data-building-status={marker.statusLabel}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {artworkUrl !== null ? (
        <img
          className="pg-world-region-map-building-marker-artwork"
          src={artworkUrl}
          alt=""
          width={spec.displayWidthPx}
          height={spec.displayHeightPx}
          style={{
            width: 'var(--pg-region-building-display-w)',
            height: 'auto',
            maxHeight: 'var(--pg-region-building-display-h)',
          }}
          draggable={false}
          onError={() => {
            setImageFailed(true);
          }}
        />
      ) : (
        <span className="pg-world-region-map-building-marker-fallback" aria-hidden="true" />
      )}
    </button>
  );
}
