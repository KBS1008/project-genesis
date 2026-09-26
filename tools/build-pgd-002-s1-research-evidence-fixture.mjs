/**
 * Builds a deterministic save fixture for PGD-002-S1 research prerequisite runtime evidence.
 * Source: e2e closeout save with player milestone/research state patched (same schema).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceSavePath = path.join(projectRoot, 'saves/e2e-m11-phase6-production-closeout.json');
const fixtureDir = path.join(projectRoot, 'tools/evidence-fixtures');
const fixtureSavePath = path.join(fixtureDir, 'pgd-002-s1-research-prerequisite-navigation.json');

const ALL_ENABLED_MILESTONES = [
  'first_profit',
  'first_production',
  'first_steel',
  'first_machine_parts',
  'first_industrial_machinery',
  'first_advanced_electronics',
  'first_consumer_goods',
  'profit_100',
];

const snapshot = JSON.parse(readFileSync(sourceSavePath, 'utf8'));

const companyMilestones = snapshot.companyMilestones?.find(
  (entry) => entry.companyId === 'company_001',
);
const companyResearch = snapshot.companyResearch?.find(
  (entry) => entry.companyId === 'company_001',
);

if (companyMilestones === undefined || companyResearch === undefined) {
  throw new Error('Expected company_001 milestone and research aggregates in source save.');
}

companyMilestones.completedMilestones = [...ALL_ENABLED_MILESTONES];
companyResearch.completedTechnologies = ['basic_woodworking'];

mkdirSync(fixtureDir, { recursive: true });
writeFileSync(fixtureSavePath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

console.log(
  JSON.stringify(
    {
      fixtureSavePath,
      companyId: 'company_001',
      completedMilestones: companyMilestones.completedMilestones.length,
      completedTechnologies: companyResearch.completedTechnologies,
      expectedBuildingBlocker: 'rail_terminal → intermodal_logistics',
    },
    null,
    2,
  ),
);
