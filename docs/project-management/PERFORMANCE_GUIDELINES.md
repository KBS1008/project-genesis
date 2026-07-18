# Performance Guidelines

**Project:** Project Genesis

**Document:** Performance Guidelines

**Version:** 1.0

**Status:** Active

**Last Updated:** 2026-07-18

---

# Purpose

This document defines the performance guidelines for Project Genesis.

The objective is to ensure that the project remains performant and scalable as the following systems grow:

- simulation complexity
- entity count
- NPC populations
- production chains
- logistics networks
- economic activity
- world size
- asset count
- rendering complexity
- savegame size

Performance is considered an architectural concern.

Performance decisions must not compromise:

- correctness
- determinism
- maintainability
- data integrity
- architectural boundaries

unless explicitly documented and justified.

---

# Performance Philosophy

Project Genesis follows these principles:

1. Measure before optimizing.
2. Optimize based on evidence.
3. Protect simulation determinism.
4. Avoid premature optimization.
5. Prefer simple algorithms until profiling identifies a bottleneck.
6. Optimize hot paths before cold paths.
7. Minimize unnecessary work.
8. Separate simulation performance from rendering performance.
9. Prefer predictable performance over accidental performance.
10. Performance regressions must be detectable.

---

# Performance Priorities

Performance priorities should generally follow:

```text
1. Correctness
2. Determinism
3. Stability
4. Scalability
5. Maintainability
6. Performance Optimization
```

Performance optimizations must not silently change domain behaviour.

---

# Performance Budgets

Important systems should have explicit performance budgets where practical.

Examples:

```text
Simulation Tick
    Target: defined by simulation requirements

Frame Time
    Target: defined by target platform

Save Operation
    Target: acceptable user experience

Load Operation
    Target: acceptable user experience

Memory
    Target: platform-dependent

Asset Loading
    Target: platform-dependent
```

Exact budgets should be defined based on actual target platforms and project milestones.

---

# Measurement Before Optimization

Performance work should follow:

```text
Identify Problem

↓

Measure

↓

Profile

↓

Find Bottleneck

↓

Define Target

↓

Optimize

↓

Measure Again

↓

Verify Correctness

↓

Verify Determinism
```

Do not optimize based solely on assumptions.

---

# Profiling

Profiling should be used to identify:

- CPU bottlenecks
- memory allocations
- memory usage
- garbage collection
- I/O bottlenecks
- rendering bottlenecks
- simulation bottlenecks
- synchronization costs

Profiling data should be captured under representative workloads.

---

# Representative Workloads

Performance testing should use realistic scenarios.

Examples:

```text
Small World
    Low entity count

Medium World
    Typical gameplay

Large World
    High entity count

Stress World
    Extreme simulation conditions
```

A system that performs well in a small test environment may still fail at scale.

---

# Simulation Performance

The simulation is a critical performance subsystem.

Simulation performance should be measured independently from rendering.

Conceptually:

```text
Rendering Performance
        ≠
Simulation Performance
```

A visually simple frame may still contain expensive simulation work.

---

# Simulation Tick Budget

The simulation should have a defined target tick budget.

The target depends on the chosen simulation architecture.

Example:

```text
Simulation Tick
    ↓
Systems execute
    ↓
State updated
    ↓
Events processed
```

The total execution time must remain within the required simulation budget under expected workloads.

---

# Tick Stability

Average performance is not sufficient.

The simulation should also monitor:

- average tick duration
- median tick duration
- worst-case tick duration
- tick duration variance

Large spikes can cause:

- simulation instability
- frame stalls
- delayed updates
- poor user experience

---

# Simulation Scheduling

Simulation systems should be scheduled deliberately.

Avoid unnecessary execution of systems that have no relevant work.

Possible strategies include:

- dirty flags
- change detection
- event-driven updates
- batching
- scheduling
- time slicing

The strategy must preserve deterministic behaviour.

---

# Event-Driven Processing

Event-driven processing should be preferred when continuous evaluation is unnecessary.

Example:

Avoid:

```text
Every Tick:
    Check Every Factory
    Check Every Contract
    Check Every Transport
```

Prefer where appropriate:

```text
Relevant Event
    ↓
Schedule Required Update
```

However, event-driven systems must not introduce hidden ordering or determinism problems.

---

# Batch Processing

Operations affecting many entities should use batching where practical.

Example:

```text
Process 10,000 Entities
```

may be more efficient as:

```text
Batch 1
Batch 2
Batch 3
...
```

Batching should preserve deterministic ordering where required.

---

# Time Slicing

Expensive work may be distributed across multiple simulation ticks when gameplay semantics allow it.

Example:

```text
Large Calculation

Tick 1 → Batch A
Tick 2 → Batch B
Tick 3 → Batch C
```

Time slicing must not change domain semantics unexpectedly.

---

# Entity Processing

Systems should avoid unnecessary full-world scans.

Avoid:

```text
For Every Tick:
    Iterate All Entities
```

when only a subset is relevant.

Prefer:

- indexed collections
- filtered queries
- spatial partitioning
- event-driven updates
- active entity lists

---

# Data Locality

Performance-sensitive systems should consider data locality.

Where appropriate:

- prefer contiguous data
- minimize unnecessary pointer chasing
- reduce cache-unfriendly access
- group frequently accessed data

The implementation must remain understandable.

Data-oriented optimization should be introduced when profiling demonstrates value.

---

# Memory Allocation

High-frequency systems should minimize unnecessary allocations.

Avoid excessive allocation in:

- simulation ticks
- rendering loops
- NPC updates
- pathfinding
- event processing

Where appropriate, consider:

- object pooling
- reusable buffers
- preallocated collections
- value types
- allocation-free hot paths

Pooling should not introduce lifecycle complexity without measurable benefit.

---

# Garbage Collection

If the runtime uses garbage collection, GC pressure should be monitored.

Avoid frequent allocations in hot paths.

Monitor:

- allocation rate
- GC frequency
- GC pause time
- memory growth

Performance optimization must not create memory leaks or ownership ambiguity.

---

# Data Structures

Choose data structures based on actual access patterns.

Consider:

- lookup frequency
- iteration frequency
- insertion/removal frequency
- memory footprint
- ordering requirements

Do not select data structures solely because they are familiar.

---

# Algorithmic Complexity

Performance-critical algorithms should consider computational complexity.

Examples:

```text
O(1)
O(log n)
O(n)
O(n log n)
O(n²)
```

Avoid unnecessary:

```text
O(n²)
```

or worse operations in systems expected to scale to large entity populations.

---

# Complexity Review

Algorithms with high complexity should be reviewed when they operate on:

- NPC populations
- production networks
- logistics networks
- markets
- pathfinding
- world-wide queries

The expected maximum input size should be considered.

---

# NPC Performance

NPC systems may become a major performance driver.

NPC processing should consider:

- update frequency
- level of detail
- relevance
- distance
- activity state
- simulation importance

Not every NPC needs the same update frequency.

---

# NPC Simulation Levels

Where appropriate, NPCs may use different simulation levels.

Example:

```text
Level 1
Full simulation

Level 2
Reduced simulation

Level 3
Aggregated simulation

Level 4
Statistical representation
```

Transitions between levels must preserve important domain state.

---

# NPC Update Frequency

NPCs may be updated at different frequencies depending on relevance.

Example:

```text
Player-near NPC
    High frequency

Active economic NPC
    Medium frequency

Distant NPC
    Low frequency
```

The exact strategy must be compatible with simulation determinism.

---

# Economy Performance

Economic systems may process large numbers of transactions.

Performance considerations include:

- transaction batching
- market update frequency
- aggregation
- indexing
- caching

Economic calculations must remain correct and deterministic.

---

# Production Performance

Production systems should avoid recalculating unchanged production chains.

Possible strategies:

- dirty flags
- cached calculations
- event-driven updates
- dependency graphs

Cached results must be invalidated correctly.

---

# Logistics Performance

Logistics systems may involve:

- pathfinding
- routing
- scheduling
- transport
- inventory updates

Performance strategies may include:

- route caching
- path caching
- spatial indexing
- batched route calculations
- hierarchical routing

Caching must not produce stale or invalid decisions.

---

# Pathfinding

Pathfinding is potentially expensive.

The project should consider:

- caching
- hierarchical pathfinding
- navigation graphs
- spatial partitioning
- incremental pathfinding

Pathfinding results should be invalidated when relevant world state changes.

---

# Rendering Performance

Rendering performance must be treated separately from simulation performance.

Optimization areas include:

- draw calls
- batching
- instancing
- culling
- level of detail
- texture usage
- shader complexity
- particle counts

Rendering optimizations must not modify authoritative simulation state.

---

# Level of Detail

Level of Detail may be used for:

- geometry
- animation
- effects
- NPC representation
- world objects

LOD transitions should be visually acceptable.

Simulation state should remain authoritative independently of visual LOD.

---

# Culling

Systems should avoid rendering objects that are not visible where practical.

Possible strategies:

- frustum culling
- distance culling
- occlusion culling

Culling should not remove required simulation processing unless the simulation explicitly supports relevance-based simulation.

---

# Asset Performance

Assets should be optimized for:

- memory
- loading time
- rendering
- storage

Large assets should not be loaded unnecessarily.

Use:

- streaming
- lazy loading
- asynchronous loading
- asset bundles
- compression

where appropriate.

---

# Asset Loading

Asset loading should avoid blocking critical runtime execution.

Where practical:

```text
Request Asset

↓

Load Asynchronously

↓

Validate

↓

Prepare

↓

Activate
```

Critical startup assets may be loaded synchronously when required.

---

# Save Performance

Save operations should be measured.

Monitor:

- serialization time
- compression time
- file write time
- total save duration
- memory usage

Save operations should avoid unnecessary full-world processing when incremental persistence is safe.

---

# Load Performance

Load operations should be measured.

Possible strategies include:

- staged loading
- asynchronous loading
- incremental reconstruction
- parallel processing

Loading must always preserve data integrity.

---

# Serialization

Serialization should be optimized carefully.

Avoid serializing:

- derived data
- caches
- temporary state

unless explicitly required.

Only authoritative state should normally be persisted.

---

# Caching

Caching may be used to improve performance.

A cache must define:

- ownership
- lifetime
- invalidation rules
- consistency guarantees

The cache must never become an accidental second source of truth.

---

# Cache Invalidation

Every cache must have an explicit invalidation strategy.

Possible approaches:

```text
Time-based

Event-based

Version-based

Dependency-based

Explicit invalidation
```

Caching without a defined invalidation strategy should be avoided.

---

# Concurrency

Concurrency may be used to improve performance.

However, concurrency must not compromise:

- determinism
- data integrity
- ordering
- reproducibility

Parallel execution is appropriate only when dependencies are clearly understood.

---

# Parallel Simulation

Parallel simulation should be considered only when:

- systems are independent
- execution order is controlled
- shared state is protected
- deterministic results are guaranteed

Parallelization must be justified by profiling.

---

# Thread Safety

Shared mutable state should be minimized.

Where concurrency exists, define:

- ownership
- synchronization
- access rules

Avoid hidden shared mutable state.

---

# Async Operations

Asynchronous operations should be used for:

- I/O
- asset loading
- save/load
- network operations

Async operations should not implicitly modify authoritative simulation state outside controlled boundaries.

---

# Performance and Determinism

Performance optimizations must preserve deterministic behaviour.

The following must remain equivalent:

```text
Original Implementation
```

and:

```text
Optimized Implementation
```

for identical simulation inputs.

If an optimization changes deterministic results, it must be treated as a behavioural change and reviewed accordingly.

---

# Floating-Point Considerations

Floating-point calculations may produce platform-dependent differences.

Critical deterministic systems should consider:

- fixed-point arithmetic
- deterministic numeric libraries
- controlled rounding
- explicit precision rules

The chosen strategy should be documented for each critical subsystem.

---

# Performance Instrumentation

Performance instrumentation should exist for critical systems.

Possible metrics:

```text
Tick Duration

System Duration

Entity Count

Active NPC Count

Event Count

Memory Usage

Allocation Rate

Save Duration

Load Duration
```

Instrumentation should have minimal performance overhead.

---

# Performance Logging

Performance data should integrate with:

```text
LOGGING_STRATEGY.md
```

High-frequency performance data should be aggregated or sampled.

Avoid logging every performance measurement individually in production.

---

# Performance Testing

Performance tests should be automated where practical.

Tests should include:

- baseline scenarios
- large-world scenarios
- stress scenarios
- regression scenarios

---

# Performance Baselines

Important systems should have recorded baselines.

Example:

```text
Scenario:
10,000 NPCs

Baseline:
Simulation Tick = X ms

Current:
Simulation Tick = Y ms
```

Significant deviations should trigger investigation.

---

# Performance Regression

A performance regression should be treated as a quality issue.

Examples:

```text
Tick duration increased significantly

Memory usage increased significantly

Save time increased significantly

Frame rate decreased significantly
```

Performance regressions should be tracked and prioritized according to impact.

---

# Performance Budget Violations

When a performance budget is exceeded:

```text
Measure

↓

Identify Bottleneck

↓

Assess Impact

↓

Create Issue

↓

Optimize or Accept

↓

Document Decision
```

Accepted violations should be documented.

---

# Optimization Review

Significant optimizations should be reviewed for:

- correctness
- determinism
- maintainability
- complexity
- memory behaviour
- test coverage

Performance improvements are not automatically good if they significantly increase architectural complexity.

---

# Performance and Technical Debt

Performance shortcuts may create technical debt.

Examples:

- duplicated caches
- uncontrolled pooling
- hidden global state
- complex optimization layers
- premature parallelization

Such debt should be recorded in:

```text
TECHNICAL_DEBT_REGISTER.md
```

---

# Anti-Patterns

Avoid:

- optimizing without profiling
- premature optimization
- unnecessary object pooling
- excessive caching
- hidden global state
- full-world scans every tick
- uncontrolled parallelism
- logging every simulation operation
- optimizing only average performance
- ignoring worst-case performance
- sacrificing determinism for speed without explicit approval

---

# Quality Requirements

Performance architecture must provide:

- measurable performance
- defined critical budgets
- profiling capability
- simulation scalability
- deterministic behaviour
- performance regression detection
- controlled memory usage
- scalable NPC processing
- scalable production and logistics systems

---

# Adoption Strategy

Performance work should be prioritized according to:

1. Critical simulation bottlenecks
2. Determinism-sensitive systems
3. Large entity populations
4. Save/load performance
5. Rendering bottlenecks
6. Asset loading
7. Memory usage
8. Secondary systems

---

# Migration

When optimizing existing systems:

```text
Identify Bottleneck

↓

Measure Baseline

↓

Define Target

↓

Implement Optimization

↓

Run Unit Tests

↓

Run Integration Tests

↓

Run Determinism Tests

↓

Run Performance Tests

↓

Compare Results

↓

Document Trade-Off

↓

Update Technical Debt
```

---

# Quality Gates

Performance-related quality gates should verify:

- no critical performance regression
- simulation remains within defined budget
- deterministic behaviour is preserved
- memory usage remains acceptable
- save/load remains usable

Performance thresholds should become stricter as the project matures.

---

# Related Documents

- TESTING_STRATEGY.md
- LOGGING_STRATEGY.md
- RESULT_PATTERN.md
- VALIDATION_STRATEGY.md
- QUALITY_GATES.md
- QUALITY_METRICS.md
- TECHNICAL_DEBT_POLICY.md
- TECHNICAL_DEBT_REGISTER.md
- AUDIT_PROCESS.md

---

# Summary

Performance is an architectural property of Project Genesis.

The project should optimize only where measurement demonstrates a meaningful bottleneck.

The primary goals are:

```text
Correctness
+
Determinism
+
Scalability
+
Predictability
```

Performance optimizations must preserve domain correctness and deterministic simulation behaviour.

The preferred optimization process is:

```text
Measure
    ↓
Profile
    ↓
Optimize
    ↓
Test
    ↓
Verify Determinism
    ↓
Measure Again
```

Performance improvements should be evidence-driven, documented and continuously monitored.