/* global document, console, process */
import fs from 'node:fs/promises';
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
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');
const savePath = 'D:/Cursor/Project Genesis/saves/e2e-m11-phase6-production-closeout.json';
const webOrigin = process.env.PG_WEB_ORIGIN ?? 'http://localhost:3000';

async function loadSession(page) {
  const loadResponse = await page.request.post(`${webOrigin}/api/session/load`, {
    data: { filePath: savePath },
  });
  if (!loadResponse.ok()) throw new Error(`Session load failed: ${loadResponse.status()}`);
}

async function waitForMarketResourceIcons(page) {
  await page.waitForSelector('.pg-market-widget .pg-resource-icon', { timeout: 90_000 });
  await page.waitForFunction(
    () => {
      const imgs = [...document.querySelectorAll('.pg-market-widget .pg-resource-icon')];
      if (imgs.length === 0) return false;
      return imgs.every((img) => {
        const el = /** @type {HTMLImageElement} */ (img);
        return el.complete && el.naturalWidth > 0;
      });
    },
    undefined,
    { timeout: 60_000 },
  );
}

async function openMarketsScreen(page) {
  await loadSession(page);
  await page.goto(`${webOrigin}/game?screen=markets`, { waitUntil: 'networkidle' });
  await waitForMarketResourceIcons(page);
}

async function openCompanyMarketWidget(page) {
  await loadSession(page);
  await page.goto(`${webOrigin}/game?screen=company&entity=employee:employee_001`, {
    waitUntil: 'networkidle',
  });
  const widget = page.locator('.pg-market-widget');
  await widget.waitFor({ timeout: 90_000 });
  await widget.scrollIntoViewIfNeeded();
  await waitForMarketResourceIcons(page);
}

async function captureMarketScreen(page, name, viewport) {
  await page.setViewportSize(viewport);
  await openMarketsScreen(page);
  await page.locator('.pg-market-widget').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const out = path.join(evidenceDir, name);
  await page.screenshot({ path: out, fullPage: false });
  console.log('wrote', out);
}

async function captureCompanyWidget(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openCompanyMarketWidget(page);
  const out = path.join(evidenceDir, 'MVI_001_SLICE_1_COMPANY_MARKET_WIDGET.png');
  await page.locator('.pg-market-widget').screenshot({ path: out });
  console.log('wrote', out);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  await fs.mkdir(evidenceDir, { recursive: true });
  await captureMarketScreen(page, 'MVI_001_SLICE_1_MARKET_DESKTOP.png', {
    width: 1440,
    height: 900,
  });
  await captureMarketScreen(page, 'MVI_001_SLICE_1_MARKET_NARROW.png', {
    width: 480,
    height: 900,
  });
  await captureCompanyWidget(page);
} finally {
  await browser.close();
}
