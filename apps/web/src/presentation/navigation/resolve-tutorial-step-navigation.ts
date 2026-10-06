import type { CompanyOperationsPendingNavigation } from '@/presentation/navigation/company-operations-pending-navigation';
import {
  buildProductionBuildingNavigationTarget,
  buildResourceNavigationTarget,
  type EntityNavigationTarget,
} from '@/presentation/navigation/entity-navigation';
import {
  TUTORIAL_BUILD_SAWMILL_BUILDING_TYPE_ID,
  TUTORIAL_BUY_WOOD_RESOURCE_ID,
  TUTORIAL_PRODUCE_PLANKS_BUILDING_TYPE_ID,
  TUTORIAL_SELL_PLANKS_RESOURCE_ID,
  isTutorialStepId,
  type TutorialStepId,
} from '@/presentation/navigation/tutorial-step-navigation-contract';

export type TutorialBuildingRef = Readonly<{
  readonly id: string;
  readonly buildingTypeId: string;
}>;

export type ResolvedTutorialStepNavigation =
  | Readonly<{
      readonly kind: 'buildings_catalog';
      readonly target: EntityNavigationTarget;
      readonly buildingCatalogFocusBuildingTypeId: string;
    }>
  | Readonly<{
      readonly kind: 'markets_resource';
      readonly target: EntityNavigationTarget;
    }>
  | Readonly<{
      readonly kind: 'production';
      readonly target: EntityNavigationTarget;
    }>
  | Readonly<{
      readonly kind: 'company_operations';
      readonly target: EntityNavigationTarget;
      readonly pendingNavigation: CompanyOperationsPendingNavigation;
    }>;

function resolveSawmillProductionTarget(
  buildings: readonly TutorialBuildingRef[],
): EntityNavigationTarget {
  const sawmills = buildings.filter(
    (building) => building.buildingTypeId === TUTORIAL_PRODUCE_PLANKS_BUILDING_TYPE_ID,
  );

  if (sawmills.length === 1) {
    return buildProductionBuildingNavigationTarget(sawmills[0]!.id);
  }

  return { screen: 'production', entitySelection: { kind: 'none' } };
}

/** Maps a tutorial step ID to navigation/focus intents (presentation only). */
export function resolveTutorialStepNavigation(
  stepId: string,
  buildings: readonly TutorialBuildingRef[],
): ResolvedTutorialStepNavigation | null {
  if (!isTutorialStepId(stepId)) {
    return null;
  }

  const resolved = resolveTutorialStepNavigationForId(stepId, buildings);
  return resolved;
}

function resolveTutorialStepNavigationForId(
  stepId: TutorialStepId,
  buildings: readonly TutorialBuildingRef[],
): ResolvedTutorialStepNavigation | null {
  switch (stepId) {
    case 'open_plot':
      return null;
    case 'build_sawmill':
      return {
        kind: 'buildings_catalog',
        target: { screen: 'buildings', entitySelection: { kind: 'none' } },
        buildingCatalogFocusBuildingTypeId: TUTORIAL_BUILD_SAWMILL_BUILDING_TYPE_ID,
      };
    case 'buy_wood':
      return {
        kind: 'markets_resource',
        target: buildResourceNavigationTarget(TUTORIAL_BUY_WOOD_RESOURCE_ID),
      };
    case 'produce_planks':
      return {
        kind: 'production',
        target: resolveSawmillProductionTarget(buildings),
      };
    case 'sell_planks':
      return {
        kind: 'markets_resource',
        target: buildResourceNavigationTarget(TUTORIAL_SELL_PLANKS_RESOURCE_ID),
      };
    case 'earn_profit':
      return {
        kind: 'company_operations',
        target: { screen: 'company', entitySelection: { kind: 'none' } },
        pendingNavigation: { kind: 'milestone_overview' },
      };
    case 'npc_supply_contract':
      return {
        kind: 'company_operations',
        target: { screen: 'company', entitySelection: { kind: 'none' } },
        pendingNavigation: { kind: 'economy_contracts_section' },
      };
    case 'corporate_tax':
      return {
        kind: 'company_operations',
        target: { screen: 'company', entitySelection: { kind: 'none' } },
        pendingNavigation: { kind: 'finance_ledger_section' },
      };
    default:
      return null;
  }
}
