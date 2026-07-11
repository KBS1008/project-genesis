/**
 * @module @domain/shared
 *
 * Shared domain value objects used across bounded contexts.
 */

export { Money, DEFAULT_CURRENCY } from './Money.js';
export { Quantity } from './Quantity.js';
export { Capacity } from './Capacity.js';
export { ResourceAmount } from './ResourceAmount.js';
export { createResourceTypeId } from './ResourceTypeId.js';
export type { ResourceTypeId } from './ResourceTypeId.js';
