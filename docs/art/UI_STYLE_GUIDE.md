# UI Style Guide

**Project:** Project Genesis  
**Version:** 1.0  
**Status:** Active  
**Last Updated:** 2026-07-12

---

# Purpose

This document defines the official user interface design system for Project Genesis.

The UI is one of the most important components of the game because players spend most of their time interacting with dashboards, reports, production chains, financial information and management tools.

The interface should feel like modern professional business software while remaining approachable for new players.

---

# Design Goals

The user interface should be:

- Clean
- Modern
- Professional
- Predictable
- Fast to understand
- Information-focused
- Highly readable
- Accessible

The UI should reduce cognitive load while presenting complex simulation data.

---

# UI Philosophy

Project Genesis is not an action game.

The interface is the primary gameplay experience.

Every component should help the player answer three questions:

- What is happening?
- Why is it happening?
- What can I do next?

---

# Design Inspirations

The UI should take inspiration from modern productivity software rather than traditional games.

Examples include:

- Microsoft Power BI
- SAP Fiori
- Notion
- Linear
- JetBrains IDEs
- Bloomberg Terminal (information density)
- Apple Human Interface Guidelines (clarity)
- Material Design (component consistency)

The interface should feel familiar to users who work with professional software.

---

# Layout Principles

## Grid-Based Layout

All screens should follow a consistent grid.

Benefits:

- predictable alignment
- easier scanning
- reusable layouts
- responsive scaling

Exact spacing values will be defined in DESIGN_TOKENS.md.

---

## Visual Hierarchy

Hierarchy should be communicated through:

1. Position
2. Size
3. Contrast
4. Typography
5. Color

Never rely on color alone.

---

## White Space

Whitespace is an intentional design element.

It improves:

- readability
- grouping
- focus
- usability

Avoid overcrowded screens.

---

# Window Structure

Every window should follow the same structure.

```
┌──────────────────────────────────────────┐
│ Title Bar                               │
├──────────────────────────────────────────┤
│ Toolbar                                 │
├──────────────────────────────────────────┤
│ Main Content                            │
│                                          │
│                                          │
├──────────────────────────────────────────┤
│ Status Bar                              │
└──────────────────────────────────────────┘
```

Consistency is more important than creativity.

---

# Navigation

Primary navigation should remain visible.

Recommended navigation order:

- Dashboard
- Company
- Buildings
- Production
- Logistics
- Market
- Finance
- Research
- Statistics
- Settings

Avoid deeply nested menus.

---

# Panels

Panels organize information.

Guidelines:

- consistent spacing
- subtle borders
- soft shadows
- rounded corners
- clear titles

Avoid decorative frames.

---

# Buttons

Buttons communicate actions.

Primary Button

Used for the most important action.

Secondary Button

Alternative actions.

Danger Button

Destructive actions only.

Disabled Button

Unavailable actions.

Hover and pressed states must always be visually distinguishable.

---

# Icons

Icons should:

- communicate meaning immediately
- remain readable at small sizes
- accompany important actions
- support accessibility

Icons never replace text completely unless universally understood.

---

# Forms

Forms should be simple.

Use:

- labels above fields
- consistent spacing
- immediate validation
- clear error messages

Avoid long forms whenever possible.

---

# Tables

Tables are a core gameplay element.

Requirements:

- sortable columns
- filtering
- searching
- column resizing
- sticky headers
- alternating row backgrounds (optional)

Financial information should align numerically.

---

# Lists

Lists should support:

- quick scanning
- selection
- grouping
- filtering
- searching

Selection should always remain obvious.

---

# Cards

Cards represent self-contained information.

Typical examples:

- building summary
- company overview
- production chain
- employee statistics

Cards should remain visually lightweight.

---

# Dialogs

Dialogs should interrupt the user only when necessary.

Examples:

- confirmation
- warnings
- settings
- save operations

Dialogs should always have:

- title
- message
- primary action
- secondary action

---

# Notifications

Notification types:

- Information
- Success
- Warning
- Error

Notifications should disappear automatically unless user interaction is required.

---

# Tooltips

Tooltips should explain:

- unfamiliar mechanics
- calculations
- abbreviations
- production formulas

Keep them concise.

---

# Dashboard Design

Dashboards are the heart of the game.

Every dashboard should contain:

- KPIs
- charts
- trend indicators
- alerts
- quick actions

Avoid decorative widgets.

---

# Charts

Charts should emphasize understanding.

Use:

- line charts
- bar charts
- area charts
- pie charts (sparingly)
- Sankey diagrams
- production flow diagrams

Charts should prioritize comparison over decoration.

---

# Color Usage

Follow COLOR_PALETTE.md.

General rules:

Blue

Primary interaction

Green

Positive state

Orange

Warning

Red

Error

Gray

Neutral

Color communicates meaning—not decoration.

---

# Motion

Animations should be subtle.

Allowed:

- fade
- smooth transitions
- expanding panels
- loading indicators

Avoid:

- bouncing
- flashing
- unnecessary movement

Animations should communicate change.

---

# Empty States

Every empty state should explain:

- why nothing is shown
- what the player can do
- recommended next action

Empty screens should never feel broken.

---

# Loading States

Long operations should display:

- progress indicator
- loading message
- estimated completion if possible

Avoid freezing the interface.

---

# Error Handling

Errors should be:

- understandable
- actionable
- friendly
- specific

Never display technical errors directly to the player.

---

# Accessibility

The UI should support:

- keyboard navigation
- scalable interface
- high contrast
- screen readers where applicable
- color-blind users

Interaction should never rely solely on color.

---

# Responsive Design

The interface should support:

- Full HD
- 1440p
- 4K
- Ultra-wide displays

UI scaling should preserve readability.

---

# AI Prompt Integration

When generating UI mockups with AI, prompts should define:

- layout
- hierarchy
- spacing
- typography
- color palette
- dashboard style
- business software aesthetic

All generated interfaces should comply with this document.

---

# UI Review Checklist

Every new screen should answer:

| Question                           | Status |
| ---------------------------------- | ------ |
| Is the purpose immediately clear?  | □      |
| Is navigation intuitive?           | □      |
| Is hierarchy obvious?              | □      |
| Is spacing consistent?             | □      |
| Are actions clearly identifiable?  | □      |
| Does it follow the Art Direction?  | □      |
| Does it support accessibility?     | □      |
| Is unnecessary decoration avoided? | □      |

---

# Related Documents

- ART_DIRECTION.md
- VISUAL_PILLARS.md
- DESIGN_PRINCIPLES.md
- VISUAL_LANGUAGE.md
- COLOR_PALETTE.md
- TYPOGRAPHY.md
- ICON_GUIDELINES.md
- DASHBOARD_STYLE_GUIDE.md
- CHART_STYLE_GUIDE.md
- DESIGN_TOKENS.md

---

# Summary

The user interface of Project Genesis should resemble professional business software rather than a traditional game interface.

Every screen should prioritize clarity, efficiency and decision-making while maintaining a clean, consistent and modern visual language.
