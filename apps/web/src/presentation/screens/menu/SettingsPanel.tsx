'use client';

import { useState } from 'react';
import { Button } from '@/presentation/primitives/Button';
import { useTheme } from '@/presentation/theme';
import { loadMenuSettings, patchMenuSettings } from './menu-settings';

/** MM-004 Settings panel with theme and menu animation preferences. */
export function SettingsPanel({ onCancel }: { readonly onCancel: () => void }) {
  const { theme, setTheme } = useTheme();
  const [menuAnimationsEnabled, setMenuAnimationsEnabled] = useState(
    () => loadMenuSettings().menuAnimationsEnabled,
  );

  return (
    <div className="pg-main-menu-panel pg-menu-animate-in">
      <h2>Einstellungen</h2>

      <fieldset className="pg-main-menu-settings-group">
        <legend>Erscheinungsbild</legend>
        <label className="pg-main-menu-settings-row" htmlFor="menu-theme-select">
          Theme
        </label>
        <select
          id="menu-theme-select"
          value={theme}
          onChange={(event) => {
            setTheme(event.target.value as 'light' | 'dark');
          }}
        >
          <option value="light">Hell</option>
          <option value="dark">Dunkel</option>
        </select>
      </fieldset>

      <fieldset className="pg-main-menu-settings-group">
        <legend>Menü</legend>
        <label className="pg-main-menu-settings-checkbox">
          <input
            type="checkbox"
            checked={menuAnimationsEnabled}
            onChange={(event) => {
              const next = event.target.checked;
              setMenuAnimationsEnabled(next);
              patchMenuSettings({ menuAnimationsEnabled: next });
            }}
          />
          Menü-Animationen aktivieren
        </label>
      </fieldset>

      <div className="pg-main-menu-form-actions">
        <Button variant="secondary" onClick={onCancel}>
          Zurück
        </Button>
      </div>
    </div>
  );
}
