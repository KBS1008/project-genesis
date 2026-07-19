# M6 Logistics — Step 1: Warehouse Capacities Report

**Project:** Project Genesis  
**Milestone:** M6 Logistics  
**Step:** M6-1 Warehouse Capacities  
**Date:** 2026-07-18  
**Status:** Completed

---

# Goal

Enforce finite warehouse storage capacity from building content and surface utilization in dashboard UX.

---

# Implemented

| Area           | Change                                                                                         |
| -------------- | ---------------------------------------------------------------------------------------------- |
| Content        | `storageCapacity: 500` on `warehouse.yaml` (game + fixtures)                                   |
| Content loader | `BuildingTypeDefinition.storageCapacity`; required ≥ 1 for `STORAGE` category                  |
| Domain         | `BuildingStorage` tracks capacity, rejects overflow on deposit                                 |
| Application    | `TransportLogisticsService.ensureStorageForBuilding` syncs capacity; `canDepositToWarehouse()` |
| Market UX      | Buy hints disabled when warehouse full                                                         |
| Dashboard      | KPI capacity ratio, logistics banner, warehouse drill-down                                     |
| Savegame       | Optional `storageCapacity` on `buildingStorages[]` snapshots                                   |
| Tests          | `BuildingStorage.test.ts`, capacity integration test, loader assertion                         |

---

# Exit Check

- [x] Warehouse deposits respect `storageCapacity`
- [x] Capacity visible in dashboard
- [x] Market buy blocked with reason when full
- [x] Tests green

---

# Next Step (M6-2)

Abstract **transport routes** — replace fixed `DEFAULT_TRANSPORT_DURATION` with route/content-derived durations per building pair (still no individual vehicles per DD-022).
