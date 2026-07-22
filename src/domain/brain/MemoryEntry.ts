/**
 * @module @domain/brain/MemoryEntry
 *
 * Immutable historical observation retained by a company brain.
 */

import type { MemoryEntryId } from './MemoryEntryId.js';
import type { MemoryKind } from './MemoryKind.js';
import type { MemoryPayload } from './MemoryPayload.js';

/** Properties required to construct a memory entry. */
export type MemoryEntryProps = {
  readonly id: MemoryEntryId;
  readonly kind: MemoryKind;
  readonly observedAtTick: number;
  readonly payload: MemoryPayload;
  readonly expiresAtTick?: number;
  readonly regionId?: string;
  readonly resourceId?: string;
  readonly companyId?: string;
};

/**
 * Immutable memory entry representing a historical company observation.
 */
export class MemoryEntry {
  readonly id: MemoryEntryId;
  readonly kind: MemoryKind;
  readonly observedAtTick: number;
  readonly payload: MemoryPayload;
  readonly expiresAtTick?: number;
  readonly regionId?: string;
  readonly resourceId?: string;
  readonly companyId?: string;

  constructor(props: MemoryEntryProps) {
    this.id = props.id;
    this.kind = props.kind;
    this.observedAtTick = props.observedAtTick;
    this.payload = props.payload;

    if (props.expiresAtTick !== undefined) {
      this.expiresAtTick = props.expiresAtTick;
    }

    if (props.regionId !== undefined) {
      this.regionId = props.regionId;
    }

    if (props.resourceId !== undefined) {
      this.resourceId = props.resourceId;
    }

    if (props.companyId !== undefined) {
      this.companyId = props.companyId;
    }

    Object.freeze(this);
  }

  /** Returns whether the memory entry has expired at the given tick. */
  isExpiredAt(tick: number): boolean {
    return this.expiresAtTick !== undefined && tick >= this.expiresAtTick;
  }
}
