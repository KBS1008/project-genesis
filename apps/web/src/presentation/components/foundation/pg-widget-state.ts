/** Shared presentation states for dashboard widgets. */
export type PGWidgetState = 'idle' | 'loading' | 'empty' | 'error';

export type PGWidgetSurfaceProps = {
  readonly state?: PGWidgetState;
  readonly errorMessage?: string;
  readonly emptyTitle?: string;
  readonly emptyHint?: string;
  readonly loadingLabel?: string;
};
