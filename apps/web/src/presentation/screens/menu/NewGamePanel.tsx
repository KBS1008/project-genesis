'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { startNewGame } from '@/presentation/adapters/api/session-client';
import { Button } from '@/presentation/primitives/Button';
import { StatusBanner } from '@/presentation/primitives/StatusBanner';
import { useTransientFormState } from '@/presentation/state/useTransientFormState';
import { translatePresentationError } from '@/presentation/notifications/translatePresentationError';

const DEFAULT_COMPANY_NAME = 'Genesis Industries';

/** Collects a company name and starts a new session. */
export function NewGamePanel({ onCancel }: { readonly onCancel: () => void }) {
  const router = useRouter();
  const form = useTransientFormState({ companyName: DEFAULT_COMPANY_NAME });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStart = useCallback(async () => {
    const name = form.value.companyName.trim();

    if (name.length === 0) {
      setErrorMessage('Bitte geben Sie einen Unternehmensnamen ein.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await startNewGame({ name });
      router.push('/game');
    } catch (error: unknown) {
      setErrorMessage(translatePresentationError(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [form.value.companyName, router]);

  return (
    <div className="pg-main-menu-panel">
      <h2>Neues Spiel</h2>

      {errorMessage !== null ? <StatusBanner tone="error" message={errorMessage} /> : null}

      <form
        className="pg-main-menu-form"
        onSubmit={(event) => {
          event.preventDefault();
          void handleStart();
        }}
      >
        <label htmlFor="new-game-company-name">Unternehmensname</label>
        <input
          id="new-game-company-name"
          name="companyName"
          type="text"
          autoComplete="off"
          value={form.value.companyName}
          disabled={isSubmitting}
          onChange={(event) => {
            form.patch({ companyName: event.target.value });
          }}
        />

        <div className="pg-main-menu-form-actions">
          <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
            Zurück
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Wird gestartet…' : 'Spiel starten'}
          </Button>
        </div>
      </form>
    </div>
  );
}
