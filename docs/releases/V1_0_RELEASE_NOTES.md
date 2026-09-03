# Project Genesis — V1.0 Release Notes (Draft)

**Status:** **Approved for V1.0 release** (Executive Review M12.9)  
**Release candidate:** `v1.0.0-rc.1` @ `442665cd6437bdebff88fd1540cedc689238c240`  
**Runtime certified commit:** `442665cd6437bdebff88fd1540cedc689238c240`  
**Last updated:** 2026-09-03 (M12.9 Executive Review)

---

## Overview

Project Genesis V1 is a single-player economic simulation covering industrial production, logistics, research, energy, finance, and regional world simulation. Gameplay is data-driven and deterministic.

This document describes the **approved V1 release candidate**. Final release (`v1.0.0`) requires Executive Review (M12.9).

---

## V1 Scope (User-Visible)

- **Application shell:** main menu, new game, load game, settings, credits
- **Dashboard:** KPI cards, status panel, notifications, finance/production/research/transport widgets
- **World & regional visualization:** map, regions, biomes, cities
- **Production system:** recipes, jobs, facility operations, building placement
- **Economy:** markets, contracts, finance, payroll, research
- **Logistics:** transport routes and throughput
- **Simulation integration:** live ticks, commands, save/load, WebSocket updates
- **Content:** M10 industrial expansion content loaded from `game-content/`

Deferred beyond V1 (non-blocking): full mockup visual parity, animations/audio, localization, Docker/CI distribution.

---

## Quality Certifications

| Gate | Result | Report |
|------|--------|--------|
| Release candidate declaration | PASS | `M12_4_FIRST_RELEASE_CANDIDATE_VALIDATION_DECLARATION_REPORT.md` |
| Savegame compatibility & stability | PASS | `M12_5_V1_SAVEGAME_COMPATIBILITY_STABILITY_CERTIFICATION_REPORT.md` |
| Performance validation | PASS (qualitative) | `M12_6_V1_PERFORMANCE_CONTRACT_VALIDATION_CERTIFICATION_REPORT.md` |
| Formal QA approval | PASS | `M12_7_FORMAL_QA_APPROVAL_REPORT.md` |

Regression baseline at QA approval: **911 / 911** tests passing.

---

## Savegames

- Current schema: **V3**
- Legacy V1 and V2 saves migrate automatically on load
- Saves stored under `saves/` at repository root
- Invalid or unsupported saves are rejected before runtime state mutation

---

## Performance

V1 uses a **qualitative performance contract** (M12.6 TYPE C). No numeric FPS, latency, memory, or throughput SLA is guaranteed for V1.

---

## Running the Release Candidate

See:

- [`README.md`](../../README.md) — quick start
- [`docs/development/RC_RUNTIME_CONTRACT.md`](../development/RC_RUNTIME_CONTRACT.md) — authoritative dual-runtime contract

Requires Node.js ≥ 22, pnpm 11.3.0, built Web + API processes, and `game-content/` on disk.

---

## Known Limitations

See [`V1_0_KNOWN_ISSUES.md`](V1_0_KNOWN_ISSUES.md).

---

## Release Status

```text
V1.0 — APPROVED FOR RELEASE
Executive Review: M12.9 — APPROVED
Git tag v1.0.0 identifies the final V1.0 release commit.
```

Product release version is the git tag `v1.0.0`. Internal package metadata remains `0.1.0`. Runtime gameplay source remains the QA-certified RC at `442665c`.
