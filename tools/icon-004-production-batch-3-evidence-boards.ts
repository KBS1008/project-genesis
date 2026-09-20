#!/usr/bin/env tsx
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');
const batch1PrimaryDir = path.join(projectRoot, 'docs/design/research/production/batch-1/primary');
const batch2PrimaryDir = path.join(projectRoot, 'docs/design/research/production/batch-2/primary');
const batch3PrimaryDir = path.join(projectRoot, 'docs/design/research/production/batch-3/primary');
const buildingsDir = path.join(projectRoot, 'apps/web/public/assets/buildings');

const BATCH_1_IDS = [
  'precision_machining',
  'renewable_energy',
  'semiconductor_process',
  'advanced_metallurgy',
  'coal_efficiency',
  'intermodal_logistics',
  'circuit_design',
  'factory_automation',
] as const;

const BATCH_2_IDS = [
  'basic_woodworking',
  'industrial_assembly',
  'smart_grid',
  'warehouse_systems',
  'process_automation',
  'organic_chemistry',
] as const;

const BATCH_3_IDS = [
  'distribution_networks',
  'polymer_science',
  'sustainable_agriculture',
  'crop_optimization',
] as const;

const ALL_DETAILED = [...BATCH_1_IDS, ...BATCH_2_IDS, ...BATCH_3_IDS] as const;

function primaryDirFor(technologyId: string): string {
  if (BATCH_3_IDS.includes(technologyId as (typeof BATCH_3_IDS)[number])) {
    return batch3PrimaryDir;
  }
  if (BATCH_2_IDS.includes(technologyId as (typeof BATCH_2_IDS)[number])) {
    return batch2PrimaryDir;
  }
  return batch1PrimaryDir;
}

async function loadPrimary(size: number, technologyId: string): Promise<Buffer> {
  const dir = primaryDirFor(technologyId);
  return sharp(await readFile(path.join(dir, `ICON-004-${technologyId}-primary.png`)))
    .resize(size, size, { fit: 'inside' })
    .png()
    .toBuffer();
}

async function loadBuilding(size: number, buildingId: string): Promise<Buffer> {
  return sharp(await readFile(path.join(buildingsDir, `ICON-003-${buildingId}.png`)))
    .resize(size, size, { fit: 'inside' })
    .png()
    .toBuffer();
}

async function compose18FamilyBoard(): Promise<void> {
  const displaySize = 160;
  const pad = 16;
  const cols = 6;
  const rows = 3;
  const cell = displaySize + pad;
  const width = pad + cols * cell;
  const height = pad + rows * cell + 32;

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let index = 0; index < ALL_DETAILED.length; index += 1) {
    const technologyId = ALL_DETAILED[index]!;
    const col = index % cols;
    const row = Math.floor(index / cols);
    composites.push({
      input: await loadPrimary(displaySize, technologyId),
      left: pad + col * cell,
      top: pad + row * cell,
    });
  }

  const target = path.join(evidenceDir, 'ICON_004_PRODUCTION_BATCH_3_DETAILED_FAMILY_BOARD_18.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeNewFourBoard(): Promise<void> {
  const displaySize = 340;
  const pad = 28;
  const cols = 2;
  const rows = 2;
  const cell = displaySize + pad;
  const width = pad + cols * cell;
  const height = pad + rows * cell + 40;

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let index = 0; index < BATCH_3_IDS.length; index += 1) {
    const technologyId = BATCH_3_IDS[index]!;
    const col = index % cols;
    const row = Math.floor(index / cols);
    composites.push({
      input: await loadPrimary(displaySize, technologyId),
      left: pad + col * cell,
      top: pad + row * cell,
    });
  }

  const target = path.join(evidenceDir, 'ICON_004_PRODUCTION_BATCH_3_NEW_FOUR_FAMILY_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeAgriculturePairBoard(): Promise<void> {
  const sizes = [96, 128, 256] as const;
  const pad = 24;
  const cell = 280;
  const width = pad + 2 * (cell + pad);
  const height = pad + sizes.length * (cell + pad) + 80;

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const agIds = ['sustainable_agriculture', 'crop_optimization'] as const;
  const composites = [];
  for (let row = 0; row < sizes.length; row += 1) {
    const size = sizes[row]!;
    for (let col = 0; col < agIds.length; col += 1) {
      const technologyId = agIds[col]!;
      composites.push({
        input: await loadPrimary(size, technologyId),
        left: pad + col * (cell + pad) + Math.floor((cell - size) / 2),
        top: pad + 48 + row * (cell + pad) + Math.floor((cell - size) / 2),
      });
    }
  }

  const target = path.join(evidenceDir, 'ICON_004_PRODUCTION_BATCH_3_AGRICULTURE_PAIR_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeScaleBoard(): Promise<void> {
  const sizes = [64, 96, 128, 256] as const;
  const pad = 16;
  const cell = 280;
  const width = pad + sizes.length * (cell + pad);
  const height = pad + BATCH_3_IDS.length * (cell + pad);

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let row = 0; row < BATCH_3_IDS.length; row += 1) {
    const technologyId = BATCH_3_IDS[row]!;
    for (let col = 0; col < sizes.length; col += 1) {
      const size = sizes[col]!;
      composites.push({
        input: await loadPrimary(size, technologyId),
        left: pad + col * (cell + pad) + Math.floor((cell - size) / 2),
        top: pad + row * (cell + pad) + Math.floor((cell - size) / 2),
      });
    }
  }

  const target = path.join(evidenceDir, 'ICON_004_PRODUCTION_BATCH_3_SCALE_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeNeighborBoard(): Promise<void> {
  const size = 200;
  const pad = 20;
  const pairs: { left: string; right: string }[] = [
    { left: 'distribution_networks', right: 'intermodal_logistics' },
    { left: 'distribution_networks', right: 'warehouse_systems' },
    { left: 'polymer_science', right: 'organic_chemistry' },
    { left: 'sustainable_agriculture', right: 'renewable_energy' },
    { left: 'sustainable_agriculture', right: 'crop_optimization' },
  ];

  const pairWidth = size * 2 + pad;
  const width = pad + pairs.length * (pairWidth + pad);
  const height = pad + size + pad + 40;

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let index = 0; index < pairs.length; index += 1) {
    const pair = pairs[index]!;
    const leftBase = pad + index * (pairWidth + pad);
    composites.push({
      input: await loadPrimary(size, pair.left),
      left: leftBase,
      top: pad,
    });
    composites.push({
      input: await loadPrimary(size, pair.right),
      left: leftBase + size + pad,
      top: pad,
    });
  }

  const target = path.join(
    evidenceDir,
    'ICON_004_PRODUCTION_BATCH_3_NEIGHBOR_DIFFERENTIATION_BOARD.png',
  );
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeTechRoleBoard(): Promise<void> {
  const size = 200;
  const pad = 24;
  const rows: { tech: string; building?: string }[] = [
    { tech: 'distribution_networks', building: 'logistics_hub' },
    { tech: 'sustainable_agriculture' },
    { tech: 'crop_optimization' },
  ];

  const pairWidth = size * 2 + pad;
  const width = pad + pairWidth + pad;
  const height = pad + rows.length * (size + pad) + 40;

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index]!;
    const top = pad + index * (size + pad);
    composites.push({
      input: await loadPrimary(size, row.tech),
      left: pad,
      top,
    });
    if (row.building !== undefined) {
      composites.push({
        input: await loadBuilding(size, row.building),
        left: pad + size + pad,
        top,
      });
    }
  }

  const target = path.join(evidenceDir, 'ICON_004_PRODUCTION_BATCH_3_TECH_ROLE_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function main(): Promise<void> {
  await compose18FamilyBoard();
  await composeNewFourBoard();
  await composeAgriculturePairBoard();
  await composeScaleBoard();
  await composeNeighborBoard();
  await composeTechRoleBoard();
}

void main();
