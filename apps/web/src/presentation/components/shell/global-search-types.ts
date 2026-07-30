import type { PrimaryScreenId } from '@/presentation/navigation/primary-screens';
import type { EntitySelectionKind } from '@/presentation/state/navigation-state';

export type GlobalSearchItemKind = 'screen' | 'entity';

export type GlobalSearchItem = {
  readonly id: string;
  readonly kind: GlobalSearchItemKind;
  readonly label: string;
  readonly description: string;
  readonly keywords: readonly string[];
  readonly screen: PrimaryScreenId;
  readonly entityKind?: Exclude<EntitySelectionKind, 'none'>;
  readonly entityId?: string;
};
