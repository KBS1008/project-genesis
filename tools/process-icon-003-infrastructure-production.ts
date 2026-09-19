#!/usr/bin/env tsx
import { copyFile, mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  validateBuildingArtAlpha,
  writeAlphaReportJson,
} from './building-art-alpha.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pilotRoot = path.join(projectRoot, 'docs/design/buildings/infrastructure-pilot');
const productionRoot = path.join(projectRoot, 'docs/design/buildings/production/infrastructure');
const primaryDesignDir = path.join(productionRoot, 'primary');
const compactDesignDir = path.join(productionRoot, 'compact');
const publicBuildingsDir = path.join(projectRoot, 'apps/web/public/assets/buildings');

const WEBP_QUALITY = 82;

const INFRASTRUCTURE_IDS = Object.freeze(['access_road', 'port', 'rail_terminal'] as const);

const GRAMMAR_BY_ID: Record<(typeof INFRASTRUCTURE_IDS)[number], string> = {
  access_road: 'LINEAR',
  port: 'TERMINAL_YARD',
  rail_terminal: 'TERMINAL_YARD',
};

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
  const manifestBuildings = [];

  for (const buildingId of INFRASTRUCTURE_IDS) {
    const pilotPrimary = path.join(pilotRoot, 'primary', `ICON-003-${buildingId}-infra-pilot.png`);
    const pilotCompact = path.join(pilotRoot, 'compact', `ICON-003-${buildingId}-infra-pilot-compact.svg`);

    const primaryId = `ICON-003-${buildingId}`;
    const compactId = `${primaryId}-compact`;
    const primaryMaster = path.join(primaryDesignDir, `${primaryId}.png`);
    const compactMaster = path.join(compactDesignDir, `${compactId}.svg`);

    await copyFile(pilotPrimary, primaryMaster);
    const report = await validateBuildingArtAlpha(primaryMaster);
    alphaReports.push(report);

    if (!report.pass) {
      console.warn(`WARN alpha QA not fully passing: ${primaryId}`, report);
    } else {
      console.log(`Alpha PASS: ${primaryId}`);
    }

    await syncPrimaryToRuntime(primaryId, primaryMaster);

    await copyFile(pilotCompact, compactMaster);
    await syncCompactToRuntime(compactId, compactMaster);

    manifestBuildings.push({
      buildingTypeId: buildingId,
      grammar: GRAMMAR_BY_ID[buildingId],
      primaryId,
      compactId,
      promotedFromPilotPrimary: `docs/design/buildings/infrastructure-pilot/primary/ICON-003-${buildingId}-infra-pilot.png`,
      promotedFromPilotCompact: `docs/design/buildings/infrastructure-pilot/compact/ICON-003-${buildingId}-infra-pilot-compact.svg`,
      sourceMaster: `docs/design/buildings/production/infrastructure/primary/${primaryId}.png`,
      runtimePrimary: `apps/web/public/assets/buildings/${primaryId}.webp`,
      runtimeCompact: `apps/web/public/assets/buildings/${compactId}.svg`,
      alphaPass: report.pass,
      productionStatus: 'ACTIVE',
    });
  }

  const reportPath = path.join(productionRoot, 'ICON_003_INFRASTRUCTURE_PRODUCTION_ALPHA_REPORT.json');
  await writeAlphaReportJson(alphaReports, reportPath);

  const manifestPath = path.join(productionRoot, 'ICON_003_INFRASTRUCTURE_PRODUCTION_MANIFEST.json');
  await writeFile(
    manifestPath,
    `${JSON.stringify(
      {
        productionVersion: '2026-09-19-infrastructure-23-of-23',
        contractAuthority: 'BUILDING_INFRASTRUCTURE_VISUAL_CONTRACT.md — APPROVED / PRODUCTION AUTHORITY',
        humanApproval: 'APPROVED / PASS / SEALED',
        naming: {
          primary: 'ICON-003-{buildingTypeId}',
          compact: 'ICON-003-{buildingTypeId}-compact',
          categoryFallback: 'ICON-002-{category}',
        },
        buildings: manifestBuildings,
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  const failed = alphaReports.filter((r) => !r.pass);
  if (failed.length > 0) {
    console.error(`${failed.length} infrastructure assets failed alpha QA`);
    process.exitCode = 1;
  }
}

void main();
