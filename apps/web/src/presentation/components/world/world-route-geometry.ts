/** Deterministic SVG route geometry for world map connections. */

function hashConnectionKey(connectionKey: string): number {
  let hash = 0;

  for (let index = 0; index < connectionKey.length; index += 1) {
    hash = (hash + connectionKey.charCodeAt(index) * (index + 1)) % 7;
  }

  return hash;
}

/**
 * Quadratic path between region centers with a deterministic perpendicular offset
 * so parallel edges remain distinguishable without randomness.
 */
export function buildWorldRoutePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  connectionKey: string,
): string {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const length = Math.hypot(deltaX, deltaY) || 1;
  const normalX = -deltaY / length;
  const normalY = deltaX / length;
  const offset = (hashConnectionKey(connectionKey) - 3) * 10;
  const controlX = midX + normalX * offset;
  const controlY = midY + normalY * offset;

  return `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
}
