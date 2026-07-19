/**
 * @module @application/read-models/RegionDetailsReadModel
 *
 * Read-side projection combining region metadata and local context.
 */

import type { CityReadModel } from './CityReadModel.js';
import type { RegionReadModel } from './RegionReadModel.js';
import type { RegionalResourceReadModel } from './RegionalResourceReadModel.js';

/** Immutable region details returned by queries. */
export type RegionDetailsReadModel = {
  readonly region: RegionReadModel;
  readonly regionalResources: readonly RegionalResourceReadModel[];
  readonly cities: readonly CityReadModel[];
};
