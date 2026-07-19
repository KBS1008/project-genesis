# Company Domain (Phase 1)

The `company` module models the player-owned economic entity at the center of Project Genesis.

## Phase 1 scope (intentionally minimal)

During Phase 1 Core Domain, the `Company` aggregate is **identity and lifecycle metadata only**:

- `create` — validates name/owner, sets `CompanyStatus.ACTIVE`, raises `CompanyFounded`
- `restore` — rehydrates persisted snapshots without domain events
- Read accessors — `getName`, `getOwnerId`, `getFoundedAt`, `getStatus`

There are **no** status transition methods (`bankrupt`, `liquidate`, etc.) in Phase 1.

`CompanyStatus` enumerates future lifecycle states (`VACATION`, `BANKRUPT`, `LIQUIDATED`, `BANNED`) for savegame compatibility and schema alignment. Transitions and business rules for those states belong to **M7+** domain work — not Phase 1.

## Related simulation code

`CompanySimulationSystem` (simulation layer) is registered in the default tick pipeline but is a **documented no-op stub** in Phase 1. Per-tick company rules (bankruptcy checks, vacation mode, world/region coupling) will be added when the corresponding domain services exist.

## Out of scope for Phase 1

- Bankruptcy or liquidation flows
- World / region ownership
- Employee or finance logic on the aggregate (handled by sibling aggregates)
- Content-layer imports in domain code

## References

```text
docs/schemas/Company.Schema.md
docs/architecture/domain-model.md
docs/development/PHASE1_CORE_DOMAIN_PLAN.md  (P1-05)
```
