'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchSaveList } from '@/presentation/adapters/api/query-client';
import { loadGame } from '@/presentation/adapters/api/session-client';
import { mapSaveSlotViewData } from '@/presentation/adapters/mappers/workspace-view-mappers';
import type { SaveSlotViewData } from '@/presentation/adapters/view-data/workspace-view-data';
import { Button } from '@/presentation/primitives/Button';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { LoadingState } from '@/presentation/primitives/LoadingState';
import { StatusBanner } from '@/presentation/primitives/StatusBanner';
import { translatePresentationError } from '@/presentation/notifications/translatePresentationError';

/** Lists available save slots and loads the selected file. */
export function LoadGamePanel({ onCancel }: { readonly onCancel: () => void }) {
  const router = useRouter();
  const [saves, setSaves] = useState<readonly SaveSlotViewData[]>(Object.freeze([]));
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    void fetchSaveList()
      .then((entries) => {
        if (!active) {
          return;
        }

        const mapped = Object.freeze(entries.map(mapSaveSlotViewData));
        setSaves(mapped);
        setSelectedPath(mapped[0]?.filePath ?? null);
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        setErrorMessage(translatePresentationError(error));
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLoad = useCallback(async () => {
    if (selectedPath === null) {
      setErrorMessage('Bitte wählen Sie einen Spielstand aus.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await loadGame({ filePath: selectedPath });
      router.push('/game');
    } catch (error: unknown) {
      setErrorMessage(translatePresentationError(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [router, selectedPath]);

  return (
    <div className="pg-main-menu-panel">
      <h2>Spiel laden</h2>

      {errorMessage !== null ? <StatusBanner tone="error" message={errorMessage} /> : null}

      {isLoading ? <LoadingState label="Spielstände werden geladen…" /> : null}

      {!isLoading && saves.length === 0 ? (
        <EmptyState title="Keine Spielstände gefunden" hint="Starten Sie ein neues Spiel und speichern Sie Ihren Fortschritt." />
      ) : null}

      {!isLoading && saves.length > 0 ? (
        <div className="pg-save-list" role="listbox" aria-label="Verfügbare Spielstände">
          {saves.map((save) => {
            const isSelected = save.filePath === selectedPath;

            return (
              <button
                key={save.filePath}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`pg-save-list-item${isSelected ? ' is-selected' : ''}`.trim()}
                onClick={() => {
                  setSelectedPath(save.filePath);
                }}
              >
                <span className="pg-save-list-meta">
                  <strong>{save.companyName}</strong>
                  <span>
                    {save.fileName} · Tick {save.tickLabel} · {save.modifiedAtLabel}
                  </span>
                  <span>{save.schemaVersionLabel}</span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="pg-main-menu-form-actions">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Zurück
        </Button>
        <Button onClick={() => void handleLoad()} disabled={isSubmitting || selectedPath === null}>
          {isSubmitting ? 'Wird geladen…' : 'Spielstand laden'}
        </Button>
      </div>
    </div>
  );
}
