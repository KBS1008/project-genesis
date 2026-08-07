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
import { useDialog } from '@/presentation/dialog/DialogProvider';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import './simulation-controls.css';

/** Persistent simulation controls for pause, resume, step, and speed. */
export function SimulationControlsBar() {
  const { openConfirmDialog } = useDialog();
  const { viewData, isBusy, canRunCommands, runCommand } = useGameWorkspace();
  const { session, simulation } = viewData;
  const disabled = !session.hasGame || isBusy || !canRunCommands;
  const activeSpeed = simulation.speedMultiplier;

  const handleSpeedChange = (speed: SimulationSpeedOption) => {
    if (speed === activeSpeed) {
      return;
    }

    void runCommand(
      () => setSimulationSpeed(speed),
      `Simulationsgeschwindigkeit ×${speed}.`,
      { commandId: 'simulation.speed' },
    );
  };

  const handleStep = () => {
    const executeStep = () => {
      void runCommand(() => stepSimulation(), 'Simulationsschritt ausgeführt.', {
        commandId: 'simulation.step',
      });
    };

    if (!simulation.isPaused) {
      openConfirmDialog(
        {
          id: 'simulation-step-while-running',
          title: 'Simulationsschritt ausführen?',
          message:
            'Die Simulation läuft derzeit. Möchten Sie trotzdem genau einen Tick voranschreiten?',
          confirmLabel: 'Schritt ausführen',
        },
        executeStep,
      );
      return;
    }

    executeStep();
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
              void runCommand(() => resumeSimulation(), 'Simulation fortgesetzt.', {
                commandId: 'simulation.resume',
              });
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
              void runCommand(() => pauseSimulation(), 'Simulation pausiert.', {
                commandId: 'simulation.pause',
              });
            }}
          >
            Pausieren
          </Button>
        )}

        <Button
          variant="secondary"
          disabled={disabled}
          aria-label="Einen Simulationsschritt ausführen"
          onClick={handleStep}
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
