'use client';

import type {
  WorldMapViewData,
  WorldOverlayViewData,
} from '@/presentation/adapters/view-data/world-view-data';

function regionCenter(region: WorldMapViewData['regions'][number], cellSize: number) {
  return {
    x: region.mapX * cellSize + cellSize / 2,
    y: region.mapY * cellSize + cellSize / 2,
  };
}

/** SVG world map with framework and operations overlay layers (Phase 4A/4B). */
export function PGWorldCanvas({
  map,
  overlays,
  selectedRegionId,
  layers,
  onSelectRegion,
  onSelectBuilding,
}: {
  readonly map: WorldMapViewData;
  readonly overlays: WorldOverlayViewData;
  readonly selectedRegionId: string | null;
  readonly layers: Readonly<Record<string, boolean>>;
  readonly onSelectRegion: (regionId: string) => void;
  readonly onSelectBuilding?: (buildingId: string) => void;
}) {
  const { cellSize, columns, rows, regions, connections } = map;
  const width = columns * cellSize;
  const height = rows * cellSize;

  const regionById = new Map(regions.map((region) => [region.id, region]));
  const metricsByRegion = new Map(overlays.regionMetrics.map((metric) => [metric.regionId, metric]));

  return (
    <svg
      className="pg-world-canvas"
      width={width}
      height={height}
      role="img"
      aria-label="Interaktive Weltkarte"
    >
      {layers.grid ? (
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

      {layers.resources
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

      {layers.connections
        ? connections.map((connection) => {
            const from = regionById.get(connection.fromRegionId);
            const to = regionById.get(connection.toRegionId);
            if (from === undefined || to === undefined) {
              return null;
            }

            const fromCenter = regionCenter(from, cellSize);
            const toCenter = regionCenter(to, cellSize);
            const flow = overlays.transportFlows.find(
              (entry) =>
                entry.fromRegionId === connection.fromRegionId &&
                entry.toRegionId === connection.toRegionId,
            );
            const isTransportLayer = layers.transport;
            const strokeWidth = isTransportLayer && flow !== undefined ? 2 + flow.intensity * 4 : 2;

            return (
              <line
                key={`${connection.fromRegionId}-${connection.toRegionId}`}
                className={`pg-world-connection${isTransportLayer && flow !== undefined ? ' pg-world-connection-active' : ''}`}
                x1={fromCenter.x}
                y1={fromCenter.y}
                x2={toCenter.x}
                y2={toCenter.y}
                strokeWidth={strokeWidth}
                aria-hidden="true"
              />
            );
          })
        : null}

      {layers.regions
        ? regions.map((region) => {
            const isSelected = selectedRegionId === region.id;
            return (
              <rect
                key={region.id}
                className={`pg-world-region${isSelected ? ' is-selected' : ''}`}
                x={region.mapX * cellSize + 4}
                y={region.mapY * cellSize + 4}
                width={cellSize - 8}
                height={cellSize - 8}
                rx={8}
                role="button"
                tabIndex={0}
                aria-label={`Region ${region.name}`}
                aria-pressed={isSelected}
                onClick={() => {
                  onSelectRegion(region.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelectRegion(region.id);
                  }
                }}
              />
            );
          })
        : null}

      {layers.buildings
        ? overlays.buildingMarkers.map((marker) => (
            <circle
              key={marker.id}
              className="pg-world-building-marker"
              cx={marker.x}
              cy={marker.y}
              r={5}
              role="button"
              tabIndex={0}
              aria-label={`Gebäude ${marker.label}`}
              onClick={(event) => {
                event.stopPropagation();
                if (onSelectBuilding !== undefined) {
                  onSelectBuilding(marker.id);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  event.stopPropagation();
                  if (onSelectBuilding !== undefined) {
                    onSelectBuilding(marker.id);
                  }
                }
              }}
            />
          ))
        : null}

      {layers.presence
        ? regions.map((region) => {
            const metric = metricsByRegion.get(region.id);
            if (metric === undefined || metric.buildingCount === 0) {
              return null;
            }

            return (
              <g key={`presence-${region.id}`} aria-hidden="true">
                <circle
                  className="pg-world-presence-badge"
                  cx={region.mapX * cellSize + cellSize - 12}
                  cy={region.mapY * cellSize + 12}
                  r={10}
                />
                <text
                  className="pg-world-presence-label"
                  x={region.mapX * cellSize + cellSize - 12}
                  y={region.mapY * cellSize + 12 + 3}
                  textAnchor="middle"
                >
                  {metric.buildingCount}
                </text>
              </g>
            );
          })
        : null}

      {layers.selection && selectedRegionId !== null
        ? (() => {
            const region = regionById.get(selectedRegionId);
            if (region === undefined) {
              return null;
            }

            return (
              <rect
                className="pg-world-selection-ring"
                x={region.mapX * cellSize + 2}
                y={region.mapY * cellSize + 2}
                width={cellSize - 4}
                height={cellSize - 4}
                rx={10}
                aria-hidden="true"
              />
            );
          })()
        : null}

      {layers.labels
        ? regions.map((region) => (
            <g key={`label-${region.id}`} aria-hidden="true">
              <text
                className="pg-world-label"
                x={region.mapX * cellSize + cellSize / 2}
                y={region.mapY * cellSize + cellSize / 2 - 4}
                textAnchor="middle"
              >
                {region.name}
              </text>
              <text
                className="pg-world-label-sub"
                x={region.mapX * cellSize + cellSize / 2}
                y={region.mapY * cellSize + cellSize / 2 + 10}
                textAnchor="middle"
              >
                {region.biomeId}
              </text>
            </g>
          ))
        : null}
    </svg>
  );
}
