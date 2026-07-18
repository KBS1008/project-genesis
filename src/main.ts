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
import { LogCategory } from './common/logging/LogCategory.js';
import { ConsoleLogger } from './infrastructure/logging/ConsoleLogger.js';
import { bootstrapApplication } from './application/bootstrap/bootstrapApplication.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gameContentRoot = path.join(projectRoot, 'game-content');

async function main(): Promise<void> {
  const result = await bootstrapApplication({ gameContentRoot });

  if (!result.ok) {
    const logger = new ConsoleLogger();
    logger.error(LogCategory.Application, 'Bootstrap failed.', {
      errorCode: result.error.errorCode,
      message: result.error.message,
    });
    process.exit(1);
  }

  const { gameContent, simulationEngine, logger } = result.value;

  logger.info(LogCategory.Application, 'Project Genesis console session ready.', {
    resources: gameContent.resourceTypes.size,
    buildingTypes: gameContent.buildingTypes.size,
    recipes: gameContent.recipes.size,
    tickNumber: simulationEngine.state.tickNumber,
  });
}

await main();
