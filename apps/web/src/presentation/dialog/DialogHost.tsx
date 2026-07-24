'use client';

import { useRef } from 'react';
import { Button } from '@/presentation/primitives/Button';
import { useModalAccessibility } from '@/presentation/hooks/useModalAccessibility';
import { useDialog } from './DialogProvider';

/** Renders the active modal dialog above the workspace. */
export function DialogHost() {
  const { activeDialog, closeDialog, confirmDialog } = useDialog();
  const dialogRef = useRef<HTMLDivElement>(null);

  useModalAccessibility({
    isOpen: activeDialog !== null,
    onClose: closeDialog,
    containerRef: dialogRef,
  });

  if (activeDialog === null) {
    return null;
  }

  if (activeDialog.type === 'confirm') {
    return (
      <div className="pg-dialog-backdrop" role="presentation" onClick={closeDialog}>
        <div
          ref={dialogRef}
          className="pg-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pg-dialog-title"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <h2 id="pg-dialog-title" className="pg-dialog-title">
            {activeDialog.title}
          </h2>
          <p className="pg-dialog-message">{activeDialog.message}</p>
          <div className="pg-dialog-actions">
            <Button variant="secondary" onClick={closeDialog}>
              {activeDialog.cancelLabel ?? 'Abbrechen'}
            </Button>
            <Button onClick={confirmDialog}>{activeDialog.confirmLabel ?? 'Bestätigen'}</Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
