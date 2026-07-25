# M10 – Content Expansion Plan

**Project:** Project Genesis

**Milestone:** M10

**Status:** Complete

**Prerequisite:** M9 completed

---

# Executive Summary

Milestone M10 expands the gameplay depth of Project Genesis.

Unlike previous milestones, M10 introduces very little new infrastructure.

The objective is to significantly increase gameplay variety while preserving all existing architectural principles.

The implementation must continue to follow:

- DD-029 Modular Monolith
- DD-032 Deterministic Tick Processing
- DD-033 Savegame Strategy
- DD-038 Presentation Architecture

No architectural shortcuts are allowed.

---

# Goals

Increase replayability.

Increase strategic depth.

Expand production.

Expand logistics.

Expand company management.

Expand AI behaviour.

Expand research.

Expand world simulation.

Maintain deterministic simulation.

Maintain savegame compatibility.

---

# Non Goals

No framework migration.

No rendering engine changes.

No ECS redesign.

No simulation redesign.

No UI framework replacement.

No networking changes.

---

# High-Level Objectives

## Production Expansion

Introduce additional production chains.

Increase dependency complexity.

Add multiple production tiers.

Support optional luxury production.

Examples:

Ore

↓

Steel

↓

Machine Parts

↓

Industrial Machinery

↓

Advanced Electronics

↓

Consumer Goods

---

## Buildings

Expand available buildings.

Examples:

Power Plant

Warehouse

Distribution Center

Regional Headquarters

Corporate Headquarters

University

Research Campus

Recycling Facility

Port

Airport

Rail Terminal

Logistics Hub

Maintenance Facility

Training Center

---

## Research Expansion

Expand the technology tree.

Support multiple research branches.

Industrial

Energy

Automation

Transport

Management

Finance

Agriculture

Chemistry

Electronics

Artificial Intelligence

Late-game technologies should unlock entirely new production paths.

---

## Company Management

Introduce deeper management mechanics.

Departments

HR

Finance

Operations

Research

Logistics

Marketing

Executive Board

Support company specialization.

Support management bonuses.

Support employee progression.

---

## Economy Expansion

Increase market depth.

Possible systems:

Seasonal demand

Regional demand

Trade restrictions

Import costs

Export contracts

Government subsidies

Economic crises

Inflation (optional)

Taxation (optional)

Interest rates (optional)

---

## Transport Expansion

Expand logistics.

Road

Rail

Sea

Air

Support routing.

Support priorities.

Support warehouse balancing.

Support supply chains.

---

## AI Expansion

Improve Company Brain.

Support:

Expansion planning

Market specialization

Aggressive pricing

Long-term investments

Research planning

Logistics planning

Regional expansion

Mergers (future)

---

## World Expansion

Expand regional simulation.

Regional modifiers.

Population growth.

Infrastructure level.

Education.

Energy availability.

Natural resources.

Environmental modifiers.

---

# UI Expansion

Reuse DD-038 Presentation Architecture.

New screens may include:

Transport Overview

Supply Chains

Research Tree

Corporate Management

Department Management

Regional Analytics

Trade Contracts

Infrastructure

Economy Overview

AI Competitor Overview

All screens shall use:

ViewData

↓

Queries

↓

Commands

↓

Application

↓

Domain

---

# Savegame Compatibility

Maintain migration chain.

V1

↓

V2

↓

V3

↓

Future

Never modify previous contracts.

Always migrate.

---

# Performance Requirements

Simulation speed shall not decrease.

New systems must scale.

Avoid O(n²).

Prefer indexed lookups.

Preserve deterministic execution.

---

# Testing Requirements

Unit Tests

Integration Tests

Simulation Tests

Economy Tests

AI Tests

Savegame Tests

Performance Benchmarks

Regression Tests

---

# Documentation Requirements

Update:

IMPLEMENTATION_PROGRESS.md

Relevant ADRs

Simulation documentation

Economy documentation

Research documentation

Transport documentation

AI documentation

---

# Implementation Phases

## Phase 0

Architecture Audit

Content Review

Design Review

Gate 0

---

## Phase 1

Production Expansion

Resources

Intermediate products

Factories

Recipes

Balancing

---

## Phase 2

Building Expansion

New building categories

Construction

Placement

Costs

Requirements

---

## Phase 3

Research Expansion

Technology tree

Unlocks

Dependencies

Bonuses

---

## Phase 4

Transport Expansion

Vehicles

Warehouses

Routes

Distribution

Priorities

---

## Phase 5

Company Management

Departments

Employees

Management

Specialization

Bonuses

---

## Phase 6

Economy Expansion

Regional economy

Trade

Demand

Supply

Contracts

---

## Phase 7

AI Expansion

Planning

Expansion

Research

Pricing

Transport

Competition

---

## Phase 8

World Expansion

Regional modifiers

Infrastructure

Population

Resources

---

## Phase 9

Balancing

Simulation tuning

Economy tuning

AI tuning

Difficulty

---

## Phase 10

Final Integration

Performance

Regression

Savegames

Documentation

Release Candidate

---

# Gate Reviews

Gate 0

Architecture Review

Before implementation.

---

Gate 1

After Phase 3.

Review:

Production

Buildings

Research

Architecture

Savegame compatibility

---

Gate 2

After Phase 8.

Review:

Transport

Economy

Company

AI

World

Simulation

Performance

---

Gate 3

After Phase 10.

Final architecture review.

Regression review.

Performance review.

Documentation review.

Release readiness.

---

# Completion Criteria

Production chains expanded.

Buildings expanded.

Research expanded.

Transport expanded.

Company management expanded.

Economy expanded.

AI expanded.

World expanded.

Performance maintained.

Savegames compatible.

All tests passing.

Documentation synchronized.

Gate 3 passed.

Milestone completed.