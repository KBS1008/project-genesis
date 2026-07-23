/**
 * @module @application/read-models/SimulationStatusReadModel
 *
 * Read-side projection of simulation execution state.
 */

/** Immutable simulation status returned by queries. */
export type SimulationStatusReadModel = {
  readonly tickNumber: number;
  readonly simulationTime: number;
  readonly isPaused: boolean;
  readonly tickDuration: number;
  readonly hasActiveSession: boolean;
};
