'use client';

import {
  SIMULATION_SPEED_OPTIONS,
  pauseSimulation,
  resumeSimulation,
  setSimulationSpeed,
  stepSimulation,
  type SimulationSpeedOption,
} from '@/presentation/adapters/api/simulation-client';
import { Button } from '@/presentation/primitives/Button';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import './simulation-controls.css';

/** Persistent simulation controls for pause, resume, step, and speed. */
export function SimulationControlsBar() {
  const { viewData, isBusy, runCommand } = useGameWorkspace();
  const { session, simulation } = viewData;
  const disabled = !session.hasGame || isBusy;
  const activeSpeed = simulation.speedMultiplier;

  const handleSpeedChange = (speed: SimulationSpeedOption) => {
    if (speed === activeSpeed) {
      return;
    }

    void runCommand(() => setSimulationSpeed(speed), `Simulationsgeschwindigkeit ×${speed}.`);
  };

  return (
    <section className="pg-simulation-controls" aria-label="Simulationssteuerung">
      <p className="pg-simulation-controls-label">Simulation</p>

      <div className="pg-simulation-controls-group" role="group" aria-label="Pause und Schritt">
        {simulation.isPaused ? (
          <Button
            disabled={disabled}
            aria-label="Simulation fortsetzen"
            onClick={() => {
              void runCommand(() => resumeSimulation(), 'Simulation fortgesetzt.');
            }}
          >
            Fortsetzen
          </Button>
        ) : (
          <Button
            variant="secondary"
            disabled={disabled}
            aria-label="Simulation pausieren"
            onClick={() => {
              void runCommand(() => pauseSimulation(), 'Simulation pausiert.');
            }}
          >
            Pausieren
          </Button>
        )}

        <Button
          variant="secondary"
          disabled={disabled}
          aria-label="Einen Simulationsschritt ausführen"
          onClick={() => {
            void runCommand(() => stepSimulation(), 'Simulationsschritt ausgeführt.');
          }}
        >
          +1 Tick
        </Button>
      </div>

      <div className="pg-simulation-controls-group" role="group" aria-label="Simulationsgeschwindigkeit">
        {SIMULATION_SPEED_OPTIONS.map((speed) => {
          const isActive = activeSpeed === speed;

          return (
            <Button
              key={speed}
              variant="secondary"
              className={`pg-simulation-speed-button${isActive ? ' is-active' : ''}`.trim()}
              disabled={disabled}
              aria-pressed={isActive}
              aria-label={`Simulationsgeschwindigkeit ×${speed}`}
              onClick={() => {
                handleSpeedChange(speed);
              }}
            >
              ×{speed}
            </Button>
          );
        })}
      </div>
    </section>
  );
}
