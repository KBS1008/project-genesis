/** Visual asset classification per M11 Phase 4C. */
export type VisualAssetType = 'runtime' | 'reference' | 'svg-runtime' | 'documentation';

/** @deprecated Use VisualAssetType */
export type VisualAssetCategory = VisualAssetType;

/** Theme the asset belongs to, or `any` when theme-specific variants exist. */
export type VisualAssetThemeVariant = 'default' | 'light' | 'dark' | 'any';

/** @deprecated Use VisualAssetThemeVariant */
export type VisualAssetTheme = VisualAssetThemeVariant;

export type VisualAssetFormat = 'png' | 'svg' | 'webp';

export type VisualAssetPriority = 'critical' | 'high' | 'normal' | 'low';

export type VisualAssetThemePaths = Readonly<{
  readonly light?: string;
  readonly dark?: string;
}>;

export type VisualAssetEntry = {
  readonly id: string;
  readonly label: string;
  /** Asset role — runtime, reference, svg-runtime, or documentation. */
  readonly type: VisualAssetType;
  /** Screen or component that consumes this asset. */
  readonly component: string | null;
  /** Primary public URL (PNG or SVG) served from `apps/web/public`. */
  readonly path: string | null;
  readonly format: VisualAssetFormat | null;
  /** Optional WebP variant public URL in the same directory as `path`. */
  readonly webp: string | null;
  readonly theme: VisualAssetThemeVariant;
  /** Optional light/dark runtime paths overriding `path` per active theme. */
  readonly themeVariants: VisualAssetThemePaths | null;
  readonly priority: VisualAssetPriority;
  readonly preload: boolean;
  readonly fallbackId: string | null;
  readonly designSource: string | null;
  readonly notes: string | null;
};

export type VisualAssetResolveOptions = {
  readonly theme?: 'light' | 'dark';
  /** Prefer WebP when a variant is registered (default: true). */
  readonly preferWebp?: boolean;
};

export type VisualAssetSources = {
  readonly primary: string;
  readonly webp: string | null;
};

export type VisualAssetLoadState = 'idle' | 'loading' | 'loaded' | 'error';
