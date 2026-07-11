import { ValidationErrorCode } from '../errors/ValidationError.js';
import { Guard } from './Guard.js';

describe('Guard', () => {
  describe('againstNull', () => {
    it('accepts a defined value', () => {
      const result = Guard.againstNull('value', 'Value must not be null or undefined.');

      expect(result).toEqual({ ok: true, value: 'value' });
    });

    it('rejects null', () => {
      const result = Guard.againstNull(null, 'Value must not be null or undefined.');

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.code).toBe(ValidationErrorCode.VALIDATION);
        expect(result.error.message).toBe('Value must not be null or undefined.');
      }
    });

    it('rejects undefined', () => {
      const result = Guard.againstNull(undefined, 'Value must not be null or undefined.');

      expect(result.ok).toBe(false);
    });
  });

  describe('againstEmptyString', () => {
    it('accepts a non-empty string', () => {
      const result = Guard.againstEmptyString('value', 'String must not be empty.');

      expect(result).toEqual({ ok: true, value: 'value' });
    });

    it('rejects an empty string', () => {
      const result = Guard.againstEmptyString('', 'String must not be empty.');

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.message).toBe('String must not be empty.');
      }
    });
  });

  describe('againstNegative', () => {
    it('accepts zero', () => {
      const result = Guard.againstNegative(0, 'Value must not be negative.');

      expect(result).toEqual({ ok: true, value: 0 });
    });

    it('accepts positive numbers', () => {
      const result = Guard.againstNegative(10, 'Value must not be negative.');

      expect(result).toEqual({ ok: true, value: 10 });
    });

    it('rejects negative numbers', () => {
      const result = Guard.againstNegative(-1, 'Value must not be negative.');

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.message).toBe('Value must not be negative.');
      }
    });
  });
});
