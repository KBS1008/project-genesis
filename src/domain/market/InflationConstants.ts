/**
 * @module @domain/market/InflationConstants
 *
 * Deterministic inflation monitoring and dampening defaults.
 *
 * @see docs/gameplay/economy.md
 */

/** Lower bound of the neutral global price index band. */
export const INFLATION_TARGET_MIN = 0.9;

/** Upper bound of the neutral global price index band. */
export const INFLATION_TARGET_MAX = 1.1;

/** Multiplier applied to price adjustment when the index exceeds the upper band. */
export const INFLATION_DAMPING_FACTOR = 0.5;

/** Multiplier applied to price adjustment when the index falls below the lower band. */
export const INFLATION_STIMULUS_FACTOR = 1.25;
