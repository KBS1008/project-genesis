import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { getVisualAssetEntry, PRELOAD_VISUAL_ASSET_IDS } from '@/presentation/assets';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../..');
const brandDesignRoot = path.join(projectRoot, 'docs/design/branding');
const brandingRuntimeRoot = path.join(projectRoot, 'apps/web/public/assets/branding');
const publicWebRoot = path.join(projectRoot, 'apps/web/public');

export const BR_001_SEALED_SOURCE_SHA256 =
  'e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195';

const BR_001_REJECTED_SOURCE_SHA256 =
  'c8e10be0af9299451a5bf8f4f3c6e5748749968380f13ea99ce97d63f9b3a006';

function sha256File(filePath: string): string {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

describe('BR-001 runtime certification', () => {
  it('keeps the sealed Phase-1B SVG master hash', () => {
    const sourcePath = path.join(brandDesignRoot, 'BR-001_Logo.svg');
    expect(sha256File(sourcePath)).toBe(BR_001_SEALED_SOURCE_SHA256);
    expect(sha256File(sourcePath)).not.toBe(BR_001_REJECTED_SOURCE_SHA256);
  });

  it('syncs runtime SVG byte-identical to the sealed design master', () => {
    const sourcePath = path.join(brandDesignRoot, 'BR-001_Logo.svg');
    const runtimePath = path.join(brandingRuntimeRoot, 'BR-001.svg');

    expect(existsSync(runtimePath)).toBe(true);
    expect(readFileSync(runtimePath, 'utf8')).toBe(readFileSync(sourcePath, 'utf8'));
    expect(sha256File(runtimePath)).toBe(BR_001_SEALED_SOURCE_SHA256);
  });

  it('does not create PNG/WebP menu brand derivatives under branding/', () => {
    expect(existsSync(path.join(brandingRuntimeRoot, 'BR-001.png'))).toBe(false);
    expect(existsSync(path.join(brandingRuntimeRoot, 'BR-001.webp'))).toBe(false);
  });

  it('generates favicon PNG derivatives at 16×16 and 32×32 from the sealed SVG', async () => {
    for (const size of [16, 32] as const) {
      const faviconPath = path.join(publicWebRoot, `favicon-${size}x${size}.png`);
      expect(existsSync(faviconPath)).toBe(true);

      const metadata = await sharp(faviconPath).metadata();
      expect(metadata.width).toBe(size);
      expect(metadata.height).toBe(size);
      expect(metadata.format).toBe('png');
    }
  });

  it('registers BR-001 in the visual asset registry without MM-006 alias', () => {
    expect(getVisualAssetEntry('BR-001')).toMatchObject({
      type: 'runtime',
      format: 'svg',
      component: 'MainMenuHome',
      preload: false,
      path: '/assets/branding/BR-001.svg',
      webp: null,
      designSource: 'docs/design/branding/BR-001_Logo.svg',
    });
    expect(getVisualAssetEntry('BR-001')?.path).not.toContain('MM-006');
    expect(PRELOAD_VISUAL_ASSET_IDS).not.toContain('BR-001');
  });
});
