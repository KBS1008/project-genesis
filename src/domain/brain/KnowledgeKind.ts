/**
 * @module @domain/brain/KnowledgeKind
 *
 * Categories of observable facts retained in company knowledge.
 */

/** Supported knowledge entry kinds. */
export const KnowledgeKind = {
  MARKET_PRICE: 'MARKET_PRICE',
  KNOWN_SUPPLIER: 'KNOWN_SUPPLIER',
  KNOWN_CUSTOMER: 'KNOWN_CUSTOMER',
  DISCOVERED_REGION: 'DISCOVERED_REGION',
  RESEARCHED_TECHNOLOGY: 'RESEARCHED_TECHNOLOGY',
  AVAILABLE_RESOURCE: 'AVAILABLE_RESOURCE',
  INFRASTRUCTURE_QUALITY: 'INFRASTRUCTURE_QUALITY',
} as const;

/** Union of all knowledge kind values. */
export type KnowledgeKind = (typeof KnowledgeKind)[keyof typeof KnowledgeKind];

/** All supported knowledge kinds in deterministic order. */
export const KNOWLEDGE_KINDS: readonly KnowledgeKind[] = Object.freeze([
  KnowledgeKind.AVAILABLE_RESOURCE,
  KnowledgeKind.DISCOVERED_REGION,
  KnowledgeKind.INFRASTRUCTURE_QUALITY,
  KnowledgeKind.KNOWN_CUSTOMER,
  KnowledgeKind.KNOWN_SUPPLIER,
  KnowledgeKind.MARKET_PRICE,
  KnowledgeKind.RESEARCHED_TECHNOLOGY,
]);

/** Returns whether a value is a supported knowledge kind. */
export function isKnowledgeKind(value: string): value is KnowledgeKind {
  return (KNOWLEDGE_KINDS as readonly string[]).includes(value);
}
