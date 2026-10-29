import type { ProductionJobSessionReadModel } from '@/presentation/adapters/api/client';
import type { ProductionHintViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { mapProductionJobRowsViewData } from '@/presentation/adapters/mappers/workspace-view-mappers';
import { resolveProductionWorkforceStallGuidance } from '@/presentation/formatting/production-workforce-guidance';

/** Player-facing production summary for the world building inspector (GCL-S1). */
export type WorldBuildingInspectorProductionViewData = Readonly<{
  readonly headline: string;
  readonly productLabel: string | null;
  readonly progressPercent: number | null;
  readonly progressLabel: string | null;
  readonly stallDetail: string | null;
  readonly showOpenProductionAction: boolean;
}>;

export function isWorldBuildingProductionCapable(
  buildingId: string,
  productionHints: readonly ProductionHintViewData[],
  jobs: readonly ProductionJobSessionReadModel[],
): boolean {
  if (productionHints.some((hint) => hint.buildingId === buildingId)) {
    return true;
  }

  return jobs.some((job) => job.buildingId === buildingId && job.status !== 'FINISHED');
}

/** Selects the authoritative active job for one building (no cross-building leakage). */
export function selectPrimaryProductionJobForBuilding(
  jobs: readonly ProductionJobSessionReadModel[],
  buildingId: string,
): ProductionJobSessionReadModel | null {
  const scoped = jobs.filter(
    (job) => job.buildingId === buildingId && job.status !== 'FINISHED',
  );

  if (scoped.length === 0) {
    return null;
  }

  const priority = (job: ProductionJobSessionReadModel): number => {
    if (job.status === 'RUNNING') {
      return 0;
    }

    if (job.status === 'WAITING') {
      return 1;
    }

    return 2;
  };

  return [...scoped].sort(
    (left, right) => priority(left) - priority(right) || left.id.localeCompare(right.id),
  )[0]!;
}

export function resolveWorldBuildingProductionHeadline(
  job: ProductionJobSessionReadModel | null,
): string {
  if (job === null) {
    return 'Keine Produktion aktiv';
  }

  if (job.operationalState === 'STALLED_WORKFORCE') {
    return 'Produktion angehalten – Arbeitskräfte fehlen';
  }

  if (job.operationalState === 'STALLED_ENERGY') {
    return 'Produktion angehalten – Energie fehlt';
  }

  if (job.status === 'WAITING' && job.awaitingTransport) {
    return 'Produktion wartet auf Transport';
  }

  if (job.status === 'RUNNING' || job.status === 'WAITING') {
    return 'Produktion läuft';
  }

  return 'Keine Produktion aktiv';
}

export function buildWorldBuildingInspectorProductionViewData(
  buildingId: string,
  jobs: readonly ProductionJobSessionReadModel[],
  productionHints: readonly ProductionHintViewData[],
  labels: {
    readonly recipe: (recipeId: string) => string;
    readonly building: (buildingId: string) => string;
  },
): WorldBuildingInspectorProductionViewData | null {
  if (!isWorldBuildingProductionCapable(buildingId, productionHints, jobs)) {
    return null;
  }

  const primaryJob = selectPrimaryProductionJobForBuilding(jobs, buildingId);

  if (primaryJob === null) {
    return Object.freeze({
      headline: 'Keine Produktion aktiv',
      productLabel: null,
      progressPercent: null,
      progressLabel: null,
      stallDetail: null,
      showOpenProductionAction: true,
    });
  }

  const [mappedJob] = mapProductionJobRowsViewData([primaryJob], labels);
  const workforceGuidance = resolveProductionWorkforceStallGuidance(primaryJob.operationalState);
  const stalledEnergy = primaryJob.operationalState === 'STALLED_ENERGY';

  return Object.freeze({
    headline: resolveWorldBuildingProductionHeadline(primaryJob),
    productLabel: mappedJob?.title ?? labels.recipe(primaryJob.recipeId),
    progressPercent: mappedJob?.progressPercent ?? null,
    progressLabel: mappedJob?.progressLabel ?? null,
    stallDetail: workforceGuidance ?? (stalledEnergy ? mappedJob?.statusLabel ?? null : null),
    showOpenProductionAction: true,
  });
}
