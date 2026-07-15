# Effect Style Guide

**Project:** Project Genesis
**Version:** 1.0
**Status:** Active
**Last Updated:** 2026-07-12

---

# Purpose

This document defines the visual language, animation principles and implementation standards for all visual effects (VFX) used throughout Project Genesis.

Effects communicate state changes, player feedback and world activity. They enhance clarity and immersion without distracting from strategic gameplay.

Every effect should improve understanding rather than merely adding visual spectacle.

---

# Relationship to Other Documents

This document builds upon:

- ART_DIRECTION.md
- VISUAL_PILLARS.md
- DESIGN_PRINCIPLES.md
- VISUAL_LANGUAGE.md
- BUILDING_STYLE_GUIDE.md
- VEHICLE_STYLE_GUIDE.md
- NPC_STYLE_GUIDE.md
- COLOR_PALETTE.md

---

# Effect Philosophy

Effects are information.

They exist to communicate:

- activity
- progress
- status
- success
- failure
- danger
- environmental conditions

Visual effects should never compete with the interface.

---

# Design Goals

Effects should be:

- subtle
- readable
- consistent
- performant
- scalable
- informative
- believable

---

# Effect Categories

Effects belong to one of the following groups:

- Production
- Logistics
- Construction
- Environment
- Weather
- Energy
- Research
- Economy
- User Interface
- Alerts
- Emergency

Each category should share common visual characteristics.

---

# Visual Style

Effects should remain grounded in realism.

Preferred characteristics:

- soft particles
- restrained glow
- natural motion
- believable physics
- moderate opacity

Avoid:

- exaggerated explosions
- excessive bloom
- fantasy magic
- unrealistic particle density

---

# Production Effects

Examples:

- steam
- exhaust
- conveyor movement
- rotating machinery
- welding sparks
- furnace glow
- cooling fans

Production effects should communicate operational status.

---

# Logistics Effects

Examples:

- dust from roads
- tire tracks
- ship wake
- train brake sparks
- crane movement
- loading indicators

Movement should appear smooth and believable.

---

# Construction Effects

Construction phases may include:

- scaffolding
- cranes
- dust
- construction lighting
- material delivery
- assembly animations

Progress should be visually apparent.

---

# Environmental Effects

Supported effects include:

- blowing leaves
- water movement
- smoke
- mist
- heat shimmer
- wind animation

Environmental effects should remain subtle.

---

# Weather Effects

Supported weather includes:

- rain
- snow
- fog
- clouds
- lightning
- wind

Weather should affect atmosphere without reducing visibility.

---

# Energy Effects

Energy systems may display:

- electrical arcs
- power flow indicators
- illuminated substations
- rotating turbines
- solar reflections
- charging animations

Avoid science-fiction aesthetics.

---

# Research Effects

Research completion may include:

- subtle light pulses
- progress indicators
- interface highlights

Research should feel rewarding without being distracting.

---

# Economy Effects

Financial feedback may include:

- transaction confirmation
- market trend indicators
- profit notifications
- investment completion

Effects should support dashboard readability.

---

# User Interface Effects

UI effects include:

- hover states
- button feedback
- window transitions
- selection highlights
- drag-and-drop feedback

Animations should be quick and unobtrusive.

---

# Alert Effects

Alert priorities:

Information

Low intensity

Warning

Moderate emphasis

Critical

High visibility

Critical alerts should remain visible until acknowledged.

---

# Emergency Effects

Examples:

- fire
- smoke
- emergency vehicle lights
- hazard indicators
- evacuation markers

Effects should clearly communicate urgency.

---

# Color Usage

Suggested mapping:

Blue

Information

Green

Success

Yellow

Warning

Orange

Maintenance

Red

Emergency

Gray

Neutral

Official values are defined in COLOR_PALETTE.md.

---

# Animation Principles

Effects should use:

- smooth easing
- natural timing
- restrained motion
- consistent duration

Avoid sudden flashing unless required for emergencies.

---

# Layering

Visual effects should never obscure:

- buildings
- vehicles
- UI
- resources
- navigation

Gameplay clarity always takes priority.

---

# Camera Compatibility

Effects should remain readable:

- at strategic zoom
- at operational zoom
- during close inspection

Level of detail should adapt dynamically.

---

# Performance

Effects should support:

- particle pooling
- GPU instancing
- adaptive quality
- scalable particle counts
- level-of-detail systems

Performance should always take precedence over visual complexity.

---

# Accessibility

Important information should never rely solely on:

- flashing
- color
- animation

Critical effects should always be supported by icons, text or sound.

---

# AI Effect Generation

AI prompts should specify:

- realistic industrial effects
- restrained particles
- isometric perspective
- transparent background
- clean lighting
- subtle motion
- simulation-oriented style
- no fantasy elements

---

# Effect Review Checklist

| Question | Status |
|-----------|--------|
| Does the effect communicate useful information? | □ |
| Is it immediately understandable? | □ |
| Does it avoid distracting the player? | □ |
| Is it performant? | □ |
| Does it fit the industrial visual language? | □ |
| Is accessibility considered? | □ |
| Can it be reproduced consistently with AI? | □ |

---

# Future Effect Categories

Potential future additions:

- Seasonal events
- Natural disasters
- Construction milestones
- Festival decorations
- Cinematic effects
- Multiplayer indicators

---

# Future Integration

Effect assets will later integrate with:

- EFFECT_LIBRARY.md
- AI_PROMPT_LIBRARY.md
- ASSET_LIST.md
- ANIMATION_STYLE_GUIDE.md

---

# Related Documents

- BUILDING_STYLE_GUIDE.md
- VEHICLE_STYLE_GUIDE.md
- NPC_STYLE_GUIDE.md
- UI_STYLE_GUIDE.md
- ANIMATION_STYLE_GUIDE.md

---

# Summary

Visual effects in Project Genesis should communicate information with clarity, restraint and consistency.

Every effect should reinforce the simulation, support strategic decision-making and maintain the calm, professional visual language established throughout the project.