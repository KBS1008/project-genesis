import { describe, expect, it } from 'vitest';
import {
  createBuildingMapPlacementSession,
  withBuildingMapPlacementCandidate,
} from '@/presentation/navigation/building-map-placement-session';

describe('building-map-placement-session', () => {
  it('creates a session with null candidate', () => {
    const session = createBuildingMapPlacementSession({
      buildingTypeId: 'sawmill',
      name: '  Sägewerk  ',
      canPlace: true,
    });

    expect(session).toEqual({
      buildingTypeId: 'sawmill',
      name: 'Sägewerk',
      canPlace: true,
      candidate: null,
    });
  });

  it('updates candidate without mutating prior session', () => {
    const session = createBuildingMapPlacementSession({
      buildingTypeId: 'sawmill',
      name: 'Sägewerk',
      canPlace: true,
    });
    const withCandidate = withBuildingMapPlacementCandidate(session, { x: 4, y: 9 });

    expect(session.candidate).toBeNull();
    expect(withCandidate.candidate).toEqual({ x: 4, y: 9 });
    expect(withCandidate.buildingTypeId).toBe('sawmill');
  });

  it('clears candidate explicitly', () => {
    const session = withBuildingMapPlacementCandidate(
      createBuildingMapPlacementSession({
        buildingTypeId: 'sawmill',
        name: 'Sägewerk',
        canPlace: true,
      }),
      { x: 1, y: 2 },
    );

    expect(withBuildingMapPlacementCandidate(session, null).candidate).toBeNull();
  });
});
