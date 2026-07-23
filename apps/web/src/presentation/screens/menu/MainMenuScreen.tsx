'use client';

import { useState } from 'react';
import packageInfo from '../../../../package.json';
import { Button } from '@/presentation/primitives/Button';
import { StatusBanner } from '@/presentation/primitives/StatusBanner';
import { LoadGamePanel } from './LoadGamePanel';
import { NewGamePanel } from './NewGamePanel';
import './menu.css';

type MenuView = 'home' | 'new-game' | 'load-game' | 'settings';

/** Entry screen with new-game, load-game, and settings stub. */
export function MainMenuScreen() {
  const [view, setView] = useState<MenuView>('home');

  return (
    <div className="pg-main-menu">
      <div className="pg-main-menu-card">
        {view === 'home' ? (
          <>
            <div className="pg-main-menu-brand">
              <h1>Project Genesis</h1>
              <p>Deterministische Wirtschafts- und Industriesimulation</p>
            </div>

            <div className="pg-main-menu-actions">
              <Button onClick={() => setView('new-game')}>Neues Spiel</Button>
              <Button variant="secondary" onClick={() => setView('load-game')}>
                Spiel laden
              </Button>
              <Button variant="secondary" onClick={() => setView('settings')}>
                Einstellungen
              </Button>
            </div>

            <div className="pg-main-menu-footer">
              <span>Version {packageInfo.version}</span>
              <span>M9 · Phase 4</span>
            </div>
          </>
        ) : null}

        {view === 'new-game' ? (
          <NewGamePanel
            onCancel={() => {
              setView('home');
            }}
          />
        ) : null}

        {view === 'load-game' ? (
          <LoadGamePanel
            onCancel={() => {
              setView('home');
            }}
          />
        ) : null}

        {view === 'settings' ? (
          <div className="pg-main-menu-panel">
            <h2>Einstellungen</h2>
            <StatusBanner tone="info" message="Einstellungen werden in einer späteren Phase ergänzt." />
            <Button
              variant="secondary"
              onClick={() => {
                setView('home');
              }}
            >
              Zurück
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
