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
const pilotRoot = path.join(projectRoot, 'docs/design/research/pilot-icon-004');
const abstractPrimaryDir = path.join(pilotRoot, 'abstract-primary');

const ABSTRACT_PILOT_TECHNOLOGY_IDS = Object.freeze([
  'corporate_management',
  'financial_planning',
  'predictive_analytics',
] as const);

const HOLDOUT_TECHNOLOGY_ID = 'executive_leadership';

const SOURCE_FALLBACK_DIRS = Object.freeze([
  path.join(projectRoot, 'assets'),
  path.join('C:/Users/Besitzer/.cursor/projects/d-Cursor-Project-Genesis/assets'),
] as const);

function pilotMasterFileName(technologyId: string): string {
  return `ICON-004-tech-${technologyId}-primary-abstract-pilot.png`;
}

async function resolveSource(technologyId: string): Promise<string> {
  const fileName = `ICON-004-tech-${technologyId}-primary-abstract-pilot-source.png`;
  for (const dir of SOURCE_FALLBACK_DIRS) {
    const candidate = path.join(dir, fileName);
    try {
      await stat(candidate);
      return candidate;
    } catch {
      // continue
    }
  }

  throw new Error(`Missing abstract pilot source for ${technologyId}`);
}

async function main(): Promise<void> {
  await mkdir(abstractPrimaryDir, { recursive: true });

  const alphaReports = [];
  const pilotRecords = [];

  const grammarById: Record<string, string> = {
    corporate_management: 'Organizational Control System',
    financial_planning: 'Operational Planning Apparatus',
    predictive_analytics: 'Information Analysis Apparatus',
  };

  for (const technologyId of ABSTRACT_PILOT_TECHNOLOGY_IDS) {
    const source = await resolveSource(technologyId);
    const masterPath = path.join(abstractPrimaryDir, pilotMasterFileName(technologyId));
    await removeBuildingArtBackground(source, masterPath);
    const report = await validateBuildingArtAlpha(masterPath);
    alphaReports.push(report);

    pilotRecords.push({
      technologyId,
      abstractGrammar: grammarById[technologyId],
      pilotMaster: path.relative(projectRoot, masterPath).replace(/\\/g, '/'),
      alphaResult: report.pass ? 'PASS' : 'FAIL',
      productionStatus: 'PILOT / DEV ONLY — NOT PRODUCTION',
      humanApproval: 'PENDING',
    });
  }

  const alphaReportPath = path.join(pilotRoot, 'ICON_004_ABSTRACT_TECHNOLOGY_PILOT_ALPHA_REPORT.json');
  await writeAlphaReportJson(alphaReports, alphaReportPath);

  const manifest = {
    pilotVersion: '2026-09-20-icon-004-abstract-technology-art-direction-pilot-v1',
    purpose: 'Human-gated abstract Tier-1 subgrammar pilot — NOT production activation',
    holdoutTechnologyId: HOLDOUT_TECHNOLOGY_ID,
    holdoutReason:
      'Management/leadership pair stress-test; extend grammar after human gate without conflating pilot with 4/4 production',
    sharedSubgrammar:
      'Instrumented industrial decision/planning/analysis apparatus (physical controls, racks, modules — no people/UI clichés)',
    pilotTechnologyIds: ABSTRACT_PILOT_TECHNOLOGY_IDS,
    productionDetailedCoverageUnchanged: '18/22',
    pilotPrimaries: pilotRecords,
    alphaReportPath: path.relative(projectRoot, alphaReportPath).replace(/\\/g, '/'),
  };

  await writeFile(
    path.join(pilotRoot, 'ICON_004_ABSTRACT_TECHNOLOGY_PILOT_MANIFEST.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  const failed = alphaReports.filter((report) => !report.pass);
  if (failed.length > 0) {
    console.error(`${failed.length} abstract pilot primaries failed alpha QA`);
    process.exitCode = 1;
  } else {
    console.log(`ICON-004 abstract pilot: ${alphaReports.length} primaries alpha PASS`);
  }
}

void main();
