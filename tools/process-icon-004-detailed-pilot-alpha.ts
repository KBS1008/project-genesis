#!/usr/bin/env tsx
import { access, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  removeBuildingArtBackground,
  validateBuildingArtAlpha,
  writeAlphaReportJson,
} from './building-art-alpha.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pilotRoot = path.join(projectRoot, 'docs/design/research/pilot-icon-004');
const primaryDesignDir = path.join(pilotRoot, 'detailed-primary');

const PILOT_TECH_IDS = ['precision_machining', 'renewable_energy', 'semiconductor_process'] as const;

const SOURCE_FALLBACK_DIRS = Object.freeze([
  path.join(projectRoot, 'assets'),
  path.join('C:/Users/Besitzer/.cursor/projects/d-Cursor-Project-Genesis/assets'),
] as const);

async function resolvePilotSource(technologyId: string): Promise<string> {
  const fileName = `ICON-004-tech-${technologyId}-primary-pilot-source.png`;

  for (const dir of SOURCE_FALLBACK_DIRS) {
    const candidate = path.join(dir, fileName);
    try {
      await access(candidate);
      return candidate;
    } catch {
      // try next
    }
  }

  throw new Error(`Missing pilot source PNG for ${technologyId}`);
}

async function main(): Promise<void> {
  await mkdir(primaryDesignDir, { recursive: true });

  const alphaReports = [];

  for (const technologyId of PILOT_TECH_IDS) {
    const source = await resolvePilotSource(technologyId);
    const primaryMaster = path.join(
      primaryDesignDir,
      `ICON-004-tech-${technologyId}-primary-pilot.png`,
    );

    await removeBuildingArtBackground(source, primaryMaster);
    const report = await validateBuildingArtAlpha(primaryMaster);
    alphaReports.push(report);

    if (!report.pass) {
      console.warn(`WARN alpha QA not fully passing: ${technologyId}`, report);
    } else {
      console.log(`Alpha PASS: ICON-004-tech-${technologyId}-primary-pilot`);
    }
  }

  const reportPath = path.join(pilotRoot, 'ICON_004_DETAILED_TECHNOLOGY_PILOT_ALPHA_REPORT.json');
  await writeAlphaReportJson(alphaReports, reportPath);

  const failed = alphaReports.filter((report) => !report.pass);
  if (failed.length > 0) {
    console.error(`${failed.length} detailed technology primaries failed alpha QA`);
    process.exitCode = 1;
  }
}

void main();
