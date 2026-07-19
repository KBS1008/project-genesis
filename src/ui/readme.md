# User Interface Module

The `ui` module contains the presentation layer of Project Genesis.

It is responsible for displaying information, collecting user input and presenting the current game state.

The UI must never contain business logic.

---

# Purpose

The User Interface provides an intuitive way to interact with the simulation.

It translates user interactions into application commands and displays information returned by the Application Layer.

The UI is replaceable without affecting the Domain Layer.

---

# Responsibilities

The UI Layer is responsible for:

- Rendering views
- Handling user input
- Navigation
- Displaying simulation state
- Presenting reports and statistics
- Visual feedback
- Localization support

---

# Guiding Principles

The UI should always be:

- lightweight
- responsive
- replaceable
- accessible
- testable
- independent of business rules

---

# Planned Structure

```text
ui/

components/
views/
layouts/
controllers/
state/
assets/
localization/
```

The structure may evolve depending on the selected UI technology.

---

# Responsibilities in Detail

## Views

Views display application data.

Examples:

- Main Menu
- Company Dashboard
- Market Overview
- Production View
- Research Screen
- Region Map

Views should remain passive.

---

## Controllers

Controllers translate user interactions into Application Layer use cases.

Example:

```text
User clicks "Start Production"

↓

Controller

↓

StartProductionUseCase
```

Controllers should not contain business logic.

---

## State Management

The UI may maintain presentation state.

Examples:

- selected company
- current screen
- camera position
- expanded panels
- sorting preferences

Business state belongs to the Domain Layer.

---

## Components

Reusable visual building blocks.

Examples:

- Buttons
- Tables
- Tooltips
- Resource Icons
- Graphs
- Progress Bars

Components should remain independent and reusable.

---

# Communication

The UI communicates exclusively with the Application Layer.

```text
User

↓

UI

↓

Application

↓

Domain
```

The UI must never communicate directly with:

- Domain
- Simulation
- Infrastructure

---

# Rendering

Rendering should be entirely data-driven.

Views should display state rather than compute it.

Business calculations belong to the Domain Layer.

---

# Localization

All visible text should support localization.

Examples:

- labels
- menus
- tooltips
- error messages
- notifications

Simulation identifiers should remain language-independent.

---

# Dependency Rules

The UI may depend on:

- Application
- Common

The UI must not depend directly on:

- Domain
- Simulation
- Infrastructure
- Content

All interactions should pass through Application use cases.

---

# Error Handling

The UI is responsible for presenting errors in a user-friendly manner.

Business validation messages should originate from the Application Layer.

Technical exceptions should be logged and presented appropriately.

---

# Testing

Recommended tests:

- component tests
- controller tests
- navigation tests
- rendering tests
- accessibility tests

Business rules should never be tested in the UI Layer.

---

# Future Extensions

Possible future user interfaces:

- Desktop application
- Web application
- Dedicated editor
- Debug tools
- Headless administration interface

These should all consume the same Application Layer.

---

# Related Documentation

- docs/architecture/SAD.md
- docs/architecture/system-context.md
- docs/architecture/component-diagram.md
- docs/architecture/runtime-view.md
- docs/architecture/deployment-view.md

---

# Summary

The User Interface Module presents the state of Project Genesis to the player and forwards user interactions to the Application Layer.

The active browser shell is implemented in `apps/web/` (Next.js). This folder documents UI-layer conventions and may hold shared assets later.

---
