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
const productionRoot = path.join(projectRoot, 'docs/design/production/icon-005');
const primaryDesignDir = path.join(productionRoot, 'primary');
const pilotMasterDir = path.join(projectRoot, 'docs/design/production/pilot-icon-005/process-primary');
const publicProcessDir = path.join(projectRoot, 'apps/web/public/assets/process');

const WEBP_QUALITY = 82;

const PROMOTED_FROM_PILOT = Object.freeze([
  'recipe_planks',
  'recipe_steel',
  'recipe_advanced_electronics',
] as const);

const NEW_ART_RECIPE_IDS = Object.freeze([
  'recipe_advanced_planks',
  'recipe_machine_parts',
  'recipe_industrial_machinery',
  'recipe_consumer_goods',
] as const);

const ALL_RECIPE_IDS = Object.freeze([...PROMOTED_FROM_PILOT, ...NEW_ART_RECIPE_IDS] as const);

const SOURCE_FALLBACK_DIRS = Object.freeze([
  path.join(projectRoot, 'assets'),
  path.join('C:/Users/Besitzer/.cursor/projects/d-Cursor-Project-Genesis/assets'),
] as const);

function primaryAssetId(recipeId: string): string {
  return `ICON-005-${recipeId}-primary`;
}

function productionPrimaryPath(recipeId: string): string {
  return path.join(primaryDesignDir, `${primaryAssetId(recipeId)}.png`);
}

function pilotMasterPath(recipeId: string): string {
  return path.join(pilotMasterDir, `ICON-005-${recipeId}-primary-pilot.png`);
}

async function resolveNewSource(recipeId: string): Promise<string> {
  const fileName = `ICON-005-${recipeId}-primary-source.png`;
  for (const dir of SOURCE_FALLBACK_DIRS) {
    const candidate = path.join(dir, fileName);
    try {
      await stat(candidate);
      return candidate;
    } catch {
      // continue
    }
  }

  throw new Error(`Missing source for ${recipeId}`);
}

async function syncPrimaryToRuntime(assetId: string, sourcePath: string): Promise<void> {
  const pngPath = path.join(publicProcessDir, `${assetId}.png`);
  const webpPath = path.join(publicProcessDir, `${assetId}.webp`);
  await sharp(sourcePath).png().toFile(pngPath);
  await sharp(sourcePath).webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(webpPath);
}

async function main(): Promise<void> {
  await mkdir(primaryDesignDir, { recursive: true });
  await mkdir(publicProcessDir, { recursive: true });

  const alphaReports = [];
  const records = [];

  for (const recipeId of PROMOTED_FROM_PILOT) {
    const master = pilotMasterPath(recipeId);
    const productionPath = productionPrimaryPath(recipeId);
    await copyFile(master, productionPath);
    const report = await validateBuildingArtAlpha(productionPath);
    alphaReports.push(report);
    const assetId = primaryAssetId(recipeId);
    await syncPrimaryToRuntime(assetId, productionPath);
    records.push({
      recipeId,
      provenance: 'PROMOTED HUMAN-APPROVED PILOT',
      primaryMaster: path.relative(projectRoot, productionPath).replace(/\\/g, '/'),
      assetId,
      alphaResult: report.pass ? 'PASS' : 'FAIL',
    });
  }

  for (const recipeId of NEW_ART_RECIPE_IDS) {
    const source = await resolveNewSource(recipeId);
    const productionPath = productionPrimaryPath(recipeId);
    await removeBuildingArtBackground(source, productionPath);
    const report = await validateBuildingArtAlpha(productionPath);
    alphaReports.push(report);
    const assetId = primaryAssetId(recipeId);
    await syncPrimaryToRuntime(assetId, productionPath);
    records.push({
      recipeId,
      provenance: 'NEW PRODUCTION ART',
      primaryMaster: path.relative(projectRoot, productionPath).replace(/\\/g, '/'),
      assetId,
      alphaResult: report.pass ? 'PASS' : 'FAIL',
    });
  }

  const alphaReportPath = path.join(productionRoot, 'ICON_005_PRODUCTION_7_OF_7_ALPHA_REPORT.json');
  await writeAlphaReportJson(alphaReports, alphaReportPath);

  const manifest = {
    batchVersion: '2026-09-20-icon-005-production-7-of-7-v1',
    contractPath: 'docs/design/production/PRODUCTION_PROCESS_ICON_005_VISUAL_CONTRACT.md',
    contractStatus: 'APPROVED / PRODUCTION AUTHORITY — 7/7 CLOSE CANDIDATE',
    productionRegistryActivated: true,
    enabledRecipeIds: ALL_RECIPE_IDS,
    promotedPilotIds: PROMOTED_FROM_PILOT,
    newArtRecipeIds: NEW_ART_RECIPE_IDS,
    cumulativeProcessPrimaryCount: 7,
    primaries: records,
    alphaReportPath: path.relative(projectRoot, alphaReportPath).replace(/\\/g, '/'),
    runtimePublicRoot: 'apps/web/public/assets/process',
  };

  await writeFile(
    path.join(productionRoot, 'ICON_005_PRODUCTION_7_OF_7_MANIFEST.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  const failed = alphaReports.filter((report) => !report.pass);
  if (failed.length > 0) {
    console.error(`${failed.length} primaries failed alpha QA`);
    process.exitCode = 1;
  } else {
    console.log(`ICON-005 production: ${alphaReports.length} primaries alpha PASS`);
  }
}

void main();
