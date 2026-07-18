/**
 * @module @domain/market/MarketSupplyAggregator
 *
 * Aggregates available inventory supply for market price simulation.
 */

import type { Inventory } from '../inventory/Inventory.js';
import { createResourceTypeId } from '../shared/ResourceTypeId.js';

/**
 * Sums available inventory quantity for one resource across all companies.
 */
export function aggregateResourceSupply(
  inventories: readonly Inventory[],
  resourceId: string,
): number {
  const resourceIdResult = createResourceTypeId(resourceId);

  if (!resourceIdResult.ok) {
    return 0;
  }

  const resourceTypeId = resourceIdResult.value;
  let totalSupply = 0;

  for (const inventory of inventories) {
    totalSupply += inventory.getAvailableQuantity(resourceTypeId);
  }

  return totalSupply;
}
