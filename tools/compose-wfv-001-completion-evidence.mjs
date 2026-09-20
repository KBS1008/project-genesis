/* global console, process, Buffer */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('D:/Cursor/Project Genesis');
const DESIGN = path.join(ROOT, 'docs/design/workforce/icon-wfv-001/primary');
const EVIDENCE = path.join(ROOT, 'docs/architecture/reviews/evidence');

const ALL_IDS = [
  'employee_production_worker',
  'employee_senior_production_worker',
  'employee_operations_supervisor',
  'employee_engineer_basic',
  'employee_senior_engineer',
  'employee_maintenance_technician',
  'employee_researcher_basic',
  'employee_senior_researcher',
  'employee_lab_director',
  'employee_logistics_operator',
  'employee_logistics_coordinator',
  'employee_distribution_clerk',
  'employee_port_operator',
  'employee_rail_dispatcher',
  'employee_administrator_basic',
  'employee_financial_analyst',
  'employee_hr_manager',
  'employee_regional_manager',
  'employee_executive_director',
];

const COMPLETION_IDS = [
  'employee_senior_production_worker',
  'employee_engineer_basic',
  'employee_researcher_basic',
  'employee_lab_director',
  'employee_logistics_operator',
  'employee_distribution_clerk',
  'employee_port_operator',
  'employee_rail_dispatcher',
  'employee_administrator_basic',
  'employee_hr_manager',
  'employee_regional_manager',
];

const LABELS = {
  employee_production_worker: 'Produktionsmitarbeiter',
  employee_senior_production_worker: 'Erfahrener Produktionsmitarbeiter',
  employee_operations_supervisor: 'Produktionsleiter',
  employee_engineer_basic: 'Junior-Ingenieur',
  employee_senior_engineer: 'Senior-Ingenieur',
  employee_maintenance_technician: 'Wartungstechniker',
  employee_researcher_basic: 'Forscher',
  employee_senior_researcher: 'Senior-Forscher',
  employee_lab_director: 'Laborleiter',
  employee_logistics_operator: 'Logistikmitarbeiter',
  employee_logistics_coordinator: 'Logistikkoordinator',
  employee_distribution_clerk: 'Distributionsmitarbeiter',
  employee_port_operator: 'Hafenlogistiker',
  employee_rail_dispatcher: 'Schienendisponent',
  employee_administrator_basic: 'Verwaltungsmitarbeiter',
  employee_financial_analyst: 'Finanzanalyst',
  employee_hr_manager: 'HR-Manager',
  employee_regional_manager: 'Regionalleiter',
  employee_executive_director: 'Executive Director',
};

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function labelSvg(text, x, y, size = 14) {
  return `<text x="${x}" y="${y}" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" fill="#e8ecf1">${escapeXml(text)}</text>`;
}

async function thumb(filePath, size) {
  return sharp(filePath)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function gridBoard(outName, title, ids, cols, cell = 200) {
  const rows = Math.ceil(ids.length / cols);
  const pad = 40;
  const width = pad * 2 + cols * cell + (cols - 1) * 12;
  const height = pad * 2 + 56 + rows * (cell + 36);
  const composites = [];
  const labels = [];
  ids.forEach((id, i) => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const x = pad + c * (cell + 12);
    const y = pad + 56 + r * (cell + 36);
    const p = path.join(DESIGN, `WFV-001-${id}-primary.png`);
    composites.push({ input: thumb(p, cell - 16), left: x + 8, top: y + 8 });
    labels.push(labelSvg(LABELS[id] ?? id, x + 4, y + cell + 22, 11));
  });
  const resolved = await Promise.all(
    composites.map(async (c) => ({ input: await c.input, left: c.left, top: c.top })),
  );
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#0f1419"/>${labelSvg(title, pad, pad + 28, 20)}${labels.join('')}</svg>`;
  await sharp(Buffer.from(svg)).composite(resolved).png().toFile(path.join(EVIDENCE, outName));
}

async function scaleBoard() {
  const samples = [
    'employee_senior_production_worker',
    'employee_researcher_basic',
    'employee_administrator_basic',
  ];
  const scales = [64, 80, 128, 256];
  const cell = 180;
  const pad = 36;
  const width = pad * 2 + 120 + scales.length * cell;
  const height = pad * 2 + 48 + samples.length * (cell + 20);
  const composites = [];
  const labels = [labelSvg('WFV-001 completion scale board', pad, pad + 24, 18)];
  let row = 0;
  for (const id of samples) {
    const y = pad + 48 + row * (cell + 20);
    labels.push(labelSvg(LABELS[id] ?? id, pad, y + cell / 2, 13));
    let col = 0;
    for (const scale of scales) {
      const x = pad + 120 + col * cell;
      const buf = await sharp(path.join(DESIGN, `WFV-001-${id}-primary.png`))
        .resize(scale, scale, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      composites.push({
        input: buf,
        left: x + Math.floor((cell - scale) / 2),
        top: y + Math.floor((cell - scale) / 2),
      });
      if (row === 0) labels.push(labelSvg(`${scale}px`, x + 20, pad + 36, 12));
      col += 1;
    }
    row += 1;
  }
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#0f1419"/>${labels.join('')}</svg>`;
  await sharp(Buffer.from(svg)).composite(composites).png().toFile(path.join(EVIDENCE, 'WFV_001_PRODUCTION_COMPLETION_SCALE_BOARD.png'));
}

async function crossFamily() {
  const refs = [
    { path: path.join(ROOT, 'apps/web/public/assets/icons/ICON-001-steel.png'), caption: 'ICON-001' },
    { path: path.join(ROOT, 'apps/web/public/assets/buildings/ICON-003-assembly_plant.png'), caption: 'ICON-003' },
    { path: path.join(ROOT, 'apps/web/public/assets/research/ICON-004-coal_efficiency-primary.png'), caption: 'ICON-004' },
    { path: path.join(ROOT, 'docs/design/production/icon-005/primary/ICON-005-recipe_steel-primary.png'), caption: 'ICON-005' },
    { path: path.join(DESIGN, 'WFV-001-employee_port_operator-primary.png'), caption: 'WFV Port' },
    { path: path.join(DESIGN, 'WFV-001-employee_researcher_basic-primary.png'), caption: 'WFV Research' },
  ];
  const cell = 190;
  const pad = 32;
  const width = pad * 2 + refs.length * (cell + 10);
  const height = pad * 2 + 56 + cell + 28;
  const composites = [];
  const labels = [];
  let x = pad;
  const y = pad + 56;
  for (const ref of refs) {
    composites.push({ input: await thumb(ref.path, cell - 10), left: x + 5, top: y + 5 });
    labels.push(labelSvg(ref.caption, x + 4, y + cell + 20, 12));
    x += cell + 10;
  }
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#0f1419"/>${labelSvg('Cross-family — person-first WFV completion', pad, pad + 26, 18)}${labels.join('')}</svg>`;
  await sharp(Buffer.from(svg)).composite(composites).png().toFile(path.join(EVIDENCE, 'WFV_001_PRODUCTION_COMPLETION_CROSS_FAMILY_BOARD.png'));
}

async function main() {
  await fs.mkdir(EVIDENCE, { recursive: true });
  await gridBoard(
    'WFV_001_PRODUCTION_COMPLETION_19_ROLE_FAMILY_BOARD.png',
    'WFV-001 production primaries — 19/19',
    ALL_IDS,
    5,
    180,
  );
  await gridBoard(
    'WFV_001_PRODUCTION_COMPLETION_NEW_ROLES_BOARD.png',
    'Completion slice — 11 new primaries',
    COMPLETION_IDS,
    4,
    220,
  );
  await scaleBoard();
  await crossFamily();
  console.log('Completion evidence boards written');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
