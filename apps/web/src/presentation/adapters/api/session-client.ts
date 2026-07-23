/** HTTP commands for session lifecycle (new game, save, load). */

import { callApi } from './client';

export type NewGameRequest = {
  readonly name?: string;
};

export type SaveGameRequest = {
  readonly filePath?: string;
};

export type LoadGameRequest = {
  readonly filePath?: string;
};

/** Starts a new browser session with an optional company name. */
export function startNewGame(request: NewGameRequest = {}): Promise<void> {
  return callApi<void>('/api/session/new', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/** Persists the active session to disk. Returns the written file path. */
export function saveGame(request: SaveGameRequest = {}): Promise<string> {
  return callApi<string>('/api/session/save', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/** Restores a session from disk. */
export function loadGame(request: LoadGameRequest = {}): Promise<void> {
  return callApi<void>('/api/session/load', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/** Normalizes a user-entered save label into a safe path under `saves/`. */
export function normalizeSaveFilePath(input: string): string {
  const trimmed = input.trim();

  if (trimmed.length === 0) {
    throw new Error('Bitte geben Sie einen Dateinamen ein.');
  }

  if (trimmed.includes('..') || trimmed.includes('\\')) {
    throw new Error('Ungültiger Dateiname.');
  }

  const withExtension = trimmed.endsWith('.json') ? trimmed : `${trimmed}.json`;
  const fileName = withExtension.replace(/^saves[/\\]/, '');

  if (!/^[a-zA-Z0-9._ -]+\.json$/.test(fileName)) {
    throw new Error('Dateiname darf nur Buchstaben, Zahlen, Punkt, Bindestrich und Unterstrich enthalten.');
  }

  return `saves/${fileName}`;
}

/** Returns the default file name portion from an active save path. */
export function savePathToFileName(savePath: string): string {
  const segments = savePath.split(/[/\\]/);
  const fileName = segments.at(-1) ?? 'browser-session.json';
  return fileName.replace(/\.json$/i, '');
}
