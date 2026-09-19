#!/usr/bin/env tsx
import { access, copyFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  removeBuildingArtBackground,
  validateBuildingArtAlpha,
  writeAlphaReportJson,
} from './building-art-alpha.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const batchRoot = path.join(projectRoot, 'docs/design/buildings/production/batch-3');
const primaryDesignDir = path.join(batchRoot, 'primary');
const compactDesignDir = path.join(batchRoot, 'compact');
const publicBuildingsDir = path.join(projectRoot, 'apps/web/public/assets/buildings');
const assetsCursorDir = path.join(projectRoot, 'assets');

const WEBP_QUALITY = 82;

const BATCH_3_IDS = Object.freeze([
  'maintenance_facility',
  'recycling_facility',
  'regional_headquarters',
  'training_center',
] as const);

const SOURCE_FALLBACK_DIRS = Object.freeze([
  assetsCursorDir,
  path.join('C:/Users/Besitzer/.cursor/projects/d-Cursor-Project-Genesis/assets'),
] as const);

async function resolveBatch3Source(buildingId: string): Promise<string> {
  const fileName = `ICON-003-${buildingId}-source.png`;

  for (const dir of SOURCE_FALLBACK_DIRS) {
    const candidate = path.join(dir, fileName);
    try {
      await access(candidate);
      return candidate;
    } catch {
      // try next
    }
  }

  throw new Error(`Missing source PNG for ${buildingId}`);
}

async function syncPrimaryToRuntime(assetId: string, sourcePath: string): Promise<void> {
  const pngPath = path.join(publicBuildingsDir, `${assetId}.png`);
  const webpPath = path.join(publicBuildingsDir, `${assetId}.webp`);

  await copyFile(sourcePath, pngPath);
  await sharp(sourcePath).webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(webpPath);

  const [pngStats, webpStats] = await Promise.all([stat(pngPath), stat(webpPath)]);
  console.log(`Runtime ${assetId}: png ${pngStats.size} B, webp ${webpStats.size} B`);
}

async function syncCompactToRuntime(assetId: string, sourcePath: string): Promise<void> {
  const targetPath = path.join(publicBuildingsDir, `${assetId}.svg`);
  await copyFile(sourcePath, targetPath);
  const fileStats = await stat(targetPath);
  console.log(`Runtime ${assetId}: svg ${fileStats.size} B`);
}

async function main(): Promise<void> {
  await mkdir(primaryDesignDir, { recursive: true });
  await mkdir(compactDesignDir, { recursive: true });
  await mkdir(publicBuildingsDir, { recursive: true });

  const alphaReports = [];

  for (const buildingId of BATCH_3_IDS) {
    const source = await resolveBatch3Source(buildingId);
    const primaryId = `ICON-003-${buildingId}`;
    const primaryMaster = path.join(primaryDesignDir, `${primaryId}.png`);

    await removeBuildingArtBackground(source, primaryMaster);
    const report = await validateBuildingArtAlpha(primaryMaster);
    alphaReports.push(report);

    if (!report.pass) {
      console.warn(`WARN alpha QA not fully passing: ${primaryId}`, report);
    }

    await syncPrimaryToRuntime(primaryId, primaryMaster);

    const compactId = `${primaryId}-compact`;
    const compactMaster = path.join(compactDesignDir, `${compactId}.svg`);
    await syncCompactToRuntime(compactId, compactMaster);
  }

  const reportPath = path.join(batchRoot, 'ICON_003_BATCH_3_ALPHA_REPORT.json');
  await writeAlphaReportJson(alphaReports, reportPath);

  const failed = alphaReports.filter((report) => !report.pass);
  if (failed.length > 0) {
    console.error(`${failed.length} assets failed alpha QA`);
    process.exitCode = 1;
  }
}

void main();
