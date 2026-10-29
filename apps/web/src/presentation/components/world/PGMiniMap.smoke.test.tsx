import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PGMiniMap } from '@/presentation/components/world/PGMiniMap';
import { resolveScenicPresentationContext } from '@/presentation/adapters/mappers/world-scenic-visual-projection';
import { WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT } from '@/presentation/adapters/mappers/world-scenic-presentation-profile';
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

    expect(screen.getByText('Übersicht')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Minikarte der Welt' })).toBeInTheDocument();
    expect(container.querySelectorAll('.pg-world-minimap-region')).toHaveLength(4);
    expect(container.querySelector('.pg-world-minimap-region')).toBeTruthy();
    expect(container.querySelector('.pg-world-minimap-viewport')).toBeTruthy();
    expect(container.querySelector('svg[data-scenic-minimap="0"]')).toBeTruthy();
    expect(container.querySelectorAll('rect.pg-world-minimap-region')).toHaveLength(4);
    expect(container.querySelector('svg.pg-world-minimap-svg')).toHaveAttribute('viewBox', '0 0 148 100');
  });

  it('uses scenic anchors and circle markers when scenic context is provided', () => {
    const viewportRef = { current: document.createElement('div') };
    Object.defineProperty(viewportRef.current, 'clientWidth', { value: 800 });
    Object.defineProperty(viewportRef.current, 'clientHeight', { value: 600 });

    const scenicPresentationContext = resolveScenicPresentationContext(
      WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT,
      640,
      480,
      WORLD_MAP_CELL_SIZE,
    );

    const { container } = render(
      <PGMiniMap
        map={MAP}
        selectedRegionId="region_east"
        camera={Object.freeze({ scale: 1, translateX: 0, translateY: 0 })}
        viewportRef={viewportRef}
        scenicPresentationContext={scenicPresentationContext}
      />,
    );

    const svg = container.querySelector('svg[data-scenic-minimap="1"]');
    expect(svg).toBeTruthy();
    expect(svg).toHaveClass('is-scenic');

    const circles = container.querySelectorAll('circle.pg-world-minimap-region-scenic');
    expect(circles).toHaveLength(4);

    const regionIds = [...circles].map((el) => el.getAttribute('data-region-id')).sort();
    expect(regionIds).toEqual([
      'region_default',
      'region_east',
      'region_north',
      'region_south',
    ]);

    expect(container.querySelector('circle.is-selected[data-region-id="region_east"]')).toBeTruthy();
    expect(container.querySelectorAll('rect.pg-world-minimap-region')).toHaveLength(0);
    expect(container.querySelector('image.pg-world-minimap-scenic-plate')).toBeTruthy();
  });
});
