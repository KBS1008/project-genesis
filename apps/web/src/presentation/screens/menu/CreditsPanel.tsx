'use client';

import { Fragment } from 'react';
import packageInfo from '../../../../package.json';
import { Button } from '@/presentation/primitives/Button';
import { MENU_CREDITS_VIEW_DATA } from './menu-credits-data';

/** MM-005 Credits screen with project attribution data. */
export function CreditsPanel({ onCancel }: { readonly onCancel: () => void }) {
  return (
    <div className="pg-main-menu-panel pg-menu-animate-in">
      <h2>Credits</h2>
      <p className="pg-main-menu-credits-intro">{MENU_CREDITS_VIEW_DATA.projectTitle}</p>

      <dl className="pg-main-menu-credits-list">
        {MENU_CREDITS_VIEW_DATA.entries.map((entry) => (
          <Fragment key={`${entry.role}:${entry.name}`}>
            <dt>{entry.role}</dt>
            <dd>{entry.name}</dd>
          </Fragment>
        ))}
      </dl>

      <p className="pg-main-menu-credits-note">{MENU_CREDITS_VIEW_DATA.technologyNote}</p>
      <p className="pg-main-menu-credits-version">Version {packageInfo.version}</p>

      <div className="pg-main-menu-form-actions">
        <Button variant="secondary" onClick={onCancel}>
          Zurück
        </Button>
      </div>
    </div>
  );
}
