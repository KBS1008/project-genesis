import { describe, expect, it } from 'vitest';
import { translatePresentationError } from '@/presentation/notifications/translatePresentationError';

describe('translatePresentationError', () => {
  it('returns Error messages when present', () => {
    expect(translatePresentationError(new Error('Nicht genug Kapital.'))).toBe(
      'Nicht genug Kapital.',
    );
  });

  it('falls back to a generic message for unknown values', () => {
    expect(translatePresentationError(undefined)).toBe(
      'Ein unerwarteter Fehler ist aufgetreten.',
    );
  });
});
