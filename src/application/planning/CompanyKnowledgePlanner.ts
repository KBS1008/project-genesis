/**
 * @module @application/planning/CompanyKnowledgePlanner
 *
 * Converts observations into knowledge and memory entries for a company brain.
 */

import {
  KnowledgeEntry as KnowledgeEntryEntity,
  type KnowledgeEntry,
} from '../../domain/brain/KnowledgeEntry.js';
import { KnowledgeKind } from '../../domain/brain/KnowledgeKind.js';
import { createKnowledgeEntryId } from '../../domain/brain/KnowledgeEntryId.js';
import { knowledgeNumber } from '../../domain/brain/KnowledgeValue.js';
import {
  MemoryEntry as MemoryEntryEntity,
  type MemoryEntry,
} from '../../domain/brain/MemoryEntry.js';
import { MemoryKind } from '../../domain/brain/MemoryKind.js';
import { createMemoryEntryId } from '../../domain/brain/MemoryEntryId.js';
import { createMemoryPayload } from '../../domain/brain/MemoryPayload.js';
import { PLANNING_MEMORY_RETENTION_TICKS } from './PlanningConstants.js';
import type { PlanningObservation } from './PlanningObservation.js';

function requireKnowledgeEntryId(value: string) {
  const result = createKnowledgeEntryId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireMemoryEntryId(value: string) {
  const result = createMemoryEntryId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

/** Knowledge and memory artefacts derived from observation. */
export type ObservationKnowledgeDraft = {
  readonly knowledgeEntries: readonly KnowledgeEntry[];
  readonly memoryEntries: readonly MemoryEntry[];
};

/**
 * Builds knowledge and memory updates from observable state.
 */
export class CompanyKnowledgePlanner {
  /** Creates knowledge and memory entries from an observation. */
  plan(observation: PlanningObservation): ObservationKnowledgeDraft {
    const knowledgeEntries: KnowledgeEntry[] = [];
    const memoryEntries: MemoryEntry[] = [];

    for (const regionId of observation.regionIds) {
      knowledgeEntries.push(
        new KnowledgeEntryEntity({
          id: requireKnowledgeEntryId(`knowledge_${observation.companyId}_region_${regionId}`),
          kind: KnowledgeKind.DISCOVERED_REGION,
          key: `discovered_region:${regionId}`,
          observedAtTick: observation.tickNumber,
          value: knowledgeNumber(1),
          regionId,
        }),
      );
    }

    for (const price of observation.marketPrices) {
      const knowledgeId = `knowledge_${observation.companyId}_price_${price.regionId}_${price.resourceId}`;

      knowledgeEntries.push(
        new KnowledgeEntryEntity({
          id: requireKnowledgeEntryId(knowledgeId),
          kind: KnowledgeKind.MARKET_PRICE,
          key: `market_price:${price.resourceId}:${price.regionId}`,
          observedAtTick: observation.tickNumber,
          value: knowledgeNumber(price.lastPrice),
          regionId: price.regionId,
          resourceId: price.resourceId,
        }),
      );

      memoryEntries.push(
        new MemoryEntryEntity({
          id: requireMemoryEntryId(
            `memory_${observation.companyId}_price_${price.regionId}_${price.resourceId}_${observation.tickNumber}`,
          ),
          kind: MemoryKind.HISTORICAL_PRICE,
          observedAtTick: observation.tickNumber,
          expiresAtTick: observation.tickNumber + PLANNING_MEMORY_RETENTION_TICKS,
          payload: createMemoryPayload({
            price: price.lastPrice,
            basePrice: price.basePrice,
          }),
          regionId: price.regionId,
          resourceId: price.resourceId,
        }),
      );
    }

    for (const line of observation.inventory) {
      knowledgeEntries.push(
        new KnowledgeEntryEntity({
          id: requireKnowledgeEntryId(`knowledge_${observation.companyId}_stock_${line.resourceId}`),
          kind: KnowledgeKind.AVAILABLE_RESOURCE,
          key: `available_resource:${line.resourceId}`,
          observedAtTick: observation.tickNumber,
          value: knowledgeNumber(line.available),
          resourceId: line.resourceId,
        }),
      );
    }

    return Object.freeze({
      knowledgeEntries: Object.freeze(knowledgeEntries),
      memoryEntries: Object.freeze(memoryEntries),
    });
  }
}
