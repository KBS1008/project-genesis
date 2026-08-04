/** Token-based series colors for multi-resource charts. */
const RESOURCE_COLOR_TOKENS: Record<string, string> = Object.freeze({
  wood: 'var(--color-primary)',
  planks: 'var(--color-warning)',
  steel: 'var(--color-text-secondary)',
  iron_ore: 'var(--muted)',
});

const FALLBACK_SERIES_TOKENS = Object.freeze([
  'var(--color-primary)',
  'var(--color-warning)',
  'var(--color-info)',
  'var(--color-success)',
  'var(--color-energy)',
]);

export function pgChartResourceColor(resourceId: string, index: number): string {
  return RESOURCE_COLOR_TOKENS[resourceId] ?? FALLBACK_SERIES_TOKENS[index % FALLBACK_SERIES_TOKENS.length]!;
}
