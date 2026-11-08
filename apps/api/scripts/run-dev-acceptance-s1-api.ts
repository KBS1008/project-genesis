/**
 * Starts acceptance S1 API on port 3002 via local Node + TSX (no pnpm).
 * Inert when imported — only spawns when executed as the process entry script.
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AcceptanceApiLaunchError,
  buildAcceptanceApiLaunchPlan,
  resolveApiPackageRoot,
} from './acceptance-s1-api-launch.js';

function isExecutedDirectly(): boolean {
  const entry = process.argv[1];

  if (entry === undefined) {
    return false;
  }

  return path.resolve(entry) === path.resolve(fileURLToPath(import.meta.url));
}

export function spawnAcceptanceApiDevFromCli(): never {
  const apiPackageRoot = resolveApiPackageRoot();

  try {
    const plan = buildAcceptanceApiLaunchPlan(apiPackageRoot, process.execPath, process.env);

    const child = spawn(plan.executable, [...plan.args], {
      cwd: plan.cwd,
      env: plan.env,
      stdio: 'inherit',
      shell: false,
    });

    child.on('exit', (code) => {
      process.exit(code ?? 1);
    });

    child.on('error', (error) => {
      // eslint-disable-next-line no-console -- launch helper
      console.error(error.message);
      process.exit(1);
    });
  } catch (error) {
    if (error instanceof AcceptanceApiLaunchError) {
      // eslint-disable-next-line no-console -- launch helper
      console.error(error.message);
      process.exit(1);
    }

    throw error;
  }

  return undefined as never;
}

if (isExecutedDirectly()) {
  spawnAcceptanceApiDevFromCli();
}
