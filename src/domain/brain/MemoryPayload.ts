/**
 * @module @domain/brain/MemoryPayload
 *
 * Serializable memory payload values for historical observations.
 */

/** Scalar values permitted inside memory payloads. */
export type MemoryPayloadScalar = string | number | boolean;

/** Deterministic key-value payload stored in memory entries. */
export type MemoryPayload = Readonly<Record<string, MemoryPayloadScalar>>;

/** Creates a frozen memory payload from entries. */
export function createMemoryPayload(
  entries: Readonly<Record<string, MemoryPayloadScalar>>,
): MemoryPayload {
  return Object.freeze({ ...entries });
}
