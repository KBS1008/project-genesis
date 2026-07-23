'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchSaveList } from '@/presentation/adapters/api/query-client';
import {
  normalizeSaveFilePath,
  saveGame,
  savePathToFileName,
} from '@/presentation/adapters/api/session-client';
import { mapSaveSlotViewData } from '@/presentation/adapters/mappers/workspace-view-mappers';
import { Button } from '@/presentation/primitives/Button';
import { StatusBanner } from '@/presentation/primitives/StatusBanner';
import { useDialog } from '@/presentation/dialog/DialogProvider';
import { useTransientFormState } from '@/presentation/state/useTransientFormState';
import { translatePresentationError } from '@/presentation/notifications/translatePresentationError';

import './menu.css';

/** Modal dialog for naming and persisting the active session. */
export function SaveGameDialog({
  defaultSavePath,
  onClose,
  onSaved,
}: {
  readonly defaultSavePath: string;
  readonly onClose: () => void;
  readonly onSaved: (filePath: string) => void;
}) {
  const { openConfirmDialog } = useDialog();
  const form = useTransientFormState({ fileName: savePathToFileName(defaultSavePath) });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const performSave = useCallback(
    async (filePath: string) => {
      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        await saveGame({ filePath });
        onSaved(filePath);
        onClose();
      } catch (error: unknown) {
        setErrorMessage(translatePresentationError(error));
      } finally {
        setIsSubmitting(false);
      }
    },
    [onClose, onSaved],
  );

  const handleSubmit = useCallback(async () => {
    let filePath: string;

    try {
      filePath = normalizeSaveFilePath(form.value.fileName);
    } catch (error: unknown) {
      setErrorMessage(translatePresentationError(error));
      return;
    }

    try {
      const existingSaves = await fetchSaveList();
      const exists = existingSaves.some((save) => save.filePath === filePath);

      if (exists) {
        const slot = mapSaveSlotViewData(
          existingSaves.find((save) => save.filePath === filePath)!,
        );

        openConfirmDialog(
          {
            id: 'overwrite-save',
            title: 'Spielstand überschreiben?',
            message: `"${slot.companyName}" (${slot.fileName}) wird durch den aktuellen Fortschritt ersetzt.`,
            confirmLabel: 'Überschreiben',
          },
          () => {
            void performSave(filePath);
          },
        );
        return;
      }

      await performSave(filePath);
    } catch (error: unknown) {
      setErrorMessage(translatePresentationError(error));
    }
  }, [form.value.fileName, openConfirmDialog, performSave]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="pg-dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        className="pg-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-game-dialog-title"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <h2 id="save-game-dialog-title" className="pg-dialog-title">
          Spielstand speichern
        </h2>

        {errorMessage !== null ? <StatusBanner tone="error" message={errorMessage} /> : null}

        <form
          className="pg-main-menu-form"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
          <label htmlFor="save-game-file-name">Dateiname</label>
          <input
            id="save-game-file-name"
            name="fileName"
            type="text"
            autoComplete="off"
            value={form.value.fileName}
            disabled={isSubmitting}
            onChange={(event) => {
              form.patch({ fileName: event.target.value });
            }}
          />

          <div className="pg-dialog-actions">
            <Button variant="secondary" type="button" onClick={onClose} disabled={isSubmitting}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Wird gespeichert…' : 'Speichern'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
