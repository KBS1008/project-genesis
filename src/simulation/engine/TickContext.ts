/**
 * @module @simulation/engine/TickContext
 *
 * Context passed to simulation systems during a tick.
 */

import type { Clock } from '../../common/time/Clock.js';

/** Context available to simulation systems for one tick. */
export type TickContext = {
  /** One-based tick number for the current execution. */
  readonly tickNumber: number;
  /** Clock providing deterministic simulation time. */
  readonly clock: Clock;
};
