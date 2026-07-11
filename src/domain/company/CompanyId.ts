/**
 * @module @domain/company/CompanyId
 *
 * Strongly typed identifiers for the Company bounded context.
 */

import type { Identifier } from '../../common/core/Identifier.js';

/** Identifier brand for companies. */
export type CompanyId = Identifier<'Company'>;

/** Identifier brand for players owning companies. */
export type PlayerId = Identifier<'Player'>;
