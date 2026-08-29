'use client';

import type { WorldInspectorViewData } from '@/presentation/adapters/view-data/world-view-data';
import { PGInspectorPanel } from '@/presentation/components/layout';

export type WorldInspectorSectionAction = {
  readonly actionLabel: string;
  readonly onAction: () => void;
};

/** Region inspector for the world map (overview + operations sections, Phase 4A/4B). */
export function PGWorldInspector({
  inspector,
  onClose,
  sectionActions,
}: {
  readonly inspector: WorldInspectorViewData | null;
  readonly onClose?: () => void;
  readonly sectionActions?: Readonly<Record<string, WorldInspectorSectionAction>>;
}) {
  if (inspector === null) {
    return (
      <PGInspectorPanel
        emptyTitle="Keine Region ausgewählt"
        emptyHint="Wählen Sie eine Region auf der Karte oder in der Liste."
      />
    );
  }

  return (
    <PGInspectorPanel
      title={inspector.title}
      subtitle={inspector.subtitle}
      entries={inspector.entries}
      sections={inspector.sections.map((section) => ({
        id: section.id,
        title: section.title,
        entries: section.entries,
        actionLabel: sectionActions?.[section.id]?.actionLabel,
        onAction: sectionActions?.[section.id]?.onAction,
      }))}
      relatedTitle={inspector.relatedTitle}
      relatedItems={inspector.relatedItems}
      onClose={onClose}
    />
  );
}
