/**
 * @module @application/commands/StartNewGameCommand
 *
 * Input for founding a playable new-game session.
 */

/** Command to initialize a new playable company session. */
export type StartNewGameCommand = {
  readonly companyId: string;
  readonly name: string;
  readonly ownerId: string;
};
