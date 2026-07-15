# Animation Style Guide

**Project:** Project Genesis
**Version:** 1.0
**Status:** Active
**Last Updated:** 2026-07-12

---

# Purpose

This document defines the animation principles, timing standards and motion language for every animated element in Project Genesis.

Animation should improve readability, communicate state changes and reinforce the simulation.

Motion is an information layer—not decoration.

---

# Relationship to Other Documents

This document complements:

- UI_STYLE_GUIDE.md
- EFFECT_STYLE_GUIDE.md
- BUILDING_STYLE_GUIDE.md
- VEHICLE_STYLE_GUIDE.md
- NPC_STYLE_GUIDE.md
- DASHBOARD_STYLE_GUIDE.md

---

# Animation Philosophy

Animation exists for four reasons:

- Communication
- Feedback
- Orientation
- Immersion

If an animation does not improve one of these areas, it should not exist.

---

# Design Goals

Animations should be:

- subtle
- smooth
- predictable
- performant
- readable
- purposeful
- consistent

---

# Motion Language

Project Genesis uses calm industrial motion.

Animations should feel like:

- automated machinery
- professional software
- modern logistics systems

Avoid:

- cartoon movement
- exaggerated squash & stretch
- overshooting
- excessive bouncing
- flashy effects

---

# Animation Categories

Animations belong to one of the following groups:

- User Interface
- Buildings
- Vehicles
- NPCs
- Effects
- Environment
- Camera
- Construction
- Logistics
- Notifications

Each category follows the same animation philosophy.

---

# Timing

Recommended durations:

| Interaction | Duration |
|------------|----------|
| Hover | 100–150 ms |
| Button Press | 80–120 ms |
| Panel Open | 200–250 ms |
| Window Transition | 250–350 ms |
| Tooltip | 120–180 ms |
| Notification | 250–400 ms |
| Camera Zoom | 250–600 ms |
| Camera Pan | Variable |

Animations should never feel slow.

---

# Easing

Preferred easing:

- Ease Out
- Ease In-Out
- Linear (continuous movement only)

Avoid:

- Bounce
- Elastic
- Back
- Overshoot

Industrial software should feel precise.

---

# User Interface

UI animations include:

- hover feedback
- button presses
- dialog appearance
- panel transitions
- loading indicators
- drag & drop

The interface should always remain responsive.

---

# Buildings

Buildings should animate only when operational.

Examples:

- rotating fans
- conveyor belts
- smoke
- cranes
- robotic arms
- loading docks

Idle buildings should remain mostly static.

---

# Vehicles

Vehicles should communicate movement through:

- wheel rotation
- track movement
- ship wake
- aircraft propellers
- suspension
- cargo loading

Movement should appear smooth and physically believable.

---

# NPCs

NPC animations should be subtle.

Examples:

- walking
- carrying
- inspecting
- operating machinery
- typing
- welding

Idle animations should remain minimal.

---

# Environment

Environmental animations include:

- moving water
- trees in the wind
- flags
- smoke
- clouds

These animations should remain slow and unobtrusive.

---

# Camera Motion

Camera movement should feel stable.

Support:

- smooth panning
- smooth zooming
- edge scrolling
- keyboard navigation
- minimap transitions

Avoid sudden jumps whenever possible.

---

# Construction

Construction animations may include:

- cranes
- scaffolding
- assembly
- concrete pouring
- material delivery

Progress should be visually apparent.

---

# Logistics

Logistics animations include:

- loading
- unloading
- cranes
- conveyor belts
- forklifts
- warehouse robots

These animations reinforce production flow.

---

# Notification Animation

Notifications should:

- fade in
- slide gently
- remain readable
- disappear smoothly

Critical alerts should remain visible until acknowledged.

---

# Feedback Principles

Every important player action should generate immediate feedback.

Examples:

Building placed

✓ Placement animation

Research completed

✓ Notification

Vehicle purchased

✓ Fleet animation

Production started

✓ Operational effects

---

# Looping Animations

Continuous animations should:

- loop seamlessly
- avoid visible resets
- vary slightly when appropriate

Long-running animations should never become distracting.

---

# Layering

Animations must never obscure:

- buildings
- roads
- charts
- UI
- notifications

Gameplay clarity always has priority.

---

# Performance

Animation systems should support:

- object pooling
- LOD animation
- animation culling
- GPU instancing
- reduced motion mode

Large simulations must remain responsive.

---

# Accessibility

Support:

- Reduced Motion mode
- optional animation scaling
- non-animated feedback alternatives

Critical information must never depend solely on animation.

---

# Audio Synchronization

Animations should synchronize with:

- construction sounds
- machinery
- vehicle movement
- UI interactions
- notifications

Audio should reinforce motion without becoming repetitive.

---

# AI Animation Generation

AI prompts should specify:

- realistic industrial motion
- restrained animation
- smooth transitions
- believable timing
- isometric camera
- modern simulation game

---

# Animation Review Checklist

| Question | Status |
|-----------|--------|
| Does the animation communicate useful information? | □ |
| Is timing appropriate? | □ |
| Is motion smooth? | □ |
| Is performance acceptable? | □ |
| Does it follow the industrial visual language? | □ |
| Is reduced-motion support available? | □ |
| Can it be reproduced consistently? | □ |

---

# Future Integration

Animation standards will later integrate with:

- CHARACTER_ANIMATION_LIBRARY.md
- EFFECT_LIBRARY.md
- UI_COMPONENT_LIBRARY.md
- AI_PROMPT_LIBRARY.md
- DESIGN_TOKENS.md

---

# Related Documents

- UI_STYLE_GUIDE.md
- EFFECT_STYLE_GUIDE.md
- BUILDING_STYLE_GUIDE.md
- VEHICLE_STYLE_GUIDE.md
- NPC_STYLE_GUIDE.md
- BIOME_GUIDE.md

---

# Summary

Animations in Project Genesis should be calm, informative and purposeful.

Every movement should help the player understand the simulation, reinforce feedback and improve usability while maintaining the professional industrial aesthetic that defines the project.