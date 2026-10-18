/**
 * QA baseline verification for Slice 3 final evidence (no placement mutation).
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceRoot = path.join(
  root,
  'docs/design/world/web-final-2d-scenic-pilot/evidence/production-slice-3-final-evidence-verification-only',
);
const API = process.env.PG_EVIDENCE_API_URL ?? 'http://127.0.0.1:3001';
const QA_SAVE = 'saves/scenic-slice-1-pdm-gate-working.json';
const BASELINE_SAVE = 'saves/scenic-slice-1-pdm-gate-baseline.json';
const baselineDiskPath = path.join(root, 'apps/api', BASELINE_SAVE);

function buildingSnapshot(buildings) {
  return buildings
    .map((b) => ({
      id: b.id,
      type: b.buildingTypeId ?? b.type ?? b.buildingType ?? null,
      regionId: b.regionId ?? null,
      x: b.x ?? b.position?.x ?? null,
      y: b.y ?? b.position?.y ?? null,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function idsFromSnapshot(snapshot) {
  return snapshot.map((b) => b.id);
}

async function sha256File(filePath) {
  const buf = await readFile(filePath);
  return createHash('sha256').update(buf).digest('hex');
}

function buildingsFromSaveJson(save) {
  return save.buildings ?? [];
}

async function apiLoad(filePath) {
  const res = await fetch(`${API}/api/session/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filePath }),
  });
  return { ok: res.ok, status: res.status };
}

async function fetchBuildings() {
  const res = await fetch(`${API}/api/buildings`);
  const body = await res.json();
  if (Array.isArray(body.data)) {
    return body.data;
  }
  return body.data?.buildings ?? [];
}

function snapshotsEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

async function main() {
  await mkdir(path.join(evidenceRoot, 'qa-reset'), { recursive: true });

  const baselineSha256Before = await sha256File(baselineDiskPath);
  const baselineSave = JSON.parse(await readFile(baselineDiskPath, 'utf8'));
  const baselineSnapshot = buildingSnapshot(buildingsFromSaveJson(baselineSave));
  const baselineBuildingIds = idsFromSnapshot(baselineSnapshot);
  const baselineBuildingCount = baselineBuildingIds.length;

  const qaIsolationEvidence = {
    qaSaveIdentifier: QA_SAVE,
    baselinePath: BASELINE_SAVE,
    baselineDiskPath,
    dedicatedQaSaves: true,
    note: 'Isolated PDM gate saves used in prior Slice 1–3 scenic QA captures; no personal save paths.',
  };

  await apiLoad(QA_SAVE);
  await new Promise((r) => setTimeout(r, 800));
  let currentBuildings = await fetchBuildings();
  let currentSnapshot = buildingSnapshot(currentBuildings);
  let currentBuildingIdsBefore = idsFromSnapshot(currentSnapshot);
  let currentBuildingCountBefore = currentBuildingIdsBefore.length;

  let resetRequired = !snapshotsEqual(currentSnapshot, baselineSnapshot);
  let resetPerformed = false;
  let resetMethod = null;
  let resetExitCode = null;

  if (resetRequired) {
    const loadResult = await apiLoad(BASELINE_SAVE);
    resetPerformed = true;
    resetMethod = 'POST /api/session/load';
    resetExitCode = loadResult.ok ? 0 : loadResult.status;
    await new Promise((r) => setTimeout(r, 800));
    currentBuildings = await fetchBuildings();
    currentSnapshot = buildingSnapshot(currentBuildings);
  }

  const currentBuildingIdsAfter = idsFromSnapshot(currentSnapshot);
  const currentBuildingCountAfter = currentBuildingIdsAfter.length;
  const baselineSha256After = await sha256File(baselineDiskPath);
  const baselineMatchAfter = snapshotsEqual(currentSnapshot, baselineSnapshot);

  let result = 'FAIL';
  if (baselineMatchAfter) {
    result = 'PASS';
  } else if (!resetRequired) {
    result = 'PARTIAL';
  }

  const record = {
    qaSaveIdentifier: QA_SAVE,
    qaIsolationEvidence,
    baselinePath: BASELINE_SAVE,
    baselineSha256Before,
    baselineSha256After,
    baselineBuildingCount,
    baselineBuildingIds,
    baselineBuildingTypes: baselineSnapshot.map((b) => b.type),
    currentBuildingCountBefore,
    currentBuildingIdsBefore,
    resetRequired,
    resetPerformed,
    resetMethod,
    resetExitCode,
    currentBuildingCountAfter,
    currentBuildingIdsAfter,
    baselineMatchAfter,
    verificationTimestamp: new Date().toISOString(),
    result,
    statusNote:
      !resetRequired ? 'BASELINE ALREADY RESTORED (runtime matched baseline before any load)' : null,
  };

  await writeFile(
    path.join(evidenceRoot, 'qa-reset', 'qa-reset-verification.json'),
    `${JSON.stringify(record, null, 2)}\n`,
  );
  console.log(`QA reset verification → ${record.result}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
