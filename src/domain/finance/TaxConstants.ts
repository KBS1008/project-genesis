/**
 * @module @domain/finance/TaxConstants
 *
 * Deterministic defaults for periodic corporate tax collection.
 *
 * @see docs/gameplay/economy.md
 */

/** Number of simulation ticks between corporate tax assessments. */
export const TAX_INTERVAL_TICKS = 30;

/** Flat corporate tax rate applied to taxable profit each interval. */
export const CORPORATE_TAX_RATE = 0.05;
