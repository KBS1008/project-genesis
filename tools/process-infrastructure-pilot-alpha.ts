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
const pilotRoot = path.join(projectRoot, 'docs/design/buildings/infrastructure-pilot');
const primaryDesignDir = path.join(pilotRoot, 'primary');

const INFRA_PILOT_IDS = Object.freeze([
  { buildingId: 'access_road', grammar: 'LINEAR' },
  { buildingId: 'port', grammar: 'TERMINAL_YARD' },
  { buildingId: 'rail_terminal', grammar: 'TERMINAL_YARD' },
] as const);

const SOURCE_FALLBACK_DIRS = Object.freeze([
  path.join(projectRoot, 'assets'),
  path.join('C:/Users/Besitzer/.cursor/projects/d-Cursor-Project-Genesis/assets'),
] as const);

async function resolvePilotSource(buildingId: string): Promise<string> {
  const fileName = `ICON-003-${buildingId}-infra-pilot-source.png`;

  for (const dir of SOURCE_FALLBACK_DIRS) {
    const candidate = path.join(dir, fileName);
    try {
      await access(candidate);
      return candidate;
    } catch {
      // try next
    }
  }

  throw new Error(`Missing pilot source PNG for ${buildingId}`);
}

async function main(): Promise<void> {
  await mkdir(primaryDesignDir, { recursive: true });

  const alphaReports = [];

  for (const { buildingId } of INFRA_PILOT_IDS) {
    const source = await resolvePilotSource(buildingId);
    const primaryId = `ICON-003-${buildingId}-infra-pilot`;
    const primaryMaster = path.join(primaryDesignDir, `${primaryId}.png`);

    await removeBuildingArtBackground(source, primaryMaster);
    const report = await validateBuildingArtAlpha(primaryMaster);
    alphaReports.push(report);

    if (!report.pass) {
      console.warn(`WARN alpha QA not fully passing: ${primaryId}`, report);
    } else {
      console.log(`Alpha PASS: ${primaryId}`);
    }
  }

  const reportPath = path.join(pilotRoot, 'INFRASTRUCTURE_VISUAL_CONTRACT_ALPHA_REPORT.json');
  await writeAlphaReportJson(alphaReports, reportPath);

  const failed = alphaReports.filter((report) => !report.pass);
  if (failed.length > 0) {
    console.error(`${failed.length} pilot primaries failed alpha QA`);
    process.exitCode = 1;
  }
}

void main();
