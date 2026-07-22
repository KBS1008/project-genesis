/**
 * @module @application/planning/PlanningDraft
 *
 * In-memory planning artefacts produced before they are applied to a brain.
 */

import type { CompanyDecision } from '../../domain/brain/CompanyDecision.js';
import type { Goal } from '../../domain/brain/Goal.js';
import type { KnowledgeEntry } from '../../domain/brain/KnowledgeEntry.js';
import type { MemoryEntry } from '../../domain/brain/MemoryEntry.js';

/** Planning artefacts awaiting application to a company brain. */
export type PlanningDraft = {
  readonly knowledgeEntries: readonly KnowledgeEntry[];
  readonly memoryEntries: readonly MemoryEntry[];
  readonly goals: readonly Goal[];
  readonly decisions: readonly CompanyDecision[];
};

/** Creates an empty planning draft. */
export function emptyPlanningDraft(): PlanningDraft {
  return Object.freeze({
    knowledgeEntries: Object.freeze([]),
    memoryEntries: Object.freeze([]),
    goals: Object.freeze([]),
    decisions: Object.freeze([]),
  });
}

/** Merges multiple drafts in deterministic order. */
export function mergePlanningDrafts(drafts: readonly PlanningDraft[]): PlanningDraft {
  const knowledgeEntries: KnowledgeEntry[] = [];
  const memoryEntries: MemoryEntry[] = [];
  const goals: Goal[] = [];
  const decisions: CompanyDecision[] = [];

  for (const draft of drafts) {
    knowledgeEntries.push(...draft.knowledgeEntries);
    memoryEntries.push(...draft.memoryEntries);
    goals.push(...draft.goals);
    decisions.push(...draft.decisions);
  }

  return Object.freeze({
    knowledgeEntries: Object.freeze(knowledgeEntries),
    memoryEntries: Object.freeze(memoryEntries),
    goals: Object.freeze(goals),
    decisions: Object.freeze(decisions),
  });
}
