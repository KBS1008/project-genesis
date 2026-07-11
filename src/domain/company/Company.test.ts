import { ManualClock } from '../../common/time/ManualClock.js';
import {
  Company,
  createCompanyId,
  createPlayerId,
} from './Company.js';
import { CompanyStatus } from './CompanyStatus.js';
import { CompanyFounded } from './events/CompanyFounded.js';

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requirePlayerId(value: string) {
  const result = createPlayerId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('Company', () => {
  describe('create', () => {
    it('creates a company with validated properties', () => {
      const clock = new ManualClock(1000);
      const result = Company.create({
        id: requireCompanyId('company_001'),
        name: 'Genesis Industries',
        ownerId: requirePlayerId('player_001'),
        clock,
      });

      expect(result.ok).toBe(true);

      if (result.ok) {
        const company = result.value;

        expect(company.getId().value).toBe('company_001');
        expect(company.getName()).toBe('Genesis Industries');
        expect(company.getOwnerId().value).toBe('player_001');
        expect(company.getFoundedAt()).toBe(1000);
        expect(company.getStatus()).toBe(CompanyStatus.ACTIVE);
      }
    });

    it('trims surrounding whitespace from the company name', () => {
      const result = Company.create({
        id: requireCompanyId('company_001'),
        name: '  Genesis Industries  ',
        ownerId: requirePlayerId('player_001'),
        clock: new ManualClock(),
      });

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value.getName()).toBe('Genesis Industries');
      }
    });

    it('rejects an empty company name', () => {
      const result = Company.create({
        id: requireCompanyId('company_001'),
        name: '',
        ownerId: requirePlayerId('player_001'),
        clock: new ManualClock(),
      });

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.message).toBe('Company name must not be empty.');
      }
    });

    it('rejects a whitespace-only company name', () => {
      const result = Company.create({
        id: requireCompanyId('company_001'),
        name: '   ',
        ownerId: requirePlayerId('player_001'),
        clock: new ManualClock(),
      });

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.message).toBe('Company name must not be a whitespace-only string.');
      }
    });

    it('raises a CompanyFounded domain event', () => {
      const clock = new ManualClock(500);
      const result = Company.create({
        id: requireCompanyId('company_001'),
        name: 'Genesis Industries',
        ownerId: requirePlayerId('player_001'),
        clock,
      });

      expect(result.ok).toBe(true);

      if (result.ok) {
        const events = result.value.pullDomainEvents();

        expect(events).toHaveLength(1);

        const event = events[0] as CompanyFounded;
        expect(event.eventName).toBe('CompanyFounded');
        expect(event.occurredAt).toBe(500);
        expect(event.companyId).toBe('company_001');
        expect(event.ownerId).toBe('player_001');
        expect(event.name).toBe('Genesis Industries');
      }
    });
  });

  describe('identifier helpers', () => {
    it('creates validated company identifiers', () => {
      const result = createCompanyId('company_001');

      expect(result.ok).toBe(true);
    });

    it('creates validated player identifiers', () => {
      const result = createPlayerId('player_001');

      expect(result.ok).toBe(true);
    });
  });
});
