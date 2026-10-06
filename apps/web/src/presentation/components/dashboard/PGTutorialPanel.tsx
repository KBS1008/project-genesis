'use client';

import type { TutorialViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { DashboardIcon } from '@/presentation/icons/DashboardIcon';
import { getTutorialStepCtaLabel } from '@/presentation/navigation/tutorial-step-navigation-contract';
import { Button } from '@/presentation/primitives/Button';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';

/** Guided first-play checklist for the operations dashboard. */
export function PGTutorialPanel({
  tutorial,
}: {
  readonly tutorial: TutorialViewData | null | undefined;
}) {
  const { navigateTutorialStep, isBusy } = useGameWorkspace();

  if (tutorial === null || tutorial === undefined) {
    return null;
  }

  if (tutorial.completed) {
    return (
      <section
        className="pg-tutorial-panel pg-tutorial-panel-complete"
        aria-label="Erste Schritte abgeschlossen"
      >
        <div className="pg-tutorial-header">
          <DashboardIcon name="success" className="pg-tutorial-complete-icon" />
          <div>
            <h2>Erste Schritte abgeschlossen</h2>
            <p>
              Sie haben die Kernspielschleife durchlaufen. Erweitern Sie jetzt Produktion, Forschung
              und Personal.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pg-tutorial-panel" aria-label="Erste Schritte">
      <div className="pg-tutorial-header">
        <h2>Erste Schritte</h2>
        <p>Folgen Sie der Kernspielschleife aus dem Tutorial — ein Schritt nach dem anderen.</p>
      </div>
      <ol className="pg-tutorial-steps">
        {tutorial.steps.map((step) => {
          const isActive = step.id === tutorial.activeStepId;
          const ctaLabel = step.completed ? null : getTutorialStepCtaLabel(step.id);

          return (
            <li
              key={step.id}
              className={`pg-tutorial-step${step.completed ? ' is-complete' : ''}${isActive ? ' is-active' : ''}`}
            >
              <span className="pg-tutorial-step-marker" aria-hidden="true">
                {step.completed ? (
                  <DashboardIcon name="check" className="pg-tutorial-step-icon" />
                ) : null}
              </span>
              <div className="pg-tutorial-step-body">
                <strong>{step.title}</strong>
                <span>{step.description}</span>
                {ctaLabel !== null ? (
                  <Button
                    type="button"
                    variant="secondary"
                    className="pg-tutorial-step-cta"
                    disabled={isBusy}
                    onClick={() => {
                      navigateTutorialStep(step.id);
                    }}
                  >
                    {ctaLabel}
                  </Button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
