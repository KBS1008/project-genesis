#!/usr/bin/env tsx
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');

const ALL = [
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
] as const;

const BATCH_1 = new Set([
  'sawmill',
  'smelter',
  'warehouse',
  'coal_power_plant',
  'machine_shop',
  'logistics_hub',
  'research_campus',
  'corporate_headquarters',
]);

const BATCH_2 = new Set([
  'assembly_plant',
  'headquarters',
  'electronics_factory',
  'consumer_goods_plant',
  'solar_power_plant',
  'distribution_center',
  'university',
  'power_substation',
]);

function batchFor(buildingTypeId: string): string {
  if (BATCH_1.has(buildingTypeId)) {
    return 'batch-1';
  }
  if (BATCH_2.has(buildingTypeId)) {
    return 'batch-2';
  }
  if (buildingTypeId === 'access_road' || buildingTypeId === 'port' || buildingTypeId === 'rail_terminal') {
    return 'infrastructure';
  }
  return 'batch-3';
}

function primaryPath(buildingTypeId: string): string {
  const batch = batchFor(buildingTypeId);
  return path.join(
    projectRoot,
    'docs/design/buildings/production',
    batch,
    'primary',
    `ICON-003-${buildingTypeId}.png`,
  );
}

function compactPath(buildingTypeId: string): string {
  const batch = batchFor(buildingTypeId);
  return path.join(
    projectRoot,
    'docs/design/buildings/production',
    batch,
    'compact',
    `ICON-003-${buildingTypeId}-compact.svg`,
  );
}

const CELL = 200;
const PAD = 16;
const COLS = 6;

async function composePrimaryFamilyBoard(): Promise<void> {
  const rows = Math.ceil(ALL.length / COLS);
  const width = COLS * CELL + (COLS + 1) * PAD;
  const height = rows * CELL + (rows + 1) * PAD;
  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 15, g: 20, b: 25, alpha: 255 },
    },
  });

  const composites = await Promise.all(
    ALL.map(async (buildingTypeId, index) => {
      const col = index % COLS;
      const row = Math.floor(index / COLS);
      const buffer = await sharp(primaryPath(buildingTypeId)).resize(CELL, CELL, { fit: 'inside' }).png().toBuffer();

      return {
        input: buffer,
        left: PAD + col * (CELL + PAD),
        top: PAD + row * (CELL + PAD),
      };
    }),
  );

  const target = path.join(evidenceDir, 'BUILDING_ICON_003_23_OF_23_PRIMARY_FAMILY_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeCompactFamilyBoard(): Promise<void> {
  const size = 32;
  const rows = Math.ceil(ALL.length / COLS);
  const width = COLS * (size + 8) + (COLS + 1) * PAD;
  const height = rows * (size + 8) + (rows + 1) * PAD + 24;
  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 15, g: 20, b: 25, alpha: 255 },
    },
  });

  const composites = await Promise.all(
    ALL.map(async (buildingTypeId, index) => {
      const col = index % COLS;
      const row = Math.floor(index / COLS);
      const buffer = await sharp(await readFile(compactPath(buildingTypeId))).resize(size, size).png().toBuffer();

      return {
        input: buffer,
        left: PAD + col * (size + 8 + PAD),
        top: PAD + 24 + row * (size + 8 + PAD),
      };
    }),
  );

  const target = path.join(evidenceDir, 'BUILDING_ICON_003_23_OF_23_COMPACT_FAMILY_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

void Promise.all([composePrimaryFamilyBoard(), composeCompactFamilyBoard()]);
