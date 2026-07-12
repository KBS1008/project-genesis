/**
 * @module @domain/transport/TransportOrderStatus
 *
 * Lifecycle status of a transport order.
 */

export const TransportOrderStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type TransportOrderStatus =
  (typeof TransportOrderStatus)[keyof typeof TransportOrderStatus];
