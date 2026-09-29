import { describe, expect, it } from 'vitest';
import {
  PRODUCTION_WORKFORCE_PERSONNEL_NAVIGATION_LABEL,
  resolveProductionWorkforcePersonnelNavigation,
} from '@/presentation/navigation/production-workforce-personnel-navigation';

describe('production-workforce-personnel-navigation', () => {
  it('resolves Company operations workforce assignment intent with building identity', () => {
    const resolved = resolveProductionWorkforcePersonnelNavigation('building_005');

    expect(resolved.target).toEqual({
      screen: 'company',
      entitySelection: { kind: 'none' },
    });
    expect(resolved.pendingNavigation).toEqual({
      kind: 'workforce_assignment',
      buildingId: 'building_005',
    });
  });

  it('uses the approved action label constant', () => {
    expect(PRODUCTION_WORKFORCE_PERSONNEL_NAVIGATION_LABEL).toBe('Personal verwalten');
  });
});
