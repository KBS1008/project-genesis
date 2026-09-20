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
const webOrigin = process.env.PG_WEB_ORIGIN ?? 'http://localhost:3005';

async function loadSession(page) {
  const loadResponse = await page.request.post(`${webOrigin}/api/session/load`, {
    data: { filePath: savePath },
  });
  if (!loadResponse.ok()) throw new Error(`Session load failed: ${loadResponse.status()}`);
}

async function seedEmployees(page) {
  const hires = [
    { employeeTypeId: 'employee_port_operator', displayName: 'WFV Port Lead' },
    { employeeTypeId: 'employee_researcher_basic', displayName: 'WFV Researcher' },
    { employeeTypeId: 'employee_administrator_basic', displayName: 'WFV Admin' },
    { employeeTypeId: 'employee_engineer_basic', displayName: 'WFV Engineer' },
  ];
  for (const hire of hires) {
    await page.request.post(`${webOrigin}/api/employees/hire`, { data: hire });
  }
}

async function openOperations(page) {
  const url = `${webOrigin}/game?screen=company&entity=employee:employee_001`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  try {
    await page.waitForSelector('.pg-employees-widget .pg-workforce-role-visual', { timeout: 25_000 });
    await waitForWorkforcePrimariesLoaded(page);
  } catch {
    await loadSession(page);
    await seedEmployees(page);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('.pg-employees-widget .pg-workforce-role-visual', { timeout: 90_000 });
    await waitForWorkforcePrimariesLoaded(page);
  }
}

async function waitForWorkforcePrimariesLoaded(page) {
  await page.waitForFunction(
    () => {
      const imgs = [...document.querySelectorAll('.pg-employees-widget .pg-workforce-role-visual')];
      if (imgs.length === 0) return false;
      return imgs.every((img) => {
        const isPrimary = img.getAttribute('data-workforce-primary') === 'true';
        if (!isPrimary) return true;
        const el = /** @type {HTMLImageElement} */ (img);
        return el.complete && el.naturalWidth > 0;
      });
    },
    undefined,
    { timeout: 60_000 },
  );
}

async function collectWorkforceRowDiagnostics(page) {
  return page.evaluate(() => {
    const rows = [...document.querySelectorAll('.pg-employees-widget .pg-query-row:not(.pg-query-header)')];
    return rows.map((row) => {
      const img = row.querySelector('.pg-workforce-role-visual');
      const textCells = [...row.querySelectorAll('[role="cell"]')]
        .map((cell) => cell.textContent?.trim() ?? '')
        .filter((t) => t.length > 0);
      const displayName = textCells[0] ?? '';
      const roleLabel = textCells[1] ?? '';
      if (!img) {
        return {
          displayName,
          roleLabel,
          employeeTypeId: null,
          resolvedFamily: null,
          assetPath: null,
          fallback: null,
          loaded: false,
          note: 'missing workforce img',
        };
      }
      const src = img.getAttribute('src') ?? '';
      const isPrimary = img.getAttribute('data-workforce-primary') === 'true';
      const assetId = img.getAttribute('data-wfv-asset-id');
      const loadFailed = img.getAttribute('data-wfv-primary-load-failed') === 'true';
      const el = /** @type {HTMLImageElement} */ (img);
      const loaded = el.complete && el.naturalWidth > 0;
      let employeeTypeId = assetId?.replace(/^WFV-001-/, '').replace(/-primary$/, '') ?? null;
      if (employeeTypeId === null && !isPrimary && src.includes('ICON-002')) {
        employeeTypeId = 'unknown-or-unmapped';
      }
      return {
        displayName,
        roleLabel,
        employeeTypeId,
        resolvedFamily: isPrimary ? 'WFV-001' : 'ICON-002',
        assetPath: src,
        fallback: !isPrimary,
        loaded,
        primaryLoadFailed: loadFailed,
      };
    });
  });
}

async function screenshotWidget(page, fileName, viewport) {
  await page.setViewportSize(viewport);
  await openOperations(page);
  const widget = page.locator('.pg-employees-widget');
  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
  await widget.screenshot({ path: path.join(evidenceDir, fileName) });
}

async function main() {
  await fs.mkdir(evidenceDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await loadSession(page);
  await seedEmployees(page);

  await screenshotWidget(page, 'WFV_001_PRODUCTION_COMPLETION_WORKFORCE_DESKTOP.png', {
    width: 1440,
    height: 900,
  });
  await screenshotWidget(page, 'WFV_001_PRODUCTION_COMPLETION_WORKFORCE_NARROW.png', {
    width: 480,
    height: 900,
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await openOperations(page);
  await page.locator('.pg-employees-widget').screenshot({
    path: path.join(evidenceDir, 'WFV_001_PRODUCTION_COMPLETION_NEW_ROLE_COVERAGE.png'),
  });

  const rowDiagnostics = await collectWorkforceRowDiagnostics(page);
  const report = {
    capturedAt: new Date().toISOString(),
    webOrigin,
    savePath,
    rootCauseRepair:
      'WorkforceRoleVisual previously swapped to ICON-002 on primary img onError; completion capture could also race lazy loads against stale production builds.',
    rows: rowDiagnostics,
    mandatoryRoles: ['employee_production_worker', 'employee_researcher_basic', 'employee_administrator_basic', 'employee_engineer_basic'],
    mandatoryRoleResults: rowDiagnostics.filter((row) =>
      ['employee_production_worker', 'employee_researcher_basic', 'employee_administrator_basic', 'employee_engineer_basic'].includes(
        row.employeeTypeId ?? '',
      ),
    ),
    summary: {
      totalRows: rowDiagnostics.length,
      wfvPrimaryRows: rowDiagnostics.filter((r) => r.resolvedFamily === 'WFV-001').length,
      iconFallbackRows: rowDiagnostics.filter((r) => r.fallback === true).length,
      loadedPrimaryRows: rowDiagnostics.filter((r) => r.resolvedFamily === 'WFV-001' && r.loaded).length,
      enabledTypeFallbackViolations: rowDiagnostics.filter(
        (r) => r.fallback === true && r.employeeTypeId !== 'unknown-or-unmapped',
      ),
    },
  };

  const reportPath = path.join(evidenceDir, 'WFV_001_FINAL_RUNTIME_RESOLUTION_REPORT.json');
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log('WFV completion runtime evidence captured');
  console.log('Resolution report:', report.summary);

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
