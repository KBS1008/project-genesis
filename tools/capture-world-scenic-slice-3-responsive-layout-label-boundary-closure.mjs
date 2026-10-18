/**
 * Slice 3 closure — narrow layout, label boundaries, horizontal overflow.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '../tools/capture-evidence-tmp/node_modules/playwright/index.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envFlag = process.env.NEXT_PUBLIC_PG_WORLD_SCENIC_BACKGROUND ?? '';
const scenicOn = envFlag === '1' || envFlag === 'true';
const mode = scenicOn ? 'scenic-on' : 'scenic-off';
const evidenceRoot = path.join(
  root,
  'docs/design/world/web-final-2d-scenic-pilot/evidence/production-slice-3-responsive-layout-label-boundary-closure',
);

const BASE = process.env.PG_EVIDENCE_BASE_URL ?? 'http://127.0.0.1:3000';
const API = process.env.PG_EVIDENCE_API_URL ?? 'http://127.0.0.1:3001';
const WORK_SAVE = 'saves/scenic-slice-1-pdm-gate-working.json';
const BASELINE_SAVE = 'saves/scenic-slice-1-pdm-gate-baseline.json';

const VIEWPORTS = [
  { key: 'desktop-1440', width: 1440, height: 900 },
  { key: 'desktop-1280', width: 1280, height: 800 },
  { key: 'tablet-1024', width: 1024, height: 768 },
  { key: 'narrow-768', width: 768, height: 900 },
  { key: 'narrow-480', width: 480, height: 900 },
  { key: 'narrow-390', width: 390, height: 844 },
];

async function apiLoad(filePath) {
  await fetch(`${API}/api/session/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filePath }),
  });
}

async function gotoWorld(page, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(`${BASE}/game`, { waitUntil: 'networkidle', timeout: 120_000 });
  await page.getByRole('button', { name: 'Welt', exact: true }).click();
  await page.waitForSelector('svg.pg-world-canvas', { timeout: 60_000 });
  await page.waitForTimeout(1400);
}

async function shot(page, subdir, name) {
  await mkdir(path.join(evidenceRoot, subdir), { recursive: true });
  const rel = `${subdir}/${name}--${mode}.png`;
  await page.screenshot({ path: path.join(evidenceRoot, rel), fullPage: false });
  return rel;
}

async function measureLayoutChain(page) {
  return page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (el === null) return null;
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        width: rect.width,
        height: rect.height,
        left: rect.left,
        computedWidth: style.width,
        minWidth: style.minWidth,
        maxWidth: style.maxWidth,
        display: style.display,
        overflowX: style.overflowX,
      };
    };
    const doc = document.documentElement;
    const body = document.body;
    return {
      window: { innerWidth: window.innerWidth, innerHeight: window.innerHeight },
      document: {
        clientWidth: doc.clientWidth,
        scrollWidth: doc.scrollWidth,
        horizontalOverflowPx: Math.max(0, doc.scrollWidth - doc.clientWidth),
      },
      body: {
        scrollWidth: body.scrollWidth,
        clientWidth: body.clientWidth,
      },
      shellMain: pick('.pg-application-shell-main'),
      frameMain: pick('.pg-workspace-frame-main'),
      workspace: pick('.pg-world-workspace'),
      mapColumn: pick('.pg-world-map-column'),
      viewport: pick('.pg-world-viewport'),
      plate: pick('.pg-world-scenic-background-image'),
      frameGrid: (() => {
        const frame = document.querySelector('.pg-workspace-frame-with-inspector');
        return frame ? getComputedStyle(frame).gridTemplateColumns : null;
      })(),
      worldLayoutGrid: (() => {
        const layout = document.querySelector('.pg-world-layout');
        return layout ? getComputedStyle(layout).gridTemplateColumns : null;
      })(),
    };
  });
}

async function measureLabelBoundaries(page) {
  return page.evaluate(() => {
    const viewport = document.querySelector('.pg-world-viewport');
    const vp = viewport?.getBoundingClientRect();
    if (vp === undefined) return null;
    const labels = [...document.querySelectorAll('.pg-world-scenic-region-label')];
    return labels.map((el) => {
      const rect = el.getBoundingClientRect();
      const text = el.textContent ?? '';
      return {
        text,
        box: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom },
        marginsToViewport: {
          left: rect.left - vp.left,
          right: vp.right - rect.right,
          top: rect.top - vp.top,
          bottom: vp.bottom - rect.bottom,
        },
        fullyInsideViewport:
          rect.left >= vp.left &&
          rect.right <= vp.right &&
          rect.top >= vp.top &&
          rect.bottom <= vp.bottom,
      };
    });
  });
}

function markerAnchorCenter(page, selector) {
  return page.evaluate((sel) => {
    const viewport = document.querySelector('.pg-world-viewport');
    const vp = viewport?.getBoundingClientRect();
    const el = document.querySelector(sel);
    if (el === null) return null;
    const hit = el.querySelector('.pg-world-building-marker-hit');
    const rect = (hit ?? el).getBoundingClientRect();
    const screen = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    if (vp === undefined) return { screen, viewportLocal: null };
    return {
      screen,
      viewportLocal: { x: screen.x - vp.left, y: screen.y - vp.top },
    };
  }, selector);
}

async function main() {
  await mkdir(path.join(evidenceRoot, 'tests'), { recursive: true });
  await mkdir(path.join(evidenceRoot, 'review-overview'), { recursive: true });
  await mkdir(path.join(evidenceRoot, 'baseline'), { recursive: true });
  try {
    await apiLoad(WORK_SAVE);
  } catch {
    /* optional */
  }

  const manifest = {
    capturedAt: new Date().toISOString(),
    mode,
    envFlag: envFlag || '(unset)',
    shots: [],
    viewports: [],
    placementRecord: null,
    modeAttribution: null,
  };

  const browser = await chromium.launch();
  const page = await (await browser.newContext()).newPage();

  for (const vp of VIEWPORTS) {
    await gotoWorld(page, vp);
    if (vp.key === 'desktop-1440') {
      manifest.modeAttribution = await page.evaluate(() => ({
        scenicBanner: document.querySelector('.pg-world-scenic-integration-banner') !== null,
        scenicPlate: document.querySelector('.pg-world-scenic-background-image') !== null,
      }));
      if (scenicOn && !manifest.modeAttribution.scenicPlate) {
        throw new Error('Scenic ON but plate missing — restart web with scenic flag');
      }
      if (!scenicOn && manifest.modeAttribution.scenicPlate) {
        throw new Error('Scenic OFF but plate visible');
      }
    }

    await page.getByRole('button', { name: /Welt einpassen/i }).first().click();
    await page.waitForTimeout(800);

    const layoutChain = await measureLayoutChain(page);
    const labelBoundaries = scenicOn ? await measureLabelBoundaries(page) : null;
    manifest.viewports.push({
      key: vp.key,
      size: vp,
      layoutChain,
      labelBoundaries,
    });

    manifest.shots.push(await shot(page, 'layout', `${vp.key}-fitWorld`));
    if (scenicOn && vp.key === 'desktop-1440') {
      manifest.shots.push(await shot(page, 'labels', 'four-region-labels-fitWorld'));
    }
    if (scenicOn && vp.key === 'narrow-480') {
      manifest.shots.push(await shot(page, 'responsive', 'narrow-480-map'));
      await page.getByRole('row', { name: /Central Basin/i }).first().click();
      await page.waitForTimeout(500);
      manifest.shots.push(await shot(page, 'responsive', 'narrow-480-region-select'));
    }
  }

  if (scenicOn) {
    await gotoWorld(page, { width: 1440, height: 900 });
    await page.getByRole('button', { name: 'Gebäude', exact: true }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Position auf Karte wählen' }).click();
    await page.waitForTimeout(700);
    const vpLoc = page.locator('.pg-world-viewport');
    const pick = { x: 220, y: 200 };
    await vpLoc.click({ position: pick, force: true });
    await page.waitForTimeout(600);
    manifest.shots.push(await shot(page, 'buildings', 'pdm-preview'));
    const confirm = page.getByRole('button', { name: 'Gebäude platzieren' });
    if (await confirm.isEnabled()) {
      await confirm.click();
      await page.waitForTimeout(1800);
      manifest.shots.push(await shot(page, 'buildings', 'pdm-confirmed'));
      await apiLoad(BASELINE_SAVE);
    }
  }

  const overview = `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"/><title>Slice 3 Closure ${mode}</title>
<style>body{font-family:system-ui;background:#111;color:#eee;padding:16px} pre{background:#222;padding:12px;overflow:auto;font-size:12px}</style></head><body>
<h1>Slice 3 Responsive & Label Closure — ${mode}</h1><pre>${JSON.stringify(manifest.viewports, null, 2)}</pre></body></html>`;
  await writeFile(path.join(evidenceRoot, 'review-overview', `index--${mode}.html`), overview);
  await writeFile(
    path.join(evidenceRoot, 'tests', `manifest--${mode}.json`),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  await browser.close();
  console.log(`Closure evidence (${mode}) → ${evidenceRoot}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
