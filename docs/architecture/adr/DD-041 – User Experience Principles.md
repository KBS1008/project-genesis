# DD-041 – User Experience Principles

**Status:** Accepted

**Date:** YYYY-MM-DD

**Authors:** Project Genesis Team

**Supersedes:** None

**Superseded by:** None

---

# Context

Project Genesis is a management and industrial simulation with a high degree
of systemic complexity.

Players interact with:

- economic systems
- production chains
- logistics
- research
- finance
- AI companies
- global markets

The challenge is not creating complexity.

The challenge is making complexity understandable.

A formal UX architecture is therefore required to ensure that every new
feature follows the same user experience principles.

---

# Decision

Project Genesis adopts a User Experience Architecture based on five core
principles:

- Clarity
- Consistency
- Feedback
- Discoverability
- Efficiency

Every screen, workflow and interaction shall follow these principles.

UX becomes an architectural concern rather than an implementation detail.

---

# Objectives

The UX architecture shall ensure:

- low cognitive load
- fast decision making
- predictable interaction
- scalable interfaces
- accessibility
- consistent workflows
- professional presentation

---

# Core Principles

## 1. Clarity

Information shall always be understandable.

The player should immediately recognize:

- what happened
- why it happened
- what can be done next

The interface should reduce uncertainty.

---

## 2. Consistency

Identical interactions shall behave identically throughout the application.

Examples:

Buttons

Dialogs

Tables

Charts

Maps

Navigation

Tooltips

Keyboard shortcuts

Consistency has priority over novelty.

---

## 3. Feedback

Every player action shall produce feedback.

Examples:

Button press

Selection

Construction started

Research completed

Trade accepted

Save successful

Feedback may be:

Visual

Animated

Audio

Notification

Status change

The player must never wonder whether an action succeeded.

---

## 4. Discoverability

Important functionality shall be easy to find.

Examples:

Context menus

Tooltips

Search

Filters

Progressive disclosure

Empty-state guidance

Advanced functionality should remain accessible without overwhelming new players.

---

## 5. Efficiency

The interface shall minimize unnecessary interactions.

Examples:

Few clicks

Keyboard shortcuts

Context actions

Bulk operations

Remembered filters

Pinned panels

The experienced player should be able to work quickly.

---

# Information Hierarchy

Every screen shall present information in the following order:

Critical alerts

↓

Current state

↓

Actionable information

↓

Supporting details

↓

Historical information

↓

Advanced analytics

Important information shall never compete visually with secondary details.

---

# Cognitive Load

Interfaces should minimize unnecessary mental effort.

Avoid:

- excessive decoration
- duplicated information
- unexplained terminology
- unnecessary modal dialogs
- hidden workflows

Complexity should come from gameplay, not from the interface.

---

# Progressive Disclosure

Advanced functionality shall be revealed gradually.

Beginner players should not be overwhelmed.

Expert users should still have access to powerful tools.

Examples:

Advanced filters

Detailed reports

Simulation statistics

Developer information

---

# Navigation

Navigation shall always answer:

Where am I?

What can I do here?

How do I return?

Navigation depth should remain shallow.

---

# User Feedback

Every action shall communicate its result.

Feedback levels:

Information

Success

Warning

Critical

System

Feedback must be immediate and meaningful.

---

# Error Prevention

The preferred strategy is preventing mistakes.

Examples:

Validation before confirmation

Disabled invalid actions

Preview before irreversible actions

Confirmation for destructive operations

Undo where appropriate

---

# Error Recovery

When errors occur, the player shall receive:

- a clear explanation
- the reason (if known)
- the consequence
- the recommended next step

Technical implementation details must never be shown.

---

# Workflow Design

Workflows shall be:

predictable

linear where possible

interruptible

recoverable

repeatable

Reusable workflow patterns are preferred over unique screen behavior.

---

# Dashboard Philosophy

Dashboards exist to support decisions.

Every dashboard should answer:

What changed?

Why?

What needs attention?

What should I do next?

If these questions cannot be answered, the dashboard should be redesigned.

---

# Data Visualization

Charts and maps are gameplay tools.

Visualizations shall:

explain trends

highlight anomalies

support comparison

enable planning

Decoration is prohibited.

---

# Accessibility

Project Genesis shall support:

Keyboard navigation

Visible focus

Screen readers where practical

High contrast

Color-independent information

Adjustable UI scaling

Readable typography

Accessibility is a design requirement.

---

# Performance Perception

Perceived responsiveness is as important as raw performance.

Examples:

Skeleton loading

Immediate feedback

Progress indicators

Responsive transitions

Players should never feel that the interface has frozen.

---

# Animation Principles

Animation exists to improve understanding.

Supported purposes:

Selection

Progress

Completion

State change

Navigation

Animation shall never distract from gameplay.

---

# Notifications

Notifications shall be:

Relevant

Timely

Actionable

Dismissible

Non-intrusive

Critical notifications receive higher visual priority.

---

# User Control

Players should remain in control.

Support:

Undo where practical

Confirmation for destructive actions

Configurable preferences

Persistent settings

Custom layouts (future)

---

# Learnability

A new player should understand basic workflows within minutes.

Support:

Tooltips

Context help

Tutorials

Progressive onboarding

Meaningful defaults

---

# Expert Users

Experienced players should benefit from:

Keyboard shortcuts

Quick actions

Saved filters

Fast navigation

Compact information density

---

# UX Metrics

Future UX evaluations should measure:

Task completion time

Navigation depth

Number of clicks

Error frequency

Feature discoverability

Player satisfaction

These metrics guide continuous improvement.

---

# Consequences

Positive:

- predictable user experience
- lower learning curve
- easier onboarding
- consistent interaction model
- scalable interface evolution

Negative:

- stricter review process
- reduced freedom for experimental UI behavior

The long-term usability benefits outweigh the constraints.

---

# Alternatives Considered

## Feature-specific UX

Rejected.

Would create inconsistent workflows.

## No UX Guidelines

Rejected.

High complexity requires explicit interaction principles.

---

# Relationship to Other ADRs

DD-038 – Presentation Architecture

Defines presentation responsibilities.

DD-039 – Design System Architecture

Defines reusable UI components and visual consistency.

DD-040 – Visual Asset Pipeline

Defines creation and lifecycle of visual assets.

DD-041 defines how users interact with those systems and how the interface
should behave from the player's perspective.

---

# Future Evolution

Potential future enhancements include:

Adaptive onboarding

Context-aware recommendations

Customizable dashboards

Accessibility profiles

Advanced keyboard customization

Controller support

Eye-tracking accessibility (future)

---

# Decision

Project Genesis adopts these User Experience Principles as the canonical UX
architecture beginning with Milestone M11.

All future interfaces, workflows and interactions shall comply with these
principles and be evaluated against them during design and implementation
reviews.