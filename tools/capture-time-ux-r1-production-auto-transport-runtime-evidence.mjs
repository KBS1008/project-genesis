/* global document, console, process */
import path from 'node:path';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
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
const fixturePath = path.join(
  projectRoot,
  'tools/evidence-fixtures/time-ux-r1-production-auto-transport-hint.json',
);
const savePath = (process.env.PG_EVIDENCE_SAVE ?? fixturePath).replace(/\\/g, '/');

const CERTIFIED = Object.freeze({
  recipeId: 'recipe_planks',
  recipeName: 'Bretter herstellen',
  buildingId: 'building_005',
  hintPrefix: 'Material im Lagerhaus — Transport startet automatisch',
});

if (!existsSync(savePath)) {
  execSync('node tools/build-time-ux-r1-auto-transport-evidence-fixture.mjs', {
    cwd: projectRoot,
    stdio: 'inherit',
  });
}

execSync(
  'pnpm exec vitest run src/application/facade/time-ux-r1-auto-transport-evidence.test.ts',
  { cwd: projectRoot, stdio: 'inherit' },
);

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

function parseAutoTransportHint(reason) {
  const match = reason.match(
    /Material im Lagerhaus — Transport startet automatisch \((~)(\d+)\s+(Zyklus|Zyklen)\)\./,
  );

  if (match === null) {
    throw new Error(`Auto-transport hint pattern missing: ${reason}`);
  }

  return {
    approximateMarker: match[1],
    numericN: Number(match[2]),
    unit: match[3],
    fullReason: reason,
  };
}

async function fetchDashboardHint(page) {
  const response = await page.request.get(`${webOrigin}/api/dashboard`);

  if (!response.ok()) {
    throw new Error(`Dashboard fetch failed: ${response.status()} ${await response.text()}`);
  }

  const payload = await response.json();
  const dashboard = payload.data ?? payload;
  const hint = dashboard.hints?.production?.find(
    (entry) =>
      entry.recipeId === CERTIFIED.recipeId && entry.buildingId === CERTIFIED.buildingId,
  );

  if (hint?.reason === undefined || hint.reason === null) {
    throw new Error('Expected production auto-transport hint on dashboard API.');
  }

  return parseAutoTransportHint(hint.reason);
}

async function captureProductionAutoTransport(page, viewport, fileName) {
  await page.setViewportSize(viewport);
  await bootstrapSession(page);
  await page.goto(`${webOrigin}/game?screen=production`, { waitUntil: 'domcontentloaded' });
  await waitForActiveWorkspace(page);
  await page.getByRole('heading', { name: 'Rezeptkatalog' }).waitFor({ timeout: 120_000 });

  const apiHint = await fetchDashboardHint(page);

  const hintRow = page
    .locator('.pg-operation-hint-row')
    .filter({ hasText: CERTIFIED.recipeName })
    .filter({ hasText: CERTIFIED.hintPrefix })
    .first();

  await hintRow.waitFor({ timeout: 60_000 });

  const scopedReasonSpan = hintRow.locator('.pg-operation-hint-copy span').last();
  const normalizedScoped = (await scopedReasonSpan.innerText()).replace(/\s+/g, ' ').trim();

  if (!normalizedScoped.includes(CERTIFIED.hintPrefix)) {
    throw new Error(`Scoped hint missing prefix: ${normalizedScoped.slice(0, 240)}`);
  }

  if (/\bTicks?\b/i.test(normalizedScoped)) {
    throw new Error(`Tick/Ticks visible in scoped hint: ${normalizedScoped.slice(0, 240)}`);
  }

  const scopedParsed = parseAutoTransportHint(normalizedScoped);

  if (scopedParsed.numericN !== apiHint.numericN) {
    throw new Error(
      `Visible N ${scopedParsed.numericN} differs from dashboard N ${apiHint.numericN}`,
    );
  }

  if (apiHint.unit !== (apiHint.numericN === 1 ? 'Zyklus' : 'Zyklen')) {
    throw new Error(`Unexpected unit grammar: ${apiHint.unit} for N=${apiHint.numericN}`);
  }

  await page.screenshot({ path: path.join(evidenceDir, fileName), fullPage: true });

  return {
    recipeId: CERTIFIED.recipeId,
    buildingId: CERTIFIED.buildingId,
    internalNumericN: apiHint.numericN,
    visibleNumericN: scopedParsed.numericN,
    visibleHint: normalizedScoped.slice(0, 260),
    apiReason: apiHint.fullReason,
    approximateMarker: apiHint.approximateMarker,
    unit: apiHint.unit,
  };
}

const chromium = await loadChromium();
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const productionDesktop = await captureProductionAutoTransport(
  page,
  { width: 1440, height: 900 },
  'TIME_UX_R1_PRODUCTION_AUTO_TRANSPORT_CYCLE_HINT_DESKTOP_1440x900.png',
);

await browser.close();

console.log(
  JSON.stringify(
    {
      webOrigin,
      savePath,
      evidenceDir,
      productionDesktop,
      toolingNotes:
        'Loads TIME-UX-R1 auto-transport evidence fixture via API before Production navigation; no gameplay commands.',
    },
    null,
    2,
  ),
);
