/* global document, console, fetch, process, setTimeout */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');
const savePath = 'D:/Cursor/Project Genesis/saves/e2e-m11-phase6-production-closeout.json';
const webOrigin = process.env.PG_WEB_ORIGIN ?? 'http://localhost:3000';

const EXPECTED_DETAILED_PRIMARIES = 18;
const BATCH_1_PRIMARY_FRAGMENT = '-primary';

async function loadSession(page) {
  const loadResponse = await page.request.post(`${webOrigin}/api/session/load`, {
    data: { filePath: savePath },
  });
  if (loadResponse.ok()) {
    return;
  }

  const newResponse = await page.request.post(`${webOrigin}/api/session/new`, {
    data: { name: 'ICON-004 Batch 3 Runtime Evidence' },
  });
  if (!newResponse.ok()) {
    throw new Error(`Session bootstrap failed: ${loadResponse.status()} / ${newResponse.status()}`);
  }
}

async function openResearchCatalog(page) {
  await page.goto(`${webOrigin}/game?screen=research`, { waitUntil: 'domcontentloaded' });
  const heading = page.getByRole('heading', { name: 'Forschungskatalog' });
  try {
    await heading.waitFor({ timeout: 20_000 });
  } catch {
    await page.evaluate(async (filePath) => {
      await fetch('/api/session/load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      });
    }, savePath);
    await page.goto(`${webOrigin}/game?screen=research`, { waitUntil: 'networkidle' });
    await heading.waitFor({ timeout: 60_000 });
  }
}

async function waitForResearchIcons(page) {
  await page.waitForSelector('.pg-operation-hint-list', { timeout: 60_000 });

  await page.evaluate(async () => {
    const rows = [...document.querySelectorAll('.pg-operation-hint-row')];
    for (const row of rows) {
      row.scrollIntoView({ block: 'center' });
      await new Promise((resolve) => {
        setTimeout(resolve, 120);
      });
    }
  });

  await page.waitForFunction(
    ({ expectedCount, fragment }) => {
      const primaryImages = [...document.querySelectorAll(`img[src*="${fragment}"]`)];
      const researchImages = [...document.querySelectorAll('img[src*="assets/research"]')];

      if (primaryImages.length < expectedCount) {
        return false;
      }

      const primariesReady = primaryImages.every(
        (img) => img.complete && img.naturalWidth > 0 && img.naturalHeight > 0,
      );
      const researchReady = researchImages.every(
        (img) => img.complete && img.naturalWidth > 0,
      );

      return primariesReady && researchReady;
    },
    { expectedCount: EXPECTED_DETAILED_PRIMARIES, fragment: BATCH_1_PRIMARY_FRAGMENT },
    { timeout: 120_000 },
  );

  await page.waitForTimeout(750);
}

async function captureMixedCoverage(page) {
  await page.evaluate(() => {
    const names = ['Distributionsnetze', 'Polymerwissenschaft', 'Unternehmensfuehrung'];
    for (const name of names) {
      const row = [...document.querySelectorAll('.pg-operation-hint-row')].find((element) =>
        element.textContent?.includes(name),
      );
      row?.scrollIntoView({ block: 'center' });
    }
  });
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(evidenceDir, 'ICON_004_PRODUCTION_BATCH_3_MIXED_COVERAGE.png'),
    fullPage: false,
  });
}

async function captureViewport(viewport, fileName) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  await loadSession(page);
  await openResearchCatalog(page);
  await page.getByRole('heading', { name: 'Forschungskatalog' }).scrollIntoViewIfNeeded();
  await waitForResearchIcons(page);
  await page.screenshot({
    path: path.join(evidenceDir, fileName),
    fullPage: true,
  });
  await browser.close();
}

async function captureMixedViewport() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await loadSession(page);
  await openResearchCatalog(page);
  await waitForResearchIcons(page);
  await captureMixedCoverage(page);
  await browser.close();
}

await captureViewport({ width: 1440, height: 900 }, 'ICON_004_PRODUCTION_BATCH_3_RESEARCH_DESKTOP.png');
await captureViewport({ width: 480, height: 900 }, 'ICON_004_PRODUCTION_BATCH_3_RESEARCH_NARROW.png');
await captureMixedViewport();

console.log('ICON-004 Batch 3 runtime evidence captured.');
