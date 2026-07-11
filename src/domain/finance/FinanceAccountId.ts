/**
 * @module @domain/finance/FinanceAccountId
 *
 * Strongly typed identifier for finance account aggregates.
 */

import type { Identifier } from '../../common/core/Identifier.js';

/** Identifier brand for finance account aggregates. */
export type FinanceAccountId = Identifier<'FinanceAccount'>;
