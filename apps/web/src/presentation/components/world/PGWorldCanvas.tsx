'use client';

import { useMemo } from 'react';
import {
  worldBiomePatternId,
  worldBiomeSurfaceClass,
} from '@/presentation/formatting/world-biome-presentation';
import type {
  WorldBuildingMarkerViewData,
  WorldMapViewData,
  WorldOverlayViewData,
} from '@/presentation/adapters/view-data/world-view-data';
import { resolveScenicRegionLabelLayout } from '@/presentation/adapters/mappers/world-scenic-region-label-layout';
import type { ScenicPresentationContext } from '@/presentation/adapters/mappers/world-scenic-visual-projection';
import {
  listScenicRegionPresentationPoints,
  projectLogicalPointToScenicVisual,
  projectMarkerToScenicVisual,
  resolveScenicRegionAnchorWorld,
  resolveScenicRegionHitRadius,
} from '@/presentation/adapters/mappers/world-scenic-visual-projection';
import { buildWorldRoutePath } from '@/presentation/components/world/world-route-geometry';
import {
  isWorldTransportRouteActive,
  worldTransportRouteMidpoint,
} from '@/presentation/components/world/world-transport-route-presentation';
import { PGWorldBuildingMarker } from '@/presentation/components/world/PGWorldBuildingMarker';
import { filterBuildingMarkersForRegionFocus } from '@/presentation/hooks/world-map-view-mode';
import type { WorldBounds } from '@/presentation/hooks/world-camera-math';
import { resolveRegionGridWorldBounds } from '@/presentation/hooks/world-region-presentation-bounds';
import {
  resolveScenicRegionLabelInverseScale,
  shouldRenderScenicRegionLabel,
} from '@/presentation/components/world/world-scenic-region-label-scale';
import { resolveScenicBuildingMarkerPresentationScale } from '@/presentation/components/world/world-scenic-building-marker-scale';

function regionCenter(region: WorldMapViewData['regions'][number], cellSize: number) {
  return {
    x: region.mapX * cellSize + cellSize / 2,
    y: region.mapY * cellSize + cellSize / 2,
  };
}

function WorldBiomePatternDefs() {
  return (
    <defs aria-hidden="true">
      <pattern id="pg-world-biome-pattern-forest" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" className="pg-world-biome-pattern-base-forest" />
        <path d="M0 10 L12 2" className="pg-world-biome-pattern-line-forest" />
      </pattern>
      <pattern id="pg-world-biome-pattern-plains" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" className="pg-world-biome-pattern-base-plains" />
        <circle cx="3" cy="3" r="1" className="pg-world-biome-pattern-dot-plains" />
        <circle cx="8" cy="7" r="1" className="pg-world-biome-pattern-dot-plains" />
      </pattern>
      <pattern id="pg-world-biome-pattern-coastal" width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" className="pg-world-biome-pattern-base-coastal" />
        <path d="M0 8 Q7 4 14 10" className="pg-world-biome-pattern-wave-coastal" />
      </pattern>
      <pattern id="pg-world-biome-pattern-unknown" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" className="pg-world-biome-pattern-base-unknown" />
      </pattern>
      <filter id="pg-world-scenic-route-shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#3d2914" floodOpacity="0.28" />
      </filter>
    </defs>
  );
}

/** SVG world map with framework and operations overlay layers (Phase 4A/4B). */
export function PGWorldCanvas({
  map,
  overlays,
  selectedRegionId,
  layers,
  onSelectRegion,
  onSelectBuilding,
  selectedBuildingId = null,
  canvasWidth,
  canvasHeight,
  suppressMapEntitySelection = false,
  placementPreviewMarker = null,
  scenicPresentationContext = null,
  regionFocusRegionId = null,
  regionFocusBounds = null,
  viewportScale = 1,
}: {
  readonly map: WorldMapViewData;
  readonly overlays: WorldOverlayViewData;
  readonly selectedRegionId: string | null;
  readonly selectedBuildingId?: string | null;
  readonly layers: Readonly<Record<string, boolean>>;
  readonly onSelectRegion: (regionId: string) => void;
  readonly onSelectBuilding?: (buildingId: string) => void;
  readonly canvasWidth?: number;
  readonly canvasHeight?: number;
  readonly suppressMapEntitySelection?: boolean;
  readonly placementPreviewMarker?: WorldBuildingMarkerViewData | null;
  readonly scenicPresentationContext?: ScenicPresentationContext | null;
  /** When set, only this region's building markers are shown (presentation filter). */
  readonly regionFocusRegionId?: string | null;
  /** When region focus uses a cropped canvas, shift world coordinates into local SVG space. */
  readonly regionFocusBounds?: WorldBounds | null;
  /** Camera scale from the viewport transform; used to keep scenic labels at a bounded screen size. */
  readonly viewportScale?: number;
}) {
  const { cellSize, columns, rows, regions, connections } = map;
  const width = canvasWidth ?? columns * cellSize;
  const height = canvasHeight ?? rows * cellSize;
  const scenicActive = scenicPresentationContext !== null;
  const scenicLabelInverseScale = resolveScenicRegionLabelInverseScale(viewportScale);
  const scenicBuildingPresentationScale = scenicActive
    ? resolveScenicBuildingMarkerPresentationScale(viewportScale)
    : 1;

  const regionById = new Map(regions.map((region) => [region.id, region]));
  const scenicRegions = useMemo(() => {
    if (scenicPresentationContext === null) {
      return [];
    }

    return listScenicRegionPresentationPoints(regions, scenicPresentationContext);
  }, [regions, scenicPresentationContext]);

  const resolveConnectionCenter = (
    region: WorldMapViewData['regions'][number],
  ): { readonly x: number; readonly y: number } => {
    if (scenicPresentationContext === null) {
      return regionCenter(region, cellSize);
    }

    const anchor = resolveScenicRegionAnchorWorld(region.id, scenicPresentationContext);
    return anchor ?? regionCenter(region, cellSize);
  };
  const metricsByRegion = new Map(overlays.regionMetrics.map((metric) => [metric.regionId, metric]));
  const regionFocusActive = regionFocusRegionId !== null;
  const regionFocusLayerTransform =
    regionFocusActive && regionFocusBounds !== null
      ? `translate(${-regionFocusBounds.minX} ${-regionFocusBounds.minY})`
      : undefined;

  const buildingMarkers = useMemo(() => {
    const filtered = filterBuildingMarkersForRegionFocus(
      overlays.buildingMarkers,
      regionFocusActive ? 'region_focus' : 'overview',
      regionFocusRegionId,
    );
    const markers = [...filtered];

    if (selectedBuildingId !== null) {
      markers.sort((left, right) => {
        if (left.id === selectedBuildingId) {
          return 1;
        }

        if (right.id === selectedBuildingId) {
          return -1;
        }

        return 0;
      });
    }

    return markers;
  }, [overlays.buildingMarkers, regionFocusActive, regionFocusRegionId, selectedBuildingId]);

  const renderMarkerAt = (marker: WorldBuildingMarkerViewData) => {
    if (scenicPresentationContext === null) {
      return marker;
    }

    const visual = projectMarkerToScenicVisual(marker, regionById, scenicPresentationContext);
    return Object.freeze({ ...marker, x: visual.x, y: visual.y });
  };

  return (
    <svg
      className={`pg-world-canvas${scenicActive ? ' is-scenic-calibrated' : ''}`}
      width={width}
      height={height}
      role="img"
      aria-label="Interaktive Weltkarte"
    >
      <WorldBiomePatternDefs />

      <g className="pg-world-layer-root" transform={regionFocusLayerTransform}>
      {layers.grid && !regionFocusActive ? (
        <g className="pg-world-layer-grid" aria-hidden="true">
          {Array.from({ length: columns + 1 }, (_, index) => (
            <line
              key={`col-${index}`}
              x1={index * cellSize}
              y1={0}
              x2={index * cellSize}
              y2={height}
            />
          ))}
          {Array.from({ length: rows + 1 }, (_, index) => (
            <line
              key={`row-${index}`}
              x1={0}
              y1={index * cellSize}
              x2={width}
              y2={index * cellSize}
            />
          ))}
        </g>
      ) : null}

      {layers.resources && !regionFocusActive
        ? regions.map((region) => {
            const metric = metricsByRegion.get(region.id);
            const intensity = metric?.resourceIntensity ?? 0;
            if (intensity <= 0) {
              return null;
            }

            return (
              <rect
                key={`resource-${region.id}`}
                className="pg-world-resource-heat"
                x={region.mapX * cellSize + 4}
                y={region.mapY * cellSize + 4}
                width={cellSize - 8}
                height={cellSize - 8}
                rx={8}
                opacity={0.15 + intensity * 0.55}
                aria-hidden="true"
              />
            );
          })
        : null}

      {layers.connections && !regionFocusActive
        ? connections.map((connection) => {
            const from = regionById.get(connection.fromRegionId);
            const to = regionById.get(connection.toRegionId);
            if (from === undefined || to === undefined) {
              return null;
            }

            const fromCenter = resolveConnectionCenter(from);
            const toCenter = resolveConnectionCenter(to);
            const flow = overlays.transportFlows.find(
              (entry) =>
                entry.fromRegionId === connection.fromRegionId &&
                entry.toRegionId === connection.toRegionId,
            );
            const routeActive = isWorldTransportRouteActive(
              { connections: layers.connections, transport: layers.transport },
              flow,
            );
            const strokeWidth = scenicActive
              ? routeActive
                ? 1.35 + (flow?.intensity ?? 0) * 2.75
                : 1.15
              : routeActive
                ? 2.25 + (flow?.intensity ?? 0) * 3.5
                : 1.75;
            const connectionKey = `${connection.fromRegionId}-${connection.toRegionId}`;
            const routePath = buildWorldRoutePath(
              fromCenter.x,
              fromCenter.y,
              toCenter.x,
              toCenter.y,
              connectionKey,
            );
            const midpoint = worldTransportRouteMidpoint(fromCenter, toCenter);
            const endpointRadius = scenicActive ? 3.5 : 4.5;

            return (
              <g
                key={connectionKey}
                className={`pg-world-route-group${routeActive ? ' is-active' : ''}`}
                aria-hidden="true"
                filter={routeActive && scenicActive ? 'url(#pg-world-scenic-route-shadow)' : undefined}
              >
                <path
                  className={`pg-world-route${routeActive ? ' pg-world-route-active' : ''}`}
                  d={routePath}
                  fill="none"
                  strokeWidth={strokeWidth}
                />
                {routeActive ? (
                  <>
                    <circle
                      className="pg-world-route-endpoint pg-world-route-endpoint--origin"
                      cx={fromCenter.x}
                      cy={fromCenter.y}
                      r={endpointRadius}
                    />
                    <circle
                      className="pg-world-route-endpoint pg-world-route-endpoint--destination"
                      cx={toCenter.x}
                      cy={toCenter.y}
                      r={endpointRadius}
                    />
                    <circle
                      className="pg-world-route-flow-indicator"
                      cx={midpoint.x}
                      cy={midpoint.y}
                      r={scenicActive ? 2.5 : 3}
                    />
                  </>
                ) : null}
              </g>
            );
          })
        : null}

      {layers.regions && scenicActive && !regionFocusActive
        ? scenicRegions.map((entry) => {
            const region = regionById.get(entry.regionId);
            if (region === undefined) {
              return null;
            }

            const isSelected = selectedRegionId === region.id;
            const isDimmed = false;

            return (
              <g
                key={`scenic-region-${region.id}`}
                className={`pg-world-scenic-region pg-world-scenic-region--${region.biomeCategory.toLowerCase()}${isSelected ? ' is-selected' : ''}${isDimmed ? ' is-region-focus-dimmed' : ''}`}
              >
                <circle
                  className={`pg-world-scenic-region-hit${isSelected ? ' is-selected' : ''}`}
                  cx={entry.anchor.x}
                  cy={entry.anchor.y}
                  r={entry.hitRadius}
                  fill="transparent"
                  role="button"
                  tabIndex={0}
                  data-region-id={region.id}
                  focusable="true"
                  aria-label={`Region ${region.name}, ${region.biomeLabel}`}
                  aria-pressed={isSelected}
                  onPointerDown={
                    suppressMapEntitySelection
                      ? undefined
                      : (event) => {
                          event.stopPropagation();
                        }
                  }
                  onClick={
                    suppressMapEntitySelection
                      ? undefined
                      : () => {
                          onSelectRegion(region.id);
                        }
                  }
                  onKeyDown={
                    suppressMapEntitySelection
                      ? undefined
                      : (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            onSelectRegion(region.id);
                          }
                        }
                  }
                />
              </g>
            );
          })
        : null}

      {layers.regions && (scenicActive === false || regionFocusActive)
        ? regions
            .filter((region) => !regionFocusActive || region.id === regionFocusRegionId)
            .map((region) => {
            const isSelected = selectedRegionId === region.id;
            const isDimmed = false;
            const surfaceClass = worldBiomeSurfaceClass(region.biomeCategory);
            const patternId = worldBiomePatternId(region.biomeCategory);
            const focusPresentationBounds =
              regionFocusActive && region.id === regionFocusRegionId
                ? resolveRegionGridWorldBounds(region, cellSize, 24)
                : null;
            const rectX =
              focusPresentationBounds !== null
                ? focusPresentationBounds.minX + 4
                : region.mapX * cellSize + 4;
            const rectY =
              focusPresentationBounds !== null
                ? focusPresentationBounds.minY + 4
                : region.mapY * cellSize + 4;
            const rectWidth =
              focusPresentationBounds !== null
                ? focusPresentationBounds.maxX - focusPresentationBounds.minX - 8
                : cellSize - 8;
            const rectHeight =
              focusPresentationBounds !== null
                ? focusPresentationBounds.maxY - focusPresentationBounds.minY - 8
                : cellSize - 8;

            return (
              <rect
                key={region.id}
                className={`pg-world-region ${surfaceClass}${isSelected ? ' is-selected' : ''}${isDimmed ? ' is-region-focus-dimmed' : ''}`}
                x={rectX}
                y={rectY}
                width={rectWidth}
                height={rectHeight}
                rx={10}
                fill={`url(#${patternId})`}
                role="button"
                tabIndex={0}
                aria-label={`Region ${region.name}, ${region.biomeLabel}`}
                aria-pressed={isSelected}
                onPointerDown={
                  suppressMapEntitySelection || regionFocusActive
                    ? undefined
                    : (event) => {
                        event.stopPropagation();
                      }
                }
                onClick={
                  suppressMapEntitySelection
                    ? undefined
                    : () => {
                        onSelectRegion(region.id);
                      }
                }
                onKeyDown={
                  suppressMapEntitySelection
                    ? undefined
                    : (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          onSelectRegion(region.id);
                        }
                      }
                }
              />
            );
          })
        : null}

      {layers.buildings
        ? buildingMarkers.map((marker) => (
            <PGWorldBuildingMarker
              key={marker.id}
              marker={renderMarkerAt(marker)}
              isSelected={selectedBuildingId === marker.id}
              onSelect={suppressMapEntitySelection ? undefined : onSelectBuilding}
              scenicPresentationScale={scenicActive ? scenicBuildingPresentationScale : undefined}
              scenicGroundingPresentation={scenicActive}
            />
          ))
        : null}

      {placementPreviewMarker !== null ? (
        <PGWorldBuildingMarker
          marker={renderMarkerAt(placementPreviewMarker)}
          isSelected={false}
          isPreview
          scenicPresentationScale={scenicActive ? scenicBuildingPresentationScale : undefined}
          scenicGroundingPresentation={scenicActive}
        />
      ) : null}

      {layers.labels && scenicActive && !regionFocusActive ? (
        <g className="pg-world-layer-scenic-labels" aria-hidden="true">
          {scenicRegions.map((entry) => {
            const region = regionById.get(entry.regionId);
            if (region === undefined || scenicPresentationContext === null) {
              return null;
            }

            const isSelected = selectedRegionId === region.id;
            const labelLayout = resolveScenicRegionLabelLayout(
              region.id,
              entry.anchor,
              scenicPresentationContext.layout,
              { title: region.name, subtitle: region.biomeLabel },
            );

            if (!shouldRenderScenicRegionLabel(isSelected, viewportScale, true)) {
              return null;
            }

            const labelScale = isSelected ? scenicLabelInverseScale * 1.08 : scenicLabelInverseScale;

            return (
              <g
                key={`scenic-label-${region.id}`}
                className={`pg-world-scenic-region${isSelected ? ' is-selected' : ''}`}
              >
                <g
                  className="pg-world-scenic-region-label-group"
                  transform={`translate(${labelLayout.titleX} ${labelLayout.titleY}) scale(${labelScale}) translate(${-labelLayout.titleX} ${-labelLayout.titleY})`}
                >
                  <text
                    className="pg-world-scenic-region-label"
                    x={labelLayout.titleX}
                    y={labelLayout.titleY}
                    textAnchor={labelLayout.textAnchor}
                  >
                    {region.name}
                  </text>
                  {isSelected ? (
                    <text
                      className="pg-world-scenic-region-label-sub"
                      x={labelLayout.subtitleX}
                      y={labelLayout.subtitleY}
                      textAnchor={labelLayout.textAnchor}
                    >
                      {region.biomeLabel}
                    </text>
                  ) : null}
                </g>
              </g>
            );
          })}
        </g>
      ) : null}

      {layers.presence
        ? regions
            .filter((region) => !regionFocusActive || region.id === regionFocusRegionId)
            .map((region) => {
            const metric = metricsByRegion.get(region.id);
            if (metric === undefined || metric.buildingCount === 0) {
              return null;
            }

            const presencePoint =
              scenicPresentationContext !== null
                ? projectLogicalPointToScenicVisual(
                    Object.freeze({
                      x: region.mapX * cellSize + 14,
                      y: region.mapY * cellSize + 14,
                    }),
                    region,
                    scenicPresentationContext,
                  )
                : Object.freeze({
                    x: region.mapX * cellSize + 14,
                    y: region.mapY * cellSize + 14,
                  });

            return (
              <g key={`presence-${region.id}`} aria-hidden="true">
                <circle
                  className="pg-world-presence-badge"
                  cx={presencePoint.x}
                  cy={presencePoint.y}
                  r={8}
                />
                <text
                  className="pg-world-presence-label"
                  x={presencePoint.x}
                  y={presencePoint.y + 3}
                  textAnchor="middle"
                >
                  {metric.buildingCount}
                </text>
              </g>
            );
          })
        : null}

      {layers.selection && selectedRegionId !== null && !regionFocusActive
        ? (() => {
            const region = regionById.get(selectedRegionId);
            if (region === undefined) {
              return null;
            }

            if (scenicPresentationContext !== null) {
              const anchor = resolveScenicRegionAnchorWorld(
                selectedRegionId,
                scenicPresentationContext,
              );
              const radius = resolveScenicRegionHitRadius(scenicPresentationContext) + 6;
              if (anchor === null) {
                return null;
              }

              return (
                <circle
                  className="pg-world-scenic-selection-ring"
                  cx={anchor.x}
                  cy={anchor.y}
                  r={radius}
                  aria-hidden="true"
                />
              );
            }

            return (
              <rect
                className="pg-world-selection-ring"
                x={region.mapX * cellSize + 2}
                y={region.mapY * cellSize + 2}
                width={cellSize - 4}
                height={cellSize - 4}
                rx={12}
                aria-hidden="true"
              />
            );
          })()
        : null}

      {layers.labels && !scenicActive
        ? regions.map((region) => (
            <g key={`label-${region.id}`} aria-hidden="true">
              <text
                className="pg-world-label"
                x={region.mapX * cellSize + cellSize / 2}
                y={region.mapY * cellSize + cellSize / 2 - 20}
                textAnchor="middle"
              >
                {region.name}
              </text>
              <text
                className="pg-world-label-sub"
                x={region.mapX * cellSize + cellSize / 2}
                y={region.mapY * cellSize + cellSize / 2 - 8}
                textAnchor="middle"
              >
                {region.biomeLabel}
              </text>
            </g>
          ))
        : null}
      </g>
    </svg>
  );
}
