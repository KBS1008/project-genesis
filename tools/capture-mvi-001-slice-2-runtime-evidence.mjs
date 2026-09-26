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
const webOrigin = process.env.PG_WEB_ORIGIN ?? 'http://127.0.0.1:3000';

async function loadSession(page) {
  const loadResponse = await page.request.post(`${webOrigin}/api/session/load`, {
    data: { filePath: savePath },
  });
  if (!loadResponse.ok()) throw new Error(`Session load failed: ${loadResponse.status()}`);
  await page.request.post(`${webOrigin}/api/simulation/resume`, { data: {} }).catch(() => undefined);
}

async function readTransportOrderCount(page) {
  const dashboard = await page.request.get(`${webOrigin}/api/dashboard`);
  if (!dashboard.ok()) throw new Error(`Dashboard fetch failed: ${dashboard.status()}`);
  const body = await dashboard.json();
  const orders = body?.data?.transportOrders ?? [];
  return Array.isArray(orders) ? orders.length : 0;
}

async function ensureActiveTransportOrders(page) {
  if ((await readTransportOrderCount(page)) > 0) {
    return;
  }

  const buy = await page.request.post(`${webOrigin}/api/market/buy`, {
    data: { resourceId: 'wood', amount: 20 },
  });
  if (!buy.ok()) throw new Error(`Market buy failed: ${buy.status()}`);

  const start = await page.request.post(`${webOrigin}/api/production/start`, {
    data: { buildingId: 'building_005', recipeId: 'recipe_planks' },
  });
  if (!start.ok()) {
    const body = await start.text();
    throw new Error(`Production start failed: ${start.status()} ${body}`);
  }

  for (let attempt = 0; attempt < 40; attempt += 1) {
    if ((await readTransportOrderCount(page)) > 0) {
      return;
    }
    const tick = await page.request.post(`${webOrigin}/api/simulation/tick`, { data: { count: 2 } });
    if (!tick.ok()) throw new Error(`Tick advance failed: ${tick.status()}`);
  }

  if ((await readTransportOrderCount(page)) === 0) {
    throw new Error('No transport orders appeared after seeding warehouse-to-sawmill delivery');
  }
}

async function waitForSupplyChainResourceIcons(page) {
  await page.waitForSelector('.pg-supply-chain-widget .pg-resource-icon', { timeout: 90_000 });
  await page.waitForFunction(
    () => {
      const imgs = [...document.querySelectorAll('.pg-supply-chain-widget .pg-resource-icon')];
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

async function openCompanySupplyChainWidget(page) {
  await loadSession(page);
  await ensureActiveTransportOrders(page);
  await page.goto(`${webOrigin}/game?screen=company`, { waitUntil: 'networkidle' });
  const widget = page.locator('.pg-supply-chain-widget');
  await widget.waitFor({ timeout: 90_000 });
  await widget.scrollIntoViewIfNeeded();
  await waitForSupplyChainResourceIcons(page);
}

async function captureSupplyChain(page, name, viewport) {
  await page.setViewportSize(viewport);
  await openCompanySupplyChainWidget(page);
  await page.waitForTimeout(400);
  const out = path.join(evidenceDir, name);
  await page.screenshot({ path: out, fullPage: false });
  console.log('wrote', out);
}

async function captureWidgetCrop(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openCompanySupplyChainWidget(page);
  const out = path.join(evidenceDir, 'MVI_001_SLICE_2_SUPPLY_CHAIN_WIDGET.png');
  await page.locator('.pg-supply-chain-widget').screenshot({ path: out });
  console.log('wrote', out);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  await fs.mkdir(evidenceDir, { recursive: true });
  await captureSupplyChain(page, 'MVI_001_SLICE_2_TRANSPORT_DESKTOP.png', {
    width: 1440,
    height: 900,
  });
  await captureSupplyChain(page, 'MVI_001_SLICE_2_TRANSPORT_NARROW.png', {
    width: 480,
    height: 900,
  });
  await captureWidgetCrop(page);
} finally {
  await browser.close();
}
