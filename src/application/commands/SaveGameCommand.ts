/**
 * @module @application/commands/SaveGameCommand
 *
 * Input for persisting the current game session.
 */

/** Command payload for saving a game session snapshot. */
export type SaveGameCommand = {
  readonly filePath: string;
};
