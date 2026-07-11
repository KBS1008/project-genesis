/**
 * @module @domain/building/BuildingStatus
 *
 * Lifecycle status of a building instance.
 *
 * @see docs/schemas/Building.schema.md
 */

/** Valid building lifecycle states. */
export const BuildingStatus = {
  PLANNED: 'PLANNED',
  UNDER_CONSTRUCTION: 'UNDER_CONSTRUCTION',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  BLOCKED: 'BLOCKED',
  MAINTENANCE: 'MAINTENANCE',
  DAMAGED: 'DAMAGED',
  DEMOLISHED: 'DEMOLISHED',
} as const;

/** Union of all building status values. */
export type BuildingStatus = (typeof BuildingStatus)[keyof typeof BuildingStatus];
