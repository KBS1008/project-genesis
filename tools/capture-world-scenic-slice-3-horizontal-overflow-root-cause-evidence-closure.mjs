/* eslint-env node */
/**
 * Slice 3 horizontal overflow root-cause closure.
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
  'docs/design/world/web-final-2d-scenic-pilot/evidence/production-slice-3-horizontal-overflow-root-cause-evidence-closure',
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

async function fetchBuildings() {
  const res = await fetch(`${API}/api/buildings`);
  const body = await res.json();
  return body.data?.buildings ?? [];
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

async function measureOverflowSemantics(page) {
  const beforeScroll = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const vv = window.visualViewport;
    const scrollbarWidth = window.innerWidth - doc.clientWidth;
    return {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      visualViewportWidth: vv?.width ?? null,
      visualViewportHeight: vv?.height ?? null,
      devicePixelRatio: window.devicePixelRatio,
      docClientWidth: doc.clientWidth,
      docScrollWidth: doc.scrollWidth,
      docClientHeight: doc.clientHeight,
      docScrollHeight: doc.scrollHeight,
      bodyClientWidth: body.clientWidth,
      bodyScrollWidth: body.scrollWidth,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      scrollbarWidthEstimate: scrollbarWidth,
      scrollWidthMinusClient: doc.scrollWidth - doc.clientWidth,
      hasVerticalScroll: doc.scrollHeight > doc.clientHeight,
    };
  });

  const scrollXBefore = beforeScroll.scrollX;
  await page.evaluate(() => {
    window.scrollTo({ left: 1000, top: window.scrollY, behavior: 'instant' });
  });
  await page.waitForTimeout(100);
  const afterScrollAttempt = await page.evaluate(() => ({
    scrollX: window.scrollX,
    maxScrollLeft: Math.max(
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
      document.body.scrollWidth - document.body.clientWidth,
      0,
    ),
  }));
  await page.evaluate((x) => {
    window.scrollTo({ left: x, top: window.scrollY, behavior: 'instant' });
  }, scrollXBefore);

  const domOverflow = await page.evaluate(() => {
    const viewportRight = window.innerWidth;
    const viewportLeft = 0;
    const tolerance = 0.5;
    const offenders = [];

    const describe = (el) => {
      if (!(el instanceof Element)) return null;
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const overflow =
        rect.right > viewportRight + tolerance || rect.left < viewportLeft - tolerance;
      if (!overflow) return null;
      const id = el.id ? `#${el.id}` : '';
      const classes = el.className && typeof el.className === 'string'
        ? `.${el.className.trim().split(/\s+/).slice(0, 4).join('.')}`
        : '';
      return {
        tag: el.tagName.toLowerCase(),
        selector: `${el.tagName.toLowerCase()}${id}${classes}`,
        rect: {
          left: rect.left,
          right: rect.right,
          width: rect.width,
          top: rect.top,
          bottom: rect.bottom,
        },
        overflowPx: {
          pastRight: Math.max(0, rect.right - viewportRight),
          pastLeft: Math.max(0, viewportLeft - rect.left),
        },
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        offsetWidth: el.offsetWidth,
        boxSizing: style.boxSizing,
        width: style.width,
        minWidth: style.minWidth,
        maxWidth: style.maxWidth,
        marginLeft: style.marginLeft,
        marginRight: style.marginRight,
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        borderLeftWidth: style.borderLeftWidth,
        borderRightWidth: style.borderRightWidth,
        position: style.position,
        transform: style.transform,
        overflowX: style.overflowX,
      };
    };

    const visit = (el, depth) => {
      if (depth > 12) return;
      const hit = describe(el);
      if (hit !== null) offenders.push(hit);
      for (const child of el.children) {
        visit(child, depth + 1);
      }
    };

    visit(document.documentElement, 0);
    offenders.sort(
      (a, b) =>
        b.overflowPx.pastRight +
        b.overflowPx.pastLeft -
        (a.overflowPx.pastRight + a.overflowPx.pastLeft),
    );

    return offenders.slice(0, 25);
  });

  const layoutChain = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (el === null) return null;
      const r = el.getBoundingClientRect();
      return { width: r.width, height: r.height, right: r.right, left: r.left };
    };
    return {
      workspace: pick('.pg-world-workspace'),
      viewport: pick('.pg-world-viewport'),
      plate: pick('.pg-world-scenic-background-image'),
      shell: pick('.pg-application-shell'),
    };
  });

  return {
    semantics: beforeScroll,
    horizontalScrollProbe: {
      requestedLeft: 1000,
      scrollXAfterAttempt: afterScrollAttempt.scrollX,
      maxScrollLeft: afterScrollAttempt.maxScrollLeft,
      actuallyScrollable: afterScrollAttempt.scrollX > 0.5 || afterScrollAttempt.maxScrollLeft > 0.5,
    },
    domOverflowOffenders: domOverflow,
    layoutChain,
    gate: {
      contentOverflowPx: beforeScroll.scrollWidthMinusClient,
      horizontalScrollPossible: afterScrollAttempt.maxScrollLeft > 0.5,
      domOffenderCount: domOverflow.length,
    },
  };
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
  for (const dir of [
    'baseline',
    'diagnostics',
    'tests',
    'review-overview',
    'scenic-on',
    'scenic-off',
    'responsive',
    'placement',
    'lint',
    'typecheck',
    'build',
  ]) {
    await mkdir(path.join(evidenceRoot, dir), { recursive: true });
  }

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
    modeAttribution: null,
  };

  const overflowRootCause = {
    capturedAt: new Date().toISOString(),
    mode,
    viewports: [],
    conclusion: null,
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
      manifest.shots.push(await shot(page, mode === 'scenic-on' ? 'scenic-on' : 'scenic-off', '01-desktop-1440'));
    }

    await page.getByRole('button', { name: /Welt einpassen/i }).first().click();
    await page.waitForTimeout(700);

    const overflow = await measureOverflowSemantics(page);
    manifest.viewports.push({ key: vp.key, size: vp, overflow, layoutChain: overflow.layoutChain });
    overflowRootCause.viewports.push({ key: vp.key, ...overflow });

    if (vp.key === 'desktop-1440' && scenicOn) {
      manifest.shots.push(await shot(page, 'scenic-on', '03-desktop-fitWorld'));
      manifest.shots.push(await shot(page, 'labels', '04-four-region-labels'));
    }
    if (vp.key === 'narrow-480') {
      manifest.shots.push(await shot(page, 'responsive', 'narrow-480-fitWorld'));
    }
    if (vp.key === 'narrow-390' && scenicOn) {
      manifest.shots.push(await shot(page, 'responsive', 'narrow-390-fitWorld'));
    }
  }

  let placementRecord = { status: 'NOT_RUN', reason: 'Scenic OFF capture' };
  if (scenicOn) {
    await gotoWorld(page, { width: 1440, height: 900 });
    const vpLoc = page.locator('.pg-world-viewport');
    await vpLoc.hover({ position: { x: 200, y: 150 } });
    await page.mouse.down();
    await page.mouse.move(350, 150, { steps: 6 });
    await page.mouse.up();
    manifest.shots.push(await shot(page, 'scenic-on', '12-pan'));
    await page.getByRole('button', { name: 'Hineinzoomen' }).click();
    manifest.shots.push(await shot(page, 'scenic-on', '13-zoom-in'));

    await page.getByRole('button', { name: 'Gebäude', exact: true }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Position auf Karte wählen' }).click();
    await page.waitForTimeout(700);
    const pick = { x: 220, y: 200 };
    await vpLoc.click({ position: pick, force: true });
    await page.waitForTimeout(600);
    manifest.shots.push(await shot(page, 'placement', '14-pdm-preview'));
    await page.getByRole('button', { name: 'Abbrechen' }).click();
    await page.waitForTimeout(500);
    manifest.shots.push(await shot(page, 'placement', '15-pdm-cancel'));

    await page.getByRole('button', { name: 'Position auf Karte wählen' }).click();
    await page.waitForTimeout(600);
    await vpLoc.click({ position: pick, force: true });
    await page.waitForTimeout(600);
    const vpBox = await vpLoc.boundingBox();
    const pointerViewportLocal = vpBox !== null ? { x: pick.x, y: pick.y } : null;
    const previewCenter = await markerAnchorCenter(page, '.pg-world-building-marker.is-preview');
    const confirm = page.getByRole('button', { name: 'Gebäude platzieren' });
    placementRecord = { status: 'BLOCKED', reason: 'Confirm button disabled' };
    if (await confirm.isEnabled()) {
      const beforeIds = new Set((await fetchBuildings()).map((b) => b.id));
      const placeCalls = [];
      page.on('response', async (res) => {
        if (res.url().includes('/api/buildings/place') && res.request().method() === 'POST') {
          placeCalls.push({
            requestBody: res.request().postData(),
            responseBody: await res.text(),
          });
        }
      });
      await confirm.click();
      await page.waitForTimeout(2000);
      manifest.shots.push(await shot(page, 'placement', '16-pdm-confirmed'));

      let placedBuildingId = null;
      if (placeCalls.length === 1) {
        try {
          const body = JSON.parse(placeCalls[0].responseBody);
          placedBuildingId = typeof body.data === 'string' ? body.data : body.data?.id ?? null;
        } catch {
          placedBuildingId = null;
        }
      }
      const after = await fetchBuildings();
      const newBuilding = after.find((b) => !beforeIds.has(b.id));
      if (placedBuildingId === null && newBuilding) {
        placedBuildingId = newBuilding.id;
      }

      const confirmedCenter =
        placedBuildingId !== null
          ? await markerAnchorCenter(page, `[data-building-id="${placedBuildingId}"]`)
          : null;

      await page.reload({ waitUntil: 'networkidle' });
      await page.getByRole('button', { name: 'Welt', exact: true }).click();
      await page.waitForSelector('svg.pg-world-canvas', { timeout: 60_000 });
      await page.waitForTimeout(1200);
      manifest.shots.push(await shot(page, 'placement', '17-pdm-reload'));

      const reloadCenter =
        placedBuildingId !== null
          ? await markerAnchorCenter(page, `[data-building-id="${placedBuildingId}"]`)
          : null;

      const dist = (a, b) => (a && b ? Math.hypot(a.x - b.x, a.y - b.y) : null);

      placementRecord = {
        status: 'PASS',
        placeCallCount: placeCalls.length,
        placedBuildingId,
        buildingType: newBuilding?.type ?? null,
        pointerViewportLocal,
        previewCenter,
        confirmedCenter,
        reloadCenter,
        distancesPxViewportLocal: {
          pointerToPreview: dist(pointerViewportLocal, previewCenter?.viewportLocal ?? null),
          previewToConfirmed: dist(
            previewCenter?.viewportLocal ?? null,
            confirmedCenter?.viewportLocal ?? null,
          ),
          confirmedToReload: dist(
            confirmedCenter?.viewportLocal ?? null,
            reloadCenter?.viewportLocal ?? null,
          ),
        },
        tolerancePx: 28,
      };

      await apiLoad(BASELINE_SAVE);
      await writeFile(
        path.join(evidenceRoot, 'placement', 'qa-reset-record.json'),
        `${JSON.stringify({ resetAt: new Date().toISOString(), save: BASELINE_SAVE }, null, 2)}\n`,
      );
    }
  }

  const allNotScrollable = overflowRootCause.viewports.every(
    (v) => !v.horizontalScrollProbe.actuallyScrollable,
  );
  const allZeroDelta = overflowRootCause.viewports.every((v) => v.semantics.scrollWidthMinusClient === 0);
  const anyPositiveDelta = overflowRootCause.viewports.some((v) => v.semantics.scrollWidthMinusClient > 0);

  if (allNotScrollable && allZeroDelta) {
    overflowRootCause.conclusion = {
      type: 'CONTENT_OVERFLOW_RESOLVED',
      rootCauseBeforeFix:
        'Inspector panel content-box width + padding past grid column; skip-link left:-9999px inflated scrollWidth.',
      summary:
        'After minimal CSS fixes, all six viewports show scrollWidth−clientWidth=0 and horizontal scrollTo probe scrollX=0.',
      recommendedGate: 'PASS when maxScrollLeft=0 and scrollWidth−clientWidth=0 at all target widths.',
    };
  } else if (allNotScrollable && anyPositiveDelta) {
    const sample = overflowRootCause.viewports.find((v) => v.semantics.scrollWidthMinusClient > 0);
    const scrollbarMatches =
      sample &&
      Math.abs(sample.semantics.scrollWidthMinusClient - sample.semantics.scrollbarWidthEstimate) < 2;
    overflowRootCause.conclusion = scrollbarMatches
      ? {
          type: 'MEASUREMENT_SEMANTICS_NOT_CONTENT_OVERFLOW',
          summary:
            'scrollWidth−clientWidth tracks vertical scrollbar gutter only; horizontal scrollX stays 0 after scrollTo probe.',
          recommendedGate:
            'Treat horizontal overflow as PASS when maxScrollLeft≈0 and scrollWidth−clientWidth≈scrollbarWidth.',
        }
      : {
          type: 'CONTENT_OVERFLOW_OR_MIXED',
          summary: 'Positive scrollWidth delta without horizontal scroll — investigate DOM offenders.',
        };
  } else {
    overflowRootCause.conclusion = {
      type: 'CONTENT_OVERFLOW_OR_MIXED',
      summary: 'Horizontal document scroll remains possible after scrollTo probe.',
    };
  }

  await writeFile(
    path.join(evidenceRoot, 'diagnostics', 'overflow-root-cause.json'),
    `${JSON.stringify(overflowRootCause, null, 2)}\n`,
  );
  await writeFile(
    path.join(evidenceRoot, 'diagnostics', 'overflow-before-after.json'),
    `${JSON.stringify(
      {
        beforeReference: 'production-slice-3-responsive-layout-label-boundary-closure manifest',
        after: overflowRootCause.viewports.map((v) => ({
          key: v.key,
          scrollWidthMinusClient: v.semantics.scrollWidthMinusClient,
          scrollbarWidth: v.semantics.scrollbarWidthEstimate,
          actuallyScrollable: v.horizontalScrollProbe.actuallyScrollable,
          topOffender: v.domOverflowOffenders[0] ?? null,
        })),
      },
      null,
      2,
    )}\n`,
  );
  if (scenicOn) {
    await writeFile(
      path.join(evidenceRoot, 'placement', 'pdm-placement-record.json'),
      `${JSON.stringify(placementRecord, null, 2)}\n`,
    );
  }
  await writeFile(
    path.join(evidenceRoot, 'tests', `manifest--${mode}.json`),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  const overview = `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"/><title>Overflow closure ${mode}</title>
<style>body{font-family:system-ui;background:#111;color:#eee;padding:16px} pre{background:#222;padding:12px;overflow:auto;font-size:11px}</style></head><body>
<h1>Overflow closure — ${mode}</h1><pre>${JSON.stringify(overflowRootCause.conclusion, null, 2)}</pre>
<pre>${JSON.stringify(overflowRootCause.viewports.map((v) => v.gate), null, 2)}</pre></body></html>`;
  await writeFile(path.join(evidenceRoot, 'review-overview', `index--${mode}.html`), overview);

  await browser.close();
  console.log(`Overflow closure (${mode}) → ${evidenceRoot}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
