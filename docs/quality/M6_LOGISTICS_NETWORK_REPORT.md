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
