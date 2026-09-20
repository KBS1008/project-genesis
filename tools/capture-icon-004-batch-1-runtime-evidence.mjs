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

async function loadSession(page) {
  const loadResponse = await page.request.post(`${webOrigin}/api/session/load`, {
    data: { filePath: savePath },
  });
  if (loadResponse.ok()) {
    return;
  }

  const newResponse = await page.request.post(`${webOrigin}/api/session/new`, {
    data: { name: 'ICON-004 Batch 1 Runtime Evidence' },
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

const BATCH_1_PRIMARY_FRAGMENT = '-primary';

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
    (fragment) => {
      const primaryImages = [
        ...document.querySelectorAll(`img[src*="${fragment}"]`),
      ];
      const researchImages = [
        ...document.querySelectorAll('img[src*="assets/research"]'),
      ];

      if (primaryImages.length < 8) {
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
    BATCH_1_PRIMARY_FRAGMENT,
    { timeout: 120_000 },
  );

  await page.waitForTimeout(750);
}

async function capture(viewport, fileName) {
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

await capture({ width: 1440, height: 900 }, 'ICON_004_PRODUCTION_BATCH_1_RESEARCH_DESKTOP.png');
await capture({ width: 480, height: 900 }, 'ICON_004_PRODUCTION_BATCH_1_RESEARCH_NARROW.png');

console.log('ICON-004 runtime evidence captured.');
