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
    expect(RUNTIME_VISUAL_ASSET_IDS.length).toBeGreaterThanOrEqual(16);
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
