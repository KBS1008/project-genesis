import { describe, expect, it } from 'vitest';
import { translatePresentationError } from './translatePresentationError';

describe('translatePresentationError', () => {
  it('maps JSON parse failures to a German unreachable-server message', () => {
    expect(
      translatePresentationError(
        new Error(`Unexpected token 'I', "Internal S"... is not valid JSON`),
      ),
    ).toBe('Der Spielserver ist momentan nicht erreichbar.');
  });

  it('maps fetch network failures to a German unreachable-server message', () => {
    expect(translatePresentationError(new Error('Failed to fetch'))).toBe(
      'Der Spielserver ist momentan nicht erreichbar.',
    );
  });
});
