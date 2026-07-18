/**
 * @module @domain/market/MarketPriceConstants
 *
 * Deterministic defaults for supply-and-demand price simulation.
 *
 * @see docs/gameplay/economy.md
 * @see docs/gameplay/market.md
 */

/** Number of simulation ticks between global market price adjustments. */
export const MARKET_PRICE_UPDATE_INTERVAL_TICKS = 10;

/** Baseline NPC and world demand per listed resource between price updates. */
export const MARKET_BASELINE_DEMAND = 50;

/** Minimum effective supply used to avoid division by zero. */
export const MARKET_MIN_SUPPLY_UNITS = 1;

/** Fraction of the gap to the supply-demand target price applied each update. */
export const MARKET_PRICE_ADJUSTMENT_RATE = 0.08;

/** Lower bound for dynamic prices relative to the resource base price. */
export const MARKET_MIN_PRICE_RATIO = 0.25;

/** Upper bound for dynamic prices relative to the resource base price. */
export const MARKET_MAX_PRICE_RATIO = 4;

/** Fixed trade fee rate applied to each market transaction (Version 1). */
export const MARKET_TRADE_FEE_RATE = 0.02;

/** Minimum market fee charged per trade in credits. */
export const MARKET_TRADE_FEE_MINIMUM = 1;
