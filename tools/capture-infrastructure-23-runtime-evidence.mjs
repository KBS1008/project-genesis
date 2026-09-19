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
const webOrigin = process.env.PG_WEB_ORIGIN ?? 'http://localhost:3012';

async function loadSession(page) {
  const loadResponse = await page.request.post(`${webOrigin}/api/session/load`, {
    data: { filePath: savePath },
  });
  if (loadResponse.ok()) {
    return;
  }

  const newResponse = await page.request.post(`${webOrigin}/api/session/new`, {
    data: { name: 'Infrastructure 23/23 Runtime Evidence' },
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
    await heading.waitFor({ timeout: 60_000 });
  }
}

async function waitForIcon003Catalog(page, minCount) {
  await page.waitForFunction(
    (min) => {
      const images = [...document.querySelectorAll('img[src*="ICON-003"]')];
      return images.length >= min && images.every((img) => img.complete && img.naturalWidth > 0);
    },
    minCount,
    { timeout: 120_000 },
  );
}

async function capture(viewport, fileName, minIcon003 = 23) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  await loadSession(page);
  await ensureBuildingsCatalog(page);
  await page.getByRole('heading', { name: 'Baukatalog' }).scrollIntoViewIfNeeded();
  await waitForIcon003Catalog(page, minIcon003);
  await page.screenshot({
    path: path.join(evidenceDir, fileName),
    fullPage: true,
  });
  await browser.close();
}

async function captureRuntimeCoverageBoard() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await loadSession(page);
  await ensureBuildingsCatalog(page);
  await waitForIcon003Catalog(page, 23);

  const srcs = await page.evaluate(() =>
    [...document.querySelectorAll('img[src*="ICON-003"]')]
      .map((img) => (img instanceof HTMLImageElement ? img.src : ''))
      .filter(Boolean),
  );

  await browser.close();

  const unique = [...new Set(srcs.map((s) => s.split('/').pop()?.split('?')[0] ?? s))];
  console.log(`ICON-003 catalog images loaded: ${unique.length}`, unique.sort().join(', '));

  const browser2 = await chromium.launch({ headless: true });
  const page2 = await browser2.newPage({ viewport: { width: 1280, height: 900 } });
  await loadSession(page2);
  await ensureBuildingsCatalog(page2);
  await waitForIcon003Catalog(page2, 23);
  await page2.screenshot({
    path: path.join(evidenceDir, 'BUILDING_ICON_003_23_OF_23_RUNTIME_COVERAGE.png'),
    fullPage: true,
  });
  await browser2.close();
}

await capture({ width: 1280, height: 900 }, 'BUILDING_INFRASTRUCTURE_23_OF_23_CATALOG_DESKTOP.png', 23);

async function captureNarrow() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 480, height: 900 } });
  await loadSession(page);
  await ensureBuildingsCatalog(page);
  const zufahrt = page.getByText('Zufahrtsstrasse', { exact: true }).first();
  await zufahrt.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const img = document.querySelector('img[src*="ICON-003-access_road"]');
    return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0;
  });
  await page.screenshot({
    path: path.join(evidenceDir, 'BUILDING_INFRASTRUCTURE_23_OF_23_CATALOG_NARROW.png'),
    fullPage: true,
  });
  await browser.close();
}

await captureNarrow();
await captureRuntimeCoverageBoard();

console.log('Captured infrastructure 23/23 runtime evidence to', evidenceDir);
