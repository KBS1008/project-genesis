/**
 * @module @application/persistence/orderGameSaveSnapshotV3
 *
 * Deterministic ordering helpers for savegame schema version 3.
 */

import type {
  GameSaveCompanyBrainSnapshotV3,
  GameSaveCompanyDecisionSnapshotV3,
  GameSaveGoalSnapshotV3,
  GameSaveKnowledgeSnapshotV3,
  GameSaveMemorySnapshotV3,
  GameSaveRegionalMarketPriceHistorySnapshotV3,
  GameSaveRegionalMarketPriceSnapshotV3,
  GameSaveRegionalMarketSnapshotV3,
  GameSaveSnapshotV3,
} from './GameSaveSnapshotV3.js';

/** Sorts memory payload keys lexicographically for deterministic JSON. */
export function orderMemoryPayload(
  payload: Readonly<Record<string, string | number | boolean>>,
): Readonly<Record<string, string | number | boolean>> {
  return Object.freeze(
    Object.fromEntries(
      Object.entries(payload).sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey)),
    ),
  );
}

function compareGoals(left: GameSaveGoalSnapshotV3, right: GameSaveGoalSnapshotV3): number {
  return left.id.localeCompare(right.id);
}

function compareKnowledge(
  left: GameSaveKnowledgeSnapshotV3,
  right: GameSaveKnowledgeSnapshotV3,
): number {
  const kindCompare = left.kind.localeCompare(right.kind);

  if (kindCompare !== 0) {
    return kindCompare;
  }

  return left.id.localeCompare(right.id);
}

function compareMemory(left: GameSaveMemorySnapshotV3, right: GameSaveMemorySnapshotV3): number {
  if (left.observedAtTick !== right.observedAtTick) {
    return left.observedAtTick - right.observedAtTick;
  }

  return left.id.localeCompare(right.id);
}

function compareDecisionSnapshots(
  left: GameSaveCompanyDecisionSnapshotV3,
  right: GameSaveCompanyDecisionSnapshotV3,
): number {
  if (left.priority !== right.priority) {
    return right.priority - left.priority;
  }

  if (left.createdAtTick !== right.createdAtTick) {
    return left.createdAtTick - right.createdAtTick;
  }

  return left.id.localeCompare(right.id);
}

function compareRegionalMarkets(
  left: GameSaveRegionalMarketSnapshotV3,
  right: GameSaveRegionalMarketSnapshotV3,
): number {
  const regionCompare = left.regionId.localeCompare(right.regionId);

  if (regionCompare !== 0) {
    return regionCompare;
  }

  return left.id.localeCompare(right.id);
}

function comparePrices(
  left: GameSaveRegionalMarketPriceSnapshotV3,
  right: GameSaveRegionalMarketPriceSnapshotV3,
): number {
  return left.resourceId.localeCompare(right.resourceId);
}

function comparePriceHistory(
  left: GameSaveRegionalMarketPriceHistorySnapshotV3,
  right: GameSaveRegionalMarketPriceHistorySnapshotV3,
): number {
  if (left.tick !== right.tick) {
    return left.tick - right.tick;
  }

  return left.resourceId.localeCompare(right.resourceId);
}

function orderBrain(brain: GameSaveCompanyBrainSnapshotV3): GameSaveCompanyBrainSnapshotV3 {
  return Object.freeze({
    ...brain,
    goals: Object.freeze([...brain.goals].sort(compareGoals)),
    knowledge: Object.freeze([...brain.knowledge].sort(compareKnowledge)),
    memory: Object.freeze(
      [...brain.memory]
        .sort(compareMemory)
        .map((entry) =>
          Object.freeze({
            ...entry,
            payload: orderMemoryPayload(entry.payload),
          }),
        ),
    ),
    decisionQueue: Object.freeze([...brain.decisionQueue].sort(compareDecisionSnapshots)),
  });
}

function orderRegionalMarket(
  market: GameSaveRegionalMarketSnapshotV3,
): GameSaveRegionalMarketSnapshotV3 {
  return Object.freeze({
    ...market,
    prices: Object.freeze([...market.prices].sort(comparePrices)),
    priceHistory: Object.freeze([...market.priceHistory].sort(comparePriceHistory)),
  });
}

/** Returns a snapshot with all V3 arrays in canonical deterministic order. */
export function orderGameSaveSnapshotV3(snapshot: GameSaveSnapshotV3): GameSaveSnapshotV3 {
  return Object.freeze({
    ...snapshot,
    companies: Object.freeze(
      [...snapshot.companies].sort((left, right) => left.id.localeCompare(right.id)),
    ),
    companyBrains: Object.freeze(
      [...snapshot.companyBrains]
        .sort((left, right) => {
          const companyCompare = left.companyId.localeCompare(right.companyId);

          if (companyCompare !== 0) {
            return companyCompare;
          }

          return left.brainId.localeCompare(right.brainId);
        })
        .map(orderBrain),
    ),
    regionalMarkets: Object.freeze(
      [...snapshot.regionalMarkets].sort(compareRegionalMarkets).map(orderRegionalMarket),
    ),
  });
}
