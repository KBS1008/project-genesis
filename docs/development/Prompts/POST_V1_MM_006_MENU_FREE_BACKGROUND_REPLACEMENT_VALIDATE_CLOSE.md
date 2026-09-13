# Cursor Implementation & Closeout Prompt
# Project Genesis — Post-V1 Visual Production

## MM-006 — Menu-Free Background Replacement, Validate & Close

MODE:
CONSOLIDATED IMPLEMENT / VALIDATE / CLOSE-CANDIDATE PASS

THIS IS NOT A NEW VISUAL FEATURE.

THIS TASK REPLACES THE EXISTING MM-006 SCENIC BACKGROUND
WITH THE APPROVED MENU-FREE CANDIDATE WHILE PRESERVING
THE APPLICATION-OWNED MENU ARCHITECTURE.

DO NOT CREATE A CHAIN OF MICRO-DELTAS.

Small, obvious, task-local issues discovered during execution
may be fixed directly.

STOP only for a real blocker:

- candidate artwork missing;
- candidate artwork materially violates the approved visual contract;
- existing MM-006 architecture differs materially from the audit;
- replacement would require a new asset architecture;
- application functionality depends on menu content baked into the old image;
- unexpected cross-scope regression;
- sealed unrelated asset integrity failure;
- requirement conflict;
- material scope expansion.

Otherwise:

IMPLEMENT.
VALIDATE.
RUN THE APPLICATION.
CHECK DESKTOP.
CHECK NARROW.
CHECK MENU OWNERSHIP.
CHECK ASSET DELIVERY.
UPDATE LIFECYCLE DOCUMENTATION.
CREATE ONE CLOSE-CANDIDATE REPORT.
STOP.

---

# 1. Authority

Read first:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Read the completed audit:

docs/architecture/reviews/
POST_V1_MM_006_MENU_FREE_BACKGROUND_REPLACEMENT_AUDIT.md

Also inspect authoritative MM-006 lifecycle/history documentation
identified by that audit.

Use the AUDIT as the primary implementation basis.

Do not repeat the complete audit unless repository state has materially changed.

---

# 2. Objective

Replace the existing MM-006 scenic splash/start background with the
approved menu-free candidate.

Candidate working name is expected to be:

MM-006_Splash_Background_NoUI.png

Use the actual path established by the audit.

The resulting production artwork must contain:

- industrial/scenic environment;
- no embedded interactive menu;
- no fake menu buttons;
- no menu labels;
- no "New Game";
- no "Continue";
- no "Load Game";
- no "Settings";
- no "Exit";
- no fake HUD;
- no UI panels;
- no selectable-looking controls;
- no duplicated application menu.

The real application UI remains authoritative.

---

# 3. Architectural Boundary

The ownership model after this task must be:

MM-006
=
SCENIC START / SPLASH BACKGROUND

APPLICATION UI
=
INTERACTIVE MENU

BR-001
=
PRODUCT / BRAND IDENTITY

These responsibilities must remain separate.

Do not bake application UI into MM-006.

Do not bake BR-001 into MM-006.

Do not use MM-006 as a replacement for BR-001.

Do not redesign the real menu.

---

# 4. Audit Gate

Before modifying anything, verify that the audit recommendation is compatible
with controlled implementation.

Expected acceptable audit outcomes:

OPTION A —
READY FOR CONTROLLED IMPLEMENTATION

or:

OPTION B —
READY AFTER SMALL ART/GEOMETRY DELTA

ONLY if the required delta can be performed deterministically without
redesigning the artwork.

If the audit concluded:

OPTION C
or
OPTION D

STOP.

Do not override the audit.

Report:

MM-006 MENU-FREE BACKGROUND REPLACEMENT —
BLOCKED BY AUDIT DECISION

---

# 5. Candidate Integrity

Locate the exact candidate established by the audit.

Record before modification:

- path;
- filename;
- format;
- dimensions;
- aspect ratio;
- color mode;
- alpha;
- file size;
- SHA-256.

Inspect the actual candidate.

Confirm:

- no embedded menu;
- no fake buttons;
- no menu text;
- no unwanted logo/title;
- no watermark;
- no obvious image-generation UI artifacts;
- no accidental readable pseudo-text;
- suitable negative space for the actual application UI.

If there is a material violation:

STOP.

Do not attempt an artistic redesign in Cursor.

Report:

BLOCKED —
CANDIDATE ARTWORK REQUIRES VISUAL REGENERATION

---

# 6. Preserve Existing Asset Contract

Default preference:

KEEP ASSET ID:

MM-006

Do not create:

MM-006B
MM-006-V2
MM-008
BR-xxx
or another production asset ID

solely because the image content changed.

This is a replacement of the existing scenic background,
not a new semantic asset.

Follow the source replacement strategy established by the audit.

---

# 7. Old Source Handling

Use the repository convention established by the audit.

If Git history is sufficient and the project normally replaces masters in place:

replace the authoritative MM-006 source in place.

Do not create redundant archive copies.

If the repository has an established visual archive convention that the audit
explicitly determined applies here:

archive the superseded source accordingly.

Do not invent a new archive structure.

Do not delete unrelated artwork.

---

# 8. Source Installation

Install the approved menu-free candidate as the authoritative MM-006 source.

Preserve the source path expected by the current visual asset contract whenever
the audit determined that an in-place replacement is correct.

If deterministic preprocessing is required by the audit:

allowed operations are limited to:

- deterministic resize;
- deterministic crop;
- deterministic format conversion;
- deterministic alpha/color-mode normalization.

Do not:

- repaint;
- generatively extend;
- generatively remove objects;
- add new scenery;
- add branding;
- add text;
- modify the art direction.

If artistic modification is required:

STOP.

---

# 9. Runtime Derivatives

Regenerate ONLY the runtime derivatives required by the existing MM-006
runtime contract established in the audit.

Do not copy derivative rules from ICON-001, ICON-002, or BR-001 unless MM-006
actually uses the same infrastructure.

Use the existing MM-006 sync/certification mechanism.

Do not create speculative:

- extra resolutions;
- thumbnails;
- 16/32 favicon-like variants;
- mobile-specific artwork;
- additional WebP variants;
- AVIF;
- SVG conversions;

unless they already belong to the established MM-006 contract.

Record for every resulting production asset:

- path;
- format;
- dimensions;
- SHA-256.

---

# 10. Sync Tool

Use existing sync tooling if the audit established that it already supports
MM-006.

Expected preferred outcome:

NO SYNC TOOL CODE CHANGE

If replacement merely changes source bytes, keep sync architecture unchanged.

If a tiny deterministic configuration/path update is genuinely required and
the audit explicitly anticipated it:

make the smallest task-local change.

If a material sync architecture redesign is required:

STOP.

---

# 11. Registry

Preserve the existing MM-006 registry contract whenever possible.

Expected preferred outcome:

ASSET ID:
MM-006

PATH CONTRACT:
UNCHANGED

CONSUMER:
UNCHANGED

PRELOAD:
UNCHANGED

Only modify registry metadata if the new certified asset genuinely requires
an existing metadata field to change.

Do not redesign the registry.

Do not add aliases.

Do not point MM-006 at BR-001.

---

# 12. Splash / Start Consumer

Keep the existing production consumer architecture.

The application should continue loading MM-006 through the existing asset
infrastructure.

Do not introduce a one-off replacement component.

Do not redesign SplashScreen/MainMenu merely because the background changed.

The intended implementation should primarily be an ASSET replacement,
not a UI rewrite.

---

# 13. Application Menu Ownership

Verify after replacement that the actual interactive menu is still rendered
independently by the application.

Check all actions that actually exist in the current implementation.

Do not invent menu entries.

Verify that:

- menu controls remain visible;
- menu controls remain clickable/usable;
- removing the baked-in menu loses no functionality;
- no menu label exists only inside the old image;
- navigation behavior remains unchanged.

If a required action disappears because it existed only in the artwork:

STOP.

That is an architecture discrepancy.

Do not recreate it inside the image.

---

# 14. BR-001 Separation

BR-001 Phase 1 is already closed.

Do not reopen it.

Do not modify:

- BR-001 source;
- BR-001 runtime SVG;
- BR-001 favicon derivatives;
- BR-001 registry entry;
- BR-001 sync contract;
- MainMenuHome BR-001 integration.

The new MM-006 background must not require BR-001 artwork baked into it.

If product identity is already supplied by application UI / BR-001,
leave that architecture unchanged.

---

# 15. Accessibility

MM-006 should remain scenic/decorative unless repository evidence says otherwise.

Verify that removing baked-in menu content does not remove accessibility-relevant
information.

The real application menu must remain the semantic source for interactive
actions.

Do not add alt text describing fake menu functionality.

Do not duplicate menu labels for screen readers through the background image.

Small task-local accessibility corrections are allowed only if the replacement
exposes a concrete existing inconsistency.

Do not broaden accessibility scope.

---

# 16. Focused Tests

Run the existing tests identified by the audit for:

- MM-006 asset registry;
- runtime asset certification/sync;
- SplashScreen/start screen;
- menu ownership;
- relevant shell/menu rendering;
- visual asset infrastructure.

Also run any test directly affected by changed hashes or fixture paths.

If an expected snapshot becomes stale solely because MM-006 source/runtime
metadata changed:

1. run normally first;
2. inspect the diff;
3. confirm it is MM-006-only;
4. update the snapshot/fixture;
5. rerun;
6. require PASS.

Do not stop and request another prompt for an obvious task-local fixture update.

Do not weaken assertions to obtain green tests.

---

# 17. Web Validation

Inspect package scripts and run the normal relevant web validation commands.

At minimum, where supported:

- focused tests;
- web typecheck;
- web build.

If root validation is normally required by repository policy, run it and classify
results accurately.

Historical unrelated project debt must not automatically block MM-006.

The previously known environmental build issue involving:

apps/web/.next/trace

may be classified as ENVIRONMENTAL only if the failure is materially the same.

Do not classify a new MM-006-related build error as historical debt.

No task-introduced validation failure may remain for READY TO CLOSE.

---

# 18. Start the Application

Run the application using the normal repository development workflow.

Do not rely only on static code inspection.

Use the real rendered application.

Verify the start/menu experience with the new MM-006.

---

# 19. Desktop Runtime Validation

Use a representative desktop viewport.

Prefer approximately:

1280×800

or another normal desktop viewport if tooling differs.

Record the actual viewport.

Verify:

- new menu-free MM-006 visible;
- no old baked-in menu remains visible;
- actual application menu visible;
- application menu is visually distinguishable;
- no duplicate menu;
- no broken image;
- no unexpected blank background;
- no severe crop;
- no important candidate focal point hidden in a damaging way;
- actual menu remains readable;
- no menu/background collision that materially harms readability;
- no new horizontal overflow;
- no clipping;
- no unexpected stretching;
- no distorted aspect ratio;
- existing navigation/actions remain intact.

Also check that BR-001/product identity remains correct where already implemented.

Classify:

PASS

PASS WITH SMALL TASK-LOCAL FIX

FAIL

If a tiny existing CSS positioning adjustment is genuinely required because
the new image exposes a crop/readability issue, it may be fixed directly ONLY
if it does not redesign the menu.

Keep such changes minimal and document them.

---

# 20. Narrow Runtime Validation

Use a representative narrow viewport.

Prefer:

390×844

or equivalent.

Record actual viewport.

Verify:

- MM-006 renders correctly;
- no embedded menu;
- real menu remains visible;
- no duplicate controls;
- no horizontal overflow;
- no severe image distortion;
- crop remains acceptable;
- important UI remains readable;
- menu actions remain usable;
- no background focal element makes text unreadable;
- no unintended clipping;
- no regression to BR-001/MainMenuHome.

Do not create a separate mobile artwork unless the existing MM-006 contract
already requires one.

---

# 21. Visual Comparison

Compare the old and new start experience only for the architectural objective.

Do not reopen general art direction.

Required question:

HAS THE DUPLICATED MENU RESPONSIBILITY BEEN REMOVED?

Expected:

YES

Confirm:

OLD:
background artwork contained menu/UI-like information
+
application rendered real menu

NEW:
background contains scenery only
+
application renders real menu

That is the primary success criterion.

---

# 22. Asset Request / Delivery Verification

Verify the actual runtime MM-006 request.

Confirm:

- expected runtime URL/path;
- HTTP success;
- correct new asset delivered;
- no old cached source accidentally being evaluated;
- no 404;
- no fallback to unrelated artwork.

If necessary, use cache-busting/dev reload only for validation.

Do not change production URL merely to defeat local cache.

---

# 23. Hash Certification

After all asset generation/sync work is complete, calculate SHA-256 for:

- authoritative new MM-006 source;
- every production-active MM-006 runtime derivative.

Record exact hashes.

These hashes become the new MM-006 certified byte identity.

Do NOT change unrelated sealed hashes.

If the source is copied byte-identically to a runtime location,
explicitly record that relationship.

---

# 24. Coverage Review

Perform the MM-006 replacement coverage review in THIS SAME PASS.

Do not create a later coverage micro-slice.

Review actual MM-006 consumers.

Classify each as:

REQUIRED / IMPLEMENTED

OPTIONAL / DEFERRED

OUT OF SCOPE

The question is:

Does replacing MM-006 in the existing start/splash consumer fully satisfy the
menu-free background objective?

Do NOT use this review to proliferate the new background across the application.

Likely intended outcome:

existing start/splash consumer:
REQUIRED / IMPLEMENTED

other screens:
OUT OF SCOPE

But use repository evidence.

---

# 25. Must-Have Gap Assessment

Explicitly answer:

ADDITIONAL MM-006 MUST-HAVE CONSUMER GAP:

YES / NO

A "would look nice" location is not a MUST-HAVE.

A second use of the artwork is not required merely because it exists.

If no functional or architectural requirement exists:

NO

Do not manufacture another implementation slice.

---

# 26. Lifecycle Closeout

If all of the following are true:

- candidate successfully installed;
- required runtime derivatives certified;
- focused tests pass;
- no task-introduced validation failure remains;
- desktop runtime passes;
- narrow runtime passes;
- actual application menu remains functional;
- duplicated baked-in menu is gone;
- no MUST-HAVE coverage gap exists;

then close MM-006 replacement lifecycle in THIS SAME PASS.

Update only existing authoritative lifecycle documents.

Likely documents include:

docs/design/VISUAL_ASSET_CATALOG.md

docs/design/VISUAL_PRODUCTION_BACKLOG.md

docs/design/VISUAL_ASSET_CHANGELOG.md

Use actual repository paths.

Do not create duplicate lifecycle systems.

---

# 27. Lifecycle Documentation Content

Record concisely:

MM-006 remains the scenic splash/start background.

Previous artwork:
superseded because it contained baked-in menu/UI content while the application
already owns the real interactive menu.

New certified artwork:
menu-free scenic background.

Record:

- authoritative source path;
- source SHA-256;
- runtime path(s);
- runtime SHA-256;
- dimensions/formats;
- consumer;
- replacement date;
- validation status.

Record architectural ownership:

MM-006:
scenery/background

Application:
interactive menu

BR-001:
product branding

Mark replacement:

CLOSED / PASS

if all gates pass.

---

# 28. Old Asset Documentation

Do not describe the old artwork as invalid gameplay content.

It is simply superseded visual production material.

If the old source is retained in an established archive:

document its archived/superseded status briefly.

If Git history is the only preservation mechanism:

do not create an archive solely for documentation convenience.

---

# 29. Scope Verification

Before final decision, inspect:

git status --short
git diff --stat
git diff --name-only
git diff --staged

Classify every changed file.

Allowed scope:

- authoritative MM-006 source;
- existing MM-006 runtime derivatives;
- minimal MM-006 sync metadata/config if genuinely required;
- minimal registry metadata if genuinely required;
- directly affected tests/fixtures;
- tiny task-local Splash/menu CSS adjustment only if runtime validation proved necessary;
- MM-006 lifecycle documentation;
- MM-006 close-candidate report.

Forbidden:

- BR-001 modifications;
- ICON-001;
- ICON-002;
- MM-001;
- MM-007;
- unrelated visual assets;
- gameplay;
- domain;
- API;
- YAML gameplay configuration;
- package versions;
- V1 release files;
- release tags;
- unrelated UI redesign.

Preserve unrelated dirty work.

---

# 30. Release Integrity

Verify:

git rev-list -n 1 v1.0.0

must remain:

c4bb643df6fda7792906f34fbbb20ff07e9bfeef

Verify:

git rev-list -n 1 v1.0.0-rc.1

must remain:

442665cd6437bdebff88fd1540cedc689238c240

Tags moved:

NO

Do not create a new release.

Do not move V1 tags.

This is post-V1 visual maintenance.

---

# 31. Commit / Push Policy

DEFAULT:

DO NOT COMMIT.
DO NOT PUSH.
DO NOT TAG.

This pass produces the reviewed close candidate first.

Repository commit/push closeout can happen only after external review.

Do not push merely because validation passes.

---

# 32. Report Strategy

Do NOT create separate reports for:

- replacement;
- derivative generation;
- tests;
- desktop QA;
- narrow QA;
- coverage;
- lifecycle closeout.

Create ONE final report:

docs/architecture/reviews/
POST_V1_MM_006_MENU_FREE_BACKGROUND_REPLACEMENT_CLOSE_CANDIDATE_REPORT.md

This report is the authoritative result of this consolidated pass.

---

# 33. Required Report Structure

# MM-006 — Menu-Free Background Replacement Close Candidate

## A. Executive Summary

State:

- replacement outcome;
- validation outcome;
- final recommendation.

## B. Repository Baseline

Record:

- branch;
- HEAD;
- origin/master;
- v1.0.0;
- v1.0.0-rc.1;
- tags moved.

## C. Audit Decision Applied

Record:

- prior audit option;
- source strategy;
- runtime strategy;
- registry strategy.

## D. Candidate Before Installation

Record:

- original candidate path;
- dimensions;
- format;
- SHA-256;
- visual suitability.

## E. Source Replacement

Record:

- previous authoritative source;
- handling of old source;
- new authoritative source;
- preprocessing if any;
- new source SHA-256.

## F. Runtime Certification

Use a matrix:

| Artifact | Format | Dimensions | SHA-256 | Result |

## G. Registry / Sync

Record:

- registry changed YES/NO;
- sync code changed YES/NO;
- asset ID remains MM-006 YES/NO;
- preload status.

## H. Application Menu Ownership

Record:

- background consumer;
- real menu owner;
- menu actions independently rendered;
- baked-in menu removed;
- functionality lost YES/NO.

## I. Focused Test Matrix

Include:

- MM-006 tests;
- visual asset tests;
- Splash/start/menu tests;
- affected shell tests;
- web typecheck;
- web build;
- any root validation required.

Distinguish:

PASS

PRE-EXISTING FAIL

ENVIRONMENT BLOCKED

TASK FAILURE

accurately.

## J. Desktop Runtime Evidence

Record:

- viewport;
- URL;
- background;
- actual menu;
- duplicate menu;
- crop;
- readability;
- actions;
- result.

## K. Narrow Runtime Evidence

Same structure.

## L. Runtime Asset Delivery

Record:

- runtime path/URL;
- HTTP result;
- new asset confirmed;
- 404;
- fallback.

## M. Architectural Separation

Explicitly record:

MM-006 = scenic background

Application UI = interactive menu

BR-001 = product branding

Result:

PASS / FAIL

## N. Coverage Review

Use a concise matrix:

| Potential consumer | Classification | Reason |

## O. Must-Have Gap Assessment

Additional MUST-HAVE gap:

YES / NO

## P. Lifecycle Closeout

Record:

- catalog updated;
- backlog updated;
- changelog updated;
- MM-006 replacement marked CLOSED/PASS;
- certified hashes documented.

## Q. Scope Verification

List task-owned changed files.

Confirm forbidden areas untouched.

## R. Repository Integrity

Record:

- HEAD;
- origin/master;
- tags;
- commit;
- push;
- unrelated dirty work preserved.

## S. Final Decision

Use one of the allowed options below.

---

# 34. Final Decision

Choose exactly one:

OPTION A —
MM-006 MENU-FREE BACKGROUND REPLACEMENT —
READY TO CLOSE / PASS CANDIDATE

Use only if:

- new artwork is installed;
- baked-in menu is removed;
- real application menu remains functional;
- source/runtime contract is valid;
- required hashes certified;
- focused tests pass;
- no task-introduced validation failure remains;
- desktop runtime passes;
- narrow runtime passes;
- runtime asset request succeeds;
- architecture separation passes;
- no MUST-HAVE coverage gap exists;
- lifecycle docs are updated;
- scope is clean.

OPTION B —
MM-006 MENU-FREE BACKGROUND REPLACEMENT —
IMPLEMENTATION COMPLETE / ENVIRONMENT-LIMITED CLOSE CANDIDATE

Use only if:

- implementation is otherwise fully correct;
- a genuine environment limitation prevents one non-functional validation step;
- no implementation uncertainty remains.

Do not use OPTION B merely to avoid fixing a task-local problem.

OPTION C —
MM-006 MENU-FREE BACKGROUND REPLACEMENT —
BLOCKED / REAL INTEGRATION OR COVERAGE ISSUE

Use for:

- real menu dependency on old baked-in content;
- material crop/readability issue requiring design decision;
- architecture conflict;
- real MUST-HAVE gap.

OPTION D —
MM-006 MENU-FREE BACKGROUND REPLACEMENT —
FAIL / ASSET OR SCOPE INTEGRITY VIOLATION

Use for:

- wrong candidate;
- corrupted source/runtime;
- forbidden asset modification;
- release/tag violation;
- unrelated scope contamination.

---

# 35. Execution Summary

Return exactly:

# MM-006 — Menu-Free Background Replacement, Validate & Close
## Execution Summary

### Baseline

- Branch:
- HEAD:
- origin/master:
- v1.0.0:
- v1.0.0-rc.1:
- tags moved:

### Audit

- audit decision:
- implementation permitted:
- material deviation from audit:

### Candidate

- source candidate:
- dimensions:
- format:
- initial SHA-256:
- menu-free:
- visual suitability:

### Source Replacement

- authoritative MM-006 source:
- old source handling:
- preprocessing:
- final dimensions:
- final SHA-256:
- result:

### Runtime Certification

- runtime assets:
- dimensions:
- hashes:
- sync code changed:
- registry changed:
- asset ID:
- result:

### Menu Ownership

- background owner:
- interactive menu owner:
- baked-in menu removed:
- real menu intact:
- functionality lost:
- result:

### Tests

- focused MM-006:
- visual asset:
- Splash/menu:
- shell:
- web typecheck:
- web build:
- task-introduced failures:

### Desktop Runtime

- viewport:
- new background:
- real menu:
- duplicate menu:
- crop:
- readability:
- actions:
- result:

### Narrow Runtime

- viewport:
- new background:
- real menu:
- duplicate menu:
- overflow:
- crop:
- readability:
- actions:
- result:

### Runtime Delivery

- URL/path:
- HTTP:
- new asset confirmed:
- fallback:
- result:

### Architectural Separation

- MM-006 scenic only:
- application owns menu:
- BR-001 remains separate:
- result:

### Coverage

- required consumer:
- implemented:
- additional MUST-HAVE gap:

### Lifecycle Closeout

- catalog:
- backlog:
- changelog:
- hashes documented:
- replacement CLOSED/PASS:

### Scope

- task-owned files:
- BR-001 modified:
- unrelated visual assets modified:
- gameplay/domain/API/YAML modified:
- release state modified:

### Repository Integrity

- final HEAD:
- origin/master:
- commit:
- push:
- v1.0.0:
- v1.0.0-rc.1:
- tags moved:

### Final Decision

OPTION A / OPTION B / OPTION C / OPTION D

STOP.

---

# CORE RULE

THIS TASK REMOVES DUPLICATED MENU RESPONSIBILITY.

THE IMAGE PROVIDES THE WORLD.

THE APPLICATION PROVIDES THE MENU.

BR-001 PROVIDES PRODUCT BRANDING.

KEEP MM-006 AS MM-006.

DO NOT INVENT A NEW ASSET FAMILY.

DO NOT REDESIGN THE MENU.

DO NOT EXPAND TO OTHER SCREENS.

USE THE EXISTING MM-006 PIPELINE.

FIX SMALL TASK-LOCAL VALIDATION ISSUES DIRECTLY.

DO NOT CREATE ANOTHER MICRO-DELTA LOOP.

VALIDATE THE ACTUAL RUNNING APPLICATION ON DESKTOP AND NARROW.

CERTIFY THE NEW MM-006 HASHES.

CLOSE LIFECYCLE DOCUMENTATION IN THE SAME PASS IF CLEAN.

DO NOT COMMIT.
DO NOT PUSH.
DO NOT TAG.

RETURN ONE CLOSE CANDIDATE.

STOP.