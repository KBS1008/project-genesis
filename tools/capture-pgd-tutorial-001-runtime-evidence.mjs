/* global console, document, process */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

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
const apiOrigin = process.env.PG_API_ORIGIN ?? 'http://127.0.0.1:3001';
const newGameFixture = path.join(
  projectRoot,
  'tools/evidence-fixtures/pgd-tutorial-001-new-game.json',
);
const midProgressFixture = path.join(
  projectRoot,
  'tools/evidence-fixtures/pgd-tutorial-001-mid-progress.json',
);

const summary = {
  capturedAt: new Date().toISOString(),
  webOrigin,
  overallResult: 'FAIL',
  http400RootCause:
    'POST /api/session/new returned 400 when an active company already existed (Company id "company_001" already exists). session/new is not idempotent; evidence bootstrap must use session/load with a deterministic fixture.',
  bootstrapFix: 'session/load with tools/evidence-fixtures/pgd-tutorial-001-*.json',
  screenshots: [],
  assertions: [],
  notRun: [],
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
  summary.assertions.push({ pass: true, message });
}

async function waitForRuntimeReady() {
  for (let attempt = 0; attempt < 90; attempt += 1) {
    try {
      const health = await fetch(`${apiOrigin}/health`);
      if (health.ok) {
        return;
      }
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Runtime not ready at ${webOrigin}`);
}

async function loadSession(page, filePath) {
  const response = await page.request.post(`${webOrigin}/api/session/load`, {
    data: { filePath },
  });
  const body = await response.text();
  if (!response.ok()) {
    throw new Error(`session/load failed (${response.status()}): ${body}`);
  }
  return { method: 'load', filePath, status: response.status() };
}

async function fetchDashboard(page) {
  const response = await page.request.get(`${webOrigin}/api/dashboard`);
  const json = await response.json();
  if (!response.ok() || json.ok === false) {
    throw new Error(`dashboard fetch failed: ${response.status()} ${JSON.stringify(json)}`);
  }
  return json.data;
}

function tutorialStepCompleted(tutorial, stepId) {
  const step = tutorial?.steps?.find((entry) => entry.id === stepId);
  return step?.completed === true;
}

async function openCompanyOperations(page) {
  await page.goto(`${webOrigin}/game?screen=company`, { waitUntil: 'domcontentloaded' });
  const operationsTab = page.getByRole('button', { name: 'Operatives Dashboard' });
  await operationsTab.waitFor({ timeout: 120_000 });
  await operationsTab.click();
  await page.getByRole('region', { name: 'Erste Schritte' }).waitFor({ timeout: 120_000 });
}

async function screenshot(page, fileName) {
  const filePath = path.join(evidenceDir, fileName);
  await page.screenshot({ path: filePath, fullPage: true });
  summary.screenshots.push(fileName);
  return filePath;
}

async function certifyBuildSawmillFlow(page, viewportLabel, viewport) {
  await page.setViewportSize(viewport);
  const bootstrap = await loadSession(page, newGameFixture);
  summary.bootstrapNewGame = bootstrap;

  const dashboardBefore = await fetchDashboard(page);
  const buildingCountBefore = dashboardBefore.buildings?.length ?? 0;
  const buildCompletedBefore = tutorialStepCompleted(dashboardBefore.tutorial, 'build_sawmill');

  assert(buildCompletedBefore === false, `${viewportLabel}: build_sawmill incomplete before CTA`);

  await openCompanyOperations(page);

  assert(
    (await page.getByRole('region', { name: 'Erste Schritte' }).getByRole('button').count()) >= 1,
    `${viewportLabel}: incomplete step CTA visible`,
  );
  assert(
    (await page.getByRole('button', { name: 'Gebäude öffnen' }).count()) === 1,
    `${viewportLabel}: build_sawmill CTA visible`,
  );

  if (viewportLabel === 'narrow') {
    await checkNarrowOverflow(page);
  }

  const tutorialShot =
    viewportLabel === 'desktop'
      ? 'PGD-TUTORIAL-001_DESKTOP_TUTORIAL_CTA_BUILDINGS.png'
      : 'PGD-TUTORIAL-001_NARROW_480x900_TUTORIAL_CTA.png';
  await screenshot(page, tutorialShot);

  await page.getByRole('button', { name: 'Gebäude öffnen' }).click();
  await page.getByRole('heading', { name: 'Baukatalog' }).waitFor({ timeout: 60_000 });

  const sawmillRow = page.locator('[data-building-type-id="sawmill"]').first();
  await sawmillRow.waitFor({ timeout: 30_000 });

  const destShot =
    viewportLabel === 'desktop'
      ? 'PGD-TUTORIAL-001_DESKTOP_BUILDINGS_CATALOG_FOCUS.png'
      : 'PGD-TUTORIAL-001_NARROW_480x900_BUILDINGS_DESTINATION.png';
  await screenshot(page, destShot);

  assert(
    (await page.getByRole('heading', { name: 'Baukatalog' }).count()) === 1,
    `${viewportLabel}: Buildings/Baukatalog destination`,
  );
  assert(
    (await sawmillRow.count()) === 1,
    `${viewportLabel}: sawmill catalog row present (structural data-building-type-id)`,
  );

  const onWorldPlacement = await page
    .getByRole('heading', { name: 'Welt' })
    .isVisible()
    .catch(() => false);
  assert(onWorldPlacement === false, `${viewportLabel}: World/PDM screen not auto-opened`);

  const dashboardAfter = await fetchDashboard(page);
  const buildingCountAfter = dashboardAfter.buildings?.length ?? 0;
  const buildCompletedAfter = tutorialStepCompleted(dashboardAfter.tutorial, 'build_sawmill');

  assert(buildingCountAfter === buildingCountBefore, `${viewportLabel}: building count unchanged`);
  assert(
    buildCompletedAfter === buildCompletedBefore,
    `${viewportLabel}: build_sawmill completion unchanged after navigation`,
  );

  summary[`${viewportLabel}BuildSawmill`] = {
    viewport: `${viewport.width}x${viewport.height}`,
    buildingCountBefore,
    buildingCountAfter,
    buildCompletedBefore,
    buildCompletedAfter,
    autoPdm: false,
  };
}

async function certifyBuyWood(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await loadSession(page, midProgressFixture);

  const dashboardBefore = await fetchDashboard(page);
  const woodBefore =
    dashboardBefore.inventory?.items?.find((item) => item.resourceId === 'wood')?.available ?? null;
  const buyCompletedBefore = tutorialStepCompleted(dashboardBefore.tutorial, 'buy_wood');
  assert(buyCompletedBefore === false, 'desktop: buy_wood incomplete before CTA');

  await openCompanyOperations(page);
  await page.getByRole('button', { name: 'Markt öffnen' }).first().click();
  const resourceSelect = page.locator('#market-resource-select');
  await resourceSelect.waitFor({ timeout: 30_000 });
  const selectedResource = await resourceSelect.inputValue();
  assert(selectedResource === 'wood', 'desktop: market resource context is wood');

  await screenshot(page, 'PGD-TUTORIAL-001_DESKTOP_MARKET_WOOD_CONTEXT.png');

  const dashboardAfter = await fetchDashboard(page);
  const woodAfter =
    dashboardAfter.inventory?.items?.find((item) => item.resourceId === 'wood')?.available ?? null;
  const buyCompletedAfter = tutorialStepCompleted(dashboardAfter.tutorial, 'buy_wood');

  assert(woodAfter === woodBefore, 'desktop: wood inventory unchanged by CTA navigation');
  assert(buyCompletedAfter === buyCompletedBefore, 'desktop: buy_wood completion unchanged');

  summary.desktopBuyWood = {
    selectedResource,
    woodBefore,
    woodAfter,
    buyCompletedBefore,
    buyCompletedAfter,
  };
}

async function certifySellPlanks(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await loadSession(page, midProgressFixture);

  const dashboardBefore = await fetchDashboard(page);
  const sellCompletedBefore = tutorialStepCompleted(dashboardBefore.tutorial, 'sell_planks');
  if (sellCompletedBefore) {
    summary.notRun.push({
      path: 'sell_planks runtime CTA',
      reason: 'Fixture has sell_planks complete',
    });
    return;
  }

  await openCompanyOperations(page);
  await page.getByRole('button', { name: 'Markt öffnen' }).nth(1).click();
  const resourceSelect = page.locator('#market-resource-select');
  await resourceSelect.waitFor({ timeout: 30_000 });
  const selectedResource = await resourceSelect.inputValue();
  assert(selectedResource === 'planks', 'desktop: market resource context is planks');

  const dashboardAfter = await fetchDashboard(page);
  const sellCompletedAfter = tutorialStepCompleted(dashboardAfter.tutorial, 'sell_planks');
  assert(sellCompletedAfter === sellCompletedBefore, 'desktop: sell_planks completion unchanged');

  summary.desktopSellPlanks = { selectedResource, sellCompletedBefore, sellCompletedAfter };
}

async function certifyProducePlanks(page) {
  await loadSession(page, midProgressFixture);
  const dashboard = await fetchDashboard(page);
  const sawmillCount = (dashboard.buildings ?? []).filter(
    (building) => building.buildingTypeId === 'sawmill',
  ).length;
  const jobsBefore = dashboard.productionJobs?.length ?? 0;
  const produceCompletedBefore = tutorialStepCompleted(dashboard.tutorial, 'produce_planks');

  if (produceCompletedBefore) {
    summary.notRun.push({
      path: 'produce_planks runtime CTA click',
      reason:
        'Mid-progress fixture has produce_planks already complete; cardinality covered by resolve-tutorial-step-navigation.test.ts',
      sawmillCount,
    });
    return;
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await openCompanyOperations(page);
  await page.getByRole('button', { name: 'Produktion öffnen' }).click();
  await page.getByRole('heading', { name: 'Produktion' }).waitFor({ timeout: 60_000 });
  await screenshot(page, 'PGD-TUTORIAL-001_DESKTOP_PRODUCTION_CONTEXT.png');

  const dashboardAfter = await fetchDashboard(page);
  const jobsAfter = dashboardAfter.productionJobs?.length ?? 0;
  assert(jobsAfter === jobsBefore, 'desktop: production job count unchanged by CTA');

  summary.desktopProducePlanks = { sawmillCount, jobsBefore, jobsAfter };
}

async function certifyEarnProfit(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await loadSession(page, midProgressFixture);

  const before = await fetchDashboard(page);
  const earnCompletedBefore = tutorialStepCompleted(before.tutorial, 'earn_profit');
  assert(earnCompletedBefore === false, 'desktop: earn_profit incomplete before CTA');

  await openCompanyOperations(page);
  await page.getByRole('button', { name: 'Meilensteine anzeigen' }).click();

  const milestonesTitle = page.locator('#pg-milestones-widget-title');
  await milestonesTitle.waitFor({ timeout: 60_000 });
  await milestonesTitle.scrollIntoViewIfNeeded();

  await screenshot(page, 'PGD-TUTORIAL-001_DESKTOP_COMPANY_MILESTONES.png');

  const after = await fetchDashboard(page);
  const earnCompletedAfter = tutorialStepCompleted(after.tutorial, 'earn_profit');
  assert(earnCompletedAfter === earnCompletedBefore, 'desktop: earn_profit completion unchanged');

  summary.desktopEarnProfit = { earnCompletedBefore, earnCompletedAfter };
}

async function certifyCorporateTax(page) {
  await loadSession(page, midProgressFixture);
  const dashboard = await fetchDashboard(page);
  const taxCompleted = tutorialStepCompleted(dashboard.tutorial, 'corporate_tax');

  if (taxCompleted) {
    await certifyNpcContractFallback(page);
    return;
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await openCompanyOperations(page);
  await page.getByRole('button', { name: 'Finanzbuchungen anzeigen' }).click();

  const financeTitle = page.locator('#pg-finance-widget-title');
  await financeTitle.waitFor({ timeout: 60_000 });
  await financeTitle.scrollIntoViewIfNeeded();
  await screenshot(page, 'PGD-TUTORIAL-001_DESKTOP_COMPANY_FINANCE.png');

  summary.desktopCorporateTax = { taxCompletedBefore: taxCompleted };
}

async function certifyNpcContractFallback(page) {
  const dashboard = await fetchDashboard(page);
  const contractCompleted = tutorialStepCompleted(dashboard.tutorial, 'npc_supply_contract');
  if (contractCompleted) {
    summary.notRun.push({
      path: 'company contracts/finance secondary CTA',
      reason: 'Mid-progress fixture has both contract and tax steps complete; earn_profit certified',
    });
    return;
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await openCompanyOperations(page);
  await page.getByRole('button', { name: 'Lieferverträge anzeigen' }).click();
  const economyTitle = page.locator('#pg-economy-widget-title');
  await economyTitle.waitFor({ timeout: 60_000 });
  await economyTitle.scrollIntoViewIfNeeded();
  await screenshot(page, 'PGD-TUTORIAL-001_DESKTOP_COMPANY_CONTRACTS.png');
  summary.desktopNpcSupplyContract = { contractCompletedBefore: contractCompleted };
}

async function checkNarrowOverflow(page) {
  const overflow = await page.evaluate(() => {
    const panel = document.querySelector('.pg-tutorial-panel');
    if (panel === null) {
      return { panelFound: false, horizontalOverflow: null };
    }
    return {
      panelFound: true,
      horizontalOverflow: panel.scrollWidth > panel.clientWidth,
    };
  });
  assert(overflow.panelFound === true, 'narrow: tutorial panel found');
  assert(overflow.horizontalOverflow === false, 'narrow: no horizontal overflow on tutorial panel');
  summary.narrowOverflow = overflow;
}

await waitForRuntimeReady();

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

try {
  await certifyBuildSawmillFlow(page, 'desktop', { width: 1440, height: 900 });
  await certifyBuildSawmillFlow(page, 'narrow', { width: 480, height: 900 });

  await certifyBuyWood(page);
  await certifySellPlanks(page);
  await certifyProducePlanks(page);
  await certifyEarnProfit(page);
  await certifyCorporateTax(page);

  summary.overallResult = 'PASS';
} catch (error) {
  summary.overallResult = 'FAIL';
  summary.failure = error instanceof Error ? error.message : String(error);
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser.close();
}

await writeFile(
  path.join(evidenceDir, 'pgd-tutorial-001-runtime-evidence-run-summary.json'),
  `${JSON.stringify(summary, null, 2)}\n`,
  'utf8',
);

if (summary.overallResult === 'PASS') {
  console.log('PGD-TUTORIAL-001 runtime evidence captured.');
} else {
  console.error('PGD-TUTORIAL-001 runtime evidence capture FAILED.');
}
