# Cursor Audit Prompt
# Project Genesis — Post-V1 Visual Production

## MM-001 — Embedded UI Cleanup Audit

MODE:
READ-ONLY VISUAL / CONSUMER / ARCHITECTURE AUDIT

NO IMPLEMENTATION.
NO ARTWORK MODIFICATION.
NO ASSET REPLACEMENT.
NO DERIVATIVE GENERATION.
NO REGISTRY CHANGE.
NO SYNC CHANGE.
NO UI CHANGE.
NO COMMIT.
NO PUSH.
NO TAG.

---

# 1. Context

MM-006 has already been corrected so that the splash artwork is scenic-only
and the application owns the actual interactive menu.

During MM-006 runtime validation, a separate issue was observed:

MM-001, which is used behind MainMenuHome, still appears to contain
decorative English sidebar / menu-like UI embedded directly in the artwork.

This may create the same architectural problem that MM-006 previously had:

ARTWORK:
contains fake/decorative UI

APPLICATION:
renders the real interactive menu

This task determines whether MM-001 should also be converted into a
UI-free scenic background.

DO NOT MODIFY MM-001 IN THIS TASK.

---

# 2. Existing Closed State

MM-006 is:

CLOSED / PASS, SEALED

Do not reopen it.

BR-001 Phase 1 is:

CLOSED / PASS, SEALED

Do not modify it.

ICON-001 and ICON-002 are also sealed.

This audit concerns MM-001 only.

---

# 3. Read Authority

Read:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Read relevant visual lifecycle documents:

docs/design/VISUAL_ASSET_CATALOG.md

docs/design/VISUAL_PRODUCTION_BACKLOG.md

docs/design/VISUAL_ASSET_CHANGELOG.md

Read relevant MM-001 architecture/review reports.

Search repository-wide for:

MM-001

Inspect actual source artwork, runtime assets, registry, sync tooling,
consumers, CSS/rendering geometry and relevant tests.

Also read:

docs/architecture/reviews/
POST_V1_MM_006_MENU_FREE_BACKGROUND_REPLACEMENT_CLOSE_CANDIDATE_REPORT.md

Use it only as architectural precedent.

Do not copy MM-006 assumptions blindly onto MM-001.

---

# 4. Primary Audit Question

Determine whether MM-001 contains visual elements that incorrectly duplicate
responsibility already owned by the real application UI.

Specifically inspect for:

- English menu labels;
- fake sidebar navigation;
- fake buttons;
- fake selectable controls;
- fake HUD;
- decorative UI panels;
- embedded interface text;
- navigation-like icons;
- Project Genesis title/wordmark;
- other elements that look interactive but are only pixels in the artwork.

Inspect the actual image.

Do not rely only on documentation.

---

# 5. Current MM-001 Contract

Report:

Asset ID:
MM-001

Semantic role:

Current authoritative source:

Source format:

Source dimensions:

Aspect ratio:

Alpha:

Source SHA-256:

Runtime artifacts:

Runtime dimensions:

Runtime SHA-256 hashes:

Registry entry:

Preload:

Sync contract:

Production consumers:

Primary consumer:

---

# 6. Embedded UI Classification

Classify current MM-001 as exactly one:

A —
SCENIC BACKGROUND ONLY

B —
SCENIC BACKGROUND WITH MINOR NON-INTERACTIVE DECORATION

C —
BACKGROUND WITH CLEAR EMBEDDED FAKE/DECORATIVE UI

D —
ARTWORK IS INTENTIONALLY A FULL UI MOCKUP AND CANNOT BE TREATED AS
A SCENIC BACKGROUND

For every detected UI-like element report:

- visible content;
- approximate location;
- readable text;
- whether it resembles a button/navigation/control;
- whether the application independently renders equivalent functionality;
- whether it conflicts visually with MainMenuHome.

Do not judge merely because text is English.

The relevant question is ownership and duplication.

---

# 7. Application UI Ownership

Inspect MainMenuHome and its parent shell.

Determine which real controls the application renders independently.

Report actual repository-backed actions such as:

- Neues Spiel;
- Fortsetzen;
- Spiel laden;
- Einstellungen;
- Credits;
- Beenden;

but include only controls actually present.

For each:

REAL APPLICATION UI:
YES / NO

REPRESENTED OR IMPLIED IN MM-001 ARTWORK:
YES / NO

DUPLICATED VISUAL RESPONSIBILITY:
YES / NO

Determine:

Would removing all fake UI from MM-001 remove any actual functionality?

YES / NO

Would MainMenuHome remain complete and understandable?

YES / NO

---

# 8. BR-001 Ownership

BR-001 now owns product branding in MainMenuHome.

Inspect whether MM-001 contains:

- Project Genesis text;
- a logo;
- a pseudo-logo;
- branding that now duplicates BR-001.

Determine:

Does MM-001 need embedded product branding?

YES / NO

Does MainMenuHome already provide sufficient identity through:

BR-001 + authoritative Project Genesis HTML heading?

YES / NO

Do not change BR-001.

Do not propose baking BR-001 into MM-001.

Preferred architectural direction, if supported by evidence:

MM-001 = scenic environment
BR-001 = brand symbol
MainMenuHome = actual menu/UI

---

# 9. Rendering Geometry

Inspect exactly how MM-001 is rendered.

Report:

Consumer component:

Rendering component/API:

CSS background / img / picture:

object-fit or background-size:

object-position:

container geometry:

overlay:

gradient:

opacity/filter:

z-index relationship:

desktop crop behavior:

narrow crop behavior:

Determine whether MM-001 is intended as:

FULL-BLEED SCENIC BACKGROUND

or:

FIXED UI MOCKUP

This distinction is important.

---

# 10. Desktop Runtime Audit

Run the application.

Inspect MainMenuHome at a representative desktop viewport.

Record exact viewport dimensions.

Check:

- MM-001 visible;
- real MainMenuHome card visible;
- BR-001 visible;
- Project Genesis heading visible;
- real menu actions visible;
- embedded MM-001 UI visible;
- duplicate menu impression;
- competing text;
- misleading fake controls;
- readability;
- visual hierarchy.

Take evidence if the normal Cursor workflow supports it.

Do not modify anything.

Classify:

PASS — NO CLEANUP NEEDED

or

CLEANUP JUSTIFIED

or

AMBIGUOUS

---

# 11. Narrow Runtime Audit

Inspect approximately:

390 × 844

or the repository-standard narrow viewport.

Check:

- MM-001 crop;
- whether embedded UI becomes partially visible;
- whether fake controls are cut off;
- whether embedded text becomes visual noise;
- whether the real MainMenuHome remains readable;
- whether removing fake UI would improve responsive robustness.

Record actual viewport.

Classify:

PASS — NO CLEANUP NEEDED

or

CLEANUP JUSTIFIED

or

AMBIGUOUS

---

# 12. Accessibility / Semantic Assessment

Determine whether MM-001 is treated as decorative.

If the artwork contains readable menu/interface text while the asset is
semantically decorative, record this explicitly.

Assess whether embedded fake UI creates:

- inaccessible duplicate information;
- visual-only pseudo-controls;
- misleading interaction affordances;
- localization inconsistency.

Do not change accessibility code.

---

# 13. Localization Assessment

Inspect readable text baked into MM-001.

Report exact readable strings where possible.

Determine:

Application UI language:

MM-001 embedded UI language:

Does artwork text bypass the application's localization/UI ownership?

YES / NO

Would a scenic-only MM-001 eliminate that inconsistency?

YES / NO

Do not start a localization project.

---

# 14. Existing Source vs Runtime Pipeline

Determine exactly how a future replacement would work.

Report:

Authoritative source path:

Runtime PNG path:

Runtime WebP path:

Other derivatives:

Sync tool path:

Existing transformation:

Quality settings:

Dimensions:

Registry change needed for byte replacement:

YES / NO

Sync-code change needed:

YES / NO

Consumer-code change needed:

YES / NO

Expected preferred outcome:

same MM-001 ID
same paths
same geometry
same registry
same consumer
new scenic artwork bytes only

But confirm from repository evidence.

---

# 15. Determine Correct Cleanup Strategy

Evaluate exactly these options:

OPTION A —
KEEP MM-001 UNCHANGED

Use only if embedded UI is intentional, non-conflicting and architecturally
appropriate.

OPTION B —
CREATE A NEW MENU-FREE MM-001 ARTWORK AND REPLACE THE CURRENT MASTER
IN PLACE

Preferred if MM-001 is fundamentally the correct background asset but its
embedded UI should be removed.

OPTION C —
EDIT THE EXISTING MM-001 ARTWORK TO REMOVE ONLY THE EMBEDDED UI

Use only if the scenic artwork itself should be preserved and clean removal
is technically/artistically realistic.

OPTION D —
MM-001 REQUIRES A BROADER VISUAL ARCHITECTURE DECISION

Use only if repository evidence shows that MM-001 is intentionally a
full-screen UI composition rather than a background.

Recommend exactly one.

---

# 16. Image-Generation Decision

If cleanup is justified, determine whether the better art-production route is:

NEW GENERATION

or

EDIT EXISTING ARTWORK

Consider:

- amount of baked-in UI;
- how much scenery exists behind it;
- likelihood of reconstruction artifacts;
- preservation of current composition;
- existing menu overlay geometry;
- visual continuity with Project Genesis.

Do NOT generate or edit artwork.

Instead provide a concise ART REQUIREMENTS BLOCK for the next image-generation
step.

The block must specify:

- required aspect ratio;
- target source dimensions if repository-backed;
- intended UI-free role;
- required negative-space location;
- major scenic elements worth preserving;
- forbidden UI/text/logo;
- desired composition;
- crop-safe zones;
- desktop/narrow considerations.

Do not invent visual requirements unsupported by the actual consumer geometry.

---

# 17. Replacement Scope If Approved

Define the smallest future implementation path.

Expected form:

1. produce/approve UI-free MM-001 candidate;
2. preserve candidate separately until approved;
3. preprocess deterministically if required;
4. replace authoritative MM-001 source;
5. regenerate only existing runtime derivatives;
6. keep MM-001 ID;
7. keep registry unchanged if possible;
8. keep MainMenuHome architecture unchanged;
9. keep BR-001 unchanged;
10. run focused visual asset/shell tests;
11. verify runtime delivery/hash;
12. validate desktop;
13. validate narrow;
14. update lifecycle documentation;
15. commit/push only after final approval.

This is planning only.

Do not execute it.

---

# 18. Important Distinction

Do not confuse:

MM-006
SplashScreen scenic background

with:

MM-001
MainMenuHome background

They are separate assets and consumers.

The successful MM-006 cleanup is architectural precedent only:

BACKGROUND ART SHOULD NOT OWN APPLICATION MENU CONTROLS.

Do not make MM-001 visually identical to MM-006.

Do not reuse MM-006 unless there is explicit architectural evidence that the
two backgrounds should be the same asset.

---

# 19. Forbidden Scope

Do not modify:

MM-001 source

MM-001 runtime files

MM-006

BR-001

ICON-001

ICON-002

MainMenuHome

SplashScreen

visual registry

sync tooling

CSS

menu actions

navigation

gameplay

domain

API

YAML

package versions

V1 release state

release tags

Do not create derivatives.

Do not commit.

Do not push.

---

# 20. Repository Integrity

Run:

git status --short
git diff --stat
git diff --name-only
git diff --staged
git rev-parse HEAD
git fetch origin
git rev-parse origin/master
git rev-list -n 1 v1.0.0
git rev-list -n 1 v1.0.0-rc.1

Important:

The previous MM-006 report identified the local origin/master reference as
stale.

Therefore fetch before drawing conclusions about remote state.

Record:

Branch:

HEAD:

origin/master after fetch:

HEAD == origin/master:

v1.0.0:

v1.0.0-rc.1:

Tags moved:

NO

Preserve unrelated dirty work.

---

# 21. Audit Report

Create exactly one report:

docs/architecture/reviews/
POST_V1_MM_001_EMBEDDED_UI_CLEANUP_AUDIT.md

Required sections:

## A. Executive Summary

## B. Repository Baseline

## C. Current MM-001 Contract

## D. Embedded UI Classification

## E. Application UI Ownership

## F. BR-001 Ownership

## G. Rendering Geometry

## H. Desktop Runtime Evidence

## I. Narrow Runtime Evidence

## J. Accessibility Assessment

## K. Localization Assessment

## L. Source / Runtime Pipeline

## M. Cleanup Strategy Comparison

## N. Image-Production Recommendation

## O. Art Requirements Block

## P. Proposed Replacement Scope

## Q. Scope Verification

## R. Repository Integrity

## S. Final Recommendation

---

# 22. Final Recommendation

End with exactly one:

OPTION A —
MM-001 — KEEP CURRENT ARTWORK / NO CLEANUP REQUIRED

OPTION B —
MM-001 — MENU-FREE BACKGROUND REPLACEMENT RECOMMENDED

OPTION C —
MM-001 — EXISTING ARTWORK UI-REMOVAL EDIT RECOMMENDED

OPTION D —
MM-001 — VISUAL ARCHITECTURE DECISION REQUIRED

---

# 23. Execution Summary

Return:

# MM-001 — Embedded UI Cleanup Audit
## Execution Summary

### Baseline

- Branch:
- HEAD:
- origin/master after fetch:
- HEAD == origin/master:
- v1.0.0:
- v1.0.0-rc.1:
- tags moved:

### Current MM-001

- semantic role:
- authoritative source:
- dimensions:
- SHA-256:
- runtime assets:
- registry:
- preload:
- consumers:

### Embedded UI

- classification:
- readable strings:
- fake buttons/controls:
- sidebar/navigation:
- product branding:
- duplicate responsibility:

### Application UI Ownership

- real menu owner:
- real actions:
- application menu independent:
- functionality lost if artwork UI removed:

### BR-001

- brand owner:
- heading owner:
- embedded branding required:
- BR-001 change required:

### Rendering Geometry

- method:
- fit/size:
- position:
- desktop crop:
- narrow crop:

### Runtime Evidence

- desktop viewport:
- desktop result:
- narrow viewport:
- narrow result:
- duplicate-menu impression:
- competing text:

### Accessibility / Localization

- decorative asset:
- embedded readable UI:
- language mismatch:
- pseudo-control risk:

### Pipeline

- source:
- derivatives:
- sync:
- registry change required:
- sync-code change required:
- consumer-code change required:

### Cleanup Strategy

- selected option:
- reason:
- image production route:
- new asset ID required:

### Art Requirements

- aspect ratio:
- target dimensions:
- negative-space zone:
- preserve:
- remove:
- forbidden:
- crop considerations:

### Future Implementation Scope

- source replacement:
- runtime regeneration:
- registry:
- consumer:
- BR-001:
- validation:
- lifecycle:

### Repository Integrity

- files modified by audit:
- implementation files modified:
- commit:
- push:
- tags moved:

### Final Recommendation

OPTION A / B / C / D

STOP.

---

# CORE RULE

MM-001 IS THE SUBJECT.

MM-006 IS ALREADY CLOSED.

DO NOT MODIFY ARTWORK YET.

FIRST PROVE WHETHER MM-001'S EMBEDDED ENGLISH UI DUPLICATES THE REAL
APPLICATION MENU.

VERIFY THE ACTUAL IMAGE.

VERIFY DESKTOP AND NARROW RUNTIME.

VERIFY MAINMENUHOME OWNS THE REAL CONTROLS.

VERIFY BR-001 OWNS BRAND IDENTITY.

THEN DECIDE WHETHER MM-001 SHOULD BECOME A CLEAN SCENIC BACKGROUND.

IF CLEANUP IS JUSTIFIED, RETURN THE ART REQUIREMENTS NEEDED FOR THE NEXT
IMAGE-GENERATION STEP.

DO NOT IMPLEMENT.

REPORT.

STOP.