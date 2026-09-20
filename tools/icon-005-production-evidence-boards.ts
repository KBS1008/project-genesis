#!/usr/bin/env tsx
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');
const primaryDir = path.join(projectRoot, 'docs/design/production/icon-005/primary');
const iconsDir = path.join(projectRoot, 'apps/web/public/assets/icons');

const ALL_RECIPES = [
  'recipe_planks',
  'recipe_advanced_planks',
  'recipe_steel',
  'recipe_machine_parts',
  'recipe_industrial_machinery',
  'recipe_advanced_electronics',
  'recipe_consumer_goods',
] as const;

const NAMES: Record<string, string> = {
  recipe_planks: 'Bretter herstellen',
  recipe_advanced_planks: 'Advanced Plank Production',
  recipe_steel: 'Stahl schmelzen',
  recipe_machine_parts: 'Maschinenteile fertigen',
  recipe_industrial_machinery: 'Industriemaschinen montieren',
  recipe_advanced_electronics: 'Advanced Elektronik produzieren',
  recipe_consumer_goods: 'Konsumgüter herstellen',
};

async function loadPrimary(size: number, recipeId: string): Promise<Buffer> {
  return sharp(await readFile(path.join(primaryDir, `ICON-005-${recipeId}-primary.png`)))
    .resize(size, size, { fit: 'inside' })
    .png()
    .toBuffer();
}

async function loadResource(size: number, id: string): Promise<Buffer> {
  return sharp(await readFile(path.join(iconsDir, `ICON-001-${id}.png`)))
    .resize(size, size, { fit: 'inside' })
    .png()
    .toBuffer();
}

async function loadBuilding(size: number, type: string): Promise<Buffer> {
  for (const batch of ['batch-1', 'batch-2'] as const) {
    try {
      return sharp(
        await readFile(
          path.join(
            projectRoot,
            `docs/design/buildings/production/${batch}/primary/ICON-003-${type}.png`,
          ),
        ),
      )
        .resize(size, size, { fit: 'inside' })
        .png()
        .toBuffer();
    } catch {
      // continue
    }
  }

  throw new Error(type);
}

async function loadTech(size: number, techId: string): Promise<Buffer> {
  const batch2 = new Set(['basic_woodworking', 'industrial_assembly', 'circuit_design']);
  const dir = batch2.has(techId) ? 'batch-2' : 'batch-1';
  return sharp(
    await readFile(
      path.join(projectRoot, `docs/design/research/production/${dir}/primary/ICON-004-${techId}-primary.png`),
    ),
  )
    .resize(size, size, { fit: 'inside' })
    .png()
    .toBuffer();
}

async function compose7Family(): Promise<void> {
  const size = 200;
  const pad = 16;
  const cols = 4;
  const rows = 2;
  const width = pad + cols * (size + pad);
  const height = pad + rows * (size + pad) + 40;

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 18, g: 24, b: 32, alpha: 255 } },
  });

  const composites = [];
  for (let index = 0; index < ALL_RECIPES.length; index += 1) {
    const id = ALL_RECIPES[index]!;
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
    .toFile(path.join(evidenceDir, 'ICON_005_PRODUCTION_7_OF_7_FAMILY_BOARD.png'));
}

async function composeScale(): Promise<void> {
  const sizes = [96, 128, 256] as const;
  const pad = 12;
  const cell = 220;
  const width = pad + sizes.length * (cell + pad);
  const height = pad + ALL_RECIPES.length * (cell + pad);

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 18, g: 24, b: 32, alpha: 255 } },
  });

  const composites = [];
  for (let row = 0; row < ALL_RECIPES.length; row += 1) {
    const id = ALL_RECIPES[row]!;
    for (let col = 0; col < sizes.length; col += 1) {
      const size = sizes[col]!;
      composites.push({
        input: await loadPrimary(size, id),
        left: pad + col * (cell + pad) + Math.floor((cell - size) / 2),
        top: pad + row * (cell + pad) + Math.floor((cell - size) / 2),
      });
    }
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_005_PRODUCTION_7_OF_7_SCALE_BOARD.png'));
}

async function composeCrossFamily(): Promise<void> {
  const size = 160;
  const pad = 20;
  const width = pad + 4 * (size + pad);
  const height = pad + 3 * (size + pad);

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 18, g: 24, b: 32, alpha: 255 } },
  });

  const row0 = [
    () => loadPrimary(size, 'recipe_steel'),
    () => loadResource(size, 'steel'),
    () => loadBuilding(size, 'smelter'),
    () => loadTech(size, 'advanced_metallurgy'),
  ];

  const composites = [];
  for (let col = 0; col < row0.length; col += 1) {
    composites.push({ input: await row0[col]!(), left: pad + col * (size + pad), top: pad });
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_005_PRODUCTION_CROSS_FAMILY_DIFFERENTIATION_BOARD.png'));
}

async function composePlanksDiff(): Promise<void> {
  const size = 420;
  const pad = 48;
  const width = pad + 2 * (size + pad);
  const height = pad + size + 80;

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 22, g: 28, b: 34, alpha: 255 } },
  });

  await base
    .composite([
      { input: await loadPrimary(size, 'recipe_planks'), left: pad, top: pad },
      { input: await loadPrimary(size, 'recipe_advanced_planks'), left: pad + size + pad, top: pad },
    ])
    .png()
    .toFile(path.join(evidenceDir, 'ICON_005_PLANKS_ADVANCED_PLANKS_DIFFERENTIATION.png'));
}

async function composeProductionContext(): Promise<void> {
  const icon = 72;
  const rowH = 96;
  const pad = 20;
  const width = 640;
  const height = pad + ALL_RECIPES.length * (rowH + pad);

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 22, g: 27, b: 34, alpha: 255 } },
  });

  const composites = [];
  for (let index = 0; index < ALL_RECIPES.length; index += 1) {
    const id = ALL_RECIPES[index]!;
    composites.push({
      input: await loadPrimary(icon, id),
      left: pad,
      top: pad + index * (rowH + pad) + 8,
    });
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_005_PRODUCTION_SCREEN_CONTEXT_MOCK.png'));

  void NAMES;
}

async function main(): Promise<void> {
  await compose7Family();
  await composeScale();
  await composeCrossFamily();
  await composePlanksDiff();
  await composeProductionContext();
  console.log('ICON-005 production evidence boards written');
}

void main();
