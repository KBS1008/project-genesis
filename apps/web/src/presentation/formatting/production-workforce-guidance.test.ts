import { describe, expect, it } from 'vitest';
import {
  PRODUCTION_WORKFORCE_STALL_GUIDANCE,
  resolveProductionWorkforceStallGuidance,
} from '@/presentation/formatting/production-workforce-guidance';

describe('production-workforce-guidance', () => {
  it('returns guidance only for STALLED_WORKFORCE operational state', () => {
    expect(resolveProductionWorkforceStallGuidance('STALLED_WORKFORCE')).toBe(
      PRODUCTION_WORKFORCE_STALL_GUIDANCE,
    );
    expect(resolveProductionWorkforceStallGuidance('STALLED_ENERGY')).toBeNull();
    expect(resolveProductionWorkforceStallGuidance('RUNNING')).toBeNull();
    expect(resolveProductionWorkforceStallGuidance('WAITING')).toBeNull();
  });

  it('names the current workforce-management destination without mandatory employee type', () => {
    const guidance = PRODUCTION_WORKFORCE_STALL_GUIDANCE;

    expect(guidance).toContain('Unternehmen');
    expect(guidance).toContain('Operatives Dashboard');
    expect(guidance).toContain('Personal');
    expect(guidance).not.toMatch(/Produktionsmitarbeiter/i);
    expect(guidance).not.toMatch(/\b2 Mitarbeiter\b/i);
    expect(guidance).not.toMatch(/erforderlich/i);
  });
});
