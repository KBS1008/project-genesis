/* global document, console, process */
import path from 'node:path';
import { existsSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';

const CERTIFIED = Object.freeze({
  recipeId: 'recipe_planks',
  recipeName: 'Bretter herstellen',
  resourceId: 'wood',
  authoritativeName: 'Holz',
  missingAmount: 10,
  expectedReasonFragment: 'Benötigt 10× Holz',
});

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
const defaultFixturePath = path.join(
  projectRoot,
  'tools/evidence-fixtures/pgd-res-001-production-resource-label.json',
);
const savePath = (process.env.PG_EVIDENCE_SAVE ?? defaultFixturePath).replace(/\\/g, '/');

if (!existsSync(savePath)) {
  throw new Error(
    `Evidence save missing: ${savePath}. Run: node tools/build-pgd-res-001-resource-label-evidence-fixture.mjs`,
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
  await page.waitForFunction(
    () => !document.body.innerText.includes('Session wird geladen'),
    undefined,
    { timeout: 120_000 },
  );
}

async function openProduction(page, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(`${webOrigin}/game?screen=production`, { waitUntil: 'domcontentloaded' });
  await waitForActiveWorkspace(page);
  await page.getByRole('heading', { name: 'Rezeptkatalog' }).waitFor({ timeout: 120_000 });
}

function certifiedHintRow(page) {
  return page
    .locator('.pg-operation-hint-row')
    .filter({ hasText: CERTIFIED.recipeName })
    .filter({ hasText: CERTIFIED.expectedReasonFragment })
    .first();
}

async function assertCertifiedProductionBlocker(page) {
  const row = certifiedHintRow(page);
  await row.waitFor({ timeout: 60_000 });

  const scopedCopy = await row.locator('.pg-operation-hint-copy').innerText();

  if (!scopedCopy.includes(CERTIFIED.authoritativeName)) {
    throw new Error(`Authoritative name missing in scoped copy: ${scopedCopy.slice(0, 200)}`);
  }
  if (!scopedCopy.includes(String(CERTIFIED.missingAmount))) {
    throw new Error(`Missing amount not visible in scoped copy: ${scopedCopy.slice(0, 200)}`);
  }
  if (scopedCopy.includes(CERTIFIED.resourceId)) {
    throw new Error(`Raw resource ID visible in scoped player copy: ${scopedCopy.slice(0, 200)}`);
  }
  if (!scopedCopy.includes('Benötigt') || !scopedCopy.includes('×')) {
    throw new Error(`Requirement pattern missing in scoped copy: ${scopedCopy.slice(0, 200)}`);
  }

  return {
    recipeId: CERTIFIED.recipeId,
    resourceId: CERTIFIED.resourceId,
    authoritativeName: CERTIFIED.authoritativeName,
    missingAmount: CERTIFIED.missingAmount,
    visibleReasonSample: scopedCopy.replace(/\s+/g, ' ').trim().slice(0, 220),
    rawIdInScopedCopy: false,
  };
}

async function captureProduction(viewport, fileName) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  await bootstrapSession(page);
  await openProduction(page, viewport);
  const certification = await assertCertifiedProductionBlocker(page);
  await page.screenshot({ path: path.join(evidenceDir, fileName), fullPage: true });
  await browser.close();
  return certification;
}

const productionDesktop = await captureProduction(
  { width: 1440, height: 900 },
  'PGD_RES_001_PRODUCTION_RESOURCE_REQUIREMENT_DESKTOP_1440x900.png',
);
const productionNarrow = await captureProduction(
  { width: 480, height: 900 },
  'PGD_RES_001_PRODUCTION_RESOURCE_REQUIREMENT_NARROW_480x900.png',
);

console.log(
  JSON.stringify(
    {
      webOrigin,
      savePath,
      certifiedCase: CERTIFIED,
      productionDesktop,
      productionNarrow,
    },
    null,
    2,
  ),
);
