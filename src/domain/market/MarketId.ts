/**
 * @module @domain/market/MarketId
 *
 * Strongly typed identifier for market aggregates.
 */

import type { Identifier } from '../../common/core/Identifier.js';

/** Identifier brand for market aggregates. */
export type MarketId = Identifier<'Market'>;
