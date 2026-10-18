/**
 * Slice 3 — world layout, labels, buildings, interaction evidence.
 * Restart web when switching NEXT_PUBLIC_PG_WORLD_SCENIC_BACKGROUND.
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
  'docs/design/world/web-final-2d-scenic-pilot/evidence/production-slice-3-world-presentation-label-legibility',
);

const BASE = process.env.PG_EVIDENCE_BASE_URL ?? 'http://127.0.0.1:3000';
const API = process.env.PG_EVIDENCE_API_URL ?? 'http://127.0.0.1:3001';
const WORK_SAVE = 'saves/scenic-slice-1-pdm-gate-working.json';
const BASELINE_SAVE = 'saves/scenic-slice-1-pdm-gate-baseline.json';

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
  await page.waitForTimeout(1600);
}

async function shot(page, subdir, name) {
  const dir = path.join(evidenceRoot, subdir);
  await mkdir(dir, { recursive: true });
  const fileName = `${name}--${mode}.png`;
  const rel = `${subdir}/${fileName}`;
  await page.screenshot({ path: path.join(evidenceRoot, rel), fullPage: false });
  return rel;
}

async function measureLayout(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const workspace = document.querySelector('.pg-world-workspace');
    const mapColumn = document.querySelector('.pg-world-map-column');
    const viewport = document.querySelector('.pg-world-viewport');
    const plateImg = document.querySelector('.pg-world-scenic-background-image');
    const shellMain = document.querySelector('.pg-application-shell-main');
    const r = (el) => (el ? el.getBoundingClientRect() : null);
    const v = r(viewport);
    const p = r(plateImg);
    const toolbar = document.querySelector('.pg-world-toolbar-status')?.textContent ?? '';
    const zoomMatch = toolbar.match(/(\d+)\s*%/);
    return {
      browserViewport: { width: window.innerWidth, height: window.innerHeight },
      documentScrollWidth: doc.scrollWidth,
      shellMainCss: shellMain ? { width: r(shellMain).width, height: r(shellMain).height } : null,
      workspaceCss: workspace ? { width: r(workspace).width, height: r(workspace).height } : null,
      mapColumnCss: mapColumn ? { width: r(mapColumn).width, height: r(mapColumn).height } : null,
      viewportCss: v ? { width: v.width, height: v.height } : null,
      plateCss: p ? { width: p.width, height: p.height } : null,
      plateUtilization:
        v && p ? { widthRatio: p.width / v.width, heightRatio: p.height / v.height } : null,
      toolbarZoomPercent: zoomMatch ? Number(zoomMatch[1]) : null,
      horizontalOverflowPx: Math.max(0, doc.scrollWidth - window.innerWidth),
    };
  });
}

async function measureLabelBoxes(page) {
  return page.evaluate(() => {
    const labels = [...document.querySelectorAll('.pg-world-scenic-region-label')];
    return labels.map((el, index) => {
      const rect = el.getBoundingClientRect();
      const text = el.textContent ?? '';
      return {
        index,
        text,
        box: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom },
      };
    });
  });
}

function overlapArea(a, b) {
  const w = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const h = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return w * h;
}

function computeLabelOverlaps(boxes) {
  const pairs = [];
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const area = overlapArea(boxes[i].box, boxes[j].box);
      if (area > 0) {
        pairs.push({
          a: boxes[i].text,
          b: boxes[j].text,
          overlapAreaPx: area,
        });
      }
    }
  }
  return pairs;
}

async function main() {
  await mkdir(path.join(evidenceRoot, 'tests'), { recursive: true });
  await mkdir(path.join(evidenceRoot, 'review-overview'), { recursive: true });
  try {
    await apiLoad(WORK_SAVE);
  } catch {
    /* optional */
  }

  const manifest = {
    capturedAt: new Date().toISOString(),
    mode,
    envFlag: envFlag || '(unset)',
    save: WORK_SAVE,
    shots: [],
    layout: [],
    labelOverlap: null,
    placementRecord: null,
    modeAttribution: null,
  };

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await gotoWorld(page, { width: 1440, height: 900 });
  manifest.modeAttribution = await page.evaluate(() => ({
    scenicBanner: document.querySelector('.pg-world-scenic-integration-banner') !== null,
    scenicPlate: document.querySelector('.pg-world-scenic-background-image') !== null,
  }));
  if (scenicOn && !manifest.modeAttribution.scenicPlate) {
    throw new Error('Scenic ON capture but plate missing — restart web with scenic flag');
  }
  if (!scenicOn && manifest.modeAttribution.scenicPlate) {
    throw new Error('Scenic OFF capture but plate visible — restart web without scenic flag');
  }

  manifest.layout.push({ phase: 'initial', ...(await measureLayout(page)) });
  manifest.shots.push(await shot(page, scenicOn ? 'scenic-on' : 'scenic-off', '01-initial-desktop'));

  await page.getByRole('button', { name: /Welt einpassen/i }).first().click();
  await page.waitForTimeout(900);
  manifest.layout.push({ phase: 'after-fitWorld', ...(await measureLayout(page)) });
  manifest.shots.push(await shot(page, 'layout', '02-fitWorld-desktop'));

  if (scenicOn) {
    manifest.shots.push(await shot(page, 'labels', '03-four-region-labels'));
    const labelBoxes = await measureLabelBoxes(page);
    manifest.labelOverlap = {
      viewport: { width: 1440, height: 900 },
      zoomPercent: manifest.layout.at(-1)?.toolbarZoomPercent ?? null,
      boxes: labelBoxes,
      pairs: computeLabelOverlaps(labelBoxes),
    };

    const regions = [
      ['Northern Highlands', '04-region-northern-highlands'],
      ['Central Basin', '05-region-central-basin'],
      ['Eastern Industrial Belt', '06-region-eastern-industrial'],
      ['Southern Coastal Belt', '07-region-southern-coastal'],
    ];
    for (const [label, slug] of regions) {
      await page.getByRole('row', { name: new RegExp(label, 'i') }).first().click();
      await page.waitForTimeout(700);
      manifest.shots.push(await shot(page, 'labels', slug));
    }

    manifest.shots.push(await shot(page, 'buildings', '08-dynamic-buildings'));

    const firstMarker = page.locator('.pg-world-building-marker:not(.is-preview)').first();
    if (await firstMarker.count()) {
      await firstMarker.click({ force: true });
      await page.waitForTimeout(500);
      manifest.shots.push(await shot(page, 'buildings', '09-building-selected'));
    }

    await page.getByRole('button', { name: 'Gebäude', exact: true }).click();
    await page.waitForTimeout(600);
    await page.getByRole('button', { name: 'Position auf Karte wählen' }).click();
    await page.waitForTimeout(800);
    const vp = page.locator('.pg-world-viewport');
    await vp.click({ position: { x: 220, y: 200 }, force: true });
    await page.waitForTimeout(600);
    manifest.shots.push(await shot(page, 'buildings', '10-pdm-preview'));
    const confirm = page.getByRole('button', { name: 'Gebäude platzieren' });
    if (await confirm.isEnabled()) {
      await confirm.click();
      await page.waitForTimeout(1800);
      manifest.shots.push(await shot(page, 'buildings', '11-pdm-confirmed'));
      await page.reload({ waitUntil: 'networkidle' });
      await page.getByRole('button', { name: 'Welt', exact: true }).click();
      await page.waitForTimeout(1200);
      manifest.shots.push(await shot(page, 'buildings', '12-after-reload'));
      await apiLoad(BASELINE_SAVE);
    }

    const vpEl = page.locator('.pg-world-viewport');
    await vpEl.hover({ position: { x: 200, y: 150 } });
    await page.mouse.down();
    await page.mouse.move(350, 150, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(500);
    manifest.shots.push(await shot(page, 'interaction', '13-pan-horizontal'));
    await vpEl.hover({ position: { x: 200, y: 150 } });
    await page.mouse.down();
    await page.mouse.move(200, 280, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(500);
    manifest.shots.push(await shot(page, 'interaction', '14-pan-vertical'));

    await page.getByRole('button', { name: 'Hineinzoomen' }).click();
    await page.getByRole('button', { name: 'Hineinzoomen' }).click();
    await page.waitForTimeout(400);
    manifest.shots.push(await shot(page, 'interaction', '15-zoom-in'));
    await page.getByRole('button', { name: 'Herauszoomen' }).click();
    await page.getByRole('button', { name: 'Herauszoomen' }).click();
    await page.getByRole('button', { name: 'Herauszoomen' }).click();
    await page.waitForTimeout(400);
    manifest.shots.push(await shot(page, 'interaction', '16-zoom-out'));
    await page.getByRole('button', { name: /Welt einpassen/i }).first().click();
    await page.waitForTimeout(700);
    manifest.shots.push(await shot(page, 'interaction', '17-fitWorld-after-zoom'));

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(800);
    manifest.layout.push({ phase: 'resize-1280x800', ...(await measureLayout(page)) });
    manifest.shots.push(await shot(page, 'layout', '18-resize-1280x800'));
  }

  await page.setViewportSize({ width: 480, height: 900 });
  await gotoWorld(page, { width: 480, height: 900 });
  await page.getByRole('button', { name: /Welt einpassen/i }).first().click();
  await page.waitForTimeout(800);
  manifest.layout.push({ phase: 'narrow-fitWorld', ...(await measureLayout(page)) });
  manifest.shots.push(await shot(page, 'responsive', '19-narrow-map-visible'));
  if (scenicOn) {
    await page.getByRole('row', { name: /Central Basin/i }).first().click();
    await page.waitForTimeout(600);
    manifest.shots.push(await shot(page, 'responsive', '20-narrow-region-selection'));
    await page.getByRole('button', { name: /Welt einpassen/i }).first().click();
    await page.waitForTimeout(600);
    manifest.shots.push(await shot(page, 'responsive', '21-narrow-fitWorld'));
  }

  const overview = `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"/><title>Slice 3 ${mode}</title>
<style>body{font-family:system-ui;background:#111;color:#eee;padding:16px} pre{background:#222;padding:12px;overflow:auto}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px} img{width:100%}</style></head><body>
<h1>Slice 3 — ${mode}</h1><pre>${JSON.stringify({ layout: manifest.layout, labelOverlap: manifest.labelOverlap }, null, 2)}</pre>
<div class="grid">${manifest.shots.map((s) => `<div><img src="../${s}"/><p>${s}</p></div>`).join('')}</div></body></html>`;
  await writeFile(path.join(evidenceRoot, 'review-overview', `index--${mode}.html`), overview);
  await writeFile(
    path.join(evidenceRoot, 'tests', `manifest--${mode}.json`),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  await browser.close();
  console.log(`Slice 3 evidence (${mode}) → ${evidenceRoot}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
