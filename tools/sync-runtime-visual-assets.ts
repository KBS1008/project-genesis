#!/usr/bin/env tsx
/**
 * Copies approved design assets into `apps/web/public/assets/` for runtime serving
 * and generates WebP variants for PNG runtime assets.
 *
 * Run after importing new assets via the Visual Asset Manager:
 *   pnpm sync-visual-assets
 */
import { copyFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const designRoot = path.join(projectRoot, 'docs/design/Bilder/einzelne_bilder/hochgeladen');
const publicRoot = path.join(projectRoot, 'apps/web/public/assets');

const WEBP_QUALITY = 82;

const RUNTIME_ASSETS = Object.freeze([
  { id: 'MM-001', source: 'MM-001_Main_Menu_Final.png', targetDir: 'main-menu', format: 'png' as const },
  { id: 'MM-002', source: 'MM-002_New_Game_Dialog_v1.png', targetDir: 'main-menu', format: 'png' as const },
  { id: 'MM-003', source: 'MM-003_Load_Game_v1.png', targetDir: 'main-menu', format: 'png' as const },
  { id: 'MM-004', source: 'MM-004_Settings_v1.png', targetDir: 'main-menu', format: 'png' as const },
  { id: 'MM-005', source: 'MM-005_Credits.png.png', targetDir: 'main-menu', format: 'png' as const },
  { id: 'MM-006', source: 'MM-006_Splash.png', targetDir: 'main-menu', format: 'png' as const },
  { id: 'MM-007', source: 'MM-007_Loading.png', targetDir: 'main-menu', format: 'png' as const },
  {
    id: 'CH-010',
    source: 'CH-010_Charts.svg',
    targetDir: 'charts',
    targetName: 'CH-010_Charts.svg',
    format: 'svg' as const,
  },
] as const);

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  return `${(kilobytes / 1024).toFixed(2)} MB`;
}

async function syncPngWithWebp(
  assetId: string,
  sourcePath: string,
  targetDir: string,
): Promise<void> {
  const pngPath = path.join(targetDir, `${assetId}.png`);
  const webpPath = path.join(targetDir, `${assetId}.webp`);

  await copyFile(sourcePath, pngPath);

  await sharp(sourcePath).webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(webpPath);

  const [pngStats, webpStats] = await Promise.all([stat(pngPath), stat(webpPath)]);
  const savings = ((1 - webpStats.size / pngStats.size) * 100).toFixed(1);

  console.log(
    `Synced ${assetId} → ${path.relative(projectRoot, pngPath)} (${formatBytes(pngStats.size)})`,
  );
  console.log(
    `  WebP ${path.relative(projectRoot, webpPath)} (${formatBytes(webpStats.size)}, −${savings}%)`,
  );
}

async function syncRuntimeVisualAssets(): Promise<void> {
  for (const asset of RUNTIME_ASSETS) {
    const targetDir = path.join(publicRoot, asset.targetDir);
    await mkdir(targetDir, { recursive: true });

    const sourcePath = path.join(designRoot, asset.source);

    if (asset.format === 'png') {
      await syncPngWithWebp(asset.id, sourcePath, targetDir);
      continue;
    }

    const targetName = 'targetName' in asset ? asset.targetName : `${asset.id}.svg`;
    const targetPath = path.join(targetDir, targetName);
    await copyFile(sourcePath, targetPath);
    console.log(`Synced ${asset.id} → ${path.relative(projectRoot, targetPath)}`);
  }
}

void syncRuntimeVisualAssets().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
