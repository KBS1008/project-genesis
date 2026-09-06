import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  BUILDING_CATEGORY_ICON_CATEGORIES,
  BUILDING_CATEGORY_TO_ICON_002_ASSET_ID,
  ICON_002_CERTIFIED_SVG_BY_ASSET_ID,
  ICON_002_DESIGN_SOURCE_BY_ASSET_ID,
} from '@/presentation/assets/icon-002-certified-svg-sources';
import { certifyIcon002Svg } from '@/presentation/assets/icon-002-svg-certification';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../..');
const iconDesignRoot = path.join(projectRoot, 'docs/design/icons');
const iconRuntimeRoot = path.join(projectRoot, 'apps/web/public/assets/icons');

function sha256(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

describe('ICON-002 SVG certification', () => {
  it('certifies all six approved design-source SVG masters', () => {
    for (const assetId of Object.values(BUILDING_CATEGORY_TO_ICON_002_ASSET_ID)) {
      const sourcePath = path.join(iconDesignRoot, ICON_002_DESIGN_SOURCE_BY_ASSET_ID[assetId]);
      const sourceContent = readFileSync(sourcePath, 'utf8');
      const result = certifyIcon002Svg(sourceContent);

      expect(result.ok, JSON.stringify(result)).toBe(true);
    }
  });

  it('keeps inline runtime SVG markup byte-identical to approved design sources', () => {
    for (const assetId of Object.values(BUILDING_CATEGORY_TO_ICON_002_ASSET_ID)) {
      const sourcePath = path.join(iconDesignRoot, ICON_002_DESIGN_SOURCE_BY_ASSET_ID[assetId]);
      const sourceContent = readFileSync(sourcePath, 'utf8');

      expect(ICON_002_CERTIFIED_SVG_BY_ASSET_ID[assetId]).toBe(sourceContent);
      expect(sha256(ICON_002_CERTIFIED_SVG_BY_ASSET_ID[assetId])).toBe(sha256(sourceContent));
    }
  });

  it('syncs runtime SVG copies byte-identical to design sources without raster derivatives', () => {
    for (const assetId of Object.values(BUILDING_CATEGORY_TO_ICON_002_ASSET_ID)) {
      const sourcePath = path.join(iconDesignRoot, ICON_002_DESIGN_SOURCE_BY_ASSET_ID[assetId]);
      const runtimePath = path.join(iconRuntimeRoot, `${assetId}.svg`);
      const sourceContent = readFileSync(sourcePath, 'utf8');
      const runtimeContent = readFileSync(runtimePath, 'utf8');

      expect(runtimeContent).toBe(sourceContent);
      expect(existsSync(path.join(iconRuntimeRoot, `${assetId}.png`))).toBe(false);
      expect(existsSync(path.join(iconRuntimeRoot, `${assetId}.webp`))).toBe(false);
    }
  });

  it('covers exactly the six current BuildingCategory values', () => {
    expect(BUILDING_CATEGORY_ICON_CATEGORIES).toEqual([
      'PRODUCTION',
      'ENERGY',
      'STORAGE',
      'INFRASTRUCTURE',
      'ADMINISTRATION',
      'RESEARCH',
    ]);
  });
});
