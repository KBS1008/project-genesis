/**
 * @module @simulation/state/SimulationState
 *
 * Execution state maintained by the simulation engine.
 */

/**
 * Immutable simulation execution state.
 */
export class SimulationState {
  readonly tickNumber: number;
  readonly paused: boolean;

  /**
   * @param tickNumber - Number of completed simulation ticks.
   * @param paused - Whether tick execution is paused.
   */
  constructor(tickNumber = 0, paused = false) {
    this.tickNumber = tickNumber;
    this.paused = paused;
    Object.freeze(this);
  }

  /** Returns a copy with an updated tick number. */
  withTickNumber(tickNumber: number): SimulationState {
    return new SimulationState(tickNumber, this.paused);
  }

  /** Returns a copy with an updated paused flag. */
  withPaused(paused: boolean): SimulationState {
    return new SimulationState(this.tickNumber, paused);
  }
}
