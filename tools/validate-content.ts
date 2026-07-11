#!/usr/bin/env node
/**
 * Validates all game content under `game-content/`.
 *
 * Usage: pnpm validate-content
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGameContent } from '../src/content/validateGameContent.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gameContentRoot = path.join(projectRoot, 'game-content');

function formatError(error: {
  message: string;
  filePath?: string | undefined;
  contentId?: string | undefined;
}): string {
  const parts = [error.message];

  if (error.filePath !== undefined) {
    parts.push(`file: ${error.filePath}`);
  }

  if (error.contentId !== undefined) {
    parts.push(`id: ${error.contentId}`);
  }

  return parts.join(' | ');
}

const result = await validateGameContent(gameContentRoot);

if (!result.ok) {
  console.error(`Content validation failed: ${formatError(result.error)}`);
  process.exit(1);
}

const { resourceTypes, buildingTypes, recipes } = result.value;

console.log('Content validation succeeded.');
console.log(`Resources: ${resourceTypes.size}`);
console.log(`Building types: ${buildingTypes.size}`);
console.log(`Recipes: ${recipes.size}`);
