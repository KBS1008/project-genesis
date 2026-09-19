#!/usr/bin/env tsx
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pilotDir = path.join(projectRoot, 'docs/design/research/pilot-icon-004/category');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');

const PILOT_CATEGORIES = [
  'PRODUCTION',
  'ENERGY',
  'LOGISTICS',
  'ELECTRONICS',
  'MANAGEMENT',
  'AUTOMATION',
] as const;

function svgPath(category: string): string {
  return path.join(pilotDir, `ICON-004-category-${category}-pilot.svg`);
}

async function loadSvg(size: number, category: string): Promise<Buffer> {
  return sharp(await readFile(svgPath(category))).resize(size, size).png().toBuffer();
}

async function composeScaleBoard(): Promise<void> {
  const sizes = [32, 48, 64] as const;
  const pad = 24;
  const cell = 72;
  const width = pad + sizes.length * (cell + pad);
  const height = pad + PILOT_CATEGORIES.length * (cell + pad) + 20;
  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let row = 0; row < PILOT_CATEGORIES.length; row += 1) {
    const category = PILOT_CATEGORIES[row]!;
    for (let col = 0; col < sizes.length; col += 1) {
      const size = sizes[col]!;
      const buffer = await loadSvg(size, category);
      composites.push({
        input: buffer,
        left: pad + col * (cell + pad) + Math.floor((cell - size) / 2),
        top: pad + 16 + row * (cell + pad) + Math.floor((cell - size) / 2),
      });
    }
  }

  const target = path.join(evidenceDir, 'ICON_004_CATEGORY_PILOT_SCALE_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeFamilyBoard(): Promise<void> {
  const size = 64;
  const pad = 28;
  const cols = 3;
  const rows = 2;
  const width = cols * (size + pad) + pad;
  const height = rows * (size + pad) + pad;
  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = await Promise.all(
    PILOT_CATEGORIES.map(async (category, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      return {
        input: await loadSvg(size, category),
        left: pad + col * (size + pad),
        top: pad + row * (size + pad),
      };
    }),
  );

  const target = path.join(evidenceDir, 'ICON_004_CATEGORY_PILOT_FAMILY_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

type ResearchRow = {
  readonly name: string;
  readonly category: (typeof PILOT_CATEGORIES)[number];
};

const RESEARCH_CONTEXT_ROWS: readonly ResearchRow[] = [
  { name: 'Basic Woodworking', category: 'PRODUCTION' },
  { name: 'Fortgeschrittene Metallurgie', category: 'PRODUCTION' },
  { name: 'Kohlekraft-Effizienz', category: 'ENERGY' },
  { name: 'Erneuerbare Energie', category: 'ENERGY' },
  { name: 'Intermodale Logistik', category: 'LOGISTICS' },
  { name: 'Lagersysteme', category: 'LOGISTICS' },
  { name: 'Schaltungsdesign', category: 'ELECTRONICS' },
  { name: 'Halbleiterprozesse', category: 'ELECTRONICS' },
  { name: 'Unternehmensfuehrung', category: 'MANAGEMENT' },
  { name: 'Executive Leadership', category: 'MANAGEMENT' },
  { name: 'Fabrikautomatisierung', category: 'AUTOMATION' },
  { name: 'Prozessautomatisierung', category: 'AUTOMATION' },
];

const REPETITION_ROWS: readonly ResearchRow[] = [
  { name: 'Basic Woodworking', category: 'PRODUCTION' },
  { name: 'Praezisionsbearbeitung', category: 'PRODUCTION' },
  { name: 'Industriemontage', category: 'PRODUCTION' },
  { name: 'Fortgeschrittene Metallurgie', category: 'PRODUCTION' },
  { name: 'Distributionsnetze', category: 'LOGISTICS' },
  { name: 'Intermodale Logistik', category: 'LOGISTICS' },
  { name: 'Lagersysteme', category: 'LOGISTICS' },
];

async function composeLabeledResearchMock(
  rows: readonly ResearchRow[],
  targetName: string,
  iconSize: number,
): Promise<void> {
  const rowHeight = 52;
  const pad = 16;
  const width = 560;
  const height = pad * 2 + rows.length * rowHeight;
  const rowBlocks = await Promise.all(
    rows.map(async (row, index) => {
      const iconBuffer = await readFile(svgPath(row.category));
      const iconB64 = iconBuffer.toString('base64');
      const y = pad + index * rowHeight;
      return `<g transform="translate(${pad}, ${y + 4})">
  <image href="data:image/svg+xml;base64,${iconB64}" width="${iconSize}" height="${iconSize}"/>
  <text x="${iconSize + 16}" y="${iconSize / 2 + 5}" fill="#d4dce8" font-family="Segoe UI, sans-serif" font-size="15">${escapeXml(row.name)}</text>
  <rect x="0" y="0" width="${width - pad * 2}" height="${rowHeight - 6}" fill="none" stroke="#2a3544" stroke-width="0.5" opacity="0.6"/>
</g>`;
    }),
  );

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#161b22"/>
  ${rowBlocks.join('\n')}
</svg>`;

  const target = path.join(evidenceDir, targetName);
  await sharp(Buffer.from(svg)).png().toFile(target);
  console.log('Wrote', target);
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

async function main(): Promise<void> {
  await composeScaleBoard();
  await composeFamilyBoard();
  await composeLabeledResearchMock(RESEARCH_CONTEXT_ROWS, 'ICON_004_CATEGORY_PILOT_RESEARCH_CONTEXT.png', 48);
  await composeLabeledResearchMock(REPETITION_ROWS, 'ICON_004_CATEGORY_PILOT_REPETITION_TEST.png', 48);

  for (const category of PILOT_CATEGORIES) {
    const fileStats = await stat(svgPath(category));
    console.log(`${category} svg ${fileStats.size} B`);
  }
}

void main();
