#!/usr/bin/env tsx
/**
 * Copies approved design assets into `apps/web/public/assets/` for runtime serving.
 * Run after importing new assets via the Visual Asset Manager.
 */
import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const designRoot = path.join(projectRoot, 'docs/design/Bilder/einzelne_bilder/hochgeladen');
const publicRoot = path.join(projectRoot, 'apps/web/public/assets');

const RUNTIME_ASSETS = Object.freeze([
  { id: 'MM-001', source: 'MM-001_Main_Menu_Final.png', targetDir: 'main-menu' },
  { id: 'MM-002', source: 'MM-002_New_Game_Dialog_v1.png', targetDir: 'main-menu' },
  { id: 'MM-003', source: 'MM-003_Load_Game_v1.png', targetDir: 'main-menu' },
  { id: 'MM-004', source: 'MM-004_Settings_v1.png', targetDir: 'main-menu' },
  { id: 'MM-005', source: 'MM-005_Credits.png.png', targetDir: 'main-menu' },
  { id: 'MM-006', source: 'MM-006_Splash.png', targetDir: 'main-menu' },
  { id: 'MM-007', source: 'MM-007_Loading.png', targetDir: 'main-menu' },
  { id: 'CH-010', source: 'CH-010_Charts.svg', targetDir: 'charts', targetName: 'CH-010_Charts.svg' },
] as const);

async function syncRuntimeVisualAssets(): Promise<void> {
  for (const asset of RUNTIME_ASSETS) {
    const targetDir = path.join(publicRoot, asset.targetDir);
    await mkdir(targetDir, { recursive: true });

    const sourcePath = path.join(designRoot, asset.source);
    const targetName = 'targetName' in asset ? asset.targetName : `${asset.id}.png`;
    const targetPath = path.join(targetDir, targetName);

    await copyFile(sourcePath, targetPath);
    console.log(`Synced ${asset.id} → ${path.relative(projectRoot, targetPath)}`);
  }
}

void syncRuntimeVisualAssets().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
