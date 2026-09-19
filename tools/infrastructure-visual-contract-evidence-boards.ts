#!/usr/bin/env tsx
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');
const pilotPrimaryDir = path.join(projectRoot, 'docs/design/buildings/infrastructure-pilot/primary');
const pilotCompactDir = path.join(projectRoot, 'docs/design/buildings/infrastructure-pilot/compact');

const COMPARISON_ANCHORS = [
  { id: 'warehouse', batch: 'batch-1' },
  { id: 'distribution_center', batch: 'batch-2' },
  { id: 'logistics_hub', batch: 'batch-1' },
  { id: 'maintenance_facility', batch: 'batch-3' },
  { id: 'research_campus', batch: 'batch-1' },
] as const;

const INFRA_PILOTS = ['access_road', 'port', 'rail_terminal'] as const;

const CATALOG_ANCHORS = ['warehouse', 'logistics_hub', 'distribution_center'] as const;

function productionPrimary(buildingTypeId: string, batch: string): string {
  return path.join(
    projectRoot,
    'docs/design/buildings/production',
    batch,
    'primary',
    `ICON-003-${buildingTypeId}.png`,
  );
}

function productionCompact(buildingTypeId: string, batch: string): string {
  return path.join(
    projectRoot,
    'docs/design/buildings/production',
    batch,
    'compact',
    `ICON-003-${buildingTypeId}-compact.svg`,
  );
}

async function loadPrimaryPng(filePath: string, size: number): Promise<Buffer> {
  return sharp(filePath).resize(size, size, { fit: 'inside' }).png().toBuffer();
}

async function loadCompactSvg(filePath: string, size: number): Promise<Buffer> {
  return sharp(await readFile(filePath)).resize(size, size).png().toBuffer();
}

async function composePrimaryComparisonBoard(): Promise<void> {
  const labels = [
    ...COMPARISON_ANCHORS.map((a) => a.id),
    ...INFRA_PILOTS.map((id) => `${id} (pilot)`),
  ];
  const CELL = 220;
  const LABEL_H = 28;
  const PAD = 16;
  const COLS = 4;
  const rows = Math.ceil(labels.length / COLS);
  const width = COLS * CELL + (COLS + 1) * PAD;
  const height = rows * (CELL + LABEL_H) + (rows + 1) * PAD;

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 15, g: 20, b: 25, alpha: 255 },
    },
  });

  const composites: { input: Buffer; left: number; top: number }[] = [];

  let index = 0;
  for (const anchor of COMPARISON_ANCHORS) {
    const col = index % COLS;
    const row = Math.floor(index / COLS);
    const left = PAD + col * (CELL + PAD);
    const top = PAD + row * (CELL + LABEL_H + PAD) + LABEL_H;
    const buffer = await loadPrimaryPng(productionPrimary(anchor.id, anchor.batch), CELL);
    composites.push({ input: buffer, left, top });
    index += 1;
  }

  for (const buildingId of INFRA_PILOTS) {
    const col = index % COLS;
    const row = Math.floor(index / COLS);
    const left = PAD + col * (CELL + PAD);
    const top = PAD + row * (CELL + LABEL_H + PAD) + LABEL_H;
    const pilotPath = path.join(pilotPrimaryDir, `ICON-003-${buildingId}-infra-pilot.png`);
    const buffer = await loadPrimaryPng(pilotPath, CELL);
    composites.push({ input: buffer, left, top });
    index += 1;
  }

  const target = path.join(evidenceDir, 'INFRASTRUCTURE_VISUAL_CONTRACT_PRIMARY_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeCompactBoard(): Promise<void> {
  const sizes = [24, 32, 48] as const;
  const sampleCompacts = [
    { id: 'warehouse', batch: 'batch-1' },
    { id: 'logistics_hub', batch: 'batch-1' },
    { id: 'distribution_center', batch: 'batch-2' },
  ] as const;

  const ROW_H = 64;
  const COL_W = 72;
  const PAD = 20;
  const headerRows = 1;
  const dataRows = sampleCompacts.length + INFRA_PILOTS.length;
  const width = PAD + sizes.length * COL_W + PAD + sizes.length * COL_W;
  const height = PAD + headerRows * 24 + dataRows * (ROW_H + PAD) + PAD;

  const base = sharp({
    create: {
      width: Math.max(width, 520),
      height,
      channels: 4,
      background: { r: 15, g: 20, b: 25, alpha: 255 },
    },
  });

  const composites: { input: Buffer; left: number; top: number }[] = [];
  let row = 0;

  for (const sample of sampleCompacts) {
    let col = 0;
    for (const size of sizes) {
      const svgPath = productionCompact(sample.id, sample.batch);
      const buffer = await loadCompactSvg(svgPath, size);
      composites.push({
        input: buffer,
        left: PAD + col * COL_W,
        top: PAD + 24 + row * (ROW_H + PAD) + Math.floor((ROW_H - size) / 2),
      });
      col += 1;
    }
    row += 1;
  }

  for (const buildingId of INFRA_PILOTS) {
    let col = 0;
    for (const size of sizes) {
      const svgPath = path.join(pilotCompactDir, `ICON-003-${buildingId}-infra-pilot-compact.svg`);
      const buffer = await loadCompactSvg(svgPath, size);
      composites.push({
        input: buffer,
        left: PAD + col * COL_W,
        top: PAD + 24 + row * (ROW_H + PAD) + Math.floor((ROW_H - size) / 2),
      });
      col += 1;
    }
    row += 1;
  }

  const target = path.join(evidenceDir, 'INFRASTRUCTURE_VISUAL_CONTRACT_COMPACT_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeCatalogScaleBoard(): Promise<void> {
  const CATALOG_SIZE = 72;
  const PAD = 24;
  const items = [
    ...CATALOG_ANCHORS.map((id) => ({
      kind: 'production' as const,
      id,
      batch: id === 'warehouse' || id === 'logistics_hub' ? 'batch-1' : 'batch-2',
    })),
    ...INFRA_PILOTS.map((id) => ({ kind: 'pilot' as const, id })),
  ];

  const COLS = items.length;
  const width = COLS * (CATALOG_SIZE + PAD) + PAD;
  const height = CATALOG_SIZE + PAD * 2 + 32;

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = await Promise.all(
    items.map(async (item, index) => {
      const left = PAD + index * (CATALOG_SIZE + PAD);
      const top = PAD + 16;
      let buffer: Buffer;
      if (item.kind === 'production') {
        buffer = await loadPrimaryPng(productionPrimary(item.id, item.batch), CATALOG_SIZE);
      } else {
        const pilotPath = path.join(pilotPrimaryDir, `ICON-003-${item.id}-infra-pilot.png`);
        buffer = await loadPrimaryPng(pilotPath, CATALOG_SIZE);
      }
      return { input: buffer, left, top };
    }),
  );

  const target = path.join(evidenceDir, 'INFRASTRUCTURE_VISUAL_CONTRACT_CATALOG_SCALE.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function main(): Promise<void> {
  await Promise.all([composePrimaryComparisonBoard(), composeCompactBoard(), composeCatalogScaleBoard()]);
}

void main();
