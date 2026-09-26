/* global console, process, Buffer */
/**
 * MSV-001 production 8/8 evidence boards + runtime capture helper metadata.
 * Usage: node tools/compose-msv-001-production-evidence.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('D:/Cursor/Project Genesis');
const PUBLIC = path.join(ROOT, 'apps/web/public/assets/milestones');
const EVIDENCE = path.join(ROOT, 'docs/architecture/reviews/evidence');

const ALL = [
  { id: 'first_production', label: 'First Production' },
  { id: 'first_steel', label: 'Erster Stahl' },
  { id: 'first_profit', label: 'First Profit' },
  { id: 'first_consumer_goods', label: 'Erste Konsumgüter' },
  { id: 'first_machine_parts', label: 'Erste Maschinenteile' },
  { id: 'first_industrial_machinery', label: 'Erste Industriemaschine' },
  { id: 'first_advanced_electronics', label: 'Erste Advanced Elektronik' },
  { id: 'profit_100', label: 'Steady Sales' },
];

function primaryPath(id) {
  return path.join(PUBLIC, `MSV-001-${id}-primary.png`);
}

function medallionPath(id) {
  return path.join(PUBLIC, `MSV-001-${id}-medallion.png`);
}

function labelSvg(text, x, y, size = 16) {
  const safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<text x="${x}" y="${y}" fill="#c8d2dc" font-family="Segoe UI, sans-serif" font-size="${size}">${safe}</text>`;
}

async function thumb(file, size) {
  return sharp(file).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

async function composeGrid({ outName, title, columns, cellSize, items, thumbFn = thumb }) {
  const padding = 40;
  const labelH = 28;
  const rows = Math.ceil(items.length / columns);
  const width = padding * 2 + columns * (cellSize + 20);
  const height = padding * 2 + 48 + rows * (cellSize + labelH + 16);
  const composites = [];
  for (let i = 0; i < items.length; i += 1) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = padding + col * (cellSize + 20);
    const y = padding + 48 + row * (cellSize + labelH + 16);
    const buf = await thumbFn(items[i].path, cellSize);
    composites.push({ input: buf, left: x, top: y });
  }
  const labels = items
    .map((item, i) => {
      const col = i % columns;
      const row = Math.floor(i / columns);
      const x = padding + col * (cellSize + 20) + 4;
      const yy = padding + 48 + row * (cellSize + labelH + 16) + cellSize + 22;
      return labelSvg(item.label, x, yy, 14);
    })
    .join('\n');
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#121820"/>
  ${labelSvg(title, padding, padding + 24, 22)}
  ${labels}
  </svg>`;
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  await sharp(base).composite(composites).png().toFile(path.join(EVIDENCE, outName));
}

async function composeMedallionSizesBoard() {
  const sizes = [48, 64, 96];
  const pad = 36;
  const labelW = 200;
  const cell = 96;
  const width = pad * 2 + labelW + sizes.length * (cell + 20);
  const height = pad * 2 + 56 + ALL.length * (cell + 24);
  const composites = [];
  let rowY = pad + 56;
  for (const entry of ALL) {
    let x = pad + labelW;
    for (const size of sizes) {
      const buf = await thumb(medallionPath(entry.id), size);
      composites.push({
        input: buf,
        left: x + Math.round((cell - size) / 2),
        top: rowY + Math.round((cell - size) / 2),
      });
      x += cell + 20;
    }
    rowY += cell + 24;
  }
  const header = sizes
    .map((s, i) => labelSvg(`${s}px`, pad + labelW + i * (cell + 20) + cell / 2 - 16, pad + 40, 16))
    .join('\n');
  const rowLabels = ALL.map((entry, ri) =>
    labelSvg(entry.label, pad, pad + 56 + ri * (cell + 24) + cell / 2, 14),
  ).join('\n');
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#121820"/>
  ${labelSvg('MSV-001 Production Medallions — 48 / 64 / 96 px', pad, pad + 24, 22)}
  ${header}
  ${rowLabels}
  </svg>`;
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  await sharp(base)
    .composite(composites)
    .png()
    .toFile(path.join(EVIDENCE, 'MSV_001_PRODUCTION_8_OF_8_MEDALLION_FAMILY_BOARD.png'));
}

async function composeProgressionLadder() {
  const industrial = ['first_production', 'first_machine_parts', 'first_industrial_machinery', 'first_advanced_electronics'];
  const commercial = ['first_profit', 'profit_100'];
  const pad = 40;
  const card = 140;
  const width = 980;
  const height = 520;
  const composites = [];
  const drawRow = async (ids, y, title) => {
    let x = pad + 20;
    for (const id of ids) {
      composites.push({ input: await thumb(primaryPath(id), card), left: x, top: y });
      x += card + 24;
    }
    return labelSvg(title, pad, y - 16, 18);
  };
  const t1 = await drawRow(industrial, pad + 80, 'Industrial ladder');
  const t2 = await drawRow(commercial, pad + 80 + card + 80, 'Commercial ladder');
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#121820"/>
  ${labelSvg('MSV-001 Production Progression Ladder', pad, pad + 28, 24)}
  ${t1}
  ${t2}
  </svg>`;
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  await sharp(base)
    .composite(composites)
    .png()
    .toFile(path.join(EVIDENCE, 'MSV_001_PRODUCTION_PROGRESSION_LADDER_BOARD.png'));
}

async function composeCrossFamily() {
  const refs = [
    { label: 'ICON-001 Resource', path: path.join(ROOT, 'apps/web/public/assets/icons/ICON-001-steel.png') },
    { label: 'ICON-003 Building', path: path.join(ROOT, 'apps/web/public/assets/buildings/ICON-003-sawmill.png') },
    {
      label: 'ICON-004 Technology',
      path: path.join(ROOT, 'apps/web/public/assets/research/ICON-004-basic_woodworking-primary.png'),
    },
    {
      label: 'ICON-005 Process',
      path: path.join(ROOT, 'apps/web/public/assets/process/ICON-005-recipe_steel-primary.png'),
    },
    {
      label: 'WFV-001 Workforce',
      path: path.join(ROOT, 'apps/web/public/assets/workforce/WFV-001-employee_production_worker-primary.png'),
    },
    { label: 'MSV-001 Milestone', path: primaryPath('first_steel') },
  ];
  await composeGrid({
    outName: 'MSV_001_PRODUCTION_CROSS_FAMILY_DIFFERENTIATION_BOARD.png',
    title: 'Cross-Family — MSV achievement vs resource/building/tech/process/workforce',
    columns: 3,
    cellSize: 160,
    items: refs,
  });
}

async function main() {
  await fs.mkdir(EVIDENCE, { recursive: true });
  await composeGrid({
    outName: 'MSV_001_PRODUCTION_8_OF_8_PRIMARY_FAMILY_BOARD.png',
    title: 'MSV-001 Production Tier-1 Primaries (8/8)',
    columns: 4,
    cellSize: 200,
    items: ALL.map((entry) => ({ label: entry.label, path: primaryPath(entry.id) })),
  });
  await composeMedallionSizesBoard();
  await composeProgressionLadder();
  await composeCrossFamily();
  console.log('MSV-001 production evidence boards written to docs/architecture/reviews/evidence/');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
