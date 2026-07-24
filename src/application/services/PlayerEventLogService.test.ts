import { describe, expect, it } from 'vitest';
import { PlayerEventLogService } from './PlayerEventLogService.js';

describe('PlayerEventLogService', () => {
  it('stores events newest-first with stable ids', () => {
    const log = new PlayerEventLogService();

    const firstId = log.append({
      companyId: 'company_001',
      tickNumber: 1,
      occurredAt: 100,
      category: 'SESSION',
      message: 'Neues Spiel gestartet.',
    });
    const secondId = log.append({
      companyId: 'company_001',
      tickNumber: 2,
      occurredAt: 200,
      category: 'SIMULATION',
      message: 'Simulation pausiert.',
    });

    const entries = log.getEntries({ companyId: 'company_001' });

    expect(firstId).toBe('event_0001');
    expect(secondId).toBe('event_0002');
    expect(entries.map((entry) => entry.id)).toEqual(['event_0002', 'event_0001']);
  });

  it('filters by category and enforces the ring buffer', () => {
    const log = new PlayerEventLogService(2);

    log.append({
      companyId: 'company_001',
      tickNumber: 1,
      occurredAt: 1,
      category: 'TRADE',
      message: 'Kauf 1',
    });
    log.append({
      companyId: 'company_001',
      tickNumber: 2,
      occurredAt: 2,
      category: 'BUILDING',
      message: 'Gebäude 1',
    });
    log.append({
      companyId: 'company_001',
      tickNumber: 3,
      occurredAt: 3,
      category: 'TRADE',
      message: 'Kauf 2',
    });

    expect(log.getEntries({ companyId: 'company_001' }).map((entry) => entry.message)).toEqual([
      'Kauf 2',
      'Gebäude 1',
    ]);
    expect(log.getEntries({ companyId: 'company_001', category: 'TRADE' })).toEqual([
      expect.objectContaining({ message: 'Kauf 2' }),
    ]);
  });

  it('clears entries when the active company changes', () => {
    const log = new PlayerEventLogService();

    log.append({
      companyId: 'company_001',
      tickNumber: 1,
      occurredAt: 1,
      category: 'SESSION',
      message: 'A',
    });
    log.append({
      companyId: 'company_002',
      tickNumber: 1,
      occurredAt: 1,
      category: 'SESSION',
      message: 'B',
    });

    expect(log.getEntries({ companyId: 'company_001' })).toEqual([]);
    expect(log.getEntries({ companyId: 'company_002' })).toEqual([
      expect.objectContaining({ message: 'B' }),
    ]);
  });
});
