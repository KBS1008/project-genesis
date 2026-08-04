'use client';

import type { RefObject } from 'react';
import type { WorldMapViewData } from '@/presentation/adapters/view-data/world-view-data';
import type { WorldCameraState } from '@/presentation/hooks/world-camera-math';
import { resolveWorldBounds } from '@/presentation/hooks/world-camera-math';

/** Compact minimap with viewport indicator. */
export function PGMiniMap({
  map,
  selectedRegionId,
  camera,
  viewportRef,
}: {
  readonly map: WorldMapViewData;
  readonly selectedRegionId: string | null;
  readonly camera: WorldCameraState;
  readonly viewportRef: RefObject<HTMLDivElement | null>;
}) {
  const bounds = resolveWorldBounds(map.regions, map.cellSize);
  const mapWidth = bounds.maxX - bounds.minX;
  const mapHeight = bounds.maxY - bounds.minY;
  const miniWidth = 160;
  const miniHeight = 120;
  const scale = Math.min(miniWidth / mapWidth, miniHeight / mapHeight);

  const viewportElement = viewportRef.current;
  const viewportWidth = viewportElement?.clientWidth ?? miniWidth;
  const viewportHeight = viewportElement?.clientHeight ?? miniHeight;

  const viewX = (-camera.translateX / camera.scale) * scale;
  const viewY = (-camera.translateY / camera.scale) * scale;
  const viewW = (viewportWidth / camera.scale) * scale;
  const viewH = (viewportHeight / camera.scale) * scale;

  return (
    <div className="pg-world-minimap">
      <p className="pg-world-minimap-title">Minikarte</p>
      <svg
        className="pg-world-minimap-svg"
        viewBox={`0 0 ${miniWidth} ${miniHeight}`}
        role="img"
        aria-label="Minikarte der Welt"
      >
        {map.regions.map((region) => {
          const x = (region.mapX * map.cellSize - bounds.minX) * scale;
          const y = (region.mapY * map.cellSize - bounds.minY) * scale;
          const size = map.cellSize * scale;

          return (
            <rect
              key={region.id}
              className={`pg-world-minimap-region${selectedRegionId === region.id ? ' is-selected' : ''}`}
              x={x}
              y={y}
              width={size}
              height={size}
              rx={2}
            />
          );
        })}
        <rect
          className="pg-world-minimap-viewport"
          x={viewX}
          y={viewY}
          width={viewW}
          height={viewH}
          aria-hidden="true"
        />
      </svg>
    </div>
  );
}
