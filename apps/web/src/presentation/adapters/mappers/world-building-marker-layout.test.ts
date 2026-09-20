import { describe, expect, it } from 'vitest';
import { distributeMarkerPosition } from '@/presentation/adapters/mappers/world-building-marker-layout';
import { WORLD_MAP_CELL_SIZE } from '@/presentation/adapters/view-data/world-view-data';

const REGION = Object.freeze({
  id: 'region_001',
  name: 'Heartland',
  biomeId: 'temperate',
  biomeLabel: 'Temperate Forest',
  biomeCategory: 'FOREST',
  mapX: 0,
  mapY: 0,
  cityCount: 1,
});

describe('world-building-marker-layout', () => {
  it('places markers in the lower band away from the region label center', () => {
    const first = distributeMarkerPosition(REGION, 0, WORLD_MAP_CELL_SIZE);
    const centerY = REGION.mapY * WORLD_MAP_CELL_SIZE + WORLD_MAP_CELL_SIZE / 2;

    expect(first.y).toBeGreaterThan(centerY);
    expect(first.x).toBeGreaterThan(REGION.mapX * WORLD_MAP_CELL_SIZE);
  });

  it('separates multiple markers in the same region', () => {
    const positions = [0, 1, 2, 3, 4].map((index) =>
      distributeMarkerPosition(REGION, index, WORLD_MAP_CELL_SIZE),
    );

    const uniqueKeys = new Set(positions.map((position) => `${position.x},${position.y}`));
    expect(uniqueKeys.size).toBe(5);
  });
});
