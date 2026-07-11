import { Entity } from './Entity.js';
import { Identifier } from './Identifier.js';

type TestCompanyId = Identifier<'Company'>;
type TestBuildingId = Identifier<'Building'>;

class TestCompany extends Entity<'Company'> {
  constructor(id: TestCompanyId) {
    super(id);
  }
}

class TestBuilding extends Entity<'Building'> {
  constructor(id: TestBuildingId) {
    super(id);
  }
}

function createCompanyId(value: string): TestCompanyId {
  const result = Identifier.create<TestCompanyId>(value);

  if (!result.ok) {
    throw new Error(`Expected valid identifier, got: ${result.error.message}`);
  }

  return result.value;
}

function createBuildingId(value: string): TestBuildingId {
  const result = Identifier.create<TestBuildingId>(value);

  if (!result.ok) {
    throw new Error(`Expected valid identifier, got: ${result.error.message}`);
  }

  return result.value;
}

describe('Entity', () => {
  describe('constructor', () => {
    it('creates an entity with a validated identifier', () => {
      const id = createCompanyId('company_001');
      const entity = new TestCompany(id);

      expect(entity.getId()).toBe(id);
      expect(entity.getId().value).toBe('company_001');
    });
  });

  describe('getId', () => {
    it('returns the identifier provided at construction', () => {
      const id = createCompanyId('company_001');
      const entity = new TestCompany(id);

      expect(entity.getId()).toBe(id);
    });
  });

  describe('equals', () => {
    it('returns true for entities with the same identifier value', () => {
      const left = new TestCompany(createCompanyId('company_001'));
      const right = new TestCompany(createCompanyId('company_001'));

      expect(left.equals(right)).toBe(true);
    });

    it('returns false for entities with different identifier values', () => {
      const left = new TestCompany(createCompanyId('company_001'));
      const right = new TestCompany(createCompanyId('company_002'));

      expect(left.equals(right)).toBe(false);
    });

    it('returns false when compared with null', () => {
      const entity = new TestCompany(createCompanyId('company_001'));

      expect(entity.equals(null)).toBe(false);
    });

    it('returns false when compared with undefined', () => {
      const entity = new TestCompany(createCompanyId('company_001'));

      expect(entity.equals(undefined)).toBe(false);
    });

    it('returns false when compared with a plain object', () => {
      const entity = new TestCompany(createCompanyId('company_001'));

      expect(entity.equals({ id: 'company_001' })).toBe(false);
    });

    it('returns false when compared with an identifier', () => {
      const entity = new TestCompany(createCompanyId('company_001'));

      expect(entity.equals(createCompanyId('company_001'))).toBe(false);
    });
  });

  describe('type branding', () => {
    it('allows compile-time distinction between entity brands', () => {
      const company = new TestCompany(createCompanyId('company_001'));
      const building = new TestBuilding(createBuildingId('building_001'));

      expect(company.getId().value).toBe('company_001');
      expect(building.getId().value).toBe('building_001');
    });
  });
});
