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

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');
const webOrigin = process.env.PG_WEB_ORIGIN ?? 'http://127.0.0.1:3000';
const savePath = path
  .join(projectRoot, 'tools/evidence-fixtures/workforce-guidance-001-stalled-workforce.json')
  .replace(/\\/g, '/');

if (!existsSync(savePath)) {
  throw new Error(
    `Evidence save missing: ${savePath}. Run: node tools/build-workforce-guidance-001-evidence-fixture.mjs`,
  );
}

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

const chromium = await loadChromium();
const browser = await chromium.launch({ headless: true });

for (const [label, viewport] of [
  ['DESKTOP_1440x900', { width: 1440, height: 900 }],
  ['NARROW_480x900', { width: 480, height: 900 }],
]) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await bootstrapSession(page);
  await page.goto(`${webOrigin}/game?screen=production`, { waitUntil: 'networkidle' });
  await waitForActiveWorkspace(page);

  const guidance = page.getByText(/Operatives Dashboard → Personal/);
  await guidance.waitFor({ timeout: 60_000 });

  const bodyText = await page.locator('.pg-operation-screen').innerText();
  if (!bodyText.includes('Keine Mitarbeiter')) {
    throw new Error(`Expected workforce stall status on Production (${label})`);
  }
  if (bodyText.match(/Produktionsmitarbeiter/i)) {
    throw new Error(`Mandatory employee-type copy must not appear (${label})`);
  }

  await page.screenshot({
    path: path.join(evidenceDir, `WORKFORCE_GUIDANCE_001_PRODUCTION_STALL_${label}.png`),
    fullPage: true,
  });

  await context.close();
}

await browser.close();
console.log('WORKFORCE-GUIDANCE-001 runtime evidence captured.');
