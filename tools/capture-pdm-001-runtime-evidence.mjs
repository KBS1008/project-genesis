/* global console, getComputedStyle, DOMMatrixReadOnly, process */
import path from 'node:path';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
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
mkdirSync(evidenceDir, { recursive: true });

const webOrigin = process.env.PG_WEB_ORIGIN ?? 'http://127.0.0.1:3000';
const savePath = path
  .join(projectRoot, 'tools/evidence-fixtures/pdm-001-map-placement.json')
  .replace(/\\/g, '/');

const PLACEMENT_BUILDING_TYPE = 'sawmill';

if (!existsSync(savePath)) {
  throw new Error(`Evidence save missing: ${savePath}. Run: node tools/build-pdm-001-placement-evidence-fixture.mjs`);
}

async function bootstrapSession(page) {
  const loadResponse = await page.request.post(`${webOrigin}/api/session/load`, {
    data: { filePath: savePath },
  });
  if (!loadResponse.ok()) {
    throw new Error(`Session load failed: ${loadResponse.status()} ${await loadResponse.text()}`);
  }
}

async function fetchBuildings(page) {
  const response = await page.request.get(`${webOrigin}/api/buildings`);
  if (!response.ok()) {
    throw new Error(`Buildings fetch failed: ${response.status()}`);
  }
  const payload = await response.json();
  return payload?.data ?? payload ?? [];
}

function findPlacedByName(buildings, name) {
  return buildings.find((entry) => entry.name === name) ?? null;
}

async function openBuildings(page, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(`${webOrigin}/game?screen=buildings`, { waitUntil: 'domcontentloaded' });
  await bootstrapSession(page);
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Baukatalog' }).waitFor({ timeout: 120_000 });
}

async function startMapPlacementFromBuildings(page, placementName) {
  await page.getByLabel('Gebäudetyp für Platzierung').selectOption(PLACEMENT_BUILDING_TYPE);
  await page.getByLabel('Gebäudename').fill(placementName);
  const mapButton = page.getByRole('button', { name: 'Position auf Karte wählen' });
  await mapButton.waitFor({ timeout: 30_000 });
  if (await mapButton.isDisabled()) {
    throw new Error('Position auf Karte wählen is disabled — fixture cannot place sawmill.');
  }
  await mapButton.click();
  await page.waitForURL(/screen=world/, { timeout: 120_000 });
  await page.locator('.pg-world-viewport').waitFor({ timeout: 120_000 });
  await page.locator('.pg-world-placement-mode').waitFor({ timeout: 120_000 });
}

async function worldLogicalToViewportLocal(page, worldX, worldY) {
  return page.locator('.pg-world-viewport').evaluate(
    (viewport, coords) => {
      const transformEl = viewport.querySelector('.pg-world-canvas-transform');
      if (transformEl === null) {
        throw new Error('Missing world canvas transform');
      }
      const matrix = new DOMMatrixReadOnly(getComputedStyle(transformEl).transform);
      return Object.freeze({
        x: coords.worldX * matrix.a + matrix.e,
        y: coords.worldY * matrix.d + matrix.f,
      });
    },
    { worldX, worldY },
  );
}

async function tapWorldLogical(page, worldX, worldY) {
  const local = await worldLogicalToViewportLocal(page, worldX, worldY);
  await page.locator('.pg-world-viewport').click({ position: local });
}

async function readCandidateLabel(page) {
  const candidate = page.locator('.pg-world-placement-mode-candidate');
  await candidate.waitFor({ timeout: 30_000 });
  return candidate.innerText();
}

async function assertPreviewVisible(page) {
  const preview = page.locator('.pg-world-building-marker.is-preview');
  await preview.waitFor({ timeout: 30_000 });
  return preview;
}

async function readPreviewWorldAnchor(page) {
  return page.locator('.pg-world-building-marker.is-preview').evaluate((node) => {
    const transform = node.getAttribute('transform') ?? '';
    const match = /translate\(([-\d.]+)\s+([-\d.]+)\)/.exec(transform);
    if (match === null) {
      throw new Error(`Could not parse preview transform: ${transform}`);
    }
    const hit = node.querySelector('.pg-world-building-marker-hit');
    const hitWidth = hit === null ? 0 : Number(hit.getAttribute('width') ?? 0);
    const hitHeight = hit === null ? 0 : Number(hit.getAttribute('height') ?? 0);
    return Object.freeze({
      x: Number(match[1]) + hitWidth / 2,
      y: Number(match[2]) + hitHeight / 2,
    });
  });
}

async function readFinalMarkerAnchorForName(page, name) {
  const marker = page.locator(`[aria-label="Gebäude ${name}"]`).first();
  await marker.waitFor({ timeout: 30_000 });
  return marker.evaluate((node) => {
    const transform = node.getAttribute('transform') ?? '';
    const match = /translate\(([-\d.]+)\s+([-\d.]+)\)/.exec(transform);
    if (match === null) {
      throw new Error(`Could not parse marker transform: ${transform}`);
    }
    const hit = node.querySelector('.pg-world-building-marker-hit');
    const hitWidth = hit === null ? 0 : Number(hit.getAttribute('width') ?? 0);
    const hitHeight = hit === null ? 0 : Number(hit.getAttribute('height') ?? 0);
    return Object.freeze({
      x: Number(match[1]) + hitWidth / 2,
      y: Number(match[2]) + hitHeight / 2,
    });
  });
}

async function panViewport(page) {
  const viewport = page.locator('.pg-world-viewport');
  const box = await viewport.boundingBox();
  if (box === null) {
    throw new Error('Viewport missing bounding box');
  }
  const startX = box.x + box.width * 0.55;
  const startY = box.y + box.height * 0.55;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 90, startY + 40, { steps: 8 });
  await page.mouse.up();
}

const runSummaries = [];

async function runPlacementCertification(label, viewport, options = {}) {
  const {
    performConfirm = true,
    performCancel = false,
    placementName = 'PDM Runtime Lager',
    targetDomain = { x: 18, y: 12 },
  } = options;
  const targetWorldLogical = Object.freeze({
    x: 4 + targetDomain.x,
    y: 4 + targetDomain.y,
  });

  const chromium = await loadChromium();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  await openBuildings(page, viewport);

  if ((await page.getByLabel('X-Position').count()) > 0 || (await page.getByLabel('Y-Position').count()) > 0) {
    throw new Error(`Raw X/Y fields present on Buildings (${label})`);
  }

  await page.screenshot({
    path: path.join(evidenceDir, `pdm001-${label}-buildings-entry.png`),
    fullPage: true,
  });

  const buildingsBeforeFlow = await fetchBuildings(page);
  const countBeforeFlow = buildingsBeforeFlow.length;

  await startMapPlacementFromBuildings(page, placementName);

  if (!page.url().includes('screen=world')) {
    throw new Error(`Expected World screen after map placement start (${label})`);
  }

  await page.screenshot({
    path: path.join(evidenceDir, `pdm001-${label}-world-placement-mode.png`),
    fullPage: true,
  });

  await page.getByRole('button', { name: 'Welt einpassen' }).click();
  await page.waitForTimeout(400);

  await tapWorldLogical(page, targetWorldLogical.x, targetWorldLogical.y);

  const candidateText = await readCandidateLabel(page);
  const candidateMatch = /Gewählte Position:\s*(\d+),\s*(\d+)/.exec(candidateText);
  if (candidateMatch === null) {
    throw new Error(`Expected selected candidate copy (${label}): ${candidateText}`);
  }
  const pickedDomain = Object.freeze({
    x: Number(candidateMatch[1]),
    y: Number(candidateMatch[2]),
  });
  if (pickedDomain.x < 0 || pickedDomain.y < 0) {
    throw new Error(`Invalid candidate domain (${label}): ${candidateText}`);
  }

  const previewAnchor = await readPreviewWorldAnchor(page);
  await assertPreviewVisible(page);

  const buildingsAfterPick = await fetchBuildings(page);
  if (buildingsAfterPick.length !== countBeforeFlow) {
    throw new Error(`Building count changed after pick (${label})`);
  }
  if (findPlacedByName(buildingsAfterPick, placementName) !== null) {
    throw new Error(`Placement name exists before confirm (${label})`);
  }

  await page.screenshot({
    path: path.join(evidenceDir, `pdm001-${label}-preview.png`),
    fullPage: true,
  });

  const candidateBeforePan = await readCandidateLabel(page);
  await panViewport(page);
  const candidateAfterPan = await readCandidateLabel(page);
  if (candidateBeforePan !== candidateAfterPan) {
    throw new Error(`Pan changed candidate label (${label})`);
  }

  await page.getByRole('button', { name: 'Hineinzoomen' }).click();
  await page.waitForTimeout(250);
  await page.getByRole('button', { name: 'Hineinzoomen' }).click();
  await page.waitForTimeout(250);
  const candidateAfterZoom = await readCandidateLabel(page);
  if (candidateAfterZoom !== candidateBeforePan) {
    throw new Error(`Zoom changed candidate domain label (${label})`);
  }

  if (performCancel) {
    await page.screenshot({
      path: path.join(evidenceDir, `pdm001-${label}-cancel-preview.png`),
      fullPage: true,
    });
    await page.getByRole('button', { name: 'Abbrechen' }).click();
    await page.getByRole('heading', { name: 'Baukatalog' }).waitFor({ timeout: 60_000 });
    const buildingsAfterCancel = await fetchBuildings(page);
    if (buildingsAfterCancel.length !== countBeforeFlow) {
      throw new Error(`Building count changed after cancel (${label})`);
    }
    if (findPlacedByName(buildingsAfterCancel, placementName) !== null) {
      throw new Error(`Building created after cancel (${label})`);
    }
    await page.screenshot({
      path: path.join(evidenceDir, `pdm001-${label}-cancelled.png`),
      fullPage: true,
    });
    await browser.close();
    runSummaries.push(
      Object.freeze({
        label,
        viewport,
        flow: 'cancel',
        buildingType: PLACEMENT_BUILDING_TYPE,
        placementName,
        buildingCountBefore: countBeforeFlow,
        buildingCountAfter: buildingsAfterCancel.length,
        pickedDomain,
        previewAnchor,
        placedDomain: null,
        anchorTolerancePx: 2,
        previewFinalAnchorDelta: null,
      }),
    );
    return;
  }

  if (!performConfirm) {
    await browser.close();
    return;
  }

  await page.getByRole('button', { name: 'Gebäude platzieren' }).click();
  await page.locator('.pg-world-placement-mode').waitFor({ state: 'detached', timeout: 120_000 });

  if (!page.url().includes('screen=world')) {
    throw new Error(`Expected to remain on World after confirm (${label})`);
  }

  const buildingsAfterConfirm = await fetchBuildings(page);
  if (buildingsAfterConfirm.length !== countBeforeFlow + 1) {
    throw new Error(`Expected exactly one new building (${label})`);
  }

  const placed = findPlacedByName(buildingsAfterConfirm, placementName);
  if (placed === null) {
    throw new Error(`Placed building not found by name (${label})`);
  }
  if (placed.x !== pickedDomain.x || placed.y !== pickedDomain.y) {
    throw new Error(
      `Domain mismatch: expected ${pickedDomain.x},${pickedDomain.y}; got ${placed.x},${placed.y} (${label})`,
    );
  }

  await page.getByRole('button', { name: 'Welt einpassen' }).click();
  await page.waitForTimeout(400);

  const finalAnchor = await readFinalMarkerAnchorForName(page, placementName);
  if (Math.abs(previewAnchor.x - finalAnchor.x) > 2 || Math.abs(previewAnchor.y - finalAnchor.y) > 2) {
    throw new Error(
      `Preview/final anchor mismatch (${label}): preview=${JSON.stringify(previewAnchor)} final=${JSON.stringify(finalAnchor)}`,
    );
  }

  await page.screenshot({
    path: path.join(evidenceDir, `pdm001-${label}-confirmed.png`),
    fullPage: true,
  });

  runSummaries.push(
    Object.freeze({
      label,
      viewport,
      flow: 'confirm',
      buildingType: PLACEMENT_BUILDING_TYPE,
      placementName,
      buildingCountBefore: countBeforeFlow,
      buildingCountAfter: buildingsAfterConfirm.length,
      pickedDomain,
      placedDomain: Object.freeze({ x: placed.x, y: placed.y }),
      previewAnchor,
      finalAnchor,
      anchorTolerancePx: 2,
      previewFinalAnchorDelta: Object.freeze({
        x: Math.abs(previewAnchor.x - finalAnchor.x),
        y: Math.abs(previewAnchor.y - finalAnchor.y),
      }),
    }),
  );

  await browser.close();
}

const captureStartedAt = new Date().toISOString();
await runPlacementCertification('desktop', { width: 1440, height: 900 }, {
  performConfirm: true,
  placementName: 'PDM Desktop Sägewerk',
  targetDomain: { x: 18, y: 12 },
});
await runPlacementCertification('narrow', { width: 480, height: 900 }, {
  performConfirm: true,
  placementName: 'PDM Narrow Sägewerk',
  targetDomain: { x: 22, y: 14 },
});
await runPlacementCertification('desktop-cancel', { width: 1440, height: 900 }, {
  performConfirm: false,
  performCancel: true,
  placementName: 'PDM Cancel Sägewerk',
  targetDomain: { x: 16, y: 10 },
});

writeFileSync(
  path.join(evidenceDir, 'pdm001-runtime-evidence-run-summary.json'),
  `${JSON.stringify(
    Object.freeze({
      capturedAtUtc: new Date().toISOString(),
      startedAtUtc: captureStartedAt,
      webOrigin,
      savePath,
      buildingType: PLACEMENT_BUILDING_TYPE,
      runs: runSummaries,
    }),
    null,
    2,
  )}\n`,
  'utf8',
);

console.log('PDM-001 runtime evidence captured.');
