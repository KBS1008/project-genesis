'use client';

import { assignEmployee, hireEmployee } from '@/presentation/adapters/api/employees-client';
import type { CommandId } from '@/presentation/commands';
import { Button } from '@/presentation/primitives/Button';
import { EmptyState } from '@/presentation/primitives/EmptyState';

/** Token-based sidebar actions for the operations dashboard (S7). */
export function PGOperationsSidebar({
  hasGame,
  hints,
  runAction,
}: {
  readonly hasGame: boolean;
  readonly hints: SidebarHintsViewData;
  readonly runAction: (
    action: () => Promise<void>,
    successMessage: string,
    options?: { readonly commandId?: CommandId },
  ) => Promise<void>;
}) {
  return (
    <>
      <p className="pg-operations-sidebar-title">Aktionen</p>

      <section className="pg-operations-sidebar-group" aria-labelledby="pg-operations-personal-label">
        <h3 id="pg-operations-personal-label" className="pg-operations-sidebar-label">
          Personal
        </h3>
        {hints.hireEmployee.length === 0 ? (
          <EmptyState title="Keine Einstellungsoptionen verfügbar." />
        ) : (
          <div className="pg-operations-sidebar-actions">
            {hints.hireEmployee.map((hint) => (
              <Button
                key={hint.employeeTypeId}
                disabled={!hasGame || !hint.canHire}
                title={hint.reason ?? undefined}
                onClick={() => {
                  void runAction(
                    () =>
                      hireEmployee({
                        employeeTypeId: hint.employeeTypeId,
                        displayName: hint.defaultDisplayName,
                      }),
                    `${hint.name} eingestellt.`,
                    { commandId: 'employees.hire' },
                  );
                }}
              >
                {hint.name} ({hint.costLabel})
              </Button>
            ))}
          </div>
        )}
        {hints.assignEmployee.filter((hint) => hint.canAssign).length === 0 ? (
          <EmptyState title="Keine Zuweisungen möglich." />
        ) : (
          <div className="pg-operations-sidebar-actions">
            {hints.assignEmployee
              .filter((hint) => hint.canAssign)
              .map((hint) => (
                <Button
                  key={`${hint.employeeId}-${hint.buildingId}`}
                  variant="secondary"
                  disabled={!hasGame}
                  title={hint.reason ?? undefined}
                  onClick={() => {
                    void runAction(
                      () =>
                        assignEmployee({
                          employeeId: hint.employeeId,
                          buildingId: hint.buildingId,
                        }),
                      `${hint.employeeName} zugewiesen.`,
                      { commandId: 'employees.assign' },
                    );
                  }}
                >
                  {hint.employeeName} → {hint.buildingName}
                </Button>
              ))}
          </div>
        )}
      </section>
    </>
  );
}
