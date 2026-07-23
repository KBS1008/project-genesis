import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { FileSavegameStore } from '../../infrastructure/persistence/savegame/FileSavegameStore.js';
import { ListSavegamesQueryHandler } from './ListSavegamesQueryHandler.js';

describe('ListSavegamesQueryHandler', () => {
  it('returns metadata for JSON save files in a directory', async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'pg-saves-'));
    const savePath = path.join(directory, 'browser-session.json');

    try {
      await mkdir(directory, { recursive: true });
      await writeFile(
        savePath,
        `${JSON.stringify({
          schemaVersion: 3,
          simulation: { tickNumber: 12, clockTime: 120, paused: false, tickDuration: 1 },
          companies: [{ id: 'company_001', name: 'Genesis Industries' }],
        })}\n`,
        'utf8',
      );

      const handler = new ListSavegamesQueryHandler({ savegameStore: new FileSavegameStore() });
      const result = await handler.execute({ directory });

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0]).toMatchObject({
          fileName: 'browser-session.json',
          schemaVersion: 3,
          tickNumber: 12,
          companyName: 'Genesis Industries',
        });
      }
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
