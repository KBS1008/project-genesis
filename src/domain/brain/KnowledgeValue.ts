/**
 * @module @domain/brain/KnowledgeValue
 *
 * Serializable knowledge values stored in company knowledge entries.
 */

/** Supported scalar knowledge value kinds. */
export const KnowledgeValueKind = {
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  BOOLEAN: 'BOOLEAN',
} as const;

/** Union of all knowledge value kind values. */
export type KnowledgeValueKind = (typeof KnowledgeValueKind)[keyof typeof KnowledgeValueKind];

/** Discriminated union of supported knowledge values. */
export type KnowledgeValue =
  | { readonly kind: typeof KnowledgeValueKind.NUMBER; readonly value: number }
  | { readonly kind: typeof KnowledgeValueKind.STRING; readonly value: string }
  | { readonly kind: typeof KnowledgeValueKind.BOOLEAN; readonly value: boolean };

/** Creates a numeric knowledge value. */
export function knowledgeNumber(value: number): KnowledgeValue {
  return Object.freeze({ kind: KnowledgeValueKind.NUMBER, value });
}

/** Creates a string knowledge value. */
export function knowledgeString(value: string): KnowledgeValue {
  return Object.freeze({ kind: KnowledgeValueKind.STRING, value });
}

/** Creates a boolean knowledge value. */
export function knowledgeBoolean(value: boolean): KnowledgeValue {
  return Object.freeze({ kind: KnowledgeValueKind.BOOLEAN, value });
}
