/**
 * ============================================================================
 * Project Genesis
 * ============================================================================
 *
 * Application Entry Point
 *
 * This file is the single entry point of the application.
 *
 * Responsibilities:
 *  - Bootstrap the application
 *  - Initialize infrastructure
 *  - Load configuration
 *  - Load game content
 *  - Start the simulation
 *
 * Business logic must never be implemented here.
 *
 * ============================================================================
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bootstrapApplication } from './application/bootstrap/bootstrapApplication.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gameContentRoot = path.join(projectRoot, 'game-content');

async function main(): Promise<void> {
  console.log('===========================================');
  console.log(' Project Genesis');
  console.log(' Deterministic Economy Simulation');
  console.log('===========================================');
  console.log('');

  const result = await bootstrapApplication({ gameContentRoot });

  if (!result.ok) {
    console.error(`Bootstrap failed: ${result.error.message}`);
    process.exit(1);
  }

  const { gameContent, simulationEngine } = result.value;

  console.log('Application bootstrap succeeded.');
  console.log(`Resources loaded: ${gameContent.resourceTypes.size}`);
  console.log(`Building types loaded: ${gameContent.buildingTypes.size}`);
  console.log(`Recipes loaded: ${gameContent.recipes.size}`);
  console.log(`Simulation tick: ${simulationEngine.state.tickNumber}`);
}

await main();
