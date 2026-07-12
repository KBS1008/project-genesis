/**
 * @module @domain/research/ResearchJobId
 *
 * Strongly typed identifier for research job aggregates.
 */

import type { Identifier } from '../../common/core/Identifier.js';

/** Identifier brand for research job aggregates. */
export type ResearchJobId = Identifier<'ResearchJob'>;
