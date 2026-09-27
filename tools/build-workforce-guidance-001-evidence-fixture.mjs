/**
 * Deterministic save for WORKFORCE-GUIDANCE-001 runtime evidence:
 * sawmill production job with STALLED_WORKFORCE (zero assigned workers at building).
 */
/* global console */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'saves/e2e-m11-phase6-production-closeout.json');
const targetPath = path.join(
  root,
  'tools/evidence-fixtures/workforce-guidance-001-stalled-workforce.json',
);

const snapshot = JSON.parse(readFileSync(sourcePath, 'utf8'));
const sawmill = (snapshot.buildings ?? []).find((b) => b.buildingTypeId === 'sawmill');

if (sawmill === undefined) {
  throw new Error('Closeout save must include a sawmill building.');
}

for (const employee of snapshot.employees ?? []) {
  if (employee.assignedBuildingId === sawmill.id) {
    delete employee.assignedBuildingId;
  }
}

const productionJobs = snapshot.productionJobs ?? [];
const existing = productionJobs.find((job) => job.buildingId === sawmill.id);

if (existing !== undefined) {
  existing.status = 'RUNNING';
  existing.progress = 0;
} else {
  throw new Error('Closeout save must include a sawmill production job to transform.');
}

writeFileSync(targetPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
console.log(`Wrote ${targetPath}`);
