# Cursor Audit Prompt
# Project Genesis — Post-V1 Visual Production

## MM-006 — Menu-Free Background Replacement Audit

MODE:
READ-ONLY ASSET / RUNTIME / CONSUMER AUDIT

NO IMPLEMENTATION.

DO NOT REPLACE MM-006 YET.
DO NOT OVERWRITE THE EXISTING ARTWORK.
DO NOT DELETE THE EXISTING ARTWORK.
DO NOT GENERATE DERIVATIVES.
DO NOT MODIFY REGISTRY OR SYNC.
DO NOT MODIFY SPLASHSCREEN.
DO NOT COMMIT.
DO NOT PUSH.
DO NOT TAG.

---

# 1. Context

The current Project Genesis start/splash background contains visual menu/UI content embedded directly in the artwork.

However, the actual application already renders its own menu/interface separately.

This creates duplicated visual responsibility:

ARTWORK:
contains menu-like content

APPLICATION:
also renders the real interactive menu

A new menu-free background artwork has therefore been generated.

The new artwork is intended to contain:

- environment / industrial world only;
- no menu buttons;
- no menu labels;
- no "New Game";
- no "Continue";
- no settings;
- no embedded interface;
- no Project Genesis text/logo unless separately justified;
- no fake HUD/UI.

The application remains responsible for the actual menu.

This audit determines how the new artwork should safely replace the current MM-006 background.

---

# 2. Candidate Artwork

Expected working/candidate name:

MM-006_Splash_Background_NoUI.png

Locate the actual candidate file in the repository.

Do not assume its exact directory.

Search relevant design / visual asset locations.

If the candidate is not present:

STOP.

Report:

MM-006 MENU-FREE BACKGROUND REPLACEMENT AUDIT —
BLOCKED / CANDIDATE FILE NOT FOUND

Do not create or reconstruct the image.

---

# 3. Read Authority

Read:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Then inspect all authoritative MM-006 references.

Search for:

MM-006

and relevant aliases/paths.

Inspect at minimum:

- visual asset catalog;
- visual production backlog;
- visual asset changelog;
- visual asset registry;
- runtime asset sync tooling;
- SplashScreen;
- MainMenu / start-menu relationship;
- tests involving MM-006;
- source artwork locations;
- public/runtime derivative locations;
- architecture/review reports that established MM-006.

Use repository evidence.

Do not infer the asset pipeline from naming alone.

---

# 4. Important Existing Boundary

BR-001 has now established dedicated product branding.

Do NOT use this audit to change BR-001.

BR-001 and MM-006 have separate responsibilities:

BR-001:
product/brand identity

MM-006:
scenic splash/start background

The new menu-free artwork is intended to remain:

MM-006

unless repository evidence proves that the existing asset taxonomy requires another asset ID.

Do not create MM-006B, MM-008, BR-001 variants, or another asset ID merely because the image changed.

---

# 5. Audit Question A — What Exactly Is MM-006?

Determine the current authoritative contract.

Report:

Asset ID:

MM-006

Current semantic role:

[exact repository-backed description]

Current source master:

[path]

Source format:

PNG / SVG / WebP / other

Current dimensions:

width × height

Color mode:

if relevant

Alpha:

YES / NO

Current source SHA-256:

[exact]

Current runtime asset(s):

[path + format + dimensions]

Current runtime hashes:

[exact]

Registry entry:

[exact relevant fields]

Preload:

TRUE / FALSE

Current consumer(s):

[list]

Primary consumer:

[component]

---

# 6. Audit Question B — Is Embedded Menu UI Actually Present?

Inspect the current source/master visually and technically where possible.

Determine whether the current MM-006 artwork contains baked-in:

- menu text;
- buttons;
- UI frames;
- selectable-looking controls;
- title/wordmark;
- other interface elements.

Do not rely only on filenames or reports.

If image inspection is available, inspect the actual artwork.

Classify:

A —
CLEAR EMBEDDED MENU/UI

B —
PARTIAL UI-LIKE DECORATION

C —
NO EMBEDDED MENU/UI

Explain the evidence.

If classification C is found, explain why replacement is still being considered.

---

# 7. Audit Question C — Current Application Menu Ownership

Inspect the actual application.

Determine which component owns the real interactive menu.

Report:

Splash/background consumer:

[path/component]

Interactive menu consumer:

[path/component]

Are the interactive menu controls rendered independently of MM-006?

YES / NO

Does removing baked-in menu artwork remove application functionality?

YES / NO

Expected answer must come from code evidence.

Identify:

- New Game equivalent;
- Continue/Load equivalent if present;
- Settings equivalent if present;
- other menu actions.

Do not invent missing actions.

---

# 8. Audit Question D — Rendering Geometry

Determine how MM-006 is currently displayed.

Report:

- `<img>`, `<picture>`, CSS background, asset component, etc.;
- containing component;
- width/height behavior;
- object-fit / background-size;
- object-position;
- cropping behavior;
- aspect ratio assumptions;
- desktop behavior;
- narrow/mobile behavior;
- overlays;
- gradients;
- opacity/filter treatment;
- z-index relationship with actual UI.

Determine whether the new candidate can use the existing rendering geometry unchanged.

Classify:

UNCHANGED

SMALL CONSUMER ADJUSTMENT LIKELY

MATERIAL CONSUMER CHANGE REQUIRED

Explain.

Do not implement any adjustment.

---

# 9. Audit Question E — Candidate Technical Properties

Inspect:

MM-006_Splash_Background_NoUI.png

Report:

Exact path:

Dimensions:

Aspect ratio:

File format:

Color mode:

Alpha:

File size:

SHA-256:

Compare with the existing source master.

Report:

Current MM-006:
width × height
aspect ratio

Candidate:
width × height
aspect ratio

Classify geometry compatibility:

A —
DROP-IN COMPATIBLE

B —
COMPATIBLE AFTER DETERMINISTIC RESIZE/CROP

C —
NOT COMPATIBLE WITHOUT ART/COMPOSITION CHANGE

Do not resize yet.

Do not crop yet.

---

# 10. Candidate Visual Suitability

Inspect the candidate visually.

This is not an art redesign task.

Check only whether it satisfies the intended replacement contract.

Required:

- no embedded menu;
- no fake buttons;
- no menu text;
- no accidental readable UI;
- no unwanted watermark;
- no generation artifacts that resemble UI;
- suitable scenic industrial background;
- sufficient quiet/negative space for actual application UI;
- no obvious composition conflict with the real menu;
- no critical focal element hidden directly behind the application menu;
- no inappropriate logo/title baked into the background.

Classify each:

PASS

MINOR CONCERN

FAIL

Do not edit the artwork.

---

# 11. Compare Current vs Candidate

Create a concise comparison:

CURRENT MM-006

vs

MENU-FREE CANDIDATE

Compare:

- semantic role;
- embedded UI;
- visual hierarchy;
- negative space;
- menu readability;
- dimensions;
- aspect ratio;
- likely crop behavior;
- runtime compatibility;
- derivative requirements.

Do not evaluate based on personal taste alone.

Focus on suitability as application background.

---

# 12. Source Replacement Strategy

Determine the safest repository strategy.

Evaluate:

OPTION A —
Replace existing MM-006 source master in place, preserving asset ID and source path.

OPTION B —
Preserve old source in repository archive/history location, install candidate as authoritative MM-006 source.

OPTION C —
Candidate requires preprocessing before it can become MM-006.

OPTION D —
Replacement should not proceed.

Recommend exactly one.

Important:

Git history already preserves previous versions.

Do not automatically create duplicate archival assets if repository policy does not use them.

Conversely, if the project has an established "nicht verwenden" / archive convention for superseded visual sources, report whether it applies here.

Do not move files in this audit.

---

# 13. Runtime Derivative Audit

Determine exactly what runtime files must change if the candidate becomes authoritative.

Inspect existing MM-006 derivative contract.

Report a matrix:

| Runtime artifact | Current | Required after replacement | Regenerate? |
| ... |

Possible examples:

PNG
WebP
responsive derivative
thumbnail
preload asset

Use actual repository evidence.

Do not assume PNG + WebP simply because another asset family uses that contract.

Do not create new resolutions unless existing MM-006 geometry requires them.

---

# 14. Sync Tool Audit

Determine whether the existing runtime sync tooling already knows how to regenerate MM-006.

Report:

Sync tool path:

MM-006 included:

YES / NO

Current operation:

copy / resize / WebP conversion / other

Deterministic:

YES / NO / UNKNOWN

Would replacement require sync-tool code change?

YES / NO

Expected preferred outcome:

NO

If code changes would be required, explain exactly why.

Do not implement them.

---

# 15. Registry Audit

Inspect the current MM-006 registry entry.

Determine whether replacing image bytes requires registry changes.

Possible outcomes:

A —
NO REGISTRY CHANGE
same ID, same paths, same formats

B —
HASH/DIMENSION METADATA ONLY
if registry actually stores such metadata

C —
REGISTRY CONTRACT CHANGE REQUIRED

Recommend the minimum.

Do not modify registry.

---

# 16. Consumer Audit

Inspect every production-active MM-006 consumer.

For each report:

Component:

Purpose:

Asset path/ID:

Rendering method:

Would menu-free replacement remain semantically correct?

YES / NO

Would any consumer lose required information because the baked-in menu disappears?

YES / NO

If YES:

identify the exact information and why the application does not already render it.

Do not add another consumer.

---

# 17. BR-001 Interaction Check

Because BR-001 now provides product identity, determine whether the new MM-006 needs any embedded Project Genesis branding.

Expected architectural preference:

NO

because:

BR-001 owns brand identity
and application UI owns textual/menu identity.

But verify actual Splash/MainMenu composition.

Report:

Does menu-free MM-006 require BR-001 baked into artwork?

YES / NO

Does the application already provide sufficient product identity independently?

YES / NO

Do NOT implement BR-001 into SplashScreen during this audit.

---

# 18. Accessibility Check

Determine whether MM-006 is decorative or informational.

Report current:

alt semantics

aria behavior

asset component semantics

Does removing baked-in menu content improve semantic correctness?

YES / NO

If the old image contains readable menu text but is marked decorative, note that as architectural evidence supporting replacement.

Do not modify accessibility code in this audit.

---

# 19. Responsive Risk

Assess candidate composition against existing desktop/narrow rendering.

Identify:

- important crop zones;
- actual menu overlay zone;
- candidate focal-point location;
- whether narrow crop could remove important scenery;
- whether actual menu remains legible.

Classify:

LOW

MEDIUM

HIGH

Explain what must be visually verified during implementation.

Do not redesign responsive layout.

---

# 20. Replacement Implementation Scope

If replacement is recommended, define the smallest future implementation slice.

Expected shape:

1. preserve/replace authoritative source according to repository convention;
2. regenerate only existing required MM-006 runtime derivatives;
3. keep MM-006 asset ID;
4. keep registry unchanged unless evidence requires otherwise;
5. keep SplashScreen/menu architecture unchanged;
6. run sync/certification tests;
7. validate desktop;
8. validate narrow;
9. verify real menu remains usable;
10. update MM-006 lifecycle documentation;
11. report new hashes.

Do NOT execute these steps now.

This section is a PLAN only.

---

# 21. Forbidden Scope

Do not:

- redesign MainMenuHome;
- redesign SplashScreen;
- change menu actions;
- change navigation;
- change BR-001;
- add BR-001 to SplashScreen;
- modify MM-001;
- modify MM-007;
- touch ICON-001;
- touch ICON-002;
- modify gameplay;
- modify domain;
- modify API;
- modify YAML;
- modify package versions;
- modify release state;
- move release tags;
- create a new release.

This is an MM-006 replacement audit only.

---

# 22. Repository Integrity

Run:

git status --short
git diff --stat
git diff --name-only
git diff --staged
git rev-parse HEAD
git rev-parse origin/master
git rev-list -n 1 v1.0.0
git rev-list -n 1 v1.0.0-rc.1

Record:

Branch:

HEAD:

origin/master:

v1.0.0:

v1.0.0-rc.1:

Tags moved:

NO

Preserve unrelated dirty work.

---

# 23. Audit Report

Create:

docs/architecture/reviews/
POST_V1_MM_006_MENU_FREE_BACKGROUND_REPLACEMENT_AUDIT.md

Required sections:

# MM-006 — Menu-Free Background Replacement Audit

## A. Executive Summary

## B. Repository Baseline

## C. Current MM-006 Contract

## D. Embedded UI Assessment

## E. Application Menu Ownership

## F. Current Rendering Geometry

## G. Candidate Technical Properties

## H. Candidate Visual Suitability

## I. Current vs Candidate Comparison

## J. Source Replacement Strategy

## K. Runtime Derivative Contract

## L. Sync Tool Assessment

## M. Registry Assessment

## N. Consumer Assessment

## O. BR-001 Interaction

## P. Accessibility Assessment

## Q. Responsive Risk

## R. Proposed Implementation Scope

## S. Scope / Repository Integrity

## T. Final Recommendation

---

# 24. Final Recommendation

End with exactly one:

OPTION A —
MM-006 MENU-FREE REPLACEMENT —
READY FOR CONTROLLED IMPLEMENTATION

Use if:

- candidate is visually suitable;
- application owns the real menu;
- removing baked-in menu loses no required functionality;
- geometry is compatible or deterministically adaptable;
- existing runtime architecture can support replacement;
- no architecture redesign is needed.

OPTION B —
MM-006 MENU-FREE REPLACEMENT —
READY AFTER SMALL ART/GEOMETRY DELTA

Use if:

- concept is correct;
- but crop, dimensions, composition, or image cleanup requires a small candidate-art adjustment before repository integration.

OPTION C —
MM-006 MENU-FREE REPLACEMENT —
ARCHITECTURE DECISION REQUIRED

Use if:

- existing MM-006 semantics or consumers depend materially on the embedded artwork UI;
- or source/runtime ownership is ambiguous.

OPTION D —
MM-006 MENU-FREE REPLACEMENT —
NOT RECOMMENDED

Use only with concrete evidence.

---

# 25. Execution Summary

Return:

# MM-006 — Menu-Free Background Replacement Audit
## Execution Summary

### Baseline

- Branch:
- HEAD:
- origin/master:
- v1.0.0:
- v1.0.0-rc.1:
- tags moved:

### Current MM-006

- semantic role:
- source:
- format:
- dimensions:
- SHA-256:
- runtime assets:
- registry:
- preload:
- consumers:

### Embedded UI

- classification:
- menu text present:
- buttons/UI present:
- title/logo present:
- evidence:

### Application Menu

- owning component:
- actions rendered independently:
- removing artwork UI loses functionality:
- result:

### Candidate

- path:
- format:
- dimensions:
- aspect ratio:
- SHA-256:
- embedded UI:
- negative space:
- visual suitability:
- geometry compatibility:

### Rendering

- current method:
- object-fit/background-size:
- object-position:
- desktop:
- narrow:
- consumer adjustment required:

### Runtime Contract

- derivatives required:
- sync tool:
- sync change required:
- registry change required:

### BR-001

- interaction:
- branding baked into MM-006 required:
- BR-001 change required:

### Responsive Risk

- desktop:
- narrow:
- overall:

### Proposed Replacement Strategy

- selected option:
- old source handling:
- new source handling:
- runtime regeneration:
- registry:
- consumer:
- lifecycle docs:

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

AUDIT FIRST.

THE NEW IMAGE IS A CANDIDATE, NOT YET THE MM-006 MASTER.

DO NOT OVERWRITE THE OLD ARTWORK.

VERIFY THAT THE APPLICATION — NOT THE IMAGE — OWNS THE MENU.

DETERMINE THE EXISTING MM-006 SOURCE/RUNTIME CONTRACT.

DETERMINE WHETHER THE CANDIDATE IS A DROP-IN REPLACEMENT.

KEEP BR-001 SEPARATE.

DO NOT IMPLEMENT.

REPORT.

STOP.