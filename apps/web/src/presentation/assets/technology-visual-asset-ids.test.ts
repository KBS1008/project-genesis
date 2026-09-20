import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getVisualAssetEntry } from '@/presentation/assets/visual-asset-registry';
import {
  ICON_004_BATCH_1_DETAILED_TECHNOLOGY_IDS,
  ICON_004_BATCH_2_DETAILED_TECHNOLOGY_IDS,
  ICON_004_BATCH_3_DETAILED_TECHNOLOGY_IDS,
  ICON_004_BATCH_4_ABSTRACT_DETAILED_TECHNOLOGY_IDS,
  ICON_004_DETAILED_TECHNOLOGY_IDS,
  ICON_004_TECHNOLOGY_CATEGORY_BY_ID,
  ICON_004_USED_TECHNOLOGY_CATEGORIES,
  resolveIcon004TechnologyVisualAssetIds,
  technologyCategoryToIcon004CompactAssetId,
  technologyToIcon004PrimaryAssetId,
} from '@/presentation/assets/technology-visual-asset-ids';

const projectRoot = path.resolve(import.meta.dirname, '../../../../..');
const publicResearch = path.join(projectRoot, 'apps/web/public/assets/research');

describe('technology-visual-asset-ids', () => {
  it('maps 22 enabled technologies to categories', () => {
    expect(Object.keys(ICON_004_TECHNOLOGY_CATEGORY_BY_ID).length).toBe(22);
  });

  it('resolves detailed primaries for all twenty-two technologies', () => {
    expect(ICON_004_DETAILED_TECHNOLOGY_IDS.length).toBe(22);
    expect(ICON_004_BATCH_1_DETAILED_TECHNOLOGY_IDS.length).toBe(8);
    expect(ICON_004_BATCH_2_DETAILED_TECHNOLOGY_IDS.length).toBe(6);
    expect(ICON_004_BATCH_3_DETAILED_TECHNOLOGY_IDS.length).toBe(4);
    expect(ICON_004_BATCH_4_ABSTRACT_DETAILED_TECHNOLOGY_IDS.length).toBe(4);

    for (const technologyId of ICON_004_DETAILED_TECHNOLOGY_IDS) {
      expect(technologyToIcon004PrimaryAssetId(technologyId)).toBe(
        `ICON-004-${technologyId}-primary`,
      );
    }
  });

  it('resolves category compacts for used categories only', () => {
    for (const category of ICON_004_USED_TECHNOLOGY_CATEGORIES) {
      expect(technologyCategoryToIcon004CompactAssetId(category)).toBe(
        `ICON-004-category-${category}`,
      );
    }

    expect(technologyCategoryToIcon004CompactAssetId('BUILDING')).toBeNull();
  });

  it('falls back to generic research for unknown technology', () => {
    expect(resolveIcon004TechnologyVisualAssetIds('unknown_tech_xyz')).toEqual({
      primaryAssetId: null,
      categoryAssetId: null,
      fallbackAssetId: 'ICON-002-research',
    });
  });

  it('maps every enabled technology to a detailed primary and category compact', () => {
    for (const technologyId of Object.keys(ICON_004_TECHNOLOGY_CATEGORY_BY_ID)) {
      const resolved = resolveIcon004TechnologyVisualAssetIds(technologyId);
      expect(resolved.primaryAssetId).toBe(`ICON-004-${technologyId}-primary`);
      const category = ICON_004_TECHNOLOGY_CATEGORY_BY_ID[technologyId]!;
      expect(resolved.categoryAssetId).toBe(`ICON-004-category-${category}`);
    }
  });
});

describe('ICON-004 production registry and files', () => {
  it('registers twenty-two detailed primaries and ten category glyphs', () => {
    for (const technologyId of ICON_004_DETAILED_TECHNOLOGY_IDS) {
      const assetId = `ICON-004-${technologyId}-primary`;
      expect(getVisualAssetEntry(assetId)).toMatchObject({
        type: 'runtime',
        component: 'TechnologyVisual',
        path: `/assets/research/${assetId}.png`,
      });
    }

    for (const category of ICON_004_USED_TECHNOLOGY_CATEGORIES) {
      const assetId = `ICON-004-category-${category}`;
      expect(getVisualAssetEntry(assetId)).toMatchObject({
        type: 'runtime',
        path: `/assets/research/${assetId}.svg`,
        fallbackId: 'ICON-002-research',
      });
    }
  });

  it('has runtime files for all detailed primaries on disk', () => {
    for (const technologyId of ICON_004_DETAILED_TECHNOLOGY_IDS) {
      const base = `ICON-004-${technologyId}-primary`;
      expect(existsSync(path.join(publicResearch, `${base}.png`))).toBe(true);
      expect(existsSync(path.join(publicResearch, `${base}.webp`))).toBe(true);
    }

    for (const category of ICON_004_USED_TECHNOLOGY_CATEGORIES) {
      expect(
        existsSync(path.join(publicResearch, `ICON-004-category-${category}.svg`)),
      ).toBe(true);
    }
  });

  it('registers batch-4 abstract primaries with batch-4 design sources', () => {
    for (const technologyId of ICON_004_BATCH_4_ABSTRACT_DETAILED_TECHNOLOGY_IDS) {
      const assetId = `ICON-004-${technologyId}-primary`;
      expect(getVisualAssetEntry(assetId)?.designSource).toBe(
        `docs/design/research/production/batch-4-abstract/primary/${assetId}.png`,
      );
    }
  });
});
