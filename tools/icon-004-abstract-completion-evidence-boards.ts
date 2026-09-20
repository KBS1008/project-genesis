#!/usr/bin/env tsx
import { copyFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');
const batch4Dir = path.join(projectRoot, 'docs/design/research/production/batch-4-abstract/primary');
const batch1Dir = path.join(projectRoot, 'docs/design/research/production/batch-1/primary');
const batch2Dir = path.join(projectRoot, 'docs/design/research/production/batch-2/primary');
const batch3Dir = path.join(projectRoot, 'docs/design/research/production/batch-3/primary');
const categoryDir = path.join(projectRoot, 'docs/design/research/production/batch-1/category');

const ALL_22_DETAILED = [
  'precision_machining',
  'renewable_energy',
  'semiconductor_process',
  'advanced_metallurgy',
  'coal_efficiency',
  'intermodal_logistics',
  'circuit_design',
  'factory_automation',
  'basic_woodworking',
  'industrial_assembly',
  'smart_grid',
  'warehouse_systems',
  'process_automation',
  'organic_chemistry',
  'distribution_networks',
  'polymer_science',
  'sustainable_agriculture',
  'crop_optimization',
  'corporate_management',
  'financial_planning',
  'predictive_analytics',
  'executive_leadership',
] as const;

const ABSTRACT_FOUR = [
  'corporate_management',
  'financial_planning',
  'predictive_analytics',
  'executive_leadership',
] as const;

const CATEGORY_BY_ID: Record<string, string> = {
  corporate_management: 'MANAGEMENT',
  executive_leadership: 'MANAGEMENT',
  financial_planning: 'FINANCE',
  predictive_analytics: 'AI',
};

function primaryDir(technologyId: string): string {
  if (ABSTRACT_FOUR.includes(technologyId as (typeof ABSTRACT_FOUR)[number])) {
    return batch4Dir;
  }
  const batch2 = [
    'basic_woodworking',
    'industrial_assembly',
    'smart_grid',
    'warehouse_systems',
    'process_automation',
    'organic_chemistry',
  ];
  const batch3 = ['distribution_networks', 'polymer_science', 'sustainable_agriculture', 'crop_optimization'];
  if (batch3.includes(technologyId)) {
    return batch3Dir;
  }
  if (batch2.includes(technologyId)) {
    return batch2Dir;
  }
  return batch1Dir;
}

async function loadPrimary(size: number, technologyId: string): Promise<Buffer> {
  const file = path.join(primaryDir(technologyId), `ICON-004-${technologyId}-primary.png`);
  return sharp(await readFile(file)).resize(size, size, { fit: 'inside' }).png().toBuffer();
}

async function loadCategory(size: number, category: string): Promise<Buffer> {
  return sharp(await readFile(path.join(categoryDir, `ICON-004-category-${category}.svg`)))
    .resize(size, size)
    .png()
    .toBuffer();
}

async function copyExecutivePrimaryEvidence(): Promise<void> {
  const src = path.join(batch4Dir, 'ICON-004-executive_leadership-primary.png');
  await copyFile(src, path.join(evidenceDir, 'ICON_004_EXECUTIVE_LEADERSHIP_PRIMARY.png'));
}

async function composeExecutiveScaleBoard(): Promise<void> {
  const sizes = [64, 96, 128, 256] as const;
  const pad = 20;
  const cell = 280;
  const width = pad + sizes.length * (cell + pad);
  const height = pad + cell + pad;

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 22, g: 28, b: 34, alpha: 255 } },
  });

  const composites = [];
  for (let col = 0; col < sizes.length; col += 1) {
    const size = sizes[col]!;
    composites.push({
      input: await loadPrimary(size, 'executive_leadership'),
      left: pad + col * (cell + pad) + Math.floor((cell - size) / 2),
      top: pad + Math.floor((cell - size) / 2),
    });
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_004_EXECUTIVE_LEADERSHIP_SCALE_BOARD.png'));
}

async function composeExecutiveVsCorporateBoard(): Promise<void> {
  const size = 420;
  const pad = 48;
  const width = pad + 2 * (size + pad);
  const height = pad + size + 96;

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 22, g: 28, b: 34, alpha: 255 } },
  });

  await base
    .composite([
      { input: await loadPrimary(size, 'corporate_management'), left: pad, top: pad },
      { input: await loadPrimary(size, 'executive_leadership'), left: pad + size + pad, top: pad },
    ])
    .png()
    .toFile(path.join(evidenceDir, 'ICON_004_EXECUTIVE_VS_CORPORATE_BOARD.png'));
}

async function composeAbstractFourFamilyBoard(): Promise<void> {
  const size = 360;
  const pad = 32;
  const width = pad + 4 * (size + pad);
  const height = pad + size + 80;

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 22, g: 28, b: 34, alpha: 255 } },
  });

  const composites = [];
  for (let index = 0; index < ABSTRACT_FOUR.length; index += 1) {
    const id = ABSTRACT_FOUR[index]!;
    composites.push({
      input: await loadPrimary(size, id),
      left: pad + index * (size + pad),
      top: pad,
    });
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_004_ABSTRACT_FOUR_FAMILY_BOARD.png'));
}

async function composeAbstractFourTwoTierBoard(): Promise<void> {
  const primarySize = 200;
  const compactSize = 64;
  const pad = 24;
  const cellW = primarySize + compactSize + pad * 2;
  const width = pad + ABSTRACT_FOUR.length * (cellW + pad);
  const height = pad + primarySize + pad + 48;

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 22, g: 28, b: 34, alpha: 255 } },
  });

  const composites = [];
  for (let index = 0; index < ABSTRACT_FOUR.length; index += 1) {
    const id = ABSTRACT_FOUR[index]!;
    const left = pad + index * (cellW + pad);
    composites.push({ input: await loadPrimary(primarySize, id), left, top: pad });
    composites.push({
      input: await loadCategory(compactSize, CATEGORY_BY_ID[id]!),
      left: left + primarySize + pad,
      top: pad + primarySize - compactSize,
    });
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_004_ABSTRACT_FOUR_TWO_TIER_BOARD.png'));
}

async function compose22FamilyBoard(): Promise<void> {
  const size = 128;
  const pad = 12;
  const cols = 6;
  const rows = Math.ceil(ALL_22_DETAILED.length / cols);
  const width = pad + cols * (size + pad);
  const height = pad + rows * (size + pad) + 40;

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 18, g: 24, b: 32, alpha: 255 } },
  });

  const composites = [];
  for (let index = 0; index < ALL_22_DETAILED.length; index += 1) {
    const id = ALL_22_DETAILED[index]!;
    const col = index % cols;
    const row = Math.floor(index / cols);
    composites.push({
      input: await loadPrimary(size, id),
      left: pad + col * (size + pad),
      top: pad + row * (size + pad),
    });
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_004_PRODUCTION_COMPLETE_22_FAMILY_BOARD.png'));
}

async function compose22TwoTierBoard(): Promise<void> {
  const sample = ALL_22_DETAILED.slice(0, 6);
  const primarySize = 160;
  const compactSize = 48;
  const pad = 20;
  const cellW = primarySize + compactSize + pad;
  const width = pad + sample.length * (cellW + pad);
  const height = pad + primarySize + 60;

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 18, g: 24, b: 32, alpha: 255 } },
  });

  const composites = [];
  for (let index = 0; index < sample.length; index += 1) {
    const id = sample[index]!;
    const left = pad + index * (cellW + pad);
    const category = CATEGORY_BY_ID[id] ?? 'PRODUCTION';
    composites.push({ input: await loadPrimary(primarySize, id), left, top: pad });
    composites.push({
      input: await loadCategory(compactSize, category),
      left: left + primarySize + 8,
      top: pad + primarySize - compactSize,
    });
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_004_PRODUCTION_COMPLETE_22_TWO_TIER_BOARD.png'));
}

async function composeAbstractRuntimeAssembly(): Promise<void> {
  const iconSize = 96;
  const rowH = 120;
  const pad = 24;
  const width = 640;
  const height = pad + ABSTRACT_FOUR.length * (rowH + pad);

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 22, g: 27, b: 34, alpha: 255 } },
  });

  const composites = [];
  for (let index = 0; index < ABSTRACT_FOUR.length; index += 1) {
    const id = ABSTRACT_FOUR[index]!;
    composites.push({
      input: await loadPrimary(iconSize, id),
      left: pad,
      top: pad + index * (rowH + pad) + 8,
    });
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_004_PRODUCTION_COMPLETE_ABSTRACT_RUNTIME.png'));
}

async function main(): Promise<void> {
  await copyExecutivePrimaryEvidence();
  await composeExecutiveScaleBoard();
  await composeExecutiveVsCorporateBoard();
  await composeAbstractFourFamilyBoard();
  await composeAbstractFourTwoTierBoard();
  await compose22FamilyBoard();
  await compose22TwoTierBoard();
  await composeAbstractRuntimeAssembly();
  console.log('ICON-004 abstract completion evidence boards written');
}

void main();
