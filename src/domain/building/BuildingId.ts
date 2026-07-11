/**
 * @module @domain/building/BuildingId
 *
 * Strongly typed identifiers for the Building bounded context.
 */

import type { Identifier } from '../../common/core/Identifier.js';

/** Identifier brand for building instances. */
export type BuildingId = Identifier<'Building'>;

/** Identifier brand referencing a static building type definition. */
export type BuildingTypeId = Identifier<'BuildingType'>;
