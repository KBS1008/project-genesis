# M6 Logistics — Step 2: Transport Routes Report

**Project:** Project Genesis  
**Milestone:** M6 Logistics  
**Step:** M6-2 Transport Routes  
**Date:** 2026-07-18  
**Status:** Completed

---

# Goal

Replace the fixed inbound transport duration with **content-derived route durations** per building pair (abstract routes per DD-022 — no vehicle entities).

---

# Implemented

| Area             | Change                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Content          | `TransportRouteDefinition`, registry, loader, validator                                                                        |
| Content YAML     | `game-content/logistics/route_storage_to_production.yaml` (`STORAGE → PRODUCTION`, 8 ticks)                                    |
| Validation       | `validateTransportRouteReferences` wired into `validateGameContent`                                                            |
| Domain policy    | `TransportRouteDurationPolicy` — building-type pair → category pair → fallback (5 ticks)                                       |
| Application      | `TransportLogisticsService` resolves duration on `createInboundTransports`; `resolveInboundTransportDurationTicks()` for hints |
| Dashboard        | Transport table shows `durationTicks`; detail panel + production hints use resolved duration                                   |
| API / read model | `TransportOrderSessionReadModel.durationTicks`                                                                                 |
| Tests            | Policy unit tests, loader tests, integration loop uses route duration (8)                                                      |

---

# Route Resolution Priority

1. Exact `sourceBuildingTypeId` + `destinationBuildingTypeId` match (enabled routes only)
2. `sourceCategory` + `destinationCategory` match
3. `FALLBACK_TRANSPORT_DURATION_TICKS` (= 5)

---

# Exit Check

- [x] Transport orders use content route duration (not hardcoded 5)
- [x] Official game content loads `logistics/` routes
- [x] Dashboard shows per-order duration
- [x] Domain layer does not import content modules
- [x] Tests green

---

# Next Step (M6-3)

**Network throughput** — capacity/queue model beyond single-order duration (still abstract, no vehicles).
