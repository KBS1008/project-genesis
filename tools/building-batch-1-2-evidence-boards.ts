#!/usr/bin/env tsx
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const BATCH_1 = [
  'sawmill',
  'smelter',
  'warehouse',
  'coal_power_plant',
  'machine_shop',
  'logistics_hub',
  'research_campus',
  'corporate_headquarters',
] as const;

const BATCH_2 = [
  'assembly_plant',
  'headquarters',
  'electronics_factory',
  'consumer_goods_plant',
  'solar_power_plant',
  'distribution_center',
  'university',
  'power_substation',
] as const;

const ALL = [...BATCH_1, ...BATCH_2];

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');

const CELL = 256;
const PAD = 24;
const COLS = 4;

function primaryPath(buildingTypeId: string): string {
  const batch = (BATCH_1 as readonly string[]).includes(buildingTypeId) ? 'batch-1' : 'batch-2';
  return path.join(projectRoot, 'docs/design/buildings/production', batch, 'primary', `ICON-003-${buildingTypeId}.png`);
}

function compactPath(buildingTypeId: string): string {
  const batch = (BATCH_1 as readonly string[]).includes(buildingTypeId) ? 'batch-1' : 'batch-2';
  return path.join(
    projectRoot,
    'docs/design/buildings/production',
    batch,
    'compact',
    `ICON-003-${buildingTypeId}-compact.svg`,
  );
}

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

  const target = path.join(evidenceDir, 'BUILDING_BATCH_1_2_PRIMARY_FAMILY_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeCompactFamilyBoard(): Promise<void> {
  const size = 96;
  const rows = Math.ceil(ALL.length / COLS);
  const width = COLS * size + (COLS + 1) * PAD;
  const height = rows * size + (rows + 1) * PAD;
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
        left: PAD + col * (size + PAD),
        top: PAD + row * (size + PAD),
      };
    }),
  );

  const target = path.join(evidenceDir, 'BUILDING_BATCH_1_2_COMPACT_FAMILY_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

void Promise.all([composePrimaryFamilyBoard(), composeCompactFamilyBoard()]);
