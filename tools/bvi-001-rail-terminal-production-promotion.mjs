#!/usr/bin/env node
/* global Buffer, console, process */
/**
 * BVI-001: promote human-approved rail_terminal candidate to production + runtime sync.
 * Does not modify candidate, compact, recycling, registry, or resolver.
 */
import { createHash } from 'node:crypto';
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const APPROVED_CANDIDATE_HASH = '26f0136b748c4aa3ea80262fa4f649edb3e3a55788f6842f721826faa69f758c';
const EXPECTED_OLD_MASTER_HASH = 'bf7b0678bef38e13ea024836fed0ed2d6631b59600dcb3a593805645c6861eef';
const EXPECTED_OLD_WEBP_HASH = 'e5668e60b81dbac4c47500187c322262ac5740fa574d00f1ba6fdf3c2b74602c';
const EXPECTED_RECYCLING_MASTER_HASH = '3a1801bce15da36ca32bf94f89f98b7e1d998cadfd5aea6b6347ebbbccac57a9';
const EXPECTED_RECYCLING_WEBP_HASH = 'eb720d3945be72315cb6653a7c23315ca7c047e24e0fca8b4805183bb58e98b1';

const WEBP_QUALITY = 82;

const gateRoot = path.join(
  projectRoot,
  'docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate',
);
const evidenceDir = path.join(gateRoot, 'evidence');
const CANDIDATE = path.join(gateRoot, 'BVI-001-ICON-003-rail_terminal-candidate-primary.png');
const PRODUCTION_MASTER = path.join(
  projectRoot,
  'docs/design/buildings/production/infrastructure/primary/ICON-003-rail_terminal.png',
);
const RECYCLING_MASTER = path.join(
  projectRoot,
  'docs/design/buildings/production/batch-3/primary/ICON-003-recycling_facility.png',
);
const COMPACT_MASTER = path.join(
  projectRoot,
  'docs/design/buildings/production/infrastructure/compact/ICON-003-rail_terminal-compact.svg',
);
const RUNTIME_WEBP = path.join(projectRoot, 'apps/web/public/assets/buildings/ICON-003-rail_terminal.webp');
const RUNTIME_PNG = path.join(projectRoot, 'apps/web/public/assets/buildings/ICON-003-rail_terminal.png');
const RECYCLING_WEBP = path.join(
  projectRoot,
  'apps/web/public/assets/buildings/ICON-003-recycling_facility.webp',
);
const FAULTY_ARCHIVE = path.join(
  evidenceDir,
  'BVI-001_FAULTY_PRODUCTION_MASTER_ARCHIVE.png',
);
const MANIFEST_PATH = path.join(
  projectRoot,
  'docs/design/buildings/production/infrastructure/ICON_003_INFRASTRUCTURE_PRODUCTION_MANIFEST.json',
);
const SOURCE_RECORD_PATH = path.join(gateRoot, 'BVI-001-SOURCE_RECORD.json');

const ALL_BUILDINGS = [
  'sawmill',
  'smelter',
  'warehouse',
  'coal_power_plant',
  'machine_shop',
  'logistics_hub',
  'research_campus',
  'corporate_headquarters',
  'assembly_plant',
  'headquarters',
  'electronics_factory',
  'consumer_goods_plant',
  'solar_power_plant',
  'distribution_center',
  'university',
  'power_substation',
  'maintenance_facility',
  'recycling_facility',
  'regional_headquarters',
  'training_center',
  'access_road',
  'port',
  'rail_terminal',
];

function batchFor(buildingTypeId) {
  if (
    ['sawmill', 'smelter', 'warehouse', 'coal_power_plant', 'machine_shop', 'logistics_hub', 'research_campus', 'corporate_headquarters'].includes(
      buildingTypeId,
    )
  ) {
    return 'batch-1';
  }
  if (
    [
      'assembly_plant',
      'headquarters',
      'electronics_factory',
      'consumer_goods_plant',
      'solar_power_plant',
      'distribution_center',
      'university',
      'power_substation',
    ].includes(buildingTypeId)
  ) {
    return 'batch-2';
  }
  if (['access_road', 'port', 'rail_terminal'].includes(buildingTypeId)) {
    return 'infrastructure';
  }
  return 'batch-3';
}

function primaryPath(buildingTypeId) {
  return path.join(
    projectRoot,
    'docs/design/buildings/production',
    batchFor(buildingTypeId),
    'primary',
    `ICON-003-${buildingTypeId}.png`,
  );
}

async function sha256(filePath) {
  return createHash('sha256').update(await readFile(filePath)).digest('hex');
}

async function syncPrimaryToRuntime(sourcePath) {
  await copyFile(sourcePath, RUNTIME_PNG);
  await sharp(sourcePath).webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(RUNTIME_WEBP);
}

function labelSvg(text, x, y, fontSize = 18, weight = 600) {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<text x="${x}" y="${y}" fill="#e8eef4" font-family="Segoe UI, Arial, sans-serif" font-size="${fontSize}" font-weight="${weight}">${escaped}</text>`;
}

async function loadNormalizedPng(filePath, maxDim) {
  let pipeline = sharp(filePath).ensureAlpha();
  try {
    pipeline = sharp(await pipeline.trim({ threshold: 12 }).toBuffer()).ensureAlpha();
  } catch {
    pipeline = sharp(filePath).ensureAlpha();
  }
  return pipeline.resize(maxDim, maxDim, { fit: 'inside' }).png().toBuffer();
}

async function composeCloseoutBoard(oldMasterPath, newMasterPath, recyclingPath, outPath) {
  const cell = 360;
  const labelH = 48;
  const pad = 24;
  const width = 3 * cell + 4 * pad;
  const height = cell + labelH + pad * 2;
  const subjectSize = 300;
  const sources = [oldMasterPath, newMasterPath, recyclingPath];
  const titles = [
    'OLD FAULTY BAHNTERMINAL (pre-BVI-001 production)',
    'NEW PRODUCTION BAHNTERMINAL (promoted master)',
    'RECYCLINGANLAGE (unchanged reference)',
  ];
  const loaded = await Promise.all(sources.map((p) => loadNormalizedPng(p, subjectSize)));
  const composites = [];
  const labels = [
    labelSvg('BVI-001 production closeout — semantic collision repair', pad, 22, 22),
    labelSvg('Production promotion evidence (not human art gate)', pad, 44, 13, 400),
  ];

  for (let i = 0; i < 3; i += 1) {
    const left = pad + i * (cell + pad);
    const top = pad + labelH;
    const plate = await sharp({
      create: { width: cell, height: cell, channels: 4, background: { r: 42, g: 52, b: 64, alpha: 255 } },
    })
      .png()
      .toBuffer();
    composites.push({ input: plate, left, top });
    const img = loaded[i];
    const meta = await sharp(img).metadata();
    const artLeft = left + Math.floor((cell - meta.width) / 2);
    const artTop = top + Math.floor((cell - meta.height) / 2);
    composites.push({ input: img, left: artLeft, top: artTop });
    labels.push(labelSvg(titles[i], left + 8, top - 10, 15));
  }

  const svgLabels = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${labels.join('')}</svg>`,
  );

  const buf = await sharp({
    create: { width, height, channels: 4, background: { r: 18, g: 24, b: 30, alpha: 255 } },
  })
    .composite([{ input: svgLabels, top: 0, left: 0 }])
    .composite(composites)
    .png()
    .toBuffer();

  await writeFile(outPath, buf);
  const mirror = path.join(
    projectRoot,
    'docs/architecture/reviews/evidence/BVI-001_RAIL_TERMINAL_PRODUCTION_CLOSEOUT_BOARD.png',
  );
  await writeFile(mirror, buf);
}

async function scan23Primaries() {
  const hashes = new Map();
  const results = [];
  for (const id of ALL_BUILDINGS) {
    const filePath = primaryPath(id);
    const hash = await sha256(filePath);
    const meta = await sharp(filePath).metadata();
    if (hashes.has(hash)) {
      throw new Error(`Hash collision: ${id} collides with ${hashes.get(hash)} (${hash})`);
    }
    hashes.set(hash, id);
    results.push({ id, filePath, hash, width: meta.width, height: meta.height });
  }
  return results;
}

async function main() {
  const candidateHash = await sha256(CANDIDATE);
  if (candidateHash !== APPROVED_CANDIDATE_HASH) {
    throw new Error(`APPROVED CANDIDATE IDENTITY MISMATCH: ${candidateHash}`);
  }

  const oldMasterHash = await sha256(PRODUCTION_MASTER);
  if (oldMasterHash !== EXPECTED_OLD_MASTER_HASH) {
    throw new Error(`Unexpected old production master hash: ${oldMasterHash}`);
  }

  const oldWebpHash = await sha256(RUNTIME_WEBP);
  if (oldWebpHash !== EXPECTED_OLD_WEBP_HASH) {
    throw new Error(`Unexpected old runtime WebP hash: ${oldWebpHash}`);
  }

  const recyclingBefore = await sha256(RECYCLING_MASTER);
  const recyclingWebpBefore = await sha256(RECYCLING_WEBP);
  const compactBefore = await sha256(COMPACT_MASTER);
  if (recyclingBefore !== EXPECTED_RECYCLING_MASTER_HASH) {
    throw new Error(`Unexpected recycling master hash: ${recyclingBefore}`);
  }
  if (recyclingWebpBefore !== EXPECTED_RECYCLING_WEBP_HASH) {
    throw new Error(`Unexpected recycling WebP hash: ${recyclingWebpBefore}`);
  }

  await copyFile(PRODUCTION_MASTER, FAULTY_ARCHIVE);

  await copyFile(CANDIDATE, PRODUCTION_MASTER);
  const newMasterHash = await sha256(PRODUCTION_MASTER);
  if (newMasterHash !== APPROVED_CANDIDATE_HASH) {
    throw new Error('Production master does not match approved candidate after copy');
  }

  await syncPrimaryToRuntime(PRODUCTION_MASTER);
  const newWebpHash = await sha256(RUNTIME_WEBP);

  const recyclingAfter = await sha256(RECYCLING_MASTER);
  const recyclingWebpAfter = await sha256(RECYCLING_WEBP);
  const compactAfter = await sha256(COMPACT_MASTER);
  const candidateAfter = await sha256(CANDIDATE);

  if (recyclingAfter !== recyclingBefore || recyclingWebpAfter !== recyclingWebpBefore) {
    throw new Error('Recycling firewall violated');
  }
  if (compactAfter !== compactBefore) {
    throw new Error('Compact firewall violated');
  }
  if (candidateAfter !== APPROVED_CANDIDATE_HASH) {
    throw new Error('Candidate changed during promotion');
  }
  if (newWebpHash === oldWebpHash) {
    throw new Error('Runtime WebP hash unchanged after promotion');
  }

  const closeoutPath = path.join(evidenceDir, 'BVI-001_RAIL_TERMINAL_PRODUCTION_CLOSEOUT_BOARD.png');
  await composeCloseoutBoard(FAULTY_ARCHIVE, PRODUCTION_MASTER, RECYCLING_MASTER, closeoutPath);

  const scan = await scan23Primaries();

  const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  const railEntry = manifest.buildings.find((b) => b.buildingTypeId === 'rail_terminal');
  if (!railEntry) {
    throw new Error('rail_terminal missing from infrastructure manifest');
  }
  railEntry.bvi001Repair = {
    defect: 'BV-I6 — MASTER / SOURCE ASSET DEFECT',
    humanArtGate: 'PASS',
    approvedCandidate: path.relative(projectRoot, CANDIDATE).replace(/\\/g, '/'),
    approvedCandidateSha256: APPROVED_CANDIDATE_HASH,
    faultyMasterArchive: path.relative(projectRoot, FAULTY_ARCHIVE).replace(/\\/g, '/'),
    previousProductionMasterSha256: oldMasterHash,
    productionMasterSha256: newMasterHash,
    previousRuntimeWebpSha256: oldWebpHash,
    runtimeWebpSha256: newWebpHash,
    promotedAt: '2026-09-26',
    productionStatus: 'ACTIVE — BVI-001 INTEGRITY REPAIR',
  };
  railEntry.promotedFromPilotPrimary =
    'docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/BVI-001-ICON-003-rail_terminal-candidate-primary.png';
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

  const sourceRecord = JSON.parse(await readFile(SOURCE_RECORD_PATH, 'utf8'));
  sourceRecord.humanVisualGate = 'PASS';
  sourceRecord.productionPromotion = {
    date: '2026-09-26',
    approvedCandidateSha256: APPROVED_CANDIDATE_HASH,
    faultyProductionMasterSha256: oldMasterHash,
    productionMasterSha256: newMasterHash,
    runtimeWebpSha256Before: oldWebpHash,
    runtimeWebpSha256After: newWebpHash,
    faultyMasterArchive: path.relative(projectRoot, FAULTY_ARCHIVE).replace(/\\/g, '/'),
    closeoutBoard: path.relative(projectRoot, closeoutPath).replace(/\\/g, '/'),
    pipeline: 'copyFile + sharp.webp quality 82 effort 4 (ICON-003 infrastructure production convention)',
  };
  sourceRecord.productionHashesAfter = {
    rail_terminal_master: newMasterHash,
    rail_terminal_webp: newWebpHash,
    recycling_master: recyclingAfter,
    recycling_webp: recyclingWebpAfter,
  };
  await writeFile(SOURCE_RECORD_PATH, `${JSON.stringify(sourceRecord, null, 2)}\n`);

  const report = {
    candidateHashBefore: APPROVED_CANDIDATE_HASH,
    candidateHashAfter: candidateAfter,
    oldMasterHash,
    newMasterHash,
    oldWebpHash,
    newWebpHash,
    recyclingMaster: { before: recyclingBefore, after: recyclingAfter },
    recyclingWebp: { before: recyclingWebpBefore, after: recyclingWebpAfter },
    compact: { before: compactBefore, after: compactAfter },
    primaryIntegrityScan: { count: scan.length, pass: scan.length === 23 },
    closeoutBoard: path.relative(projectRoot, closeoutPath).replace(/\\/g, '/'),
    faultyArchive: path.relative(projectRoot, FAULTY_ARCHIVE).replace(/\\/g, '/'),
  };

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
