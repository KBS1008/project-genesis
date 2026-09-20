/**
 * Sync WFV 8→19 completion primaries from generated masters.
 */
/* global console, process, Buffer */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('D:/Cursor/Project Genesis');
const DESIGN = path.join(ROOT, 'docs/design/workforce/icon-wfv-001/primary');
const PUBLIC = path.join(ROOT, 'apps/web/public/assets/workforce');
const CURSOR_ASSETS = path.resolve('C:/Users/Besitzer/.cursor/projects/d-Cursor-Project-Genesis/assets');

const COMPLETION = [
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

function colorDist(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
}

function isNeutral(rgb) {
  return Math.abs(rgb[0] - rgb[1]) < 10 && Math.abs(rgb[1] - rgb[2]) < 10;
}

async function keyNearBlack(filePath, threshold = 28) {
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    if (out[i] <= threshold && out[i + 1] <= threshold && out[i + 2] <= threshold) {
      out[i + 3] = 0;
    }
  }
  const tmp = `${filePath}.tmp.png`;
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(tmp);
  await fs.rename(tmp, filePath);
}

async function keyCheckerBorder(filePath) {
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const samples = [];
  const push = (x, y) => {
    const i = (y * w + x) * 4;
    samples.push([data[i], data[i + 1], data[i + 2]]);
  };
  for (let x = 0; x < w; x += 8) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y += 8) {
    push(0, y);
    push(w - 1, y);
  }
  const buckets = new Map();
  for (const c of samples.filter(isNeutral)) {
    const key = `${Math.round(c[0] / 16) * 16},${Math.round(c[1] / 16) * 16},${Math.round(c[2] / 16) * 16}`;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  const keyColors = [...buckets.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k]) => k.split(',').map(Number));
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    const px = [out[i], out[i + 1], out[i + 2]];
    if (!isNeutral(px)) continue;
    for (const key of keyColors) {
      if (colorDist(px, key) <= 28) {
        out[i + 3] = 0;
        break;
      }
    }
  }
  const tmp = `${filePath}.tmp.png`;
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(tmp);
  await fs.rename(tmp, filePath);
}

async function normalizeMaster(src, dest) {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
  await sharp(dest)
    .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(`${dest}.tmp.png`);
  await fs.rename(`${dest}.tmp.png`, dest);
  await keyNearBlack(dest);
  await keyCheckerBorder(dest);
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
    transparentPercent > 8 &&
    !checkerboardSuspect;
  return { assetPath: filePath, pass, transparentPercent, checkerboardSuspect };
}

async function main() {
  const alpha = [];
  for (const id of COMPLETION) {
    const src = path.join(CURSOR_ASSETS, `WFV-001-${id}-primary-gen.png`);
    const fileName = `WFV-001-${id}-primary.png`;
    const designPath = path.join(DESIGN, fileName);
    const publicPath = path.join(PUBLIC, fileName);
    await normalizeMaster(src, designPath);
    await fs.copyFile(designPath, publicPath);
    alpha.push(await inspectAlpha(designPath));
  }
  await fs.writeFile(
    path.join(ROOT, 'docs/design/workforce/icon-wfv-001/WFV_001_COMPLETION_ALPHA_REPORT.json'),
    `${JSON.stringify(alpha, null, 2)}\n`,
  );
  const failed = alpha.filter((a) => !a.pass);
  if (failed.length) {
    console.warn('Completion alpha failures:', failed);
    process.exitCode = 1;
  } else {
    console.log('WFV completion: 11/11 alpha PASS');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
