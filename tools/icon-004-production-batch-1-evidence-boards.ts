#!/usr/bin/env tsx
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');
const primaryDir = path.join(projectRoot, 'docs/design/research/production/batch-1/primary');
const categoryDir = path.join(projectRoot, 'docs/design/research/production/batch-1/category');

const ICON_004_BATCH_1_DETAILED_TECHNOLOGY_IDS = [
  'precision_machining',
  'renewable_energy',
  'semiconductor_process',
  'advanced_metallurgy',
  'coal_efficiency',
  'intermodal_logistics',
  'circuit_design',
  'factory_automation',
] as const;

const ICON_004_USED_TECHNOLOGY_CATEGORIES = [
  'PRODUCTION',
  'ENERGY',
  'LOGISTICS',
  'ELECTRONICS',
  'MANAGEMENT',
  'AUTOMATION',
  'FINANCE',
  'AGRICULTURE',
  'CHEMISTRY',
  'AI',
] as const;

const ICON_004_TECHNOLOGY_CATEGORY_BY_ID: Record<string, string> = {
  basic_woodworking: 'PRODUCTION',
  corporate_management: 'MANAGEMENT',
};

async function loadPrimary(size: number, technologyId: string): Promise<Buffer> {
  return sharp(
    await readFile(path.join(primaryDir, `ICON-004-${technologyId}-primary.png`)),
  )
    .resize(size, size, { fit: 'inside' })
    .png()
    .toBuffer();
}

async function loadCategory(size: number, category: string): Promise<Buffer> {
  return sharp(await readFile(path.join(categoryDir, `ICON-004-category-${category}.svg`)))
    .resize(size, size)
    .png()
    .toBuffer();
}

async function composeDetailedFamilyBoard(): Promise<void> {
  const displaySize = 240;
  const pad = 24;
  const cols = 4;
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
  for (let index = 0; index < ICON_004_BATCH_1_DETAILED_TECHNOLOGY_IDS.length; index += 1) {
    const technologyId = ICON_004_BATCH_1_DETAILED_TECHNOLOGY_IDS[index]!;
    const col = index % cols;
    const row = Math.floor(index / cols);
    composites.push({
      input: await loadPrimary(displaySize, technologyId),
      left: pad + col * cell,
      top: pad + row * cell,
    });
  }

  const target = path.join(evidenceDir, 'ICON_004_PRODUCTION_BATCH_1_DETAILED_FAMILY_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeCategoryFamilyBoard(): Promise<void> {
  const sizes = [32, 48] as const;
  const pad = 20;
  const cell = 64;
  const width = pad + ICON_004_USED_TECHNOLOGY_CATEGORIES.length * (cell + pad);
  const height = pad + sizes.length * (cell + pad) + 24;

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let col = 0; col < ICON_004_USED_TECHNOLOGY_CATEGORIES.length; col += 1) {
    const category = ICON_004_USED_TECHNOLOGY_CATEGORIES[col]!;
    for (let row = 0; row < sizes.length; row += 1) {
      const size = sizes[row]!;
      composites.push({
        input: await loadCategory(size, category),
        left: pad + col * (cell + pad) + Math.floor((cell - size) / 2),
        top: pad + 16 + row * (cell + pad) + Math.floor((cell - size) / 2),
      });
    }
  }

  const target = path.join(evidenceDir, 'ICON_004_PRODUCTION_CATEGORY_COMPACT_FAMILY_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeMixedCoverageBoard(): Promise<void> {
  const pad = 24;
  const detailedSize = 96;
  const compactSize = 48;
  const width = 720;
  const height = 320;

  const rows = [
    { label: 'Detailed primary (Batch 1)', tech: 'precision_machining', mode: 'detailed' as const },
    { label: 'Category-only fallback', tech: 'basic_woodworking', mode: 'compact' as const },
    { label: 'Abstract deferred (compact)', tech: 'corporate_management', mode: 'compact' as const },
  ];

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
    const top = pad + index * 96;
    if (row.mode === 'detailed') {
      composites.push({
        input: await loadPrimary(detailedSize, row.tech),
        left: pad,
        top,
      });
    } else {
      const category = ICON_004_TECHNOLOGY_CATEGORY_BY_ID[row.tech]!;
      composites.push({
        input: await loadCategory(compactSize, category),
        left: pad + 24,
        top: top + 24,
      });
    }
  }

  const target = path.join(evidenceDir, 'ICON_004_PRODUCTION_BATCH_1_MIXED_COVERAGE_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeScaleBoard(): Promise<void> {
  const sizes = [64, 96, 128, 256] as const;
  const pad = 16;
  const cell = 280;
  const width = pad + sizes.length * (cell + pad);
  const height = pad + ICON_004_BATCH_1_DETAILED_TECHNOLOGY_IDS.length * (cell + pad);

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let row = 0; row < ICON_004_BATCH_1_DETAILED_TECHNOLOGY_IDS.length; row += 1) {
    const technologyId = ICON_004_BATCH_1_DETAILED_TECHNOLOGY_IDS[row]!;
    for (let col = 0; col < sizes.length; col += 1) {
      const size = sizes[col]!;
      composites.push({
        input: await loadPrimary(size, technologyId),
        left: pad + col * (cell + pad) + Math.floor((cell - size) / 2),
        top: pad + row * (cell + pad) + Math.floor((cell - size) / 2),
      });
    }
  }

  const target = path.join(evidenceDir, 'ICON_004_PRODUCTION_BATCH_1_SCALE_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function main(): Promise<void> {
  await composeDetailedFamilyBoard();
  await composeCategoryFamilyBoard();
  await composeMixedCoverageBoard();
  await composeScaleBoard();
}

void main();
