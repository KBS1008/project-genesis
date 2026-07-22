/**
 * @module @domain/brain/GoalStatus
 *
 * Lifecycle states for company goals.
 */

/** Supported goal lifecycle states. */
export const GoalStatus = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

/** Union of all goal status values. */
export type GoalStatus = (typeof GoalStatus)[keyof typeof GoalStatus];

/** All supported goal statuses in deterministic order. */
export const GOAL_STATUSES: readonly GoalStatus[] = Object.freeze([
  GoalStatus.ACTIVE,
  GoalStatus.CANCELLED,
  GoalStatus.COMPLETED,
]);

/** Returns whether a value is a supported goal status. */
export function isGoalStatus(value: string): value is GoalStatus {
  return (GOAL_STATUSES as readonly string[]).includes(value);
}
