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

if (!existsSync(savePath)) {
  throw new Error(
    `Evidence save missing: ${savePath}. Run: node tools/build-research-status-001-evidence-fixture.mjs`,
  );
}

const RAW_RESEARCH_ENUMS = ['WAITING', 'RUNNING', 'FINISHED', 'CANCELLED'];

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

function assertNoRawResearchEnums(text, scopeLabel) {
  for (const token of RAW_RESEARCH_ENUMS) {
    if (text.includes(token)) {
      throw new Error(`${scopeLabel} still contains raw research enum: ${token}`);
    }
  }
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
  await page.goto(`${webOrigin}/game?screen=research`, { waitUntil: 'networkidle' });
  await waitForActiveWorkspace(page);

  const researchTable = page.locator('.pg-operation-screen [role="table"]');
  await researchTable.waitFor({ timeout: 60_000 });
  const researchTableText = await researchTable.innerText();
  assertNoRawResearchEnums(researchTableText, `Forschung table (${label})`);
  if (
    !researchTableText.includes('Wartend') ||
    !researchTableText.includes('Laufend') ||
    !researchTableText.includes('Abgeschlossen')
  ) {
    throw new Error(`Forschung table missing expected German labels (${label}): ${researchTableText}`);
  }

  await page.screenshot({
    path: path.join(evidenceDir, `RESEARCH_STATUS_001_RESEARCH_SCREEN_${label}.png`),
    fullPage: true,
  });

  await page.goto(`${webOrigin}/game?screen=company`, { waitUntil: 'networkidle' });
  await waitForActiveWorkspace(page);
  await page.getByRole('button', { name: 'Operatives Dashboard' }).click();
  await page.waitForSelector('.pg-research-widget', { timeout: 60_000 });

  const researchWidget = page.locator('.pg-research-widget');
  const operationsText = await researchWidget.innerText();
  assertNoRawResearchEnums(operationsText, `Company research widget (${label})`);
  if (!operationsText.includes('Laufend') || !operationsText.includes('Wartend')) {
    throw new Error(`Company research rows missing German labels (${label})`);
  }

  await researchWidget.locator('[role="row"]').filter({ hasText: 'Abgeschlossen' }).first().click();
  await page.waitForSelector('.pg-inspector-panel', { timeout: 60_000 });
  const inspectorText = await page.locator('.pg-inspector-panel').innerText();
  assertNoRawResearchEnums(inspectorText, `Research inspector (${label})`);
  if (!inspectorText.includes('Status') || !inspectorText.match(/Abgeschlossen|Laufend|Wartend/)) {
    throw new Error(`Research inspector missing formatted Status (${label}): ${inspectorText}`);
  }
  if (!inspectorText.includes('Job-ID')) {
    throw new Error(`Research Job-ID field must remain visible (${label})`);
  }

  await page.screenshot({
    path: path.join(
      evidenceDir,
      label === 'DESKTOP_1440x900'
        ? 'RESEARCH_STATUS_001_COMPANY_RESEARCH_DESKTOP_1440x900.png'
        : `RESEARCH_STATUS_001_COMPANY_RESEARCH_${label}.png`,
    ),
    fullPage: true,
  });

  await context.close();
}

await browser.close();
console.log('RESEARCH-STATUS-001 runtime evidence captured.');
