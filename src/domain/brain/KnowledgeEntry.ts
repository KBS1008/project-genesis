/**
 * @module @domain/brain/KnowledgeEntry
 *
 * Immutable observable fact known by a company.
 */

import type { KnowledgeEntryId } from './KnowledgeEntryId.js';
import type { KnowledgeKind } from './KnowledgeKind.js';
import type { KnowledgeValue } from './KnowledgeValue.js';

/** Properties required to construct a knowledge entry. */
export type KnowledgeEntryProps = {
  readonly id: KnowledgeEntryId;
  readonly kind: KnowledgeKind;
  readonly key: string;
  readonly observedAtTick: number;
  readonly value: KnowledgeValue;
  readonly regionId?: string;
  readonly resourceId?: string;
  readonly companyId?: string;
  readonly technologyId?: string;
};

/**
 * Immutable knowledge entry representing observable simulation information.
 */
export class KnowledgeEntry {
  readonly id: KnowledgeEntryId;
  readonly kind: KnowledgeKind;
  readonly key: string;
  readonly observedAtTick: number;
  readonly value: KnowledgeValue;
  readonly regionId?: string;
  readonly resourceId?: string;
  readonly companyId?: string;
  readonly technologyId?: string;

  constructor(props: KnowledgeEntryProps) {
    this.id = props.id;
    this.kind = props.kind;
    this.key = props.key;
    this.observedAtTick = props.observedAtTick;
    this.value = props.value;

    if (props.regionId !== undefined) {
      this.regionId = props.regionId;
    }

    if (props.resourceId !== undefined) {
      this.resourceId = props.resourceId;
    }

    if (props.companyId !== undefined) {
      this.companyId = props.companyId;
    }

    if (props.technologyId !== undefined) {
      this.technologyId = props.technologyId;
    }

    Object.freeze(this);
  }
}
