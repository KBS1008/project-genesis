/** Structural tutorial step IDs from `GameSessionDashboardBuilder.readTutorialProgress`. */
export const TUTORIAL_STEP_IDS = Object.freeze([
  'open_plot',
  'build_sawmill',
  'buy_wood',
  'produce_planks',
  'sell_planks',
  'earn_profit',
  'npc_supply_contract',
  'corporate_tax',
] as const);

export type TutorialStepId = (typeof TUTORIAL_STEP_IDS)[number];

const TUTORIAL_STEP_ID_SET: ReadonlySet<string> = new Set(TUTORIAL_STEP_IDS);

export function isTutorialStepId(value: string): value is TutorialStepId {
  return TUTORIAL_STEP_ID_SET.has(value);
}

/** Player-facing CTA labels — navigation only, keyed by step ID. */
export const TUTORIAL_STEP_CTA_LABELS: Readonly<Record<TutorialStepId, string | null>> =
  Object.freeze({
    open_plot: null,
    build_sawmill: 'Gebäude öffnen',
    buy_wood: 'Markt öffnen',
    produce_planks: 'Produktion öffnen',
    sell_planks: 'Markt öffnen',
    earn_profit: 'Meilensteine anzeigen',
    npc_supply_contract: 'Lieferverträge anzeigen',
    corporate_tax: 'Finanzbuchungen anzeigen',
  });

/** Building catalog focus for the sawmill construction tutorial step. */
export const TUTORIAL_BUILD_SAWMILL_BUILDING_TYPE_ID = 'sawmill';

export const TUTORIAL_BUY_WOOD_RESOURCE_ID = 'wood';

export const TUTORIAL_SELL_PLANKS_RESOURCE_ID = 'planks';

export const TUTORIAL_PRODUCE_PLANKS_BUILDING_TYPE_ID = 'sawmill';

export function getTutorialStepCtaLabel(stepId: string): string | null {
  if (!isTutorialStepId(stepId)) {
    return null;
  }

  return TUTORIAL_STEP_CTA_LABELS[stepId];
}
