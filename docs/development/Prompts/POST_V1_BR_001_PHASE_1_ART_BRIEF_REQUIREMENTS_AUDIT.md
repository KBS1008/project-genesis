# Cursor Review Prompt
# Project Genesis — Post-V1 Visual Production

## BR-001 Phase 1 — Logo / Brand Mark
## Art Brief & Requirements Audit

MODE:
READ-ONLY ART BRIEF / REQUIREMENTS AUDIT

DO NOT CREATE ART.
DO NOT GENERATE A LOGO.
DO NOT CREATE SVG/PNG/WEBP/ICO FILES.
DO NOT MODIFY CODE.
DO NOT MODIFY ASSETS.
DO NOT MODIFY TESTS.
DO NOT MODIFY REGISTRY.
DO NOT MODIFY SYNC TOOLING.
DO NOT MODIFY UI.
DO NOT MODIFY GAMEPLAY.
DO NOT MODIFY DOMAIN/API/YAML.
DO NOT IMPLEMENT A CONSUMER.
DO NOT COMMIT.
DO NOT PUSH.
DO NOT TAG.

The only allowed repository change is the task-owned audit/report file.

---

# 1. Purpose

Project Genesis has selected:

BR-001 — Logo / Brand Mark

as the preferred next bounded post-V1 visual-production slice.

This selection is now accepted.

The purpose of this task is NOT to design the logo.

The purpose is to establish a production-ready art and requirements contract
for a small BR-001 Phase 1.

The audit must determine:

- what BR-001 actually represents;
- what the authoritative source artwork should contain;
- whether the primary identity is symbol, wordmark, or lockup;
- which variants are genuinely required;
- exact first runtime consumer;
- favicon requirements;
- authoritative source format;
- runtime/export formats;
- color/monochrome requirements;
- minimum-size requirements;
- accessibility semantics;
- registry/runtime delivery expectations;
- explicit Phase-1 exclusions;
- objective certification criteria for later art production.

The result must be specific enough that the next production task can create
the art without inventing requirements.

---

# 2. Accepted Prior Decision

Read:

docs/architecture/reviews/
POST_V1_VISUAL_PRODUCTION_BR_001_VS_ICON_008_WINNER_DELTA.md

Treat its final decision as accepted:

BR-001 SELECTED

Required next gate:

ART BRIEF / REQUIREMENTS AUDIT

Do not reopen the BR-001 vs ICON-008 selection unless hard repository evidence
shows that the prior review relied on a false factual premise.

Do not perform another general visual prioritization review.

---

# 3. Sealed Visual Baseline

Treat as closed:

ICON-001 Phase 1
=
CLOSED / PASS, SEALED

ICON-002 Phase 1
=
CLOSED / PASS, SEALED

Do not reopen or redesign either family.

BR-001 is a new visual-system layer:

PRODUCT / SHELL BRAND IDENTITY

It is not:

- a resource icon;
- a building-category icon;
- a gameplay-state icon;
- a navigation icon;
- a world-map marker;
- a splash background.

---

# 4. Repository / Release Baseline

Expected current baseline:

BR-001 winner review baseline:

730ed190bb9c3b64c426b185a32fe36528c4bda7

The winner-delta report itself was READ-ONLY and should not have created a
commit.

Verify actual repository state.

Run:

git branch --show-current
git rev-parse HEAD
git rev-parse origin/master
git status --short
git status
git diff --stat
git diff
git diff --staged
git log --oneline --decorate -50

git rev-list -n 1 v1.0.0
git rev-list -n 1 v1.0.0-rc.1

Required immutable release tags:

v1.0.0
=
c4bb643df6fda7792906f34fbbb20ff07e9bfeef

v1.0.0-rc.1
=
442665cd6437bdebff88fd1540cedc689238c240

Record:

- branch;
- HEAD;
- origin/master;
- dirty/unrelated work;
- tag integrity.

Do not modify repository state.

---

# 5. Mandatory Project Guidance

Read:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Inspect relevant visual documentation, including at minimum:

docs/design/VISUAL_PRODUCTION_BACKLOG.md

docs/design/VISUAL_ASSET_CATALOG.md

docs/design/VISUAL_ASSET_CHANGELOG.md

docs/design/VISUAL_GUIDELINES.md

Inspect any existing:

ART_DIRECTION.md

brand guidance

logo references

main-menu visual guidance

splash guidance

design-system documentation

visual asset registry documentation

Do not assume these files exist under guessed names.

Search the repository and use actual paths.

---

# 6. Inspect Existing BR-001 State

Verify the prior review's findings.

Inspect:

visual-asset-registry.ts

and all references to:

BR-001
MM-006
MM-001
MM-007

Determine:

- current BR-001 registry entry;
- current path;
- current webp path if any;
- preload behavior;
- component annotation;
- current note/comment;
- whether BR-001 is still an alias to MM-006;
- whether any runtime component actually renders BR-001;
- whether any BR-001 source artwork exists elsewhere;
- whether any unused logo candidate already exists in repository history or
  current asset directories.

Do not treat MM-006 scenic background photography as the BR-001 logo.

Do not extract a logo from MM-006 unless authoritative evidence proves an
actual logo is embedded there intentionally.

---

# 7. Consumer Audit

Inspect the actual current consumers identified by the winner delta.

At minimum inspect:

SplashScreen.tsx

MainMenuScreen.tsx

MainMenuHome.tsx

MenuLoadingScreen.tsx

GameWorkspaceShell.tsx

ApplicationShell.tsx

layout.tsx

and relevant CSS/layout definitions.

Verify:

A. how "Project Genesis" is currently presented;

B. whether there is a dedicated image/logo slot;

C. available geometry in MainMenuHome;

D. desktop layout;

E. narrow/responsive layout;

F. whether the existing text `<h1>` should remain authoritative;

G. whether the mark should appear above, beside, or independently from the
   title;

H. whether favicon/browser metadata is currently absent;

I. whether splash usage should be Phase 1 or deferred.

Do not modify any consumer.

---

# 8. First Consumer Must Be Exact

The prior winner delta proposed:

Primary:

MainMenuHome
→ `.pg-main-menu-brand`

Secondary:

layout.tsx
→ favicon metadata

Audit whether this remains the cleanest Phase-1 boundary.

The final art brief must name exactly ONE primary UI consumer.

Favicon may be included as a derivative use of the same mark.

Do not create multiple UI integration targets merely because the logo could be
used in many places.

Strong default:

Primary UI consumer:
MainMenuHome brand block

Secondary derivative:
browser favicon

But repository evidence must confirm this.

---

# 9. Preserve Text Authority

Determine whether the existing textual:

Project Genesis

should remain present after logo integration.

Strong preference:

YES.

The visual mark should not become the only accessible or semantic carrier of
the product name unless repository/design requirements explicitly require it.

The audit must define:

- whether existing `<h1>` remains;
- whether the mark is decorative when adjacent to the text title;
- whether a combined wordmark image would create duplicate accessible naming;
- whether visual text inside artwork is actually necessary.

Prefer separation of:

GRAPHIC MARK

and

HTML TEXT TITLE

unless strong art-direction evidence supports a combined lockup.

Do not change UI during this audit.

---

# 10. Core Identity Decision

The audit must evaluate exactly these possible Phase-1 identity models:

MODEL A — SYMBOL-FIRST

A standalone Project Genesis graphic mark.

HTML text continues to render "Project Genesis".

Favicon uses the symbol.

Likely lowest accessibility/localization coupling.

---

MODEL B — WORDMARK-FIRST

The primary asset is a stylized "Project Genesis" wordmark.

Favicon requires a separate compact derivative or monogram.

Higher small-size risk.

---

MODEL C — COMBINED LOCKUP

Symbol + "Project Genesis" typography form one authoritative visual lockup.

Favicon still requires symbol/compact derivative.

Potential duplication with existing HTML title.

---

MODEL D — RESPONSIVE IDENTITY SYSTEM

Separate:

symbol
wordmark
combined lockup

This is likely beyond a minimal Phase 1 unless evidence proves all three are
required immediately.

---

Choose exactly ONE preferred model for Phase 1.

Do not design it.

Explain why.

---

# 11. Brand Concept Requirements

Determine what the mark must communicate at a high level using existing
Project Genesis product/design evidence.

Do not invent lore.

Do not invent factions.

Do not invent fictional corporate identities.

Do not invent gameplay symbolism not present in the project.

Extract only defensible themes from existing product/design documentation.

Possible themes must be repository-backed.

Examples of the TYPE of concept language that may be acceptable:

industrial
systems
construction
production
infrastructure
network
growth
simulation
precision

These are examples only.

Do not automatically adopt them.

Produce:

REQUIRED ASSOCIATIONS

OPTIONAL ASSOCIATIONS

ASSOCIATIONS TO AVOID

No logo drawing.

---

# 12. Avoid Over-Specifying Art

The brief must constrain function and identity without pretending that a
read-only audit can choose the final visual composition.

Do not prescribe exact paths, shapes, or geometry such as:

"draw three gears inside a hexagon"

unless an authoritative existing design document explicitly requires it.

Good requirement:

"must remain identifiable as a simple silhouette at favicon scale"

Bad requirement:

"must contain exactly three industrial gears"

unless already authoritative.

---

# 13. Style Contract

Determine a recommended BR-001 Phase-1 style contract.

Assess:

- flat vs illustrated;
- geometric vs organic;
- industrial vs decorative;
- simple vs detailed;
- outline vs solid;
- monochrome compatibility;
- full-color compatibility;
- gradients;
- shadows;
- photographic elements;
- textures;
- text inside source artwork.

The logo must not simply inherit ICON-001 or ICON-002 style rules unless that
makes sense for brand identity.

ICON-002's 24×24 outline contract is NOT automatically the logo contract.

ICON-001's raster illustration contract is NOT automatically the logo
contract.

BR-001 requires its own justified contract.

---

# 14. Color Strategy

Determine the minimum Phase-1 color contract.

Audit existing:

CSS variables
theme tokens
main-menu colors
brand/accent colors
background contrast
light/dark surfaces if applicable.

Do not invent a new palette unless required.

Choose one recommended strategy:

A. MONOCHROME-FIRST

B. SINGLE BRAND COLOR + MONO FALLBACK

C. MULTICOLOR PRIMARY + MONO FALLBACK

D. UNRESOLVED — COLOR DIRECTION REQUIRED BEFORE PRODUCTION

For the recommendation define:

- whether `currentColor` is relevant;
- whether black/white variants are required;
- whether transparent background is mandatory;
- whether raster exports may contain baked color;
- contrast expectations.

Do not modify theme tokens.

---

# 15. Background Contract

BR-001 must not become another splash/background asset.

Define:

- transparent background requirement;
- whether contained badge/background shapes are permitted;
- whether the mark must work over MM-001/MM-006 imagery;
- whether a solid fallback surface is needed;
- whether glow/drop-shadow is part of source art or consumer styling.

Strong preference:

effects needed only for placement should remain consumer CSS rather than baked
into the master logo.

Confirm or reject based on project evidence.

---

# 16. Source Format Decision

The prior review left authoritative source format unresolved.

Evaluate:

SVG-FIRST

versus

PNG-FIRST

versus

HYBRID SOURCE

For a logo/brand mark consider:

- scalability;
- favicon derivation;
- crisp small sizes;
- transparency;
- recoloring;
- repository tooling;
- runtime security/embedding model;
- browser delivery;
- existing visual asset registry;
- future branding reuse.

Choose exactly one authoritative source-art strategy.

Do not create the source file.

If recommending SVG-first, define whether:

- SVG is the certified master;
- runtime may use SVG directly;
- PNG/favicon derivatives are generated from it.

If recommending PNG-first, justify why vector master is inappropriate.

---

# 17. Runtime Format Decision

Separate:

SOURCE FORMAT

from

RUNTIME FORMAT.

Determine which Phase-1 runtime outputs are actually needed.

Candidates may include:

SVG
PNG
WebP
ICO
favicon PNG sizes

Do not create unnecessary derivatives simply because tooling can.

For each proposed runtime output state:

- consumer;
- reason;
- required or optional.

---

# 18. Favicon Contract

Verify current favicon state from repository.

If missing, define the minimum favicon derivative contract.

Determine:

- whether SVG favicon is supported/desired;
- whether PNG favicon is required;
- whether `favicon.ico` is required by actual project/browser compatibility
  policy;
- minimum useful sizes;
- whether Apple touch icon belongs in Phase 1;
- whether manifest/PWA icons belong in Phase 1.

Do not inflate Phase 1 into a full browser/PWA branding package.

Classify each:

REQUIRED PHASE 1

OPTIONAL / DEFERRED

OUT OF SCOPE

---

# 19. Size / Geometry Audit

Measure actual likely consumer geometry from code/CSS.

Do not invent dimensions.

For MainMenuHome determine:

- available brand-block width;
- desktop constraints;
- narrow constraints;
- likely rendered mark size;
- relationship to heading size;
- whether square, horizontal, or flexible aspect ratio fits best.

For favicon determine actual small-size constraints.

From this derive:

- recommended master aspect behavior;
- minimum certified visual size;
- likely CSS display size range;
- safe-area requirement if relevant.

Do not create assets.

---

# 20. Small-Size Legibility Gate

BR-001 must remain recognizable at the smallest required Phase-1 use.

Define a future certification test for:

- menu display size;
- favicon size.

Specify what counts as failure:

- silhouette collapses;
- internal negative spaces disappear;
- linework becomes indistinguishable;
- text becomes unreadable;
- mark relies on color distinctions lost in monochrome.

Do not certify artwork that does not exist.

Define the future gate only.

---

# 21. Wordmark / Typography Relationship

Inspect current project typography and menu title styling.

Determine whether BR-001 Phase 1 should:

A. contain no text at all;

B. include optional wordmark artwork;

C. replace the existing HTML heading;

D. sit alongside existing HTML heading.

Strong preference:

preserve HTML title and keep the first visual asset text-free if that provides
the cleanest minimal contract.

But verify against repository evidence.

If a custom wordmark is deferred:

state it explicitly.

Do not invent or install a new font.

---

# 22. Accessibility Contract

Define expected semantics for future integration.

If the existing `<h1>Project Genesis</h1>` remains adjacent:

likely:

logo image decorative
alt=""
aria-hidden where appropriate

If the logo becomes the only visible product-name carrier:

accessibility requirements change.

The brief must decide the expected Phase-1 model.

Also define:

- fallback behavior if asset fails;
- whether textual product name remains visible;
- whether favicon has any accessibility relevance.

Do not implement.

---

# 23. Failure / Fallback Contract

Define expected future behavior when:

- registry entry missing;
- image/SVG fails;
- derivative missing;
- favicon missing.

The UI must not become unusable.

Strong expected behavior:

existing textual "Project Genesis" remains authoritative and visible.

Logo failure should degrade to text-only branding.

Verify that this is compatible with the chosen identity model.

---

# 24. Registry Contract

Audit current `BR-001` registry semantics.

Determine the future desired state after real artwork exists.

Define:

- canonical asset ID;
- source path concept;
- runtime path concept;
- preload yes/no;
- component ownership;
- whether the existing MM-006 alias must be replaced;
- whether registry schema changes are required.

Strong preference:

NO registry schema change.

Do not edit registry.

Do not invent exact filenames unless the existing naming convention makes them
authoritative.

---

# 25. Sync / Derivative Tooling

Inspect existing visual asset sync/generation tooling.

Determine whether BR-001 can use:

existing tooling unchanged

or requires:

small tooling extension

or requires:

manual derivative handling.

Assess separately:

logo master
runtime image
favicon derivative

Do not modify tooling.

Do not create a derivative pipeline during this audit.

---

# 26. Production Method

The winner delta recommended:

MANUAL / VECTOR

Re-evaluate this against the finalized source strategy.

Choose:

MANUAL / VECTOR

IMAGE GENERATION

HYBRID

OTHER

For a brand logo, explicitly assess whether AI-generated raster artwork is
appropriate as an authoritative master.

The decision must account for:

- geometric consistency;
- editability;
- small-size precision;
- reproducibility;
- vector cleanliness;
- future derivatives.

Do not generate art.

---

# 27. AI Image Generation Gate

Explicitly state whether image-generation tooling should be used for:

A. authoritative final logo production;

B. concept exploration only;

C. not at all.

If concept exploration is allowed:

state that generated concepts are NON-AUTHORITATIVE until manually
reconstructed/certified under the final source contract.

Do not generate concepts in this task.

---

# 28. Asset Count

Determine the minimum required Phase-1 asset family.

Do not count runtime derivatives as independent artwork unless they require
independent composition.

Distinguish:

SOURCE ARTWORKS

from

DERIVATIVES

Example:

1 source symbol
+ 3 favicon exports

does not necessarily mean four independent artworks.

State exact expected count if the audit can resolve it.

Otherwise provide a tightly bounded range and explain the unresolved choice.

---

# 29. Phase-1 Boundary

The final report must define:

## INCLUDED

Only what is required to establish the first usable Project Genesis brand
mark.

Likely candidates:

- one primary source mark;
- certified small-size behavior;
- MainMenuHome use contract;
- favicon derivative contract;
- BR-001 registry replacement plan.

But determine final scope from evidence.

---

## EXCLUDED

At minimum assess and normally exclude:

- full brand identity package;
- Steam/store capsule artwork;
- marketing website branding;
- social media assets;
- loading-screen redesign;
- MM-001/MM-006/MM-007 redesign;
- splash photography replacement;
- full navigation redesign;
- app icon/PWA package unless demonstrably required;
- merchandise;
- animation;
- sound/logo sting;
- ICON-003…010;
- World Map work;
- per-building-type art;
- gameplay changes.

Do not create a "branding sprint".

---

# 30. Phase Naming

Determine whether the clean lifecycle should be:

BR-001 Phase 1A
=
Art Brief / Requirements

BR-001 Phase 1B
=
Art Production

BR-001 Phase 1C
=
Certification / Runtime Readiness

BR-001 Phase 1D
=
First Consumer Integration

BR-001 Phase 1E
=
Coverage / Lifecycle Closeout

If a simpler lifecycle is justified, explain it.

Do not implement later phases.

---

# 31. Production Acceptance Criteria

Define objective acceptance criteria for future BR-001 artwork.

At minimum consider:

- transparent background;
- clean silhouette;
- correct aspect ratio behavior;
- no accidental clipping;
- no embedded raster if SVG master;
- no unnecessary text if symbol-first;
- no external font dependency;
- no external linked assets;
- valid SVG if vector;
- small-size readability;
- monochrome behavior;
- contrast;
- deterministic source;
- exact asset dimensions where applicable;
- stable source hash at certification;
- runtime derivative parity.

Do not certify nonexistent art.

---

# 32. Consumer Acceptance Criteria

Define future MainMenuHome integration acceptance criteria.

At minimum:

- existing title remains readable;
- logo does not replace functional navigation;
- no layout shift that breaks menu geometry;
- narrow viewport remains usable;
- mark does not collide with title/buttons;
- text-only fallback remains valid;
- decorative accessibility correct;
- no gameplay/domain/API changes;
- no duplicate product-name announcement for assistive technology.

Do not integrate.

---

# 33. Favicon Acceptance Criteria

Define future favicon acceptance criteria.

At minimum:

- derived from certified BR-001 identity;
- recognizable at smallest supported size;
- no illegible wordmark text;
- transparent/appropriate background;
- correct browser metadata wiring;
- no dependency on MM-006;
- missing favicon does not affect application runtime.

Do not create favicon files.

---

# 34. Existing Placeholder Migration

Define the future migration from:

BR-001
→ MM-006 alias

to:

BR-001
→ dedicated certified logo asset

Determine whether the migration should happen during:

Phase 1C runtime readiness

or

Phase 1D consumer integration.

Prefer the earliest phase in which the registry can point safely to a real,
certified runtime asset without creating a dead consumer path.

Do not perform migration now.

---

# 35. MM-006 Separation

Explicitly document:

MM-006
=
scenic splash/background visual

BR-001
=
product identity / brand mark

They are separate asset roles.

A future BR-001 implementation must not:

- overwrite MM-006;
- rename MM-006 into BR-001;
- treat the background image as the logo;
- remove MM-006 merely because BR-001 exists.

Determine whether the current registry alias should be described as:

TEMPORARY COMPATIBILITY PLACEHOLDER

or another accurate term.

---

# 36. No Gameplay Assumptions

BR-001 must not encode invented gameplay semantics.

Do not require:

- specific resource symbols;
- specific building symbols;
- transport modes;
- faction emblems;
- economic indicators;
- research symbols;
- world-map geography;

unless existing authoritative brand/art documentation already requires them.

Brand concept may abstractly evoke Project Genesis themes.

It must not fabricate lore.

---

# 37. Open Questions

The audit should resolve as many questions as repository evidence allows.

For anything genuinely unresolved, classify:

BLOCKING BEFORE ART PRODUCTION

or

NONBLOCKING ART-DIRECTION CHOICE

or

DEFERRED OUT OF PHASE 1

Do not leave vague "TBD" items without classification.

The goal is to make the next production task safe.

---

# 38. Hard Blocker Test

Before recommending production, ask:

Is there enough authoritative art direction to create a logo without the
producer inventing the brand identity?

If YES:

recommend Phase 1B Art Production.

If NO:

do NOT recommend production.

Instead identify the smallest human/art-direction decision required.

Possible outcome:

BR-001 concept is technically ready but requires a human choice between
2–3 art-direction options before production.

That is an acceptable audit result.

Do not manufacture certainty.

---

# 39. Report

Create only:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1_ART_BRIEF_REQUIREMENTS_AUDIT.md

No other file modifications.

---

# 40. Required Report Structure

A. Executive Summary

B. Repository Baseline

C. BR-001 Existing State

D. Existing Brand Presentation

E. Consumer Geometry / Responsive Audit

F. Phase-1 Identity Model

G. Brand Concept Requirements

H. Style Contract

I. Color / Background Contract

J. Source Format Contract

K. Runtime / Derivative Contract

L. Favicon Contract

M. Typography / Wordmark Relationship

N. Accessibility / Fallback Contract

O. Registry Contract

P. Sync / Tooling Assessment

Q. Production Method

R. AI Generation Policy

S. Asset Count

T. Phase-1 Boundary

U. Lifecycle Proposal

V. Production Acceptance Criteria

W. Consumer Acceptance Criteria

X. Favicon Acceptance Criteria

Y. MM-006 Separation / Placeholder Migration

Z. Open Questions / Blockers

AA. Repository Integrity

AB. Final Decision

---

# 41. Required Decision Matrix

Include:

| Question | Decision | Confidence | Blocking? |
|----------|----------|------------|-----------|
| Primary identity model | | | |
| Primary UI consumer | | | |
| HTML title remains | | | |
| Dedicated wordmark required | | | |
| Favicon Phase 1 | | | |
| Source format | | | |
| Runtime format | | | |
| Transparent background | | | |
| Mono variant | | | |
| Color strategy | | | |
| Preload | | | |
| Registry schema change | | | |
| Sync tooling change | | | |
| Production method | | | |
| AI final-art use | | | |
| Asset count | | | |
| MM-006 separation | | | |
| Ready for art production | | | |

---

# 42. Final Decision

Choose exactly one:

OPTION A — BR-001 PHASE 1 ART BRIEF CLOSED / READY FOR ART PRODUCTION

Use only if:

- identity model is sufficiently defined;
- source strategy is defined;
- first consumer is known;
- favicon boundary is known;
- color/mono requirements are defined;
- accessibility/fallback is defined;
- no human brand-direction decision remains blocking.

---

OPTION B — BR-001 ART BRIEF TECHNICALLY READY / HUMAN ART-DIRECTION DECISION REQUIRED

Use when:

technical/runtime/consumer requirements are clear,

but final logo identity still requires a bounded human choice before art
production.

List exactly which decisions require human selection.

Do not produce art.

---

OPTION C — BR-001 REQUIREMENTS DELTA REQUIRED

Use when:

repository evidence reveals a small missing technical or consumer requirement
that must be investigated before the art brief can close.

---

OPTION D — BR-001 BLOCKED / REPRIORITIZATION REQUIRED

Use only if:

hard evidence shows BR-001 is not viable as the selected next visual slice.

Do not casually fall back to ICON-008.

A separate prioritization gate would be required.

---

# 43. Repository Integrity

At end run:

git status --short
git diff --stat
git diff --name-only
git rev-parse HEAD
git rev-parse origin/master
git rev-list -n 1 v1.0.0
git rev-list -n 1 v1.0.0-rc.1

Expected task-owned change only:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1_ART_BRIEF_REQUIREMENTS_AUDIT.md

Expected:

code changed:
NO

assets changed:
NO

tests changed:
NO

registry changed:
NO

sync tooling changed:
NO

UI changed:
NO

lifecycle docs changed:
NO

commits:
NO

push:
NO

tags moved:
NO

---

# 44. Execution Summary

Return:

# BR-001 Phase 1 — Art Brief / Requirements Audit
## Execution Summary

### Baseline

- Branch:
- HEAD:
- origin/master:
- unrelated dirty work:
- v1.0.0:
- v1.0.0-rc.1:
- tags moved:

### Existing BR-001

- dedicated artwork exists:
- registry state:
- current alias:
- runtime consumers:
- favicon currently exists:
- MM-006 role:

### Phase-1 Identity

- selected model:
- primary mark:
- wordmark:
- HTML "Project Genesis" title:
- primary consumer:
- favicon:
- asset role:

### Art Contract

- source format:
- runtime format:
- source artwork count:
- derivative count:
- aspect behavior:
- transparent background:
- color strategy:
- monochrome requirement:
- minimum-size requirement:
- external fonts:
- external linked assets:

### Production

- production method:
- AI final-art use:
- AI concept use:
- human art-direction decision required:

### Runtime

- registry schema change:
- BR-001 alias replacement:
- preload:
- sync tooling:
- first consumer integration phase:
- fallback:

### Phase-1 Boundary

Included:

Excluded:

### Acceptance Gates

- source-art gate:
- small-size gate:
- monochrome gate:
- accessibility gate:
- responsive consumer gate:
- favicon gate:
- runtime/hash gate:

### Open Questions

Blocking before art production:

Nonblocking art-direction choices:

Deferred:

### Repository Integrity

- report created:
- code changed:
- assets changed:
- tests changed:
- registry changed:
- sync tooling changed:
- UI changed:
- lifecycle docs changed:
- commit:
- push:
- tags moved:

### Final Decision

OPTION A / B / C / D

STOP.

---

# CORE PRINCIPLE

THIS TASK DEFINES THE BRAND-MARK CONTRACT.

IT DOES NOT DESIGN THE BRAND MARK.

BR-001 MUST REMAIN A SMALL, BOUNDED PRODUCT-IDENTITY SLICE.

DO NOT TURN IT INTO A FULL BRANDING PROGRAM.

DO NOT CONFUSE BR-001 WITH MM-006.

DO NOT REMOVE THE EXISTING TEXTUAL PRODUCT NAME MERELY BECAUSE A LOGO WILL
EXIST.

DO NOT CREATE MULTIPLE LOGO VARIANTS UNLESS A REAL PHASE-1 CONSUMER REQUIRES
THEM.

DO NOT USE AI-GENERATED RASTER ART AS AN AUTHORITATIVE LOGO MASTER WITHOUT AN
EXPLICIT AUDITED JUSTIFICATION.

PREFER A CLEAN, EDITABLE, SMALL-SIZE-SAFE IDENTITY CONTRACT.

IF REPOSITORY EVIDENCE CANNOT DETERMINE THE FINAL VISUAL IDENTITY, SAY SO AND
RETURN OPTION B RATHER THAN INVENTING BRAND DIRECTION.

DEFINE THE CONTRACT.

THEN STOP.