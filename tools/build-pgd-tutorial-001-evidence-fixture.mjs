/**
 * Creates deterministic saves for PGD-TUTORIAL-001 runtime evidence.
 * Requires a clean API session (no active company) for the new-game snapshot.
 */
/* global console, process */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixturesDir = path.join(root, 'tools/evidence-fixtures');
const webOrigin = process.env.PG_WEB_ORIGIN ?? 'http://127.0.0.1:3000';
const apiOrigin = process.env.PG_API_ORIGIN ?? 'http://127.0.0.1:3001';

const newGameFixturePath = path.join(fixturesDir, 'pgd-tutorial-001-new-game.json');
const midProgressSource = path.join(root, 'saves/e2e-m11-phase6-production-closeout.json');
const midProgressFixturePath = path.join(fixturesDir, 'pgd-tutorial-001-mid-progress.json');

mkdirSync(fixturesDir, { recursive: true });

async function waitForHealth() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${apiOrigin}/health`);
      if (response.ok) {
        return;
      }
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Health check failed for ${webOrigin}`);
}

async function startNewGameSnapshot() {
  const newResponse = await fetch(`${webOrigin}/api/session/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'PGD-TUTORIAL-001 Fixture Corp' }),
  });
  const newBody = await newResponse.text();
  if (!newResponse.ok) {
    throw new Error(
      `session/new failed (${newResponse.status}): ${newBody}. Restart dev API with empty session (pnpm dev:restart) and rerun this script.`,
    );
  }

  const saveResponse = await fetch(`${webOrigin}/api/session/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filePath: newGameFixturePath }),
  });
  const saveBody = await saveResponse.text();
  if (!saveResponse.ok) {
    throw new Error(`session/save failed (${saveResponse.status}): ${saveBody}`);
  }

  console.log(`Wrote ${newGameFixturePath}`);
}

await waitForHealth();

if (!existsSync(midProgressSource)) {
  throw new Error(`Mid-progress source save missing: ${midProgressSource}`);
}

copyFileSync(midProgressSource, midProgressFixturePath);
console.log(`Wrote ${midProgressFixturePath}`);

await startNewGameSnapshot();
