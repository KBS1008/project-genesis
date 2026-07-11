import {
  Identifier,
  IdentifierValidationFailureReason,
  type IdentifierValidationError,
} from './Identifier.js';
import type { Result } from '../result/Result.js';

type TestCompanyId = Identifier<'Company'>;
type TestBuildingId = Identifier<'Building'>;

function createCompanyId(value: string): TestCompanyId {
  const result = Identifier.create<TestCompanyId>(value);

  if (!result.ok) {
    throw new Error(`Expected valid identifier, got: ${result.error.message}`);
  }

  return result.value;
}

describe('Identifier', () => {
  describe('create', () => {
    it('creates an identifier from a valid string', () => {
      const result = Identifier.create<TestCompanyId>('company_001');

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value).toBeInstanceOf(Identifier);
        expect(result.value.value).toBe('company_001');
      }
    });

    it('accepts strings with internal whitespace', () => {
      const result = Identifier.create<TestCompanyId>('company 001');

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value.value).toBe('company 001');
      }
    });

    it('rejects an empty string', () => {
      const result = Identifier.create<TestCompanyId>('');

      expect(result).toEqual({
        ok: false,
        error: {
          reason: IdentifierValidationFailureReason.EMPTY,
          message: 'Identifier value must not be an empty string.',
        },
      });
    });

    it('rejects a whitespace-only string', () => {
      const result = Identifier.create<TestCompanyId>('   \t\n  ');

      expect(result).toEqual({
        ok: false,
        error: {
          reason: IdentifierValidationFailureReason.WHITESPACE_ONLY,
          message: 'Identifier value must not be a whitespace-only string.',
        },
      });
    });

    it('rejects null', () => {
      const result = Identifier.create<TestCompanyId>(null);

      expect(result).toEqual({
        ok: false,
        error: {
          reason: IdentifierValidationFailureReason.NULL,
          message: 'Identifier value must not be null.',
        },
      });
    });

    it('rejects undefined', () => {
      const result = Identifier.create<TestCompanyId>(undefined);

      expect(result).toEqual({
        ok: false,
        error: {
          reason: IdentifierValidationFailureReason.UNDEFINED,
          message: 'Identifier value must not be undefined.',
        },
      });
    });
  });

  describe('value getter', () => {
    it('exposes the wrapped value through a readonly getter', () => {
      const id = createCompanyId('company_001');

      expect(id.value).toBe('company_001');
    });
  });

  describe('equals', () => {
    it('returns true for identifiers with the same value', () => {
      const left = createCompanyId('company_001');
      const right = createCompanyId('company_001');

      expect(left.equals(right)).toBe(true);
    });

    it('returns false for identifiers with different values', () => {
      const left = createCompanyId('company_001');
      const right = createCompanyId('company_002');

      expect(left.equals(right)).toBe(false);
    });

    it('returns false when compared with null', () => {
      const id = createCompanyId('company_001');

      expect(id.equals(null)).toBe(false);
    });

    it('returns false when compared with undefined', () => {
      const id = createCompanyId('company_001');

      expect(id.equals(undefined)).toBe(false);
    });

    it('returns false when compared with a plain string', () => {
      const id = createCompanyId('company_001');

      expect(id.equals('company_001')).toBe(false);
    });

    it('returns false when compared with an object sharing the same value', () => {
      const id = createCompanyId('company_001');

      expect(id.equals({ value: 'company_001' })).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns the primitive string value', () => {
      const id = createCompanyId('company_001');

      expect(id.toString()).toBe('company_001');
    });
  });

  describe('valueOf', () => {
    it('returns the primitive string value', () => {
      const id = createCompanyId('company_001');

      expect(id.valueOf()).toBe('company_001');
    });
  });

  describe('immutability', () => {
    it('freezes the identifier instance', () => {
      const id = createCompanyId('company_001');

      expect(Object.isFrozen(id)).toBe(true);
    });

    it('does not allow replacing the value property', () => {
      const id = createCompanyId('company_001');

      expect(() => {
        (id as { value: string }).value = 'mutated';
      }).toThrow();
    });

    it('does not allow adding new properties', () => {
      const id = createCompanyId('company_001');

      expect(() => {
        (id as unknown as Record<string, unknown>)['extra'] = 'value';
      }).toThrow();
    });
  });

  describe('type branding', () => {
    it('allows compile-time distinction between identifier brands', () => {
      const companyResult: Result<TestCompanyId, IdentifierValidationError> =
        Identifier.create<TestCompanyId>('company_001');
      const buildingResult: Result<TestBuildingId, IdentifierValidationError> =
        Identifier.create<TestBuildingId>('building_001');

      expect(companyResult.ok).toBe(true);
      expect(buildingResult.ok).toBe(true);
    });
  });
});
