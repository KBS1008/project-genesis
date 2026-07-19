/**
 * @module @domain/city/CityCategory
 *
 * Supported city categories for runtime city entities.
 */

/** Supported city categories for version 1. */
export const CityCategory = {
  MARKET_HUB: 'MARKET_HUB',
  INDUSTRIAL: 'INDUSTRIAL',
} as const;

export type CityCategory = (typeof CityCategory)[keyof typeof CityCategory];

const CITY_CATEGORIES = new Set<string>(Object.values(CityCategory));

/** Returns whether a raw category value is supported. */
export function isCityCategory(value: string): value is CityCategory {
  return CITY_CATEGORIES.has(value);
}
