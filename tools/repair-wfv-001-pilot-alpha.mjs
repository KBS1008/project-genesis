/* global console, process, Buffer */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PILOT_DIR = path.resolve('D:/Cursor/Project Genesis/docs/design/workforce/pilot-wfv-001');

function colorDist(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
}

function isNeutral(rgb) {
  return Math.abs(rgb[0] - rgb[1]) < 10 && Math.abs(rgb[1] - rgb[2]) < 10;
}

async function sampleBorderColors(filePath) {
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  const samples = [];
  const w = info.width;
  const h = info.height;
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
  const keys = sorted.slice(0, 2).map(([k]) => k.split(',').map(Number));
  return keys;
}

async function keyNearBlack(filePath, threshold = 24) {
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
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
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(tmp);
  await fs.rename(tmp, filePath);
}

async function repairFile(filePath) {
  const keyColors = await sampleBorderColors(filePath);
  if (keyColors.length === 0) return;
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
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
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(tmp);
  await fs.rename(tmp, filePath);
}

async function main() {
  const files = (await fs.readdir(PILOT_DIR)).filter((f) => f.startsWith('WFV-001') && f.endsWith('.png'));
  for (const f of files) {
    const full = path.join(PILOT_DIR, f);
    await keyNearBlack(full);
    await repairFile(full);
    await fs.copyFile(full, path.join('D:/Cursor/Project Genesis/assets', f));
  }
  console.log('Repaired alpha on', files.length, 'pilot PNGs');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
