/* global document, console, process */
import path from 'node:path';
import { existsSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';

async function loadChromium() {
  const localPlaywright = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    'capture-evidence-tmp/node_modules/playwright/index.mjs',
  );
  try {
    const playwright = await import(pathToFileURL(localPlaywright).href);
    return playwright.chromium;
  } catch {
    const playwright = await import('playwright');
    return playwright.chromium;
  }
}

const chromium = await loadChromium();
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');
const webOrigin = process.env.PG_WEB_ORIGIN ?? 'http://127.0.0.1:3000';
const savePath = path
  .join(projectRoot, 'tools/evidence-fixtures/transport-status-001-representative-orders.json')
  .replace(/\\/g, '/');

if (!existsSync(savePath)) {
  throw new Error(`Evidence save missing: ${savePath}. Run: node tools/build-transport-status-001-evidence-fixture.mjs`);
}

const RAW_ENUMS = ['WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

async function bootstrapSession(page) {
  const loadResponse = await page.request.post(`${webOrigin}/api/session/load`, {
    data: { filePath: savePath },
  });
  if (!loadResponse.ok()) {
    throw new Error(`Session load failed: ${loadResponse.status()} ${await loadResponse.text()}`);
  }
}

async function waitForActiveWorkspace(page) {
  await page.waitForFunction(
    () => !document.body.innerText.includes('Keine aktive Session'),
    undefined,
    { timeout: 120_000 },
  );
}

function assertNoRawTransportEnums(text, scopeLabel) {
  for (const token of RAW_ENUMS) {
    if (text.includes(token)) {
      throw new Error(`${scopeLabel} still contains raw transport enum: ${token}`);
    }
  }
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();

await bootstrapSession(page);
await page.goto(`${webOrigin}/game?screen=transport`, { waitUntil: 'networkidle' });
await waitForActiveWorkspace(page);

const transportTable = page.locator('.pg-operation-screen [role="table"]');
await transportTable.waitFor({ timeout: 60_000 });
const transportTableText = await transportTable.innerText();
assertNoRawTransportEnums(transportTableText, 'Transport table');
if (!transportTableText.includes('Warteschlange') || !transportTableText.includes('Unterwegs')) {
  throw new Error(`Transport table missing expected German labels: ${transportTableText}`);
}

await page.screenshot({
  path: path.join(evidenceDir, 'TRANSPORT_STATUS_001_TRANSPORT_SCREEN_DESKTOP_1440x900.png'),
  fullPage: true,
});

await page.goto(`${webOrigin}/game?screen=world`, { waitUntil: 'networkidle' });
await waitForActiveWorkspace(page);
await page.locator('.pg-world-map-cell').first().click();
await page.waitForSelector('.pg-world-inspector', { timeout: 60_000 });

const transportSection = page.locator('.pg-world-inspector').filter({ hasText: 'Transport' });
const transportSectionText = await transportSection.innerText();
assertNoRawTransportEnums(transportSectionText, 'World inspector transport section');
if (!transportSectionText.includes('Unterwegs')) {
  throw new Error(`World transport section missing Unterwegs: ${transportSectionText}`);
}

await page.screenshot({
  path: path.join(evidenceDir, 'TRANSPORT_STATUS_001_WORLD_TRANSPORT_ROWS_DESKTOP_1440x900.png'),
  fullPage: true,
});

await browser.close();
console.log('TRANSPORT-STATUS-001 runtime evidence captured.');
