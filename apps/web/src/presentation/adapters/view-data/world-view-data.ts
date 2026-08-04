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

export type WorldLayerId = 'grid' | 'regions' | 'connections' | 'labels' | 'selection';

export type WorldLayerViewData = {
  readonly id: WorldLayerId;
  readonly label: string;
  readonly description: string;
  readonly enabled: boolean;
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
  }),
  Object.freeze({
    id: 'regions',
    label: 'Regionen',
    description: 'Regionen als interaktive Flächen.',
    enabled: true,
  }),
  Object.freeze({
    id: 'connections',
    label: 'Verbindungen',
    description: 'Direkte Verbindungen zwischen Regionen.',
    enabled: true,
  }),
  Object.freeze({
    id: 'labels',
    label: 'Beschriftungen',
    description: 'Regionenname und Biom auf der Karte.',
    enabled: true,
  }),
  Object.freeze({
    id: 'selection',
    label: 'Auswahl',
    description: 'Hervorhebung der gewählten Region.',
    enabled: true,
  }),
]);
