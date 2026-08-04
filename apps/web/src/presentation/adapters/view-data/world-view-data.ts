/** Presentation view-data for the world map framework (Phase 4A). */

export type WorldMapRegionCellViewData = {
  readonly id: string;
  readonly name: string;
  readonly biomeId: string;
  readonly mapX: number;
  readonly mapY: number;
  readonly cityCount: number;
};

export type WorldMapConnectionViewData = {
  readonly fromRegionId: string;
  readonly toRegionId: string;
  readonly distanceLabel: string;
};

export type WorldMapViewData = {
  readonly mapId: string;
  readonly mapName: string;
  readonly columns: number;
  readonly rows: number;
  readonly cellSize: number;
  readonly regions: readonly WorldMapRegionCellViewData[];
  readonly connections: readonly WorldMapConnectionViewData[];
};

export type WorldLayerId =
  | 'grid'
  | 'regions'
  | 'connections'
  | 'labels'
  | 'selection'
  | 'resources'
  | 'buildings'
  | 'transport'
  | 'presence';

export type WorldLayerViewData = {
  readonly id: WorldLayerId;
  readonly label: string;
  readonly description: string;
  readonly enabled: boolean;
  readonly group: 'framework' | 'operations';
};

export type WorldBuildingMarkerViewData = {
  readonly id: string;
  readonly regionId: string;
  readonly label: string;
  readonly statusLabel: string;
  readonly x: number;
  readonly y: number;
};

export type WorldTransportFlowViewData = {
  readonly fromRegionId: string;
  readonly toRegionId: string;
  readonly intensity: number;
  readonly label: string;
};

export type WorldRegionMetricViewData = {
  readonly regionId: string;
  readonly resourceIntensity: number;
  readonly buildingCount: number;
  readonly activeTransportCount: number;
  readonly presenceLabel: string;
};

export type WorldOverlayViewData = {
  readonly regionMetrics: readonly WorldRegionMetricViewData[];
  readonly buildingMarkers: readonly WorldBuildingMarkerViewData[];
  readonly transportFlows: readonly WorldTransportFlowViewData[];
};

export const EMPTY_WORLD_OVERLAY: WorldOverlayViewData = Object.freeze({
  regionMetrics: Object.freeze([]),
  buildingMarkers: Object.freeze([]),
  transportFlows: Object.freeze([]),
});

export type WorldRegionOperationsViewData = {
  readonly buildings: readonly { readonly id: string; readonly name: string; readonly typeLabel: string; readonly statusLabel: string }[];
  readonly transports: readonly { readonly id: string; readonly label: string; readonly statusLabel: string }[];
  readonly productionJobs: readonly { readonly id: string; readonly recipeLabel: string; readonly statusLabel: string }[];
};

export type WorldInspectorSectionViewData = {
  readonly id: string;
  readonly title: string;
  readonly entries: readonly { readonly label: string; readonly value: string }[];
};

export type WorldInspectorViewData = {
  readonly title: string;
  readonly subtitle?: string;
  readonly entries: readonly { readonly label: string; readonly value: string }[];
  readonly sections: readonly WorldInspectorSectionViewData[];
  readonly relatedTitle?: string;
  readonly relatedItems?: readonly { readonly primary: string; readonly secondary: string }[];
};

export const WORLD_MAP_CELL_SIZE = 96;

export const DEFAULT_WORLD_LAYERS: readonly WorldLayerViewData[] = Object.freeze([
  Object.freeze({
    id: 'grid',
    label: 'Raster',
    description: 'Hilfsraster für Orientierung auf der Karte.',
    enabled: true,
    group: 'framework',
  }),
  Object.freeze({
    id: 'regions',
    label: 'Regionen',
    description: 'Regionen als interaktive Flächen.',
    enabled: true,
    group: 'framework',
  }),
  Object.freeze({
    id: 'connections',
    label: 'Verbindungen',
    description: 'Direkte Verbindungen zwischen Regionen.',
    enabled: true,
    group: 'framework',
  }),
  Object.freeze({
    id: 'labels',
    label: 'Beschriftungen',
    description: 'Regionenname und Biom auf der Karte.',
    enabled: true,
    group: 'framework',
  }),
  Object.freeze({
    id: 'selection',
    label: 'Auswahl',
    description: 'Hervorhebung der gewählten Region.',
    enabled: true,
    group: 'framework',
  }),
  Object.freeze({
    id: 'resources',
    label: 'Ressourcen',
    description: 'Regionale Ressourcenintensität als Heatmap.',
    enabled: false,
    group: 'operations',
  }),
  Object.freeze({
    id: 'buildings',
    label: 'Gebäude',
    description: 'Unternehmensgebäude auf der Karte.',
    enabled: true,
    group: 'operations',
  }),
  Object.freeze({
    id: 'transport',
    label: 'Transport',
    description: 'Aktive Transporte zwischen Regionen.',
    enabled: true,
    group: 'operations',
  }),
  Object.freeze({
    id: 'presence',
    label: 'Präsenz',
    description: 'Gebäudeanzahl je Region.',
    enabled: true,
    group: 'operations',
  }),
]);
