/**
 * Promotes WFV Batch-1 primaries to design + public runtime paths and runs alpha repair.
 */
/* global console, process, Buffer */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('D:/Cursor/Project Genesis');
const PILOT = path.join(ROOT, 'docs/design/workforce/pilot-wfv-001');
const DESIGN = path.join(ROOT, 'docs/design/workforce/icon-wfv-001/primary');
const PUBLIC = path.join(ROOT, 'apps/web/public/assets/workforce');
const CURSOR_ASSETS = path.resolve('C:/Users/Besitzer/.cursor/projects/d-Cursor-Project-Genesis/assets');

const BATCH = [
  {
    id: 'employee_production_worker',
    source: path.join(PILOT, 'WFV-001-employee_production_worker-direction-c-hybrid.png'),
  },
  {
    id: 'employee_senior_engineer',
    source: path.join(PILOT, 'WFV-001-employee_senior_engineer-direction-c-hybrid.png'),
  },
  {
    id: 'employee_executive_director',
    source: path.join(CURSOR_ASSETS, 'WFV-001-employee_executive_director-primary-gen.png'),
  },
  {
    id: 'employee_maintenance_technician',
    source: path.join(CURSOR_ASSETS, 'WFV-001-employee_maintenance_technician-primary-gen.png'),
  },
  {
    id: 'employee_senior_researcher',
    source: path.join(CURSOR_ASSETS, 'WFV-001-employee_senior_researcher-primary-gen.png'),
  },
  {
    id: 'employee_logistics_coordinator',
    source: path.join(CURSOR_ASSETS, 'WFV-001-employee_logistics_coordinator-primary-gen.png'),
  },
  {
    id: 'employee_financial_analyst',
    source: path.join(CURSOR_ASSETS, 'WFV-001-employee_financial_analyst-primary-gen.png'),
  },
  {
    id: 'employee_operations_supervisor',
    source: path.join(CURSOR_ASSETS, 'WFV-001-employee_operations_supervisor-primary-gen.png'),
  },
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
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    if (r <= threshold && g <= threshold && b <= threshold) {
      out[i + 3] = 0;
    }
  }
  const tmp = `${filePath}.tmp.png`;
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(tmp);
  await fs.rename(tmp, filePath);
}

async function keyCheckerBorder(filePath) {
  const keyColors = [];
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
  const neutrals = samples.filter(isNeutral);
  const buckets = new Map();
  for (const c of neutrals) {
    const key = `${Math.round(c[0] / 16) * 16},${Math.round(c[1] / 16) * 16},${Math.round(c[2] / 16) * 16}`;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  const sorted = [...buckets.entries()].sort((a, b) => b[1] - a[1]);
  for (const [k] of sorted.slice(0, 2)) {
    keyColors.push(k.split(',').map(Number));
  }
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
  await sharp(dest).resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${dest}.tmp.png`);
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
  return { assetPath: filePath, width: info.width, height: info.height, channels: info.channels, transparentPercent, checkerboardSuspect, pass };
}

async function main() {
  await fs.mkdir(DESIGN, { recursive: true });
  await fs.mkdir(PUBLIC, { recursive: true });
  const alpha = [];

  for (const { id, source } of BATCH) {
    const fileName = `WFV-001-${id}-primary.png`;
    const designPath = path.join(DESIGN, fileName);
    const publicPath = path.join(PUBLIC, fileName);
    await normalizeMaster(source, designPath);
    await fs.copyFile(designPath, publicPath);
    alpha.push(await inspectAlpha(designPath));
  }

  await fs.writeFile(
    path.join(ROOT, 'docs/design/workforce/icon-wfv-001/WFV_001_BATCH_1_ALPHA_REPORT.json'),
    `${JSON.stringify(alpha, null, 2)}\n`,
  );

  const failed = alpha.filter((a) => !a.pass);
  if (failed.length) {
    console.warn('Alpha failures:', failed);
    process.exitCode = 1;
  } else {
    console.log('WFV Batch-1: 8/8 alpha PASS');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
