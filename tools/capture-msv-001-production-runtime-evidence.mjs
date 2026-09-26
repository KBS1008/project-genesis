/* global document, console, process */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

async function loadChromium() {
  const localPlaywright = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    'capture-evidence-tmp/node_modules/playwright/index.mjs',
  );
  const playwright = await import(pathToFileURL(localPlaywright).href);
  return playwright.chromium;
}

const chromium = await loadChromium();
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'docs/architecture/reviews/evidence');
const savePath = 'D:/Cursor/Project Genesis/saves/e2e-m11-phase6-production-closeout.json';
const webOrigin = process.env.PG_WEB_ORIGIN ?? 'http://localhost:3000';

async function loadSession(page) {
  const loadResponse = await page.request.post(`${webOrigin}/api/session/load`, {
    data: { filePath: savePath },
  });
  if (!loadResponse.ok()) throw new Error(`Session load failed: ${loadResponse.status()}`);
}

async function openOperations(page) {
  const url = `${webOrigin}/game?screen=company&entity=employee:employee_001`;
  await loadSession(page);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('.pg-milestones-widget', { timeout: 90_000 });
  await page.waitForSelector('.pg-milestones-widget .pg-milestone-visual', { timeout: 90_000 });
  await waitForMilestoneArtLoaded(page);
}

async function waitForMilestoneArtLoaded(page) {
  await page.waitForFunction(
    () => {
      const imgs = [...document.querySelectorAll('.pg-milestones-widget .pg-milestone-visual')];
      if (imgs.length === 0) return false;
      return imgs.every((img) => {
        const el = /** @type {HTMLImageElement} */ (img);
        return el.complete && el.naturalWidth > 0;
      });
    },
    undefined,
    { timeout: 60_000 },
  );
}

async function capture(page, name, viewport) {
  await page.setViewportSize(viewport);
  await openOperations(page);
  await page.locator('.pg-milestones-widget').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const out = path.join(evidenceDir, name);
  await page.screenshot({ path: out, fullPage: false });
  console.log('wrote', out);
}

async function captureLockedCompleted(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openOperations(page);
  await page.locator('.pg-milestones-widget').scrollIntoViewIfNeeded();
  const widget = page.locator('.pg-milestones-widget');
  await widget.screenshot({
    path: path.join(evidenceDir, 'MSV_001_PRODUCTION_RUNTIME_LOCKED_COMPLETED.png'),
  });
  console.log('wrote locked/completed widget capture');
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  await fs.mkdir(evidenceDir, { recursive: true });
  await capture(page, 'MSV_001_PRODUCTION_RUNTIME_DESKTOP.png', { width: 1440, height: 900 });
  await capture(page, 'MSV_001_PRODUCTION_RUNTIME_NARROW.png', { width: 480, height: 900 });
  await captureLockedCompleted(page);
} finally {
  await browser.close();
}
