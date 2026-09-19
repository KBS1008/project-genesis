/* global document, HTMLImageElement, console, process, fetch */
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';

async function loadChromium() {
  try {
    const playwright = await import('playwright');
    return playwright.chromium;
  } catch {
    const localPlaywright = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      'capture-evidence-tmp/node_modules/playwright/index.mjs',
    );
    const playwright = await import(pathToFileURL(localPlaywright).href);
    return playwright.chromium;
  }
}

const chromium = await loadChromium();

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.basename(scriptDir) === 'capture-evidence-tmp'
  ? path.resolve(scriptDir, '..', '..')
  : path.resolve(scriptDir, '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');
const savePath = 'D:/Cursor/Project Genesis/saves/e2e-m11-phase6-production-closeout.json';
const webOrigin = process.env.PG_WEB_ORIGIN ?? 'http://localhost:3010';

async function loadSession(page) {
  const loadResponse = await page.request.post(`${webOrigin}/api/session/load`, {
    data: { filePath: savePath },
  });
  if (loadResponse.ok()) {
    return;
  }

  const newResponse = await page.request.post(`${webOrigin}/api/session/new`, {
    data: { name: 'Batch 2 Runtime Evidence' },
  });
  if (!newResponse.ok()) {
    throw new Error(
      `Session bootstrap failed: load ${loadResponse.status()} new ${newResponse.status()} ${await newResponse.text()}`,
    );
  }
}

async function ensureBuildingsCatalog(page) {
  await page.goto(`${webOrigin}/game?screen=buildings`, { waitUntil: 'domcontentloaded' });
  const heading = page.getByRole('heading', { name: 'Baukatalog' });
  try {
    await heading.waitFor({ timeout: 15_000 });
    return;
  } catch {
    await page.evaluate(async (filePath) => {
      await fetch('/api/session/load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      });
    }, savePath);
    await page.goto(`${webOrigin}/game?screen=buildings`, { waitUntil: 'networkidle' });
    try {
      await heading.waitFor({ timeout: 60_000 });
    } catch (error) {
      const debugPath = path.join(evidenceDir, 'BUILDING_BATCH_2_CAPTURE_DEBUG.png');
      await page.screenshot({ path: debugPath, fullPage: true });
      const snippet = (await page.locator('body').innerText()).slice(0, 500);
      throw new Error(`${error instanceof Error ? error.message : error}\nBody snippet: ${snippet}\nDebug: ${debugPath}`);
    }
  }
}

async function capture(viewport, fileName, minIcon003 = 10) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  await loadSession(page);
  await ensureBuildingsCatalog(page);
  await page.getByRole('heading', { name: 'Baukatalog' }).scrollIntoViewIfNeeded();
  await page.waitForFunction(
    (min) => {
      const images = [...document.querySelectorAll('img[src*="ICON-003"]')];
      return images.length >= min && images.every((img) => img.complete && img.naturalWidth > 0);
    },
    minIcon003,
  );
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
  await ensureBuildingsCatalog(page);
  const montage = page.getByText('Montagehalle', { exact: true }).first();
  const port = page.getByText('Hafenanlage', { exact: true }).first();
  await montage.scrollIntoViewIfNeeded();
  await port.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const montageImg = document.querySelector('img[src*="ICON-003-assembly_plant"]');
    return montageImg instanceof HTMLImageElement && montageImg.complete && montageImg.naturalWidth > 0;
  });
  await page.screenshot({
    path: path.join(evidenceDir, fileName),
    fullPage: false,
  });
  await browser.close();
}

await capture({ width: 1280, height: 900 }, 'BUILDING_BATCH_2_CATALOG_DESKTOP.png', 10);
await captureMixed({ width: 1280, height: 900 }, 'BUILDING_BATCH_2_CATALOG_MIXED_FALLBACK.png');
await capture({ width: 480, height: 900 }, 'BUILDING_BATCH_2_CATALOG_NARROW.png', 8);

console.log('Captured batch-2 runtime evidence to', evidenceDir);
