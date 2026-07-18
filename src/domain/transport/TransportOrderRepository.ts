/**
 * @module @domain/transport/TransportOrderRepository
 */

import type { CompanyId } from '../company/CompanyId.js';
import type { TransportOrder } from './TransportOrder.js';
import type { TransportOrderId } from './TransportOrderId.js';

export interface TransportOrderRepository {
  save(order: TransportOrder): void;
  findById(id: TransportOrderId): TransportOrder | undefined;
  findInProgress(): readonly TransportOrder[];
  findWaiting(): readonly TransportOrder[];
  findByCompanyId(companyId: CompanyId): readonly TransportOrder[];
  findByProductionJobId(productionJobId: string): readonly TransportOrder[];
}
