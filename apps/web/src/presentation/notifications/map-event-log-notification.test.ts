import { describe, expect, it } from 'vitest';
import type { EventLogEntryDto } from '@/presentation/adapters/api/query-client';
import { mapEventLogEntryToNotification } from './map-event-log-notification';

function createEntry(
  overrides: Partial<EventLogEntryDto> = {},
): EventLogEntryDto {
  return {
    id: 'event_001',
    tickNumber: 12,
    occurredAt: 360,
    category: 'BUILDING',
    message: 'Gebäude fertiggestellt',
    severity: 'INFO',
    ...overrides,
  };
}

describe('mapEventLogEntryToNotification', () => {
  it('maps construction completed events to success with building action', () => {
    const notification = mapEventLogEntryToNotification(createEntry());

    expect(notification.notificationId).toBe('event_001');
    expect(notification.severity).toBe('success');
    expect(notification.simulationTimestamp).toBe(360);
    expect(notification.tickNumber).toBe(12);
    expect(notification.action).toBe('open-building');
    expect(notification.entityType).toBe('building');
  });

  it('maps research completed events to success with research action', () => {
    const notification = mapEventLogEntryToNotification(
      createEntry({ category: 'RESEARCH', message: 'Forschung abgeschlossen' }),
    );

    expect(notification.severity).toBe('success');
    expect(notification.action).toBe('open-research');
  });

  it('maps autosave failure to critical with retry-save action', () => {
    const notification = mapEventLogEntryToNotification(
      createEntry({
        category: 'SESSION',
        message: 'Autosave fehlgeschlagen',
        severity: 'ERROR',
      }),
    );

    expect(notification.severity).toBe('critical');
    expect(notification.action).toBe('retry-save');
  });

  it('maps production blocked events to production action', () => {
    const notification = mapEventLogEntryToNotification(
      createEntry({ category: 'PRODUCTION', message: 'Produktion blockiert' }),
    );

    expect(notification.action).toBe('open-production');
    expect(notification.severity).toBe('information');
  });

  it('maps transport delayed events to transport action', () => {
    const notification = mapEventLogEntryToNotification(
      createEntry({ category: 'TRANSPORT', message: 'Transport verzögert' }),
    );

    expect(notification.action).toBe('open-transport');
  });

  it('maps market contract events to market action', () => {
    const notification = mapEventLogEntryToNotification(
      createEntry({ category: 'TRADE', message: 'Vertrag abgeschlossen' }),
    );

    expect(notification.action).toBe('open-market');
  });
});
