import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getVisualAssetEntry } from '@/presentation/assets/visual-asset-registry';
import {
  ICON_005_ENABLED_RECIPE_IDS,
  ICON_005_GENERIC_PROCESS_FALLBACK_ASSET_ID,
  ICON_005_PILOT_PROMOTED_RECIPE_IDS,
  recipeToIcon005PrimaryAssetId,
  resolveIcon005ProcessVisualAssetIds,
} from '@/presentation/assets/process-visual-asset-ids';

const projectRoot = path.resolve(import.meta.dirname, '../../../../..');
const publicProcess = path.join(projectRoot, 'apps/web/public/assets/process');

describe('process-visual-asset-ids', () => {
  it('maps seven enabled recipes to primaries', () => {
    expect(ICON_005_ENABLED_RECIPE_IDS.length).toBe(7);
    expect(ICON_005_PILOT_PROMOTED_RECIPE_IDS.length).toBe(3);

    for (const recipeId of ICON_005_ENABLED_RECIPE_IDS) {
      expect(recipeToIcon005PrimaryAssetId(recipeId)).toBe(`ICON-005-${recipeId}-primary`);
    }
  });

  it('falls back for unknown recipe', () => {
    expect(resolveIcon005ProcessVisualAssetIds('recipe_unknown')).toEqual({
      primaryAssetId: null,
      fallbackAssetId: ICON_005_GENERIC_PROCESS_FALLBACK_ASSET_ID,
    });
  });
});

describe('ICON-005 production registry and files', () => {
  it('registers seven process primaries', () => {
    for (const recipeId of ICON_005_ENABLED_RECIPE_IDS) {
      const assetId = `ICON-005-${recipeId}-primary`;
      expect(getVisualAssetEntry(assetId)).toMatchObject({
        type: 'runtime',
        component: 'ProductionProcessVisual',
        path: `/assets/process/${assetId}.png`,
        fallbackId: ICON_005_GENERIC_PROCESS_FALLBACK_ASSET_ID,
      });
    }
  });

  it('has runtime png and webp for all primaries', () => {
    for (const recipeId of ICON_005_ENABLED_RECIPE_IDS) {
      const base = `ICON-005-${recipeId}-primary`;
      expect(existsSync(path.join(publicProcess, `${base}.png`))).toBe(true);
      expect(existsSync(path.join(publicProcess, `${base}.webp`))).toBe(true);
    }
  });
});
