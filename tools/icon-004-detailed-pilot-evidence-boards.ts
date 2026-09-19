#!/usr/bin/env tsx
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');
const categoryDir = path.join(projectRoot, 'docs/design/research/pilot-icon-004/category');
const primaryDir = path.join(projectRoot, 'docs/design/research/pilot-icon-004/detailed-primary');
const iconsDir = path.join(projectRoot, 'docs/design/icons');
const buildingPrimary = path.join(projectRoot, 'docs/design/buildings/production/batch-1/primary');
const buildingCompact = path.join(projectRoot, 'docs/design/buildings/production/batch-1/compact');

type PilotTech = {
  readonly id: string;
  readonly name: string;
  readonly category: string;
};

const PILOT_TECHS: readonly PilotTech[] = [
  { id: 'precision_machining', name: 'Praezisionsbearbeitung', category: 'PRODUCTION' },
  { id: 'renewable_energy', name: 'Erneuerbare Energie', category: 'ENERGY' },
  { id: 'semiconductor_process', name: 'Halbleiterprozesse', category: 'ELECTRONICS' },
];

function primaryPath(id: string): string {
  return path.join(primaryDir, `ICON-004-tech-${id}-primary-pilot.png`);
}

function categorySvgPath(category: string): string {
  return path.join(categoryDir, `ICON-004-category-${category}-pilot.svg`);
}

async function loadPrimary(size: number, id: string): Promise<Buffer> {
  return sharp(await readFile(primaryPath(id))).resize(size, size, { fit: 'inside' }).png().toBuffer();
}

async function loadCategory(size: number, category: string): Promise<Buffer> {
  return sharp(await readFile(categorySvgPath(category))).resize(size, size).png().toBuffer();
}

async function renderTextLabel(
  lines: readonly string[],
  width: number,
  fontSize: number,
): Promise<Buffer> {
  const lineHeight = fontSize + 6;
  const height = lines.length * lineHeight + 8;
  const textBlocks = lines
    .map(
      (line, index) =>
        `<text x="0" y="${fontSize + index * lineHeight}" fill="#c8d4e4" font-family="Segoe UI, sans-serif" font-size="${fontSize}">${escapeXml(line)}</text>`,
    )
    .join('\n');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  ${textBlocks}
</svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

async function composeFamilyBoard(): Promise<void> {
  const displaySize = 320;
  const pad = 32;
  const labelW = 280;
  const cols = 3;
  const cellW = displaySize + labelW + pad;
  const cellH = displaySize + 80;
  const width = pad + cols * cellW;
  const height = pad + cellH + pad;

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let index = 0; index < PILOT_TECHS.length; index += 1) {
    const tech = PILOT_TECHS[index]!;
    const left = pad + index * cellW;
    const top = pad;
    composites.push({
      input: await loadPrimary(displaySize, tech.id),
      left: left + Math.floor((displaySize - displaySize) / 2),
      top,
    });
    composites.push({
      input: await renderTextLabel([tech.name, tech.category], labelW, 16),
      left: left + displaySize + 16,
      top: top + displaySize / 2 - 24,
    });
  }

  const target = path.join(evidenceDir, 'ICON_004_DETAILED_TECHNOLOGY_PRIMARY_PILOT_FAMILY_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeTwoTierBoard(): Promise<void> {
  const primarySize = 192;
  const glyphSize = 48;
  const pad = 28;
  const rowH = primarySize + pad + 40;
  const width = pad * 2 + primarySize + 24 + glyphSize + 200;
  const height = pad + PILOT_TECHS.length * rowH + pad;

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let row = 0; row < PILOT_TECHS.length; row += 1) {
    const tech = PILOT_TECHS[row]!;
    const top = pad + row * rowH;
    composites.push({
      input: await loadPrimary(primarySize, tech.id),
      left: pad,
      top,
    });
    composites.push({
      input: await loadCategory(glyphSize, tech.category),
      left: pad + primarySize + 24,
      top: top + primarySize - glyphSize - 8,
    });
    composites.push({
      input: await renderTextLabel([`${tech.name} — primary`, `Category: ${tech.category}`], 200, 14),
      left: pad + primarySize + 24 + glyphSize + 16,
      top: top + primarySize / 2 - 20,
    });
  }

  const target = path.join(evidenceDir, 'ICON_004_DETAILED_TECHNOLOGY_TWO_TIER_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function composeScaleBoard(): Promise<void> {
  const sizes = [64, 96, 128, 256] as const;
  const pad = 20;
  const cell = 280;
  const width = pad + sizes.length * (cell + pad);
  const height = pad + PILOT_TECHS.length * (cell + pad) + 24;

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let row = 0; row < PILOT_TECHS.length; row += 1) {
    const tech = PILOT_TECHS[row]!;
    for (let col = 0; col < sizes.length; col += 1) {
      const size = sizes[col]!;
      const buffer = await loadPrimary(size, tech.id);
      composites.push({
        input: buffer,
        left: pad + col * (cell + pad) + Math.floor((cell - size) / 2),
        top: pad + 12 + row * (cell + pad) + Math.floor((cell - size) / 2),
      });
    }
    composites.push({
      input: await renderTextLabel([tech.name], cell, 13),
      left: pad,
      top: pad + row * (cell + pad) - 2,
    });
  }

  const target = path.join(evidenceDir, 'ICON_004_DETAILED_TECHNOLOGY_SCALE_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

type ResearchRow = {
  readonly name: string;
  readonly category: string;
  readonly techId?: string;
};

const RESEARCH_ROWS: readonly ResearchRow[] = [
  { name: 'Basic Woodworking', category: 'PRODUCTION' },
  { name: 'Praezisionsbearbeitung', category: 'PRODUCTION', techId: 'precision_machining' },
  { name: 'Kohlekraft-Effizienz', category: 'ENERGY' },
  { name: 'Erneuerbare Energie', category: 'ENERGY', techId: 'renewable_energy' },
  { name: 'Schaltungsdesign', category: 'ELECTRONICS' },
  { name: 'Halbleiterprozesse', category: 'ELECTRONICS', techId: 'semiconductor_process' },
  { name: 'Fabrikautomatisierung', category: 'AUTOMATION' },
];

async function composeResearchContext(): Promise<void> {
  const rowHeight = 72;
  const pad = 16;
  const artSize = 56;
  const glyphSize = 40;
  const width = 640;
  const height = pad * 2 + RESEARCH_ROWS.length * rowHeight;

  const rowBlocks = await Promise.all(
    RESEARCH_ROWS.map(async (row, index) => {
      const y = pad + index * rowHeight;
      let artMarkup = '';
      if (row.techId) {
        const png = await loadPrimary(artSize, row.techId);
        const b64 = png.toString('base64');
        artMarkup = `<image href="data:image/png;base64,${b64}" x="${pad}" y="${y + 6}" width="${artSize}" height="${artSize}"/>`;
      } else {
        const svg = await readFile(categorySvgPath(row.category));
        const b64 = svg.toString('base64');
        artMarkup = `<image href="data:image/svg+xml;base64,${b64}" x="${pad + 8}" y="${y + 14}" width="${glyphSize}" height="${glyphSize}"/>`;
      }
      return `<g>
  ${artMarkup}
  <text x="${pad + artSize + 16}" y="${y + 38}" fill="#d4dce8" font-family="Segoe UI, sans-serif" font-size="15">${escapeXml(row.name)}</text>
  <text x="${width - pad - 120}" y="${y + 38}" fill="#7a8899" font-family="Segoe UI, sans-serif" font-size="12">${escapeXml(row.category)}</text>
  <rect x="${pad - 4}" y="${y + 2}" width="${width - pad * 2 + 8}" height="${rowHeight - 8}" fill="none" stroke="#2a3544" stroke-width="0.5"/>
</g>`;
    }),
  );

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#161b22"/>
  <text x="${pad}" y="${pad - 2}" fill="#9db4d0" font-family="Segoe UI, sans-serif" font-size="13">Research list mock — detailed primary on pilot technologies only</text>
  ${rowBlocks.join('\n')}
</svg>`;

  const target = path.join(evidenceDir, 'ICON_004_DETAILED_TECHNOLOGY_RESEARCH_CONTEXT.png');
  await sharp(Buffer.from(svg)).png().toFile(target);
  console.log('Wrote', target);
}

async function composeProgressionContext(): Promise<void> {
  const tech = PILOT_TECHS[2]!;
  const heroSize = 280;
  const pad = 32;
  const width = 520;
  const height = 420;

  const hero = await loadPrimary(heroSize, tech.id);
  const heroB64 = hero.toString('base64');
  const glyphSvg = await readFile(categorySvgPath(tech.category));
  const glyphB64 = glyphSvg.toString('base64');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#121820"/>
  <rect x="${pad}" y="${pad}" width="${width - pad * 2}" height="${height - pad * 2}" rx="8" fill="#1a2230" stroke="#3d4f66" stroke-width="1"/>
  <text x="${pad + 20}" y="${pad + 36}" fill="#b8c9de" font-family="Segoe UI, sans-serif" font-size="14">Technology completed — static mock (content semantics only)</text>
  <image href="data:image/png;base64,${heroB64}" x="${Math.floor((width - heroSize) / 2)}" y="${pad + 52}" width="${heroSize}" height="${heroSize}"/>
  <image href="data:image/svg+xml;base64,${glyphB64}" x="${pad + 20}" y="${height - pad - 64}" width="48" height="48"/>
  <text x="${pad + 80}" y="${height - pad - 32}" fill="#e8eef6" font-family="Segoe UI, sans-serif" font-size="20">${escapeXml(tech.name)}</text>
  <text x="${width - pad - 20}" y="${height - pad - 32}" fill="#6bcf8a" font-family="Segoe UI, sans-serif" font-size="14" text-anchor="end">COMPLETED</text>
</svg>`;

  const target = path.join(evidenceDir, 'ICON_004_DETAILED_TECHNOLOGY_PROGRESSION_CONTEXT.png');
  await sharp(Buffer.from(svg)).png().toFile(target);
  console.log('Wrote', target);
}

async function composeCrossFamilyBoard(): Promise<void> {
  const size = 96;
  const pad = 24;
  const labels = [
    { label: 'ICON-001 Steel', path: path.join(iconsDir, 'ICON-001_Steel.png') },
    { label: 'ICON-002 Production', path: path.join(iconsDir, 'ICON-002_Production.svg') },
    { label: 'ICON-003 machine_shop', path: path.join(buildingPrimary, 'ICON-003-machine_shop.png') },
    { label: 'ICON-003 compact', path: path.join(buildingCompact, 'ICON-003-machine_shop-compact.svg') },
    { label: 'ICON-004 category PRODUCTION', path: categorySvgPath('PRODUCTION') },
    { label: 'ICON-004 detailed primary', path: primaryPath('precision_machining') },
  ];

  const cols = 3;
  const rows = 2;
  const cellW = 220;
  const cellH = size + 48;
  const width = pad + cols * (cellW + pad);
  const height = pad + rows * (cellH + pad);

  const base = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 22, g: 28, b: 34, alpha: 255 },
    },
  });

  const composites = [];
  for (let index = 0; index < labels.length; index += 1) {
    const item = labels[index]!;
    const col = index % cols;
    const row = Math.floor(index / cols);
    const left = pad + col * (cellW + pad);
    const top = pad + row * (cellH + pad);
    const buffer = await sharp(await readFile(item.path)).resize(size, size, { fit: 'inside' }).png().toBuffer();
    composites.push({
      input: buffer,
      left: left + Math.floor((cellW - size) / 2),
      top,
    });
    composites.push({
      input: await renderTextLabel([item.label], cellW, 12),
      left,
      top: top + size + 8,
    });
  }

  const target = path.join(evidenceDir, 'ICON_004_DETAILED_TECHNOLOGY_CROSS_FAMILY_BOARD.png');
  await base.composite(composites).png().toFile(target);
  console.log('Wrote', target);
}

async function main(): Promise<void> {
  await composeFamilyBoard();
  await composeTwoTierBoard();
  await composeScaleBoard();
  await composeResearchContext();
  await composeProgressionContext();
  await composeCrossFamilyBoard();
}

void main();
