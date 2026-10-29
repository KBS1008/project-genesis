'use client';

import type { RefObject } from 'react';
import type { ScenicPresentationContext } from '@/presentation/adapters/mappers/world-scenic-visual-projection';
import {
  resolveScenicPlateWorldBounds,
  resolveScenicRegionAnchorWorld,
} from '@/presentation/adapters/mappers/world-scenic-visual-projection';
import { worldBiomeMinimapClass } from '@/presentation/formatting/world-biome-presentation';
import type { WorldMapViewData } from '@/presentation/adapters/view-data/world-view-data';
import type { WorldCameraState, WorldBounds } from '@/presentation/hooks/world-camera-math';
import { resolveWorldBounds } from '@/presentation/hooks/world-camera-math';
import { buildWorldRoutePath } from '@/presentation/components/world/world-route-geometry';

function resolveMinimapBounds(
  map: WorldMapViewData,
  scenicPresentationContext: ScenicPresentationContext | null,
): WorldBounds {
  if (scenicPresentationContext !== null) {
    return resolveScenicPlateWorldBounds(scenicPresentationContext.layout);
  }

  return resolveWorldBounds(map.regions, map.cellSize);
}

function regionCenterInMinimap(
  region: WorldMapViewData['regions'][number],
  map: WorldMapViewData,
  bounds: WorldBounds,
  scale: number,
  scenicPresentationContext: ScenicPresentationContext | null,
) {
  if (scenicPresentationContext !== null) {
    const anchor = resolveScenicRegionAnchorWorld(region.id, scenicPresentationContext);
    if (anchor !== null) {
      return Object.freeze({
        x: (anchor.x - bounds.minX) * scale,
        y: (anchor.y - bounds.minY) * scale,
      });
    }
  }

  const x = region.mapX * map.cellSize - bounds.minX;
  const y = region.mapY * map.cellSize - bounds.minY;

  return Object.freeze({
    x: (x + map.cellSize / 2) * scale,
    y: (y + map.cellSize / 2) * scale,
  });
}

/** Compact minimap with viewport indicator. */
export function PGMiniMap({
  map,
  selectedRegionId,
  camera,
  viewportRef,
  scenicPresentationContext = null,
  regionFocusRegionId = null,
}: {
  readonly map: WorldMapViewData;
  readonly selectedRegionId: string | null;
  readonly camera: WorldCameraState;
  readonly viewportRef: RefObject<HTMLDivElement | null>;
  readonly scenicPresentationContext?: ScenicPresentationContext | null;
  readonly regionFocusRegionId?: string | null;
}) {
  const scenicActive = scenicPresentationContext !== null;
  const bounds = resolveMinimapBounds(map, scenicPresentationContext);
  const mapWidth = bounds.maxX - bounds.minX;
  const mapHeight = bounds.maxY - bounds.minY;
  /** Compact overview (Slice 5): smaller than main map, within spec guidance ~120–160px width. */
  const miniWidth = 148;
  const miniHeight = 100;
  const scale = Math.min(miniWidth / mapWidth, miniHeight / mapHeight);

  const viewportElement = viewportRef.current;
  const viewportWidth = viewportElement?.clientWidth ?? miniWidth;
  const viewportHeight = viewportElement?.clientHeight ?? miniHeight;

  const viewX = (-camera.translateX / camera.scale - bounds.minX) * scale;
  const viewY = (-camera.translateY / camera.scale - bounds.minY) * scale;
  const viewW = (viewportWidth / camera.scale) * scale;
  const viewH = (viewportHeight / camera.scale) * scale;

  const regionById = new Map(map.regions.map((region) => [region.id, region]));
  const plateUrl = scenicActive ? scenicPresentationContext.profile.plateAssetUrl : null;

  return (
    <div
      className={`pg-world-minimap${scenicActive ? ' is-scenic' : ''}${regionFocusRegionId !== null ? ' is-region-context' : ''}`}
    >
      <p className="pg-world-minimap-title">
        {regionFocusRegionId !== null ? 'Welt (Region aktiv)' : 'Übersicht'}
      </p>
      <svg
        className={`pg-world-minimap-svg${scenicActive ? ' is-scenic' : ''}`}
        viewBox={`0 0 ${miniWidth} ${miniHeight}`}
        role="img"
        aria-label="Minikarte der Welt"
        data-scenic-minimap={scenicActive ? '1' : '0'}
      >
        <defs>
          <clipPath id="pg-world-minimap-clip">
            <rect x={0} y={0} width={miniWidth} height={miniHeight} rx={4} />
          </clipPath>
        </defs>
        <g clipPath="url(#pg-world-minimap-clip)">
          {plateUrl !== null ? (
            <image
              className="pg-world-minimap-scenic-plate"
              href={plateUrl}
              x={0}
              y={0}
              width={miniWidth}
              height={miniHeight}
              preserveAspectRatio="xMidYMid slice"
            />
          ) : null}

          {!scenicActive
            ? map.connections.map((connection) => {
                const from = regionById.get(connection.fromRegionId);
                const to = regionById.get(connection.toRegionId);
                if (from === undefined || to === undefined) {
                  return null;
                }

                const fromCenter = regionCenterInMinimap(
                  from,
                  map,
                  bounds,
                  scale,
                  scenicPresentationContext,
                );
                const toCenter = regionCenterInMinimap(
                  to,
                  map,
                  bounds,
                  scale,
                  scenicPresentationContext,
                );
                const connectionKey = `${connection.fromRegionId}-${connection.toRegionId}`;

                return (
                  <path
                    key={`mini-${connectionKey}`}
                    className="pg-world-minimap-route"
                    d={buildWorldRoutePath(
                      fromCenter.x,
                      fromCenter.y,
                      toCenter.x,
                      toCenter.y,
                      connectionKey,
                    )}
                    fill="none"
                    aria-hidden="true"
                  />
                );
              })
            : null}

          {map.regions.map((region) => {
            const surfaceClass = worldBiomeMinimapClass(region.biomeCategory);
            const selected = selectedRegionId === region.id;

            if (scenicActive) {
              const center = regionCenterInMinimap(
                region,
                map,
                bounds,
                scale,
                scenicPresentationContext,
              );
              const radius = Math.max(2.25, map.cellSize * scale * 0.085);

              return (
                <circle
                  key={region.id}
                  className={`pg-world-minimap-region pg-world-minimap-region-scenic ${surfaceClass}${selected ? ' is-selected' : ''}`}
                  cx={center.x}
                  cy={center.y}
                  r={radius}
                  data-region-id={region.id}
                />
              );
            }

            const x = (region.mapX * map.cellSize - bounds.minX) * scale;
            const y = (region.mapY * map.cellSize - bounds.minY) * scale;
            const size = map.cellSize * scale;

            return (
              <rect
                key={region.id}
                className={`pg-world-minimap-region ${surfaceClass}${selected ? ' is-selected' : ''}`}
                x={x}
                y={y}
                width={size}
                height={size}
                rx={2}
                data-region-id={region.id}
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
        </g>
      </svg>
    </div>
  );
}
