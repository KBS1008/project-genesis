import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PGMiniMap } from '@/presentation/components/world/PGMiniMap';
import { WORLD_MAP_CELL_SIZE } from '@/presentation/adapters/view-data/world-view-data';

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
      name: 'East',
      biomeId: 'plains',
      biomeLabel: 'Plains',
      biomeCategory: 'PLAINS',
      mapX: 2,
      mapY: 0,
      cityCount: 1,
    }),
    Object.freeze({
      id: 'region_north',
      name: 'North',
      biomeId: 'forest',
      biomeLabel: 'Forest',
      biomeCategory: 'FOREST',
      mapX: 0,
      mapY: 2,
      cityCount: 1,
    }),
    Object.freeze({
      id: 'region_south',
      name: 'South',
      biomeId: 'coastal',
      biomeLabel: 'Coastal',
      biomeCategory: 'COASTAL',
      mapX: 0,
      mapY: -2,
      cityCount: 1,
    }),
  ],
  connections: Object.freeze([
    Object.freeze({
      fromRegionId: 'region_default',
      toRegionId: 'region_east',
      distanceLabel: '120 km',
    }),
  ]),
});

describe('PGMiniMap smoke', () => {
  it('renders minimap title, four region cells, and viewport indicator', () => {
    const viewportRef = { current: document.createElement('div') };
    Object.defineProperty(viewportRef.current, 'clientWidth', { value: 800 });
    Object.defineProperty(viewportRef.current, 'clientHeight', { value: 600 });

    const { container } = render(
      <PGMiniMap
        map={MAP}
        selectedRegionId="region_default"
        camera={Object.freeze({ scale: 1, translateX: 0, translateY: 0 })}
        viewportRef={viewportRef}
      />,
    );

    expect(screen.getByText('Minikarte')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Minikarte der Welt' })).toBeInTheDocument();
    expect(container.querySelectorAll('.pg-world-minimap-region')).toHaveLength(4);
    expect(container.querySelector('.pg-world-minimap-viewport')).toBeTruthy();
  });
});
