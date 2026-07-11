import { DomainEvent } from '../events/DomainEvent.js';
import { AggregateRoot } from './AggregateRoot.js';
import { Identifier } from './Identifier.js';

type TestCompanyId = Identifier<'Company'>;

class CompanyCreated extends DomainEvent {
  readonly eventName = 'CompanyCreated';
  readonly companyId: string;

  constructor(occurredAt: number, companyId: string) {
    super(occurredAt);
    this.companyId = companyId;
    this.freeze();
  }
}

class TestCompany extends AggregateRoot<'Company'> {
  constructor(id: TestCompanyId, occurredAt: number) {
    super(id);
    this.addDomainEvent(new CompanyCreated(occurredAt, id.value));
  }
}

function createCompanyId(value: string): TestCompanyId {
  const result = Identifier.create<TestCompanyId>(value);

  if (!result.ok) {
    throw new Error(`Expected valid identifier, got: ${result.error.message}`);
  }

  return result.value;
}

describe('AggregateRoot', () => {
  describe('domain events', () => {
    it('collects domain events raised during construction', () => {
      const company = new TestCompany(createCompanyId('company_001'), 100);

      const events = company.peekDomainEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CompanyCreated);

      const event = events[0] as CompanyCreated;
      expect(event.eventName).toBe('CompanyCreated');
      expect(event.occurredAt).toBe(100);
      expect(event.companyId).toBe('company_001');
    });

    it('returns a frozen snapshot from peekDomainEvents', () => {
      const company = new TestCompany(createCompanyId('company_001'), 100);

      const events = company.peekDomainEvents();

      expect(Object.isFrozen(events)).toBe(true);
    });

    it('pullDomainEvents returns events and clears the collection', () => {
      const company = new TestCompany(createCompanyId('company_001'), 100);

      const pulled = company.pullDomainEvents();

      expect(pulled).toHaveLength(1);
      expect(company.peekDomainEvents()).toHaveLength(0);
    });

    it('returns a frozen copy from pullDomainEvents', () => {
      const company = new TestCompany(createCompanyId('company_001'), 100);

      const pulled = company.pullDomainEvents();

      expect(Object.isFrozen(pulled)).toBe(true);
    });
  });

  describe('entity identity', () => {
    it('inherits identifier-based equality from Entity', () => {
      const left = new TestCompany(createCompanyId('company_001'), 100);
      const right = new TestCompany(createCompanyId('company_001'), 200);

      expect(left.equals(right)).toBe(true);
    });
  });
});
