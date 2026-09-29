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
    () =>
      document.body.innerText.includes('Produktionsübersicht') ||
      document.body.innerText.includes('Personal verwalten'),
    undefined,
    { timeout: 120_000 },
  );
}

async function prepareProductionScreen(page) {
  await page.goto(`${webOrigin}/game?screen=production`, { waitUntil: 'domcontentloaded' });
  await bootstrapSession(page);
  await page.reload({ waitUntil: 'networkidle' });
  await waitForActiveWorkspace(page);
}

const EXPECTED_FOCUS_BUILDING_ID = 'building_005';
const EXPECTED_BUILDING_LABEL = 'Closeout Sawmill';

async function readEmployeeAssignmentSnapshot(page) {
  const response = await page.request.get(`${webOrigin}/api/dashboard`);
  if (!response.ok()) {
    throw new Error(`Dashboard fetch failed: ${response.status()}`);
  }
  const payload = await response.json();
  const employees = payload?.data?.employees ?? [];
  return Object.freeze(
    employees.map((employee) =>
      Object.freeze({
        id: employee.id,
        assignedBuildingId: employee.assignedBuildingId ?? null,
      }),
    ),
  );
}

async function captureViewport(label, viewport) {
  const chromium = await loadChromium();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  await prepareProductionScreen(page);

  const productionScope = page.locator('.pg-operation-screen');
  await productionScope.waitFor({ timeout: 60_000 });

  const productionText = await productionScope.innerText();
  if (!productionText.includes('Keine Mitarbeiter')) {
    throw new Error(`Expected STALLED_WORKFORCE status copy on Production (${label})`);
  }
  if (!productionText.includes('Operatives Dashboard → Personal')) {
    throw new Error(`Expected workforce guidance on Production (${label})`);
  }

  const cta = productionScope
    .locator('.pg-production-workforce-nav-actions')
    .getByRole('button', { name: /Personal verwalten/ });
  await cta.waitFor({ timeout: 60_000 });
  const ctaText = await cta.innerText();
  if (!ctaText.includes(EXPECTED_BUILDING_LABEL)) {
    throw new Error(`CTA expected building ${EXPECTED_BUILDING_LABEL}, got: ${ctaText} (${label})`);
  }

  await page.screenshot({
    path: path.join(evidenceDir, `WORKFORCE_NAV_001_PRODUCTION_CTA_${label}.png`),
    fullPage: true,
  });

  const employeeSnapshotBefore = await readEmployeeAssignmentSnapshot(page);

  await cta.click();
  await page.locator('.pg-operations-panels').waitFor({ timeout: 60_000 });

  await page.locator('.pg-operations-panels').waitFor({ timeout: 60_000 });

  await page.locator('#pg-employees-widget-title').waitFor({ timeout: 60_000 });

  const focusHint = page.locator('.pg-employees-widget').getByRole('status');
  await focusHint.waitFor({ timeout: 60_000 });
  const focusHintText = await focusHint.innerText();
  if (!focusHintText.includes(EXPECTED_BUILDING_LABEL)) {
    throw new Error(
      `Focus hint expected building ${EXPECTED_BUILDING_LABEL}, got: ${focusHintText} (${label})`,
    );
  }

  const focusBuilding = await page
    .locator('[data-workforce-assignment-focus-building]')
    .getAttribute('data-workforce-assignment-focus-building');
  if (focusBuilding !== EXPECTED_FOCUS_BUILDING_ID) {
    throw new Error(
      `Expected focus building ${EXPECTED_FOCUS_BUILDING_ID}, got ${focusBuilding ?? 'null'} (${label})`,
    );
  }

  const focusedAssignAction = page.locator('.pg-workforce-assignment-focus-action').first();
  if ((await focusedAssignAction.count()) === 0) {
    throw new Error(`Expected highlighted assignment control (${label})`);
  }

  await page.screenshot({
    path: path.join(evidenceDir, `WORKFORCE_NAV_001_COMPANY_PERSONAL_FOCUS_${label}.png`),
    fullPage: true,
  });

  const employeeSnapshotAfter = await readEmployeeAssignmentSnapshot(page);
  if (JSON.stringify(employeeSnapshotAfter) !== JSON.stringify(employeeSnapshotBefore)) {
    throw new Error(`Employee assignment snapshot changed after navigation-only action (${label})`);
  }

  if (employeeSnapshotAfter.length > employeeSnapshotBefore.length) {
    throw new Error(`Employee count increased after navigation-only action (${label})`);
  }

  await browser.close();
}

for (const [label, viewport] of [
  ['DESKTOP_1440x900', { width: 1440, height: 900 }],
  ['NARROW_480x900', { width: 480, height: 900 }],
]) {
  await captureViewport(label, viewport);
}

console.log('WORKFORCE-NAV-001 runtime evidence captured.');
