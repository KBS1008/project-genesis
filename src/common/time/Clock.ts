/**
 * @module @common/time/Clock
 *
 * Time abstraction for deterministic simulation in Project Genesis.
 *
 * Business logic must never call `Date.now()` or `new Date()` directly.
 * Use {@link Clock} to obtain the current simulation time instead.
 *
 * @see docs/decisions/DD-009-deterministic-simulation.md
 */

/**
 * Provides access to the current simulation time.
 */
export interface Clock {
  /**
   * Returns the current simulation time.
   *
   * The unit is defined by the simulation layer (typically a tick counter
   * or deterministic epoch). Values must be deterministic for a given state.
   */
  now(): number;
}
