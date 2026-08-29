import type { ProductionJobSessionReadModel } from '@/presentation/adapters/api/client';
import type { ProductionHintViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type { EntitySelection } from '@/presentation/state/navigation-state';

/** Whether ProductionScreen should scope lists to the selected building. */
export function isProductionBuildingFilterActive(entitySelection: EntitySelection): boolean {
  return entitySelection.kind === 'building';
}

/** Resolves the active building context from navigation and authoritative job data. */
export function resolveProductionContextBuildingId(
  entitySelection: EntitySelection,
  jobs: readonly ProductionJobSessionReadModel[],
): string | null {
  if (entitySelection.kind === 'building') {
    return entitySelection.id;
  }

  if (entitySelection.kind === 'production') {
    const job = jobs.find((entry) => entry.id === entitySelection.id);
    return job?.buildingId ?? null;
  }

  return null;
}

export function filterProductionJobsByBuildingId(
  jobs: readonly ProductionJobSessionReadModel[],
  buildingId: string,
): readonly ProductionJobSessionReadModel[] {
  return Object.freeze(jobs.filter((job) => job.buildingId === buildingId));
}

export function filterProductionHintsByBuildingId(
  hints: readonly ProductionHintViewData[],
  buildingId: string,
): readonly ProductionHintViewData[] {
  return Object.freeze(hints.filter((hint) => hint.buildingId === buildingId));
}
