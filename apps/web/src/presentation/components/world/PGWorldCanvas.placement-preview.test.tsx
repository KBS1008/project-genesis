// @vitest-environment jsdom

import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EMPTY_WORLD_OVERLAY } from '@/presentation/adapters/view-data/world-view-data';
import { WORLD_MAP_CELL_SIZE } from '@/presentation/adapters/view-data/world-view-data';
import { PGWorldCanvas } from '@/presentation/components/world/PGWorldCanvas';

const MAP = Object.freeze({
  mapId: 'map_world_default',
  mapName: 'World',
  columns: 3,
  rows: 3,
  cellSize: WORLD_MAP_CELL_SIZE,
  regions: [
    Object.freeze({
      id: 'region_default',
      name: 'Central Basin',
      biomeId: 'forest',
      biomeLabel: 'Forest',
      biomeCategory: 'FOREST',
      mapX: 0,
      mapY: 0,
      cityCount: 1,
    }),
  ],
  connections: [],
});

describe('PGWorldCanvas placement preview', () => {
  it('does not render a placement preview marker on the world overview canvas', () => {
    const { container } = render(
      <PGWorldCanvas
        map={MAP}
        overlays={EMPTY_WORLD_OVERLAY}
        selectedRegionId={null}
        layers={Object.freeze({
          grid: true,
          regions: true,
          connections: false,
          labels: true,
          selection: true,
          resources: false,
          buildings: false,
          transport: false,
          presence: false,
        })}
        canvasWidth={288}
        canvasHeight={288}
        placementPreviewMarker={null}
        onSelectRegion={vi.fn()}
      />,
    );

    expect(container.querySelector('.pg-world-building-marker.is-preview')).toBeNull();
  });
});
