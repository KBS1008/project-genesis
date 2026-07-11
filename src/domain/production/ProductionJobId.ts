/**
 * @module @domain/production/ProductionJobId
 *
 * Strongly typed identifier for production job aggregates.
 */

import type { Identifier } from '../../common/core/Identifier.js';

/** Identifier brand for production job aggregates. */
export type ProductionJobId = Identifier<'ProductionJob'>;
