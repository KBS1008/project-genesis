'use client';

import { resolveBuildingCategoryIconSvgMarkup } from '@/presentation/assets/building-category-icon-asset-ids';

type BuildingCategoryIconProps = {
  readonly category: string;
  readonly className?: string;
};

/** Decorative building category glyph from certified ICON-002 inline SVG sources. */
export function BuildingCategoryIcon({
  category,
  className = 'pg-building-category-icon',
}: BuildingCategoryIconProps) {
  const markup = resolveBuildingCategoryIconSvgMarkup(category);

  if (markup === null) {
    return null;
  }

  return <span className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: markup }} />;
}
