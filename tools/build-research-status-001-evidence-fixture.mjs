/**
 * Builds a deterministic save fixture with representative research job statuses
 * for RESEARCH-STATUS-001 runtime evidence (presentation-only; no rule changes).
 */
/* global console */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'saves/e2e-m11-phase6-production-closeout.json');
const targetPath = path.join(
  root,
  'tools/evidence-fixtures/research-status-001-representative-jobs.json',
);

const snapshot = JSON.parse(readFileSync(sourcePath, 'utf8'));
const companyId = snapshot.companies?.[0]?.id ?? 'company_001';
const now = snapshot.simulation?.currentTick ?? 100;

snapshot.researchJobs = [
  {
    id: 'research_status_evidence_wait',
    companyId,
    technologyId: 'basic_woodworking',
    duration: 60,
    cost: 500,
    status: 'WAITING',
    progress: 0,
    createdAt: now,
    startTime: undefined,
    endTime: undefined,
  },
  {
    id: 'research_status_evidence_run',
    companyId,
    technologyId: 'coal_efficiency',
    duration: 80,
    cost: 800,
    status: 'RUNNING',
    progress: 42,
    createdAt: now - 5,
    startTime: now - 5,
    endTime: undefined,
  },
  {
    id: 'research_status_evidence_done',
    companyId,
    technologyId: 'factory_automation',
    duration: 120,
    cost: 1200,
    status: 'FINISHED',
    progress: 100,
    createdAt: now - 40,
    startTime: now - 40,
    endTime: now - 10,
  },
];

writeFileSync(targetPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
console.log(`Wrote ${targetPath}`);
