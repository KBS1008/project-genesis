/**
 * @module @application/read-models/RegionalResourceReadModel
 *
 * Read-side projection of regional resource availability.
 */

/** Immutable regional resource availability returned by queries. */
export type RegionalResourceReadModel = {
  readonly resourceTypeId: string;
  readonly available: boolean;
  readonly extractionModifier: number;
};
