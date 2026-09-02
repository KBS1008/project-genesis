# Project Genesis — V1.0 Known Issues

**Applies to:** `v1.0.0-rc.1` @ `442665cd6437bdebff88fd1540cedc689238c240`  
**Last updated:** 2026-09-02 (M12.8 Final Release Documentation)  
**Release status:** Version 1.0 **not yet released**

Classification key:

| Tag | Meaning |
|-----|---------|
| **KNOWN_NON_BLOCKING** | Accepted for V1; does not block release candidate or QA approval |
| **ADVISORY** | Operator/developer note |
| **DOCUMENTATION_LIMITATION** | Documented scope boundary, not a product defect |
| **POST_V1** | Tracked for future work |

---

## KNOWN_NON_BLOCKING

### POLISH-08 — Manual responsive accessibility sweep

Manual responsive/a11y sweep across target viewports was not executed. Automated axe tests pass in the regression suite (shell, dashboard, charts). M11 Gate 4 classified this as non-blocking.

### Root build / typecheck / lint debt

`pnpm build` (root), `pnpm typecheck`, and `pnpm lint` may report failures. These are **not** RC or V1 release gates. Authoritative gates: `pnpm test`, `pnpm build:web`, API production build.

### Mockup visual parity gaps

Runtime screens exist for core flows; full mockup parity (Research, Finance, Transport polish, Phase 7–9 backlog) remains incomplete. Non-blocking for V1.

### Minor dashboard layout containment

Company dashboard may show internal scroll in constrained viewports. KPI clipping/overlap regressions are guarded; minor overflow is accepted per M12.4 RC validation.

---

## ADVISORY

### Validated browser environment

Formal QA validated **Cursor embedded Chromium**. Other browsers may work but are not certified for V1.

### Development vs production API

Dev-only routes (`/api/dev/*`) are unavailable in the compiled production API (`NODE_ENV=production`). Use development mode for asset tooling routes.

### Rebuild after API origin changes

Changing `API_ORIGIN` or `NEXT_PUBLIC_API_ORIGIN` requires rebuilding the web app — both are resolved at build time.

---

## DOCUMENTATION_LIMITATION

### Session-scoped event log and notifications

Player event log and UI notifications are **not persisted** in savegame snapshots (V3 schema). After load, the session log starts fresh. This is **by design**, not a save/load defect. See M12.5 certification §N.

### No numeric performance guarantees

V1 performance validation is qualitative (M12.6 TYPE C). No FPS, memory, latency, or tick-throughput SLA is published.

### No distribution packaging

V1 documentation covers local source-based dual-runtime operation only. No installer, Docker image, or cloud deployment guide is provided.

---

## POST_V1

| Item | Notes |
|------|-------|
| WCAG version target | Undefined; axe baseline only |
| Animations / audio / localization | Deferred beyond M11/M12 scope |
| CI/CD release pipeline | Not in V1 contract |
| Universal browser matrix | Not established |
| CHANGELOG.md | Conventional changelog not maintained; M12.9 may add at final tag |

---

## Resolved (not current issues)

The following were addressed before or during RC validation and are **not** listed as open V1 blockers:

- Dual-runtime production path (M12.1)
- RC baseline reproducibility (M12.2)
- Dashboard flicker / reconnect oscillation (M12 UI stability fixes)
- Warehouse EntitySelection compile regression (M12 prep)

---

## Reporting Defects

For the release candidate, refer to certification reports under `docs/architecture/reviews/M12_*` before reopening closed gates.
