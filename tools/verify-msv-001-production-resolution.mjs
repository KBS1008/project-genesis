/* global console, process */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('D:/Cursor/Project Genesis');
const PUBLIC = path.join(ROOT, 'apps/web/public/assets/milestones');
const MANIFEST = path.join(ROOT, 'docs/design/milestones/icon-msv-001/MSV_001_PRODUCTION_MANIFEST.json');

const AUTHORITATIVE_IDS = [
  'first_production',
  'first_steel',
  'first_profit',
  'first_consumer_goods',
  'first_machine_parts',
  'first_industrial_machinery',
  'first_advanced_electronics',
  'profit_100',
];

async function assertFile(relPath) {
  const full = path.join(ROOT, relPath);
  await fs.access(full);
  const meta = await sharp(full).metadata();
  if (!meta.width || !meta.height) {
    throw new Error(`Undecodable asset: ${relPath}`);
  }
  return full;
}

async function main() {
  const manifestRaw = await fs.readFile(MANIFEST, 'utf8');
  if (manifestRaw.includes('OLD-REJECTED')) {
    throw new Error('Rejected first_profit artifact referenced in production manifest');
  }

  const manifest = JSON.parse(manifestRaw);
  const ids = manifest.milestones.map((m) => m.milestoneId);
  const unique = new Set(ids);
  if (unique.size !== ids.length) throw new Error('Duplicate milestone IDs in manifest');
  if (ids.length !== 8) throw new Error(`Expected 8 milestones, got ${ids.length}`);

  for (const id of AUTHORITATIVE_IDS) {
    if (!ids.includes(id)) throw new Error(`Missing authoritative milestone: ${id}`);
  }

  for (const entry of manifest.milestones) {
    await assertFile(entry.primary);
    await assertFile(entry.medallion);
    const primaryId = `MSV-001-${entry.milestoneId}-primary`;
    const medallionId = `MSV-001-${entry.milestoneId}-medallion`;
    if (!entry.primary.includes(primaryId) || !entry.medallion.includes(medallionId)) {
      throw new Error(`Mapping mismatch for ${entry.milestoneId}`);
    }
  }

  await assertFile(manifest.fallbackMedallion);
  if (!manifest.fallbackMedallion.includes('MSV-001-milestone_unknown-medallion')) {
    throw new Error('Unexpected unknown fallback path');
  }

  console.log(
    JSON.stringify(
      {
        status: 'PASS',
        primaryResolution: '8/8',
        medallionResolution: '8/8',
        unknownFallback: manifest.fallbackMedallion,
        rejectedFirstProfitExcluded: true,
        authoritativeInventoryMatch: true,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
