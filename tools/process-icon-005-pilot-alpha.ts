#!/usr/bin/env tsx
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  removeBuildingArtBackground,
  validateBuildingArtAlpha,
  writeAlphaReportJson,
} from './building-art-alpha.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pilotRoot = path.join(projectRoot, 'docs/design/production/pilot-icon-005');
const processPrimaryDir = path.join(pilotRoot, 'process-primary');

const PILOT_RECIPE_IDS = Object.freeze([
  'recipe_planks',
  'recipe_steel',
  'recipe_advanced_electronics',
] as const);

const SOURCE_FALLBACK_DIRS = Object.freeze([
  path.join(projectRoot, 'assets'),
  path.join('C:/Users/Besitzer/.cursor/projects/d-Cursor-Project-Genesis/assets'),
] as const);

function pilotMasterFileName(recipeId: string): string {
  return `ICON-005-${recipeId}-primary-pilot.png`;
}

function sourceFileName(recipeId: string): string {
  return `ICON-005-${recipeId}-primary-pilot-source.png`;
}

async function resolveSource(recipeId: string): Promise<string> {
  const candidates = [
    sourceFileName(recipeId),
    `ICON-005-recipe-${recipeId}-primary-pilot-source.png`,
  ];
  for (const fileName of candidates) {
    for (const dir of SOURCE_FALLBACK_DIRS) {
      const candidate = path.join(dir, fileName);
      try {
        await stat(candidate);
        return candidate;
      } catch {
        // continue
      }
    }
  }

  throw new Error(`Missing ICON-005 pilot source for ${recipeId}`);
}

const PROCESS_CLASS: Record<string, string> = {
  recipe_planks: 'early / simple material transformation',
  recipe_steel: 'heavy industrial / thermal transformation',
  recipe_advanced_electronics: 'late / precision assembly',
};

async function main(): Promise<void> {
  await mkdir(processPrimaryDir, { recursive: true });

  const alphaReports = [];
  const pilotRecords = [];

  for (const recipeId of PILOT_RECIPE_IDS) {
    const source = await resolveSource(recipeId);
    const masterPath = path.join(processPrimaryDir, pilotMasterFileName(recipeId));
    await removeBuildingArtBackground(source, masterPath);
    const report = await validateBuildingArtAlpha(masterPath);
    alphaReports.push(report);

    pilotRecords.push({
      recipeId,
      processClass: PROCESS_CLASS[recipeId],
      pilotMaster: path.relative(projectRoot, masterPath).replace(/\\/g, '/'),
      sourcePath: path.relative(projectRoot, source).replace(/\\/g, '/'),
      alphaResult: report.pass ? 'PASS' : 'FAIL',
      status: 'PILOT / DEV ONLY — NOT PRODUCTION',
      humanApproval: 'PENDING',
    });
  }

  const alphaReportPath = path.join(pilotRoot, 'ICON_005_PROCESS_VISUAL_PILOT_ALPHA_REPORT.json');
  await writeAlphaReportJson(alphaReports, alphaReportPath);

  const manifest = {
    pilotVersion: '2026-09-20-icon-005-production-process-art-direction-pilot-v1',
    purpose: 'Human-gated process Tier-1 subgrammar pilot — NOT production activation',
    contractPath: 'docs/design/production/PRODUCTION_PROCESS_ICON_005_VISUAL_CONTRACT.md',
    contractStatus: 'PILOT / HUMAN APPROVAL REQUIRED',
    sharedGrammar: 'Detailed industrial process vignette — active transformation apparatus, not building catalog',
    pilotRecipeIds: PILOT_RECIPE_IDS,
    holdoutRecipeIds: [
      'recipe_machine_parts',
      'recipe_industrial_machinery',
      'recipe_consumer_goods',
      'recipe_advanced_planks',
    ],
    productionProcessCoverageUnchanged: '0/7 production-active',
    pilotPrimaries: pilotRecords,
    alphaReportPath: path.relative(projectRoot, alphaReportPath).replace(/\\/g, '/'),
  };

  await writeFile(
    path.join(pilotRoot, 'ICON_005_PROCESS_VISUAL_PILOT_MANIFEST.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  const failed = alphaReports.filter((report) => !report.pass);
  if (failed.length > 0) {
    console.error(`${failed.length} ICON-005 pilot primaries failed alpha QA`);
    process.exitCode = 1;
  } else {
    console.log(`ICON-005 process pilot: ${alphaReports.length} primaries alpha PASS`);
  }
}

void main();
