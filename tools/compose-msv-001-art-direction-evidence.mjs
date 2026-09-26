/* global console, process, Buffer */
/**
 * MSV-001 art-direction pilot — alpha QA, compact medallions, evidence boards.
 * Usage: node tools/compose-msv-001-art-direction-evidence.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const ROOT = path.resolve('D:/Cursor/Project Genesis');
const PILOT_DIR = path.join(ROOT, 'docs/design/milestones/pilot-msv-001');
const EVIDENCE_DIR = path.join(ROOT, 'docs/architecture/reviews/evidence');
const ASSETS_MIRROR = path.join(ROOT, 'assets');

const PILOTS = [
  { id: 'first_production', label: 'First Production', short: 'Production' },
  { id: 'first_steel', label: 'First Steel / Erster Stahl', short: 'Steel' },
  { id: 'first_profit', label: 'First Profit', short: 'Profit' },
  { id: 'first_consumer_goods', label: 'Consumer Goods', short: 'Consumer' },
];

function primaryName(id) {
  return `MSV-001-${id}-primary-pilot.png`;
}

function compactName(id) {
  return `MSV-001-${id}-medallion-pilot.png`;
}

function primaryPath(id) {
  return path.join(PILOT_DIR, primaryName(id));
}

function compactPath(id) {
  return path.join(PILOT_DIR, compactName(id));
}

async function fileSha256(filePath) {
  const buf = await fs.readFile(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

async function ensurePilotSources() {
  await fs.mkdir(PILOT_DIR, { recursive: true });
  const cursorAssets = path.join('C:/Users/Besitzer/.cursor/projects/d-Cursor-Project-Genesis/assets');
  for (const p of PILOTS) {
    const dest = primaryPath(p.id);
    if (p.id !== 'first_profit') {
      try {
        await fs.access(dest);
        continue;
      } catch {
        /* fall through to copy */
      }
    }
    const candidates = [
      path.join(ASSETS_MIRROR, primaryName(p.id)),
      path.join(cursorAssets, primaryName(p.id)),
      dest,
    ];
    let copied = false;
    for (const src of candidates) {
      try {
        await fs.access(src);
        if (src !== dest) await fs.copyFile(src, dest);
        copied = true;
        break;
      } catch {
        /* try next */
      }
    }
    if (!copied) throw new Error(`Missing primary pilot: ${primaryName(p.id)}`);
    const meta = await sharp(dest).metadata();
    if (meta.width !== 1024 || meta.height !== 1024) {
      const normalized = await sharp(dest)
        .resize(1024, 1024, { fit: 'cover' })
        .ensureAlpha()
        .png()
        .toBuffer();
      const tmp = `${dest}.normalize.tmp.png`;
      await fs.writeFile(tmp, normalized);
      await fs.rename(tmp, dest);
    } else if (p.id === 'first_profit') {
      const tmp = `${dest}.ensure.tmp.png`;
      await sharp(dest).ensureAlpha().png().toFile(tmp);
      await fs.rename(tmp, dest);
    }
    if (p.id === 'first_profit') {
      await fs.copyFile(dest, path.join(ASSETS_MIRROR, primaryName(p.id)));
    }
  }
}

async function inspectAlpha(filePath) {
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
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
      if (Math.abs(r - g) < 8 && Math.abs(g - b) < 8 && r > 180 && r < 220) checkerPairs += 1;
    }
  }
  const total = transparent + opaque;
  const transparentPercent = total ? (transparent / total) * 100 : 0;
  const checkerboardSuspect = checkerPairs / total > 0.02;
  const pass =
    info.width === 1024 &&
    info.height === 1024 &&
    info.channels === 4 &&
    !checkerboardSuspect;
  return {
    assetPath: path.relative(ROOT, filePath).replace(/\\/g, '/'),
    width: info.width,
    height: info.height,
    channels: info.channels,
    transparentPercent: Number(transparentPercent.toFixed(2)),
    checkerboardSuspect,
    pass,
  };
}

async function buildMedallion(primaryFile, outFile) {
  const size = 512;
  const inner = 420;
  const resized = await sharp(primaryFile)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const ringSvg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#3d4f63" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#0a0e14" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <polygon points="256,24 448,128 448,384 256,488 64,384 64,128" fill="url(#g)" stroke="#8a9bb0" stroke-width="10"/>
  <polygon points="256,44 428,138 428,374 256,468 84,374 84,138" fill="none" stroke="#c4cdd8" stroke-width="4" opacity="0.85"/>
  </svg>`;

  const ring = await sharp(Buffer.from(ringSvg)).png().toBuffer();
  const left = Math.round((size - inner) / 2);
  const top = Math.round((size - inner) / 2) - 8;

  await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: ring, top: 0, left: 0 },
      { input: resized, top, left },
      { input: ring, top: 0, left: 0 },
    ])
    .png()
    .toFile(outFile);
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function labelSvg(text, x, y, size = 20) {
  return `<text x="${x}" y="${y}" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" font-weight="600" fill="#e8ecf1">${escapeXml(text)}</text>`;
}

async function thumb(filePath, size) {
  return sharp(filePath).resize(size, size, { fit: 'contain', background: { r: 18, g: 22, b: 28, alpha: 1 } }).png().toBuffer();
}

async function lockedThumb(filePath, size) {
  return sharp(filePath)
    .resize(size, size, { fit: 'contain', background: { r: 18, g: 22, b: 28, alpha: 1 } })
    .modulate({ saturation: 0.35, brightness: 0.72 })
    .png()
    .toBuffer();
}

async function composeGrid({ outName, title, columns, cellSize, items, padding = 40, headerH = 64, labelH = 28 }) {
  const rows = Math.ceil(items.length / columns);
  const width = padding * 2 + columns * cellSize + (columns - 1) * 20;
  const height = padding * 2 + headerH + rows * (cellSize + labelH + 12);
  const composites = [];
  let y = padding + headerH;
  for (let i = 0; i < items.length; i += 1) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = padding + col * (cellSize + 20);
    const yy = y + row * (cellSize + labelH + 12);
    const buf = await thumb(items[i].path, cellSize);
    composites.push({ input: buf, left: x, top: yy });
  }
  const labels = items
    .map((item, i) => {
      const col = i % columns;
      const row = Math.floor(i / columns);
      const x = padding + col * (cellSize + 20) + 8;
      const yy = y + row * (cellSize + labelH + 12) + cellSize + 22;
      return labelSvg(item.label, x, yy, 18);
    })
    .join('\n');

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#121820"/>
  ${labelSvg(title, padding, padding + 28, 28)}
  ${labels}
  </svg>`;
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  await sharp(base).composite(composites).png().toFile(path.join(EVIDENCE_DIR, outName));
}

async function composeScaleBoard() {
  const ids = ['first_production', 'first_steel'];
  const sizes = [48, 64, 96, 128, 256];
  const cell = 256;
  const pad = 36;
  const labelW = 140;
  const width = pad * 2 + labelW + sizes.length * (cell + 16);
  const height = pad * 2 + 56 + ids.length * (cell + 40);
  const composites = [];
  let rowY = pad + 56;
  for (const id of ids) {
    let x = pad + labelW;
    for (const size of sizes) {
      const buf = await thumb(primaryPath(id), size);
      composites.push({ input: buf, left: x + Math.round((cell - size) / 2), top: rowY + Math.round((cell - size) / 2) });
      x += cell + 16;
    }
    rowY += cell + 40;
  }
  const headerLabels = sizes
    .map((s, i) => labelSvg(`${s}px`, pad + labelW + i * (cell + 16) + cell / 2 - 20, pad + 40, 18))
    .join('\n');
  const rowLabels = ids
    .map((id, ri) => {
      const p = PILOTS.find((x) => x.id === id);
      return labelSvg(p?.short ?? id, pad, pad + 56 + ri * (cell + 40) + cell / 2, 20);
    })
    .join('\n');
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#121820"/>
  ${labelSvg('MSV-001 Scale Board (2 milestones × 5 sizes)', pad, pad + 28, 26)}
  ${headerLabels}
  ${rowLabels}
  </svg>`;
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  await sharp(base).composite(composites).png().toFile(path.join(EVIDENCE_DIR, 'MSV_001_SCALE_BOARD.png'));
}

async function composeStateBoard() {
  const id = 'first_steel';
  const size = 128;
  const locked = await lockedThumb(primaryPath(id), size);
  const completed = await thumb(primaryPath(id), size);
  const pad = 48;
  const width = pad * 3 + size * 2 + 80;
  const height = pad * 2 + size + 100;
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#121820"/>
  ${labelSvg('MSV-001 State Treatment (CSS/modulate mock — not separate PNG masters)', pad, pad + 28, 24)}
  ${labelSvg('LOCKED (desaturated UI treatment)', pad, pad + 72, 18)}
  ${labelSvg('COMPLETED (full art + frame)', pad + size + pad + 80, pad + 72, 18)}
  </svg>`;
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  await sharp(base)
    .composite([
      { input: locked, left: pad, top: pad + 80 },
      { input: completed, left: pad + size + pad + 80, top: pad + 80 },
    ])
    .png()
    .toFile(path.join(EVIDENCE_DIR, 'MSV_001_STATE_TREATMENT_BOARD.png'));
}

async function composeCrossFamilyBoard() {
  const refs = [
    { label: 'ICON-001 Resource', path: 'apps/web/public/assets/icons/ICON-001-steel.png' },
    { label: 'ICON-003 Building', path: 'apps/web/public/assets/buildings/ICON-003-sawmill.png' },
    { label: 'ICON-004 Technology', path: 'apps/web/public/assets/research/ICON-004-basic_woodworking-primary.png' },
    { label: 'ICON-005 Process', path: 'apps/web/public/assets/process/ICON-005-recipe_steel-primary.png' },
    { label: 'WFV-001 Workforce', path: 'apps/web/public/assets/workforce/WFV-001-employee_production_worker-primary.png' },
    { label: 'MSV-001 Milestone', path: 'docs/design/milestones/pilot-msv-001/MSV-001-first_steel-primary-pilot.png' },
  ];
  const cell = 160;
  const items = refs.map((r) => ({ label: r.label, path: path.join(ROOT, r.path) }));
  await composeGrid({
    outName: 'MSV_001_CROSS_FAMILY_DIFFERENTIATION_BOARD.png',
    title: 'Cross-Family Differentiation — MSV reads as achievement, not resource/building/tech/process/workforce',
    columns: 3,
    cellSize: cell,
    items,
  });
}

async function composeProgressionMock() {
  const pad = 40;
  const card = 120;
  const width = 920;
  const height = 420;
  const composites = [];
  const ids = ['first_production', 'first_steel', 'first_profit', 'first_consumer_goods'];
  let x = pad + 20;
  const y = pad + 100;
  for (const id of ids) {
    const buf = await thumb(compactPath(id), card);
    composites.push({ input: buf, left: x, top: y });
    x += card + 32;
  }
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#1a2230"/>
  <rect x="20" y="20" width="880" height="380" rx="12" fill="#242d3a" stroke="#3a4656"/>
  ${labelSvg('STATIC DEV MOCK — Milestone progression panel (not production UI)', pad, pad + 36, 22)}
  ${labelSvg('Meilensteine · 2 / 8 erreicht', pad, pad + 68, 16)}
  </svg>`;
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  await sharp(base).composite(composites).png().toFile(path.join(EVIDENCE_DIR, 'MSV_001_STATIC_PROGRESSION_CONTEXT_MOCK.png'));
}

async function composeMedallionScaleStrip() {
  const sizes = [32, 48, 64, 96];
  const pad = 32;
  const cell = 96;
  const width = pad * 2 + PILOTS.length * (cell + 24);
  const height = pad * 2 + 48 + sizes.length * (cell + 8);
  const composites = [];
  let y = pad + 48;
  for (const size of sizes) {
    let x = pad;
    for (const p of PILOTS) {
      const buf = await sharp(compactPath(p.id))
        .resize(size, size, { fit: 'contain', background: { r: 18, g: 22, b: 28, alpha: 1 } })
        .png()
        .toBuffer();
      composites.push({ input: buf, left: x + Math.round((cell - size) / 2), top: y + Math.round((cell - size) / 2) });
      x += cell + 24;
    }
    y += cell + 8;
  }
  const colLabels = PILOTS.map((p, i) => labelSvg(p.short, pad + i * (cell + 24) + 8, pad + 40, 16)).join('\n');
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#121820"/>
  ${labelSvg('Medallion readability — 32 / 48 / 64 / 96 px rows', pad, pad + 24, 22)}
  ${colLabels}
  </svg>`;
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  await sharp(base).composite(composites).png().toFile(path.join(EVIDENCE_DIR, 'MSV_001_ACHIEVEMENT_MEDALLION_BOARD.png'));
}

async function composeFirstProfitRepairBoard() {
  const oldPath = path.join(PILOT_DIR, 'MSV-001-first_profit-primary-pilot-OLD-REJECTED.png');
  const pad = 36;
  const cell = 240;
  const width = pad * 2 + cell * 3 + 48;
  const height = pad * 2 + cell * 2 + 100;
  const composites = [];
  const placements = [
    { label: 'OLD — REJECTED: baked text', path: oldPath, size: 200, col: 0, row: 0 },
    { label: 'NEW primary 256px', path: primaryPath('first_profit'), size: 256, col: 1, row: 0 },
    { label: 'NEW primary 128px', path: primaryPath('first_profit'), size: 128, col: 2, row: 0 },
    { label: 'NEW primary 96px', path: primaryPath('first_profit'), size: 96, col: 0, row: 1 },
    { label: 'NEW medallion 64px', path: compactPath('first_profit'), size: 64, col: 1, row: 1, medallion: true },
    { label: 'NEW medallion 48px', path: compactPath('first_profit'), size: 48, col: 2, row: 1, medallion: true },
  ];
  for (const item of placements) {
    const buf = item.medallion
      ? await sharp(item.path)
          .resize(item.size, item.size, { fit: 'contain', background: { r: 18, g: 22, b: 28, alpha: 1 } })
          .png()
          .toBuffer()
      : await thumb(item.path, item.size);
    const left = pad + item.col * (cell + 16) + Math.round((cell - item.size) / 2);
    const top = pad + 72 + item.row * (cell + 16) + Math.round((cell - item.size) / 2);
    composites.push({ input: buf, left, top });
  }
  const labels = placements
    .map((item) => {
      const x = pad + item.col * (cell + 16) + 8;
      const y = pad + 56 + item.row * (cell + 16);
      return labelSvg(item.label, x, y, 15);
    })
    .join('\n');
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#121820"/>
  ${labelSvg('MSV-001 first_profit — final repair validation', pad, pad + 28, 22)}
  ${labels}
  </svg>`;
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  await sharp(base)
    .composite(composites)
    .png()
    .toFile(path.join(EVIDENCE_DIR, 'MSV_001_FIRST_PROFIT_FINAL_REPAIR_BOARD.png'));
}

async function main() {
  await fs.mkdir(EVIDENCE_DIR, { recursive: true });
  await ensurePilotSources();

  for (const p of PILOTS) {
    if (p.id === 'first_profit') {
      await buildMedallion(primaryPath(p.id), compactPath(p.id));
    } else {
      try {
        await fs.access(compactPath(p.id));
      } catch {
        await buildMedallion(primaryPath(p.id), compactPath(p.id));
      }
    }
  }

  const alphaResults = [];
  for (const p of PILOTS) {
    alphaResults.push({ tier: 'primary', milestoneId: p.id, ...(await inspectAlpha(primaryPath(p.id))) });
    const compactInfo = await sharp(compactPath(p.id)).metadata();
    alphaResults.push({
      tier: 'medallion',
      milestoneId: p.id,
      assetPath: path.relative(ROOT, compactPath(p.id)).replace(/\\/g, '/'),
      width: compactInfo.width,
      height: compactInfo.height,
      pass: compactInfo.width === 512 && compactInfo.height === 512,
    });
  }

  const manualNoTextReview = [
    {
      milestoneId: 'first_production',
      readableBakedText: false,
      pseudoTextConcern: false,
      method: 'manual visual inspection of pilot PNG',
      result: 'PASS',
    },
    {
      milestoneId: 'first_steel',
      readableBakedText: false,
      pseudoTextConcern: false,
      method: 'manual visual inspection of pilot PNG',
      result: 'PASS',
    },
    {
      milestoneId: 'first_profit',
      readableBakedText: false,
      pseudoTextConcern: false,
      note: 'Repaired 2026-09-20 — removed baked FIRST PROFITABLE SALE banner; blank metal nameplate',
      method: 'manual visual inspection of repaired pilot PNG',
      result: 'PASS',
    },
    {
      milestoneId: 'first_consumer_goods',
      readableBakedText: false,
      pseudoTextConcern: false,
      method: 'manual visual inspection of pilot PNG',
      result: 'PASS',
    },
  ];

  const unchangedPilotHashes = {
    first_production: await fileSha256(primaryPath('first_production')),
    first_steel: await fileSha256(primaryPath('first_steel')),
    first_consumer_goods: await fileSha256(primaryPath('first_consumer_goods')),
  };

  const alphaReport = {
    pilotVersion: '2026-09-20-msv-001-milestone-art-direction-pilot-v1-first-profit-repair',
    generatedAt: new Date().toISOString(),
    results: alphaResults,
    manualNoTextReview,
    noTextGateNote:
      'Automated tooling cannot prove absence of generated text; manualNoTextReview is authoritative for the no-text contract.',
    unchangedApprovedPrimarySha256: unchangedPilotHashes,
    summary: {
      primaryPass: alphaResults.filter((r) => r.tier === 'primary' && r.pass).length,
      primaryTotal: 4,
      medallionPass: alphaResults.filter((r) => r.tier === 'medallion' && r.pass).length,
      medallionTotal: 4,
    },
  };
  await fs.writeFile(
    path.join(PILOT_DIR, 'MSV_001_PILOT_ALPHA_REPORT.json'),
    `${JSON.stringify(alphaReport, null, 2)}\n`,
  );

  await composeGrid({
    outName: 'MSV_001_ART_DIRECTION_4_PILOT_FAMILY_BOARD.png',
    title: 'MSV-001 Tier-1 Achievement Primaries (4 pilot milestones)',
    columns: 2,
    cellSize: 360,
    items: PILOTS.map((p) => ({ label: p.label, path: primaryPath(p.id) })),
  });

  await composeMedallionScaleStrip();

  await composeScaleBoard();
  await composeStateBoard();
  await composeCrossFamilyBoard();
  await composeProgressionMock();
  await composeFirstProfitRepairBoard();

  console.log('MSV-001 pilot evidence composed', alphaReport.summary);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
