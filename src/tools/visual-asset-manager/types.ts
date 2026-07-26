/** Lifecycle status for a visual production asset. */
export type VisualAssetStatus =
  | 'planned'
  | 'in-production'
  | 'in-review'
  | 'approved'
  | 'integrated';

/** High-level asset category derived from ID prefix. */
export type VisualAssetKind =
  | 'mockup'
  | 'icon'
  | 'chart'
  | 'map'
  | 'illustration'
  | 'branding'
  | 'marketing';

/** Parsed backlog row from VISUAL_PRODUCTION_BACKLOG.md. */
export type BacklogEntry = {
  readonly lineIndex: number;
  readonly status: VisualAssetStatus;
  readonly backlogFilename: string;
  readonly assetId: string;
  readonly sprint: string;
  readonly category: string;
};

/** Resolved import plan before writing files. */
export type ImportPlan = {
  readonly assetId: string;
  readonly backlogFilename: string;
  readonly canonicalFilename: string;
  readonly revision: number;
  readonly targetDirectory: string;
  readonly targetRelativePath: string;
  readonly status: VisualAssetStatus;
  readonly kind: VisualAssetKind;
  readonly sha256: string;
  readonly width: number;
  readonly height: number;
  readonly warnings: readonly string[];
};

/** Validation outcome for an uploaded image buffer. */
export type ImageValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly width: number;
  readonly height: number;
  readonly format: string;
  readonly sha256: string;
};

/** Activity entry surfaced to the UI. */
export type VisualAssetActivityEntry = {
  readonly date: string;
  readonly assetId: string;
  readonly operation: string;
  readonly assetFilename: string;
  readonly status: string;
  readonly destination: string;
  readonly revision: number;
  readonly sha256: string;
};

/** Repository paths used by the visual asset manager. */
export type VisualAssetManagerPaths = {
  readonly projectRoot: string;
  readonly backlogPath: string;
  readonly catalogPath: string;
  readonly changelogPath: string;
  readonly designRoot: string;
};
