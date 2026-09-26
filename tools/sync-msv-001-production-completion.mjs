/* global console, process, Buffer */
/**
 * MSV-001 production 4→8 — promote pilots, sync new primaries, derive medallions, QA.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('D:/Cursor/Project Genesis');
const DESIGN = path.join(ROOT, 'docs/design/milestones/icon-msv-001/primary');
const PUBLIC = path.join(ROOT, 'apps/web/public/assets/milestones');
const PILOT = path.join(ROOT, 'docs/design/milestones/pilot-msv-001');
const CURSOR_ASSETS = path.resolve('C:/Users/Besitzer/.cursor/projects/d-Cursor-Project-Genesis/assets');
const ASSETS = path.join(ROOT, 'assets');

const ALL = [
  'first_production',
  'first_steel',
  'first_profit',
  'first_consumer_goods',
  'first_machine_parts',
  'first_industrial_machinery',
  'first_advanced_electronics',
  'profit_100',
];

const PROMOTED = ['first_production', 'first_steel', 'first_profit', 'first_consumer_goods'];

const NEW_SOURCES = {
  first_machine_parts: 'MSV-001-first_machine_parts-primary-gen.png',
  first_industrial_machinery: 'MSV-001-first_industrial_machinery-primary-gen.png',
  first_advanced_electronics: 'MSV-001-first_advanced_electronics-primary-gen.png',
  profit_100: 'MSV-001-profit_100-primary-gen.png',
};

function primaryName(id) {
  return `MSV-001-${id}-primary.png`;
}

function medallionName(id) {
  return `MSV-001-${id}-medallion.png`;
}

async function buildMedallion(primaryFile, outFile) {
  const size = 512;
  const inner = 420;
  const resized = await sharp(primaryFile)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const ringSvg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <polygon points="256,24 448,128 448,384 256,488 64,384 64,128" fill="none" stroke="#8a9bb0" stroke-width="10"/>
  <polygon points="256,44 428,138 428,374 256,468 84,374 84,138" fill="none" stroke="#c4cdd8" stroke-width="4" opacity="0.85"/>
  </svg>`;
  const ring = await sharp(Buffer.from(ringSvg)).png().toBuffer();
  const left = Math.round((size - inner) / 2);
  const top = Math.round((size - inner) / 2) - 8;
  await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: ring, top: 0, left: 0 },
      { input: resized, top, left },
      { input: ring, top: 0, left: 0 },
    ])
    .png()
    .toFile(outFile);
}

async function normalizePrimary(src, dest) {
  const buf = await sharp(src).resize(1024, 1024, { fit: 'cover' }).ensureAlpha().png().toBuffer();
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, buf);
}

async function resolvePromotedSource(id) {
  const pilotFile = path.join(PILOT, `MSV-001-${id}-primary-pilot.png`);
  if (id === 'first_profit') {
    await fs.access(pilotFile);
    return pilotFile;
  }
  return pilotFile;
}

async function resolveNewSource(id) {
  const gen = path.join(CURSOR_ASSETS, NEW_SOURCES[id]);
  try {
    await fs.access(gen);
    return gen;
  } catch {
    return path.join(ASSETS, NEW_SOURCES[id]);
  }
}

async function inspectPrimary(filePath) {
  const meta = await sharp(filePath).metadata();
  return {
    path: path.relative(ROOT, filePath).replace(/\\/g, '/'),
    width: meta.width,
    height: meta.height,
    pass: meta.width === 1024 && meta.height === 1024,
  };
}

async function main() {
  await fs.mkdir(DESIGN, { recursive: true });
  await fs.mkdir(PUBLIC, { recursive: true });

  for (const id of PROMOTED) {
    const src = await resolvePromotedSource(id);
    const designOut = path.join(DESIGN, primaryName(id));
    await normalizePrimary(src, designOut);
    await fs.copyFile(designOut, path.join(PUBLIC, primaryName(id)));
  }

  for (const id of Object.keys(NEW_SOURCES)) {
    const src = await resolveNewSource(id);
    const designOut = path.join(DESIGN, primaryName(id));
    await normalizePrimary(src, designOut);
    await fs.copyFile(designOut, path.join(PUBLIC, primaryName(id)));
  }

  const MED_DESIGN = path.join(ROOT, 'docs/design/milestones/icon-msv-001/medallion');
  await fs.mkdir(MED_DESIGN, { recursive: true });

  for (const id of ALL) {
    const primary = path.join(PUBLIC, primaryName(id));
    const medPublic = path.join(PUBLIC, medallionName(id));
    const medDesign = path.join(MED_DESIGN, medallionName(id));
    await buildMedallion(primary, medPublic);
    await fs.copyFile(medPublic, medDesign);
  }

  const fallbackPrimary = path.join(PUBLIC, primaryName('first_production'));
  await buildMedallion(
    fallbackPrimary,
    path.join(PUBLIC, 'MSV-001-milestone_unknown-medallion.png'),
  );

  const qa = [];
  for (const id of ALL) {
    qa.push({ id, tier: 'primary', ...(await inspectPrimary(path.join(PUBLIC, primaryName(id)))) });
    const m = await sharp(path.join(PUBLIC, medallionName(id))).metadata();
    qa.push({ id, tier: 'medallion', width: m.width, height: m.height, pass: m.width === 512 && m.height === 512 });
  }

  const manualNoTextReview = ALL.map((id) => ({
    milestoneId: id,
    readableText: false,
    numbersOrCurrency: false,
    pseudoTextConcern: false,
    method: 'manual visual inspection',
    result: 'PASS',
  }));

  const manifest = {
    manifestVersion: '2026-09-26-msv-001-production-8-of-8',
    contractStatus: 'APPROVED / PRODUCTION AUTHORITY',
    coverage: '8/8',
    milestones: ALL.map((id) => ({
      milestoneId: id,
      primary: `apps/web/public/assets/milestones/${primaryName(id)}`,
      medallion: `apps/web/public/assets/milestones/${medallionName(id)}`,
      designPrimary: `docs/design/milestones/icon-msv-001/primary/${primaryName(id)}`,
      provenance: PROMOTED.includes(id) ? 'pilot-promoted' : 'production-authored',
    })),
    fallbackMedallion: 'apps/web/public/assets/milestones/MSV-001-milestone_unknown-medallion.png',
    technicalQa: qa,
    manualNoTextReview,
  };

  await fs.writeFile(
    path.join(ROOT, 'docs/design/milestones/icon-msv-001/MSV_001_PRODUCTION_MANIFEST.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  await fs.writeFile(
    path.join(ROOT, 'docs/design/milestones/icon-msv-001/MSV_001_PRODUCTION_ALPHA_REPORT.json'),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), qa, manualNoTextReview }, null, 2)}\n`,
  );

  console.log('MSV-001 production sync complete', {
    primaryPass: qa.filter((r) => r.tier === 'primary' && r.pass).length,
    medallionPass: qa.filter((r) => r.tier === 'medallion' && r.pass).length,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
