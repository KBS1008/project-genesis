# Cursor Delta Prompt
# Project Genesis — Post-V1 Visual Production

## BR-001 Phase 1C — Favicon Contract Documentation Delta

MODE:
DOC_ONLY CERTIFICATION CLARIFICATION

THIS IS NOT AN IMPLEMENTATION TASK.

DO NOT MODIFY CODE.
DO NOT MODIFY ASSETS.
DO NOT REGENERATE DERIVATIVES.
DO NOT DELETE DERIVATIVES.
DO NOT CHANGE REGISTRY.
DO NOT CHANGE SYNC TOOLING.
DO NOT START PHASE 1D.

---

# 1. Purpose

BR-001 Phase 1C implementation is technically complete.

External review accepted:

- sealed Phase-1B source integrity;
- byte-identical runtime SVG;
- vector-first runtime contract;
- BR-001 registry migration;
- removal of the historical BR-001 → MM-006 alias;
- deterministic sync contract;
- focused tests;
- scope isolation.

One documentation ambiguity remains before Phase 1C can be sealed.

The current Phase-1C report classifies:

favicon-16x16.png
favicon-32x32.png

as produced/certified runtime derivatives while also deferring the actual
favicon consumer/wiring architecture to Phase 1D.

That distinction must be made explicit.

This delta changes DOCUMENTATION ONLY.

---

# 2. Authority

Read:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Read:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1C_RUNTIME_CERTIFICATION_DERIVATIVE_CONTRACT_REPORT.md

Inspect current repository state only as necessary to verify that the report
still accurately reflects implementation.

Do not reinterpret Phase 1C.

Do not reopen previous decisions.

---

# 3. Locked Technical Facts

Preserve these facts exactly.

Asset ID:

BR-001

Authoritative source:

docs/design/branding/BR-001_Logo.svg

Sealed SHA-256:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Runtime SVG:

apps/web/public/assets/branding/BR-001.svg

Runtime SVG SHA-256:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Runtime SVG relationship:

BYTE-IDENTICAL TO SEALED SOURCE

Favicon 16:

apps/web/public/favicon-16x16.png

SHA-256:

b4102b39cd782581cbbd131f70fc1cce06087c17e3c4b23c2b01616dafa8623d

Favicon 32:

apps/web/public/favicon-32x32.png

SHA-256:

4a1a3e3dbdfb3ced65d1af2e900f1ec35a9b83752edbceeea50ae8166e5345c6

BR-001 → MM-006 alias:

REMOVED

Preload:

FALSE

MainMenuHome integration:

NOT YET IMPLEMENTED

Favicon metadata wiring:

NOT YET IMPLEMENTED

---

# 4. Exact Documentation Problem

The existing report currently risks conflating two concepts:

A. CERTIFIED DERIVATIVE EXISTS

and

B. DERIVATIVE IS REQUIRED BY THE FINAL CONSUMER CONTRACT

These are not equivalent.

The 16×16 and 32×32 PNG files already exist.

They were deterministically generated from the sealed BR-001 SVG.

Their hashes and dimensions were validated.

Therefore they are legitimate:

PRODUCED / CERTIFIED DERIVATIVE CANDIDATES

However:

Phase 1D has not yet audited and selected the final favicon wiring mechanism.

The repository currently has no finalized BR-001 favicon metadata integration.

Phase 1D must still determine the smallest appropriate browser/App Router
consumer contract.

Therefore Phase 1C must NOT claim that both PNG files are necessarily part of
the final required wired favicon set.

---

# 5. Required Terminology

Update the Phase-1C report so the favicon PNGs are described as:

PRODUCED / CERTIFIED DERIVATIVE —
CONSUMER WIRING DECISION DEFERRED TO PHASE 1D

Equivalent concise wording is acceptable if the distinction remains explicit.

Do not describe them simply as:

REQUIRED

if that implies their final consumer requirement has already been decided.

---

# 6. Required Minimum-Set Clarification

Where the report currently states or implies:

minimum required derivative set:
runtime SVG + favicon 16/32 PNG

replace the meaning with:

certified derivative set:
runtime SVG + favicon 16/32 PNG

and explicitly state:

the minimum WIRED favicon set remains to be determined during Phase 1D
consumer integration.

The runtime SVG itself is not affected by this ambiguity.

Its Phase-1C runtime certification remains final.

---

# 7. Required Favicon Contract Clarification

The report must clearly distinguish:

## Phase 1C

Completed:

- sealed source certification;
- runtime SVG certification;
- deterministic favicon derivative generation;
- 16×16 PNG derivative certification;
- 32×32 PNG derivative certification.

Not completed:

- browser metadata wiring;
- App Router icon strategy selection;
- determination of which certified favicon derivative(s) are actually needed
  by the final consumer;
- favicon consumer integration.

## Phase 1D

Must determine:

- actual repository/framework favicon wiring mechanism;
- whether metadata.icons, App Router file convention, or another existing
  repository-supported mechanism is appropriate;
- which already-certified derivative(s), if any, are required;
- whether both 16 and 32 PNGs are necessary;
- whether another already-supported representation is preferable.

Phase 1D must prefer the minimum sufficient wired set.

---

# 8. Do Not Pre-Decide Phase 1D

Do NOT use this documentation delta to decide:

- metadata.icons;
- app/icon.svg;
- app/icon.png;
- favicon.ico;
- SVG favicon;
- 16 PNG only;
- 32 PNG only;
- both PNGs.

Those decisions belong to Phase 1D after repository/framework inspection.

Do not create speculative requirements.

---

# 9. Existing Files Stay

Do NOT delete:

apps/web/public/favicon-16x16.png

Do NOT delete:

apps/web/public/favicon-32x32.png

They are valid certified derivatives.

Likewise do not regenerate them.

Do not change their hashes.

Do not rename them.

This delta changes their CONTRACT DESCRIPTION, not their bytes.

---

# 10. Runtime SVG Remains Fully Certified

Do not weaken the runtime SVG certification.

The following remains Phase-1C PASS:

docs/design/branding/BR-001_Logo.svg

→ deterministic / byte-identical →

apps/web/public/assets/branding/BR-001.svg

Registry:

BR-001

Runtime path:

/assets/branding/BR-001.svg

Format:

svg

WebP:

null

Preload:

false

Future primary consumer:

MainMenuHome

No changes required.

---

# 11. MM-006 Separation Remains Closed

Do not reopen MM-006 migration.

Preserve:

BR-001 → MM-006 alias remains:
NO

MM-006:
UNCHANGED

SplashScreen:
UNCHANGED

This portion of Phase 1C is already PASS.

---

# 12. Validation Results Remain Historical Facts

Do not rerun implementation tests merely to rewrite documentation unless
repository policy explicitly requires it.

Preserve the documented results accurately:

focused tests:
13 PASS

Source hash:
PASS

Runtime SVG byte equality:
PASS

16×16 derivative:
PASS

32×32 derivative:
PASS

The documented build issue remains:

PRE-EXISTING / ENVIRONMENTAL EPERM

unless new repository evidence proves otherwise.

Do not convert historical validation into a new claim that was not actually
executed.

---

# 13. Allowed File

Modify ONLY:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1C_RUNTIME_CERTIFICATION_DERIVATIVE_CONTRACT_REPORT.md

No separate delta report is required.

This is a focused correction to the authoritative Phase-1C certification
report.

Use the existing report's internal version/history convention if applicable.

Do not create duplicate Phase-1C reports.

---

# 14. Forbidden Changes

Do NOT modify:

docs/design/branding/BR-001_Logo.svg

apps/web/public/assets/branding/BR-001.svg

apps/web/public/favicon-16x16.png

apps/web/public/favicon-32x32.png

apps/web/src/presentation/assets/visual-asset-registry.ts

tools/sync-runtime-visual-assets.ts

tests

MainMenuHome

layout.tsx

CSS

SplashScreen

VISUAL_ASSET_CATALOG.md

VISUAL_PRODUCTION_BACKLOG.md

VISUAL_ASSET_CHANGELOG.md

gameplay

domain

API

YAML

release files

ICON-001

ICON-002

---

# 15. Required Report Updates

Review the complete Phase-1C report and update every statement affected by the
favicon distinction.

At minimum inspect/update:

Executive Summary

Runtime Consumer Audit

Derivative Decision Matrix

Favicon Contract

Deferred Work

Final Gate Recommendation

Execution Summary:
- Runtime Audit
- Certification Matrix

Ensure no contradictory wording remains elsewhere in the report.

---

# 16. Required Final Certification Matrix Meaning

The final matrix should communicate approximately:

SOURCE MASTER:
CERTIFIED

RUNTIME SVG:
PRODUCED / CERTIFIED / REQUIRED FOR PLANNED BRAND CONSUMER

PNG MENU BRAND:
NOT REQUIRED

WEBP MENU BRAND:
NOT REQUIRED

FAVICON SVG:
NOT REQUIRED IN PHASE 1C / FINAL WIRING DECISION DEFERRED

FAVICON 16 PNG:
PRODUCED / CERTIFIED DERIVATIVE /
WIRING DECISION DEFERRED TO PHASE 1D

FAVICON 32 PNG:
PRODUCED / CERTIFIED DERIVATIVE /
WIRING DECISION DEFERRED TO PHASE 1D

favicon.ico:
NOT REQUIRED IN PHASE 1C

APPLE TOUCH ICON:
NOT REQUIRED / OUT OF PHASE-1 SCOPE

Do not imply that Phase 1D must use both PNGs.

---

# 17. Phase 1C Final Gate

After the documentation correction, the report may conclude:

OPTION A —
BR-001 PHASE 1C RUNTIME CERTIFICATION — PASS /
READY FOR CONSUMER INTEGRATION

provided no new contradictory evidence is found.

The report should explicitly state:

BR-001 PHASE 1C — CLOSED / PASS

and clarify:

Runtime SVG contract:
SEALED

Favicon derivative generation:
CERTIFIED

Final favicon consumer wiring:
DEFERRED TO PHASE 1D

MainMenuHome consumer integration:
DEFERRED TO PHASE 1D

Do NOT state:

BR-001 PHASE 1 — CLOSED

because Phase 1D remains outstanding.

---

# 18. Repository Integrity

Run:

git status --short
git diff --stat
git diff --name-only
git diff --staged
git rev-parse HEAD
git rev-parse origin/master
git rev-list -n 1 v1.0.0
git rev-list -n 1 v1.0.0-rc.1

Verify release tags remain:

v1.0.0 =
c4bb643df6fda7792906f34fbbb20ff07e9bfeef

v1.0.0-rc.1 =
442665cd6437bdebff88fd1540cedc689238c240

Tags moved:
NO

Preserve unrelated dirty work.

Do not clean unrelated files.

Expected delta-owned modified file:

ONLY

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1C_RUNTIME_CERTIFICATION_DERIVATIVE_CONTRACT_REPORT.md

---

# 19. Commit Policy

DO NOT COMMIT.

DO NOT PUSH.

DO NOT TAG.

The corrected report requires external review before sealing.

---

# 20. Execution Summary

Return:

# BR-001 Phase 1C — Favicon Contract Documentation Delta
## Execution Summary

### Baseline

- Branch:
- HEAD:
- origin/master:
- v1.0.0:
- v1.0.0-rc.1:
- tags moved:

### Delta

- implementation changed:
- assets changed:
- registry changed:
- sync changed:
- tests changed:
- report changed:

Expected:

NO
NO
NO
NO
NO
YES

### Runtime SVG Contract

- sealed source SHA-256:
- runtime SVG SHA-256:
- byte-identical:
- runtime certification changed:

Expected:

NO for runtime certification changed.

### Favicon Contract

- favicon 16 exists:
- favicon 16 certified derivative:
- favicon 32 exists:
- favicon 32 certified derivative:
- final consumer wiring selected:
- both PNGs declared mandatory:
- Phase 1D wiring decision preserved:

Expected:

YES
YES
YES
YES
NO
NO
YES

### Phase Boundaries

- MainMenuHome integrated:
- favicon metadata wired:
- SplashScreen changed:
- Phase 1D started:
- BR-001 Phase 1 globally closed:

Expected:

NO
NO
NO
NO
NO

### Repository Integrity

- delta-owned files:
- unrelated files modified by delta:
- commit:
- push:
- tags moved:

### Final Decision

BR-001 PHASE 1C — CLOSED / PASS

Runtime SVG contract:
SEALED

Favicon derivatives:
CERTIFIED

Favicon consumer wiring:
DEFERRED TO PHASE 1D

MainMenuHome integration:
DEFERRED TO PHASE 1D

STOP.

---

# CORE RULE

DO NOT CHANGE THE IMPLEMENTATION.

THE IMPLEMENTATION IS ALREADY TECHNICALLY ACCEPTED.

FIX ONLY THE CONTRACT LANGUAGE.

THE TWO FAVICON PNGS ARE:

VALID
GENERATED
HASHED
CERTIFIED DERIVATIVES

BUT THEIR EXISTENCE DOES NOT MEAN THAT PHASE 1D MUST WIRE BOTH OF THEM.

DISTINGUISH:

DERIVATIVE CERTIFICATION

FROM:

CONSUMER REQUIREMENT.

SEAL PHASE 1C.

THEN STOP.