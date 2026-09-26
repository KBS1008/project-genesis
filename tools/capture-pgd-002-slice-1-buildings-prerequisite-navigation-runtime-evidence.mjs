/* global console, process */
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const REQUIRED_TECHNOLOGY_ID = 'intermodal_logistics';
const REQUIRED_REASON_FRAGMENT = 'Intermodale Logistik';

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
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');
const webOrigin = process.env.PG_WEB_ORIGIN ?? 'http://127.0.0.1:3000';
const defaultFixturePath = path.join(
  projectRoot,
  'tools/evidence-fixtures/pgd-002-s1-research-prerequisite-navigation.json',
);
const savePath = process.env.PG_EVIDENCE_SAVE ?? defaultFixturePath;

if (!existsSync(savePath)) {
  throw new Error(
    `Evidence save missing: ${savePath}. Run: node tools/build-pgd-002-s1-research-evidence-fixture.mjs`,
  );
}

async function bootstrapSession(page) {
  const loadResponse = await page.request.post(`${webOrigin}/api/session/load`, {
    data: { filePath: savePath },
  });
  if (loadResponse.ok()) {
    return;
  }
  throw new Error(`Session load failed: ${loadResponse.status()} ${await loadResponse.text()}`);
}

async function openBuildings(page, viewport) {
  await bootstrapSession(page);
  await page.setViewportSize(viewport);
  await page.goto(`${webOrigin}/game?screen=buildings`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Baukatalog' }).waitFor({ timeout: 120_000 });
}

function researchCatalogRow(page) {
  return page.locator(`[data-technology-id="${REQUIRED_TECHNOLOGY_ID}"]`).first();
}

function buildingsResearchRow(page) {
  return page
    .locator('.pg-operation-hint-row')
    .filter({ hasText: 'Bahnterminal' })
    .filter({ hasText: REQUIRED_REASON_FRAGMENT })
    .first();
}

async function assertResearchCatalogRowFocused(page) {
  const catalogRow = researchCatalogRow(page);
  await catalogRow.waitFor({ timeout: 30_000 });
  const rowText = await catalogRow.textContent();
  if (rowText === null || !rowText.includes('Intermodale Logistik')) {
    throw new Error('Expected required technology catalog row with authoritative name.');
  }
  if (rowText.includes(REQUIRED_TECHNOLOGY_ID)) {
    throw new Error('Raw technology ID visible in research catalog row.');
  }
  return { catalogVisible: true, catalogRowTextSample: rowText.slice(0, 120) };
}

async function captureResearchNavigation(page, viewport, fileName, options = {}) {
  const { captureCatalogBeforeClick = false, catalogBeforeFileName } = options;

  await openBuildings(page, viewport);

  const buildingRow = buildingsResearchRow(page);
  await buildingRow.waitFor({ timeout: 30_000 });

  const reasonText = await buildingRow.locator('.pg-operation-hint-copy span').last().textContent();
  if (reasonText === null || !reasonText.includes(REQUIRED_REASON_FRAGMENT)) {
    throw new Error(`Expected research blocker copy, got: ${reasonText ?? '(null)'}`);
  }
  if (reasonText.includes(REQUIRED_TECHNOLOGY_ID)) {
    throw new Error('Raw technology ID leaked in blocker copy.');
  }

  const navButton = buildingRow.getByRole('button', { name: 'Zur Forschung' });
  await navButton.waitFor({ timeout: 10_000 });
  const buttonBox = await navButton.boundingBox();
  if (buttonBox === null) {
    throw new Error('Navigation button has no layout box.');
  }

  if (captureCatalogBeforeClick && catalogBeforeFileName !== undefined) {
    await page.screenshot({
      path: path.join(evidenceDir, catalogBeforeFileName),
      fullPage: true,
    });
  }

  await navButton.click();
  await page.getByRole('heading', { name: 'Forschungskatalog' }).waitFor({ timeout: 60_000 });
  await page.waitForURL(/screen=research/, { timeout: 30_000 });

  const focusAssertion = await assertResearchCatalogRowFocused(page);

  await page.screenshot({ path: path.join(evidenceDir, fileName), fullPage: true });

  return {
    url: page.url(),
    reasonFragment: REQUIRED_REASON_FRAGMENT,
    buttonBox,
    ...focusAssertion,
  };
}

async function captureMilestoneNavigation(page, viewport, fileName, catalogFileName) {
  const milestoneSavePath = path.join(
    projectRoot,
    'saves/e2e-m11-phase6-production-closeout.json',
  );
  const loadResponse = await page.request.post(`${webOrigin}/api/session/load`, {
    data: { filePath: milestoneSavePath },
  });
  if (!loadResponse.ok()) {
    throw new Error(`Milestone save load failed: ${loadResponse.status()}`);
  }

  await page.setViewportSize(viewport);
  await page.goto(`${webOrigin}/game?screen=buildings`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Baukatalog' }).waitFor({ timeout: 120_000 });

  const milestoneButton = page.getByRole('button', { name: 'Zu den Meilensteinen' }).first();
  await milestoneButton.waitFor({ timeout: 30_000 });
  if (catalogFileName !== undefined) {
    await page.screenshot({ path: path.join(evidenceDir, catalogFileName), fullPage: true });
  }
  await milestoneButton.click();
  const milestonesHeading = page.locator('#pg-milestones-widget-title');
  await milestonesHeading.waitFor({ timeout: 60_000 });

  await page.screenshot({ path: path.join(evidenceDir, fileName), fullPage: true });

  return {
    url: page.url(),
    milestonesVisible: await milestonesHeading.isVisible(),
  };
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const researchDesktop = await captureResearchNavigation(
  page,
  { width: 1440, height: 900 },
  'PGD_002_S1_BUILDINGS_RESEARCH_NAV_DESKTOP_1440x900.png',
);

await page.goto('about:blank');

const researchNarrow = await captureResearchNavigation(
  page,
  { width: 480, height: 900 },
  'PGD_002_S1_BUILDINGS_RESEARCH_NAV_NARROW_480x900.png',
  {
    captureCatalogBeforeClick: true,
    catalogBeforeFileName: 'PGD_002_S1_BUILDINGS_RESEARCH_CATALOG_NARROW_480x900.png',
  },
);

await page.goto('about:blank');

const milestoneDesktop = await captureMilestoneNavigation(
  page,
  { width: 1440, height: 900 },
  'PGD_002_S1_BUILDINGS_MILESTONE_NAV_DESKTOP_1440x900.png',
  'PGD_002_S1_BUILDINGS_CATALOG_NAV_AFFORDANCE_DESKTOP_1440x900.png',
);

await browser.close();

console.log(
  JSON.stringify(
    {
      webOrigin,
      savePath,
      researchDesktop,
      researchNarrow,
      milestoneDesktop,
    },
    null,
    2,
  ),
);
