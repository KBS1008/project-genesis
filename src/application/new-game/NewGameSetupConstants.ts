/**
 * @module @application/new-game/NewGameSetupConstants
 *
 * Deterministic new-game setup values from core gameplay documentation.
 *
 * @see docs/gameplay/core-gameplay.md
 */

/** Starter inventory grant for a newly founded company. */
export type NewGameStarterResource = {
  readonly resourceId: string;
  readonly quantity: number;
};

/** Starter building placement for a newly founded company. */
export type NewGameStarterBuilding = {
  readonly buildingId: string;
  readonly buildingTypeId: string;
  readonly name: string;
  readonly x: number;
  readonly y: number;
};

/** Wood granted at game start — enough for early sawmill production and NPC contracts. */
export const NEW_GAME_STARTER_WOOD = 40;

/** Stone granted at game start — enough for early infrastructure. */
export const NEW_GAME_STARTER_STONE = 15;

/** Iron ore granted at game start — enough for early production planning. */
export const NEW_GAME_STARTER_IRON_ORE = 10;

/** Starter resources granted when a new game begins. */
export const NEW_GAME_STARTER_RESOURCES: readonly NewGameStarterResource[] = Object.freeze([
  Object.freeze({ resourceId: 'wood', quantity: NEW_GAME_STARTER_WOOD }),
  Object.freeze({ resourceId: 'stone', quantity: NEW_GAME_STARTER_STONE }),
  Object.freeze({ resourceId: 'iron_ore', quantity: NEW_GAME_STARTER_IRON_ORE }),
]);

/** Starter buildings granted for free at game start. */
export const NEW_GAME_STARTER_BUILDINGS: readonly NewGameStarterBuilding[] = Object.freeze([
  Object.freeze({
    buildingId: 'building_001',
    buildingTypeId: 'headquarters',
    name: 'Firmenzentrale',
    x: 12,
    y: 12,
  }),
  Object.freeze({
    buildingId: 'building_002',
    buildingTypeId: 'warehouse',
    name: 'Lager',
    x: 8,
    y: 12,
  }),
  Object.freeze({
    buildingId: 'building_003',
    buildingTypeId: 'power_substation',
    name: 'Umspannwerk',
    x: 16,
    y: 12,
  }),
  Object.freeze({
    buildingId: 'building_004',
    buildingTypeId: 'access_road',
    name: 'Zufahrtsstrasse',
    x: 12,
    y: 8,
  }),
]);
