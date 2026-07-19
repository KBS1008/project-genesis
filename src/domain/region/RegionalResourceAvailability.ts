/**
 * @module @domain/region/RegionalResourceAvailability
 *
 * Immutable regional resource availability snapshot (Option A — no depletion).
 */

/** Regional resource availability derived from static content. */
export type RegionalResourceAvailability = {
  readonly resourceTypeId: string;
  readonly available: boolean;
  readonly extractionModifier: number;
};
