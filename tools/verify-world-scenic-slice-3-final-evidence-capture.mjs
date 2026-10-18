/**
 * Slice 3 final evidence verification capture (labels, overflow, layout, interaction).
 * Run twice: scenic OFF then ON (restart web between runs).
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '../tools/capture-evidence-tmp/node_modules/playwright/index.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envFlag = process.env.NEXT_PUBLIC_PG_WORLD_SCENIC_BACKGROUND ?? '';
const scenicOn = envFlag === '1' || envFlag === 'true';
const scenicMode = scenicOn ? 'scenic-on' : 'scenic-off';
const evidenceRoot = path.join(
  root,
  'docs/design/world/web-final-2d-scenic-pilot/evidence/production-slice-3-final-evidence-verification-only',
);

const BASE = process.env.PG_EVIDENCE_BASE_URL ?? 'http://127.0.0.1:3000';
const API = process.env.PG_EVIDENCE_API_URL ?? 'http://127.0.0.1:3001';
const WORK_SAVE = 'saves/scenic-slice-1-pdm-gate-working.json';

const VIEWPORTS = [
  { key: 'desktop-1440', width: 1440, height: 900 },
  { key: 'desktop-1280', width: 1280, height: 800 },
  { key: 'tablet-1024', width: 1024, height: 768 },
  { key: 'narrow-768', width: 768, height: 900 },
  { key: 'narrow-480', width: 480, height: 900 },
  { key: 'narrow-390', width: 390, height: 844 },
];

const REGION_IDS = ['region_default', 'region_north', 'region_east', 'region_south'];

/** Authoritative visible region names (domain); used for evidence metadata only. */
const REGION_VISIBLE_NAME_BY_ID = Object.freeze({
  region_default: 'Central Basin',
  region_north: 'Northern Highlands',
  region_east: 'Eastern Industrial Belt',
  region_south: 'Southern Coastal Belt',
});

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
  const rel = `${subdir}/${name}--${scenicMode}.png`;
  await page.screenshot({ path: path.join(evidenceRoot, rel), fullPage: false });
  return rel;
}

async function measureOverflow(page) {
  const semantics = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    return {
      innerWidth: window.innerWidth,
      docClientWidth: doc.clientWidth,
      docScrollWidth: doc.scrollWidth,
      bodyScrollWidth: body.scrollWidth,
      scrollX: window.scrollX,
      scrollWidthMinusClient: doc.scrollWidth - doc.clientWidth,
      devicePixelRatio: window.devicePixelRatio,
    };
  });
  const scrollXBefore = semantics.scrollX;
  await page.evaluate(() => window.scrollTo({ left: 1000, top: window.scrollY, behavior: 'instant' }));
  await page.waitForTimeout(100);
  const probe = await page.evaluate(() => ({
    scrollXAfterAttempt: window.scrollX,
    maxScrollLeft: Math.max(
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
      document.body.scrollWidth - document.body.clientWidth,
      0,
    ),
  }));
  await page.evaluate((x) => window.scrollTo({ left: x, top: window.scrollY, behavior: 'instant' }), scrollXBefore);
  const domOverflowOffenders = await page.evaluate(() => {
    const viewportRight = window.innerWidth;
    const tolerance = 0.5;
    const offenders = [];
    const walk = (el, depth) => {
      if (depth > 10 || !(el instanceof Element)) return;
      const rect = el.getBoundingClientRect();
      if (rect.right > viewportRight + tolerance) {
        offenders.push({
          selector: `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(/\s+/)[0] || ''}`,
          pastRight: rect.right - viewportRight,
        });
      }
      for (const child of el.children) walk(child, depth + 1);
    };
    walk(document.documentElement, 0);
    return offenders.slice(0, 10);
  });
  const actuallyScrollable = probe.scrollXAfterAttempt > 0.5 || probe.maxScrollLeft > 0.5;
  const gate = {
    result:
      semantics.scrollWidthMinusClient === 0 && !actuallyScrollable && probe.maxScrollLeft === 0
        ? 'PASS'
        : 'FAIL',
  };
  return { semantics, horizontalScrollProbe: probe, domOverflowOffenders, actuallyScrollable, gate };
}

async function measureLayout(page) {
  return page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (el === null) return null;
      const r = el.getBoundingClientRect();
      return { width: r.width, height: r.height };
    };
    return {
      workspace: pick('.pg-world-workspace'),
      viewport: pick('.pg-world-viewport'),
      plate: pick('.pg-world-scenic-background-image'),
    };
  });
}

function overlapArea(a, b) {
  const w = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const h = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return w * h;
}

async function measureRegionLabels(page) {
  return page.evaluate(() => {
    const vpEl = document.querySelector('.pg-world-viewport');
    const vp = vpEl?.getBoundingClientRect();
    if (!vp) return { viewportBounds: null, regions: [], devicePixelRatio: window.devicePixelRatio };

    const clipRect = (() => {
      if (!(vpEl instanceof Element)) return null;
      const style = getComputedStyle(vpEl);
      return {
        overflowX: style.overflowX,
        overflowY: style.overflowY,
      };
    })();

    const regionIdByVisibleName = {
      'Central Basin': 'region_default',
      'Northern Highlands': 'region_north',
      'Eastern Industrial Belt': 'region_east',
      'Southern Coastal Belt': 'region_south',
    };
    const resolveRegionId = (group, titleText, ariaLabel) => {
      if (regionIdByVisibleName[titleText]) {
        return regionIdByVisibleName[titleText];
      }
      const match = /^Region (.+?),/.exec(ariaLabel);
      if (match && regionIdByVisibleName[match[1].trim()]) {
        return regionIdByVisibleName[match[1].trim()];
      }
      return 'unknown';
    };
    const regions = [...document.querySelectorAll('g.pg-world-scenic-region')].map((group) => {
      const hit = group.querySelector('circle.pg-world-scenic-region-hit');
      const ariaLabel = hit?.getAttribute('aria-label') ?? '';
      const titleEl = group.querySelector('text.pg-world-scenic-region-label');
      const subEl = group.querySelector('text.pg-world-scenic-region-label-sub');
      const titleText = titleEl?.textContent?.trim() ?? '';
      const subText = subEl?.textContent?.trim() ?? '';
      const titleRect = titleEl?.getBoundingClientRect();
      const subRect = subEl?.getBoundingClientRect();
      let titleBBox = null;
      let subBBox = null;
      if (titleEl instanceof SVGGraphicsElement) {
        const b = titleEl.getBBox();
        titleBBox = { x: b.x, y: b.y, width: b.width, height: b.height };
      }
      if (subEl instanceof SVGGraphicsElement) {
        const b = subEl.getBBox();
        subBBox = { x: b.x, y: b.y, width: b.width, height: b.height };
      }
      const left = Math.min(titleRect?.left ?? Infinity, subRect?.left ?? Infinity);
      const right = Math.max(titleRect?.right ?? -Infinity, subRect?.right ?? -Infinity);
      const top = Math.min(titleRect?.top ?? Infinity, subRect?.top ?? Infinity);
      const bottom = Math.max(titleRect?.bottom ?? -Infinity, subRect?.bottom ?? -Infinity);
      const union =
        Number.isFinite(left)
          ? { left, top, right, bottom, width: right - left, height: bottom - top }
          : null;
      const marginsToViewport =
        union === null
          ? null
          : {
              left: union.left - vp.left,
              right: vp.right - union.right,
              top: union.top - vp.top,
              bottom: vp.bottom - union.bottom,
            };
      const fullyInsideViewport =
        union !== null &&
        union.left >= vp.left &&
        union.right <= vp.right &&
        union.top >= vp.top &&
        union.bottom <= vp.bottom;
      const clipped =
        union !== null &&
        (union.left < vp.left ||
          union.right > vp.right ||
          union.top < vp.top ||
          union.bottom > vp.bottom);
      const titleStyle = titleEl ? getComputedStyle(titleEl) : null;
      const visible =
        titleStyle !== null &&
        titleStyle.visibility !== 'hidden' &&
        titleStyle.display !== 'none' &&
        parseFloat(titleStyle.fontSize || '0') > 0 &&
        parseFloat(titleStyle.opacity || '1') > 0;

      return {
        regionId: resolveRegionId(group, titleText, ariaLabel),
        ariaLabel,
        visibleName: titleText,
        biomeLabel: subText,
        domNodes: {
          group: 'g.pg-world-scenic-region',
          title: 'text.pg-world-scenic-region-label',
          subtitle: 'text.pg-world-scenic-region-label-sub',
        },
        titleBBox,
        subBBox,
        titleScreenRect: titleRect
          ? {
              left: titleRect.left,
              top: titleRect.top,
              right: titleRect.right,
              bottom: titleRect.bottom,
            }
          : null,
        subScreenRect: subRect
          ? {
              left: subRect.left,
              top: subRect.top,
              right: subRect.right,
              bottom: subRect.bottom,
            }
          : null,
        unionScreenBounds: union,
        mapViewportBounds: { left: vp.left, top: vp.top, right: vp.right, bottom: vp.bottom },
        clippingParent: clipRect,
        marginsToViewport,
        fullyInsideViewport,
        clipped,
        cssVisible: visible,
        visibleFraction: fullyInsideViewport ? 1 : clipped ? 0.5 : 1,
      };
    });

    return {
      viewportBounds: { left: vp.left, top: vp.top, right: vp.right, bottom: vp.bottom },
      devicePixelRatio: window.devicePixelRatio,
      regions,
    };
  });
}

function computeLabelOverlaps(regions) {
  const pairs = [];
  for (let i = 0; i < regions.length; i++) {
    for (let j = i + 1; j < regions.length; j++) {
      const a = regions[i].unionScreenBounds;
      const b = regions[j].unionScreenBounds;
      if (!a || !b) continue;
      const area = overlapArea(a, b);
      if (area > 1) {
        pairs.push({
          a: regions[i].visibleName,
          b: regions[j].visibleName,
          overlapAreaPx: area,
        });
      }
    }
  }
  return pairs;
}

async function mergeOverflowRegression(entry) {
  const filePath = path.join(evidenceRoot, 'overflow', 'overflow-regression.json');
  let doc = { capturedAt: new Date().toISOString(), modes: {} };
  try {
    doc = JSON.parse(await readFile(filePath, 'utf8'));
  } catch {
    /* new */
  }
  doc.modes[scenicMode] = entry;
  doc.capturedAt = new Date().toISOString();
  await mkdir(path.join(evidenceRoot, 'overflow'), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(doc, null, 2)}\n`);
}

async function testRegionSelection(page, viewportKey) {
  const results = [];
  for (const regionId of REGION_IDS) {
    const visibleName = REGION_VISIBLE_NAME_BY_ID[regionId];
    const regionRow = page
      .locator('section.pg-world-region-table button.pg-query-row')
      .filter({ hasText: visibleName });
    await regionRow.click();
    await page.waitForTimeout(500);
    const selectedOnMap = await page.evaluate(() => {
      const circles = [...document.querySelectorAll('circle.pg-world-scenic-region-hit.is-selected')];
      return circles.length >= 1;
    });
    await page.getByRole('button', { name: 'Region fokussieren' }).click();
    await page.waitForTimeout(700);
    await page.getByRole('button', { name: 'Welt einpassen' }).click();
    await page.waitForTimeout(700);
    results.push({
      regionId,
      viewportKey,
      rowClick: true,
      selectionRingOnMap: selectedOnMap,
      fitRegionClicked: true,
      fitWorldAfter: true,
    });
  }
  return results;
}

async function main() {
  for (const dir of [
    'labels',
    'overflow',
    'scenic-on',
    'scenic-off',
    'responsive',
    'interaction',
    'tests',
    'review-overview',
    'baseline',
  ]) {
    await mkdir(path.join(evidenceRoot, dir), { recursive: true });
  }

  try {
    await apiLoad(WORK_SAVE);
  } catch {
    /* optional */
  }

  const browser = await chromium.launch();
  const page = await (await browser.newContext()).newPage();

  const overflowByViewport = [];
  const labelByViewport = [];
  const layoutSamples = [];
  let scenicAttribution = null;
  let interactionResults = [];

  for (const vp of VIEWPORTS) {
    await gotoWorld(page, { width: vp.width, height: vp.height });
    if (vp.key === 'desktop-1440') {
      scenicAttribution = await page.evaluate((expectedScenicOn) => ({
        scenicBanner: document.querySelector('.pg-world-scenic-integration-banner') !== null,
        scenicPlate: document.querySelector('.pg-world-scenic-background-image') !== null,
        envExpectedScenicOn: expectedScenicOn,
      }), scenicOn);
      if (scenicOn && !scenicAttribution.scenicPlate) {
        throw new Error('Scenic ON expected but plate missing — restart web with scenic flag');
      }
      if (!scenicOn && scenicAttribution.scenicPlate) {
        throw new Error('Scenic OFF expected but plate visible');
      }
      await shot(page, scenicOn ? 'scenic-on' : 'scenic-off', '01-desktop-1440-fitWorld');
    }

    await page.getByRole('button', { name: /Welt einpassen/i }).first().click();
    await page.waitForTimeout(900);

    const overflow = await measureOverflow(page);
    overflowByViewport.push({ viewport: vp, ...overflow });

    if (scenicOn) {
      const labelData = await measureRegionLabels(page);
      const overlaps = computeLabelOverlaps(labelData.regions);
      const screenshot = await shot(page, 'labels', `labels-${vp.key}`);
      const gate = {
        fourLabelsPresent: labelData.regions.length === 4,
        allFullyInside: labelData.regions.every((r) => r.fullyInsideViewport),
        anyClipped: labelData.regions.some((r) => r.clipped),
        overlapPairs: overlaps.length,
        result:
          labelData.regions.length === 4 &&
          labelData.regions.every((r) => r.fullyInsideViewport && r.cssVisible) &&
          overlaps.length === 0
            ? 'PASS'
            : 'FAIL',
      };
      labelByViewport.push({
        viewport: vp,
        scenicOn: true,
        screenshot,
        ...labelData,
        labelOverlaps: overlaps,
        gate,
      });
    }

    if (vp.key === 'desktop-1440' || vp.key === 'narrow-480' || vp.key === 'narrow-390') {
      layoutSamples.push({
        viewport: vp,
        scenicMode,
        layout: await measureLayout(page),
      });
    }

    if (scenicOn && vp.key === 'desktop-1440') {
      await shot(page, 'interaction', 'region-selection-desktop');
      interactionResults = interactionResults.concat(await testRegionSelection(page, vp.key));
    }
    if (scenicOn && vp.key === 'narrow-480') {
      await shot(page, 'interaction', 'region-selection-narrow');
      interactionResults = interactionResults.concat(await testRegionSelection(page, vp.key));
    }

    if (scenicOn && (vp.key === 'narrow-480' || vp.key === 'narrow-390')) {
      await shot(page, 'responsive', `layout-${vp.key}`);
    }
    if (!scenicOn && vp.key === 'narrow-480') {
      await shot(page, 'responsive', `layout-${vp.key}`);
    }
  }

  if (scenicOn) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoWorld(page, { width: 1440, height: 900 });
    await page.getByRole('button', { name: /Welt einpassen/i }).first().click();
    await page.waitForTimeout(600);
    await page.getByRole('button', { name: 'Hineinzoomen' }).click();
    await page.getByRole('button', { name: 'Herauszoomen' }).click();
    await vpLocPan(page);
    await shot(page, 'interaction', 'pan-zoom-desktop');
  }

  await browser.close();

  await mergeOverflowRegression({
    scenicAttribution,
    viewports: overflowByViewport,
    overallGate:
      overflowByViewport.every((v) => v.gate.result === 'PASS') ? 'PASS' : 'FAIL',
  });

  if (scenicOn) {
    await writeFile(
      path.join(evidenceRoot, 'labels', 'label-bounds-all-viewports.json'),
      `${JSON.stringify(
        {
          capturedAt: new Date().toISOString(),
          scenicOn: true,
          scenicAttribution,
          viewports: labelByViewport,
          overallGate: labelByViewport.every((v) => v.gate.result === 'PASS') ? 'PASS' : 'FAIL',
        },
        null,
        2,
      )}\n`,
    );
    await writeFile(
      path.join(evidenceRoot, 'interaction', 'region-selection-regression.json'),
      `${JSON.stringify(
        { capturedAt: new Date().toISOString(), results: interactionResults },
        null,
        2,
      )}\n`,
    );
  }

  await writeFile(
    path.join(evidenceRoot, 'responsive', `layout-samples--${scenicMode}.json`),
    `${JSON.stringify({ capturedAt: new Date().toISOString(), samples: layoutSamples }, null, 2)}\n`,
  );

  console.log(`Final evidence capture (${scenicMode}) → ${evidenceRoot}`);
}

async function vpLocPan(page) {
  const vpLoc = page.locator('.pg-world-viewport');
  await vpLoc.hover({ position: { x: 180, y: 140 } });
  await page.mouse.down();
  await page.mouse.move(320, 140, { steps: 5 });
  await page.mouse.up();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
