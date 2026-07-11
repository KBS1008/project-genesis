/**
 * @module @domain/finance/FinanceTransactionId
 *
 * Strongly typed identifier for finance transactions.
 */

import type { Identifier } from '../../common/core/Identifier.js';

/** Identifier brand for finance transactions. */
export type FinanceTransactionId = Identifier<'FinanceTransaction'>;
