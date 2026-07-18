/**
 * @module @domain/employee/EmployeeId
 *
 * Strongly typed identifiers for the Employee bounded context.
 */

import type { Identifier } from '../../common/core/Identifier.js';

/** Identifier brand for employee instances. */
export type EmployeeId = Identifier<'Employee'>;

/** Identifier brand referencing a static employee type definition. */
export type EmployeeTypeId = Identifier<'EmployeeType'>;
