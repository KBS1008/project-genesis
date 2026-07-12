/**
 * @module @application/commands/LoadGameCommand
 *
 * Input for restoring a game session from disk.
 */

/** Command payload for loading a game session snapshot. */
export type LoadGameCommand = {
  readonly filePath: string;
  readonly gameContentRoot: string;
};
