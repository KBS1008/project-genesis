# Cursor Implementation Prompt
# Project Genesis — Post-V1 Visual Production

## BR-001 Phase 1B — Brand Symbol Art Production

MODE:
BOUNDED ART PRODUCTION

CREATE EXACTLY ONE AUTHORITATIVE SOURCE ARTWORK.

DO NOT CREATE RUNTIME DERIVATIVES.
DO NOT CREATE PNG.
DO NOT CREATE WEBP.
DO NOT CREATE FAVICON FILES.
DO NOT MODIFY REGISTRY.
DO NOT MODIFY SYNC TOOLING.
DO NOT MODIFY UI / CONSUMERS.
DO NOT MODIFY TESTS UNLESS A SOURCE-ART VALIDATION TEST IS STRICTLY NECESSARY.
DO NOT MODIFY GAMEPLAY.
DO NOT MODIFY DOMAIN/API/YAML.
DO NOT MODIFY RELEASE TAGS.
DO NOT PUSH.

This task produces the BR-001 authoritative SVG master only.

---

# 1. Purpose

BR-001 Phase 1A Art Brief / Requirements Audit is complete.

Human art-direction decisions are now resolved.

Produce exactly one authoritative vector master:

BR-001 — Project Genesis Brand Symbol

This is:

PRODUCT / SHELL BRAND IDENTITY

It is NOT:

- a wordmark;
- a gameplay icon;
- a resource icon;
- a building-category icon;
- a status icon;
- a navigation icon;
- a world-map marker;
- a splash background;
- a replacement for MM-006.

The output of this task is the source artwork only.

Runtime certification and integration happen later.

---

# 2. Mandatory Authority

Read:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Read:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1_ART_BRIEF_REQUIREMENTS_AUDIT.md

Read:

docs/architecture/reviews/
POST_V1_VISUAL_PRODUCTION_BR_001_VS_ICON_008_WINNER_DELTA.md

Also inspect actual current:

docs/design/VISUAL_GUIDELINES.md

ART_DIRECTION.md

design tokens

MainMenuHome layout

visual asset registry

only as needed to confirm the already-defined contract.

Do not reopen prioritization.

Do not reopen BR-001 Phase 1A requirements except if hard contradictory
repository evidence is found.

---

# 3. Accepted Phase-1A Decisions

Treat the following as authoritative for this task.

Identity model:

MODEL A — SYMBOL-FIRST

Primary artwork:

ONE text-free graphic symbol

Existing HTML:

<h1>Project Genesis</h1>

remains authoritative and is NOT part of the SVG.

Primary future consumer:

MainMenuHome
→ .pg-main-menu-brand

Favicon:

future derivative of the same symbol

Splash integration:

DEFERRED

MM-006:

UNCHANGED scenic splash background

---

# 4. Human Art-Direction Decision — RESOLVED

The previously blocking B1 decision is now:

CONCEPT 1 — MODULAR INDUSTRIAL MARK

Interpretation:

Create a compact abstract geometric symbol suggesting:

- engineered structure;
- modular construction;
- connection;
- coordinated systems;
- precision;
- controlled industrial growth.

The mark should feel appropriate for a serious industrial/economic management
simulation.

It must remain abstract.

---

# 5. What "Modular Industrial" Does NOT Mean

Do NOT make the symbol a literal:

- factory;
- smokestack;
- warehouse;
- gear;
- wrench;
- bolt;
- truck;
- train;
- ship;
- resource;
- building;
- chart;
- dollar sign;
- map;
- globe;
- network UI icon;
- circuit-board icon;
- power icon.

Do not create gameplay iconography disguised as branding.

The mark may evoke engineered modules and connections through abstract
geometry.

It must not depict a specific gameplay entity.

---

# 6. Brand Associations

The mark should support:

REQUIRED:

- industrial / engineered;
- strategic / controlled;
- precise;
- professional;
- modern;
- purposeful;
- structured.

OPTIONAL:

- modular connection;
- networked systems;
- growth through structure.

Avoid:

- fantasy;
- steampunk;
- cyberpunk;
- sci-fi space opera;
- neon aesthetic;
- cartoon style;
- casual mobile-game style;
- military insignia;
- faction emblem appearance;
- literal religious "Genesis" imagery;
- literal biological seed imagery;
- photographic treatment;
- decorative complexity.

---

# 7. Human Color Decision — RESOLVED

The previously blocking B2 decision is now:

COLOR-B

Primary treatment:

existing Project Genesis primary blue.

Use the authoritative existing design-token primary blue as the intended brand
color reference.

Do NOT invent a second brand palette.

Do NOT introduce additional arbitrary colors.

The master must also work as:

100% MONOCHROME

The symbol must remain recognizable when rendered entirely:

black

or

white.

Color must never be required to understand the geometry.

---

# 8. Authoritative Source Contract

The authoritative source is:

SVG-FIRST

The SVG created in this task is the ONLY authoritative artwork.

PNG, WebP, favicon PNGs and any later raster files are derivatives.

They must never become independently designed variants.

Expected source location:

docs/design/branding/BR-001_Logo.svg

Before creating it:

verify the existing repository naming/path conventions.

If the audited path is valid, use it.

If hard repository evidence shows the exact filename/path would violate an
authoritative convention:

STOP and report the contradiction.

Do not silently invent a replacement path.

---

# 9. Exactly One Artwork

Create:

ONE SVG master.

Do NOT create:

- alternative concept A/B/C files;
- logo variants;
- wordmark;
- lockup;
- dark version;
- light version;
- outline version;
- filled version;
- favicon;
- PNG preview;
- WebP preview;
- concept sheet;
- mood board.

There must be exactly one authoritative BR-001 source artwork at the end of
this task.

---

# 10. SVG Technical Contract

The SVG must:

- contain a valid SVG root;
- contain an explicit viewBox;
- have a transparent background;
- contain vector geometry only;
- contain no embedded raster image;
- contain no external linked image;
- contain no external resource;
- contain no external font;
- contain no <text> element;
- contain no embedded font;
- contain no metadata that creates an external dependency;
- remain deterministic and repository-safe.

Prefer simple:

path
rect
circle
polygon

geometry as appropriate.

Avoid unnecessary generated-editor cruft.

Keep SVG structure understandable.

---

# 11. Geometry Contract

The mark should be:

- compact;
- approximately square in overall visual footprint;
- centered;
- balanced;
- geometrically coherent;
- visually stable at small sizes.

Strong preference:

a square viewBox.

Do not force exact dimensions merely to imitate ICON-002.

This is a brand mark, not a 24×24 UI glyph.

The geometry must support later rendering at:

16×16
32×32
32–48px menu height

without requiring a separate composition.

---

# 12. Silhouette Contract

Strong preference:

SOLID / MASS-BASED GEOMETRY

rather than delicate line art.

Reason:

the same symbol must eventually survive a 16×16 favicon export.

Internal negative spaces are permitted.

However:

- they must remain open at small sizes;
- they must not collapse into noise;
- they must not require sub-pixel line detail;
- they must not create accidental blobs at favicon scale.

Outline geometry is allowed only if it demonstrably survives the small-size
gate better than the solid approach.

Do not inherit ICON-002 outline style automatically.

---

# 13. Complexity Budget

Keep the mark intentionally simple.

Prefer:

a small number of major geometric masses

over:

many decorative pieces.

Avoid:

- tiny holes;
- thin gaps;
- repeated micro-elements;
- dense line intersections;
- intricate internal patterns;
- detailed industrial machinery.

The logo should be identifiable from its silhouette before its internal detail.

---

# 14. Composition Direction

Within the accepted "Modular Industrial" direction, Cursor may make bounded
composition choices.

Good conceptual characteristics:

- interlocking or connected modules;
- structural progression;
- controlled directional movement;
- balanced asymmetry or structured symmetry;
- meaningful negative space;
- engineered alignment.

Do NOT encode literal gameplay semantics.

Do NOT write "PG" unless the resulting letterform emerges as an abstract
secondary reading rather than turning the task into a monogram/wordmark.

Do NOT use "Project Genesis" text.

---

# 15. Originality / Generic-Logo Risk

Avoid obvious generic technology-logo clichés.

Specifically inspect the result for accidental resemblance to:

- generic blockchain marks;
- generic AI/network logos;
- generic cloud/SaaS logos;
- crypto tokens;
- app-store template marks;
- medical crosses;
- military insignia;
- hazard symbols;
- recycling marks;
- power-button symbols.

No external trademark search is required in this task.

This is an internal visual-quality check, not legal clearance.

If the result is obviously generic or symbolically misleading:

revise it before reporting completion.

---

# 16. Color Implementation in Master

The geometry must be structurally monochrome-safe.

For the authoritative SVG master:

use a simple single-color treatment.

Prefer the audited primary-blue treatment for the master presentation.

Do not add:

gradients
glows
shadows
textures
photographic fills

unless the Phase-1A authority explicitly requires them.

It currently does not.

Do not bake a background rectangle behind the mark.

Transparent outside the symbol is mandatory.

---

# 17. No Consumer Styling in Source

Do not bake into the SVG:

- menu-card shadows;
- glow for MM imagery;
- panel backgrounds;
- hover state;
- selection state;
- focus state;
- responsive padding;
- CSS-like visual effects.

Those belong to future consumer integration if needed.

The SVG should be a clean brand symbol only.

---

# 18. Small-Size Self-Check

Before considering the artwork complete, inspect the SVG conceptually at:

16×16

32×32

approximately 40px display height.

You may create TEMPORARY local renders for inspection if needed.

Temporary inspection files:

- must not be staged;
- must not remain as task outputs;
- must be deleted before final repository-integrity check.

Do NOT commit temporary raster previews.

At 16×16 verify:

- silhouette remains recognizable;
- major negative spaces remain open;
- geometry does not collapse;
- no feature depends on tiny detail;
- no text exists;
- symbol remains distinguishable as one coherent mark.

If it fails:

revise the SVG.

---

# 19. Monochrome Self-Check

Verify conceptually or with temporary local rendering that the mark remains
coherent in:

- primary blue;
- pure black;
- pure white.

Color differences must not encode separate semantic parts.

If monochrome destroys the composition:

revise the SVG.

Do not create permanent black/white variant files.

---

# 20. Background Self-Check

The mark must remain usable on:

- light neutral surface;
- dark neutral surface.

Do not solve contrast by baking a permanent background into the source.

If the primary-blue treatment lacks contrast in a particular consumer context,
that is a later runtime/consumer treatment issue.

The underlying geometry must still pass monochrome.

---

# 21. MainMenuHome Fit Check

Do NOT integrate the asset.

But inspect the existing audited future geometry:

mark above existing <h1>

expected future display height:

approximately 2rem–3rem

max width:

approximately min(12rem, 100%)

Confirm that the artwork's aspect ratio and visual mass make sense for this
slot.

Do not modify CSS.

Do not modify MainMenuHome.

---

# 22. Favicon Readiness Check

Do NOT create favicon files.

But confirm the master is compositionally suitable for later square favicon
exports.

A separate favicon redesign is NOT allowed in Phase 1.

Future 16×16 and 32×32 files must be derivatives of this same mark.

Therefore the source artwork must already be simple enough.

---

# 23. MM-006 Separation

MM-006 remains:

SCENIC SPLASH BACKGROUND

BR-001 becomes:

DISCRETE PRODUCT BRAND SYMBOL

Do not:

- edit MM-006;
- copy pixels from MM-006;
- trace MM-006;
- extract shapes from MM-006;
- rename MM-006;
- remove MM-006;
- modify its registry entry.

Zero pixel reuse.

Zero asset-role conflation.

---

# 24. AI Generation Policy

Do NOT use AI-generated imagery as the authoritative final logo.

The final BR-001 SVG must be deliberately constructed as clean vector
geometry.

Do not convert an AI-generated raster logo into SVG and call it authoritative.

The Phase-1A contract permits AI only for non-authoritative exploration.

This task does not require such exploration.

Prefer direct manual/vector construction.

---

# 25. Scope Lock

Allowed production change:

docs/design/branding/BR-001_Logo.svg

Allowed report:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1B_ART_PRODUCTION_REPORT.md

No other task-owned production files.

Do not modify:

apps/web/**
packages/**
tests/**
visual-asset-registry.ts
sync tooling
VISUAL_ASSET_CATALOG.md
VISUAL_PRODUCTION_BACKLOG.md
VISUAL_ASSET_CHANGELOG.md
MM-001
MM-006
MM-007
release docs
gameplay/domain/API/YAML.

---

# 26. Validation

Perform appropriate source validation.

At minimum verify:

- SVG parses successfully;
- explicit viewBox exists;
- no <text>;
- no <image>;
- no external href/resource dependency;
- no opaque background bounding box;
- source path correct;
- only intended SVG master created.

If repository tooling already contains a suitable non-mutating SVG validator,
use it.

Do not add a new dependency merely to validate one file.

---

# 27. Hash

After the SVG is final:

calculate SHA-256 of:

docs/design/branding/BR-001_Logo.svg

Record it in the production report.

This is the Phase-1B source-art hash.

Do NOT yet call it runtime certification.

Formal runtime certification belongs to Phase 1C.

---

# 28. Visual Review Evidence

The report must describe:

- overall silhouette;
- modular/industrial interpretation;
- number/type of major geometric masses;
- negative-space behavior;
- small-size behavior;
- monochrome behavior;
- why it does not represent a literal gameplay object;
- why it fits MainMenuHome geometry.

Do not claim human visual approval.

Use:

PRODUCED — PENDING CHATGPT / HUMAN VISUAL REVIEW

until reviewed externally.

---

# 29. No Automatic Phase 1C

Even if the SVG passes all local checks:

DO NOT proceed to:

- PNG export;
- WebP export;
- favicon export;
- runtime sync;
- registry migration;
- consumer integration.

Phase 1B ends with the SVG master awaiting visual review.

---

# 30. Report

Create:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1B_ART_PRODUCTION_REPORT.md

The report is task-owned.

It must not alter lifecycle status to CLOSED/PASS yet.

Phase 1B remains pending external visual gate until reviewed.

---

# 31. Required Report Structure

A. Executive Summary

B. Repository Baseline

C. Phase-1A Authority

D. Human Art-Direction Decisions

E. Source Artwork Produced

F. Composition Description

G. Brand-Association Fit

H. SVG Technical Validation

I. Small-Size Review

J. Monochrome Review

K. MainMenuHome Fit

L. Favicon Readiness

M. MM-006 Separation

N. Scope Verification

O. Source Hash

P. Repository Integrity

Q. Final Production Status

---

# 32. Required Artwork Facts

Report:

Asset ID:
BR-001

Source path:

Source format:
SVG

Identity model:
SYMBOL-FIRST

Concept:
MODULAR INDUSTRIAL

Embedded text:
NO

Embedded raster:
NO

External resources:
NO

Transparent background:
YES

Primary color:
existing Project Genesis primary blue

Monochrome-safe:
YES / NO

Small-size self-check:
PASS / FAIL

16px:
PASS / FAIL

32px:
PASS / FAIL

Main-menu geometry:
PASS / FAIL

MM-006 reused:
NO

Independent source artworks:
1

---

# 33. Repository Integrity

At end run:

git status --short
git diff --stat
git diff --name-only
git diff --staged
git rev-parse HEAD
git rev-parse origin/master
git rev-list -n 1 v1.0.0
git rev-list -n 1 v1.0.0-rc.1

Expected task-owned files:

docs/design/branding/BR-001_Logo.svg

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1B_ART_PRODUCTION_REPORT.md

No other task-owned changes.

Remember:

pre-existing unrelated dirty work may exist.

Do not delete or modify it.

---

# 34. Commit Policy

DEFAULT:

DO NOT COMMIT.

DO NOT PUSH.

DO NOT TAG.

The SVG and report must remain available for external review.

Do not move:

v1.0.0

or

v1.0.0-rc.1

under any circumstance.

---

# 35. Execution Summary

Return:

# BR-001 Phase 1B — Art Production
## Execution Summary

### Baseline

- Branch:
- HEAD:
- origin/master:
- unrelated dirty work:
- v1.0.0:
- v1.0.0-rc.1:
- tags moved:

### Artwork

- asset ID:
- source path:
- source format:
- source artworks created:
- identity model:
- concept direction:
- primary color:
- transparent background:
- embedded text:
- embedded raster:
- external resources:

### Composition

- major geometry:
- modular interpretation:
- industrial/professional fit:
- literal gameplay object:
- generic-logo risk reviewed:

### Visual Self-Checks

- 16px:
- 32px:
- ~40px:
- monochrome black:
- monochrome white:
- light surface:
- dark surface:
- MainMenuHome geometry:
- favicon readiness:

### Technical Validation

- SVG parse:
- explicit viewBox:
- text elements:
- image elements:
- external refs:
- opaque background:
- SHA-256:

### Scope

- PNG created:
- WebP created:
- favicon created:
- registry changed:
- sync tooling changed:
- consumer changed:
- lifecycle docs changed:
- MM-006 changed:

Expected:
NO for all above.

### Repository Integrity

- SVG master created:
- production report created:
- unrelated files modified:
- commit:
- push:
- tags moved:

### Final Production Status

PRODUCED — PENDING CHATGPT / HUMAN VISUAL REVIEW

STOP.

---

# CORE PRINCIPLE

PHASE 1B PRODUCES ONE BRAND SYMBOL.

NOT A BRANDING SYSTEM.

NOT A WORDMARK.

NOT A RUNTIME INTEGRATION.

NOT A SPLASH REDESIGN.

THE SYMBOL MUST BE:

ABSTRACT
MODULAR
ENGINEERED
PRECISE
PROFESSIONAL
SIMPLE
TEXT-FREE
TRANSPARENT
MONOCHROME-SAFE
FAVICON-SAFE

USE THE EXISTING PROJECT GENESIS PRIMARY BLUE.

DO NOT INVENT A NEW PALETTE.

DO NOT REPRESENT A LITERAL GAMEPLAY OBJECT.

THE SVG IS THE AUTHORITATIVE MASTER.

ALL FUTURE RASTERS MUST DERIVE FROM IT.

CREATE THE MASTER.

VALIDATE IT.

HASH IT.

REPORT IT.

THEN STOP.