import { describe, expect, it } from 'vitest';
import {
  DASHBOARD_MOCKUP_COMPONENT_MAP,
  getVisualAssetEntry,
  listVisualAssetsByType,
  PRELOAD_VISUAL_ASSET_IDS,
  RUNTIME_VISUAL_ASSET_IDS,
  VISUAL_ASSET_REGISTRY,
} from '@/presentation/assets';

describe('visual-asset-registry', () => {
  it('classifies every approved main-menu asset as runtime with format metadata', () => {
    for (const assetId of ['MM-001', 'MM-002', 'MM-003', 'MM-004', 'MM-005', 'MM-006', 'MM-007']) {
      const entry = getVisualAssetEntry(assetId);
      expect(entry?.type).toBe('runtime');
      expect(entry?.format).toBe('png');
      expect(entry?.path).toMatch(/^\/assets\//);
      expect(entry?.webp).toBe(`/assets/main-menu/${assetId}.webp`);
      expect(entry?.component).not.toBeNull();
      expect(entry?.theme).toBe('default');
    }
  });

  it('registers MM-006 with splash component and preload flag', () => {
    expect(getVisualAssetEntry('MM-006')).toMatchObject({
      type: 'runtime',
      component: 'SplashScreen',
      preload: true,
      format: 'png',
      webp: '/assets/main-menu/MM-006.webp',
    });
  });

  it('classifies dashboard mockups as reference assets with PG components', () => {
    const references = listVisualAssetsByType('reference').filter((asset) => asset.id.startsWith('DB-'));

    expect(references).toHaveLength(10);
    expect(references.every((asset) => asset.path === null)).toBe(true);
    expect(references.every((asset) => asset.component !== null)).toBe(true);
  });

  it('maps dashboard mockups to PG components', () => {
    expect(DASHBOARD_MOCKUP_COMPONENT_MAP).toHaveLength(10);
    expect(DASHBOARD_MOCKUP_COMPONENT_MAP.find((entry) => entry.mockupId === 'DB-005')?.component).toBe(
      'PGFinanceWidget',
    );
  });

  it('marks critical boot assets for preload', () => {
    expect(PRELOAD_VISUAL_ASSET_IDS).toEqual(expect.arrayContaining(['MM-001', 'MM-006', 'MM-007']));
    expect(RUNTIME_VISUAL_ASSET_IDS.length).toBeGreaterThanOrEqual(28);
  });

  it('registers ICON-003 batch-1 building type art with category fallback', () => {
    const entry = getVisualAssetEntry('ICON-003-sawmill');
    expect(entry).toMatchObject({
      type: 'runtime',
      format: 'png',
      component: 'BuildingTypeIcon',
      path: '/assets/buildings/ICON-003-sawmill.png',
      webp: '/assets/buildings/ICON-003-sawmill.webp',
      fallbackId: 'ICON-002-production',
    });

    expect(getVisualAssetEntry('ICON-003-sawmill-compact')).toMatchObject({
      type: 'runtime',
      format: 'svg',
      path: '/assets/buildings/ICON-003-sawmill-compact.svg',
    });
  });

  it('registers ICON-003 batch-2 building type art with category fallback', () => {
    expect(getVisualAssetEntry('ICON-003-assembly_plant')).toMatchObject({
      type: 'runtime',
      format: 'png',
      component: 'BuildingTypeIcon',
      path: '/assets/buildings/ICON-003-assembly_plant.png',
      webp: '/assets/buildings/ICON-003-assembly_plant.webp',
      fallbackId: 'ICON-002-production',
      designSource: 'docs/design/buildings/production/batch-2/primary/ICON-003-assembly_plant.png',
    });

    expect(getVisualAssetEntry('ICON-003-university-compact')).toMatchObject({
      type: 'runtime',
      format: 'svg',
      path: '/assets/buildings/ICON-003-university-compact.svg',
    });
  });

  it('registers ICON-003 batch-3 building type art with category fallback', () => {
    expect(getVisualAssetEntry('ICON-003-maintenance_facility')).toMatchObject({
      type: 'runtime',
      format: 'png',
      component: 'BuildingTypeIcon',
      path: '/assets/buildings/ICON-003-maintenance_facility.png',
      webp: '/assets/buildings/ICON-003-maintenance_facility.webp',
      fallbackId: 'ICON-002-infrastructure',
      designSource: 'docs/design/buildings/production/batch-3/primary/ICON-003-maintenance_facility.png',
    });
  });

  it('registers ICON-003 infrastructure building type art with category fallback', () => {
    expect(getVisualAssetEntry('ICON-003-access_road')).toMatchObject({
      type: 'runtime',
      format: 'png',
      component: 'BuildingTypeIcon',
      path: '/assets/buildings/ICON-003-access_road.png',
      webp: '/assets/buildings/ICON-003-access_road.webp',
      fallbackId: 'ICON-002-infrastructure',
      designSource: 'docs/design/buildings/production/infrastructure/primary/ICON-003-access_road.png',
    });

    expect(getVisualAssetEntry('ICON-003-port-compact')).toMatchObject({
      type: 'runtime',
      format: 'svg',
      path: '/assets/buildings/ICON-003-port-compact.svg',
    });
  });

  it('registers ICON-004 batch-1 research technology art', () => {
    expect(getVisualAssetEntry('ICON-004-precision_machining-primary')).toMatchObject({
      type: 'runtime',
      component: 'TechnologyVisual',
      path: '/assets/research/ICON-004-precision_machining-primary.png',
      fallbackId: 'ICON-004-category-PRODUCTION',
    });

    expect(getVisualAssetEntry('ICON-004-category-ELECTRONICS')).toMatchObject({
      type: 'runtime',
      format: 'svg',
      path: '/assets/research/ICON-004-category-ELECTRONICS.svg',
      fallbackId: 'ICON-002-research',
    });
  });

  it('registers ICON-002 building category icons as runtime SVG assets', () => {
    for (const category of [
      'production',
      'energy',
      'storage',
      'infrastructure',
      'administration',
      'research',
    ]) {
      const assetId = `ICON-002-${category}`;
      const entry = getVisualAssetEntry(assetId);

      expect(entry).toMatchObject({
        type: 'runtime',
        format: 'svg',
        preload: false,
        component: 'BuildingCategoryIcon',
        path: `/assets/icons/${assetId}.svg`,
        webp: null,
      });
    }
  });

  it('registers ICON-001 resource icons as runtime assets with icon paths', () => {
    for (const resourceId of [
      'wood',
      'planks',
      'stone',
      'iron_ore',
      'steel',
      'machine_parts',
      'advanced_electronics',
      'industrial_machinery',
      'consumer_goods',
    ]) {
      const assetId = `ICON-001-${resourceId}`;
      const entry = getVisualAssetEntry(assetId);

      expect(entry).toMatchObject({
        type: 'runtime',
        format: 'png',
        preload: false,
        component: 'PGInventoryWidget',
        path: `/assets/icons/${assetId}.png`,
        webp: `/assets/icons/${assetId}.webp`,
      });
    }
  });

  it('assigns exactly one type per registry entry', () => {
    for (const entry of Object.values(VISUAL_ASSET_REGISTRY)) {
      expect(['runtime', 'reference', 'svg-runtime', 'documentation']).toContain(entry.type);
    }
  });
});
