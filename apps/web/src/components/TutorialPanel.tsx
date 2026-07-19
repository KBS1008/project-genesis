import type { TutorialProgressReadModel } from '@/lib/api';
import { DashboardIcon } from '@/components/icons/DashboardIcons';

/** Guided first-play checklist from core gameplay documentation. */
export function TutorialPanel({
  tutorial,
}: {
  readonly tutorial: TutorialProgressReadModel | null | undefined;
}) {
  if (tutorial === null || tutorial === undefined) {
    return null;
  }

  if (tutorial.completed) {
    return (
      <section
        className="tutorial-panel tutorial-panel-complete"
        aria-label="Erste Schritte abgeschlossen"
      >
        <div className="tutorial-header">
          <DashboardIcon name="success" className="tutorial-complete-icon" />
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
    <section className="tutorial-panel" aria-label="Erste Schritte">
      <div className="tutorial-header">
        <h2>Erste Schritte</h2>
        <p>Folgen Sie der Kernspielschleife aus dem Tutorial — ein Schritt nach dem anderen.</p>
      </div>
      <ol className="tutorial-steps">
        {tutorial.steps.map((step) => {
          const isActive = step.id === tutorial.activeStepId;

          return (
            <li
              key={step.id}
              className={`tutorial-step${step.completed ? ' is-complete' : ''}${isActive ? ' is-active' : ''}`}
            >
              <span className="tutorial-step-marker" aria-hidden="true">
                {step.completed ? (
                  <DashboardIcon name="check" className="tutorial-step-icon" />
                ) : null}
              </span>
              <div className="tutorial-step-body">
                <strong>{step.title}</strong>
                <span>{step.description}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
