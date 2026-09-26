import { describe, expect, it } from 'vitest';
import {
  getPlaceBuildingPrerequisiteNavigationLabel,
  resolvePlaceBuildingPrerequisiteNavigation,
} from '@/presentation/navigation/place-building-prerequisite-navigation';

describe('place-building-prerequisite-navigation', () => {
  it('maps missing research to Research screen with catalog technology focus id', () => {
    const resolved = resolvePlaceBuildingPrerequisiteNavigation({
      kind: 'missing_research',
      technologyId: 'intermodal_logistics',
    });

    expect(resolved.target).toEqual({
      screen: 'research',
      entitySelection: { kind: 'none' },
    });
    expect(resolved.researchCatalogTechnologyId).toBe('intermodal_logistics');
    expect(
      getPlaceBuildingPrerequisiteNavigationLabel({
        kind: 'missing_research',
        technologyId: 'intermodal_logistics',
      }),
    ).toBe('Zur Forschung');
  });

  it('maps missing milestone to Company screen without fake entity focus', () => {
    const resolved = resolvePlaceBuildingPrerequisiteNavigation({ kind: 'missing_milestone' });

    expect(resolved.target).toEqual({
      screen: 'company',
      entitySelection: { kind: 'none' },
    });
    expect(resolved.researchCatalogTechnologyId).toBeNull();
    expect(getPlaceBuildingPrerequisiteNavigationLabel({ kind: 'missing_milestone' })).toBe(
      'Zu den Meilensteinen',
    );
  });
});
