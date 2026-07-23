import { describe, expect, it } from 'vitest';
import { normalizeSaveFilePath, savePathToFileName } from './session-client';

describe('session-client save path helpers', () => {
  it('normalizes bare names into saves/*.json paths', () => {
    expect(normalizeSaveFilePath('My Campaign')).toBe('saves/My Campaign.json');
  });

  it('preserves explicit .json extension', () => {
    expect(normalizeSaveFilePath('slot-a.json')).toBe('saves/slot-a.json');
  });

  it('strips redundant saves/ prefix', () => {
    expect(normalizeSaveFilePath('saves/custom.json')).toBe('saves/custom.json');
  });

  it('rejects traversal and empty names', () => {
    expect(() => normalizeSaveFilePath('')).toThrow(/Dateinamen/);
    expect(() => normalizeSaveFilePath('../escape.json')).toThrow(/Ungültig/);
  });

  it('extracts editable file names from save paths', () => {
    expect(savePathToFileName('saves/browser-session.json')).toBe('browser-session');
    expect(savePathToFileName('saves/my-game.json')).toBe('my-game');
  });
});
