import {
  PRIMARY_SCREENS,
  type PrimaryScreenId,
} from '@/presentation/navigation/primary-screens';

/** Returns the label for a primary screen id. */
export function labelPrimaryScreen(screenId: PrimaryScreenId): string {
  return PRIMARY_SCREENS.find((screen) => screen.id === screenId)?.label ?? screenId;
}
