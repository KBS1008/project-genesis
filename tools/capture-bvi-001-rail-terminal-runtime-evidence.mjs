/* global document, HTMLImageElement, console, process */
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const EXPECTED_RAIL_WEBP_SHA256 =
  '99c9d8312dc6c4f034a7ebe62b4942dfe9407d531e8be89d39dccada5f0460cd';

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
const webOrigin = process.env.PG_WEB_ORIGIN ?? 'http://localhost:3000';

async function bootstrapSession(page) {
  const savePath = path.join(projectRoot, 'saves/e2e-m11-phase6-production-closeout.json');
  const loadResponse = await page.request.post(`${webOrigin}/api/session/load`, {
    data: { filePath: savePath },
  });
  if (loadResponse.ok()) {
    return;
  }
  const newResponse = await page.request.post(`${webOrigin}/api/session/new`, {
    data: { name: `BVI-001 runtime certification ${Date.now()}` },
  });
  if (!newResponse.ok()) {
    throw new Error(`Session bootstrap failed: load ${loadResponse.status()} new ${newResponse.status()} ${await newResponse.text()}`);
  }
}

async function openBuildingsCatalog(page) {
  await page.goto(`${webOrigin}/game?screen=buildings`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Baukatalog' }).waitFor({ timeout: 60_000 });
}

async function waitForCardArt(page, assetId) {
  await page.waitForFunction(
    (id) => {
      const img = document.querySelector(`img[src*="${id}"]`);
      return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0;
    },
    assetId,
    { timeout: 120_000 },
  );
}

async function captureCardPair(viewport, desktopName, narrowName) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  await bootstrapSession(page);
  await openBuildingsCatalog(page);

  const bahn = page.getByText('Bahnterminal', { exact: true }).first();
  await bahn.scrollIntoViewIfNeeded();
  await waitForCardArt(page, 'ICON-003-rail_terminal');
  await waitForCardArt(page, 'ICON-003-recycling_facility');

  const resolution = await page.evaluate(() => {
    const rail = document.querySelector('img[src*="ICON-003-rail_terminal"]');
    const rec = document.querySelector('img[src*="ICON-003-recycling_facility"]');
    return {
      railSrc: rail instanceof HTMLImageElement ? rail.src : null,
      recSrc: rec instanceof HTMLImageElement ? rec.src : null,
      sameSrc: rail instanceof HTMLImageElement && rec instanceof HTMLImageElement ? rail.src === rec.src : false,
    };
  });

  if (resolution.sameSrc) {
    await browser.close();
    throw new Error('Bahnterminal and Recyclinganlage resolved to the same runtime src');
  }
  if (!resolution.railSrc?.includes('ICON-003-rail_terminal')) {
    await browser.close();
    throw new Error(`Unexpected rail_terminal src: ${resolution.railSrc}`);
  }

  await page.screenshot({ path: path.join(evidenceDir, desktopName), fullPage: true });
  await browser.close();

  const browserN = await chromium.launch({ headless: true });
  const pageN = await browserN.newPage({ viewport: { width: 480, height: 900 } });
  await bootstrapSession(pageN);
  await openBuildingsCatalog(pageN);
  await pageN.getByText('Bahnterminal', { exact: true }).first().scrollIntoViewIfNeeded();
  await waitForCardArt(pageN, 'ICON-003-rail_terminal');
  await pageN.screenshot({ path: path.join(evidenceDir, narrowName), fullPage: true });
  await browserN.close();

  return resolution;
}

const desktopName = 'BVI-001_RAIL_TERMINAL_RUNTIME_CATALOG_DESKTOP_1440x900.png';
const narrowName = 'BVI-001_RAIL_TERMINAL_RUNTIME_CATALOG_NARROW_480x900.png';

const resolution = await captureCardPair({ width: 1440, height: 900 }, desktopName, narrowName);

const runtimeWebpPath = path.join(
  projectRoot,
  'apps/web/public/assets/buildings/ICON-003-rail_terminal.webp',
);
const runtimeWebpBytes = await readFile(runtimeWebpPath);
const runtimeWebpSha256 = createHash('sha256').update(runtimeWebpBytes).digest('hex');
if (runtimeWebpSha256 !== EXPECTED_RAIL_WEBP_SHA256) {
  throw new Error(
    `Runtime WebP hash mismatch: expected ${EXPECTED_RAIL_WEBP_SHA256} got ${runtimeWebpSha256}`,
  );
}

const summary = {
  capturedAtUtc: new Date().toISOString(),
  webOrigin,
  savePath: path.join(projectRoot, 'saves/e2e-m11-phase6-production-closeout.json'),
  expectedRuntimeWebpSha256: EXPECTED_RAIL_WEBP_SHA256,
  verifiedRuntimeWebpSha256: runtimeWebpSha256,
  resolution,
  evidence: {
    desktop: path.join(evidenceDir, desktopName),
    narrow: path.join(evidenceDir, narrowName),
  },
};

await writeFile(
  path.join(evidenceDir, 'bvi001-runtime-evidence-run-summary.json'),
  `${JSON.stringify(summary, null, 2)}\n`,
);

console.log(JSON.stringify(summary, null, 2));
