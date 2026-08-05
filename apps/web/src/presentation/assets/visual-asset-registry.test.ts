import { describe, expect, it } from 'vitest';
import {
  DASHBOARD_MOCKUP_COMPONENT_MAP,
  getVisualAssetEntry,
  listVisualAssetsByCategory,
  PRELOAD_VISUAL_ASSET_IDS,
  RUNTIME_VISUAL_ASSET_IDS,
  VISUAL_ASSET_REGISTRY,
} from '@/presentation/assets';

describe('visual-asset-registry', () => {
  it('classifies every approved main-menu asset as runtime', () => {
    for (const assetId of ['MM-001', 'MM-002', 'MM-003', 'MM-004', 'MM-005', 'MM-006', 'MM-007']) {
      const entry = getVisualAssetEntry(assetId);
      expect(entry?.category).toBe('runtime');
      expect(entry?.path).toMatch(/^\/assets\//);
    }
  });

  it('classifies dashboard mockups as reference assets with PG components', () => {
    const references = listVisualAssetsByCategory('reference').filter((asset) =>
      asset.id.startsWith('DB-'),
    );

    expect(references).toHaveLength(10);
    expect(references.every((asset) => asset.path === null)).toBe(true);
    expect(references.every((asset) => asset.runtimeComponent !== null)).toBe(true);
  });

  it('maps dashboard mockups to PG components', () => {
    expect(DASHBOARD_MOCKUP_COMPONENT_MAP).toHaveLength(10);
    expect(DASHBOARD_MOCKUP_COMPONENT_MAP.find((entry) => entry.mockupId === 'DB-005')?.component).toBe(
      'PGFinanceWidget',
    );
  });

  it('marks critical boot assets for preload', () => {
    expect(PRELOAD_VISUAL_ASSET_IDS).toEqual(expect.arrayContaining(['MM-001', 'MM-006', 'MM-007']));
    expect(RUNTIME_VISUAL_ASSET_IDS.length).toBeGreaterThanOrEqual(7);
  });

  it('assigns exactly one category per registry entry', () => {
    for (const entry of Object.values(VISUAL_ASSET_REGISTRY)) {
      expect(['runtime', 'reference', 'svg-runtime', 'documentation']).toContain(entry.category);
    }
  });
});
