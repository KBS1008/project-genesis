# Cursor Review Prompt
# Project Genesis
# Post-V1 World Visual Presentation Redesign Review

MODE:
READ-ONLY PRODUCT / UX / VISUAL DESIGN / ARCHITECTURE REVIEW
→ CURRENT-STATE AUDIT
→ REDESIGN DIRECTION
→ ASSET REQUIREMENT
→ FIRST IMPLEMENTATION SLICE DECISION

SCOPE:
WORLD / MAP / MINIMAP ONLY

NO IMPLEMENTATION.
NO IMAGE GENERATION.
NO ASSET CREATION.
NO GAMEPLAY CHANGES.
NO COMMIT.
NO PUSH.
NO TAG.

---

# 1. Context / New Product Evidence

Project Genesis has a new concrete product requirement concerning the
player-facing World / Map presentation.

The current world representation is considered materially below the desired
visual quality of a finished game.

A user-provided runtime screenshot shows approximately:

- a large dark empty map surface;
- a visible technical grid;
- regions represented primarily as similar rounded rectangular nodes;
- straight graph-like connection lines;
- region names rendered over those nodes;
- raw biome identifiers such as:
  `biome_temperate_forest`
  `biome_industrial_plains`
- small dots/count indicators on at least one node;
- little visual distinction between biome/region types;
- a minimap consisting largely of simplified blue rectangles and a dashed
  viewport/reference line;
- limited visual communication of geography, environment, infrastructure,
  economy, or world identity.

The current result reads visually more like a:

TECHNICAL NODE / GRAPH VISUALIZATION

than a:

PLAYER-FACING STRATEGIC GAME WORLD.

This is NEW MATERIAL PRODUCT / UX EVIDENCE.

It does not mean the previous sealed Visual Track was incorrectly completed.

The previous track delivered its bounded assets/integrations.

The product requirement has now expanded:

THE WORLD ITSELF MUST HAVE A CONVINCING PLAYER-FACING VISUAL IDENTITY.

---

# 2. Authority

Read first:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Read for current product context:

docs/architecture/reviews/
POST_V1_GAME_PRESENTATION_AND_TIME_UX_REVIEW.md

Read:

docs/architecture/reviews/
POST_V1_PLAYER_FACING_SIMULATION_PRESENTATION_SLICE_1_CLOSE_CANDIDATE.md

Read the latest Post-V1 pause/handover documentation only as necessary to
understand sealed boundaries.

Inspect previous World/Map visual reviews or ADRs if they exist.

Do NOT reopen unrelated completed visual work.

---

# 3. Core Review Question

Answer:

HOW SHOULD THE EXISTING PROJECT GENESIS WORLD SYSTEM BE PRESENTED SO THAT IT
READS AS A STRATEGIC GAME WORLD RATHER THAN A TECHNICAL GRAPH?

The redesign must remain compatible with the actual world/game architecture.

Do not invent world mechanics simply to improve visuals.

---

# 4. Product Direction

The desired direction is:

A STYLIZED STRATEGIC WORLD MAP.

NOT:

- photorealistic terrain;
- a generic dashboard graph;
- a developer node editor;
- a spreadsheet with coordinates;
- a purely decorative background;
- a full GIS system;
- a new gameplay system.

The world may remain abstract.

But abstraction must look intentional and game-like.

The player should be able to perceive meaningful differences between regions
before reading every technical label.

---

# 5. Core Visual Principle

Use this principle throughout the review:

BIOME AND WORLD STATE SHOULD BE VISUALLY RECOGNIZABLE.

TEXT SHOULD NAME OR CLARIFY THEM.

TEXT SHOULD NOT BE THE ONLY THING MAKING THEM DIFFERENT.

Example:

A temperate forest region and an industrial plains region should not look
like essentially identical blue rectangles distinguished only by text.

Do not prescribe exact final artwork yet.

Determine what the architecture can support first.

---

# 6. Repository Baseline

Record:

git status --short

git rev-parse HEAD

git log -12 --oneline

git rev-parse origin/master

If needed:

git ls-remote origin refs/heads/master

Confirm:

- current branch;
- current HEAD;
- remote state;
- Slice 1 state;
- unrelated working-tree churn;
- tags unchanged.

Do not repair unrelated repository state.

Do not touch unrelated files.

---

# 7. World Runtime Entry Points

Identify the complete runtime path for the World / Map feature.

Trace from:

navigation / route

through:

screen

workspace

map component

world-node rendering

edge / route rendering

minimap

selection

interaction

state / view model

DTO / domain input.

Document the relevant files and responsibilities.

Do not assume component names from this prompt are exact.

Use repository evidence.

---

# 8. Rendering Technology Audit

Determine exactly how the current map is rendered.

Possible examples:

- React DOM;
- CSS;
- SVG;
- Canvas;
- React Flow;
- custom graph library;
- third-party map library;
- hybrid rendering.

Record:

RENDERER:

LAYOUT ENGINE:

NODE SYSTEM:

EDGE SYSTEM:

MINIMAP SYSTEM:

ZOOM / PAN:

SELECTION:

HOVER:

TOOLTIPS:

RESPONSIVE BEHAVIOR:

ACCESSIBILITY MODEL:

Do not recommend replacement before understanding the current architecture.

---

# 9. World Data Model Audit

Determine what data currently exists for a world/region/site.

Inspect relevant:

- domain entities;
- DTOs;
- schemas;
- YAML/content;
- world generation;
- API;
- presentation view models.

Inventory available player-relevant attributes such as:

- region/world name;
- biome;
- coordinates;
- neighboring regions;
- routes;
- sites;
- buildings;
- resources;
- ownership;
- population/workforce;
- energy;
- production;
- transport;
- status;
- terrain/environment;
- discovered/undiscovered state;
- availability;
- capacity;
- other existing attributes.

Do NOT add fields.

The purpose is to learn what existing data can drive a richer map.

---

# 10. Biome Audit

Inventory all currently authoritative biome IDs/types.

For each biome record:

BIOME ID:

PLAYER-FACING NAME, if one exists:

CURRENT VISUAL DIFFERENTIATION:

AVAILABLE METADATA:

CURRENT CONSUMERS:

POTENTIAL VISUAL SIGNAL:

Do not invent gameplay effects.

Potential visual signals may include:

- terrain texture;
- region silhouette;
- background motif;
- iconography;
- environmental decoration;
- palette family;
- edge treatment;
- landmark motif.

These are conceptual possibilities only.

Do not create assets.

---

# 11. Raw Technical Identifier Audit

Specifically inspect player-facing World UI for technical identifiers.

Examples from runtime evidence include strings such as:

biome_temperate_forest
biome_industrial_plains

Classify:

PLAYER-FACING RAW ID

vs

INTERNAL ONLY.

Determine whether existing localized/display names already exist.

If a safe presentation formatter/registry already exists, identify it.

Do not invent biome names unless existing product/content evidence supports
them.

If player-facing biome naming is undefined, mark:

PRODUCT COPY DECISION REQUIRED.

---

# 12. Region / World Node Audit

Inspect the current visual representation of a region/world node.

Record:

- dimensions;
- shape;
- background;
- border;
- labels;
- metadata;
- status indicators;
- selection state;
- hover state;
- focus state;
- icons;
- counts;
- clipping/overflow;
- responsive behavior.

Determine what the small dot/count indicators in the runtime implementation
actually represent.

Do not assume.

For each visual element answer:

WHAT PLAYER INFORMATION DOES THIS COMMUNICATE?

IS IT UNDERSTANDABLE WITHOUT INTERNAL KNOWLEDGE?

IS IT MATERIAL?

SHOULD IT REMAIN ON THE MAP?

SHOULD IT MOVE TO HOVER/DETAIL?

Do not redesign yet.

---

# 13. Geographic / Spatial Meaning Audit

Determine whether node position currently has actual game meaning.

Answer:

Are coordinates authoritative?

Are positions generated?

Are positions manually defined?

Does distance matter to gameplay?

Does route length matter?

Does geometry correspond to travel duration?

Are nodes merely graph-layout positions?

Can players move/pan/zoom?

Can layout change between sessions?

This is critical.

Do not make the map visually imply geographic distance if the domain does not
support that meaning.

---

# 14. Connection / Route Audit

Inspect edges between world nodes.

Determine what an edge represents:

- adjacency;
- transport route;
- possible route;
- ownership relation;
- infrastructure;
- generic graph connection;
- something else.

For each connection type determine available state:

- active/inactive;
- capacity;
- congestion;
- direction;
- route type;
- transport state;
- blocked state;
- selected state;
- other.

Do not invent state.

Evaluate whether connection styling can communicate meaningful game
information instead of looking like generic graph edges.

---

# 15. Grid Audit

The screenshot shows a prominent technical grid.

Determine:

- why the grid exists;
- whether it represents real coordinates;
- whether it supports placement/navigation;
- whether it is purely renderer/debug chrome;
- whether the player needs it.

Classify:

FUNCTIONAL GAME INFORMATION

NAVIGATION AID

VISUAL BACKDROP

TECHNICAL / DEBUG-LIKE PRESENTATION

If it has no meaningful player purpose, identify it as a redesign candidate.

Do not remove it in this review.

---

# 16. Empty-Space Audit

The screenshot contains substantial visually empty map space.

Determine whether this results from:

- graph bounds;
- fixed canvas dimensions;
- viewport defaults;
- zoom behavior;
- node positioning;
- responsive sizing;
- intentional world scale;
- missing environmental presentation.

Do not automatically fill empty space with decoration.

Determine whether empty space should communicate:

- terrain;
- undiscovered space;
- regional boundaries;
- routes;
- atmosphere;
- strategic distance;

or whether layout should simply use the viewport better.

---

# 17. Minimap Purpose Audit

Treat the minimap as a functional component, not mandatory decoration.

Determine:

WHAT IS ITS CURRENT PURPOSE?

Does it show:

- entire world topology;
- current viewport;
- player position;
- selection;
- regions;
- routes;
- navigation target?

Does interacting with it move the main viewport?

Is it useful at the current world size?

Does the main map currently contain enough content to require it?

Could it become useful as the world grows?

Classify:

KEEP AND REDESIGN

KEEP WITH MINOR CHANGES

CONDITIONALLY DISPLAY

REMOVE FROM CURRENT UX

INSUFFICIENT EVIDENCE

Do not remove it in this review.

---

# 18. Interaction Audit

Inspect existing player interactions:

- select region;
- hover;
- focus;
- click;
- double click;
- pan;
- zoom;
- keyboard navigation;
- context menu;
- tooltip;
- open details;
- route interaction.

Determine which visual states must survive a redesign.

The redesign must not reduce usability.

---

# 19. Information Hierarchy Audit

Determine what information is currently displayed directly on every node.

Classify information into:

ALWAYS VISIBLE

VISIBLE ON SELECTION

VISIBLE ON HOVER

DETAIL PANEL ONLY

TECHNICAL / REMOVE FROM PLAYER UI

Candidate information may include:

- region name;
- biome;
- site/building count;
- resource state;
- production state;
- ownership;
- alerts;
- route state;
- coordinates;
- raw IDs.

Base classification on actual gameplay relevance.

Do not create new mechanics.

---

# 20. Strategic-Map Design Model

Develop a conceptual redesign model using the existing game architecture.

The model should explain how the map could communicate:

1. REGION IDENTITY
2. BIOME
3. REGION STATE
4. CONNECTIONS / ROUTES
5. SELECTION
6. IMPORTANT ALERTS
7. PLAYER ORIENTATION

without turning each node into a dashboard card.

Prefer visual encoding over dense text.

The review must propose a coherent visual hierarchy.

---

# 21. Region Representation Alternatives

Evaluate at least THREE feasible representation approaches against the actual
renderer/data model.

Examples:

## A. ENRICHED STRATEGIC NODES

Retain graph/node architecture but transform nodes into visually distinctive
region tiles.

## B. TERRITORY / REGION SHAPES

Represent regions as stylized geographic areas if renderer/data supports it.

## C. LANDMARK / DIORAMA REGIONS

Represent each region through a compact environmental/industrial landmark
illustration while retaining abstract topology.

These are examples.

Cursor may identify better architecture-compatible alternatives.

For each approach record:

ARCHITECTURAL FIT:

VISUAL IMPROVEMENT:

DATA REQUIREMENTS:

ASSET REQUIREMENTS:

INTERACTION IMPACT:

RESPONSIVE IMPACT:

IMPLEMENTATION RISK:

Do not implement.

---

# 22. Preferred Direction

After comparing alternatives, recommend ONE direction for the first redesign.

The recommendation must be based on:

- current architecture;
- current data;
- product requirement;
- interaction preservation;
- asset cost;
- implementation risk;
- future extensibility.

Avoid proposing a renderer rewrite merely because it could look better.

Prefer evolution of existing architecture unless hard evidence supports
replacement.

---

# 23. Existing Asset Reuse

Audit production-active visual systems that could help.

At minimum inspect:

ResourceIcon

BuildingCategoryIcon

DashboardIcon

existing map/world assets

existing SVG registries

existing backgrounds/textures

existing chart/icon systems

Do not force these onto the map.

For each relevant system answer:

CAN REUSE HELP WORLD COMPREHENSION?

YES / NO

HOW?

WOULD IT CREATE VISUAL CLUTTER?

IS IT SUITABLE FOR ALWAYS-VISIBLE MAP USE?

---

# 24. New Asset Requirement

This review MAY conclude that new visual assets are required.

But it must identify them precisely.

For each proposed asset family record:

ASSET FAMILY:

FUNCTION:

CONSUMER:

WHY EXISTING CSS/ICONS ARE INSUFFICIENT:

STATIC OR STATEFUL:

BIOME-SPECIFIC:

REQUIRED FOR FIRST SLICE:
YES / NO

Do not generate the assets.

Do not prescribe dozens of individual files unless evidence requires them.

Prefer reusable asset families.

---

# 25. Biome Visual Language

If biome-specific visuals are recommended, define a conceptual visual
language.

For each authoritative biome determine possible differentiation using:

- silhouette;
- texture;
- terrain motif;
- environmental landmark;
- vegetation/industrial motif;
- border treatment;
- icon;
- restrained color family.

Do not rely on color alone.

Accessibility and dark-theme readability matter.

Do not create final art specifications yet unless needed to define the first
slice.

---

# 26. Game Identity

Assess whether the World screen currently carries the same product identity as:

- Splash;
- Loading;
- Main Menu;
- existing Project Genesis brand.

Do not simply copy scenic menu backgrounds into gameplay.

Determine what visual traits could make the World screen feel part of the
same game while remaining highly functional.

---

# 27. Technical-Graph Leakage

Explicitly identify presentation traits that make the current screen feel
like a development/debug visualization.

Potential evidence includes:

- raw IDs;
- graph rectangles;
- uniform nodes;
- generic edge lines;
- coordinate grid;
- renderer-default minimap;
- technical counts;
- excessive empty canvas;
- lack of environmental differentiation.

For each confirmed item record:

EVIDENCE:

PLAYER IMPACT:

REDESIGN CLASS:

- remove;
- reframe;
- restyle;
- replace;
- keep.

---

# 28. Runtime Verification

If practical, run the World screen locally using the project's normal
development procedure.

Inspect at least:

DESKTOP

NARROW / SMALL VIEWPORT

If the world supports zoom:

inspect representative zoom levels.

Verify:

- clipping;
- text overlap;
- node overlap;
- minimap behavior;
- selected state;
- hover state;
- route visibility;
- viewport use.

Do not change gameplay data merely to manufacture screenshots.

If runtime inspection cannot be performed, state that explicitly.

Do not claim runtime evidence that was not collected.

---

# 29. Accessibility

Review implications for:

- contrast;
- color independence;
- readable labels;
- keyboard selection;
- focus indication;
- zoom;
- screen-reader naming;
- minimap accessibility;
- reduced-motion concerns if animation is proposed.

Do not start a general accessibility workstream.

Only World-specific requirements belong here.

---

# 30. Responsive Design

The redesign must not assume a large desktop monitor only.

Determine:

- minimum usable viewport;
- node scaling;
- label behavior;
- minimap behavior;
- detail-panel interaction;
- pan/zoom constraints;
- touch targets if relevant.

Identify whether the current screenshot's large empty regions are partly a
responsive/layout defect.

---

# 31. Motion / Feedback

Evaluate whether restrained motion could materially improve the map.

Examples:

- route activity;
- selection transitions;
- region status pulse;
- construction/production activity;
- discovery.

Do not recommend animation merely for decoration.

Any proposed motion must correspond to existing state.

Do not implement it.

---

# 32. Gameplay Firewall

The redesign must preserve existing world mechanics.

NO changes to:

- world topology;
- adjacency;
- transport rules;
- travel time;
- production;
- resource generation;
- ownership;
- building placement rules;
- economy;
- simulation timing;
- save semantics.

Visual position must not imply new gameplay semantics.

If a desired visual representation requires gameplay changes:

flag it.

Do not implement it.

---

# 33. Renderer-Rewrite Firewall

Do NOT propose replacing the current renderer/library unless there is
material evidence that the existing technology cannot support the required
presentation.

If current architecture can support:

- custom node visuals;
- custom edges;
- backgrounds;
- selection;
- overlays;
- minimap styling;

prefer incremental redesign.

A renderer migration is a separate architecture decision.

---

# 34. Visual Asset Firewall

NO image generation.

NO SVG generation.

NO texture generation.

NO new art files.

NO editing existing sealed visual assets.

The output is:

ANALYSIS
+
DESIGN DIRECTION
+
ASSET REQUIREMENTS
+
FIRST SLICE.

Actual asset creation requires a later approved prompt.

---

# 35. Materiality

Do not classify every possible visual enhancement as required.

Separate:

## MATERIAL

Needed for the World to read as a coherent player-facing game map.

## SUPPORTING

Useful after the core redesign.

## OPTIONAL POLISH

Nice-to-have.

## FUTURE

Requires gameplay/data not currently available.

The first slice may contain MATERIAL items only.

---

# 36. First-Slice Requirement

The review must define ONE bounded implementation slice.

It must NOT be:

"Redesign the entire world system."

It should prove the selected visual language using the existing architecture.

A likely shape, if supported by evidence, could be:

WORLD REGION VISUAL FOUNDATION

with:

- one reusable region visual component;
- player-facing biome naming;
- visual biome differentiation;
- improved selected/hover states;
- cleaned technical graph chrome;
- representative connection treatment;
- focused minimap compatibility.

But this is NOT predetermined.

Cursor must derive the slice from repository evidence.

---

# 37. Asset-First vs Code-First Decision

Explicitly determine whether the first implementation slice should be:

A. CODE-FIRST

Existing CSS/SVG/icon primitives are enough to establish the redesign.

B. ASSET-FIRST

New biome/region artwork must exist before meaningful implementation.

C. HYBRID

A small defined asset family plus code integration is required together.

Explain why.

If assets are needed, define the minimum family only.

---

# 38. First-Slice Definition of Done

For the selected slice define measurable DoD.

It should cover, where applicable:

- technical IDs removed from player presentation;
- region identity improved;
- biome differentiation;
- selection/focus preserved;
- connections readable;
- viewport/layout improved;
- minimap behavior preserved or intentionally reframed;
- responsive behavior;
- accessibility;
- deterministic tests;
- no gameplay changes.

Do not implement.

---

# 39. Relationship to Previous Visual Work

State explicitly:

Does this reopen the old Post-V1 Visual Track?

Expected conceptual answer unless evidence contradicts it:

NO.

This is a NEW material product requirement:

WORLD VISUAL PRESENTATION.

Historical completed assets remain sealed.

Existing assets may be reused.

Do not modify sealed assets unless a later approved workstream explicitly
requires it.

---

# 40. Required Review Report

Create:

docs/architecture/reviews/
POST_V1_WORLD_VISUAL_PRESENTATION_REDESIGN_REVIEW.md

Required sections:

## A. Executive Summary

## B. Repository Baseline

## C. New Product Evidence

## D. Current World Runtime Architecture

## E. Rendering Technology

## F. World Data Model

## G. Biome Inventory

## H. Raw Technical Identifier Leakage

## I. Current Region Node Anatomy

## J. Geographic / Spatial Semantics

## K. Connections / Routes

## L. Grid Assessment

## M. Empty-Space / Viewport Assessment

## N. Minimap Purpose and Quality

## O. Interaction Model

## P. Information Hierarchy

## Q. Technical-Graph Leakage

## R. Strategic Map Design Requirements

## S. Representation Alternatives

## T. Recommended Visual Direction

## U. Existing Asset Reuse

## V. New Asset Requirements

## W. Biome Visual Language

## X. Game Identity

## Y. Runtime Evidence

## Z. Accessibility / Responsive Requirements

## AA. Material / Supporting / Optional Classification

## AB. Asset-First vs Code-First Decision

## AC. First Bounded Implementation Slice

## AD. First-Slice Definition of Done

## AE. Gameplay / Architecture Firewalls

## AF. Relationship to Sealed Visual Work

## AG. Repository Integrity

## AH. Final Decision

---

# 41. Final Decision

Return exactly ONE:

## OPTION A —
WORLD VISUAL REDESIGN WORKSTREAM CONFIRMED
CODE-FIRST FIRST SLICE

Use if existing architecture/assets are sufficient to implement the first
material redesign slice without new art.

Define:

WORKSTREAM:

SELECTED VISUAL DIRECTION:

FIRST SLICE:

WHY CODE-FIRST:

STRICT SCOPE:

OUT OF SCOPE:

DEFINITION OF DONE:

FUTURE ASSET NEED:

---

## OPTION B —
WORLD VISUAL REDESIGN WORKSTREAM CONFIRMED
ASSET-FIRST FIRST SLICE

Use if meaningful improvement depends on new visual assets before code
integration.

Define:

WORKSTREAM:

SELECTED VISUAL DIRECTION:

MINIMUM ASSET FAMILY:

WHY REQUIRED:

FIRST ASSET SLICE:

INTENDED CONSUMERS:

INTEGRATION BOUNDARY:

STRICT SCOPE:

OUT OF SCOPE:

DEFINITION OF DONE:

Do not create the assets.

---

## OPTION C —
WORLD VISUAL REDESIGN WORKSTREAM CONFIRMED
HYBRID FIRST SLICE

Use only if a small asset family and code integration genuinely need to be
developed together to prove the visual direction.

Define:

WORKSTREAM:

SELECTED VISUAL DIRECTION:

MINIMUM ASSETS:

CODE CHANGES:

WHY THEY CANNOT BE SEPARATED SAFELY:

STRICT SCOPE:

OUT OF SCOPE:

DEFINITION OF DONE:

---

## OPTION D —
PRODUCT / VISUAL DIRECTION DECISION REQUIRED

Use if repository evidence cannot determine a safe visual direction without a
specific product decision.

State:

CONFIRMED PROBLEM:

ARCHITECTURAL FACTS:

VISUAL OPTIONS:

EXACT PRODUCT QUESTIONS:

SAFE WORK BEFORE DECISION:

---

## OPTION E —
CURRENT WORLD ARCHITECTURE BLOCKS MATERIAL REDESIGN

Use only if hard evidence shows the renderer/data architecture cannot support
a materially better World presentation without architectural change.

State:

BLOCKER:

EVIDENCE:

REQUIRED ARCHITECTURE DECISION:

WHY INCREMENTAL REDESIGN IS INSUFFICIENT:

Do not start the rewrite.

---

# 42. Repository Integrity

Before finishing:

git status --short

git diff --name-only

git diff --stat

Expected review-owned change:

ONLY:

docs/architecture/reviews/
POST_V1_WORLD_VISUAL_PRESENTATION_REDESIGN_REVIEW.md

Do not stage.

Do not commit.

Do not push.

Do not tag.

Leave unrelated working-tree churn untouched.

---

# 43. Execution Summary

Return:

# Project Genesis
# Post-V1 World Visual Presentation Redesign Review
## Execution Summary

### Repository

- branch:
- HEAD:
- remote master:
- unrelated churn:
- tags unchanged:

### Product Evidence

- current World reads as finished strategic game map:
YES / NO

- technical graph characteristics confirmed:
YES / NO

- material visual redesign required:
YES / NO

### Architecture

- renderer:
- graph/layout technology:
- custom nodes supported:
YES / NO

- custom edges supported:
YES / NO

- backgrounds/overlays supported:
YES / NO

- renderer replacement required:
YES / NO

### World Data

- biome data available:
YES / NO

- player-facing biome names available:
YES / NO

- region state available:
- route state available:
- spatial positions meaningful:
YES / NO / PARTIAL

### Current Presentation

- raw technical IDs:
- grid purpose:
- empty-space cause:
- node differentiation:
- route presentation:
- minimap purpose:

### Visual Direction

- selected model:
- region identity approach:
- biome differentiation approach:
- connection approach:
- grid approach:
- minimap approach:

### Assets

- existing assets reusable:
- new assets required:
YES / NO

- minimum new asset family:
- first slice asset-first/code-first/hybrid:

### Interaction / UX

- selection preserved:
YES / NO

- hover/focus preserved:
YES / NO

- pan/zoom preserved:
YES / NO

- responsive strategy:
- accessibility requirements:

### Scope

- gameplay changes required:
NO / YES

- API/domain changes required:
NO / YES

- renderer rewrite required:
NO / YES

- old Visual Track reopened:
NO

### First Slice

- workstream:
- slice:
- strict boundary:
- DoD:

### Repository Integrity

- review-owned files:
- implementation files changed:
NO

- assets created:
NO

- unrelated files touched:
NO

- commit:
NONE

- push:
NONE

- tags moved:
NO

### Final Decision

OPTION A / OPTION B / OPTION C / OPTION D / OPTION E

STOP.

---

# CORE RULE

THE CURRENT WORLD PRESENTATION IS NOT BEING REVIEWED MERELY FOR POLISH.

THE NEW PRODUCT REQUIREMENT IS THAT THE WORLD SHOULD READ AS A PURPOSEFUL,
PLAYER-FACING STRATEGIC GAME WORLD.

DO NOT SOLVE THIS BY:

- MAKING THE RECTANGLES SLIGHTLY PRETTIER;
- ADDING RANDOM ICONS;
- ADDING DECORATION TO EMPTY SPACE;
- HIDING THE GRID WITHOUT UNDERSTANDING IT;
- GENERATING LARGE AMOUNTS OF ART;
- REWRITING THE MAP RENDERER;
- INVENTING GEOGRAPHIC GAMEPLAY;
- INVENTING BIOME EFFECTS.

FIRST DETERMINE:

WHAT THE CURRENT MAP ACTUALLY REPRESENTS.

WHAT THE DATA CAN SUPPORT.

WHAT THE PLAYER NEEDS TO UNDERSTAND.

WHICH TECHNICAL GRAPH TRAITS SHOULD DISAPPEAR.

HOW REGIONS CAN ACQUIRE VISUAL IDENTITY.

HOW BIOMES CAN BECOME VISUALLY RECOGNIZABLE.

WHAT CONNECTIONS MEAN.

WHETHER THE MINIMAP IS USEFUL.

WHETHER EXISTING ASSETS ARE ENOUGH.

WHETHER NEW ART IS REQUIRED.

THEN DEFINE:

ONE VISUAL DIRECTION.

ONE MATERIAL WORKSTREAM.

ONE BOUNDED FIRST SLICE.

NO IMPLEMENTATION.
NO ASSET CREATION.
NO IMAGE GENERATION.
NO GAMEPLAY CHANGE.
NO COMMIT.
NO PUSH.
NO TAG.

STOP.