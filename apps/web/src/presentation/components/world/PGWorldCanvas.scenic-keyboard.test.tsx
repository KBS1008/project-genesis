// @vitest-environment jsdom

import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EMPTY_WORLD_OVERLAY } from '@/presentation/adapters/view-data/world-view-data';
import { WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT } from '@/presentation/adapters/mappers/world-scenic-presentation-profile';
import { resolveScenicPresentationContext } from '@/presentation/adapters/mappers/world-scenic-visual-projection';
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
    Object.freeze({
      id: 'region_east',
      name: 'Eastern Industrial Belt',
      biomeId: 'plains',
      biomeLabel: 'Plains',
      biomeCategory: 'PLAINS',
      mapX: 2,
      mapY: 0,
      cityCount: 1,
    }),
  ],
  connections: [],
});

const scenicPresentationContext = resolveScenicPresentationContext(
  WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT,
  288,
  288,
  WORLD_MAP_CELL_SIZE,
);

describe('PGWorldCanvas scenic keyboard', () => {
  it('selects scenic region on Enter and Space', () => {
    const onSelectRegion = vi.fn();
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
        onSelectRegion={onSelectRegion}
        scenicPresentationContext={scenicPresentationContext}
      />,
    );

    const east = container.querySelector(
      'circle.pg-world-scenic-region-hit[data-region-id="region_east"]',
    );
    expect(east).toBeTruthy();
    expect(east).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(east!, { key: 'Enter' });
    expect(onSelectRegion).toHaveBeenCalledWith('region_east');

    onSelectRegion.mockClear();
    fireEvent.keyDown(east!, { key: ' ' });
    expect(onSelectRegion).toHaveBeenCalledWith('region_east');
  });
});
