#!/usr/bin/env tsx
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
const ICON_003_BATCH_1_BUILDING_TYPE_IDS = [
  'sawmill',
  'smelter',
  'warehouse',
  'coal_power_plant',
  'machine_shop',
  'logistics_hub',
  'research_campus',
  'corporate_headquarters',
] as const;

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const primaryDir = path.join(projectRoot, 'docs/design/buildings/production/batch-1/primary');
const compactDir = path.join(projectRoot, 'docs/design/buildings/production/batch-1/compact');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');

const CELL = 256;
const PAD = 24;
const COLS = 4;

async function composePrimaryBoard(): Promise<void> {
  const rows = Math.ceil(ICON_003_BATCH_1_BUILDING_TYPE_IDS.length / COLS);
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
    ICON_003_BATCH_1_BUILDING_TYPE_IDS.map(async (buildingTypeId, index) => {
      const col = index % COLS;
      const row = Math.floor(index / COLS);
      const input = path.join(primaryDir, `ICON-003-${buildingTypeId}.png`);
      const buffer = await sharp(input).resize(CELL, CELL, { fit: 'inside' }).png().toBuffer();

      return {
        input: buffer,
        left: PAD + col * (CELL + PAD),
        top: PAD + row * (CELL + PAD),
      };
    }),
  );

  const target = path.join(evidenceDir, 'BUILDING_BATCH_1_PRIMARY_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeCompactBoard(): Promise<void> {
  const size = 96;
  const rows = Math.ceil(ICON_003_BATCH_1_BUILDING_TYPE_IDS.length / COLS);
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
    ICON_003_BATCH_1_BUILDING_TYPE_IDS.map(async (buildingTypeId, index) => {
      const col = index % COLS;
      const row = Math.floor(index / COLS);
      const input = path.join(compactDir, `ICON-003-${buildingTypeId}-compact.svg`);
      const buffer = await sharp(await readFile(input)).resize(size, size).png().toBuffer();

      return {
        input: buffer,
        left: PAD + col * (size + PAD),
        top: PAD + row * (size + PAD),
      };
    }),
  );

  const target = path.join(evidenceDir, 'BUILDING_BATCH_1_COMPACT_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

void Promise.all([composePrimaryBoard(), composeCompactBoard()]);
