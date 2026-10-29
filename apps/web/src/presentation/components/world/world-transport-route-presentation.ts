import type { WorldTransportFlowViewData } from '@/presentation/adapters/view-data/world-view-data';

/** Layer flags required to show active transport styling on inter-region connections. */
export type WorldTransportRouteLayerState = {
  readonly connections: boolean;
  readonly transport: boolean;
};

/** Returns true when an active transport flow should be drawn for a map connection. */
export function isWorldTransportRouteActive(
  layers: WorldTransportRouteLayerState,
  flow: WorldTransportFlowViewData | undefined,
): boolean {
  return layers.connections && layers.transport && flow !== undefined;
}

/** Midpoint between two connection anchors (for flow direction cue). */
export function worldTransportRouteMidpoint(
  from: { readonly x: number; readonly y: number },
  to: { readonly x: number; readonly y: number },
): { readonly x: number; readonly y: number } {
  return Object.freeze({
    x: (from.x + to.x) / 2,
    y: (from.y + to.y) / 2,
  });
}
