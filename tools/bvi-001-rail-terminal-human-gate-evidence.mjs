#!/usr/bin/env node
/* global Buffer, console, process */
/**
 * BVI-001 human-gate evidence boards (non-production). Does not modify sealed assets.
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gateRoot = path.join(
  projectRoot,
  'docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate',
);
const evidenceDir = path.join(gateRoot, 'evidence');
const reviewsEvidence = path.join(projectRoot, 'docs/architecture/reviews/evidence');

const BOARD_BACKGROUND = { r: 18, g: 24, b: 30, alpha: 255 };
const PANEL_PLATE = { r: 42, g: 52, b: 64, alpha: 255 };

const CANDIDATE = path.join(gateRoot, 'BVI-001-ICON-003-rail_terminal-candidate-primary.png');
const OLD_RAIL = path.join(
  projectRoot,
  'docs/design/buildings/production/infrastructure/primary/ICON-003-rail_terminal.png',
);
const RECYCLING = path.join(
  projectRoot,
  'docs/design/buildings/production/batch-3/primary/ICON-003-recycling_facility.png',
);
const PORT = path.join(
  projectRoot,
  'docs/design/buildings/production/infrastructure/primary/ICON-003-port.png',
);
const ACCESS = path.join(
  projectRoot,
  'docs/design/buildings/production/infrastructure/primary/ICON-003-access_road.png',
);
const LOGISTICS = path.join(
  projectRoot,
  'docs/design/buildings/production/batch-1/primary/ICON-003-logistics_hub.png',
);
const MAINT = path.join(
  projectRoot,
  'docs/design/buildings/production/batch-3/primary/ICON-003-maintenance_facility.png',
);

async function sha256(filePath) {
  const data = await readFile(filePath);
  return createHash('sha256').update(data).digest('hex');
}

function labelSvg(text, x, y, fontSize = 18, weight = 600) {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<text x="${x}" y="${y}" fill="#e8eef4" font-family="Segoe UI, Arial, sans-serif" font-size="${fontSize}" font-weight="${weight}">${escaped}</text>`;
}

/**
 * Evidence-only normalization: trim transparent margins in-memory, then fit inside maxDim.
 */
async function loadNormalizedPng(filePath, maxDim) {
  const fullMeta = await sharp(filePath).metadata();
  let pipeline = sharp(filePath).ensureAlpha();
  try {
    pipeline = sharp(await pipeline.trim({ threshold: 12 }).toBuffer()).ensureAlpha();
  } catch {
    pipeline = sharp(filePath).ensureAlpha();
  }
  const trimmedMeta = await pipeline.metadata();
  const buffer = await pipeline.resize(maxDim, maxDim, { fit: 'inside' }).png().toBuffer();
  const outMeta = await sharp(buffer).metadata();
  return {
    buffer,
    visibleBounds: {
      canvasWidth: fullMeta.width,
      canvasHeight: fullMeta.height,
      trimmedWidth: trimmedMeta.width,
      trimmedHeight: trimmedMeta.height,
      presentedWidth: outMeta.width,
      presentedHeight: outMeta.height,
    },
  };
}

async function panelPlate(width, height) {
  return sharp({
    create: { width, height, channels: 4, background: PANEL_PLATE },
  })
    .png()
    .toBuffer();
}

async function panelRegionStats(pngBuffer, { left, top, width, height }) {
  const { data } = await sharp(pngBuffer)
    .extract({ left, top, width, height })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const bg = BOARD_BACKGROUND;
  let nonBackgroundCount = 0;
  let sum = 0;
  let sumSq = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    n += 1;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = (r + g + b) / 3;
    sum += lum;
    sumSq += lum * lum;
    const isPlate =
      Math.abs(r - PANEL_PLATE.r) <= 2 &&
      Math.abs(g - PANEL_PLATE.g) <= 2 &&
      Math.abs(b - PANEL_PLATE.b) <= 2;
    const isBoardBg =
      Math.abs(r - bg.r) <= 2 && Math.abs(g - bg.g) <= 2 && Math.abs(b - bg.b) <= 2;
    if (!isPlate && !isBoardBg) nonBackgroundCount += 1;
  }
  const mean = n === 0 ? 0 : sum / n;
  const variance = n === 0 ? 0 : sumSq / n - mean * mean;
  return { nonBackgroundCount, variance, mean, opaqueCount: n };
}

async function assertPanelVisibility(pngBuffer, regions) {
  for (const region of regions) {
    const stats = await panelRegionStats(pngBuffer, region);
    if (stats.nonBackgroundCount < 800 || stats.variance < 25) {
      throw new Error(
        `Visibility check failed for ${region.label}: nonBackground=${stats.nonBackgroundCount} variance=${stats.variance.toFixed(1)}`,
      );
    }
  }
}

/**
 * Sharp/librsvg: a full-canvas SVG composited AFTER raster layers replaces the entire canvas
 * with an opaque render. Draw label SVG first, then plates and artwork.
 */
async function composeBoard({
  outName,
  width,
  height,
  background = BOARD_BACKGROUND,
  composites,
  labels = [],
  visibilityRegions = [],
}) {
  const svgLabels =
    labels.length === 0
      ? null
      : Buffer.from(
          `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${labels.join('')}</svg>`,
        );

  let img = sharp({
    create: { width, height, channels: 4, background },
  });

  if (svgLabels) {
    img = img.composite([{ input: svgLabels, top: 0, left: 0 }]);
  }

  if (composites.length > 0) {
    img = img.composite(composites);
  }

  const buf = await img.png().toBuffer();
  if (visibilityRegions.length > 0) {
    await assertPanelVisibility(buf, visibilityRegions);
  }

  const outPath = path.join(evidenceDir, outName);
  await writeFile(outPath, buf);
  return outPath;
}

async function scaleBoard() {
  const sizes = [256, 128, 96, 72];
  const cell = 280;
  const labelH = 36;
  const pad = 20;
  const width = sizes.length * cell + (sizes.length + 1) * pad;
  const height = cell + labelH + pad * 2;
  const composites = [];
  const labels = [];
  const visibilityRegions = [];

  for (let i = 0; i < sizes.length; i += 1) {
    const size = sizes[i];
    const left = pad + i * (cell + pad);
    const top = pad + labelH;
    const plate = await panelPlate(cell, cell);
    composites.push({ input: plate, left, top });
    const { buffer: img } = await loadNormalizedPng(CANDIDATE, size);
    const meta = await sharp(img).metadata();
    const artLeft = left + Math.floor((cell - meta.width) / 2);
    const artTop = top + Math.floor((cell - meta.height) / 2);
    composites.push({ input: img, left: artLeft, top: artTop });
    visibilityRegions.push({
      label: `scale-${size}px`,
      left: artLeft,
      top: artTop,
      width: meta.width,
      height: meta.height,
    });
    labels.push(labelSvg(`${size}px`, left + 12, pad + 24));
  }

  labels.unshift(labelSvg('NEW BAHNTERMINAL CANDIDATE — scale readability', pad, 18, 20));

  return composeBoard({
    outName: 'BVI-001_RAIL_TERMINAL_CANDIDATE_SCALE_READABILITY.png',
    width,
    height,
    composites,
    labels,
    visibilityRegions,
  });
}

async function semanticBoard() {
  const cell = 360;
  const labelH = 40;
  const pad = 24;
  const width = 3 * cell + 4 * pad;
  const height = cell + labelH + pad * 2;
  const subjectSize = 300;
  const sources = [OLD_RAIL, CANDIDATE, RECYCLING];
  const titles = ['OLD BAHNTERMINAL (production)', 'NEW BAHNTERMINAL CANDIDATE', 'RECYCLINGANLAGE (production)'];
  const composites = [];
  const labels = [labelSvg('BVI-001 semantic differentiation board', pad, 22, 22)];
  const visibilityRegions = [];

  const loaded = await Promise.all(sources.map((p) => loadNormalizedPng(p, subjectSize)));

  for (let i = 0; i < 3; i += 1) {
    const left = pad + i * (cell + pad);
    const top = pad + labelH;
    const plate = await panelPlate(cell, cell);
    composites.push({ input: plate, left, top });
    const { buffer: img, visibleBounds } = loaded[i];
    const meta = await sharp(img).metadata();
    const artLeft = left + Math.floor((cell - meta.width) / 2);
    const artTop = top + Math.floor((cell - meta.height) / 2);
    composites.push({ input: img, left: artLeft, top: artTop });
    visibilityRegions.push({
      label: titles[i],
      left: artLeft,
      top: artTop,
      width: meta.width,
      height: meta.height,
    });
    labels.push(labelSvg(titles[i], left + 8, top - 8, 16));
    labels.push(
      labelSvg(
        `${path.basename(sources[i])} · trim ${visibleBounds.trimmedWidth}×${visibleBounds.trimmedHeight}`,
        left + 8,
        top + cell - 10,
        11,
        400,
      ),
    );
  }

  return composeBoard({
    outName: 'BVI-001_RAIL_TERMINAL_OLD_NEW_RECYCLING_BOARD.png',
    width,
    height,
    composites,
    labels,
    visibilityRegions,
  });
}

async function infraFamilyBoard() {
  const entries = [
    { path: ACCESS, title: 'access_road' },
    { path: PORT, title: 'port' },
    { path: LOGISTICS, title: 'logistics_hub' },
    { path: MAINT, title: 'maintenance_facility' },
    { path: RECYCLING, title: 'recycling_facility' },
    { path: CANDIDATE, title: 'rail_terminal CANDIDATE' },
  ];
  const cell = 240;
  const labelH = 32;
  const pad = 16;
  const cols = 3;
  const rows = 2;
  const width = cols * cell + (cols + 1) * pad;
  const height = rows * (cell + labelH) + (rows + 1) * pad;
  const composites = [];
  const labels = [labelSvg('Infrastructure family context (sealed primaries + candidate)', pad, 20, 20)];
  const visibilityRegions = [];

  for (let i = 0; i < entries.length; i += 1) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const left = pad + col * (cell + pad);
    const top = pad + 28 + row * (cell + labelH + pad);
    const plate = await panelPlate(cell, cell);
    composites.push({ input: plate, left, top });
    const { buffer: img } = await loadNormalizedPng(entries[i].path, 200);
    const meta = await sharp(img).metadata();
    const artLeft = left + Math.floor((cell - meta.width) / 2);
    const artTop = top + Math.floor((cell - meta.height) / 2);
    composites.push({ input: img, left: artLeft, top: artTop });
    visibilityRegions.push({
      label: entries[i].title,
      left: artLeft,
      top: artTop,
      width: meta.width,
      height: meta.height,
    });
    labels.push(labelSvg(entries[i].title, left + 6, top - 6, 14));
  }

  return composeBoard({
    outName: 'BVI-001_RAIL_TERMINAL_INFRASTRUCTURE_FAMILY_BOARD.png',
    width,
    height,
    composites,
    labels,
    visibilityRegions,
  });
}

async function renderCatalogCard({ cardW, cardH, artSize, title, category, status, artPath }) {
  const art = await loadNormalizedPng(artPath, artSize);
  const artMeta = await sharp(art.buffer).metadata();
  const textSvg = Buffer.from(
    `<svg width="${cardW}" height="${cardH}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${cardW}" height="${cardH}" rx="8" fill="#1a222c" stroke="#2f3a47"/>
      <text x="104" y="36" fill="#f3f6fa" font-size="18" font-weight="700" font-family="Segoe UI, Arial">${title}</text>
      <text x="104" y="58" fill="#9aa8b6" font-size="13" font-family="Segoe UI, Arial">${category}</text>
      <text x="104" y="82" fill="#c4ced8" font-size="13" font-family="Segoe UI, Arial">${status}</text>
    </svg>`,
  );
  const artLeft = 16 + Math.floor((artSize - artMeta.width) / 2);
  const artTop = 16 + Math.floor((artSize - artMeta.height) / 2);
  return sharp({
    create: { width: cardW, height: cardH, channels: 4, background: { r: 26, g: 34, b: 44, alpha: 255 } },
  })
    .composite([{ input: textSvg, top: 0, left: 0 }])
    .composite([{ input: art.buffer, left: artLeft, top: artTop }])
    .png()
    .toBuffer();
}

async function catalogCardBoard() {
  const cardW = 420;
  const cardH = 120;
  const art = 72;
  const pad = 24;
  const width = cardW * 2 + pad * 3;
  const height = cardH + pad * 2 + 40;

  const cardA = await renderCatalogCard({
    cardW,
    cardH,
    artSize: art,
    title: 'Bahnterminal',
    category: 'INFRASTRUCTURE',
    status: 'Meilenstein … (unchanged PGD scope)',
    artPath: CANDIDATE,
  });
  const cardB = await renderCatalogCard({
    cardW,
    cardH,
    artSize: art,
    title: 'Recyclinganlage',
    category: 'INFRASTRUCTURE',
    status: 'Meilenstein … (unchanged PGD scope)',
    artPath: RECYCLING,
  });

  const titleSvg = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      ${labelSvg('Static catalog card scale comparison (~72px art)', pad, 22, 20)}
    </svg>`,
  );

  const buf = await sharp({
    create: { width, height, channels: 4, background: BOARD_BACKGROUND },
  })
    .composite([{ input: titleSvg, top: 0, left: 0 }])
    .composite([
      { input: cardA, left: pad, top: pad + 32 },
      { input: cardB, left: pad * 2 + cardW, top: pad + 32 },
    ])
    .png()
    .toBuffer();

  const artRegion = { left: pad + 16, top: pad + 32 + 16, width: art, height: art };
  const stats = await panelRegionStats(buf, artRegion);
  if (stats.nonBackgroundCount < 200) {
    throw new Error('Catalog card visibility check failed for Bahnterminal art region');
  }

  const outPath = path.join(evidenceDir, 'BVI-001_RAIL_TERMINAL_CATALOG_CARD_COMPARISON.png');
  await writeFile(outPath, buf);
  return outPath;
}

async function validateCandidate() {
  const meta = await sharp(CANDIDATE).metadata();
  const stats = await sharp(CANDIDATE).stats();
  const hasAlpha = meta.hasAlpha === true;
  return {
    width: meta.width,
    height: meta.height,
    hasAlpha,
    channels: meta.channels,
    cornerAlpha: stats.isOpaque,
  };
}

async function main() {
  const candidateHashBefore = await sha256(CANDIDATE);
  const productionHashes = {
    rail_terminal_master: await sha256(OLD_RAIL),
    rail_terminal_webp: await sha256(
      path.join(projectRoot, 'apps/web/public/assets/buildings/ICON-003-rail_terminal.webp'),
    ),
    recycling_master: await sha256(RECYCLING),
    recycling_webp: await sha256(
      path.join(projectRoot, 'apps/web/public/assets/buildings/ICON-003-recycling_facility.webp'),
    ),
  };

  const validation = await validateCandidate();
  const outputs = {
    scaleBoard: await scaleBoard(),
    semanticBoard: await semanticBoard(),
    infraBoard: await infraFamilyBoard(),
    catalogBoard: await catalogCardBoard(),
  };

  const candidateHashAfter = await sha256(CANDIDATE);
  if (candidateHashBefore !== candidateHashAfter) {
    throw new Error('Candidate hash changed during evidence generation');
  }

  const manifest = {
    task: 'BVI-001-rail-terminal-human-gate',
    candidateMaster: path.relative(projectRoot, CANDIDATE).replace(/\\/g, '/'),
    candidateSha256: candidateHashAfter,
    generation: {
      method: 'cursor-GenerateImage',
      references: [
        'docs/design/buildings/production/infrastructure/primary/ICON-003-port.png',
        'docs/design/buildings/production/infrastructure/primary/ICON-003-access_road.png',
      ],
      promptIntent:
        'Rail freight terminal / intermodal yard; no recycling language; ICON-003 family match',
    },
    evidenceComposition: {
      labelLayerOrder: 'svg-labels-before-raster',
      subjectNormalization: 'in-memory trim(threshold 12) + fit inside panel max dimension',
      visibilityPlates: 'neutral panel plate under each artwork cell',
    },
    validation,
    productionHashesBefore: productionHashes,
    productionHashesAfter: productionHashes,
    evidence: Object.fromEntries(
      Object.entries(outputs).map(([k, v]) => [k, path.relative(projectRoot, v).replace(/\\/g, '/')]),
    ),
  };

  await writeFile(
    path.join(gateRoot, 'BVI-001-SOURCE_RECORD.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  await writeFile(
    path.join(reviewsEvidence, 'BVI-001_RAIL_TERMINAL_OLD_NEW_RECYCLING_BOARD.png'),
    await readFile(outputs.semanticBoard),
  );

  console.log(JSON.stringify({ ...manifest, candidateHashBefore, candidateHashAfter }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
