# Cursor Implementation Prompt
# Project Genesis — Post-V1 Visual Production

## MM-001 — Menu-Free Background Replace, Validate & Close Candidate

MODE:
CONSOLIDATED IMPLEMENT / VALIDATE / CLOSE-CANDIDATE

This is intentionally a consolidated finish task.

Resolve obvious task-local mechanical issues directly.

Do NOT stop for trivial:
- filename differences;
- deterministic resize requirement;
- stale task-owned snapshots;
- expected derivative regeneration;
- task-owned lifecycle documentation updates.

STOP only for:
- candidate visual contract failure;
- unexpected architecture ambiguity;
- sealed unrelated asset modification;
- requirement conflict;
- material scope expansion;
- destructive repository-state ambiguity.

NO COMMIT.
NO PUSH.
NO TAG.

---

# 1. Authority

Read:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Read:

docs/architecture/reviews/
POST_V1_MM_001_EMBEDDED_UI_CLEANUP_AUDIT.md

The audit decision is authoritative for this task:

OPTION B —
MM-001 — MENU-FREE BACKGROUND REPLACEMENT RECOMMENDED

Also respect the already sealed boundaries:

MM-006 — CLOSED / PASS, SEALED
BR-001 Phase 1 — CLOSED / PASS, SEALED
ICON-001 — SEALED
ICON-002 — SEALED

Do not reopen them.

---

# 2. Candidate

Locate the newly generated MM-001 menu-free candidate.

Expected working name:

MM-001_Main_Menu_Background_NoUI.png

Do not assume the exact directory if the actual file differs.

Search relevant design/mockup locations.

There must be exactly one clearly intended new candidate.

If multiple plausible candidates exist and repository evidence cannot
determine which one is intended:

STOP.

If no candidate exists:

STOP.

Do not generate artwork.

---

# 3. Candidate Certification Before Replacement

Inspect the actual candidate visually and technically.

Required visual contract:

- scenic background only;
- industrial/economic landscape;
- no embedded application UI;
- no sidebar;
- no fake buttons;
- no HUD;
- no news panel;
- no top utility bar;
- no social controls;
- no notification badges;
- no version footer;
- no readable menu text;
- no Project Genesis wordmark;
- no Project Genesis logo;
- no BR-001;
- no watermark;
- no obvious generated pseudo-UI;
- center suitable for real MainMenuHome card;
- crop-safe enough for existing desktop/narrow behavior.

Technical target:

1536 × 1024
3:2
PNG authoritative master

Record candidate:

- exact path;
- original dimensions;
- aspect ratio;
- format;
- color mode;
- alpha;
- file size;
- SHA-256.

Classify visual suitability:

PASS

or

FAIL

If FAIL:

STOP.

Do not install unsuitable artwork.

---

# 4. Deterministic Preprocessing

If candidate is already exactly:

1536 × 1024

do not resize unnecessarily.

If dimensions/aspect differ:

perform deterministic preprocessing to:

1536 × 1024

using:

fit: cover
position: centre

Use the established repository/Sharp approach consistent with MM-006.

Do not stretch.

Do not add borders.

Do not perform creative image editing.

Do not sharpen, recolor, repaint or otherwise alter the artwork beyond
the required deterministic geometry normalization.

Record whether preprocessing occurred.

Record final SHA-256.

---

# 5. Authoritative Source Replacement

Current authoritative MM-001 source:

docs/design/Bilder/einzelne_bilder/hochgeladen/
MM-001_Main_Menu_Final.png

Replace this source in place with the approved normalized candidate.

Git history preserves the previous artwork.

Do not create a new asset ID.

MM-001 remains MM-001.

If an established MM-001 mockup mirror exists and is expected to mirror
the authoritative source, update it consistently.

Do not invent additional archive copies unless repository policy requires one.

---

# 6. Runtime Regeneration

Use the existing MM-001 runtime contract.

Expected:

authoritative source
→ runtime PNG
→ runtime WebP quality 82

Expected runtime paths:

apps/web/public/assets/main-menu/MM-001.png

apps/web/public/assets/main-menu/MM-001.webp

Use the existing sync tooling where possible.

Expected:

PNG byte-identical to authoritative source.

Do not add new resolutions.

Do not add new formats.

Do not modify sync source code unless existing repository behavior proves
that the current contract cannot regenerate MM-001.

If full sync is blocked by an unrelated environmental filesystem error,
it is acceptable to execute the exact existing MM-001 transformation logic
for this asset only, as was done for MM-006.

Document that clearly.

---

# 7. Registry

Expected:

NO REGISTRY CHANGE.

Preserve:

asset ID:
MM-001

consumer:
MainMenuScreen

preload:
true

priority:
critical

existing paths.

The registry already states that MM-001 is a decorative background and UI
text is rendered in React.

The new artwork should make the bytes conform to that existing contract.

If no registry change is required:

do not touch registry files.

---

# 8. Consumer Architecture

Do NOT redesign MainMenuHome.

Do NOT redesign MainMenuScreen.

Do NOT change:

PGVisualAssetBackground

background-size

background-position

overlay

z-index

menu layout

button layout

navigation

BR-001 placement

heading

footer

The intended architecture remains:

MM-001
=
scenic decorative background

BR-001
=
product brand mark

MainMenuHome
=
real application UI

---

# 9. Explicit Removal Goal

After replacement the MM-001 pixels must no longer contain the old fake UI,
including the previous examples:

PROJECT GENESIS

BUILD · MANAGE · PROSPER

NEW GAME

LOAD GAME

COMPANIES

TUTORIALS

SETTINGS

CREDITS

EXIT GAME

Language

Notifications

Profile

LATEST NEWS

READ MORE

v0.1.0 Alpha

social icons

fake navigation rows

fake top-bar controls

fake news widgets

Do not attempt to reproduce any of these in the new background.

---

# 10. Focused Tests

Run relevant task-owned/focused tests.

At minimum inspect/run the appropriate existing suites covering:

- visual asset loader;
- visual asset registry;
- MainMenuHome;
- MainMenuScreen/shell;
- relevant shell snapshots/structural tests;
- BR-001 isolation/integration where applicable.

Do not create tests merely to assert image aesthetics.

Tests should verify architecture and asset contract.

If an existing task-owned snapshot becomes stale solely because the expected
asset representation changed, update/prune it directly if justified.

Do not stop for a trivial task-local snapshot delta.

Report exact test counts/results.

---

# 11. Typecheck / Build

Run:

pnpm --filter @project-genesis/web typecheck

and:

pnpm --filter @project-genesis/web build

Classify failures carefully:

PASS

TASK-INTRODUCED FAIL

PRE-EXISTING FAIL

ENVIRONMENT BLOCKED

Known historical failures must not automatically block MM-001.

However:

If this MM-001 task introduces a new failure:

fix it if clearly task-local.

If material/nonlocal:

STOP.

---

# 12. Runtime Asset Delivery

Run the application sufficiently to validate runtime delivery.

Verify:

/assets/main-menu/MM-001.png

returns:

HTTP 200

Fetch/inspect the delivered bytes where possible.

Confirm SHA-256 equals the certified runtime PNG/source hash.

Verify WebP availability if the application uses image-set/WebP.

No 404.

No stale old artwork.

No unexpected fallback.

---

# 13. Desktop Runtime Validation

Use approximately:

1280 × 800

or another representative desktop viewport.

Validate the actual home phase.

Required:

- new MM-001 visible;
- scenic-only background;
- old English sidebar absent;
- old top utility bar absent;
- old news panel absent;
- old social icons absent;
- old baked product branding absent;
- BR-001 still visible through React;
- Project Genesis HTML heading still visible;
- six real menu actions still present;
- menu readable;
- no duplicate-menu impression;
- no misleading fake controls;
- no clipping;
- no broken image;
- composition acceptable under existing `cover`;
- center menu card has sufficient visual separation.

Do not redesign CSS merely because another composition might be preferable.

Only fix a consumer issue if the new candidate exposes a genuine functional
or severe readability regression.

---

# 14. Narrow Runtime Validation

Use:

390 × 844

or repository-equivalent narrow viewport.

Validate:

- existing `center top` crop;
- scenic background remains coherent;
- no fake UI fragments;
- real menu remains readable;
- buttons usable;
- BR-001/heading intact;
- no horizontal overflow;
- no critical composition failure;
- no broken image.

Again:

do not redesign responsive layout unless there is a genuine blocker.

---

# 15. Accessibility / Localization Validation

Confirm:

MM-001 remains decorative.

Existing aria behavior remains correct.

There is no readable embedded UI copy in the new artwork.

The authoritative application menu remains German/current application copy.

The background no longer bypasses UI/localization ownership.

No accessibility code change should normally be required.

---

# 16. BR-001 Isolation

Verify:

BR-001 files unchanged.

BR-001 hashes unchanged where certification exists.

MainMenuHome still renders BR-001 normally.

Do not bake BR-001 into MM-001.

Do not change favicon behavior.

---

# 17. MM-006 Isolation

Verify:

MM-006 source unchanged.

MM-006 runtime PNG/WebP unchanged.

MM-006 certified hashes unchanged.

Do not modify SplashScreen.

MM-006 remains:

CLOSED / PASS, SEALED.

---

# 18. Coverage Review

Determine whether the replacement creates any new required MM-001 consumer.

Expected:

MainMenuScreen / MainMenuHome background
=
REQUIRED / IMPLEMENTED

Other consumers
=
not required unless repository evidence proves otherwise.

Do not create additional consumers merely for visual consistency.

Report:

ADDITIONAL MM-001 MUST-HAVE CONSUMER GAP:

YES / NO

Expected:

NO

---

# 19. Lifecycle Closeout

If implementation and validation PASS, update the existing lifecycle documents:

docs/design/VISUAL_ASSET_CATALOG.md

docs/design/VISUAL_PRODUCTION_BACKLOG.md

docs/design/VISUAL_ASSET_CHANGELOG.md

Record:

- MM-001 menu-free scenic replacement;
- date;
- authoritative source;
- final dimensions;
- certified source/runtime hashes;
- runtime WebP hash;
- consumer unchanged;
- registry unchanged;
- sync contract unchanged;
- embedded fake UI removed;
- MainMenuHome owns actual UI;
- BR-001 remains separate;
- desktop PASS;
- narrow PASS;
- replacement CLOSED / PASS.

Do not rewrite unrelated lifecycle history.

---

# 20. Scope Verification

Expected task-owned implementation areas are limited to:

MM-001 authoritative source

MM-001 existing mirror if required

MM-001 runtime PNG

MM-001 runtime WebP

task-owned tests/snapshots only if genuinely affected

VISUAL_ASSET_CATALOG.md

VISUAL_PRODUCTION_BACKLOG.md

VISUAL_ASSET_CHANGELOG.md

this close-candidate report

Do not treat this list as blanket staging permission.

Preserve unrelated dirty work.

Forbidden:

BR-001 changes

MM-006 changes

ICON changes

registry changes unless proven necessary

sync-code changes unless proven necessary

MainMenuHome redesign

MainMenuScreen redesign

gameplay/domain/API/YAML changes

package-version changes

release changes

tag changes

---

# 21. Repository Integrity

Run:

git status --short
git diff --stat
git diff --name-only
git diff --staged
git rev-parse HEAD
git rev-parse origin/master
git rev-list -n 1 v1.0.0
git rev-list -n 1 v1.0.0-rc.1

Attempt:

git fetch origin

If environment blocks fetch with EPERM:

report it accurately.

Do not fabricate remote state.

Record separately:

HEAD

local origin/master ref

whether fetch succeeded

actual remote comparison if available

v1.0.0

v1.0.0-rc.1

tags moved:
NO

NO COMMIT.

NO PUSH.

---

# 22. Close Candidate Report

Create:

docs/architecture/reviews/
POST_V1_MM_001_MENU_FREE_BACKGROUND_REPLACEMENT_CLOSE_CANDIDATE_REPORT.md

Required sections:

## A. Executive Summary

## B. Repository Baseline

## C. Audit Decision Applied

## D. Candidate Certification

## E. Source Replacement

## F. Runtime Certification

## G. Registry / Sync

## H. Application UI Ownership

## I. Focused Test Matrix

## J. Typecheck / Build

## K. Desktop Runtime Evidence

## L. Narrow Runtime Evidence

## M. Runtime Asset Delivery

## N. Accessibility / Localization

## O. BR-001 Isolation

## P. MM-006 Isolation

## Q. Architectural Separation

## R. Coverage Review

## S. Must-Have Gap Assessment

## T. Lifecycle Closeout

## U. Scope Verification

## V. Repository Integrity

## W. Final Decision

---

# 23. Final Decision

End with exactly one:

OPTION A —
MM-001 MENU-FREE BACKGROUND REPLACEMENT —
READY TO CLOSE / PASS CANDIDATE

Use if:

- candidate satisfies visual contract;
- source/runtime certification succeeds;
- no fake UI remains;
- real menu remains intact;
- desktop PASS;
- narrow PASS;
- no task-introduced failures;
- BR-001 unchanged;
- MM-006 unchanged;
- lifecycle docs updated;
- no MUST-HAVE gap.

OPTION B —
MM-001 MENU-FREE BACKGROUND REPLACEMENT —
SMALL TASK-LOCAL DELTA REQUIRED

Use only if a concrete small fix remains.

OPTION C —
MM-001 MENU-FREE BACKGROUND REPLACEMENT —
BLOCKED / MATERIAL ISSUE

Use for architecture ambiguity, unsuitable artwork, severe rendering failure,
sealed-asset contamination or material regression.

---

# 24. Execution Summary

Return:

# MM-001 — Menu-Free Background Replacement
## Close Candidate Execution Summary

### Baseline

- Branch:
- HEAD:
- fetch:
- origin/master:
- v1.0.0:
- v1.0.0-rc.1:
- tags moved:

### Candidate

- path:
- original dimensions:
- aspect ratio:
- format:
- original SHA-256:
- visual certification:
- preprocessing:

### Authoritative Source

- path:
- final dimensions:
- final SHA-256:
- previous source replaced:
- old source preserved via Git history:

### Runtime

- PNG:
- PNG SHA-256:
- PNG byte-identical to source:
- WebP:
- WebP SHA-256:
- registry changed:
- sync code changed:

### Embedded UI Removal

- English sidebar:
- fake buttons:
- top utility bar:
- news panel:
- social icons:
- baked logo/wordmark:
- version text:
- readable UI copy:
- result:

### Application UI

- real menu owner:
- real actions intact:
- BR-001 intact:
- HTML heading intact:
- functionality lost:
- duplicate-menu impression:

### Tests

- focused tests:
- task-introduced failures:
- typecheck:
- build:

### Desktop

- viewport:
- scenic background:
- menu readability:
- old fake UI:
- crop:
- result:

### Narrow

- viewport:
- scenic background:
- real menu:
- fake UI fragments:
- overflow:
- crop:
- result:

### Runtime Delivery

- PNG HTTP:
- PNG hash match:
- WebP:
- stale asset:
- result:

### Isolation

- BR-001 changed:
- MM-006 changed:
- ICON families changed:
- gameplay/domain/API/YAML changed:
- release state changed:

### Coverage

- required consumer:
- additional MUST-HAVE gap:

### Lifecycle

- catalog:
- backlog:
- changelog:
- replacement status:

### Repository Integrity

- final HEAD:
- fetch:
- origin/master:
- commit:
- push:
- tags moved:

### Final Decision

OPTION A / B / C

STOP.

---

# CORE RULE

THE NEW IMAGE IS NOW AN APPROVED IMPLEMENTATION CANDIDATE,
BUT MUST STILL PASS TECHNICAL AND RUNTIME CERTIFICATION.

MM-001 MUST BECOME SCENIC BACKGROUND ONLY.

THE APPLICATION OWNS THE MENU.

BR-001 OWNS BRAND IDENTITY.

KEEP THE SAME MM-001 ASSET ID AND EXISTING PIPELINE.

DO NOT REDESIGN THE MENU.

DO NOT REOPEN MM-006 OR BR-001.

RESOLVE TRIVIAL TASK-LOCAL FINISH ISSUES DIRECTLY.

VALIDATE DESKTOP AND NARROW.

UPDATE LIFECYCLE DOCUMENTATION.

PRODUCE ONE CLOSE CANDIDATE.

NO COMMIT.
NO PUSH.
STOP.