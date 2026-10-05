/**
 * Deterministic save for PDM-001 direct map placement runtime evidence.
 * Uses the sealed M11 Phase 6.6 closeout snapshot (player company, cash, prerequisites).
 */
/* global console */
import { copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'saves/e2e-m11-phase6-production-closeout.json');
const targetPath = path.join(root, 'tools/evidence-fixtures/pdm-001-map-placement.json');

if (!existsSync(sourcePath)) {
  throw new Error(`Source save missing: ${sourcePath}`);
}

copyFileSync(sourcePath, targetPath);
console.log(`Wrote ${targetPath}`);
