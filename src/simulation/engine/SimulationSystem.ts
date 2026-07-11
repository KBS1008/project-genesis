/**
 * @module @simulation/engine/SimulationSystem
 *
 * Contract for deterministic simulation systems executed each tick.
 */

import type { TickContext } from './TickContext.js';

/** A single-responsibility unit of simulation work executed each tick. */
export type SimulationSystem = {
  /** Machine-readable system name used for diagnostics and ordering. */
  readonly name: string;
  /** Executes one tick of simulation work. */
  execute(context: TickContext): void;
};
