/**
 * @module @ui/devServer
 *
 * Starts the local browser shell for Project Genesis development.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GameSession } from '../application/facade/GameSession.js';
import { DevGameServer } from '../infrastructure/http/DevGameServer.js';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, '../..');
const gameContentRoot = path.join(projectRoot, 'game-content');
const webRoot = path.join(currentDirectory, 'web');

async function main(): Promise<void> {
  const sessionResult = await GameSession.create({ gameContentRoot });

  if (!sessionResult.ok) {
    console.error(`Failed to bootstrap game session: ${sessionResult.error.message}`);
    process.exit(1);
  }

  const server = new DevGameServer({
    session: sessionResult.value,
    webRoot,
    host: '127.0.0.1',
    port: 3000,
  });

  const listenResult = await server.listen();

  console.log('===========================================');
  console.log(' Project Genesis — Browser Shell');
  console.log('===========================================');
  console.log('');
  console.log(`Open http://${listenResult.host}:${listenResult.port}`);
  console.log('Press Ctrl+C to stop.');
}

await main();
