/* global console, process, Buffer */
/**
 * WFV-001 art-direction pilot evidence boards + alpha QA (dev-only).
 * Usage: node tools/compose-wfv-001-art-direction-evidence.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('D:/Cursor/Project Genesis');
const PILOT_DIR = path.join(ROOT, 'docs/design/workforce/pilot-wfv-001');
const EVIDENCE_DIR = path.join(ROOT, 'docs/architecture/reviews/evidence');

const ROLES = [
  {
    id: 'employee_production_worker',
    label: 'Produktionsmitarbeiter',
    short: 'Production',
  },
  {
    id: 'employee_senior_engineer',
    label: 'Senior-Ingenieur',
    short: 'Engineering',
  },
  {
    id: 'employee_executive_director',
    label: 'Executive Director',
    short: 'Executive',
  },
];

const DIRECTIONS = [
  { key: 'a', suffix: 'direction-a-person', title: 'A — Person / Portrait' },
  { key: 'b', suffix: 'direction-b-workstation', title: 'B — Workstation' },
  { key: 'c', suffix: 'direction-c-hybrid', title: 'C — Hybrid' },
];

function assetPath(roleId, suffix) {
  return path.join(PILOT_DIR, `WFV-001-${roleId}-${suffix}.png`);
}

async function inspectAlpha(filePath) {
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  let transparent = 0;
  let opaque = 0;
  let checkerPairs = 0;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 16) transparent += 1;
    else opaque += 1;
    if (a > 240) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (Math.abs(r - g) < 8 && Math.abs(g - b) < 8 && r > 180 && r < 220) {
        checkerPairs += 1;
      }
    }
  }
  const total = transparent + opaque;
  const transparentPercent = total ? (transparent / total) * 100 : 0;
  const checkerboardSuspect = checkerPairs / total > 0.02;
  const pass =
    info.width === 1024 &&
    info.height === 1024 &&
    info.channels === 4 &&
    transparentPercent > 8 &&
    !checkerboardSuspect;
  return {
    assetPath: filePath,
    width: info.width,
    height: info.height,
    channels: info.channels,
    transparentPixelCount: transparent,
    opaquePixelCount: opaque,
    transparentPercent,
    checkerboardSuspect,
    pass,
  };
}

function labelSvg(text, x, y, size = 22, weight = 600) {
  return `<text x="${x}" y="${y}" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="#e8ecf1">${escapeXml(text)}</text>`;
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

async function thumb(filePath, size) {
  return sharp(filePath).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

async function composeGrid({
  outName,
  title,
  columns,
  rows,
  cellSize,
  items,
  padding = 48,
  headerH = 72,
  labelH = 36,
}) {
  const width = padding * 2 + columns * cellSize + (columns - 1) * 24;
  const height = padding * 2 + headerH + rows * (cellSize + labelH + 16);
  const composites = [];
  let y = padding + headerH;

  for (let r = 0; r < rows; r += 1) {
    let x = padding;
    for (let c = 0; c < columns; c += 1) {
      const item = items[r * columns + c];
      if (!item) continue;
      const buf = await thumb(item.path, cellSize);
      composites.push({ input: buf, left: x, top: y });
      x += cellSize + 24;
    }
    y += cellSize + labelH + 16;
  }

  const labels = [];
  y = padding + headerH;
  for (let r = 0; r < rows; r += 1) {
    let x = padding;
    for (let c = 0; c < columns; c += 1) {
      const item = items[r * columns + c];
      if (item?.caption) {
        labels.push(
          labelSvg(item.caption, x + 8, y + cellSize + 26, 18, 500),
        );
      }
      x += cellSize + 24;
    }
    y += cellSize + labelH + 16;
  }

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0f1419"/>
  ${labelSvg(title, padding, padding + 32, 28)}
  ${labels.join('\n')}
</svg>`;

  await sharp(Buffer.from(svg))
    .composite(composites)
    .png()
    .toFile(path.join(EVIDENCE_DIR, outName));
}

async function buildFamilyBoard() {
  const items = [];
  for (const role of ROLES) {
    for (const dir of DIRECTIONS) {
      items.push({
        path: assetPath(role.id, dir.suffix),
        caption: `${role.short} · ${dir.key.toUpperCase()}`,
      });
    }
  }
  await composeGrid({
    outName: 'WFV_001_ART_DIRECTION_FAMILY_BOARD.png',
    title: 'WFV-001 — 3 roles × 3 directions (9 pilot concepts)',
    columns: 3,
    rows: 3,
    cellSize: 280,
    items,
  });
}

async function buildDirectionBoard(suffix, outName, title) {
  const items = ROLES.map((role) => ({
    path: assetPath(role.id, suffix),
    caption: role.label,
  }));
  await composeGrid({
    outName,
    title,
    columns: 3,
    rows: 1,
    cellSize: 320,
    items,
  });
}

async function buildScaleBoard() {
  const sample = assetPath('employee_senior_engineer', 'direction-c-hybrid');
  const scales = [64, 96, 128, 256];
  const items = scales.map((s) => ({
    path: sample,
    caption: `${s}px`,
    renderSize: s,
  }));

  const cell = 280;
  const padding = 48;
  const width = padding * 2 + 4 * cell + 3 * 24;
  const height = padding * 2 + 72 + cell + 48;
  const composites = [];
  let x = padding;
  const y = padding + 72;
  for (const item of items) {
    const buf = await sharp(sample)
      .resize(item.renderSize, item.renderSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();
    const left = x + Math.floor((cell - item.renderSize) / 2);
    const top = y + Math.floor((cell - item.renderSize) / 2);
    composites.push({ input: buf, left, top });
    x += cell + 24;
  }

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0f1419"/>
  ${labelSvg('WFV-001 scale test — Senior-Ingenieur hybrid @ 64 / 96 / 128 / 256', padding, padding + 32, 24)}
  ${labelSvg('64px', padding + 8, y + cell + 32, 18, 500)}
  ${labelSvg('96px', padding + cell + 32, y + cell + 32, 18, 500)}
  ${labelSvg('128px', padding + 2 * cell + 56, y + cell + 32, 18, 500)}
  ${labelSvg('256px', padding + 3 * cell + 80, y + cell + 32, 18, 500)}
</svg>`;

  await sharp(Buffer.from(svg))
    .composite(composites)
    .png()
    .toFile(path.join(EVIDENCE_DIR, 'WFV_001_SCALE_BOARD.png'));
}

async function buildCrossFamilyBoard() {
  const refs = [
    {
      path: path.join(ROOT, 'apps/web/public/assets/icons/ICON-001-steel.png'),
      caption: 'ICON-001 Resource',
    },
    {
      path: path.join(ROOT, 'apps/web/public/assets/buildings/ICON-003-assembly_plant.png'),
      caption: 'ICON-003 Building',
    },
    {
      path: path.join(ROOT, 'apps/web/public/assets/research/ICON-004-coal_efficiency-primary.png'),
      caption: 'ICON-004 Technology',
    },
    {
      path: path.join(
        ROOT,
        'docs/design/production/icon-005/primary/ICON-005-recipe_steel-primary.png',
      ),
      caption: 'ICON-005 Production',
    },
    {
      path: assetPath('employee_senior_engineer', 'direction-c-hybrid'),
      caption: 'WFV-001 Hybrid (pilot)',
    },
  ];

  await composeGrid({
    outName: 'WFV_001_CROSS_FAMILY_BOARD.png',
    title: 'Cross-family differentiation — hybrid engineer pilot vs sealed families',
    columns: 5,
    rows: 1,
    cellSize: 240,
    items: refs,
  });
}

async function buildWorkforceContextMock() {
  const pilots = [
    assetPath('employee_production_worker', 'direction-c-hybrid'),
    assetPath('employee_senior_engineer', 'direction-c-hybrid'),
    assetPath('employee_executive_director', 'direction-c-hybrid'),
  ];
  const thumbSize = 72;
  const thumbs = await Promise.all(pilots.map((p) => thumb(p, thumbSize)));

  const width = 920;
  const height = 420;
  const rowY = [150, 220, 290];
  const composites = thumbs.map((buf, i) => ({
    input: buf,
    left: 32,
    top: rowY[i] - 8,
  }));

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#121820"/>
  <rect x="24" y="24" width="872" height="372" rx="12" fill="#1a222d" stroke="#2a3544"/>
  ${labelSvg('Mitarbeiter — static context mock (DEV / not production UI)', 40, 56, 22)}
  ${labelSvg('Eingestelltes Personal, Gehälter und Gebäudezuweisungen.', 40, 82, 16, 400)}
  ${labelSvg('Name', 120, 118, 14, 600)}
  ${labelSvg('Typ', 280, 118, 14, 600)}
  ${labelSvg('Gehalt', 420, 118, 14, 600)}
  ${labelSvg('Produktivität', 520, 118, 14, 600)}
  ${labelSvg('Zuweisung', 680, 118, 14, 600)}
  ${labelSvg('Anna K.', 120, 162, 15, 500)}
  ${labelSvg('Produktionsmitarbeiter', 280, 162, 15, 500)}
  ${labelSvg('120 GC', 420, 162, 15, 500)}
  ${labelSvg('1,0', 540, 162, 15, 500)}
  ${labelSvg('Sägewerk Nord', 680, 162, 15, 500)}
  ${labelSvg('Jonas R.', 120, 232, 15, 500)}
  ${labelSvg('Senior-Ingenieur', 280, 232, 15, 500)}
  ${labelSvg('320 GC', 420, 232, 15, 500)}
  ${labelSvg('1,2', 540, 232, 15, 500)}
  ${labelSvg('Montagewerk', 680, 232, 15, 500)}
  ${labelSvg('Elena M.', 120, 302, 15, 500)}
  ${labelSvg('Executive Director', 280, 302, 15, 500)}
  ${labelSvg('600 GC', 420, 302, 15, 500)}
  ${labelSvg('1,1', 540, 302, 15, 500)}
  ${labelSvg('Konzernzentrale', 680, 302, 15, 500)}
  ${labelSvg('Pilot art inset left — current PGEmployeesWidget is text-only; layout slice deferred.', 40, 368, 13, 400)}
</svg>`;

  await sharp(Buffer.from(svg))
    .composite(composites)
    .png()
    .toFile(path.join(EVIDENCE_DIR, 'WFV_001_WORKFORCE_CONTEXT_MOCK.png'));
}

async function main() {
  await fs.mkdir(EVIDENCE_DIR, { recursive: true });
  const alpha = [];
  for (const role of ROLES) {
    for (const dir of DIRECTIONS) {
      alpha.push(await inspectAlpha(assetPath(role.id, dir.suffix)));
    }
  }
  await fs.writeFile(
    path.join(PILOT_DIR, 'WFV_001_PILOT_ALPHA_REPORT.json'),
    `${JSON.stringify(alpha, null, 2)}\n`,
  );

  await buildFamilyBoard();
  await buildDirectionBoard(
    'direction-a-person',
    'WFV_001_DIRECTION_A_PERSON_BOARD.png',
    'Direction A — Person / Role Portrait',
  );
  await buildDirectionBoard(
    'direction-b-workstation',
    'WFV_001_DIRECTION_B_WORKSTATION_BOARD.png',
    'Direction B — Workstation / Tool Vignette',
  );
  await buildDirectionBoard(
    'direction-c-hybrid',
    'WFV_001_DIRECTION_C_HYBRID_BOARD.png',
    'Direction C — Hybrid Human + Occupational Context',
  );
  await buildScaleBoard();
  await buildCrossFamilyBoard();
  await buildWorkforceContextMock();

  const failed = alpha.filter((a) => !a.pass);
  if (failed.length) {
    console.warn('Alpha QA warnings:', failed.map((f) => f.assetPath));
  }
  console.log('WFV-001 evidence boards written to', EVIDENCE_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
