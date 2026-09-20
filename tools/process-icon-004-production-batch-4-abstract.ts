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
const productionRoot = path.join(projectRoot, 'docs/design/research/production/batch-4-abstract');
const primaryDesignDir = path.join(productionRoot, 'primary');
const pilotMasterDir = path.join(projectRoot, 'docs/design/research/pilot-icon-004/abstract-primary');
const publicResearchDir = path.join(projectRoot, 'apps/web/public/assets/research');

const WEBP_QUALITY = 82;

const PROMOTED_FROM_PILOT = Object.freeze([
  'corporate_management',
  'financial_planning',
  'predictive_analytics',
] as const);

const NEW_ART_TECHNOLOGY_ID = 'executive_leadership';

const BATCH_4_DETAILED_TECHNOLOGY_IDS = Object.freeze([
  ...PROMOTED_FROM_PILOT,
  NEW_ART_TECHNOLOGY_ID,
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

function pilotMasterPath(technologyId: string): string {
  return path.join(pilotMasterDir, `ICON-004-tech-${technologyId}-primary-abstract-pilot.png`);
}

async function resolveExecutiveSource(): Promise<string> {
  const fileName = 'ICON-004-tech-executive_leadership-primary-source.png';
  for (const dir of SOURCE_FALLBACK_DIRS) {
    const candidate = path.join(dir, fileName);
    try {
      await stat(candidate);
      return candidate;
    } catch {
      // continue
    }
  }

  throw new Error('Missing executive_leadership source');
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

  for (const technologyId of PROMOTED_FROM_PILOT) {
    const master = pilotMasterPath(technologyId);
    const productionPath = productionPrimaryPath(technologyId);
    await copyFile(master, productionPath);
    const report = await validateBuildingArtAlpha(productionPath);
    alphaReports.push(report);
    const assetId = primaryAssetId(technologyId);
    await syncPrimaryToRuntime(assetId, productionPath);
    detailedRecords.push({
      technologyId,
      source: 'PROMOTED HUMAN-APPROVED ABSTRACT PILOT',
      primaryMaster: path.relative(projectRoot, productionPath).replace(/\\/g, '/'),
      assetId,
      alphaResult: report.pass ? 'PASS' : 'FAIL',
    });
  }

  {
    const technologyId = NEW_ART_TECHNOLOGY_ID;
    const source = await resolveExecutiveSource();
    const productionPath = productionPrimaryPath(technologyId);
    await removeBuildingArtBackground(source, productionPath);
    const report = await validateBuildingArtAlpha(productionPath);
    alphaReports.push(report);
    const assetId = primaryAssetId(technologyId);
    await syncPrimaryToRuntime(assetId, productionPath);
    detailedRecords.push({
      technologyId,
      source: 'NEW ART — EXECUTIVE LEADERSHIP HOLDOUT',
      primaryMaster: path.relative(projectRoot, productionPath).replace(/\\/g, '/'),
      assetId,
      alphaResult: report.pass ? 'PASS' : 'FAIL',
    });
  }

  const alphaReportPath = path.join(productionRoot, 'ICON_004_PRODUCTION_BATCH_4_ABSTRACT_ALPHA_REPORT.json');
  await writeAlphaReportJson(alphaReports, alphaReportPath);

  const manifest = {
    batchVersion: '2026-09-20-icon-004-production-batch-4-abstract-v1',
    contractPath: 'docs/design/research/TECHNOLOGY_RESEARCH_ICON_004_VISUAL_CONTRACT.md',
    contractStatus: 'CLOSE CANDIDATE — EXECUTIVE HUMAN VISUAL GATE PENDING',
    productionRegistryActivated: true,
    batch: 'batch-4-abstract',
    detailedTechnologyIds: BATCH_4_DETAILED_TECHNOLOGY_IDS,
    cumulativeDetailedCount: 22,
    promotedPilotIds: PROMOTED_FROM_PILOT,
    newArtTechnologyIds: [NEW_ART_TECHNOLOGY_ID],
    detailedPrimaries: detailedRecords,
    alphaReportPath: path.relative(projectRoot, alphaReportPath).replace(/\\/g, '/'),
    runtimePublicRoot: 'apps/web/public/assets/research',
    executiveLeadershipHumanApproval: 'PENDING',
  };

  await writeFile(
    path.join(productionRoot, 'ICON_004_PRODUCTION_BATCH_4_ABSTRACT_MANIFEST.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  const failed = alphaReports.filter((report) => !report.pass);
  if (failed.length > 0) {
    console.error(`${failed.length} primaries failed alpha QA`);
    process.exitCode = 1;
  } else {
    console.log(`ICON-004 Batch 4 abstract: ${alphaReports.length} primaries alpha PASS`);
  }
}

void main();
