# DD-018 Amendment – Regional Market Architecture

**Status:** Accepted

**Amends:** DD-018 – Economy & Market Architecture

**Date:** YYYY-MM-DD

**Authors:** Project Genesis Team

**Related ADRs:**

- DD-006 – Economic Simulation
- DD-009 – Event-Driven Architecture
- DD-015 – Content Architecture
- DD-029 – Modular Monolith
- DD-032 – Deterministic Tick Processing
- DD-0XX – Company Brain & Decision Queue

---

# Context

Milestones M4 through M7 introduced a deterministic economy consisting of:

- companies
- inventories
- production
- logistics
- finance
- research
- a global market

The architecture review for M8 confirmed that the existing implementation provides a single global market with deterministic instant trading.

Milestone M8 introduces autonomous companies operating across multiple world regions.

The existing global market model is therefore no longer sufficient.

At the same time, introducing a second economy implementation or replacing the existing market architecture would violate repository consistency.

---

# Problem

The economy must evolve from one global market into multiple regional markets.

The architecture must preserve:

- deterministic execution
- existing business rules
- existing Application use cases
- existing repositories
- existing market services

Regionalisation shall therefore extend the current implementation instead of replacing it.

---

# Decision

Each world region owns exactly one market.

The market remains the authoritative economic entity for:

- pricing
- supply
- demand
- liquidity
- transaction history

The existing Market aggregate shall be extended rather than replaced.

There shall never be multiple market implementations.

---

# Regional Market Model

The economic hierarchy becomes:

```text
World

↓

Region

↓

Regional Market

↓

Companies

↓

Production

↓

Trade
```

Every company participates in one or more regional markets depending on its operational presence.

---

# Market Responsibilities

A Regional Market owns:

- current prices
- supply
- demand
- liquidity indicators
- price history
- transaction history
- regional statistics

The market does not own:

- inventories
- companies
- production
- transport
- buildings

Those remain separate aggregates.

---

# Pricing

Prices remain deterministic.

Prices are calculated from:

- regional supply
- regional demand
- production
- consumption
- transportation effects
- configured balancing parameters

No random price fluctuations are permitted.

---

# Trading Model

M8 continues using deterministic instant trading.

Trading therefore follows:

```text
Company Decision

↓

BuyResourceUseCase

↓

Regional Market

↓

Domain Validation

↓

Inventory

↓

Finance
```

and

```text
Company Decision

↓

SellResourceUseCase

↓

Regional Market

↓

Domain Validation

↓

Inventory

↓

Finance
```

Existing Application use cases remain authoritative.

---

# Deferred Order Book

A full order-book simulation is explicitly outside the scope of M8.

The following features are deferred:

- bid orders
- ask orders
- order matching
- partial fills
- market makers
- arbitrage
- speculative trading

These capabilities may be introduced in a future milestone without replacing the Regional Market architecture.

---

# Market History

Each regional market stores deterministic historical information.

Examples include:

- prices
- traded volume
- supply
- demand
- liquidity
- shortages
- surpluses

History supports:

- AI planning
- economic analysis
- statistics
- replay
- savegames

History retention may be bounded using deterministic policies.

---

# Multi-Region Companies

Companies may operate in multiple regions.

Operational presence is established through:

- buildings
- logistics
- production facilities

A company does not own a separate market.

Instead, it participates in the market associated with each region in which it operates.

---

# Transport Integration

Markets remain independent.

Transport is responsible for moving resources between regions.

Transport therefore connects markets rather than replacing them.

Price differences between regions naturally create logistical incentives.

---

# Company Planning

The Company Brain evaluates:

- local prices
- historical prices
- transport costs
- production capacity
- profitability

Planning produces deterministic decisions.

Execution continues through the existing Application Layer.

---

# Simulation Integration

Regional markets are updated by simulation systems.

The simulation is responsible for:

- price updates
- demand aggregation
- supply aggregation
- historical snapshots

Markets contain no scheduling logic.

---

# Persistence

Savegames shall persist:

- every regional market
- regional prices
- historical data
- liquidity indicators
- regional statistics

Transient calculation caches shall never be serialized.

---

# Determinism

Regional markets shall remain deterministic.

Calculations depend only on:

- simulation state
- content definitions
- deterministic ordering
- historical state

The following are prohibited:

- wall-clock time
- unordered iteration
- asynchronous updates
- non-seeded randomness

---

# Consequences

## Positive

- Extends the existing Market aggregate.
- No duplicate economy implementation.
- Natural regional price differences.
- Improved logistics gameplay.
- Supports autonomous companies.
- Provides a foundation for future market evolution.

## Negative

- Increased savegame size.
- Additional simulation work each tick.
- More complex balancing.

---

# Alternatives Considered

## Keep a Single Global Market

Rejected.

Regional gameplay would have no economic meaning.

---

## Separate Market Implementation for NPCs

Rejected.

Would duplicate pricing rules and business logic.

---

## Full Order Book in M8

Rejected.

Would significantly increase implementation complexity and risk.

The existing instant-trade model is sufficient for M8.

---

## Random Regional Price Fluctuations

Rejected.

Would violate deterministic simulation.

---

# Migration Strategy

Migration shall occur incrementally.

Phase 1

- One Regional Market per Region.
- Instant trading retained.
- Regional pricing introduced.

Phase 2

- Market history.
- Liquidity metrics.
- Regional indicators.

Future Milestones

- Order books.
- Advanced market mechanics.
- Financial instruments.
- Arbitrage systems.

---

# Related Milestones

M8

Economy Simulation

M9

Population Simulation

Future

Advanced Financial Systems

---

# Implementation Notes

Implementation shall extend:

- Market aggregate
- Market repository
- Market simulation system
- Market trade service
- BuyResourceUseCase
- SellResourceUseCase

No parallel market implementation shall be introduced.

Regional markets become the single authoritative pricing mechanism for the entire simulation.