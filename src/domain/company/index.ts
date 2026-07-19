/**
 * @module @domain/company
 *
 * Company bounded context exports.
 */

export { Company, createCompanyId, createPlayerId } from './Company.js';

export type { CreateCompanyParams } from './Company.js';
export type { CompanyId, PlayerId } from './CompanyId.js';
export type { CompanyRepository } from './CompanyRepository.js';
export { CompanyStatus } from './CompanyStatus.js';
export { CompanyFounded } from './events/CompanyFounded.js';
