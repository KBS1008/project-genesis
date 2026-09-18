#!/usr/bin/env tsx
import { copyFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  removeBuildingArtBackground,
  validateBuildingArtAlpha,
  writeAlphaReportJson,
} from './building-art-alpha.ts';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const batchRoot = path.join(projectRoot, 'docs/design/buildings/production/batch-1');
const primaryDesignDir = path.join(batchRoot, 'primary');
const compactDesignDir = path.join(batchRoot, 'compact');
const publicBuildingsDir = path.join(projectRoot, 'apps/web/public/assets/buildings');
const assetsCursorDir = path.join(projectRoot, 'assets');

const WEBP_QUALITY = 82;

const BATCH_BUILDINGS = Object.freeze([
  {
    id: 'sawmill',
    source: path.join(projectRoot, 'docs/design/buildings/pilot-b2/primary/BUILDING-PILOT-B2-SAWMILL.png'),
  },
  {
    id: 'smelter',
    source: path.join(assetsCursorDir, 'ICON-003-smelter-source.png'),
  },
  {
    id: 'warehouse',
    source: path.join(assetsCursorDir, 'ICON-003-warehouse-source.png'),
  },
  {
    id: 'coal_power_plant',
    source: path.join(
      projectRoot,
      'docs/design/buildings/pilot-b2/primary/BUILDING-PILOT-B2-COAL_POWER_PLANT.png',
    ),
  },
  {
    id: 'machine_shop',
    source: path.join(assetsCursorDir, 'ICON-003-machine_shop-source.png'),
  },
  {
    id: 'logistics_hub',
    source: path.join(assetsCursorDir, 'ICON-003-logistics_hub-source.png'),
  },
  {
    id: 'research_campus',
    source: path.join(assetsCursorDir, 'ICON-003-research_campus-regen-source.png'),
  },
  {
    id: 'corporate_headquarters',
    source: path.join(assetsCursorDir, 'ICON-003-corporate_headquarters-source.png'),
  },
] as const);

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

  for (const building of BATCH_BUILDINGS) {
    const primaryId = `ICON-003-${building.id}`;
    const primaryMaster = path.join(primaryDesignDir, `${primaryId}.png`);

    await removeBuildingArtBackground(building.source, primaryMaster);
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

  const reportPath = path.join(batchRoot, 'ICON_003_BATCH_1_ALPHA_REPORT.json');
  await writeAlphaReportJson(alphaReports, reportPath);

  const failed = alphaReports.filter((report) => !report.pass);
  if (failed.length > 0) {
    console.error(`${failed.length} assets failed alpha QA`);
    process.exitCode = 1;
  }
}

void main();
