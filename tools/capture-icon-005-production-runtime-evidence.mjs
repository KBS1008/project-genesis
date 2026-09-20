/* global document, console, fetch, process */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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

const EXPECTED_PROCESS_PRIMARIES = 7;

async function loadSession(page) {
  const loadResponse = await page.request.post(`${webOrigin}/api/session/load`, {
    data: { filePath: savePath },
  });
  if (loadResponse.ok()) {
    return;
  }

  const newResponse = await page.request.post(`${webOrigin}/api/session/new`, {
    data: { name: 'ICON-005 Production Runtime Evidence' },
  });
  if (!newResponse.ok()) {
    throw new Error(`Session bootstrap failed: ${loadResponse.status()} / ${newResponse.status()}`);
  }
}

async function openProduction(page) {
  await page.goto(`${webOrigin}/game?screen=production`, { waitUntil: 'domcontentloaded' });
  const catalog = page.getByText('Rezeptkatalog', { exact: true });
  try {
    await catalog.waitFor({ timeout: 20_000 });
  } catch {
    await page.evaluate(async (filePath) => {
      await fetch('/api/session/load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      });
    }, savePath);
    await page.goto(`${webOrigin}/game?screen=production`, { waitUntil: 'networkidle' });
    await catalog.waitFor({ timeout: 60_000 });
  }
}

async function waitForProcessIcons(page) {
  await page.waitForSelector('.pg-production-recipe-list', { timeout: 60_000 });

  await page.waitForFunction(
    ({ expectedCount }) => {
      const images = [...document.querySelectorAll('img[src*="ICON-005-"][src*="-primary"]')];
      if (images.length < expectedCount) {
        return false;
      }

      return images.every((img) => img.complete && img.naturalWidth > 0);
    },
    { expectedCount: EXPECTED_PROCESS_PRIMARIES },
    { timeout: 120_000 },
  );

  await page.waitForTimeout(500);
}

async function captureViewport(viewport, fileName) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  await loadSession(page);
  await openProduction(page);
  await page.getByText('Rezeptkatalog', { exact: true }).scrollIntoViewIfNeeded();
  await waitForProcessIcons(page);
  await page.screenshot({
    path: path.join(evidenceDir, fileName),
    fullPage: true,
  });
  await browser.close();
}

await captureViewport({ width: 1440, height: 900 }, 'ICON_005_PRODUCTION_RUNTIME_DESKTOP.png');
await captureViewport({ width: 480, height: 900 }, 'ICON_005_PRODUCTION_RUNTIME_NARROW.png');

console.log('ICON-005 production runtime evidence captured.');
