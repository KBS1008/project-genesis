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
  if (!loadResponse.ok()) {
    throw new Error(`Session load failed: ${loadResponse.status()}`);
  }
}

async function seedMixedEmployees(page) {
  const hires = [
    { employeeTypeId: 'employee_senior_engineer', displayName: 'WFV Eng Lead' },
    { employeeTypeId: 'employee_researcher_basic', displayName: 'WFV Researcher' },
  ];
  for (const hire of hires) {
    await page.request.post(`${webOrigin}/api/employees/hire`, { data: hire });
  }
}

async function openCompany(page) {
  const url = `${webOrigin}/game?screen=company&entity=employee:employee_001`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  try {
    await page.waitForSelector('.pg-employees-widget .pg-workforce-role-visual', { timeout: 25_000 });
  } catch {
    await loadSession(page);
    await seedMixedEmployees(page);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('.pg-employees-widget .pg-workforce-role-visual', { timeout: 90_000 });
  }
}

async function screenshotWidget(page, outName, viewport) {
  await page.setViewportSize(viewport);
  await openCompany(page);
  const widget = page.locator('.pg-employees-widget');
  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await widget.screenshot({ path: path.join(evidenceDir, outName) });
}

async function main() {
  await fs.mkdir(evidenceDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await loadSession(page);
  await seedMixedEmployees(page);

  await screenshotWidget(page, 'WFV_001_PRODUCTION_BATCH_1_WORKFORCE_DESKTOP.png', {
    width: 1440,
    height: 900,
  });
  await screenshotWidget(page, 'WFV_001_PRODUCTION_BATCH_1_WORKFORCE_NARROW.png', {
    width: 480,
    height: 900,
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await openCompany(page);
  const imgs = page.locator('.pg-employees-widget .pg-workforce-role-visual');
  await page.waitForFunction(
    () => {
      const nodes = [...document.querySelectorAll('.pg-employees-widget .pg-workforce-role-visual')];
      return nodes.length >= 3;
    },
    undefined,
    { timeout: 15_000 },
  );
  const primaryCount = await imgs.evaluateAll((nodes) =>
    nodes.filter((n) => n.getAttribute('data-workforce-primary') === 'true').length,
  );
  const fallbackCount = await imgs.evaluateAll((nodes) =>
    nodes.filter((n) => n.getAttribute('data-workforce-primary') === 'false').length,
  );
  console.log('Runtime visuals:', { primaryCount, fallbackCount });
  await page.locator('.pg-employees-widget').screenshot({
    path: path.join(evidenceDir, 'WFV_001_PRODUCTION_BATCH_1_MIXED_COVERAGE.png'),
  });

  await browser.close();
  console.log('WFV Batch-1 runtime evidence captured');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
