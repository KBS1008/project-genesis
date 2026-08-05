import type {
  VisualAssetEntry,
  VisualAssetFormat,
  VisualAssetPriority,
  VisualAssetThemeVariant,
  VisualAssetThemePaths,
} from '@/presentation/assets/visual-asset-types';

const MAIN_MENU_BASE = '/assets/main-menu';
const CHARTS_BASE = '/assets/charts';

function entry(
  partial: Omit<VisualAssetEntry, 'fallbackId' | 'themeVariants' | 'webp'> & {
    readonly fallbackId?: string | null;
    readonly themeVariants?: VisualAssetThemePaths | null;
    readonly webp?: string | null;
  },
): VisualAssetEntry {
  return Object.freeze({
    fallbackId: null,
    themeVariants: null,
    webp: null,
    ...partial,
  });
}

function runtimePng(
  id: string,
  config: {
    readonly label: string;
    readonly component: string;
    readonly preload: boolean;
    readonly priority: VisualAssetPriority;
    readonly designSource: string;
    readonly notes?: string | null;
    readonly theme?: VisualAssetThemeVariant;
    readonly themeVariants?: VisualAssetThemePaths | null;
    readonly baseDir?: string;
  },
): VisualAssetEntry {
  const baseDir = config.baseDir ?? MAIN_MENU_BASE;

  return entry({
    id,
    label: config.label,
    type: 'runtime',
    component: config.component,
    format: 'png',
    path: `${baseDir}/${id}.png`,
    webp: `${baseDir}/${id}.webp`,
    theme: config.theme ?? 'default',
    themeVariants: config.themeVariants ?? null,
    priority: config.priority,
    preload: config.preload,
    designSource: config.designSource,
    notes: config.notes ?? null,
  });
}

function referenceMockup(
  id: string,
  config: {
    readonly label: string;
    readonly component: string;
    readonly designSource: string;
    readonly notes?: string | null;
    readonly format?: VisualAssetFormat;
  },
): VisualAssetEntry {
  return entry({
    id,
    label: config.label,
    type: 'reference',
    component: config.component,
    format: config.format ?? 'png',
    path: null,
    theme: 'default',
    priority: 'high',
    preload: false,
    designSource: config.designSource,
    notes: config.notes ?? null,
  });
}

/** Central registry for all approved visual assets (Phase 4C). */
export const VISUAL_ASSET_REGISTRY: Readonly<Record<string, VisualAssetEntry>> = Object.freeze({
  'MM-001': runtimePng('MM-001', {
    label: 'Main Menu Background',
    component: 'MainMenuScreen',
    priority: 'critical',
    preload: true,
    designSource: 'docs/design/Bilder/einzelne_bilder/hochgeladen/MM-001_Main_Menu_Final.png',
    notes: 'Decorative background only — UI text rendered in React.',
  }),
  'MM-002': runtimePng('MM-002', {
    label: 'New Game Panel Reference',
    component: 'NewGamePanel',
    priority: 'normal',
    preload: false,
    designSource: 'docs/design/Bilder/einzelne_bilder/hochgeladen/MM-002_New_Game_Dialog_v1.png',
    notes: 'Layout reference; panel uses React form controls.',
  }),
  'MM-003': runtimePng('MM-003', {
    label: 'Load Game Panel Reference',
    component: 'LoadGamePanel',
    priority: 'normal',
    preload: false,
    designSource: 'docs/design/Bilder/einzelne_bilder/hochgeladen/MM-003_Load_Game_v1.png',
    notes: 'Layout reference; save list rendered dynamically.',
  }),
  'MM-004': runtimePng('MM-004', {
    label: 'Settings Panel Reference',
    component: 'SettingsPanel',
    priority: 'normal',
    preload: false,
    designSource: 'docs/design/Bilder/einzelne_bilder/hochgeladen/MM-004_Settings_v1.png',
    notes: 'Layout reference; settings bound to theme + localStorage.',
  }),
  'MM-005': runtimePng('MM-005', {
    label: 'Credits Panel Reference',
    component: 'CreditsPanel',
    priority: 'normal',
    preload: false,
    designSource: 'docs/design/Bilder/einzelne_bilder/hochgeladen/MM-005_Credits.png.png',
    notes: 'Layout reference; credits text from menu-credits-data.',
  }),
  'MM-006': runtimePng('MM-006', {
    label: 'Splash Screen Background',
    component: 'SplashScreen',
    priority: 'critical',
    preload: true,
    designSource: 'docs/design/Bilder/einzelne_bilder/hochgeladen/MM-006_Splash.png',
    notes: 'Startup splash background with React branding overlay.',
  }),
  'MM-007': runtimePng('MM-007', {
    label: 'Loading Screen Background',
    component: 'MenuLoadingScreen',
    priority: 'critical',
    preload: true,
    designSource: 'docs/design/Bilder/einzelne_bilder/hochgeladen/MM-007_Loading.png',
    notes: 'Loading phase background while session status is fetched.',
  }),
  'BR-001': entry({
    id: 'BR-001',
    label: 'Project Genesis Brand Mark',
    type: 'runtime',
    component: 'SplashScreen',
    format: 'png',
    path: `${MAIN_MENU_BASE}/MM-006.png`,
    webp: `${MAIN_MENU_BASE}/MM-006.webp`,
    theme: 'default',
    priority: 'high',
    preload: true,
    designSource: 'docs/design/Bilder/einzelne_bilder/hochgeladen/MM-006_Splash.png',
    notes: 'Brand mark sourced from splash art until dedicated logo asset exists.',
  }),

  'DB-001': referenceMockup('DB-001', {
    label: 'Executive Dashboard Mockup',
    component: 'ExecutiveDashboardScreen',
    designSource: 'docs/design/Mockups/dashboard/DB-001_Executive_Dashboard.png',
    notes: 'Reference only — rendered by PG dashboard grid + charts.',
  }),
  'DB-002': referenceMockup('DB-002', {
    label: 'KPI Cards Mockup',
    component: 'PGKpiCard',
    designSource: 'docs/design/Mockups/dashboard/DB-002_KPI_Cards.png',
  }),
  'DB-003': referenceMockup('DB-003', {
    label: 'Status Panel Mockup',
    component: 'PGStatusPanel',
    designSource: 'docs/design/Mockups/dashboard/DB-003_Status_Panel.png',
  }),
  'DB-004': referenceMockup('DB-004', {
    label: 'Notifications Mockup',
    component: 'PGNotificationCenter',
    designSource: 'docs/design/Mockups/dashboard/DB-004_Notifications.png',
  }),
  'DB-005': referenceMockup('DB-005', {
    label: 'Finance Widget Mockup',
    component: 'PGFinanceWidget',
    designSource: 'docs/design/Mockups/dashboard/DB-005_Finance_Widget.png',
  }),
  'DB-006': referenceMockup('DB-006', {
    label: 'Production Widget Mockup',
    component: 'PGProductionWidget',
    designSource: 'docs/design/Mockups/dashboard/DB-006_Production_Widget.png',
  }),
  'DB-007': referenceMockup('DB-007', {
    label: 'Research Widget Mockup',
    component: 'PGResearchWidget',
    designSource: 'docs/design/Mockups/dashboard/DB-007_Research_Widget.png',
  }),
  'DB-008': referenceMockup('DB-008', {
    label: 'Supply Chain Widget Mockup',
    component: 'PGSupplyChainWidget',
    designSource: 'docs/design/Mockups/dashboard/DB-008_Transport_Widget.png',
  }),
  'DB-009': referenceMockup('DB-009', {
    label: 'Company Overview Mockup',
    component: 'PGCompanyWidget',
    designSource: 'docs/design/Mockups/dashboard/DB-009_Company_Overview.png',
  }),
  'DB-010': referenceMockup('DB-010', {
    label: 'Dashboard Report Mockup',
    component: 'PGReportWidget',
    designSource: 'docs/design/Mockups/dashboard/DB-010_Dashboard.png',
  }),

  'CH-010': entry({
    id: 'CH-010',
    label: 'Chart Style Reference SVG',
    type: 'svg-runtime',
    component: 'PGChartWidget',
    format: 'svg',
    path: `${CHARTS_BASE}/CH-010_Charts.svg`,
    theme: 'default',
    priority: 'normal',
    preload: false,
    designSource: 'docs/design/Bilder/einzelne_bilder/hochgeladen/CH-010_Charts.svg',
    notes: 'Style reference; charts render via Recharts + design tokens.',
  }),
  'WM-SVG-GRID': entry({
    id: 'WM-SVG-GRID',
    label: 'World Grid Overlay',
    type: 'svg-runtime',
    component: 'PGWorldCanvas',
    format: 'svg',
    path: null,
    theme: 'default',
    priority: 'high',
    preload: false,
    designSource: null,
    notes: 'Procedural SVG grid layer — token-driven stroke.',
  }),
  'WM-SVG-LEGEND': entry({
    id: 'WM-SVG-LEGEND',
    label: 'World Legend Swatches',
    type: 'svg-runtime',
    component: 'PGWorldLegend',
    format: 'svg',
    path: null,
    theme: 'default',
    priority: 'normal',
    preload: false,
    designSource: null,
    notes: 'CSS swatch legend bound to active map layers.',
  }),

  'WM-001': referenceMockup('WM-001', {
    label: 'World Map Mockup',
    component: 'PGWorldCanvas',
    designSource: 'docs/design/mockups/world/WM-001_World_Map.png',
    notes: 'Planned mockup — runtime uses procedural SVG map (Phase 4A/4B).',
  }),
  'WM-002': referenceMockup('WM-002', {
    label: 'Region View Mockup',
    component: 'PGWorldInspector',
    designSource: 'docs/design/mockups/world/WM-002_Region_View.png',
    notes: 'Planned mockup — inspector uses PGInspectorPanel sections.',
  }),
});

export const RUNTIME_VISUAL_ASSET_IDS = Object.freeze(
  Object.values(VISUAL_ASSET_REGISTRY)
    .filter((asset) => asset.type === 'runtime' && asset.path !== null)
    .map((asset) => asset.id),
);

export const PRELOAD_VISUAL_ASSET_IDS = Object.freeze(
  Object.values(VISUAL_ASSET_REGISTRY)
    .filter((asset) => asset.preload && asset.path !== null)
    .map((asset) => asset.id),
);

export function getVisualAssetEntry(assetId: string): VisualAssetEntry | null {
  return VISUAL_ASSET_REGISTRY[assetId] ?? null;
}

export function listVisualAssetsByType(
  type: VisualAssetEntry['type'],
): readonly VisualAssetEntry[] {
  return Object.freeze(Object.values(VISUAL_ASSET_REGISTRY).filter((asset) => asset.type === type));
}

/** @deprecated Use listVisualAssetsByType */
export function listVisualAssetsByCategory(
  category: VisualAssetEntry['type'],
): readonly VisualAssetEntry[] {
  return listVisualAssetsByType(category);
}
