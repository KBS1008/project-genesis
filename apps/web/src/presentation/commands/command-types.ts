import type { QueryScope } from './query-scopes';

export type CommandStatus = 'idle' | 'loading' | 'success' | 'recoverable-error' | 'fatal-error' | 'cancelled';

export type CommandId =
  | 'company.newGame'
  | 'construction.placeBuilding'
  | 'production.start'
  | 'research.start'
  | 'employees.hire'
  | 'employees.assign'
  | 'market.buy'
  | 'market.sell'
  | 'simulation.pause'
  | 'simulation.resume'
  | 'simulation.speed'
  | 'simulation.step'
  | 'simulation.tick'
  | 'session.save'
  | 'session.load'
  | 'workspace.refresh'
  | 'custom';

export type CommandExecutionSnapshot = {
  readonly status: CommandStatus;
  readonly commandId: CommandId | null;
  readonly errorMessage: string | null;
};

export type CommandDefinition = {
  readonly id: CommandId;
  readonly group: string;
  readonly label: string;
  readonly invalidateScopes: readonly QueryScope[];
  readonly clearsDirty?: boolean;
};

/** Typed presentation-layer command error with recoverability metadata. */
export class PresentationCommandError extends Error {
  readonly code: string;
  readonly recoverable: boolean;

  constructor(message: string, options?: { readonly code?: string; readonly recoverable?: boolean }) {
    super(message);
    this.name = 'PresentationCommandError';
    this.code = options?.code ?? 'command_failed';
    this.recoverable = options?.recoverable ?? false;
  }
}

/** Normalizes unknown failures into PresentationCommandError instances. */
export function toPresentationCommandError(error: unknown): PresentationCommandError {
  if (error instanceof PresentationCommandError) {
    return error;
  }

  if (error instanceof Error) {
    const message = error.message.trim();
    const recoverable =
      message.toLowerCase().includes('network') ||
      message.toLowerCase().includes('fetch') ||
      message.toLowerCase().includes('timeout');

    return new PresentationCommandError(message.length > 0 ? message : 'Ein unerwarteter Fehler ist aufgetreten.', {
      code: 'command_failed',
      recoverable,
    });
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return new PresentationCommandError(error.trim(), { recoverable: false });
  }

  return new PresentationCommandError('Ein unerwarteter Fehler ist aufgetreten.', { recoverable: false });
}
