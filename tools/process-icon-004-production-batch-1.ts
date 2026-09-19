#!/usr/bin/env tsx
import { copyFile, mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  removeBuildingArtBackground,
  validateBuildingArtAlpha,
  writeAlphaReportJson,
} from './building-art-alpha.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const productionRoot = path.join(projectRoot, 'docs/design/research/production/batch-1');
const primaryDesignDir = path.join(productionRoot, 'primary');
const categoryDesignDir = path.join(productionRoot, 'category');
const pilotDetailedDir = path.join(projectRoot, 'docs/design/research/pilot-icon-004/detailed-primary');
const publicResearchDir = path.join(projectRoot, 'apps/web/public/assets/research');

const WEBP_QUALITY = 82;

const BATCH_1_DETAILED_TECHNOLOGY_IDS = Object.freeze([
  'precision_machining',
  'renewable_energy',
  'semiconductor_process',
  'advanced_metallurgy',
  'coal_efficiency',
  'intermodal_logistics',
  'circuit_design',
  'factory_automation',
] as const);

const PROMOTED_PILOT_IDS = Object.freeze([
  'precision_machining',
  'renewable_energy',
  'semiconductor_process',
] as const);

const NEW_BATCH_IDS = Object.freeze([
  'advanced_metallurgy',
  'coal_efficiency',
  'intermodal_logistics',
  'circuit_design',
  'factory_automation',
] as const);

const USED_CATEGORIES = Object.freeze([
  'PRODUCTION',
  'ENERGY',
  'LOGISTICS',
  'ELECTRONICS',
  'MANAGEMENT',
  'AUTOMATION',
  'FINANCE',
  'AGRICULTURE',
  'CHEMISTRY',
  'AI',
] as const);

const SOURCE_FALLBACK_DIRS = Object.freeze([
  path.join(projectRoot, 'assets'),
  path.join('C:/Users/Besitzer/.cursor/projects/d-Cursor-Project-Genesis/assets'),
] as const);

function primaryAssetId(technologyId: string): string {
  return `ICON-004-${technologyId}-primary`;
}

function categoryAssetId(category: string): string {
  return `ICON-004-category-${category}`;
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
  await copyFile(sourcePath, pngPath);
  await sharp(sourcePath).webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(webpPath);
}

async function syncCategoryToRuntime(assetId: string, sourcePath: string): Promise<void> {
  const targetPath = path.join(publicResearchDir, `${assetId}.svg`);
  await copyFile(sourcePath, targetPath);
}

async function main(): Promise<void> {
  await mkdir(primaryDesignDir, { recursive: true });
  await mkdir(categoryDesignDir, { recursive: true });
  await mkdir(publicResearchDir, { recursive: true });

  const alphaReports = [];
  const detailedRecords = [];

  for (const technologyId of PROMOTED_PILOT_IDS) {
    const pilotPath = path.join(pilotDetailedDir, `ICON-004-tech-${technologyId}-primary-pilot.png`);
    const productionPath = productionPrimaryPath(technologyId);
    await copyFile(pilotPath, productionPath);
    const report = await validateBuildingArtAlpha(productionPath);
    alphaReports.push(report);
    const assetId = primaryAssetId(technologyId);
    await syncPrimaryToRuntime(assetId, productionPath);
    detailedRecords.push({
      technologyId,
      source: 'PROMOTED PILOT',
      primaryMaster: path.relative(projectRoot, productionPath).replace(/\\/g, '/'),
      assetId,
      alphaResult: report.pass ? 'PASS' : 'FAIL',
    });
  }

  for (const technologyId of NEW_BATCH_IDS) {
    const source = await resolveNewSource(technologyId);
    const productionPath = productionPrimaryPath(technologyId);
    await removeBuildingArtBackground(source, productionPath);
    const report = await validateBuildingArtAlpha(productionPath);
    alphaReports.push(report);
    const assetId = primaryAssetId(technologyId);
    await syncPrimaryToRuntime(assetId, productionPath);
    detailedRecords.push({
      technologyId,
      source: 'NEW BATCH 1',
      primaryMaster: path.relative(projectRoot, productionPath).replace(/\\/g, '/'),
      assetId,
      alphaResult: report.pass ? 'PASS' : 'FAIL',
    });
  }

  const categoryRecords = [];
  for (const category of USED_CATEGORIES) {
    const designPath = path.join(categoryDesignDir, `${categoryAssetId(category)}.svg`);
    const assetId = categoryAssetId(category);
    await syncCategoryToRuntime(assetId, designPath);
    const fileStats = await stat(designPath);
    categoryRecords.push({
      category,
      assetId,
      designPath: path.relative(projectRoot, designPath).replace(/\\/g, '/'),
      fileSizeBytes: fileStats.size,
    });
  }

  const alphaReportPath = path.join(productionRoot, 'ICON_004_PRODUCTION_BATCH_1_ALPHA_REPORT.json');
  await writeAlphaReportJson(alphaReports, alphaReportPath);

  const manifest = {
    batchVersion: '2026-09-19-icon-004-production-batch-1-v1',
    contractPath: 'docs/design/research/TECHNOLOGY_RESEARCH_ICON_004_VISUAL_CONTRACT.md',
    contractStatus: 'APPROVED / PRODUCTION AUTHORITY',
    productionRegistryActivated: true,
    batch: 'batch-1',
    detailedTechnologyIds: BATCH_1_DETAILED_TECHNOLOGY_IDS,
    detailedPrimaries: detailedRecords,
    categoryCompacts: categoryRecords,
    alphaReportPath: path.relative(projectRoot, alphaReportPath).replace(/\\/g, '/'),
    runtimePublicRoot: 'apps/web/public/assets/research',
  };

  await writeFile(
    path.join(productionRoot, 'ICON_004_PRODUCTION_BATCH_1_MANIFEST.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  const failed = alphaReports.filter((report) => !report.pass);
  if (failed.length > 0) {
    console.error(`${failed.length} primaries failed alpha QA`);
    process.exitCode = 1;
  } else {
    console.log(`ICON-004 Batch 1: ${alphaReports.length} primaries alpha PASS, ${categoryRecords.length} categories synced`);
  }
}

void main();
