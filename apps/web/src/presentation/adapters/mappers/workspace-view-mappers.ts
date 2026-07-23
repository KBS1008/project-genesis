import type {
  EventLogEntryDto,
  RegionDetailsDto,
  RegionDto,
  SaveMetadataDto,
  SessionStatusDto,
  SimulationStatusDto,
  WorldOverviewDto,
} from '@/presentation/adapters/api/query-client';
import {
  formatNumber,
  formatTransactionAmount,
  formatTransactionType,
} from '@/presentation/formatting/presentation-formatters';
import type {
  FinanceTransactionReadModel,
  GameSessionDashboard,
  MarketPriceReadModel,
  ProductionJobSessionReadModel,
  ResearchJobSessionReadModel,
  TransportOrderSessionReadModel,
} from '@/presentation/adapters/api/client';
import { buildNameMap } from '@/presentation/adapters/api/client';
import type {
  EventLogRowViewData,
  FinanceRowViewData,
  JobRowViewData,
  MarketRowViewData,
  RegionDetailViewData,
  SaveSlotViewData,
  SessionStatusViewData,
  SimulationStatusViewData,
  WorldOverviewViewData,
  WorldRegionViewData,
  WorkspaceViewData,
} from '@/presentation/adapters/view-data/workspace-view-data';

export function mapSessionStatusViewData(dto: SessionStatusDto): SessionStatusViewData {
  return Object.freeze({
    hasGame: dto.hasActiveSession,
    companyId: dto.companyId,
    companyName: dto.companyName,
    playerId: dto.playerId,
    savePath: dto.savePath,
  });
}

export function mapSimulationStatusViewData(dto: SimulationStatusDto): SimulationStatusViewData {
  return Object.freeze({
    tickNumber: dto.hasActiveSession ? dto.tickNumber : null,
    simulationTime: dto.hasActiveSession ? dto.simulationTime : null,
    isPaused: dto.isPaused,
    speedMultiplier: dto.tickDuration,
    hasActiveSession: dto.hasActiveSession,
    speedLabel: dto.isPaused ? 'Pausiert' : `×${dto.tickDuration}`,
  });
}

export function mapSaveSlotViewData(dto: SaveMetadataDto): SaveSlotViewData {
  return Object.freeze({
    fileName: dto.fileName,
    filePath: dto.filePath,
    schemaVersionLabel:
      dto.schemaVersion === null ? 'Unbekannt' : `Schema V${dto.schemaVersion}`,
    tickLabel: dto.tickNumber === null ? '—' : String(dto.tickNumber),
    companyName: dto.companyName ?? 'Unbenannt',
    modifiedAtLabel:
      dto.modifiedAt === null
        ? '—'
        : new Date(dto.modifiedAt).toLocaleString('de-DE'),
  });
}

function mapRegionViewData(region: RegionDto): WorldRegionViewData {
  return Object.freeze({
    id: region.id,
    name: region.name,
    description: region.description,
    biomeId: region.biomeId,
    mapPositionLabel: `${region.mapX}, ${region.mapY}`,
    neighborCount: region.neighborRegionIds.length,
    cityCount: region.cityIds.length,
  });
}

export function mapWorldOverviewViewData(
  overview: WorldOverviewDto,
  regions: readonly RegionDto[],
): WorldOverviewViewData {
  const regionById = new Map(regions.map((region) => [region.id, region]));
  const mappedRegions = overview.regionIds
    .map((regionId) => regionById.get(regionId))
    .filter((region): region is RegionDto => region !== undefined)
    .map(mapRegionViewData);

  return Object.freeze({
    worldName: overview.worldName,
    regionCountLabel: String(overview.regionCount),
    cityCountLabel: String(overview.cityCount),
    regions: Object.freeze(mappedRegions),
  });
}

export function mapRegionDetailViewData(dto: RegionDetailsDto): RegionDetailViewData {
  return Object.freeze({
    id: dto.region.id,
    title: dto.region.name,
    description: dto.region.description,
    biomeId: dto.region.biomeId,
    resources: Object.freeze(
      dto.regionalResources.map((resource) =>
        Object.freeze({
          label: resource.resourceTypeId,
          amountLabel: `${resource.available.toLocaleString('de-DE')} (${resource.extractionModifier.toFixed(2)}×)`,
        }),
      ),
    ),
    cities: Object.freeze(
      dto.cities.map((city) =>
        Object.freeze({
          id: city.id,
          name: city.name,
          category: city.category,
        }),
      ),
    ),
  });
}

export function mapMarketRowsViewData(
  prices: readonly MarketPriceReadModel[],
  labelResource: (resourceId: string) => string,
): readonly MarketRowViewData[] {
  return Object.freeze(
    prices.map((price) =>
      Object.freeze({
        resourceId: price.resourceId,
        resourceLabel: labelResource(price.resourceId),
        lastPriceLabel: `${price.lastPrice.toLocaleString('de-DE')} GC`,
        trendLabel:
          price.trend === 'UP' ? 'Steigend' : price.trend === 'DOWN' ? 'Fallend' : 'Stabil',
        pressureLabel: price.pressureIndex.toFixed(2),
      }),
    ),
  );
}

export function mapProductionJobRowsViewData(
  jobs: readonly ProductionJobSessionReadModel[],
  labelRecipe: (recipeId: string) => string,
): readonly JobRowViewData[] {
  return Object.freeze(
    jobs.map((job) =>
      Object.freeze({
        id: job.id,
        title: labelRecipe(job.recipeId),
        statusLabel: job.awaitingTransport ? `${job.status} (Transport)` : job.status,
        progressLabel: `${Math.round(job.progress)}%`,
      }),
    ),
  );
}

export function mapResearchJobRowsViewData(
  jobs: readonly ResearchJobSessionReadModel[],
  labelTechnology: (technologyId: string) => string,
): readonly JobRowViewData[] {
  return Object.freeze(
    jobs.map((job) =>
      Object.freeze({
        id: job.id,
        title: labelTechnology(job.technologyId),
        statusLabel: job.status,
        progressLabel: `${Math.round(job.progress)}%`,
      }),
    ),
  );
}

export function mapTransportJobRowsViewData(
  orders: readonly TransportOrderSessionReadModel[],
): readonly JobRowViewData[] {
  return Object.freeze(
    orders.map((order) =>
      Object.freeze({
        id: order.id,
        title: `${order.sourceBuildingName} → ${order.destinationBuildingName}`,
        statusLabel: order.status,
        progressLabel: `${Math.round(order.progress)}%`,
      }),
    ),
  );
}

export function mapFinanceRowsViewData(
  transactions: readonly FinanceTransactionReadModel[],
): readonly FinanceRowViewData[] {
  return Object.freeze(
    transactions.map((transaction) =>
      Object.freeze({
        id: transaction.id,
        typeLabel: formatTransactionType(transaction.transactionType),
        amountLabel: formatTransactionAmount(transaction.direction, transaction.amount),
        balanceLabel: formatNumber(transaction.balanceAfter),
      }),
    ),
  );
}

export function mapEventLogRowsViewData(
  entries: readonly EventLogEntryDto[],
): readonly EventLogRowViewData[] {
  return Object.freeze(
    entries.map((entry) =>
      Object.freeze({
        id: entry.id,
        tickLabel: String(entry.tickNumber),
        category: entry.category,
        message: entry.message,
        severity: entry.severity,
      }),
    ),
  );
}

export function buildWorkspaceViewData(input: {
  readonly session: SessionStatusDto;
  readonly simulation: SimulationStatusDto;
  readonly worldOverview: WorldOverviewDto | null;
  readonly regions: readonly RegionDto[];
  readonly saves: readonly SaveMetadataDto[];
}): WorkspaceViewData {
  return Object.freeze({
    session: mapSessionStatusViewData(input.session),
    simulation: mapSimulationStatusViewData(input.simulation),
    world:
      input.worldOverview === null
        ? null
        : mapWorldOverviewViewData(input.worldOverview, input.regions),
    saves: Object.freeze(input.saves.map(mapSaveSlotViewData)),
  });
}

export function buildNameResolver(labels: {
  readonly resource: (resourceId: string) => string;
  readonly recipe: (recipeId: string) => string;
  readonly technology: (technologyId: string) => string;
}) {
  return {
    resource: labels.resource,
    recipe: labels.recipe,
    technology: labels.technology,
  };
}

/** @deprecated Use buildNameResolver with companyViewData.labels instead. */
export function buildNameResolverFromDashboard(dashboard: GameSessionDashboard | null) {
  if (dashboard === null) {
    return {
      resource: (resourceId: string) => resourceId,
      recipe: (recipeId: string) => recipeId,
      technology: (technologyId: string) => technologyId,
    };
  }

  return buildNameResolver(buildContentLabelsFromDashboard(dashboard));
}

function buildContentLabelsFromDashboard(dashboard: GameSessionDashboard) {
  const resources = buildNameMap(dashboard.contentNames.resources);
  const recipes = buildNameMap(dashboard.contentNames.recipes);
  const technologies = buildNameMap(dashboard.contentNames.technologies);

  return {
    resource: (resourceId: string) => resources.get(resourceId) ?? resourceId,
    recipe: (recipeId: string) => recipes.get(recipeId) ?? recipeId,
    technology: (technologyId: string) => technologies.get(technologyId) ?? technologyId,
  };
}

export function buildEntityCatalogRegionIds(regions: readonly RegionDto[]): ReadonlySet<string> {
  return new Set(regions.map((region) => region.id));
}
