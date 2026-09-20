#!/usr/bin/env tsx
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');
const pilotDir = path.join(projectRoot, 'docs/design/production/pilot-icon-005/process-primary');
const resourcesPublic = path.join(projectRoot, 'apps/web/public/assets/icons');

const PILOT_RECIPES = ['recipe_planks', 'recipe_steel', 'recipe_advanced_electronics'] as const;

const LABELS: Record<string, string> = {
  recipe_planks: 'Bretter — wood→planks',
  recipe_steel: 'Stahl — ore→steel',
  recipe_advanced_electronics: 'Advanced Elektronik — assembly',
};

async function loadPilot(size: number, recipeId: string): Promise<Buffer> {
  return sharp(await readFile(path.join(pilotDir, `ICON-005-${recipeId}-primary-pilot.png`)))
    .resize(size, size, { fit: 'inside' })
    .png()
    .toBuffer();
}

async function loadBuildingPrimary(size: number, buildingType: string): Promise<Buffer> {
  for (const batch of ['batch-1', 'batch-2', 'batch-3', 'infrastructure'] as const) {
    const file = path.join(
      projectRoot,
      `docs/design/buildings/production/${batch}/primary/ICON-003-${buildingType}.png`,
    );
    try {
      return sharp(await readFile(file)).resize(size, size, { fit: 'inside' }).png().toBuffer();
    } catch {
      // continue
    }
  }

  throw new Error(`Missing building primary for ${buildingType}`);
}

async function loadResearchPrimary(size: number, techId: string): Promise<Buffer> {
  const batch2 = new Set([
    'basic_woodworking',
    'industrial_assembly',
    'smart_grid',
    'warehouse_systems',
    'process_automation',
    'organic_chemistry',
  ]);
  const batch3 = new Set([
    'distribution_networks',
    'polymer_science',
    'sustainable_agriculture',
    'crop_optimization',
  ]);
  const batch4 = new Set([
    'corporate_management',
    'financial_planning',
    'predictive_analytics',
    'executive_leadership',
  ]);
  let dir = path.join(projectRoot, 'docs/design/research/production/batch-1/primary');
  if (batch2.has(techId)) {
    dir = path.join(projectRoot, 'docs/design/research/production/batch-2/primary');
  } else if (batch3.has(techId)) {
    dir = path.join(projectRoot, 'docs/design/research/production/batch-3/primary');
  } else if (batch4.has(techId)) {
    dir = path.join(projectRoot, 'docs/design/research/production/batch-4-abstract/primary');
  }

  return sharp(await readFile(path.join(dir, `ICON-004-${techId}-primary.png`)))
    .resize(size, size, { fit: 'inside' })
    .png()
    .toBuffer();
}

async function loadResource(size: number, resourceId: string): Promise<Buffer> {
  return sharp(await readFile(path.join(resourcesPublic, `ICON-001-${resourceId}.png`)))
    .resize(size, size, { fit: 'inside' })
    .png()
    .toBuffer();
}

async function composeFamilyBoard(): Promise<void> {
  const size = 360;
  const pad = 32;
  const width = pad + 3 * (size + pad);
  const height = pad + size + 72;

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 22, g: 28, b: 34, alpha: 255 } },
  });

  const composites = [];
  for (let index = 0; index < PILOT_RECIPES.length; index += 1) {
    const id = PILOT_RECIPES[index]!;
    composites.push({
      input: await loadPilot(size, id),
      left: pad + index * (size + pad),
      top: pad,
    });
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_005_PROCESS_ART_DIRECTION_FAMILY_BOARD.png'));
}

async function composeScaleBoard(): Promise<void> {
  const sizes = [64, 96, 128, 256] as const;
  const pad = 16;
  const cell = 280;
  const width = pad + sizes.length * (cell + pad);
  const height = pad + PILOT_RECIPES.length * (cell + pad);

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 22, g: 28, b: 34, alpha: 255 } },
  });

  const composites = [];
  for (let row = 0; row < PILOT_RECIPES.length; row += 1) {
    const id = PILOT_RECIPES[row]!;
    for (let col = 0; col < sizes.length; col += 1) {
      const size = sizes[col]!;
      composites.push({
        input: await loadPilot(size, id),
        left: pad + col * (cell + pad) + Math.floor((cell - size) / 2),
        top: pad + row * (cell + pad) + Math.floor((cell - size) / 2),
      });
    }
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_005_PROCESS_ART_DIRECTION_SCALE_BOARD.png'));
}

async function composeProductionContextMock(): Promise<void> {
  const rowH = 100;
  const pad = 20;
  const iconSize = 88;
  const width = 720;
  const rows = PILOT_RECIPES.map((id) => ({ id, label: LABELS[id]! }));
  const height = pad + rows.length * (rowH + pad);

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 22, g: 27, b: 34, alpha: 255 } },
  });

  const composites = [];
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index]!;
    composites.push({
      input: await loadPilot(iconSize, row.id),
      left: pad,
      top: pad + index * (rowH + pad) + 4,
    });
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_005_PROCESS_ART_DIRECTION_PRODUCTION_CONTEXT_MOCK.png'));
}

async function composeCrossFamilyBoard(): Promise<void> {
  const size = 200;
  const pad = 24;
  const cols = 3;
  const rows = 3;
  const width = pad + cols * (size + pad);
  const height = pad + rows * (size + pad) + 48;

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 18, g: 24, b: 32, alpha: 255 } },
  });

  const row0 = [
    () => loadPilot(size, 'recipe_planks'),
    () => loadPilot(size, 'recipe_steel'),
    () => loadPilot(size, 'recipe_advanced_electronics'),
  ];
  const row1 = [
    () => loadBuildingPrimary(size, 'sawmill'),
    () => loadBuildingPrimary(size, 'smelter'),
    () => loadBuildingPrimary(size, 'electronics_factory'),
  ];
  const row2 = [
    () => loadResearchPrimary(size, 'basic_woodworking'),
    () => loadResearchPrimary(size, 'advanced_metallurgy'),
    () => loadResearchPrimary(size, 'circuit_design'),
  ];

  const composites = [];
  const matrix = [row0, row1, row2];
  for (let row = 0; row < matrix.length; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      composites.push({
        input: await matrix[row]![col]!(),
        left: pad + col * (size + pad),
        top: pad + row * (size + pad),
      });
    }
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_005_PROCESS_ART_DIRECTION_CROSS_FAMILY_BOARD.png'));
}

async function composeSemanticBoard(): Promise<void> {
  const size = 160;
  const pad = 20;
  const pairs = [
    { recipe: 'recipe_planks' as const, resource: 'wood' },
    { recipe: 'recipe_steel' as const, resource: 'iron_ore' },
    { recipe: 'recipe_advanced_electronics' as const, resource: 'advanced_electronics' },
  ];
  const width = pad + pairs.length * (size * 2 + pad);
  const height = pad + size + pad;

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 22, g: 28, b: 34, alpha: 255 } },
  });

  const composites = [];
  for (let index = 0; index < pairs.length; index += 1) {
    const pair = pairs[index]!;
    const left = pad + index * (size * 2 + pad);
    composites.push({ input: await loadPilot(size, pair.recipe), left, top: pad });
    composites.push({
      input: await loadResource(size, pair.resource),
      left: left + size + 8,
      top: pad,
    });
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_005_PROCESS_ART_DIRECTION_SEMANTIC_BOARD.png'));
}

async function composeProgressionBoard(): Promise<void> {
  const size = 256;
  const pad = 40;
  const width = pad + 3 * (size + pad);
  const height = pad + size + 64;

  const base = sharp({
    create: { width, height, channels: 4, background: { r: 18, g: 24, b: 32, alpha: 255 } },
  });

  const composites = [];
  for (let index = 0; index < PILOT_RECIPES.length; index += 1) {
    composites.push({
      input: await loadPilot(size, PILOT_RECIPES[index]!),
      left: pad + index * (size + pad),
      top: pad,
    });
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_005_PROCESS_ART_DIRECTION_PROGRESSION_BOARD.png'));
}

async function main(): Promise<void> {
  await composeFamilyBoard();
  await composeScaleBoard();
  await composeProductionContextMock();
  await composeCrossFamilyBoard();
  await composeSemanticBoard();
  await composeProgressionBoard();
  console.log('ICON-005 pilot evidence boards written');
}

void main();
