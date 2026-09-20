'use client';

import { useState, type KeyboardEvent, type MouseEvent } from 'react';
import type { WorldBuildingMarkerViewData } from '@/presentation/adapters/view-data/world-view-data';
import {
  resolveWorldBuildingMarkerCompactUrl,
  resolveWorldBuildingMarkerVisualSpec,
} from '@/presentation/components/world/world-building-marker-visual';

type PGWorldBuildingMarkerProps = {
  readonly marker: WorldBuildingMarkerViewData;
  readonly isSelected: boolean;
  readonly onSelect?: (buildingId: string) => void;
};

/** World map building marker using sealed ICON-003 compact assets (WBM-001). */
export function PGWorldBuildingMarker({ marker, isSelected, onSelect }: PGWorldBuildingMarkerProps) {
  const spec = resolveWorldBuildingMarkerVisualSpec(marker.buildingTypeId, marker.clusterSize);
  const [imageFailed, setImageFailed] = useState(false);
  const compactUrl = imageFailed ? null : resolveWorldBuildingMarkerCompactUrl(marker.buildingTypeId);
  const displayScale = isSelected ? spec.selectedScale : 1;
  const hitSize = spec.hitSize * displayScale;
  const halfHit = hitSize / 2;
  const glyphWidth = spec.width * displayScale;
  const glyphHeight = spec.height * displayScale;
  const imageX = halfHit - glyphWidth / 2;
  const imageY = halfHit - glyphHeight / 2;
  const silhouetteRadius = (Math.max(glyphWidth, glyphHeight) / 2) * 0.92;
  const selectionRingRadius = silhouetteRadius + (isSelected ? 6 : 0);

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
    <g
      className={`pg-world-building-marker${isSelected ? ' is-selected' : ''}`}
      transform={`translate(${marker.x - halfHit} ${marker.y - halfHit})`}
      role="button"
      tabIndex={0}
      aria-label={`Gebäude ${marker.label}`}
      data-building-type-id={marker.buildingTypeId}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <rect
        className="pg-world-building-marker-hit"
        width={hitSize}
        height={hitSize}
        x={0}
        y={0}
        fill="transparent"
      />
      {compactUrl !== null ? (
        <>
          <ellipse
            className="pg-world-building-marker-shadow"
            cx={halfHit}
            cy={halfHit + silhouetteRadius * 0.45}
            rx={silhouetteRadius * 0.9}
            ry={silhouetteRadius * 0.28}
            aria-hidden="true"
          />
          <circle
            className="pg-world-building-marker-ground"
            cx={halfHit}
            cy={halfHit}
            r={silhouetteRadius}
            aria-hidden="true"
          />
          <image
            className="pg-world-building-marker-glyph"
            href={compactUrl}
            x={imageX}
            y={imageY}
            width={glyphWidth}
            height={glyphHeight}
            onError={() => {
              setImageFailed(true);
            }}
          />
        </>
      ) : (
        <circle
          className="pg-world-building-marker-fallback"
          cx={halfHit}
          cy={halfHit}
          r={6}
        />
      )}
      {isSelected ? (
        <circle
          className="pg-world-building-marker-selection-ring"
          cx={halfHit}
          cy={halfHit}
          r={selectionRingRadius}
          aria-hidden="true"
        />
      ) : null}
    </g>
  );
}
