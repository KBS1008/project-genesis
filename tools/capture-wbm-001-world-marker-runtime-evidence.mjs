/* global document, console, process */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

async function loadChromium() {
  const localPlaywright = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    'capture-evidence-tmp/node_modules/playwright/index.mjs',
  );
  const playwright = await import(pathToFileURL(localPlaywright).href);
  return playwright.chromium;
}

const chromium = await loadChromium();

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');
const savePath = 'D:/Cursor/Project Genesis/saves/e2e-m11-phase6-production-closeout.json';
const webOrigin = process.env.PG_WEB_ORIGIN ?? 'http://localhost:3000';
const beforeDesktopPath = path.join(evidenceDir, 'WBM_001_RUNTIME_DESKTOP_BEFORE_REPAIR.png');

const REPRESENTATIVE_TYPES = Object.freeze([
  'sawmill',
  'warehouse',
  'power_substation',
  'access_road',
  'headquarters',
]);

async function loadSession(page) {
  const loadResponse = await page.request.post(`${webOrigin}/api/session/load`, {
    data: { filePath: savePath },
  });
  if (loadResponse.ok()) {
    return;
  }

  throw new Error(`Session load failed: ${loadResponse.status()}`);
}

async function openWorld(page, entityQuery = '') {
  const url = `${webOrigin}/game?screen=world${entityQuery}`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  try {
    await page.waitForSelector('.pg-world-canvas', { timeout: 20_000 });
  } catch {
    await loadSession(page);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('.pg-world-canvas', { timeout: 90_000 });
  }
}

async function fitWorldMap(page) {
  const fitButton = page.getByRole('button', { name: 'Welt einpassen' });
  if (await fitButton.isVisible()) {
    await fitButton.click();
    await page.waitForTimeout(350);
  }
}

async function waitForCompactMarkers(page) {
  await page.waitForFunction(
    ({ types }) => {
      const markers = [...document.querySelectorAll('[data-building-type-id]')];
      if (markers.length < 3) {
        return false;
      }

      const images = [...document.querySelectorAll('image.pg-world-building-marker-glyph')];
      if (images.length < 3) {
        return false;
      }

      const presentTypes = new Set(markers.map((node) => node.getAttribute('data-building-type-id')));
      return types.every((type) => presentTypes.has(type));
    },
    { types: REPRESENTATIVE_TYPES },
    { timeout: 120_000 },
  );

  await page.waitForTimeout(300);
}

async function captureMapViewport(page, fileName) {
  await fitWorldMap(page);
  await page.locator('.pg-world-viewport').screenshot({
    path: path.join(evidenceDir, fileName),
  });
}

async function captureViewport(viewport, captures) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  await loadSession(page);

  for (const capture of captures) {
    await openWorld(page, capture.entityQuery ?? '');
    await waitForCompactMarkers(page);
    await captureMapViewport(page, capture.fileName);
  }

  await browser.close();
}

const desktopPath = path.join(evidenceDir, 'WBM_001_RUNTIME_DESKTOP.png');
const groundingBeforePath = path.join(evidenceDir, 'WBM_001_GROUNDING_BEFORE_WHITE_PLATE.png');
const groundingComparisonPath = path.join(
  evidenceDir,
  'WBM_001_FINAL_GROUNDING_BEFORE_AFTER.png',
);

if (fs.existsSync(desktopPath) && !fs.existsSync(groundingBeforePath)) {
  fs.copyFileSync(desktopPath, groundingBeforePath);
}

await captureViewport(
  { width: 1440, height: 900 },
  [
    { fileName: 'WBM_001_RUNTIME_DESKTOP.png' },
    {
      fileName: 'WBM_001_RUNTIME_DESKTOP_SELECTED.png',
      entityQuery: '&entity=building:building_005',
    },
    { fileName: 'WBM_001_RUNTIME_DENSE.png' },
  ],
);

await captureViewport({ width: 480, height: 900 }, [
  { fileName: 'WBM_001_RUNTIME_NARROW.png' },
]);

const beforePath = fs.existsSync(beforeDesktopPath)
  ? beforeDesktopPath
  : desktopPath;
const afterPath = path.join(evidenceDir, 'WBM_001_RUNTIME_DESKTOP.png');
const comparisonPath = path.join(evidenceDir, 'WBM_001_REPAIR_BEFORE_AFTER.png');

if (fs.existsSync(groundingBeforePath) && fs.existsSync(afterPath)) {
  const beforeMeta = await sharp(groundingBeforePath).resize({ width: 700 }).toBuffer({ resolveWithObject: true });
  const afterMeta = await sharp(afterPath).resize({ width: 700 }).toBuffer({ resolveWithObject: true });
  const height = Math.max(beforeMeta.info.height, afterMeta.info.height);

  await sharp({
    create: {
      width: 1420,
      height,
      channels: 3,
      background: '#111827',
    },
  })
    .composite([
      { input: beforeMeta.data, left: 0, top: 0 },
      { input: afterMeta.data, left: 720, top: 0 },
    ])
    .png()
    .toFile(groundingComparisonPath);
}

if (fs.existsSync(beforePath) && fs.existsSync(afterPath) && beforePath !== afterPath) {
  const beforeMeta = await sharp(beforePath).resize({ width: 700 }).toBuffer({ resolveWithObject: true });
  const afterMeta = await sharp(afterPath).resize({ width: 700 }).toBuffer({ resolveWithObject: true });
  const height = Math.max(beforeMeta.info.height, afterMeta.info.height);

  await sharp({
    create: {
      width: 1420,
      height,
      channels: 3,
      background: '#111827',
    },
  })
    .composite([
      { input: beforeMeta.data, left: 0, top: 0 },
      { input: afterMeta.data, left: 720, top: 0 },
    ])
    .png()
    .toFile(comparisonPath);
}

console.log('WBM-001 repair runtime evidence captured.');
