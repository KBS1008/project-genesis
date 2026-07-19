# M6 Logistics — Step 3: Network Throughput Report

**Project:** Project Genesis  
**Milestone:** M6 Logistics  
**Step:** M6-3 Network Throughput  
**Date:** 2026-07-18  
**Status:** Completed

---

# Goal

Add an abstract **network throughput capacity** per transport route with FIFO queueing when the network is saturated (still no vehicle entities per DD-022).

---

# Implemented

| Area | Change |
|---|---|
| Content | `throughputCapacity` on `TransportRouteDefinition` + YAML (`route_storage_to_production`: 2 concurrent) |
| Domain policy | `TransportNetworkThroughputPolicy` — active count, dispatch eligibility, FIFO sort |
| Route resolution | `TransportRouteDurationPolicy.resolve()` returns `routeId`, `durationTicks`, `throughputCapacity` |
| Transport orders | `WAITING` status, `routeId`, `dispatch()` before tick progress |
| Application | `TransportLogisticsService.dispatchPendingTransports()` on create + each transport tick + after completion |
| Simulation | `TransportSimulationSystem` dispatches queue before ticking in-progress orders |
| Savegame | Optional `routeId`; `startTime` nullable for queued orders |
| Dashboard | `queuedTransportCount`, German status labels, route id in detail panel |
| Tests | Policy tests, queue saturation integration (capacity 2, 3 jobs) |

---

# Queue Flow

```text
createInboundTransports → WAITING

dispatchPendingTransports (FIFO by createdAt)

  activeOnRoute < throughputCapacity → IN_PROGRESS

TransportSimulationSystem.tick → COMPLETED → dispatch next WAITING
```

---

# Exit Check

- [x] Route throughput capacity from content
- [x] Excess orders queue with `WAITING` status
- [x] FIFO dispatch when capacity frees up
- [x] Dashboard shows queued transports
- [x] Tests green

---

# Milestone Gate

M6 exit criteria **routing operational** met: capacities (M6-1), route durations (M6-2), network throughput queue (M6-3).

Next: M7 World Simulation.

---

# DD-022 Scope Confirmation

M6-3 **without vehicles** matches **DD-022 Version 1** (abstract logistics network, no vehicle entities, no pathfinding). DD-022 Version 3 allows optional visible vehicles as **presentation only**; the simulation contract (transport orders, route throughput, FIFO queue) must remain stable.

---

# Extension Architecture (Vehicle-Ready)

The current design keeps queue/throughput rules in **domain policies** and uses the application layer only for orchestration:

| Layer | Responsibility | Future vehicle layer |
|---|---|---|
| `TransportNetworkThroughputPolicy` | Per-`routeId` active count, `canDispatch`, FIFO sort | Unchanged — vehicles consume slots, not replace rules |
| `TransportRouteDurationPolicy` | Resolve `routeId`, `durationTicks`, `throughputCapacity` | Optional adapter supplies **effective** capacity (fleet size, logistics center bonus) |
| `TransportOrder` | `WAITING` → `dispatch()` → `IN_PROGRESS` → tick | Same lifecycle; vehicles map to slot occupancy |
| `TransportLogisticsService.dispatchPendingTransports()` | Calls policies + repository | Inject capacity via port instead of static YAML lookup only |

**Intent:** A later vehicle/fleet module adjusts **effective throughput** (or slot availability) per route; it does **not** reimplement FIFO or queue ordering.

---

# Audit Checklist (2026-07-19)

| Criterion | Status | Evidence / note |
|---|---|---|
| Throughput limit per route | ✅ | `throughputCapacity` on route content; enforced per `routeId` |
| FIFO under overload | ✅ | `findWaiting()` by `createdAt`; integration test (cap 2, 3 orders) |
| Deterministic queue processing | ✅ | Stable sort by `createdAt`; snapshot updated after each dispatch in one tick |
| Behaviour at full capacity | ✅ | Excess orders stay `WAITING`; dashboard `queuedTransportCount` |
| Routing across multiple routes | 🟡 Partial | Independent queues per `routeId` supported; only one route in content; no multi-hop path |
| Tests normal + overloaded | ✅ / 🟡 | Normal path in integration test #1; overload in test #2; no multi-route isolation test yet |
| Abstract network vs vehicle capacity | ✅ | No vehicle sim; policies are route-scoped; vehicles deferred per DD-022 |

---

# Open Points (Follow-Up Tasks)

| ID | Topic | Suggested milestone | Dependency |
|---|---|---|---|
| O-01 | **Vehicle / fleet capacity adapter** — `TransportCapacityPort` (effective throughput from fleet, logistics buildings) | Post-M6 or M10+ | M6-3 policies stable |
| O-02 | **Multi-route content + tests** — second route YAML + isolation test (queues do not cross routes) | M6 gate / M10 | M6-2 route loader |
| O-03 | **Transport priority** — `transport.md` priority levels (not FIFO-only) | M6.x or M9 | M6-3 queue |
| O-04 | **Vehicle visualization** — DD-022 V3 optional UI layer bound to abstract orders | M11 / M9+ | O-01 optional |
| O-05 | **M6 “Vehicles” deliverable closure** — document DD-022 V1 waiver (schema/docs only, no sim entities) in gate review | ✅ Closed AUD-004 | DD-022 |

No vehicle implementation belongs in M6-3.
