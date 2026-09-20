#!/usr/bin/env tsx
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');
const abstractDir = path.join(projectRoot, 'docs/design/research/pilot-icon-004/abstract-primary');
const batch1Dir = path.join(projectRoot, 'docs/design/research/production/batch-1/primary');
const batch2Dir = path.join(projectRoot, 'docs/design/research/production/batch-2/primary');
const batch3Dir = path.join(projectRoot, 'docs/design/research/production/batch-3/primary');
const categoryDir = path.join(projectRoot, 'docs/design/research/production/batch-1/category');

const PILOT_IDS = [
  'corporate_management',
  'financial_planning',
  'predictive_analytics',
] as const;

const GRAMMAR: Record<string, string> = {
  corporate_management: 'Organizational Control System',
  financial_planning: 'Operational Planning Apparatus',
  predictive_analytics: 'Information Analysis Apparatus',
};

const CONCRETE_SAMPLES = [
  'precision_machining',
  'renewable_energy',
  'organic_chemistry',
  'intermodal_logistics',
  'factory_automation',
  'crop_optimization',
] as const;

const CATEGORY_BY_PILOT: Record<string, string> = {
  corporate_management: 'MANAGEMENT',
  financial_planning: 'FINANCE',
  predictive_analytics: 'AI',
};

async function loadAbstractPilot(size: number, technologyId: string): Promise<Buffer> {
  return sharp(
    await readFile(path.join(abstractDir, `ICON-004-tech-${technologyId}-primary-abstract-pilot.png`)),
  )
    .resize(size, size, { fit: 'inside' })
    .png()
    .toBuffer();
}

async function loadProductionPrimary(size: number, technologyId: string): Promise<Buffer> {
  let dir = batch1Dir;
  if (
    [
      'basic_woodworking',
      'industrial_assembly',
      'smart_grid',
      'warehouse_systems',
      'process_automation',
      'organic_chemistry',
    ].includes(technologyId)
  ) {
    dir = batch2Dir;
  }
  if (
    ['distribution_networks', 'polymer_science', 'sustainable_agriculture', 'crop_optimization'].includes(
      technologyId,
    )
  ) {
    dir = batch3Dir;
  }

  return sharp(await readFile(path.join(dir, `ICON-004-${technologyId}-primary.png`)))
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

async function composeThreeFamilyBoard(): Promise<void> {
  const size = 360;
  const pad = 32;
  const width = pad + 3 * (size + pad);
  const height = pad + size + 80;

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let index = 0; index < PILOT_IDS.length; index += 1) {
    const id = PILOT_IDS[index]!;
    composites.push({
      input: await loadAbstractPilot(size, id),
      left: pad + index * (size + pad),
      top: pad,
    });
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_004_ABSTRACT_PILOT_THREE_FAMILY_BOARD.png'));
  console.log('Wrote THREE_FAMILY');
}

async function composeTwoTierBoard(): Promise<void> {
  const primarySize = 200;
  const compactSize = 64;
  const pad = 24;
  const cellW = primarySize + compactSize + pad * 2;
  const width = pad + PILOT_IDS.length * (cellW + pad);
  const height = pad + primarySize + pad + 48;

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let index = 0; index < PILOT_IDS.length; index += 1) {
    const id = PILOT_IDS[index]!;
    const left = pad + index * (cellW + pad);
    composites.push({
      input: await loadAbstractPilot(primarySize, id),
      left,
      top: pad,
    });
    composites.push({
      input: await loadCategory(compactSize, CATEGORY_BY_PILOT[id]!),
      left: left + primarySize + pad,
      top: pad + primarySize - compactSize,
    });
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_004_ABSTRACT_PILOT_TWO_TIER_BOARD.png'));
  console.log('Wrote TWO_TIER');
}

async function composeScaleBoard(): Promise<void> {
  const sizes = [64, 96, 128, 256] as const;
  const pad = 16;
  const cell = 280;
  const width = pad + sizes.length * (cell + pad);
  const height = pad + PILOT_IDS.length * (cell + pad);

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let row = 0; row < PILOT_IDS.length; row += 1) {
    const id = PILOT_IDS[row]!;
    for (let col = 0; col < sizes.length; col += 1) {
      const size = sizes[col]!;
      composites.push({
        input: await loadAbstractPilot(size, id),
        left: pad + col * (cell + pad) + Math.floor((cell - size) / 2),
        top: pad + row * (cell + pad) + Math.floor((cell - size) / 2),
      });
    }
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_004_ABSTRACT_PILOT_SCALE_BOARD.png'));
  console.log('Wrote SCALE');
}

async function composeCrossFamilyBoard(): Promise<void> {
  const size = 160;
  const pad = 16;
  const cols = 3;
  const concreteRows = 2;
  const abstractRow = 1;
  const width = pad + cols * (size + pad);
  const height = pad + (concreteRows + abstractRow) * (size + pad) + 40;

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let index = 0; index < CONCRETE_SAMPLES.length; index += 1) {
    const id = CONCRETE_SAMPLES[index]!;
    const col = index % cols;
    const row = Math.floor(index / cols);
    composites.push({
      input: await loadProductionPrimary(size, id),
      left: pad + col * (size + pad),
      top: pad + row * (size + pad),
    });
  }

  const abstractTop = pad + concreteRows * (size + pad);
  for (let index = 0; index < PILOT_IDS.length; index += 1) {
    composites.push({
      input: await loadAbstractPilot(size, PILOT_IDS[index]!),
      left: pad + index * (size + pad),
      top: abstractTop,
    });
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_004_ABSTRACT_PILOT_CROSS_FAMILY_BOARD.png'));
  console.log('Wrote CROSS_FAMILY');
}

async function composeAntiClicheBoard(): Promise<void> {
  const size = 280;
  const pad = 24;
  const width = pad + PILOT_IDS.length * (size + pad);
  const height = pad + size + pad;

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let index = 0; index < PILOT_IDS.length; index += 1) {
    composites.push({
      input: await loadAbstractPilot(size, PILOT_IDS[index]!),
      left: pad + index * (size + pad),
      top: pad,
    });
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_004_ABSTRACT_PILOT_ANTI_CLICHE_BOARD.png'));
  console.log('Wrote ANTI_CLICHE');
}

async function composeResearchContextMock(): Promise<void> {
  const rowH = 100;
  const pad = 20;
  const iconSize = 80;
  const compactSize = 40;
  const width = 720;
  const rows = [
    { type: 'concrete' as const, id: 'precision_machining' },
    { type: 'concrete' as const, id: 'organic_chemistry' },
    { type: 'pilot' as const, id: 'corporate_management' },
    { type: 'pilot' as const, id: 'financial_planning' },
    { type: 'pilot' as const, id: 'predictive_analytics' },
    { type: 'holdout' as const, id: 'executive_leadership', category: 'MANAGEMENT' },
  ];
  const height = pad + rows.length * (rowH + pad);

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 27, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index]!;
    const top = pad + index * (rowH + pad);
    const artPad = sharp({
      create: {
        width: iconSize + 8,
        height: iconSize + 8,
        channels: 4,
        background: { r: 22, g: 27, b: 34, alpha: 255 },
      },
    }).png();

    if (row.type === 'concrete') {
      composites.push({
        input: await loadProductionPrimary(iconSize, row.id),
        left: pad + 4,
        top: top + 4,
      });
    } else if (row.type === 'pilot') {
      composites.push({
        input: await loadAbstractPilot(iconSize, row.id),
        left: pad + 4,
        top: top + 4,
      });
    } else {
      composites.push({
        input: await loadCategory(compactSize, row.category!),
        left: pad + 20,
        top: top + 20,
      });
    }

    void artPad;
  }

  await base
    .composite(composites)
    .png()
    .toFile(path.join(evidenceDir, 'ICON_004_ABSTRACT_PILOT_RESEARCH_CONTEXT_MOCK.png'));
  console.log('Wrote RESEARCH_CONTEXT');
}

async function composeProgressionMock(): Promise<void> {
  const rewardSize = 256;
  const pad = 48;
  const width = pad + rewardSize + pad;
  const height = pad + rewardSize + pad + 80;

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 18, g: 24, b: 32, alpha: 255 },
    },
  });

  await base
    .composite([
      {
        input: await loadAbstractPilot(rewardSize, 'predictive_analytics'),
        left: pad,
        top: pad,
      },
    ])
    .png()
    .toFile(path.join(evidenceDir, 'ICON_004_ABSTRACT_PILOT_PROGRESSION_MOCK.png'));
  console.log('Wrote PROGRESSION');
}

async function main(): Promise<void> {
  void GRAMMAR;
  await composeThreeFamilyBoard();
  await composeTwoTierBoard();
  await composeScaleBoard();
  await composeCrossFamilyBoard();
  await composeAntiClicheBoard();
  await composeResearchContextMock();
  await composeProgressionMock();
}

void main();
