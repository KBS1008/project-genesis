'use client';

import type { BuildingRowViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { formatProgress } from '@/presentation/formatting/presentation-formatters';

/** Construction progress cell for buildings operations table. */
export function BuildingConstructionStatus({ building }: { readonly building: BuildingRowViewData }) {
  if (!building.isUnderConstruction) {
    return <>{building.statusLabel}</>;
  }

  return (
    <div className="pg-construction-status">
      <span>{building.statusLabel}</span>
      <div className="pg-progress-bar" aria-hidden="true">
        <div
          className="pg-progress-fill"
          style={{ width: `${Math.round(building.constructionProgressPercent)}%` }}
        />
      </div>
      <span className="pg-progress-label">{formatProgress(building.constructionProgressPercent)}</span>
    </div>
  );
}
