import type { PlaceBuildingPrerequisiteNavigationViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type { EntityNavigationTarget } from '@/presentation/navigation/entity-navigation';

/** German label for the Buildings Baukatalog prerequisite navigation affordance. */
export function getPlaceBuildingPrerequisiteNavigationLabel(
  navigation: PlaceBuildingPrerequisiteNavigationViewData,
): string {
  switch (navigation.kind) {
    case 'missing_research':
      return 'Zur Forschung';
    case 'missing_milestone':
      return 'Zu den Meilensteinen';
  }
}

/** Maps structured building prerequisite navigation to workspace navigation targets. */
export function resolvePlaceBuildingPrerequisiteNavigation(
  navigation: PlaceBuildingPrerequisiteNavigationViewData,
): {
  readonly target: EntityNavigationTarget;
  readonly researchCatalogTechnologyId: string | null;
} {
  switch (navigation.kind) {
    case 'missing_research':
      return {
        target: {
          screen: 'research',
          entitySelection: { kind: 'none' },
        },
        researchCatalogTechnologyId: navigation.technologyId,
      };
    case 'missing_milestone':
      return {
        target: {
          screen: 'company',
          entitySelection: { kind: 'none' },
        },
        researchCatalogTechnologyId: null,
      };
  }
}
