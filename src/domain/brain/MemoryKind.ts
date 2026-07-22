/**
 * @module @domain/brain/MemoryKind
 *
 * Categories of historical observations retained in company memory.
 */

/** Supported memory entry kinds. */
export const MemoryKind = {
  HISTORICAL_PRICE: 'HISTORICAL_PRICE',
  SUPPLIER_RELIABILITY: 'SUPPLIER_RELIABILITY',
  TRANSPORT_PERFORMANCE: 'TRANSPORT_PERFORMANCE',
  PRODUCTION_EFFICIENCY: 'PRODUCTION_EFFICIENCY',
  FAILED_INVESTMENT: 'FAILED_INVESTMENT',
  SUCCESSFUL_TRADE: 'SUCCESSFUL_TRADE',
} as const;

/** Union of all memory kind values. */
export type MemoryKind = (typeof MemoryKind)[keyof typeof MemoryKind];

/** All supported memory kinds in deterministic order. */
export const MEMORY_KINDS: readonly MemoryKind[] = Object.freeze([
  MemoryKind.FAILED_INVESTMENT,
  MemoryKind.HISTORICAL_PRICE,
  MemoryKind.PRODUCTION_EFFICIENCY,
  MemoryKind.SUCCESSFUL_TRADE,
  MemoryKind.SUPPLIER_RELIABILITY,
  MemoryKind.TRANSPORT_PERFORMANCE,
]);

/** Returns whether a value is a supported memory kind. */
export function isMemoryKind(value: string): value is MemoryKind {
  return (MEMORY_KINDS as readonly string[]).includes(value);
}
