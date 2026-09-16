# Cursor Implementation Prompt
# Project Genesis
# Post-V1 World Visual Presentation
# Slice 1 — Biome Identity + Map Foundation

MODE:
BOUNDED VISUAL IMPLEMENTATION
→ CONSOLIDATED DEFINITION OF DONE
→ RUNTIME VISUAL VALIDATION
→ CLOSE CANDIDATE

WORKSTREAM:

POST-V1-WORLD-VISUAL-PRESENTATION

SLICE:

SLICE 1 — BIOME IDENTITY + MAP FOUNDATION

---

# 1. Authority

Read first:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Read:

docs/architecture/reviews/
POST_V1_WORLD_VISUAL_PRESENTATION_REDESIGN_REVIEW.md

Read only as necessary for surrounding product context:

docs/architecture/reviews/
POST_V1_GAME_PRESENTATION_AND_TIME_UX_REVIEW.md

docs/architecture/reviews/
POST_V1_PLAYER_FACING_SIMULATION_PRESENTATION_SLICE_1_CLOSE_CANDIDATE.md

The World Visual Presentation Redesign Review is APPROVED.

Its workstream decision is accepted:

POST-V1-WORLD-VISUAL-PRESENTATION

This prompt defines the authoritative boundary for Slice 1.

Do not reopen the review unless implementation evidence contradicts a material
assumption.

---

# 2. Product Problem

The current World screen is functionally mature but visually reads like a
technical graph/editor rather than a finished strategic game map.

Confirmed current characteristics include:

- explicit technical grid;
- homogeneous rectangular region nodes;
- largely identical region styling across biomes;
- straight graph-like center-to-center edges;
- raw biome IDs visible to players;
- generic building dots/counts;
- large visually empty map plate;
- minimap repeating the same undifferentiated graph language.

This is a MATERIAL product presentation problem.

Slice 1 must produce a visible improvement at first glance.

---

# 3. Product Goal

Transform the existing World presentation from:

TECHNICAL NODE GRAPH

toward:

STYLIZED STRATEGIC WORLD MAP

without:

- changing gameplay;
- changing world topology;
- introducing fake geography;
- rewriting the renderer;
- producing new raster art;
- inventing biome mechanics.

The World may remain abstract.

But the abstraction must look intentional, coherent, and game-like.

---

# 4. Core Visual Principle

BIOME AND REGION IDENTITY SHOULD BE VISUALLY RECOGNIZABLE.

TEXT SHOULD CLARIFY IDENTITY.

TEXT SHOULD NOT BE THE ONLY THING MAKING REGIONS DIFFERENT.

A player should be able to distinguish substantially different biome types
before reading a raw technical identifier.

Raw biome IDs must not be required for normal player comprehension.

---

# 5. Slice 1 Scope

Implement ONLY the World visual foundation.

Required areas:

A. BIOME PRESENTATION SOURCE

B. REGION VISUAL IDENTITY

C. PLAYER-FACING BIOME LABELS

D. MAP PLATE / GRID DEFAULT

E. CONNECTION / ROUTE PRESENTATION

F. MINIMAP VISUAL ALIGNMENT

G. BIOME LEGEND

H. RUNTIME VISUAL VALIDATION

Do not expand into broader World feature work.

---

# 6. Existing Architecture Must Be Preserved

The accepted review established the current architecture around:

WorldScreen

PGWorldWorkspace

PGWorldViewport

PGWorldCanvas

PGMiniMap

PGWorldLegend

world-view-mappers

world-overlay-mappers

world camera/math

world-components.css

existing SVG rendering.

Preserve this architecture unless a task-local technical detail requires a
small change.

Expected:

NO renderer replacement.

NO Canvas 2D migration.

NO WebGL.

NO map-engine migration.

NO graph-library migration.

NO new world layout model.

---

# 7. Pre-Implementation Verification

Before editing, confirm at current HEAD:

- current renderer remains SVG-based;
- current region layout still uses existing map coordinates;
- biome IDs still reach presentation;
- authoritative biome content still contains player-usable names/categories;
- minimap still uses the same region layout;
- grid remains a configurable layer;
- connection rendering remains presentation-owned.

If a material assumption is no longer true:

STOP and report exact evidence.

Do not improvise a different architecture.

---

# 8. Biome Presentation Source

The review identified an important data boundary:

RegionDto exposes biomeId.

Authoritative game content contains biome names/categories.

The web presentation should NOT solve this by maintaining a second manually
duplicated biome catalog if an authoritative existing path can be used.

Determine the smallest architecture-compatible Single Source of Truth.

Preferred principle:

AUTHORITATIVE CONTENT
→ READ/PRESENTATION DATA
→ WORLD VIEW MODEL
→ RENDERER

Possible implementation mechanisms may include:

- extending an existing content-name/read model;
- exposing existing biome display metadata through an existing content API;
- extending an existing world presentation DTO/read model where appropriate.

Choose the smallest existing architectural path.

Do NOT create an unrelated new content subsystem.

---

# 9. API Boundary

A small READ/PRESENTATION metadata addition is allowed ONLY if genuinely
necessary to expose existing authoritative biome presentation data.

Allowed conceptually:

biome display name
biome presentation category

Not allowed:

- gameplay effects;
- new biome rules;
- new simulation state;
- new persistence semantics;
- new world mechanics.

If an API/read-model adjustment is made:

it must expose EXISTING authoritative content.

It must not create new gameplay truth.

Document it explicitly.

---

# 10. No Hardcoded Duplicate Biome Catalog

Do NOT implement a frontend-only mapping such as:

biome_temperate_forest → "Temperate Forest"

biome_industrial_plains → "Industrial Plains"

if that duplicates authoritative content already stored elsewhere.

Likewise, do not duplicate all biome definitions in CSS/TypeScript merely to
make Slice 1 easy.

Presentation-specific visual classification may exist in the presentation
layer if necessary, but authoritative player-facing names must remain sourced
from authoritative content.

If visual categories do not exist authoritatively, inspect the existing
content/category model before introducing anything.

Do not invent semantic biome categories.

---

# 11. Player-Facing Biome Labels

Remove raw biome IDs from normal World player presentation in Slice-1 scope.

Examples that must no longer be normal player-facing copy:

biome_temperate_forest

biome_industrial_plains

Use authoritative player-facing biome names.

Apply at minimum to:

- main World map region sublabels;
- World region table biome column;
- biome legend introduced by this slice.

If other World-only occurrences use the same presentation mapper and are
obvious task-local consumers, update them consistently.

Do not perform repository-wide copy cleanup.

---

# 12. Region Visual Identity

Redesign the existing region representation using the existing SVG system.

The region must stop reading primarily as a generic dashboard rectangle.

Preserve:

- selectable region hit target;
- region identity;
- keyboard/focus behavior;
- existing click semantics;
- existing map position;
- existing topology.

Improve:

- visual hierarchy;
- biome distinction;
- selected state;
- hover/focus state;
- label hierarchy;
- integration with the map plate.

Do not create irregular geographic polygons unless already trivially
supported by existing authoritative data.

No fake geography.

---

# 13. Biome Differentiation

Use a restrained, reusable visual language.

Biome differentiation may use a combination of:

- fill family;
- stroke treatment;
- subtle SVG pattern;
- texture-like SVG defs;
- internal motif;
- small biome glyph only if an existing appropriate glyph exists;
- label treatment.

Requirements:

- no new raster images;
- no generated art;
- no dependency on WM-001 PNG;
- dark-theme readable;
- distinguishable without color alone where practical;
- selected state remains obvious across biome types.

Do not turn every biome into a visually noisy tile.

Strategic-map readability comes first.

---

# 14. Presentation Tokens

Prefer existing design tokens and theme mechanisms.

If new World-specific presentation tokens are needed:

keep them:

- narrowly scoped;
- semantic;
- reusable;
- theme-compatible.

Examples conceptually:

world biome surface
world biome border
world route idle
world route active
world map plate

Do not scatter arbitrary hardcoded color literals through SVG components.

Do not create a global theme redesign.

---

# 15. Map Plate

The large World viewport should read as a deliberate map surface.

Improve the background using presentation-only techniques such as:

- restrained gradient;
- subtle depth;
- atlas-like surface;
- SVG/CSS pattern;
- vignette where appropriate;
- existing theme tokens.

Do NOT:

- paste in scenic Main Menu artwork;
- generate terrain imagery;
- create fake continents;
- create decorative detail that implies nonexistent gameplay geography.

The map plate supports the regions.

It must not overpower them.

---

# 16. Grid

The technical grid must NOT dominate the default player experience.

Approved Slice-1 direction:

GRID DEFAULT:
OFF

Preserve the layer if it has legitimate navigation/power-user value.

Do not delete the feature unless repository evidence shows it is dead.

If its player-facing label currently reads like technical tooling, use a
clear player-facing label consistent with existing German UI.

Do not turn this into a general layer-manager redesign.

---

# 17. Connections Become Routes

Connections currently read as generic graph edges.

Restyle them to read as strategic map routes/connections.

Preserve:

- exact topology;
- endpoint relationships;
- transport highlighting;
- interaction semantics;
- existing data.

Allowed presentation changes may include:

- SVG path instead of straight line;
- restrained curve;
- offset path;
- improved idle treatment;
- improved active treatment;
- endpoint treatment.

Do NOT visually imply a gameplay direction if connections are not directed.

Do NOT visually imply route capacity/state that does not exist.

Do NOT change distance/travel calculations.

---

# 18. Route Geometry Safety

If switching from SVG line to SVG path:

geometry must be deterministic.

Do not introduce random curves.

Do not allow routes to obscure region labels unnecessarily.

Do not create severe overlap at current fixture/world layouts.

If curved routes make the existing layout worse:

use another deterministic route treatment.

The product requirement is:

LESS GRAPH-LIKE.

Not:

CURVES AT ALL COSTS.

---

# 19. Building Markers

Building marker redesign is NOT a required Slice-1 deliverable.

Do NOT introduce BuildingCategoryIcon rollout in this slice.

Existing building marker behavior must remain functional.

Small task-local styling changes are allowed only if required so the markers
remain legible against new biome surfaces.

Do not redesign the building visualization system.

BuildingCategoryIcon map integration is deferred.

---

# 20. Region Counts / Presence

The existing numeric building/presence badge may remain if it communicates
useful information.

Inspect it after the biome redesign.

If it becomes unreadable:

apply a task-local visual compatibility adjustment.

Do NOT redesign its semantics.

Do NOT add more counters.

---

# 21. Minimap

The minimap must visually correspond to the redesigned main map.

Required Slice-1 changes:

- same biome presentation families;
- connection/routes visible in simplified form;
- viewport indicator retained;
- sufficient contrast;
- simplified enough to remain readable.

Do NOT add click-to-pan in Slice 1.

Do NOT add new navigation mechanics.

Do NOT make the minimap more detailed than necessary.

Its role is ORIENTATION.

---

# 22. Minimap Consistency

Main map and minimap must derive biome presentation from the same source.

Do not maintain:

main-map biome colors

and

minimap biome colors

as separate duplicated mappings.

Use shared presentation metadata/tokens/helpers.

---

# 23. Biome Legend

Extend the existing World legend to communicate biome visual meaning.

The player should be able to understand the biome differentiation.

Use authoritative player-facing biome labels/categories.

Keep the legend compact.

Do not list internal biome IDs.

Do not turn the legend into a content encyclopedia.

Preserve existing useful layer/route information.

---

# 24. Information Hierarchy

For a normal unselected region, prioritize:

1. REGION IDENTITY
2. BIOME IDENTITY
3. IMPORTANT EXISTING STATUS

Avoid showing technical implementation information.

Selection should create stronger hierarchy without requiring completely
different markup.

Do not add economy/production metrics to every node.

The map is not a dashboard.

---

# 25. Raw Technical UI Firewall

Within Slice-1 World scope, search for player-visible:

biome_
biomeId
raw content IDs
technical layer terminology
debug-like map copy

Classify each match.

Remove/reframe only genuine player-facing leaks in World scope.

Internal identifiers remain allowed.

Do not rename domain fields.

---

# 26. Empty Space

Do not solve empty space by filling it with random decoration.

Use:

- improved viewport framing;
- map plate;
- biome identity;
- route presentation;
- appropriate map bounds/fit behavior if already supported.

If the current initial camera framing is demonstrably poor and an existing
fit-to-world mechanism exists, a small task-local default framing improvement
is allowed.

Do NOT create new camera behavior merely to fill space.

Document any camera adjustment explicitly.

---

# 27. Responsive Behavior

Validate at least:

DESKTOP

NARROW VIEWPORT

The redesign must preserve:

- pan;
- zoom;
- selection;
- labels;
- minimap;
- layer controls;
- region hit targets.

Avoid:

- clipped region names;
- unreadable biome labels;
- legend covering core map content;
- minimap covering important regions;
- route disappearance at narrow widths.

Use existing responsive architecture.

---

# 28. Accessibility

Preserve or improve:

- region keyboard selection;
- focus indication;
- contrast;
- non-color-only differentiation where practical;
- accessible region naming;
- canvas accessible label;
- minimap semantics.

Do not replace text labels with purely decorative imagery.

Do not create a separate accessibility workstream.

Fix obvious task-local regressions directly.

---

# 29. No New Art

Slice 1 is CODE-FIRST.

NO:

- PNG creation;
- WebP creation;
- image generation;
- SVG illustration asset generation;
- biome paintings;
- terrain tiles;
- WM-001 production;
- per-region artwork.

Inline SVG presentation primitives/defs used by the renderer are allowed when
they are CODE/PRESENTATION, such as:

- patterns;
- gradients;
- masks;
- route paths.

Do not turn inline SVG into an art-production project.

---

# 30. No Renderer Rewrite

Do not replace PGWorldCanvas.

Do not replace SVG.

Do not introduce a new mapping framework.

Do not migrate to WebGL.

Do not migrate to Canvas 2D.

Do not introduce a new graph engine.

If existing SVG genuinely cannot satisfy the approved Slice-1 DoD:

STOP and report hard evidence.

---

# 31. Gameplay Firewall

NO changes to:

- region topology;
- map coordinates;
- adjacency;
- transport rules;
- connection meaning;
- distance semantics;
- travel duration;
- building rules;
- resource rules;
- economy;
- production;
- simulation time;
- savegame semantics.

Presentation only.

---

# 32. Content Firewall

Do not rewrite biome YAML/content to obtain nicer visuals.

Existing authoritative biome names/categories may be exposed/read.

Do not alter their gameplay semantics.

If a missing PLAYER-FACING LABEL is genuinely absent from authoritative
content:

STOP and report the exact missing product copy rather than inventing it.

---

# 33. Scope Firewall

Do NOT modify:

- Market;
- Production;
- Transport logic;
- Research;
- Dashboard;
- time/cycle migration;
- Main Menu visuals;
- Splash;
- Loading;
- ResourceIcon rollout;
- general shell styling.

World-only.

---

# 34. Focused Tests

Add/update focused tests covering the actual implementation.

At minimum validate:

BIOME PRESENTATION

- authoritative display label reaches World presentation;
- raw biome ID is not used as normal player label;
- deterministic biome presentation metadata.

MAIN MAP

- region receives expected biome presentation binding;
- selected state still renders;
- connections/routes still render;
- grid default is off.

MINIMAP

- biome presentation is reused;
- connections render;
- viewport indicator remains.

LEGEND

- biome labels/presentation entries render;
- no raw IDs.

Do not create image snapshot/golden tests merely for CSS aesthetics unless the
repository already has a reliable established visual-snapshot system.

Prefer deterministic structural tests.

---

# 35. Existing Interaction Tests

Run relevant existing World tests for:

- selection;
- pan/zoom;
- layer toggles;
- minimap;
- building marker navigation;
- overlays;
- route/transport highlighting.

If visual refactoring breaks task-local test assumptions:

update tests without weakening behavior assertions.

Do not delete interaction coverage.

---

# 36. Quality Gates

During implementation run focused World tests.

At closeout run:

pnpm --filter @project-genesis/web typecheck

pnpm lint

pnpm test

pnpm build:web

Expected:

TYPECHECK:
PASS

LINT:
PASS / 0 errors

TEST:
PASS

BUILD:
PASS

Existing deferred lint warnings remain non-task-owned unless this slice
introduces new warnings.

Do not clean unrelated warnings.

---

# 37. Runtime Visual Validation Is Mandatory

THIS SLICE CANNOT CLOSE ON TESTS ALONE.

Run the World screen in the actual web runtime using the project's normal
local development procedure.

Inspect the implemented result visually.

Validate at minimum:

1. default desktop World view;
2. selected region;
3. representative different biomes;
4. routes/connections;
5. minimap;
6. grid default-off behavior;
7. narrow viewport.

The close report must describe what was actually observed.

Do not claim runtime validation if no runtime was launched.

---

# 38. Visual Acceptance Questions

During runtime validation answer:

A. Does the default screen still immediately read like graph paper?

Expected:
NO.

B. Do different biomes have recognizable visual identity before reading the
raw ID?

Expected:
YES.

C. Are raw biome IDs visible in normal World UI?

Expected:
NO.

D. Do connections read more like map routes than generic graph edges?

Expected:
YES.

E. Does the minimap reflect the same visual world language?

Expected:
YES.

F. Is selection still immediately clear?

Expected:
YES.

G. Does the redesign remain readable in the dark theme?

Expected:
YES.

H. Does the World now look materially more like a strategic game map than the
user-provided baseline?

Expected:
YES.

If H is honestly NO:

DO NOT declare the slice visually complete merely because tests pass.

---

# 39. Visual Evidence

If the environment allows deterministic screenshots:

capture representative runtime screenshots for the implementation report.

Preferred:

DESKTOP DEFAULT

DESKTOP SELECTED REGION

NARROW VIEW

Do not create artificial mockups.

Screenshots must be from the implemented runtime.

If screenshot capture is not practical:

state that clearly and provide detailed manual runtime observations.

Do not block the slice solely because automated screenshot tooling is absent.

---

# 40. Definition of Done

Slice 1 is DONE only when ALL are true:

[ ] Existing SVG World architecture retained.

[ ] Authoritative biome player-facing names are available to presentation
    without a duplicated hardcoded frontend catalog.

[ ] Raw biome IDs no longer appear in normal World map labels.

[ ] Raw biome IDs no longer appear in the World region table.

[ ] Regions have deterministic biome-dependent visual identity.

[ ] Biome differentiation does not rely solely on raw text.

[ ] Selected/hover/focus states remain clear.

[ ] Technical grid is OFF by default.

[ ] Grid feature remains available if still legitimately useful.

[ ] Map plate is intentionally styled.

[ ] Connections visually read as routes rather than generic graph edges.

[ ] Existing connection/transport semantics are unchanged.

[ ] Minimap uses the same biome presentation source.

[ ] Minimap shows simplified connections.

[ ] Viewport indicator remains functional.

[ ] World legend communicates biome presentation.

[ ] Building markers remain functional.

[ ] No BuildingCategoryIcon rollout was added.

[ ] Pan/zoom remains functional.

[ ] Region selection remains functional.

[ ] Narrow layout remains usable.

[ ] No new raster/vector art assets were created.

[ ] No renderer rewrite occurred.

[ ] No gameplay semantics changed.

[ ] No persistence semantics changed.

[ ] No unrelated systems changed.

[ ] Focused World tests pass.

[ ] Web typecheck passes.

[ ] Lint remains zero-error.

[ ] Full test suite passes.

[ ] build:web passes.

[ ] Actual runtime World screen was visually inspected.

[ ] Runtime result is materially more game-like than the supplied baseline.

[ ] Unrelated working-tree churn remains untouched.

---

# 41. Consolidated Finish Mode

Use consolidated Definition-of-Done mode.

If an obvious task-local issue is found while implementing or validating:

FIX IT DIRECTLY.

Examples:

- biome label clipping;
- selected border unreadable on one biome;
- minimap route too strong;
- map plate contrast too weak;
- narrow layout label overflow;
- new CSS lint issue;
- broken focused test caused by approved markup.

Do not return a micro-delta for trivial task-local corrections.

Finish the bounded slice.

---

# 42. Stop Conditions

STOP only for a material blocker:

1. authoritative biome display names cannot be accessed without a substantial
   new content architecture;

2. biome visual category requires inventing gameplay/content semantics;

3. existing SVG renderer cannot support material visual improvement;

4. connection meaning is too ambiguous to restyle safely;

5. proposed presentation would imply false geographic/gameplay meaning;

6. API change becomes materially larger than read/presentation metadata;

7. save/persistence migration becomes necessary;

8. gameplay rules must change;

9. new art becomes mandatory to achieve even the Slice-1 foundation;

10. unexpected cross-scope regression requires unrelated implementation;

11. a genuine product visual decision prevents safe completion.

Do not stop for ordinary CSS/SVG/component/test work.

---

# 43. Deferred Work

Record but DO NOT implement:

- BuildingCategoryIcon map markers;
- richer building representation;
- hover/detail tooltips;
- minimap click-to-pan;
- per-region illustrations;
- WM-series art;
- authored region shapes;
- richer terrain;
- route animation;
- weather;
- discovery/fog systems;
- World inspector broader redesign;
- economy/resource overlays beyond existing behavior.

These may become later slices only after Slice 1 runtime evaluation.

---

# 44. Implementation Report

Create:

docs/architecture/reviews/
POST_V1_WORLD_VISUAL_PRESENTATION_SLICE_1_CLOSE_CANDIDATE.md

Required sections:

## A. Executive Summary

## B. Repository Baseline

## C. Slice Scope

## D. Architecture Confirmation

## E. Biome Presentation Source

## F. Player-Facing Biome Labels

## G. Region Visual Identity

## H. Map Plate / Grid

## I. Route Presentation

## J. Minimap

## K. Legend

## L. Interaction Preservation

## M. Accessibility / Responsive Behavior

## N. Tests

## O. Quality Gates

## P. Runtime Visual Validation

## Q. Visual Acceptance Questions

## R. Visual Evidence

## S. Gameplay / API / Persistence Integrity

## T. Deferred Work

## U. Repository Integrity

## V. Definition of Done

## W. Final Decision

---

# 45. Repository Integrity

Before finishing:

git status --short

git diff --name-only

git diff --stat

Clearly separate:

TASK-OWNED CHANGES

from:

PRE-EXISTING / UNRELATED CHURN

Do not stage unrelated files.

Do not restore unrelated files.

Do not delete unrelated files.

Do not move tags.

---

# 46. Git Rule

DO NOT COMMIT.

DO NOT PUSH.

DO NOT TAG.

Return one close candidate for ChatGPT review.

---

# 47. Final Decision

Return exactly ONE:

## OPTION A —

POST-V1 WORLD VISUAL PRESENTATION
SLICE 1 — BIOME IDENTITY + MAP FOUNDATION
CLOSE CANDIDATE READY

Use only when the complete Definition of Done is satisfied, including actual
runtime visual validation.

---

## OPTION B —

SLICE 1
BLOCKED BY PRODUCT / VISUAL DECISION

Use only if a genuine product visual decision prevents safe implementation.

State the exact decision required.

---

## OPTION C —

SLICE 1
BLOCKED BY ARCHITECTURE / CONTENT BOUNDARY

Use only if the current renderer/content/API boundary cannot support the
approved Slice 1 without material scope expansion.

State exact evidence.

---

## OPTION D —

SLICE 1
TECHNICALLY COMPLETE BUT VISUAL ACCEPTANCE FAILED

Use if:

- implementation is correct;
- tests/gates pass;
- runtime works;

BUT the resulting World still does not materially improve over the supplied
baseline.

This is an IMPORTANT valid outcome.

Do not call a mediocre visual result PASS merely because the implementation
is technically correct.

State:

WHAT STILL LOOKS WRONG:

WHY:

WHETHER NEW ART IS NOW REQUIRED:

WHETHER A DIFFERENT VISUAL DIRECTION IS REQUIRED:

Do not expand scope automatically.

---

# 48. Execution Summary

Return:

# Project Genesis
# World Visual Presentation — Slice 1
## Execution Summary

### Repository

- branch:
- initial HEAD:
- remote master:
- unrelated churn:
- tags unchanged:

### Architecture

- renderer:
- renderer replaced:
NO

- world topology changed:
NO

- gameplay semantics changed:
NO

### Biome Presentation

- authoritative source:
- player-facing biome names:
- raw biome IDs visible:
YES / NO

- biome visual differentiation:
- duplicated frontend biome catalog:
YES / NO

### Main Map

- grid default:
- map plate:
- region visual model:
- selection:
- hover/focus:
- route model:
- building markers preserved:
YES / NO

### Minimap

- shared biome presentation:
YES / NO

- routes visible:
YES / NO

- viewport indicator preserved:
YES / NO

### Legend

- biome identity represented:
YES / NO

- raw IDs:
YES / NO

### Runtime Visual Validation

- runtime launched:
YES / NO

- desktop inspected:
YES / NO

- selected region inspected:
YES / NO

- multiple biomes inspected:
YES / NO

- minimap inspected:
YES / NO

- narrow viewport inspected:
YES / NO

### Visual Acceptance

- graph-paper impression removed:
YES / NO

- biomes visually recognizable:
YES / NO

- routes read as routes:
YES / NO

- minimap visually aligned:
YES / NO

- selection clear:
YES / NO

- dark theme readable:
YES / NO

- materially more game-like than baseline:
YES / NO

### Assets

- new raster assets:
NONE

- new illustration assets:
NONE

- existing assets modified:
NO

### Integrity

- API gameplay semantics changed:
NO

- persistence changed:
NO

- save migration:
NO

- unrelated systems changed:
NO

### Tests

- focused World tests:
PASS / FAIL

- web typecheck:
PASS / FAIL

- lint:
PASS / FAIL

- full tests:
PASS / FAIL

- build:web:
PASS / FAIL

### Deferred

- BuildingCategoryIcon markers:
DEFERRED

- new World art:
DEFERRED PENDING RUNTIME RESULT

- richer terrain/region illustration:
DEFERRED

### Repository Integrity

- task-owned files:
- unrelated files touched:
NO

- commit:
NONE

- push:
NONE

- tags moved:
NO

### Definition of Done

COMPLETE / INCOMPLETE

### Final Decision

OPTION A / OPTION B / OPTION C / OPTION D

STOP.

---

# CORE RULE

THIS SLICE MUST MAKE THE WORLD VISIBLY BETTER.

NOT JUST TECHNICALLY CLEANER.

THE EXISTING SVG WORLD FRAMEWORK IS THE FOUNDATION.

KEEP IT.

REMOVE THE DEBUG-GRAPH FEEL.

ESTABLISH BIOME IDENTITY.

USE PLAYER-FACING BIOME NAMES.

TURN THE MAP BACKGROUND INTO A DELIBERATE MAP PLATE.

HIDE THE TECHNICAL GRID BY DEFAULT.

MAKE CONNECTIONS READ AS ROUTES.

MAKE THE MINIMAP SPEAK THE SAME VISUAL LANGUAGE.

DO NOT INVENT GEOGRAPHY.

DO NOT INVENT GAMEPLAY.

DO NOT CREATE NEW ART YET.

DO NOT ROLL OUT BUILDING ICONS YET.

DO NOT REWRITE THE RENDERER.

MOST IMPORTANTLY:

TESTS PASSING IS NOT SUFFICIENT.

THE ACTUAL RUNTIME WORLD MUST BE VISUALLY INSPECTED.

IF IT STILL LOOKS LIKE A TECHNICAL GRAPH AFTER THE SLICE:

RETURN OPTION D.

DO NOT PRETEND IT IS DONE.

NO COMMIT.
NO PUSH.
NO TAG.

STOP.