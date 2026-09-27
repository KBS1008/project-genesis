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

function assertNoTickTerminologyIn(text) {
  if (/\bTicks?\b/i.test(text)) {
    throw new Error(`Player-facing Tick/Ticks terminology found: ${text.slice(0, 400)}`);
  }
}

async function openGameScreen(page, screen, viewport) {
  await page.setViewportSize(viewport);
  await bootstrapSession(page);
  await page.goto(`${webOrigin}/game?screen=${screen}`, { waitUntil: 'domcontentloaded' });
  await waitForActiveWorkspace(page);
}

async function captureCompanyOperations(page, viewport, fileName) {
  await openGameScreen(page, 'company', viewport);
  await page.getByText(/Zyklus \d+/).first().waitFor({ timeout: 120_000 });
  await openOperationsDashboard(page);
  await page.getByText(/alle \d+ Zyklen|Payroll \/ \d+ Zyklen/i).first().waitFor({ timeout: 60_000 });

  const bodyText = await page.locator('body').innerText();
  if (!bodyText.includes('Zyklen') && !bodyText.includes('Zyklus')) {
    throw new Error('Expected Zyklus/Zyklen copy on Company/Operations surface.');
  }
  assertNoTickTerminologyIn(bodyText);

  await page.screenshot({ path: path.join(evidenceDir, fileName), fullPage: true });
  return {
    viewport,
    sampleCopy: bodyText.replace(/\s+/g, ' ').slice(0, 320),
  };
}

async function captureProductionHint(page, viewport, fileName) {
  await openGameScreen(page, 'production', viewport);
  await page.getByRole('heading', { name: 'Rezeptkatalog' }).waitFor({ timeout: 120_000 });

  const hintRows = page.locator('.pg-operation-hint-row .pg-operation-hint-copy');
  await hintRows.first().waitFor({ timeout: 60_000 });
  const hintCount = await hintRows.count();
  let transportHintSample = null;

  for (let index = 0; index < hintCount; index += 1) {
    const copy = (await hintRows.nth(index).innerText()).replace(/\s+/g, ' ').trim();
    if (copy.includes('Transport startet automatisch') && copy.includes('~')) {
      transportHintSample = copy;
      break;
    }
  }

  const bodyText = await page.locator('body').innerText();
  assertNoTickTerminologyIn(bodyText);

  if (transportHintSample !== null) {
    if (!/~\d+ Zykl/.test(transportHintSample)) {
      throw new Error(`Transport hint missing cycle duration pattern: ${transportHintSample}`);
    }
  } else {
    const recipeDuration = page.getByText(/\d+ Zyklen/).first();
    await recipeDuration.waitFor({ timeout: 30_000 });
  }

  await page.screenshot({ path: path.join(evidenceDir, fileName), fullPage: true });
  return {
    viewport,
    transportHintSample,
    resourceHintPresent: bodyText.includes('Benötigt'),
  };
}

async function openOperationsDashboard(page) {
  const operationsTab = page.getByRole('button', { name: 'Operatives Dashboard' });
  if (await operationsTab.isVisible()) {
    await operationsTab.click();
  }
}

async function captureChartCyclePresentation(page, viewport, fileName) {
  await openGameScreen(page, 'company', viewport);

  let chart = page.locator('.pg-executive-charts .recharts-wrapper').first();
  if ((await chart.count()) === 0) {
    await openOperationsDashboard(page);
    chart = page.locator('.pg-operations-charts .recharts-wrapper').first();
  }

  await chart.waitFor({ timeout: 120_000 });
  await chart.scrollIntoViewIfNeeded();

  const box = await chart.boundingBox();
  if (box === null) {
    throw new Error('Chart bounding box missing for tooltip certification.');
  }

  await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.5);
  await page.waitForTimeout(800);

  const tooltipLabel = page.locator('.pg-chart-tooltip-label').first();
  await tooltipLabel.waitFor({ timeout: 30_000 });
  const tooltipText = await tooltipLabel.innerText();
  if (!/^Zyklus \d+$/.test(tooltipText.trim())) {
    throw new Error(`Unexpected chart tooltip label: ${tooltipText}`);
  }
  assertNoTickTerminologyIn(tooltipText);

  await page.screenshot({ path: path.join(evidenceDir, fileName), fullPage: true });
  return { viewport, chartTooltipLabel: tooltipText.trim() };
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const companyDesktop = await captureCompanyOperations(
  page,
  { width: 1440, height: 900 },
  'TIME_UX_R1_COMPANY_CYCLE_TERMINOLOGY_DESKTOP_1440x900.png',
);

const productionDesktop = await captureProductionHint(
  page,
  { width: 1440, height: 900 },
  'TIME_UX_R1_PRODUCTION_CYCLE_HINT_DESKTOP_1440x900.png',
);

const chartDesktop = await captureChartCyclePresentation(
  page,
  { width: 1440, height: 900 },
  'TIME_UX_R1_CHART_CYCLE_TERMINOLOGY_DESKTOP_1440x900.png',
);

const narrow = await captureCompanyOperations(
  page,
  { width: 480, height: 900 },
  'TIME_UX_R1_CYCLE_TERMINOLOGY_NARROW_480x900.png',
);

await browser.close();

console.log(
  JSON.stringify(
    {
      webOrigin,
      savePath,
      evidenceDir,
      companyDesktop,
      productionDesktop,
      chartDesktop,
      narrow,
      toolingNotes:
        'Loads deterministic PGD-RES-001 evidence save via API; navigates only; no tick execution or timing changes.',
    },
    null,
    2,
  ),
);
