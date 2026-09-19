#!/usr/bin/env tsx
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');
const batch1PrimaryDir = path.join(projectRoot, 'docs/design/research/production/batch-1/primary');
const batch2PrimaryDir = path.join(projectRoot, 'docs/design/research/production/batch-2/primary');
const categoryDir = path.join(projectRoot, 'docs/design/research/production/batch-1/category');
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

const ALL_DETAILED = [...BATCH_1_IDS, ...BATCH_2_IDS] as const;

function primaryDirFor(technologyId: string): string {
  return BATCH_2_IDS.includes(technologyId as (typeof BATCH_2_IDS)[number])
    ? batch2PrimaryDir
    : batch1PrimaryDir;
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

async function compose14FamilyBoard(): Promise<void> {
  const displaySize = 200;
  const pad = 20;
  const cols = 7;
  const rows = 2;
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

  const target = path.join(evidenceDir, 'ICON_004_PRODUCTION_BATCH_2_DETAILED_FAMILY_BOARD_14.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeNewSixBoard(): Promise<void> {
  const displaySize = 320;
  const pad = 28;
  const cols = 3;
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
  for (let index = 0; index < BATCH_2_IDS.length; index += 1) {
    const technologyId = BATCH_2_IDS[index]!;
    const col = index % cols;
    const row = Math.floor(index / cols);
    composites.push({
      input: await loadPrimary(displaySize, technologyId),
      left: pad + col * cell,
      top: pad + row * cell,
    });
  }

  const target = path.join(evidenceDir, 'ICON_004_PRODUCTION_BATCH_2_NEW_SIX_FAMILY_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeScaleBoard(): Promise<void> {
  const sizes = [64, 96, 128, 256] as const;
  const pad = 16;
  const cell = 280;
  const width = pad + sizes.length * (cell + pad);
  const height = pad + BATCH_2_IDS.length * (cell + pad);

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let row = 0; row < BATCH_2_IDS.length; row += 1) {
    const technologyId = BATCH_2_IDS[row]!;
    for (let col = 0; col < sizes.length; col += 1) {
      const size = sizes[col]!;
      composites.push({
        input: await loadPrimary(size, technologyId),
        left: pad + col * (cell + pad) + Math.floor((cell - size) / 2),
        top: pad + row * (cell + pad) + Math.floor((cell - size) / 2),
      });
    }
  }

  const target = path.join(evidenceDir, 'ICON_004_PRODUCTION_BATCH_2_SCALE_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeTechVsBuildingBoard(): Promise<void> {
  const pairs: { tech: (typeof BATCH_2_IDS)[number]; building: string }[] = [
    { tech: 'basic_woodworking', building: 'sawmill' },
    { tech: 'industrial_assembly', building: 'assembly_plant' },
    { tech: 'warehouse_systems', building: 'warehouse' },
    { tech: 'smart_grid', building: 'power_substation' },
    { tech: 'organic_chemistry', building: 'coal_power_plant' },
  ];

  const size = 220;
  const pad = 24;
  const pairWidth = size * 2 + pad;
  const width = pad + pairs.length * (pairWidth + pad);
  const height = pad + size + pad + 48;

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
      input: await loadPrimary(size, pair.tech),
      left: leftBase,
      top: pad,
    });
    composites.push({
      input: await loadBuilding(size, pair.building),
      left: leftBase + size + pad,
      top: pad,
    });
  }

  const target = path.join(evidenceDir, 'ICON_004_PRODUCTION_BATCH_2_TECH_VS_BUILDING_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function main(): Promise<void> {
  await compose14FamilyBoard();
  await composeNewSixBoard();
  await composeScaleBoard();
  await composeTechVsBuildingBoard();
}

void main();
