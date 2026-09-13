# Cursor Consolidated Completion Prompt
# Project Genesis — Post-V1 Visual Production

## BR-001 Phase 1 — Finish, Validate & Close Candidate

MODE:
CONSOLIDATED FINISH / VALIDATE / CLOSE-CANDIDATE PASS

THIS PROMPT REPLACES FURTHER MICRO-DELTAS FOR BR-001 PHASE 1.

DO NOT CREATE A NEW CHAIN OF:
PROMPT → REPORT → TINY DELTA → REPORT → TINY DELTA

THE GOAL IS TO FINISH THE REMAINING WORK IN ONE CONTROLLED PASS.

CURSOR MAY RESOLVE SMALL, OBVIOUS, TASK-LOCAL ISSUES DIRECTLY.

CURSOR MUST STOP ONLY FOR:
- architecture ambiguity;
- sealed asset integrity failure;
- unexpected cross-scope regression;
- requirement conflict;
- a change that would materially expand BR-001 Phase 1.

---

# 1. Objective

BR-001 Phase 1 is functionally almost complete.

Already accepted:

- visual concept;
- sealed SVG artwork;
- runtime SVG certification;
- BR-001 registry migration;
- BR-001 / MM-006 separation;
- certified favicon derivatives;
- MainMenuHome integration approach;
- decorative accessibility contract;
- 32×32 PNG favicon via Next.js metadata.icons;
- no additional favicon derivative requirement;
- no new logo component;
- no registry or sync redesign.

Remaining work is primarily validation and close-candidate preparation.

Complete all remaining task-local work in this pass.

At the end, produce one of:

READY TO CLOSE

or

BLOCKED — <real blocker>

Do not manufacture a blocker for trivial repairable issues.

---

# 2. Read Authority

Read first:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Read the current BR-001 reports relevant to Phase 1:

- Phase 1A art brief / requirements audit
- Phase 1B geometry / approved source report
- Phase 1C runtime certification report
- Phase 1D MainMenuHome + favicon consumer integration report

In particular inspect:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1D_MAIN_MENU_FAVICON_CONSUMER_INTEGRATION_REPORT.md

Inspect the current implementation, not just the report.

---

# 3. Locked Asset Contract

Asset ID:

BR-001

Authoritative source:

docs/design/branding/BR-001_Logo.svg

Expected SHA-256:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Runtime SVG:

apps/web/public/assets/branding/BR-001.svg

Expected SHA-256:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Favicon 16:

apps/web/public/favicon-16x16.png

Expected SHA-256:

b4102b39cd782581cbbd131f70fc1cce06087c17e3c4b23c2b01616dafa8623d

Favicon 32:

apps/web/public/favicon-32x32.png

Expected SHA-256:

4a1a3e3dbdfb3ced65d1af2e900f1ec35a9b83752edbceeea50ae8166e5345c6

Verify all four before work.

If source or runtime SVG hash differs:

STOP.

Report:

BLOCKED — SEALED BR-001 ASSET INTEGRITY FAILURE

Do not repair artwork in this task.

---

# 4. Locked Consumer Contract

MainMenuHome:

- BR-001 is shown beside existing product text;
- "Project Genesis" remains authoritative;
- subtitle remains intact;
- BR-001 is decorative;
- alt="";
- no MM-006 fallback;
- existing asset infrastructure is reused;
- no one-off logo component;
- layout change is minimal and scoped.

Favicon:

- Next.js metadata.icons;
- certified 32×32 PNG only;
- 16×16 PNG remains unwired;
- no favicon.ico;
- no Apple-touch icon;
- no new SVG favicon;
- no app/icon duplicate;
- no new derivatives.

Registry:

UNCHANGED

Sync:

UNCHANGED

Preload:

FALSE

Do not reopen these decisions unless runtime proves they are technically invalid.

---

# 5. Work Style for This Pass

Do not stop for trivial issues such as:

- stale expected snapshot;
- formatting mismatch;
- small test fixture update;
- tiny scoped CSS correction;
- minor report wording;
- a straightforward test expectation that must reflect the approved DOM.

Resolve those directly.

Only stop when the required correction would:

- change architecture;
- alter sealed visual assets;
- change favicon strategy;
- modify registry/sync design;
- expand to new consumers;
- affect unrelated UI;
- alter release state.

---

# 6. Snapshot Cleanup

Run the existing shell snapshot test normally first.

Inspect the diff.

If the diff contains only expected BR-001 MainMenuHome integration changes:

- update the snapshot using repository-standard tooling;
- re-run the test;
- require PASS.

Expected differences may include:

- brand row wrapper;
- BR-001 image markup;
- text wrapper;
- preserved h1;
- preserved subtitle.

If unrelated snapshot changes appear:

investigate.

If they are caused by a small task-local deterministic issue:

fix them.

If they indicate unrelated application changes:

STOP and report a real blocker.

Do not blindly normalize unrelated diffs.

---

# 7. Focused Test Suite

Run at minimum:

MainMenuHome.test.tsx

layout.test.ts

br001-runtime-certification.test.ts

visual-asset-registry.test.ts

shell-components.snapshot.test.tsx

All must pass before READY TO CLOSE.

Small task-local test updates are allowed if they reflect the approved implementation.

Do not weaken meaningful coverage.

---

# 8. Web Validation

Run the appropriate repository-supported web validation.

Inspect package scripts and use the existing commands.

Run relevant:

- typecheck;
- build;
- lint if part of the normal task-local web validation path.

Do not skip validation solely because a historical EPERM has occurred before.

If validation passes:

record PASS.

If the known host issue occurs:

EPERM on apps/web/.next/trace

classify it as environmental only if it matches exactly.

If another error occurs:

investigate and fix it if task-local and small.

Do not hide a real BR-001 regression behind historical environment debt.

---

# 9. Run the Application

Start the actual web application using the repository-supported development workflow.

Do not substitute static code review for runtime validation.

Validate MainMenuHome at minimum in:

DESKTOP viewport

and

NARROW viewport.

Use practical representative viewport dimensions.

Record the actual dimensions used.

---

# 10. Desktop Validation

Verify in the running application:

- BR-001 is visible;
- Project Genesis heading remains visible;
- subtitle remains visible;
- logo and text align correctly;
- no clipping;
- no overlap;
- no broken image;
- no unintended wrapping;
- card shell remains intact;
- menu actions remain intact;
- logo aspect ratio is correct;
- no background plate;
- no accidental filter/shadow;
- no unintended animation.

If a small scoped CSS defect appears:

fix it directly.

Re-test.

Do not stop merely because one margin or alignment property needs correction.

---

# 11. Narrow Validation

Verify in the running application:

- BR-001 remains visible;
- Project Genesis remains readable and usable;
- no horizontal overflow caused by the brand row;
- no logo/text overlap;
- no clipped title;
- no broken wrapping behavior;
- subtitle remains usable;
- actions remain usable;
- card shell remains stable.

If a small responsive CSS correction is needed:

make the smallest scoped fix and re-test.

Do not redesign the Main Menu.

---

# 12. Favicon Runtime Validation

Verify the selected contract:

metadata.icons
→ /favicon-32x32.png

Check:

- metadata is emitted;
- request path resolves;
- no 404;
- selected file is the certified 32×32 derivative.

If browser tab favicon rendering is observable:

confirm it visually.

If browser visual confirmation is not reliable:

static metadata + successful asset request is sufficient.

Record:

PASS — browser observed

or

PASS — metadata/request verified

Do not fail the entire task solely because a headless environment cannot visibly display a browser tab icon.

---

# 13. Favicon Scope Must Remain Minimal

Do not add:

- 16×16 metadata entry;
- favicon.ico;
- SVG favicon;
- app/icon.*;
- Apple-touch icon;
- manifest icons;
- additional resolutions.

Unless runtime demonstrates that the approved 32×32 metadata contract is actually invalid.

If that happens, STOP.

Do not silently change strategy.

---

# 14. Failure / Fallback Verification

Ensure:

Project Genesis text does not depend on successful BR-001 image rendering.

Existing tests may provide sufficient evidence.

Do not build new error UI.

Do not add fallback artwork.

Do not reintroduce MM-006.

---

# 15. Allowed Small Repairs

This pass may directly modify, if needed:

- snapshot artifact;
- MainMenuHome focused tests;
- layout metadata test;
- very small MainMenuHome CSS;
- MainMenuHome markup only if required to correct an actual integration defect;
- Phase 1D report;
- BR-001 lifecycle documentation if closeout criteria below are satisfied.

Do not ask for another micro-prompt for these.

---

# 16. Forbidden Changes

Do NOT modify:

docs/design/branding/BR-001_Logo.svg

apps/web/public/assets/branding/BR-001.svg

apps/web/public/favicon-16x16.png

apps/web/public/favicon-32x32.png

visual asset registry

sync tooling

unless a hard defect invalidates the current contract.

Do NOT expand BR-001 to:

SplashScreen

Workspace header

loading screen

game screens

settings

other menus

Do NOT modify:

MM-006
MM-001
MM-007
ICON-001
ICON-002
gameplay
domain
API
YAML
release files
package versions
release tags

---

# 17. Coverage Review in the Same Pass

Once implementation and validation are green, perform a read-only BR-001 Phase-1 coverage review.

Question:

Does Phase 1 now adequately satisfy the intended BR-001 scope?

Current intended Phase-1 consumers are:

1. MainMenuHome product branding;
2. browser favicon.

Review whether any additional consumer is genuinely MUST-HAVE for BR-001 Phase 1.

Consider:

- SplashScreen;
- workspace header;
- generic shell branding;
- app loading states.

Do not add them merely because they could use a logo.

Classify each potential extra consumer as:

MUST-HAVE

OPTIONAL

DEFERRED

OUT OF SCOPE

The expected default is:

MainMenuHome + browser favicon are sufficient

unless concrete repository/product evidence proves otherwise.

---

# 18. Coverage Decision Rule

Do not create extra implementation from the coverage review unless a true MUST-HAVE gap is discovered.

A MUST-HAVE requires evidence that without it:

- the Phase-1 brand contract is internally inconsistent;
- a primary product entry point lacks required identity;
- or an authoritative planning/design document explicitly requires it.

"Would look nice" is not enough.

"Could also show the logo here" is not enough.

Avoid logo proliferation.

---

# 19. Lifecycle Closeout

If:

- all relevant tests pass;
- runtime desktop passes;
- runtime narrow passes;
- favicon contract passes;
- asset hashes remain exact;
- no MUST-HAVE coverage gap exists;

then perform the BR-001 Phase-1 lifecycle closeout in this same pass.

Update only the existing authoritative visual lifecycle docs required by repository convention, likely:

docs/design/VISUAL_ASSET_CATALOG.md

docs/design/VISUAL_PRODUCTION_BACKLOG.md

docs/design/VISUAL_ASSET_CHANGELOG.md

BUT verify actual repository paths/names first.

Do not invent new lifecycle files.

Record BR-001 as:

PHASE 1 — CLOSED / PASS

Document:

- sealed source;
- runtime SVG;
- MainMenuHome consumer;
- favicon consumer;
- deferred optional consumers;
- no additional Phase-1 MUST-HAVE gap.

Keep the closeout concise.

---

# 20. Do Not Reopen Previous Visual Work

Do not reopen:

ICON-001

ICON-002

MM-006

V1 release

M12

existing sealed visual assets

BR-001 artwork direction

This task is BR-001 Phase-1 completion only.

---

# 21. Asset Integrity at End

Recheck all hashes.

Source SVG:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Runtime SVG:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Favicon 16:

b4102b39cd782581cbbd131f70fc1cce06087c17e3c4b23c2b01616dafa8623d

Favicon 32:

4a1a3e3dbdfb3ced65d1af2e900f1ec35a9b83752edbceeea50ae8166e5345c6

Any unexpected mismatch:

BLOCKED — ASSET INTEGRITY FAILURE

---

# 22. Final Report Strategy

Update the existing Phase-1D report:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1D_MAIN_MENU_FAVICON_CONSUMER_INTEGRATION_REPORT.md

with final validation results.

Then create ONE concise final BR-001 Phase-1 close candidate report:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1_CLOSE_CANDIDATE_REPORT.md

Do not create separate reports for:

snapshot delta

runtime delta

coverage audit

lifecycle closeout

Combine them here.

---

# 23. Close Candidate Report Required Sections

# BR-001 Phase 1 — Close Candidate Report

## A. Executive Summary

## B. Locked Asset Integrity

## C. Phase 1D Final Validation

## D. Snapshot Resolution

## E. Test Matrix

## F. Desktop Runtime Evidence

## G. Narrow Runtime Evidence

## H. Favicon Verification

## I. Coverage Review

## J. Must-Have Gap Assessment

## K. Lifecycle Closeout

## L. Scope Verification

## M. Repository Integrity

## N. Final Decision

Keep it concise and evidence-based.

Do not repeat every historical Phase 1 detail.

Reference prior reports instead of duplicating them.

---

# 24. Required Test Matrix

Include:

MainMenuHome focused tests:
PASS / FAIL

Layout metadata test:
PASS / FAIL

Phase-1C runtime certification tests:
PASS / FAIL

Registry tests:
PASS / FAIL

Shell snapshot:
PASS / FAIL

Web typecheck:
PASS / FAIL / ENVIRONMENT BLOCKED

Web build:
PASS / FAIL / ENVIRONMENT BLOCKED

Desktop runtime:
PASS / FAIL

Narrow runtime:
PASS / FAIL

Favicon contract:
PASS / FAIL

---

# 25. Required Coverage Matrix

Include at minimum:

MainMenuHome
REQUIRED / IMPLEMENTED

Browser favicon
REQUIRED / IMPLEMENTED

SplashScreen
OPTIONAL or DEFERRED / MM-006 remains authoritative scenic asset

Workspace header
OPTIONAL / DEFERRED unless evidence says otherwise

Other screens
OUT OF PHASE 1

Additional MUST-HAVE gap:
YES / NO

If YES:

explain exact evidence.

Do not implement the extra consumer automatically in this pass if it would materially expand scope.

---

# 26. Repository Integrity

Run:

git status --short
git diff --stat
git diff --name-only
git diff --staged
git rev-parse HEAD
git rev-parse origin/master
git rev-list -n 1 v1.0.0
git rev-list -n 1 v1.0.0-rc.1

Verify:

v1.0.0 =
c4bb643df6fda7792906f34fbbb20ff07e9bfeef

v1.0.0-rc.1 =
442665cd6437bdebff88fd1540cedc689238c240

Tags moved:

NO

Preserve unrelated dirty work.

Do not clean unrelated files.

---

# 27. Commit Policy

DEFAULT:

DO NOT COMMIT.
DO NOT PUSH.
DO NOT TAG.

External review still occurs after this consolidated pass.

Do not treat lifecycle closeout documentation as permission to commit.

---

# 28. Final Decision

End with exactly one:

OPTION A —
BR-001 PHASE 1 — READY TO CLOSE / PASS CANDIDATE

Use only if:

- asset integrity passes;
- snapshot issue resolved;
- focused tests pass;
- no task-introduced validation failure remains;
- desktop runtime passes;
- narrow runtime passes;
- favicon contract passes;
- no MUST-HAVE coverage gap exists;
- lifecycle docs are updated;
- no forbidden scope expansion occurred.

OPTION B —
BR-001 PHASE 1 — IMPLEMENTATION COMPLETE /
ENVIRONMENT-LIMITED CLOSE CANDIDATE

Use only if:

- implementation and tests are otherwise clean;
- remaining limitation is genuinely environmental;
- no product/architecture uncertainty remains;
- evidence is sufficient to explain exactly what could not be observed.

OPTION C —
BR-001 PHASE 1 — BLOCKED /
REAL COVERAGE OR INTEGRATION ISSUE

Use when:

- a true MUST-HAVE gap exists;
- runtime proves the current consumer contract is invalid;
- or a nontrivial integration problem requires a new decision.

OPTION D —
BR-001 PHASE 1 — FAIL /
SEALED ASSET OR SCOPE INTEGRITY VIOLATION

Use when:

- certified assets changed unexpectedly;
- forbidden scope was modified;
- or BR-001 architecture was violated.

---

# 29. Execution Summary

Return:

# BR-001 Phase 1 — Finish, Validate & Close Candidate
## Execution Summary

### Baseline

- Branch:
- HEAD:
- origin/master:
- v1.0.0:
- v1.0.0-rc.1:
- tags moved:

### Asset Integrity

- source SVG:
- runtime SVG:
- favicon 16:
- favicon 32:
- result:

### Snapshot

- initial result:
- diff expected:
- updated:
- final result:

### Tests

- MainMenuHome:
- layout metadata:
- Phase-1C certification:
- registry:
- shell snapshot:
- typecheck:
- build:

### Desktop Runtime

- viewport:
- result:
- notes:

### Narrow Runtime

- viewport:
- result:
- notes:

### Favicon

- mechanism:
- selected asset:
- metadata:
- request:
- browser visual:
- result:

### Small Repairs Performed

- files:
- reason:

### Coverage Review

- MainMenuHome:
- favicon:
- SplashScreen:
- workspace header:
- other screens:
- additional MUST-HAVE gap:

### Lifecycle Closeout

- catalog updated:
- backlog updated:
- changelog updated:
- BR-001 Phase 1 marked CLOSED/PASS:
- optional/deferred consumers documented:

### Scope Integrity

- source artwork changed:
- runtime asset changed:
- favicon bytes changed:
- registry changed:
- sync changed:
- MM-006 changed:
- new consumer added:
- gameplay/domain/API/YAML changed:
- release state changed:

Expected:
NO for all except authorized lifecycle docs and any tiny task-local repair.

### Repository Integrity

- task-owned files:
- unrelated files modified by task:
- commit:
- push:
- tags moved:

### Final Decision

OPTION A / B / C / D

STOP.

---

# CORE RULE

FINISH THE WORK.

DO NOT CREATE ANOTHER MICRO-DELTA LOOP.

TRIVIAL, TASK-LOCAL ISSUES:
FIX THEM.

EXPECTED SNAPSHOT:
UPDATE IT.

SMALL CSS DEFECT:
FIX IT.

TEST EXPECTATION FOR APPROVED DOM:
FIX IT.

REAL ARCHITECTURE OR ASSET PROBLEM:
STOP.

THEN:

VALIDATE.
RUN THE APP.
CHECK DESKTOP.
CHECK NARROW.
VERIFY FAVICON.
REVIEW COVERAGE.
CLOSE LIFECYCLE DOCS IF CLEAN.
REPORT ONE FINAL CLOSE CANDIDATE.

NO REDESIGN.
NO NEW CONSUMERS WITHOUT MUST-HAVE EVIDENCE.
NO RELEASE CHANGES.
NO TAG CHANGES.
NO MORE MICRO-GATES.