/** Visual asset classification per M11 Phase 4C. */
export type VisualAssetCategory =
  | 'runtime'
  | 'reference'
  | 'svg-runtime'
  | 'documentation';

export type VisualAssetTheme = 'light' | 'dark' | 'any';

export type VisualAssetPriority = 'critical' | 'high' | 'normal' | 'low';

export type VisualAssetEntry = {
  readonly id: string;
  readonly label: string;
  readonly category: VisualAssetCategory;
  /** Public URL path served from `apps/web/public`. */
  readonly path: string | null;
  readonly theme: VisualAssetTheme;
  readonly priority: VisualAssetPriority;
  readonly preload: boolean;
  readonly fallbackId: string | null;
  readonly designSource: string | null;
  readonly runtimeComponent: string | null;
  readonly notes: string | null;
};

export type VisualAssetLoadState = 'idle' | 'loading' | 'loaded' | 'error';
