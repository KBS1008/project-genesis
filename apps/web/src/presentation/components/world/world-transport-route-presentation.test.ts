import { describe, expect, it } from 'vitest';
import {
  isWorldTransportRouteActive,
  worldTransportRouteMidpoint,
} from '@/presentation/components/world/world-transport-route-presentation';

describe('world-transport-route-presentation', () => {
  const flow = Object.freeze({
    fromRegionId: 'a',
    toRegionId: 'b',
    intensity: 0.5,
    label: '1 aktiv',
  });

  it('requires connections and transport layers for active route styling', () => {
    expect(isWorldTransportRouteActive({ connections: true, transport: true }, flow)).toBe(true);
    expect(isWorldTransportRouteActive({ connections: false, transport: true }, flow)).toBe(false);
    expect(isWorldTransportRouteActive({ connections: true, transport: false }, flow)).toBe(false);
    expect(isWorldTransportRouteActive({ connections: true, transport: true }, undefined)).toBe(false);
  });

  it('computes route midpoint', () => {
    expect(worldTransportRouteMidpoint({ x: 0, y: 0 }, { x: 10, y: 20 })).toEqual({ x: 5, y: 10 });
  });
});
