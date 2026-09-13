# Cursor Delta Prompt
# Project Genesis — Post-V1 Visual Production

## BR-001 Phase 1D — Snapshot & Runtime Validation Delta

MODE:
TARGETED VALIDATION / TEST DELTA

THIS IS NOT A FEATURE IMPLEMENTATION TASK.

THE MAINMENUHOME + FAVICON INTEGRATION IS ALREADY TECHNICALLY ACCEPTED.

DO NOT REDESIGN.
DO NOT CHANGE THE CONSUMER CONTRACT.
DO NOT CHANGE FAVICON STRATEGY.
DO NOT CHANGE REGISTRY OR SYNC.
DO NOT START COVERAGE/CLOSEOUT REVIEW YET.

THE PURPOSE OF THIS DELTA IS ONLY TO CLEAR THE REMAINING PHASE-1D VALIDATION GAPS.

---

# 1. Read Authority

Read:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Read:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1D_MAIN_MENU_FAVICON_CONSUMER_INTEGRATION_REPORT.md

Inspect the current Phase-1D implementation before making any change.

Do not reinterpret the approved integration.

---

# 2. Accepted Phase-1D Implementation

The following decisions are already accepted and must remain unchanged.

MainMenuHome:

- BR-001 rendered via PGVisualAssetImage
- visible "Project Genesis" heading remains authoritative
- BR-001 is decorative
- alt=""
- no MM-006 fallback
- no one-off logo component
- minimal brand-row CSS
- no menu redesign

Favicon:

- Next.js metadata.icons
- certified 32×32 PNG only
- 16×16 PNG remains unwired
- no favicon.ico
- no Apple-touch icon
- no new derivative
- no App Router icon duplicate

Registry:

UNCHANGED

Sync:

UNCHANGED

Do not reopen any of these decisions unless hard evidence shows the implementation is broken.

---

# 3. Locked Asset Integrity

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

Verify before work.

If any certified asset hash differs:

STOP.

Report:

BR-001 PHASE 1D VALIDATION DELTA — BLOCKED / ASSET INTEGRITY FAILURE

Do not repair assets in this delta.

---

# 4. Remaining Validation Gaps

The Phase-1D implementation report has exactly these open validation issues:

1. shell-components.snapshot.test.tsx is stale after the intentional MainMenuHome DOM change;

2. desktop browser runtime evidence is missing;

3. narrow browser runtime evidence is missing;

4. browser favicon evidence is static-only;

5. relevant web validation was not actually re-run.

This delta exists to resolve these items only.

---

# 5. Snapshot Test — Inspect Before Updating

Target:

shell-components.snapshot.test.tsx

and its associated snapshot artifact.

First run the snapshot test WITHOUT update mode.

Capture the actual diff.

Do not immediately run "-u".

Inspect the diff carefully.

The snapshot delta is acceptable only if it is caused exclusively by the intended BR-001 MainMenuHome integration, such as:

- new PGVisualAssetImage / img output;
- new brand-row wrapper;
- new brand-text wrapper;
- existing h1 preserved;
- existing subtitle preserved.

The diff must NOT contain unrelated changes to:

- other shell components;
- other screens;
- menu actions;
- text content;
- navigation;
- unrelated CSS-driven structure;
- SplashScreen;
- MM-006;
- application shell behavior.

---

# 6. Snapshot Decision

If the snapshot diff is exactly the expected Phase-1D MainMenuHome change:

update the snapshot using the repository-standard mechanism.

Then re-run the snapshot test normally.

Expected final result:

PASS

If the snapshot diff contains unexpected unrelated changes:

DO NOT UPDATE THE SNAPSHOT.

STOP and report:

BR-001 PHASE 1D VALIDATION DELTA —
UNEXPECTED SNAPSHOT CHANGE / REVIEW REQUIRED

Do not normalize an unexpected diff into a new baseline.

---

# 7. Snapshot Scope

Prefer changing only the generated snapshot artifact if that is the correct repository behavior.

Do not rewrite the snapshot test itself merely to avoid updating an intentional snapshot.

Only replace a snapshot assertion with a structural assertion if:

- the current snapshot is demonstrably brittle or inappropriate;
- the change is narrowly justified;
- behavior coverage is not weakened.

Default:

KEEP EXISTING TEST DESIGN.

UPDATE THE EXPECTED SNAPSHOT AFTER VERIFYING THE DIFF.

---

# 8. Focused Test Re-Run

After snapshot resolution, re-run all Phase-1D relevant focused tests.

At minimum:

MainMenuHome.test.tsx

layout.test.ts

br001-runtime-certification.test.ts

visual-asset-registry.test.ts

shell-components.snapshot.test.tsx

Expected:

ALL PASS

Do not weaken existing assertions.

Do not skip failing tests.

---

# 9. Web Validation

Actually run the narrowest repository-supported web validation.

Inspect package scripts first.

Run the relevant:

typecheck

and/or

build:web

according to repository conventions.

Do not assume the historical EPERM will recur.

Capture the exact result.

If validation succeeds:

PASS

If the known environment issue occurs:

EPERM on apps/web/.next/trace

classify it as:

ENVIRONMENTAL / HISTORICAL

only if the failure matches the known issue exactly.

If a new compiler, type, import, metadata, React, CSS, or test-related error appears before or instead of that EPERM:

treat it as task-relevant until disproven.

Do not hide new failures behind historical debt.

---

# 10. Browser Runtime Validation

Start the web application using the repository-supported local development workflow.

Use the actual implementation.

Do not rely only on static code inspection.

Validate MainMenuHome in a browser.

Required evidence:

DESKTOP

and

NARROW

Use representative viewports consistent with the project's existing visual review practice.

Do not invent arbitrary acceptance based only on screenshots.

Inspect layout behavior.

---

# 11. Desktop Runtime Gate

Desktop MainMenuHome must show:

- BR-001 symbol rendered;
- Project Genesis heading visible;
- subtitle visible;
- symbol and text correctly aligned;
- no overlap;
- no clipping;
- no broken image;
- no unexpected wrap;
- menu actions remain intact;
- no layout regression in card shell.

Record:

PASS / FAIL

Do not write PASS unless actually viewed in browser/runtime.

---

# 12. Narrow Runtime Gate

At a narrow viewport verify:

- BR-001 remains visible;
- Project Genesis remains fully usable;
- symbol does not crush text width;
- no clipping;
- no horizontal overflow caused by brand row;
- no accidental overlap;
- no broken alignment;
- no unusable title wrapping introduced by BR-001;
- menu actions remain usable.

Record:

PASS / FAIL

Again:

STATIC CSS REVIEW IS NOT SUFFICIENT FOR PASS.

---

# 13. Runtime Logo Fidelity

At both desktop and narrow sizes inspect:

- symbol remains square;
- aspect ratio correct;
- no stretching;
- no crop;
- no background plate;
- correct blue appearance;
- no accidental inherited filter;
- no animation;
- no unexpected opacity.

Do not modify the artwork to fix layout.

If display geometry is wrong, fix only the smallest consumer-level CSS issue.

---

# 14. Runtime Failure Contract

If practical with existing test/runtime tooling, verify:

BR-001 failure does not remove Project Genesis text.

Do not introduce new UI solely to simulate this manually.

Existing test evidence may be reused if it already proves registry-miss behavior.

Report the evidence source accurately.

---

# 15. Browser Favicon Validation

Because Phase 1D selected:

metadata.icons
+
/favicon-32x32.png

verify the favicon in the running application if the environment/browser makes this observable.

Check:

- favicon request resolves;
- no 404;
- correct metadata/link contract is emitted;
- browser tab displays BR-001 if reliably observable.

Classify one of:

PASS — browser observed

STATIC CONTRACT PASS — browser visual observation not reliable, but generated document/metadata and request path verified

FAIL

Do not fabricate a browser visual PASS.

---

# 16. Do Not Expand Favicon Scope

This validation delta must NOT add:

- 16px metadata entry;
- favicon.ico;
- app/icon.*;
- SVG favicon;
- Apple-touch icon;
- manifest icons;
- additional sizes.

The selected Phase-1D contract remains:

32×32 PNG only via metadata.icons.

If that contract proves technically invalid in actual runtime:

STOP and report the evidence.

Do not silently replace it with another strategy.

---

# 17. Allowed Implementation Change

Expected implementation change:

NONE

except possibly:

- snapshot artifact update;
- tiny consumer CSS correction only if real browser evidence finds a Phase-1D layout defect;
- Phase-1D report update.

Any CSS correction must:

- be strictly scoped to BR-001/MainMenuHome;
- preserve approved structure;
- not redesign the menu.

If runtime passes without correction:

do not change code or CSS.

---

# 18. Forbidden Changes

Do NOT modify:

docs/design/branding/BR-001_Logo.svg

apps/web/public/assets/branding/BR-001.svg

apps/web/public/favicon-16x16.png

apps/web/public/favicon-32x32.png

visual-asset-registry.ts

sync-runtime-visual-assets.ts

favicon strategy

layout metadata contract

unless runtime proves the existing implementation itself is invalid.

Do NOT modify:

SplashScreen
MM-006
MM-001
MM-007
gameplay
domain
API
YAML
ICON-001
ICON-002
release files
package versions
release tags

Do NOT perform lifecycle closeout.

---

# 19. Asset Integrity After Validation

At the END re-run hashes for all four certified files.

They must remain:

Source SVG:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Runtime SVG:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Favicon 16:

b4102b39cd782581cbbd131f70fc1cce06087c17e3c4b23c2b01616dafa8623d

Favicon 32:

4a1a3e3dbdfb3ced65d1af2e900f1ec35a9b83752edbceeea50ae8166e5345c6

Any unexpected mismatch:

FAIL.

---

# 20. Update Existing Phase-1D Report

Update:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1D_MAIN_MENU_FAVICON_CONSUMER_INTEGRATION_REPORT.md

Do NOT create a separate replacement Phase-1D report.

Preserve historical implementation information.

Add/update the validation evidence and final gate.

Clearly distinguish:

original Phase-1D implementation session

from:

snapshot/runtime validation delta

where useful.

---

# 21. Required Report Updates

At minimum update:

A. Executive Summary

M. Targeted Tests

N. Desktop Runtime Evidence

O. Narrow Runtime Evidence

P. Favicon Verification

Q. Asset Hash Integrity

S. Repository Integrity

T. Deferred Work

U. Final Gate Recommendation

Execution Summary / Validation

Add a small:

Validation Delta

section if that improves traceability.

---

# 22. Required Snapshot Evidence

Report:

Initial snapshot test:

PASS / FAIL

Expected diff only:

YES / NO

Unexpected unrelated diff:

YES / NO

Snapshot updated:

YES / NO

Final snapshot test:

PASS / FAIL

If updated, state exactly which snapshot artifact changed.

Do not claim snapshot PASS merely because update mode completed.

Run the normal test afterward.

---

# 23. Required Runtime Evidence

Report separately:

Desktop MainMenuHome:

PASS / FAIL

Narrow MainMenuHome:

PASS / FAIL

Evidence method:

browser/dev server

Viewport(s):

[state actual viewport dimensions used]

Do not use:

NOT AVAILABLE

for OPTION A.

OPTION A requires actual desktop + narrow evidence.

---

# 24. Required Favicon Evidence

Report:

metadata contract:

PASS / FAIL

favicon request:

PASS / FAIL / NOT OBSERVABLE

browser tab visual:

PASS / STATIC CONTRACT ONLY / FAIL

selected derivative remains:

32×32 only

additional derivative wired:

YES / NO

Expected:

NO

---

# 25. Validation Matrix

Include a concise matrix:

MainMenuHome focused tests
PASS / FAIL

Layout metadata test
PASS / FAIL

Phase-1C certification tests
PASS / FAIL

Registry tests
PASS / FAIL

Shell snapshot
PASS / FAIL

Web typecheck
PASS / FAIL / ENVIRONMENT BLOCKED

Web build
PASS / FAIL / ENVIRONMENT BLOCKED

Desktop runtime
PASS / FAIL

Narrow runtime
PASS / FAIL

Favicon runtime/static verification
PASS / FAIL / STATIC CONTRACT PASS

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

# 27. Expected Delta-Owned Files

Expected:

snapshot artifact

and

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1D_MAIN_MENU_FAVICON_CONSUMER_INTEGRATION_REPORT.md

Potentially:

menu.css

ONLY if actual browser evidence identifies a genuine small responsive/display defect.

No other implementation file should change without explicit evidence.

---

# 28. Commit Policy

DO NOT COMMIT.

DO NOT PUSH.

DO NOT TAG.

External review is still required.

---

# 29. Final Gate Options

End with exactly one:

OPTION A —
BR-001 PHASE 1D CONSUMER INTEGRATION — PASS /
READY FOR PHASE-1 COVERAGE & CLOSEOUT REVIEW

OPTION B —
BR-001 PHASE 1D IMPLEMENTATION COMPLETE /
SMALL VALIDATION DELTA STILL REQUIRED

OPTION C —
BR-001 PHASE 1D BLOCKED /
RUNTIME OR TEST ENVIRONMENT PREVENTS CERTIFICATION

OPTION D —
BR-001 PHASE 1D FAIL /
INTEGRATION OR SEALED ASSET INTEGRITY FAILURE

---

# 30. OPTION A Requirements

Use OPTION A only if ALL are true:

- snapshot diff was inspected before update;
- snapshot change was expected and scoped;
- final snapshot test passes;
- MainMenuHome focused tests pass;
- layout metadata test passes;
- Phase-1C certification tests pass;
- registry tests pass;
- desktop runtime actually inspected and passes;
- narrow runtime actually inspected and passes;
- favicon contract verified at least to static/runtime-request level;
- no task-introduced build/type error remains;
- sealed asset hashes remain exact;
- favicon wiring remains minimal;
- no unrelated implementation scope changed.

If any required item remains unavailable:

do not use OPTION A.

---

# 31. Execution Summary

Return:

# BR-001 Phase 1D — Snapshot & Runtime Validation Delta
## Execution Summary

### Baseline

- Branch:
- HEAD:
- origin/master:
- v1.0.0:
- v1.0.0-rc.1:
- tags moved:

### Integrity Before

- source SVG hash:
- runtime SVG hash:
- favicon 16 hash:
- favicon 32 hash:
- result:

### Snapshot

- initial test:
- diff inspected:
- expected BR-001-only diff:
- unrelated diff:
- snapshot updated:
- snapshot artifact:
- final test:

### Focused Tests

- MainMenuHome:
- layout metadata:
- Phase-1C certification:
- registry:
- shell snapshot:

### Web Validation

- typecheck:
- build:
- environmental EPERM encountered:
- new task-related failure:

### Desktop Runtime

- dev server:
- viewport:
- BR-001 visible:
- Project Genesis visible:
- alignment:
- clipping/overlap:
- menu regression:
- result:

### Narrow Runtime

- viewport:
- BR-001 visible:
- Project Genesis usable:
- clipping:
- horizontal overflow:
- title/layout regression:
- result:

### Favicon

- metadata.icons:
- selected derivative:
- request resolves:
- browser visual:
- additional derivative wired:
- result:

### Integrity After

- source unchanged:
- runtime SVG unchanged:
- favicon 16 unchanged:
- favicon 32 unchanged:

### Scope

- implementation changed beyond snapshot:
- CSS changed:
- registry changed:
- sync changed:
- favicon strategy changed:
- SplashScreen changed:
- MM-006 changed:
- gameplay/domain/API/YAML changed:
- lifecycle closeout performed:

### Repository Integrity

- delta-owned files:
- unrelated files modified by delta:
- commit:
- push:
- tags moved:

### Final Decision

OPTION A / B / C / D

STOP.

---

# CORE RULE

THE FEATURE WORK IS ALREADY DONE.

THIS DELTA EXISTS TO PROVE IT.

INSPECT THE SNAPSHOT DIFF BEFORE ACCEPTING IT.

DO NOT BLINDLY RUN UPDATE MODE.

RUN THE TESTS AGAIN.

RUN REAL WEB VALIDATION.

RUN THE APP.

CHECK DESKTOP.

CHECK NARROW.

VERIFY THE FAVICON CONTRACT.

KEEP ALL CERTIFIED ASSET HASHES EXACT.

DO NOT CHANGE ARCHITECTURE UNLESS VALIDATION PROVES IT IS BROKEN.

REPORT.

STOP.