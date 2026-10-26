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
      regionId: null,
      validation: null,
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

  it('preserves validation when the same tile is picked again', () => {
    const session = withBuildingMapPlacementCandidate(
      createBuildingMapPlacementSession({
        buildingTypeId: 'sawmill',
        name: 'Sägewerk',
        canPlace: true,
      }),
      { x: 30, y: 30 },
    );
    const validated = Object.freeze({
      ...session,
      validation: Object.freeze({ valid: true, reason: null }),
      regionId: 'region_default',
    });
    const repick = withBuildingMapPlacementCandidate(validated, { x: 30, y: 30 });

    expect(repick).toBe(validated);
    expect(repick.validation?.valid).toBe(true);
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
