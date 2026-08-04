'use client';

import type { WorldInspectorViewData } from '@/presentation/adapters/view-data/world-view-data';
import { PGInspectorPanel } from '@/presentation/components/layout';

/** Region inspector for the world framework (overview sections only, Phase 4A). */
export function PGWorldInspector({
  inspector,
  onClose,
}: {
  readonly inspector: WorldInspectorViewData | null;
  readonly onClose?: () => void;
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
      }))}
      relatedTitle={inspector.relatedTitle}
      relatedItems={inspector.relatedItems}
      onClose={onClose}
    />
  );
}
