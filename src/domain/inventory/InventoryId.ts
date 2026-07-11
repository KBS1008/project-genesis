/**
 * @module @domain/inventory/InventoryId
 *
 * Strongly typed identifier for inventory aggregates.
 */

import type { Identifier } from '../../common/core/Identifier.js';

/** Identifier brand for inventory aggregates. */
export type InventoryId = Identifier<'Inventory'>;
