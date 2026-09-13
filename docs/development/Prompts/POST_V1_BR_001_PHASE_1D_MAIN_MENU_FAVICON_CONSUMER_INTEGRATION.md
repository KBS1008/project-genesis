# Cursor Implementation Prompt
# Project Genesis — Post-V1 Visual Production

## BR-001 Phase 1D — MainMenuHome + Favicon Consumer Integration

MODE:
BOUNDED CONSUMER AUDIT + IMPLEMENTATION

BR-001 PHASE 1B ARTWORK:
CLOSED / PASS

BR-001 PHASE 1C RUNTIME CERTIFICATION:
CLOSED / PASS / SEALED

THIS PHASE CONSUMES THE ALREADY-CERTIFIED BR-001 ASSET.

DO NOT REDESIGN THE LOGO.
DO NOT MODIFY THE SEALED SOURCE.
DO NOT REGENERATE CERTIFIED DERIVATIVES UNLESS A HARD INTEGRITY FAILURE IS FOUND.
DO NOT REOPEN PHASE 1C.

THE PURPOSE OF THIS SLICE IS:

1. integrate BR-001 into MainMenuHome;
2. select and implement the minimum sufficient favicon consumer wiring;
3. validate desktop + narrow layouts;
4. preserve fallback/accessibility contracts;
5. stop before global BR-001 lifecycle closeout.

---

# 1. Mandatory Authority

Read first:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Read:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1_ART_BRIEF_REQUIREMENTS_AUDIT.md

Read:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1B_GEOMETRY_ASYMMETRY_DELTA_REPORT.md

Read:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1C_RUNTIME_CERTIFICATION_DERIVATIVE_CONTRACT_REPORT.md

Inspect:

docs/design/branding/BR-001_Logo.svg

apps/web/public/assets/branding/BR-001.svg

apps/web/public/favicon-16x16.png

apps/web/public/favicon-32x32.png

visual asset registry

MainMenuHome implementation

MainMenuHome styles

apps/web/src/app/layout.tsx

apps/web/src/app/** icon/favicon conventions

existing presentation asset components

existing tests for MainMenuHome / visual assets / metadata where relevant

Do not assume filenames or component APIs where repository inspection can
answer the question.

---

# 2. Locked Phase-1C Contract

Asset ID:

BR-001

Authoritative source:

docs/design/branding/BR-001_Logo.svg

SEALED source SHA-256:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Runtime SVG:

apps/web/public/assets/branding/BR-001.svg

Runtime path:

/assets/branding/BR-001.svg

Runtime SVG SHA-256:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Registry format:

svg

WebP:

null

Preload:

false

Historical BR-001 → MM-006 alias:

REMOVED

Do not change these facts unless hard repository evidence shows an integrity
failure.

---

# 3. Certified Favicon Derivative Candidates

Phase 1C produced and certified:

apps/web/public/favicon-16x16.png

SHA-256:

b4102b39cd782581cbbd131f70fc1cce06087c17e3c4b23c2b01616dafa8623d

and:

apps/web/public/favicon-32x32.png

SHA-256:

4a1a3e3dbdfb3ced65d1af2e900f1ec35a9b83752edbceeea50ae8166e5345c6

These are:

CERTIFIED DERIVATIVE CANDIDATES

They are NOT automatically both mandatory consumers.

Phase 1D must determine the minimum sufficient wired favicon set.

---

# 4. Hard Integrity Gate

Before implementation, verify:

SHA-256:

docs/design/branding/BR-001_Logo.svg

Expected:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Verify:

apps/web/public/assets/branding/BR-001.svg

Expected same hash:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Verify favicon hashes if files are present.

If either sealed source or certified runtime SVG differs:

STOP.

Report:

BLOCKED — BR-001 SEALED ASSET INTEGRITY FAILURE

Do not repair the artwork inside Phase 1D.

---

# 5. Consumer Audit Before Editing

Before changing code, inspect the actual MainMenuHome implementation.

Report internally:

- exact component path;
- existing brand/title markup;
- exact <h1> / product-title structure;
- surrounding layout container;
- existing spacing tokens;
- responsive/narrow behavior;
- whether an existing visual asset presentation component can render BR-001;
- whether PGVisualAssetImage is appropriate;
- whether any new component is actually necessary.

Also inspect the actual Next.js/App Router favicon architecture.

Determine:

- current Next.js metadata structure;
- whether metadata.icons is already used;
- whether app/icon.* convention is already used;
- whether public favicon files are automatically consumed;
- whether explicit metadata wiring is required;
- whether one or both certified PNGs are useful;
- whether the existing framework can use the certified runtime SVG directly;
- whether introducing a new SVG favicon or ICO would actually be necessary.

DO NOT IMPLEMENT UNTIL THIS AUDIT IS COMPLETE.

---

# 6. MainMenuHome Integration Goal

BR-001 should become the visible product brand symbol in MainMenuHome.

The existing visible text:

Project Genesis

remains AUTHORITATIVE.

Do not replace it with artwork.

The intended structure is conceptually:

[ BR-001 symbol ] [ Project Genesis ]

but use the repository's actual markup and layout conventions.

Do not blindly introduce this exact DOM structure if an existing structure
supports the requirement more cleanly.

---

# 7. Logo Presentation Contract

BR-001 is:

decorative product branding adjacent to visible authoritative product text.

Target visual height:

approximately 32–48px

Use the existing design/token system.

Do not hard-code arbitrary pixel geometry if suitable tokens/classes already
exist.

The logo should:

- remain square;
- preserve aspect ratio;
- not stretch;
- not crop;
- not receive a background plate;
- not receive shadow/glow;
- not be recolored;
- not animate;
- not rotate;
- not become interactive.

Do not add hover behavior.

Do not add a tooltip.

---

# 8. Existing Asset Infrastructure First

Prefer the existing presentation asset infrastructure.

If:

PGVisualAssetImage

or another established thin visual-asset component correctly supports:

- registry SVG assets;
- `webp: null`;
- decorative alt semantics;
- local load failure;

reuse it.

Do NOT create:

BR001Logo.tsx

ProjectGenesisLogo.tsx

BrandLogo.tsx

or another one-off wrapper unless the existing infrastructure genuinely
cannot satisfy the consumer contract.

Avoid unnecessary component proliferation.

---

# 9. Accessibility Contract

The visible text:

Project Genesis

already communicates the product name.

Therefore BR-001 must be decorative.

Use:

alt=""

and/or the repository-equivalent decorative semantics.

Do not give the symbol accessible text such as:

"Project Genesis logo"

when immediately adjacent to the visible Project Genesis heading.

Avoid duplicate screen-reader announcement.

Do not add ARIA roles without need.

---

# 10. Failure / Fallback Contract

BR-001 is additive presentation.

If:

- registry lookup fails;
- SVG request fails;
- image load fails;

the existing:

Project Genesis

text must remain visible and structurally unchanged.

Do not make the heading conditional on successful asset rendering.

Do not substitute another visual asset.

Specifically:

DO NOT FALL BACK TO MM-006.

A failed BR-001 image should result in:

TEXT REMAINS AUTHORITATIVE

not:

OLD PLACEHOLDER RETURNS.

Use existing asset-component error behavior if it already provides the
correct semantics.

---

# 11. MainMenu Layout

Integrate BR-001 with minimal layout change.

Strong preference:

existing title/brand container
+
small additive flex/inline-flex treatment.

Use existing spacing tokens.

Expected relationship:

symbol vertically aligned with Project Genesis heading.

Do not redesign the Main Menu.

Do not alter:

menu hierarchy;
background imagery;
button styling;
navigation;
content hierarchy;
MM-001;
MM-006;
MM-007.

This is a brand-symbol integration only.

---

# 12. Narrow / Responsive Behavior

Inspect the current narrow layout before editing.

The brand row must remain usable on narrow screens.

Do not assume desktop-only horizontal space.

Prefer:

- stable logo size;
- no overlap;
- no clipping;
- no title truncation introduced by BR-001;
- no unnecessary wrap between symbol and product name.

If the current responsive geometry requires a small scoped CSS adjustment,
make the minimum change.

Do not redesign the responsive menu.

---

# 13. Favicon Consumer Decision

After repository/framework audit, choose the MINIMUM SUFFICIENT favicon
consumer contract.

You must explicitly classify the final choice.

Possible outcomes include, but are not limited to:

A.
Wire only certified 32×32 PNG.

B.
Wire certified 16×16 + 32×32 PNG because framework/browser metadata has a
clear reason for both.

C.
Use an existing App Router file convention that consumes one certified
derivative without metadata duplication.

D.
Use the already-certified runtime SVG if repository/framework evidence makes
that the cleanest supported favicon consumer.

E.
No additional wiring is required because an existing framework convention
already consumes an appropriate certified asset.

Choose based on evidence.

Do not choose based on personal preference.

---

# 14. Favicon Minimality Rule

The existence of:

favicon-16x16.png

and:

favicon-32x32.png

does NOT mean both must be wired.

Prefer:

the smallest sufficient consumer set.

Avoid redundant declarations.

Avoid registering multiple equivalent favicon representations "for
compatibility" without repository/framework evidence.

---

# 15. No New Favicon Artwork

Do NOT create:

favicon.ico

apple-touch-icon.png

new SVG favicon

new 48×48 favicon

new 192×192 icon

new 512×512 icon

manifest icons

unless a HARD existing repository/framework requirement proves one is
necessary for the current browser favicon consumer.

If such an unexpected requirement is discovered:

STOP implementation of that new derivative.

Document it as:

PHASE 1D DERIVATIVE DELTA REQUIRED

Do not silently expand the certified asset family.

---

# 16. No Favicon Redesign

Whatever favicon representation is selected must use the existing certified
BR-001 geometry.

Do not:

- simplify it;
- remove a module;
- alter color;
- add a square background;
- add a circle;
- create a special favicon monogram;
- change padding artistically.

The artwork remains sealed.

---

# 17. Favicon Metadata Scope

If metadata wiring is required, modify the narrowest authoritative location.

Likely candidate:

apps/web/src/app/layout.tsx

but verify repository architecture first.

Do not create a parallel metadata system.

Preserve existing:

title;
description;
other metadata.

Only add the minimal icon declaration required.

Do not alter SEO copy.

---

# 18. Registry Scope

BR-001 registry entry is already Phase-1C certified.

Do not modify it unless consumer integration exposes a real defect.

Expected:

NO REGISTRY CHANGE.

Do not change:

path
format
webp
designSource
preload

merely because MainMenuHome now consumes the asset.

In particular:

preload remains FALSE

unless measured or repository-backed evidence requires changing it.

Consumer existence alone is not sufficient reason to enable preload.

---

# 19. Sync Scope

Do not modify sync tooling unless an actual Phase-1D integration defect is
found.

Expected:

NO SYNC CHANGE.

Certified derivatives already exist.

Do not regenerate them as part of normal Phase-1D implementation.

---

# 20. Source Artwork Scope

Do NOT modify:

docs/design/branding/BR-001_Logo.svg

Do NOT modify:

apps/web/public/assets/branding/BR-001.svg

Do NOT modify:

apps/web/public/favicon-16x16.png

Do NOT modify:

apps/web/public/favicon-32x32.png

Expected:

all certified asset hashes unchanged.

---

# 21. Targeted Tests

Add/update the minimum focused tests required for the actual integration.

At minimum cover MainMenuHome behavior:

1. Project Genesis text remains present.

2. BR-001 consumer is rendered through the expected asset infrastructure.

3. Brand artwork is decorative:
   alt="" or equivalent.

4. No MM-006 fallback is introduced.

5. Existing MainMenu behavior remains intact.

For favicon wiring:

test only if repository conventions support a meaningful stable automated
test.

Do not write brittle tests that duplicate Next.js internals.

If metadata is statically exported and easy to test, a focused assertion may
be appropriate.

Use judgment.

---

# 22. Existing Phase-1C Tests

Run the existing focused Phase-1C tests again.

Expected:

visual-asset-registry.test.ts

br001-runtime-certification.test.ts

must remain PASS.

Do not weaken their assertions to make Phase 1D pass.

---

# 23. Visual Runtime Evidence

Run the application using the repository-supported local workflow if
available.

Capture/inspect at minimum:

DESKTOP

and

NARROW viewport.

MainMenuHome must show:

- BR-001 symbol;
- Project Genesis text;
- correct alignment;
- no overlap;
- no clipping;
- no broken image;
- no unintended wrapping introduced by the integration.

Also inspect the browser favicon if the available environment allows reliable
verification.

Do not claim favicon visual runtime evidence if the environment does not
actually expose it.

Distinguish:

STATIC CONTRACT VERIFIED

from:

RUNTIME BROWSER VERIFIED.

---

# 24. Logo Load-Failure Validation

If the existing asset component has testable load-error behavior, verify that
failure of BR-001 does not remove the Project Genesis heading.

Do not introduce elaborate error-state UI.

Desired result:

brand image disappears/fails locally;
text remains.

If existing component behavior already guarantees this and is covered by
tests, document/reuse that evidence rather than duplicating machinery.

---

# 25. No Other Consumers

Do NOT integrate BR-001 into:

SplashScreen
Workspace header
loading screen
game HUD
settings
About page
Market
BuildingsScreen
ProductionScreen

Phase 1D authorizes:

MainMenuHome

plus:

browser favicon consumer

only.

No "icons everywhere" rollout.

---

# 26. No Lifecycle Closeout Yet

Do NOT modify:

VISUAL_ASSET_CATALOG.md
VISUAL_PRODUCTION_BACKLOG.md
VISUAL_ASSET_CHANGELOG.md

Do not globally close BR-001 Phase 1.

Phase 1D implementation must first receive external review.

Lifecycle closeout, if required, is a later DOC_ONLY step.

---

# 27. No Release Changes

Do not reopen V1.

Do not modify:

release documentation
release tags
version numbers
package versions
CHANGELOG policy

Do not create a new release.

BR-001 is post-V1 visual work.

---

# 28. Validation Commands

Run the narrowest task-relevant validation.

At minimum:

- focused MainMenuHome tests;
- Phase-1C registry/certification tests;
- appropriate web typecheck/build validation;
- any focused metadata test if added.

If build fails for the known host/environment:

EPERM on apps/web/.next/trace

classify it accurately.

Do not hide task-introduced failures behind the historical EPERM issue.

If a new failure appears before the known environmental failure:

treat it as task-introduced until proven otherwise.

---

# 29. Asset Integrity Recheck

At END of implementation verify SHA-256 again.

Source:

docs/design/branding/BR-001_Logo.svg

Expected:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Runtime:

apps/web/public/assets/branding/BR-001.svg

Expected:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Favicon 16:

apps/web/public/favicon-16x16.png

Expected:

b4102b39cd782581cbbd131f70fc1cce06087c17e3c4b23c2b01616dafa8623d

Favicon 32:

apps/web/public/favicon-32x32.png

Expected:

4a1a3e3dbdfb3ced65d1af2e900f1ec35a9b83752edbceeea50ae8166e5345c6

If any certified asset changed unexpectedly:

FAIL.

Do not certify Phase 1D.

---

# 30. Required Report

Create:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1D_MAIN_MENU_FAVICON_CONSUMER_INTEGRATION_REPORT.md

Required sections:

A. Executive Summary

B. Repository Baseline

C. Phase-1C Integrity Gate

D. MainMenuHome Consumer Audit

E. Existing Asset Infrastructure Decision

F. MainMenuHome Integration

G. Accessibility Contract

H. Failure / Fallback Contract

I. Responsive Geometry

J. Favicon Architecture Audit

K. Favicon Consumer Decision

L. Favicon Minimality Justification

M. Targeted Tests

N. Desktop Runtime Evidence

O. Narrow Runtime Evidence

P. Favicon Verification

Q. Asset Hash Integrity

R. Scope Verification

S. Repository Integrity

T. Deferred Work

U. Final Gate Recommendation

---

# 31. Required MainMenu Facts

Report:

Consumer:
MainMenuHome

Existing Project Genesis text preserved:
YES / NO

BR-001 visible:
YES / NO

Asset infrastructure used:

New one-off logo component created:
YES / NO

Expected:
NO unless strongly justified.

Decorative semantics:
YES / NO

alt:

MM-006 fallback:
YES / NO

Expected:
NO

Source artwork modified:
YES / NO

Expected:
NO

Runtime SVG modified:
YES / NO

Expected:
NO

Registry modified:
YES / NO

Expected:
NO unless real defect discovered.

Sync modified:
YES / NO

Expected:
NO unless real defect discovered.

---

# 32. Required Favicon Facts

Report:

Existing architecture before Phase 1D:

Selected consumer mechanism:

Selected favicon derivative(s):

16 PNG wired:
YES / NO

32 PNG wired:
YES / NO

Runtime SVG wired as favicon:
YES / NO

metadata.icons modified:
YES / NO

App Router icon convention used:
YES / NO

New derivative required:
YES / NO

Expected:
NO

favicon.ico created:
YES / NO

Expected:
NO

Apple-touch icon created:
YES / NO

Expected:
NO

Why this is the minimum sufficient wired set:

[repository-backed explanation]

---

# 33. Required Runtime Evidence

Report separately:

Desktop MainMenuHome:
PASS / FAIL / NOT AVAILABLE

Narrow MainMenuHome:
PASS / FAIL / NOT AVAILABLE

Browser favicon:
PASS / FAIL / STATIC CONTRACT ONLY / NOT AVAILABLE

Do not convert unavailable runtime evidence into PASS.

---

# 34. Scope Lock

Expected implementation changes should be small.

Potentially allowed:

- MainMenuHome component file;
- narrowly related MainMenu style file;
- layout.tsx or equivalent favicon metadata authority;
- focused MainMenu/metadata tests;
- Phase-1D report.

Only modify files actually required.

Forbidden unless hard defect discovered:

- BR-001 source SVG;
- BR-001 runtime SVG;
- favicon derivative bytes;
- registry;
- sync tooling.

Forbidden entirely:

- SplashScreen;
- MM-006;
- MM-001;
- MM-007;
- unrelated UI;
- gameplay;
- domain;
- API;
- YAML;
- ICON-001;
- ICON-002;
- release state.

---

# 35. Repository Integrity

At end run:

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

# 36. Commit Policy

DO NOT COMMIT.

DO NOT PUSH.

DO NOT TAG.

Phase 1D requires external review before sealing.

---

# 37. Final Decision Options

End the report with exactly one:

OPTION A —
BR-001 PHASE 1D CONSUMER INTEGRATION — PASS /
READY FOR PHASE-1 COVERAGE & CLOSEOUT REVIEW

OPTION B —
BR-001 PHASE 1D IMPLEMENTATION COMPLETE /
SMALL INTEGRATION DELTA REQUIRED

OPTION C —
BR-001 PHASE 1D BLOCKED /
CONSUMER CONTRACT DECISION REQUIRED

OPTION D —
BR-001 PHASE 1D FAIL /
SEALED ASSET INTEGRITY VIOLATION

Use OPTION A only if:

- sealed source/runtime hashes remain exact;
- MainMenuHome integration is visually and semantically correct;
- Project Genesis text remains authoritative;
- BR-001 is decorative;
- no MM-006 fallback exists;
- desktop evidence passes;
- narrow evidence passes;
- favicon decision is repository-backed;
- favicon wired set is minimal;
- no uncertified derivative was invented;
- focused tests pass;
- no task-introduced validation failure remains;
- scope is clean.

---

# 38. Execution Summary

Return:

# BR-001 Phase 1D — MainMenuHome + Favicon Consumer Integration
## Execution Summary

### Baseline

- Branch:
- HEAD:
- origin/master:
- unrelated dirty work:
- v1.0.0:
- v1.0.0-rc.1:
- tags moved:

### Integrity Gate

- source SVG SHA-256:
- source expected:
- runtime SVG SHA-256:
- runtime expected:
- favicon 16 SHA-256:
- favicon 32 SHA-256:
- integrity:

### MainMenuHome Audit

- component:
- title markup:
- asset infrastructure:
- responsive structure:
- new component required:

### MainMenuHome Integration

- BR-001 rendered:
- Project Genesis text preserved:
- decorative:
- alt:
- MM-006 fallback:
- layout change:
- CSS change:

### Favicon Audit

- existing favicon architecture:
- framework mechanism:
- certified candidates available:

### Favicon Decision

- selected mechanism:
- selected derivative(s):
- 16 PNG wired:
- 32 PNG wired:
- SVG wired:
- metadata.icons changed:
- App Router convention used:
- new derivative created:
- minimality rationale:

### Validation

- focused MainMenu tests:
- Phase-1C tests:
- metadata test:
- desktop runtime:
- narrow runtime:
- browser favicon:
- typecheck/build:

### Asset Integrity After Implementation

- source unchanged:
- runtime SVG unchanged:
- favicon 16 unchanged:
- favicon 32 unchanged:
- registry unchanged:
- sync unchanged:

### Scope

- SplashScreen changed:
- MM-006 changed:
- unrelated consumer changed:
- gameplay changed:
- domain changed:
- API changed:
- YAML changed:
- lifecycle closeout performed:

Expected:
NO for all.

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

BR-001 IS ALREADY DESIGNED AND CERTIFIED.

PHASE 1D IS CONSUMER INTEGRATION ONLY.

MAIN MENU:

ADD THE SYMBOL.
KEEP "PROJECT GENESIS".
MAKE THE SYMBOL DECORATIVE.
KEEP TEXT AS FALLBACK.
DO NOT RETURN TO MM-006.

FAVICON:

AUDIT FIRST.
WIRE THE MINIMUM SUFFICIENT CERTIFIED SET.
DO NOT ASSUME BOTH PNGS ARE REQUIRED.
DO NOT INVENT NEW DERIVATIVES.

KEEP ALL CERTIFIED ASSET HASHES EXACT.

VALIDATE DESKTOP.
VALIDATE NARROW.
VERIFY FAVICON CONTRACT.
TEST.
REPORT.
STOP.