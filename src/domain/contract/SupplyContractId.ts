/**
 * @module @domain/contract/SupplyContractId
 *
 * Strongly typed identifiers for supply contracts.
 */

import type { Identifier } from '../../common/core/Identifier.js';

/** Identifier brand for supply contract instances. */
export type SupplyContractId = Identifier<'SupplyContract'>;
