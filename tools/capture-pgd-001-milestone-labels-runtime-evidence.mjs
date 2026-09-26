/* global document, console, process */
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ENABLED_MILESTONE_IDS = [
  'first_advanced_electronics',
  'first_consumer_goods',
  'first_industrial_machinery',
  'first_machine_parts',
  'first_production',
  'first_profit',
  'first_steel',
  'profit_100',
];

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
const savePath = path.join(projectRoot, 'saves/e2e-m11-phase6-production-closeout.json');

async function bootstrapSession(page) {
  const loadResponse = await page.request.post(`${webOrigin}/api/session/load`, {
    data: { filePath: savePath },
  });
  if (loadResponse.ok()) {
    return;
  }
  throw new Error(`Session load failed: ${loadResponse.status()} ${await loadResponse.text()}`);
}

async function openBuildingsCatalog(page) {
  await page.goto(`${webOrigin}/game?screen=buildings`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Baukatalog' }).waitFor({ timeout: 60_000 });
}

async function assertNoRawMilestoneIds(page) {
  const blockerTexts = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.pg-operation-hint-row')];
    return rows
      .map((row) => row.textContent ?? '')
      .filter((text) => text.includes('Meilenstein'));
  });

  const leaks = [];
  for (const text of blockerTexts) {
    for (const id of ENABLED_MILESTONE_IDS) {
      if (text.includes(id)) {
        leaks.push({ id, text: text.slice(0, 120) });
      }
    }
  }

  if (leaks.length > 0) {
    throw new Error(`Raw milestone IDs in blocker copy: ${JSON.stringify(leaks)}`);
  }

  return { blockerCount: blockerTexts.length, sample: blockerTexts.slice(0, 5) };
}

async function capture(viewport, fileName) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  await bootstrapSession(page);
  await openBuildingsCatalog(page);
  const assertion = await assertNoRawMilestoneIds(page);
  await page.screenshot({ path: path.join(evidenceDir, fileName), fullPage: true });
  await browser.close();
  return assertion;
}

const desktop = await capture(
  { width: 1440, height: 900 },
  'PGD_001_MILESTONE_LABELS_BUILDINGS_DESKTOP_1440x900.png',
);
const narrow = await capture(
  { width: 480, height: 900 },
  'PGD_001_MILESTONE_LABELS_BUILDINGS_NARROW_480x900.png',
);

console.log(
  JSON.stringify(
    {
      webOrigin,
      desktop,
      narrow,
      evidenceDir: path.relative(projectRoot, evidenceDir).replace(/\\/g, '/'),
    },
    null,
    2,
  ),
);
