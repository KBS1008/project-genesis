import { Result, type Failure, type Success } from './Result.js';

describe('Result', () => {
  describe('ok', () => {
    it('creates a successful result', () => {
      const result = Result.ok(42);

      expect(result).toEqual({ ok: true, value: 42 });
    });

    it('preserves complex success values', () => {
      const value = { id: 'company_001', active: true };
      const result = Result.ok(value);

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value).toBe(value);
      }
    });
  });

  describe('fail', () => {
    it('creates a failed result', () => {
      const error = { code: 'INVALID', message: 'Invalid value.' };
      const result = Result.fail(error);

      expect(result).toEqual({ ok: false, error });
    });
  });

  describe('isOk', () => {
    it('returns true for a successful result', () => {
      const result = Result.ok('value');

      expect(Result.isOk(result)).toBe(true);
    });

    it('returns false for a failed result', () => {
      const result = Result.fail('error');

      expect(Result.isOk(result)).toBe(false);
    });

    it('narrows the success type', () => {
      const result: Success<number> | Failure<string> = Result.ok(10);

      if (Result.isOk(result)) {
        expect(result.value).toBe(10);
      } else {
        throw new Error('Expected a successful result.');
      }
    });
  });

  describe('isFailure', () => {
    it('returns true for a failed result', () => {
      const result = Result.fail('error');

      expect(Result.isFailure(result)).toBe(true);
    });

    it('returns false for a successful result', () => {
      const result = Result.ok('value');

      expect(Result.isFailure(result)).toBe(false);
    });

    it('narrows the failure type', () => {
      const result: Success<number> | Failure<string> = Result.fail('invalid');

      if (Result.isFailure(result)) {
        expect(result.error).toBe('invalid');
      } else {
        throw new Error('Expected a failed result.');
      }
    });
  });

  describe('map', () => {
    it('maps the success value', () => {
      const result = Result.map(Result.ok(2), (value) => value * 3);

      expect(result).toEqual({ ok: true, value: 6 });
    });

    it('preserves the failure unchanged', () => {
      const error = { code: 'FAILED' };
      const result = Result.map(Result.fail(error), (value: number) => value * 3);

      expect(result).toEqual({ ok: false, error });
    });
  });

  describe('flatMap', () => {
    it('chains successful operations', () => {
      const result = Result.flatMap(Result.ok(2), (value) => Result.ok(value + 5));

      expect(result).toEqual({ ok: true, value: 7 });
    });

    it('short-circuits when the initial result failed', () => {
      const error = { code: 'INITIAL_FAILURE' };
      const result = Result.flatMap(Result.fail(error), () => Result.ok('never'));

      expect(result).toEqual({ ok: false, error });
    });

    it('returns a chained failure', () => {
      const error = { code: 'CHAIN_FAILURE' };
      const result = Result.flatMap(Result.ok(2), () => Result.fail(error));

      expect(result).toEqual({ ok: false, error });
    });
  });

  describe('mapError', () => {
    it('maps the failure error', () => {
      const result = Result.mapError(Result.fail('invalid'), (error) => ({
        code: 'VALIDATION',
        message: error,
      }));

      expect(result).toEqual({
        ok: false,
        error: { code: 'VALIDATION', message: 'invalid' },
      });
    });

    it('preserves the success unchanged', () => {
      const result = Result.mapError(Result.ok('value'), (error: string) => `mapped:${error}`);

      expect(result).toEqual({ ok: true, value: 'value' });
    });
  });

  describe('unwrapOr', () => {
    it('returns the success value', () => {
      const result = Result.ok('value');

      expect(Result.unwrapOr(result, 'default')).toBe('value');
    });

    it('returns the default value for a failure', () => {
      const result = Result.fail('error');

      expect(Result.unwrapOr(result, 'default')).toBe('default');
    });
  });

  describe('unwrapOrElse', () => {
    it('returns the success value', () => {
      const result = Result.ok('value');

      expect(Result.unwrapOrElse(result, (error) => `fallback:${error}`)).toBe('value');
    });

    it('computes a fallback from the failure error', () => {
      const result = Result.fail('invalid');

      expect(Result.unwrapOrElse(result, (error) => `fallback:${error}`)).toBe('fallback:invalid');
    });
  });

  describe('immutability', () => {
    it('does not allow mutating a successful result', () => {
      const result = Result.ok({ count: 1 });

      expect(() => {
        (result as { value: { count: number } }).value = { count: 2 };
      }).toThrow();
    });

    it('does not allow mutating a failed result', () => {
      const result = Result.fail({ code: 'FAILED' });

      expect(() => {
        (result as { error: { code: string } }).error = { code: 'CHANGED' };
      }).toThrow();
    });
  });
});
