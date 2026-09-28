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
  .join(projectRoot, 'tools/evidence-fixtures/research-status-001-representative-jobs.json')
  .replace(/\\/g, '/');

/** One RUNNING job in the representative research-status fixture. */
const EXPECTED_ACTIVE_RESEARCH_COUNT = 1;

if (!existsSync(savePath)) {
  throw new Error(
    `Evidence save missing: ${savePath}. Run: node tools/build-research-status-001-evidence-fixture.mjs`,
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

async function readForschungKpiValue(page, scopeSelector) {
  const valueLocator = page.locator(
    `${scopeSelector} [aria-label="Forschung"] .pg-kpi-card-value`,
  );
  await valueLocator.waitFor({ timeout: 60_000 });
  return Number.parseInt((await valueLocator.innerText()).trim(), 10);
}

const chromium = await loadChromium();
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

await bootstrapSession(page);
await page.goto(`${webOrigin}/game?screen=company`, { waitUntil: 'networkidle' });
await waitForActiveWorkspace(page);

const executiveCount = await readForschungKpiValue(page, '[aria-label="Kernkennzahlen"]');
if (executiveCount !== EXPECTED_ACTIVE_RESEARCH_COUNT) {
  throw new Error(
    `Executive Forschung KPI expected ${EXPECTED_ACTIVE_RESEARCH_COUNT}, got ${executiveCount}`,
  );
}

await page.screenshot({
  path: path.join(evidenceDir, 'RESEARCH_METRICS_001_EXECUTIVE_RESEARCH_KPI_DESKTOP_1440x900.png'),
  fullPage: true,
});

await page.getByRole('button', { name: 'Operatives Dashboard' }).click();
await page.waitForSelector('.pg-research-widget', { timeout: 60_000 });

const operationsCount = await readForschungKpiValue(page, '.pg-operations-overview-strip');
if (operationsCount !== EXPECTED_ACTIVE_RESEARCH_COUNT) {
  throw new Error(
    `Operatives Forschung overview expected ${EXPECTED_ACTIVE_RESEARCH_COUNT}, got ${operationsCount}`,
  );
}

const researchWidgetText = await page.locator('.pg-research-widget').innerText();
if (!researchWidgetText.includes('Laufend')) {
  throw new Error('Expected corroborating Laufend Research row in operations research widget');
}

await page.screenshot({
  path: path.join(
    evidenceDir,
    'RESEARCH_METRICS_001_OPERATIONS_RESEARCH_KPI_DESKTOP_1440x900.png',
  ),
  fullPage: true,
});

await browser.close();
console.log('RESEARCH-METRICS-001 runtime evidence captured.');
