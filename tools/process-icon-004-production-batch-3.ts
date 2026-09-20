#!/usr/bin/env tsx
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  removeBuildingArtBackground,
  validateBuildingArtAlpha,
  writeAlphaReportJson,
} from './building-art-alpha.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const productionRoot = path.join(projectRoot, 'docs/design/research/production/batch-3');
const primaryDesignDir = path.join(productionRoot, 'primary');
const publicResearchDir = path.join(projectRoot, 'apps/web/public/assets/research');

const WEBP_QUALITY = 82;

const BATCH_3_DETAILED_TECHNOLOGY_IDS = Object.freeze([
  'distribution_networks',
  'polymer_science',
  'sustainable_agriculture',
  'crop_optimization',
] as const);

const SOURCE_FALLBACK_DIRS = Object.freeze([
  path.join(projectRoot, 'assets'),
  path.join('C:/Users/Besitzer/.cursor/projects/d-Cursor-Project-Genesis/assets'),
] as const);

function primaryAssetId(technologyId: string): string {
  return `ICON-004-${technologyId}-primary`;
}

function productionPrimaryPath(technologyId: string): string {
  return path.join(primaryDesignDir, `${primaryAssetId(technologyId)}.png`);
}

async function resolveNewSource(technologyId: string): Promise<string> {
  const fileName = `ICON-004-tech-${technologyId}-primary-source.png`;
  for (const dir of SOURCE_FALLBACK_DIRS) {
    const candidate = path.join(dir, fileName);
    try {
      await stat(candidate);
      return candidate;
    } catch {
      // continue
    }
  }

  throw new Error(`Missing source for ${technologyId}`);
}

async function syncPrimaryToRuntime(assetId: string, sourcePath: string): Promise<void> {
  const pngPath = path.join(publicResearchDir, `${assetId}.png`);
  const webpPath = path.join(publicResearchDir, `${assetId}.webp`);
  await sharp(sourcePath).png().toFile(pngPath);
  await sharp(sourcePath).webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(webpPath);
}

async function main(): Promise<void> {
  await mkdir(primaryDesignDir, { recursive: true });
  await mkdir(publicResearchDir, { recursive: true });

  const alphaReports = [];
  const detailedRecords = [];

  for (const technologyId of BATCH_3_DETAILED_TECHNOLOGY_IDS) {
    const source = await resolveNewSource(technologyId);
    const productionPath = productionPrimaryPath(technologyId);
    await removeBuildingArtBackground(source, productionPath);
    const report = await validateBuildingArtAlpha(productionPath);
    alphaReports.push(report);
    const assetId = primaryAssetId(technologyId);
    await syncPrimaryToRuntime(assetId, productionPath);
    detailedRecords.push({
      technologyId,
      source: 'BATCH 3',
      primaryMaster: path.relative(projectRoot, productionPath).replace(/\\/g, '/'),
      assetId,
      alphaResult: report.pass ? 'PASS' : 'FAIL',
    });
  }

  const alphaReportPath = path.join(productionRoot, 'ICON_004_PRODUCTION_BATCH_3_ALPHA_REPORT.json');
  await writeAlphaReportJson(alphaReports, alphaReportPath);

  const manifest = {
    batchVersion: '2026-09-19-icon-004-production-batch-3-v1',
    contractPath: 'docs/design/research/TECHNOLOGY_RESEARCH_ICON_004_VISUAL_CONTRACT.md',
    contractStatus: 'APPROVED / PRODUCTION AUTHORITY',
    productionRegistryActivated: true,
    batch: 'batch-3',
    detailedTechnologyIds: BATCH_3_DETAILED_TECHNOLOGY_IDS,
    cumulativeDetailedCount: 18,
    detailedPrimaries: detailedRecords,
    alphaReportPath: path.relative(projectRoot, alphaReportPath).replace(/\\/g, '/'),
    runtimePublicRoot: 'apps/web/public/assets/research',
  };

  await writeFile(
    path.join(productionRoot, 'ICON_004_PRODUCTION_BATCH_3_MANIFEST.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  const failed = alphaReports.filter((report) => !report.pass);
  if (failed.length > 0) {
    console.error(`${failed.length} primaries failed alpha QA`);
    process.exitCode = 1;
  } else {
    console.log(`ICON-004 Batch 3: ${alphaReports.length} primaries alpha PASS`);
  }
}

void main();
