/* global document, HTMLImageElement, console */
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.basename(scriptDir) === 'capture-evidence-tmp'
  ? path.resolve(scriptDir, '..', '..')
  : path.resolve(scriptDir, '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');
const savePath = 'D:/Cursor/Project Genesis/saves/e2e-m11-phase6-production-closeout.json';

async function loadSession(page) {
  const response = await page.request.post('http://localhost:3000/api/session/load', {
    data: { filePath: savePath },
  });
  if (!response.ok()) {
    throw new Error(`Load failed: ${response.status()} ${await response.text()}`);
  }
}

async function capture(viewport, fileName) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  await loadSession(page);
  await page.goto('http://localhost:3000/game?screen=buildings', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Baukatalog' }).waitFor({ timeout: 60_000 });
  await page.getByRole('heading', { name: 'Baukatalog' }).scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const images = [...document.querySelectorAll('img[src*="ICON-003"]')];
    return images.length >= 6 && images.every((img) => img.complete && img.naturalWidth > 0);
  });
  await page.screenshot({
    path: path.join(evidenceDir, fileName),
    fullPage: true,
  });
  await browser.close();
}

async function captureMixed(viewport, fileName) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  await loadSession(page);
  await page.goto('http://localhost:3000/game?screen=buildings', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Baukatalog' }).waitFor({ timeout: 60_000 });
  const montage = page.getByText('Montagehalle', { exact: true }).first();
  const coal = page.getByText('Kohlekraftwerk', { exact: true }).first();
  await montage.scrollIntoViewIfNeeded();
  await coal.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const coal = document.querySelector('img[src*="ICON-003-coal_power_plant"]');
    return coal instanceof HTMLImageElement && coal.complete && coal.naturalWidth > 0;
  });
  await page.screenshot({
    path: path.join(evidenceDir, fileName),
    fullPage: false,
  });
  await browser.close();
}

await capture({ width: 1280, height: 900 }, 'BUILDING_BATCH_1_CATALOG_DESKTOP.png');
await captureMixed({ width: 1280, height: 900 }, 'BUILDING_BATCH_1_CATALOG_MIXED_FALLBACK.png');
await capture({ width: 480, height: 900 }, 'BUILDING_BATCH_1_CATALOG_NARROW.png');

console.log('Captured runtime evidence to', evidenceDir);
