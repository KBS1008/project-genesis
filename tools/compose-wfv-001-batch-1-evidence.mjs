/**
 * WFV-001 Production Batch 1 evidence boards.
 */
/* global console, process, Buffer */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const WFV_001_BATCH_1_EMPLOYEE_TYPE_IDS = [
  'employee_production_worker',
  'employee_senior_engineer',
  'employee_executive_director',
  'employee_maintenance_technician',
  'employee_senior_researcher',
  'employee_logistics_coordinator',
  'employee_financial_analyst',
  'employee_operations_supervisor',
];

const ROOT = path.resolve('D:/Cursor/Project Genesis');
const DESIGN = path.join(ROOT, 'docs/design/workforce/icon-wfv-001/primary');
const EVIDENCE = path.join(ROOT, 'docs/architecture/reviews/evidence');

const LABELS = Object.freeze({
  employee_production_worker: 'Produktionsmitarbeiter',
  employee_senior_engineer: 'Senior-Ingenieur',
  employee_executive_director: 'Executive Director',
  employee_maintenance_technician: 'Wartungstechniker',
  employee_senior_researcher: 'Senior-Forscher',
  employee_logistics_coordinator: 'Logistikkoordinator',
  employee_financial_analyst: 'Finanzanalyst',
  employee_operations_supervisor: 'Produktionsleiter',
});

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function labelSvg(text, x, y, size = 18) {
  return `<text x="${x}" y="${y}" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" fill="#e8ecf1">${escapeXml(text)}</text>`;
}

async function thumb(filePath, size) {
  return sharp(filePath)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function familyBoard() {
  const cell = 240;
  const cols = 4;
  const rows = 2;
  const pad = 48;
  const width = pad * 2 + cols * cell + (cols - 1) * 20;
  const height = pad * 2 + 64 + rows * (cell + 40);
  const composites = [];
  const labels = [];
  let i = 0;
  for (const id of WFV_001_BATCH_1_EMPLOYEE_TYPE_IDS) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const x = pad + c * (cell + 20);
    const y = pad + 64 + r * (cell + 40);
    const p = path.join(DESIGN, `WFV-001-${id}-primary.png`);
    composites.push({ input: await thumb(p, cell - 16), left: x + 8, top: y + 8 });
    labels.push(labelSvg(LABELS[id] ?? id, x + 8, y + cell + 28, 16));
    i += 1;
  }
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#0f1419"/>${labelSvg('WFV-001 Production Batch 1 — 8 hybrid primaries', pad, pad + 28, 24)}${labels.join('')}</svg>`;
  await sharp(Buffer.from(svg)).composite(composites).png().toFile(path.join(EVIDENCE, 'WFV_001_PRODUCTION_BATCH_1_FAMILY_BOARD.png'));
}

async function scaleBoard() {
  const sampleIds = WFV_001_BATCH_1_EMPLOYEE_TYPE_IDS.slice(0, 4);
  const scales = [64, 96, 128, 256];
  const cell = 200;
  const pad = 40;
  const width = pad * 2 + scales.length * cell;
  const height = pad * 2 + 56 + sampleIds.length * (cell + 24);
  const composites = [];
  const labels = [];
  sampleIds.forEach((id, row) => {
    const y = pad + 56 + row * (cell + 24);
    labels.push(labelSvg(LABELS[id] ?? id, pad, y + cell / 2, 16));
  });

  let rowIndex = 0;
  for (const id of sampleIds) {
    const y = pad + 56 + rowIndex * (cell + 24);
    let colIndex = 0;
    for (const scale of scales) {
      const x = pad + 140 + colIndex * cell;
      const p = path.join(DESIGN, `WFV-001-${id}-primary.png`);
      const buf = await sharp(p)
        .resize(scale, scale, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      composites.push({
        input: buf,
        left: x + Math.floor((cell - scale) / 2),
        top: y + Math.floor((cell - scale) / 2),
      });
      if (rowIndex === 0) {
        labels.push(labelSvg(`${scale}px`, x + cell / 2 - 16, pad + 36, 16));
      }
      colIndex += 1;
    }
    rowIndex += 1;
  }

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#0f1419"/>${labelSvg('WFV-001 Batch-1 scale board (representative 4/8)', pad, pad + 28, 22)}${labels.join('')}</svg>`;
  await sharp(Buffer.from(svg)).composite(composites).png().toFile(path.join(EVIDENCE, 'WFV_001_PRODUCTION_BATCH_1_SCALE_BOARD.png'));
}

async function crossFamilyBoard() {
  const refs = [
    { path: path.join(ROOT, 'apps/web/public/assets/icons/ICON-001-steel.png'), caption: 'ICON-001 Resource' },
    { path: path.join(ROOT, 'apps/web/public/assets/buildings/ICON-003-assembly_plant.png'), caption: 'ICON-003 Building' },
    { path: path.join(ROOT, 'apps/web/public/assets/research/ICON-004-coal_efficiency-primary.png'), caption: 'ICON-004 Technology' },
    { path: path.join(ROOT, 'docs/design/production/icon-005/primary/ICON-005-recipe_steel-primary.png'), caption: 'ICON-005 Production' },
    { path: path.join(DESIGN, 'WFV-001-employee_senior_engineer-primary.png'), caption: 'WFV Workforce' },
  ];
  const cell = 220;
  const pad = 40;
  const width = pad * 2 + refs.length * (cell + 16);
  const height = pad * 2 + 64 + cell + 32;
  const composites = [];
  const labels = [];
  let x = pad;
  const y = pad + 64;
  for (const ref of refs) {
    composites.push({ input: await thumb(ref.path, cell - 12), left: x + 6, top: y + 6 });
    labels.push(labelSvg(ref.caption, x + 6, y + cell + 24, 14));
    x += cell + 16;
  }
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#0f1419"/>${labelSvg('Cross-family differentiation', pad, pad + 28, 22)}${labels.join('')}</svg>`;
  await sharp(Buffer.from(svg)).composite(composites).png().toFile(path.join(EVIDENCE, 'WFV_001_PRODUCTION_BATCH_1_CROSS_FAMILY_BOARD.png'));
}

async function main() {
  await fs.mkdir(EVIDENCE, { recursive: true });
  await familyBoard();
  await scaleBoard();
  await crossFamilyBoard();
  console.log('Batch-1 static boards written');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
