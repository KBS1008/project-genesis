# Cursor Implementation Prompt
# Project Genesis — Post-V1 Visual Production

## BR-001 Phase 1C — Runtime Certification & Derivative Contract

MODE:
BOUNDED RUNTIME ASSET CERTIFICATION

BR-001 PHASE 1B ARTWORK IS CLOSED / PASS.

THE AUTHORITATIVE SVG MASTER IS SEALED.

DO NOT REDESIGN IT.
DO NOT EDIT ITS GEOMETRY.
DO NOT CHANGE ITS COLOR.
DO NOT REOPEN ART DIRECTION.

THIS PHASE CERTIFIES THE MASTER FOR RUNTIME USE AND ESTABLISHES THE
MINIMUM DERIVATIVE / REGISTRY / SYNC CONTRACT.

DO NOT INTEGRATE BR-001 INTO MAINMENUHOME IN THIS PHASE.

---

# 1. Purpose

BR-001 Phase 1B produced and externally approved the authoritative source
master:

docs/design/branding/BR-001_Logo.svg

Approved Phase-1B SHA-256:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

The previous candidate hash:

c8e10be0af9299451a5bf8f4f3c6e5748749968380f13ea99ce97d63f9b3a006

is SUPERSEDED / REJECTED and must never become runtime-certified.

Phase 1C must:

1. verify the approved SVG master is byte-identical to the sealed source;
2. determine the minimum repository-backed runtime derivative contract;
3. create only derivatives actually justified by known consumers;
4. establish/update registry metadata;
5. establish/update deterministic sync tooling as required;
6. validate source → derivative integrity;
7. certify the runtime asset family;
8. stop before consumer integration.

---

# 2. Mandatory Authority

Read first:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Read:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1_ART_BRIEF_REQUIREMENTS_AUDIT.md

Read:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1B_SVG_MASTER_RECONSTRUCTION_REPORT.md

Read:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1B_GEOMETRY_ASYMMETRY_DELTA_REPORT.md

Inspect current:

docs/design/branding/BR-001_Logo.svg

Also inspect only as needed:

- visual asset registry;
- existing visual asset sync tooling;
- existing favicon/app-icon handling;
- apps/web public/static asset conventions;
- layout metadata / favicon declarations;
- existing SVG/PNG/WebP derivative conventions;
- ICON-001 runtime certification pattern;
- ICON-002 runtime certification pattern.

Use repository evidence.

Do not invent a new visual-asset architecture if an existing one already
supports the requirement.

---

# 3. Hard Source Gate

BEFORE MAKING ANY CHANGE:

calculate SHA-256 of:

docs/design/branding/BR-001_Logo.svg

Expected exactly:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

If it does NOT match:

STOP.

Do not regenerate.
Do not normalize.
Do not pretty-print.
Do not repair.
Do not create derivatives.

Report:

BLOCKED — SEALED PHASE-1B SOURCE HASH MISMATCH

The Phase-1B master is immutable in Phase 1C.

---

# 4. Sealed Visual Contract

The source master is locked as:

Asset ID:
BR-001

Role:
PRODUCT / SHELL BRAND SYMBOL

Identity:
SYMBOL-FIRST

Concept:
MODULAR INDUSTRIAL

Major modules:
3

Perfect rotational symmetry:
NO

Primary source color:
#2563EB

Background:
TRANSPARENT

Text:
NONE

Authoritative format:
SVG

Do not alter any of these.

---

# 5. Source-of-Truth Contract

The ONLY authoritative artwork is:

docs/design/branding/BR-001_Logo.svg

All runtime files are:

DERIVATIVES

They must be reproducible from the authoritative SVG.

Do not independently edit runtime derivatives.

Do not allow a PNG/WebP/favicon derivative to become an alternate source of
truth.

The source SVG hash must remain unchanged throughout Phase 1C.

---

# 6. First Audit the Actual Runtime Need

Before creating files, inspect repository-backed future consumers.

Known Phase-1 direction includes:

A. MainMenuHome brand symbol

Expected display scale from Phase 1A:
approximately 2rem–3rem / ~32–48px high.

B. Browser/application favicon use

Expected minimum favicon-scale requirements:
16×16
32×32

However:

DO NOT blindly create every theoretically possible format.

Audit actual current web/runtime conventions first.

Determine:

- whether the browser/runtime can consume SVG directly;
- whether the existing registry supports SVG;
- whether MainMenuHome should use SVG directly;
- whether PNG and/or WebP adds actual value;
- which favicon formats the current framework/runtime supports;
- whether favicon files belong under public assets or framework metadata;
- whether ICO is actually required;
- whether 16/32 PNGs are actually required;
- whether a single SVG favicon is sufficient;
- whether browser/framework conventions impose special paths.

The output must be the MINIMUM SUFFICIENT DERIVATIVE SET.

---

# 7. Derivative Decision Rule

For each possible derivative classify:

REQUIRED
OPTIONAL / NOT NEEDED
DEFERRED

Evaluate at minimum:

- runtime SVG copy;
- PNG brand derivative;
- WebP brand derivative;
- 16×16 favicon PNG;
- 32×32 favicon PNG;
- SVG favicon;
- favicon.ico;
- apple-touch icon;
- larger application icon.

Do NOT create a format merely because it is common.

Every produced file must have a repository-backed reason.

---

# 8. Strong Default for Main Runtime Brand Asset

Because BR-001 is vector-first and must remain sharp at small UI scales:

prefer direct SVG runtime use unless existing repository architecture provides
a strong reason not to.

Do not rasterize the MainMenuHome brand symbol merely to imitate ICON-001.

ICON-001's PNG/WebP derivative contract is not automatically applicable to
BR-001.

BR-001 is a different asset class.

Likewise:

do not inherit ICON-002's inline-SVG strategy automatically unless repository
evidence supports it for BR-001.

Choose based on the actual consumer and architecture.

---

# 9. Favicon Contract

Favicons are derivatives of the SAME BR-001 symbol.

No favicon redesign is allowed.

Do not:

- simplify the mark into a different composition;
- remove a module;
- change spacing;
- create a special monogram;
- create another color treatment;
- add a background shape.

If raster favicon derivatives are required, they must be direct renders of
the sealed SVG master.

If an SVG favicon is sufficient under the actual framework/browser contract,
prefer avoiding redundant raster files unless repository evidence justifies
them.

---

# 10. Small-Size Fidelity

Any produced favicon/raster derivative must be visually checked at its native
size.

At minimum, where applicable:

16×16
32×32
48×48

Verify:

- three-part structure survives;
- central negative space remains open;
- no accidental path merging;
- no clipping;
- no opaque background;
- correct primary blue;
- silhouette remains recognizable.

Do not modify the SVG master to solve a derivative-generation issue.

If the sealed master unexpectedly fails a required runtime size:

STOP and report the problem.

Do not silently redesign Phase 1B.

---

# 11. Runtime Path Contract

Determine the correct runtime path from existing repository conventions.

Strong preference:

one clear BR-001 runtime namespace, for example:

/assets/branding/...

But DO NOT invent this path if the repository has an authoritative alternative.

Inspect existing visual assets first.

Use the narrowest convention consistent with current architecture.

Avoid:

- duplicate public copies in multiple directories;
- legacy aliases;
- arbitrary filename variants;
- version suffixes.

---

# 12. Registry Contract

Audit the existing visual asset registry.

BR-001 may already exist as a placeholder/alias pointing at MM-006 or another
temporary asset.

If so:

migrate BR-001 from placeholder semantics to its real certified runtime asset.

Do NOT create a second asset ID.

Asset ID remains:

BR-001

Registry metadata must accurately describe:

- asset role;
- runtime source/path;
- available formats;
- preload behavior;
- intended consumer class;
- fallback behavior if represented in the current registry schema.

Do not add registry fields unless genuinely required.

Use the existing schema.

---

# 13. MM-006 Placeholder Migration

Historically BR-001 may alias or reference MM-006.

Phase 1C must inspect this explicitly.

After Phase 1C:

BR-001 must NOT resolve to MM-006.

MM-006 remains:

SCENIC SPLASH BACKGROUND

BR-001 becomes:

DISCRETE PRODUCT BRAND SYMBOL

Do not modify MM-006 itself.

Do not delete MM-006.

Do not change SplashScreen behavior.

Only remove BR-001's placeholder/alias relationship if it currently exists.

---

# 14. Sync Tooling

Inspect existing visual asset synchronization tooling.

If runtime assets are generated/copied through a central sync mechanism:

extend that mechanism minimally for BR-001.

Requirements:

- deterministic;
- source-controlled contract;
- source remains authoritative;
- rerunning sync produces byte-stable outputs where technically applicable;
- no manual runtime-copy drift.

Do not create a parallel BR-001-only asset pipeline if the existing sync tool
can support it cleanly.

If no sync modification is necessary because runtime can consume the
authoritative SVG through an existing supported mechanism:

do not add tooling merely for symmetry with other asset families.

Document the decision.

---

# 15. Derivative Generation

If raster derivatives are REQUIRED:

generate them deterministically from:

docs/design/branding/BR-001_Logo.svg

Use existing repository tooling/dependencies where possible.

Do not introduce a heavyweight dependency for one logo.

Preserve:

- transparent background;
- correct aspect ratio;
- correct visual centering;
- #2563EB appearance;
- no added padding beyond the defined derivative geometry unless required by
  favicon/runtime convention.

Do not upscale a raster reference.

All derivatives originate from the SVG master.

---

# 16. No Reference PNG Promotion

The earlier image-generation PNG used during visual design was a:

DESIGN REFERENCE

It is NOT a production source.

Do not copy it into runtime assets.

Do not register it.

Do not derive runtime files from it.

Do not hash-certify it as BR-001 production art.

Only:

docs/design/branding/BR-001_Logo.svg

is authoritative.

---

# 17. Runtime SVG Fidelity

If a runtime SVG copy is created:

it must be byte-identical to the authoritative source unless existing sync
architecture requires deterministic transformation.

Strong preference:

BYTE-IDENTICAL COPY

If any transformation is unavoidable:

document exactly why and verify visual/structural equivalence.

Do not optimize/minify the runtime SVG merely for convenience if that creates
an unnecessary second byte representation.

---

# 18. Preload Policy

Do not assume BR-001 should be preload=true.

Determine from actual intended usage and existing registry semantics.

MainMenuHome is an early shell consumer, but that alone does not automatically
justify preload.

Record:

preload:
TRUE / FALSE

with repository-backed reasoning.

Do not optimize speculatively.

---

# 19. Fallback Contract

This phase may establish the future asset-level fallback contract, but must
not integrate it into MainMenuHome yet.

Preferred principle:

brand artwork is additive presentation.

The existing HTML:

Project Genesis

must remain authoritative in the future consumer.

Therefore failure to load BR-001 must never remove the product name.

If registry lookup/runtime image load fails in future integration:

text remains.

Do not implement that consumer behavior yet.

Document it for Phase 1D.

---

# 20. Accessibility Contract

BR-001 next to the existing visible "Project Genesis" heading is expected to
be decorative/redundant branding.

Therefore future MainMenuHome integration should normally use:

alt=""

and/or equivalent decorative semantics

so screen readers do not announce:

"Project Genesis Project Genesis"

twice.

Do not implement consumer accessibility changes in Phase 1C.

Record the contract for Phase 1D.

Favicon accessibility is governed by browser metadata, not image alt text.

---

# 21. No MainMenuHome Integration

DO NOT modify:

MainMenuHome
MainMenu screen/component
brand markup
<h1>Project Genesis</h1>
CSS
responsive layout
visual spacing
hover/focus states

Phase 1C ends with runtime readiness only.

Consumer integration belongs to a later bounded phase.

---

# 22. No Splash Integration

Do not modify:

SplashScreen

Do not place BR-001 over MM-006.

Do not alter splash composition.

Splash usage remains deferred unless a later explicit slice authorizes it.

---

# 23. No Lifecycle Closeout

Do NOT yet close BR-001 Phase 1 globally.

Do not perform broad lifecycle closeout.

Lifecycle documentation should only be changed in Phase 1C if an existing
production workflow requires precise runtime-certification metadata there.

Prefer a dedicated Phase-1C certification report.

Do not mark MainMenu integration complete.

---

# 24. Tests

Add or update only targeted tests justified by the runtime contract.

Potential test targets include:

- BR-001 registry entry resolves to correct runtime path;
- BR-001 no longer aliases MM-006;
- sync contract includes BR-001 if applicable;
- generated derivative dimensions/formats are correct;
- source hash remains sealed;
- expected runtime files exist.

Do not add broad UI tests.

Do not add MainMenuHome tests.

Do not alter gameplay tests.

Keep the test package narrow.

---

# 25. Source Integrity Test

At the END of implementation recalculate:

SHA-256:

docs/design/branding/BR-001_Logo.svg

It MUST still equal:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

If it differs:

PHASE 1C FAILS.

Do not certify.

---

# 26. Runtime Hashes

For every runtime file produced, calculate SHA-256.

Report:

filename
format
dimensions if raster
SHA-256
relationship to source

For byte-identical SVG copies, explicitly verify equality.

For deterministic raster derivatives, record generation settings.

---

# 27. Certification Matrix

Create a certification matrix containing at least:

SOURCE MASTER
RUNTIME SVG
PNG
WEBP
FAVICON SVG
FAVICON 16
FAVICON 32
ICO
APPLE TOUCH ICON

For each classify:

PRODUCED / CERTIFIED
NOT REQUIRED
DEFERRED

Do not leave ambiguous formats.

---

# 28. Scope Lock

Allowed implementation scope is only what is required for:

- BR-001 runtime asset(s);
- BR-001 registry migration;
- BR-001 sync tooling;
- narrowly required asset tests;
- Phase-1C certification report.

Potentially allowed files therefore include existing repository locations for:

- public/runtime branding asset(s);
- visual asset registry;
- visual asset sync tool;
- focused tests.

Do not assume all are required.

Modify the minimum set.

Explicitly forbidden:

- MainMenuHome consumer integration;
- MainMenu CSS;
- SplashScreen integration;
- gameplay;
- domain;
- API;
- YAML;
- unrelated visual assets;
- ICON-001;
- ICON-002;
- release tags;
- release reopening.

---

# 29. Required Report

Create:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1C_RUNTIME_CERTIFICATION_DERIVATIVE_CONTRACT_REPORT.md

Required sections:

A. Executive Summary

B. Repository Baseline

C. Phase-1B Source Gate

D. Runtime Consumer Audit

E. Existing Asset Architecture

F. Derivative Decision Matrix

G. Runtime Path Contract

H. Registry Migration

I. MM-006 Placeholder Separation

J. Sync Contract

K. Derivative Generation Contract

L. Favicon Contract

M. Preload Decision

N. Fallback / Accessibility Contract for Phase 1D

O. Targeted Tests

P. Source Integrity Verification

Q. Runtime Hash Certification

R. Scope Verification

S. Repository Integrity

T. Deferred Work

U. Final Gate Recommendation

---

# 30. Required Source Facts

Report exactly:

Asset ID:
BR-001

Authoritative source:
docs/design/branding/BR-001_Logo.svg

Expected sealed source SHA-256:
e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Starting source SHA-256:

Ending source SHA-256:

Source hash unchanged:
YES / NO

Previous rejected hash:
c8e10be0af9299451a5bf8f4f3c6e5748749968380f13ea99ce97d63f9b3a006

Rejected hash used anywhere:
YES / NO

Expected:
NO

---

# 31. Required Runtime Facts

Report:

Runtime SVG:
PRODUCED / NOT REQUIRED / DEFERRED

PNG:
PRODUCED / NOT REQUIRED / DEFERRED

WebP:
PRODUCED / NOT REQUIRED / DEFERRED

Favicon SVG:
PRODUCED / NOT REQUIRED / DEFERRED

16×16 PNG:
PRODUCED / NOT REQUIRED / DEFERRED

32×32 PNG:
PRODUCED / NOT REQUIRED / DEFERRED

favicon.ico:
PRODUCED / NOT REQUIRED / DEFERRED

Apple-touch icon:
PRODUCED / NOT REQUIRED / DEFERRED

Registry entry:
UPDATED / UNCHANGED / NOT REQUIRED

BR-001 → MM-006 alias remains:
YES / NO

Expected after successful certification:
NO

Sync tooling:
UPDATED / UNCHANGED / NOT REQUIRED

Preload:
TRUE / FALSE

MainMenuHome integrated:
NO

SplashScreen integrated:
NO

---

# 32. Required Validation

Run all task-relevant:

- focused tests;
- asset sync/check command if applicable;
- SVG validation;
- derivative dimension checks;
- hash checks.

Also run the narrowest appropriate build/typecheck validation required by the
changed runtime infrastructure.

Do not turn historical root build/typecheck/lint debt into a BR-001 blocker
unless the task introduces a new failure.

Clearly distinguish:

PRE-EXISTING FAILURE

from:

TASK-INTRODUCED FAILURE.

---

# 33. Visual Runtime Check

For every produced visual derivative, inspect it.

Where applicable inspect at:

48px
32px
16px

Confirm:

- no clipping;
- transparent background where expected;
- recognizable three-module symbol;
- central negative space open;
- no accidental blur caused by incorrect scaling;
- no unexpected color change.

Do not claim visual PASS based only on file existence.

---

# 34. Repository Integrity

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

# 35. Commit Policy

DEFAULT:

DO NOT COMMIT.

DO NOT PUSH.

DO NOT TAG.

Phase 1C requires external review before sealing.

Do not move release tags under any circumstance.

---

# 36. Final Decision Options

The report must end with exactly one:

OPTION A —
BR-001 PHASE 1C RUNTIME CERTIFICATION — PASS /
READY FOR CONSUMER INTEGRATION

OPTION B —
BR-001 PHASE 1C TECHNICALLY COMPLETE /
SMALL CERTIFICATION DELTA REQUIRED

OPTION C —
BR-001 PHASE 1C BLOCKED /
RUNTIME CONTRACT DECISION REQUIRED

OPTION D —
BR-001 PHASE 1C FAIL /
SEALED SOURCE INTEGRITY VIOLATION

Use OPTION A only if:

- sealed source hash matches before and after;
- derivative contract is evidence-backed;
- all required runtime files exist;
- runtime files derive only from sealed SVG;
- registry is correct;
- BR-001 no longer aliases MM-006;
- sync contract is correct if applicable;
- required focused tests pass;
- visual derivative checks pass;
- no consumer integration occurred;
- no unrelated scope was modified.

---

# 37. Execution Summary

Return:

# BR-001 Phase 1C — Runtime Certification & Derivative Contract
## Execution Summary

### Baseline

- Branch:
- HEAD:
- origin/master:
- unrelated dirty work:
- v1.0.0:
- v1.0.0-rc.1:
- tags moved:

### Sealed Source

- source:
- expected SHA-256:
- starting SHA-256:
- ending SHA-256:
- unchanged:
- rejected candidate used:

### Runtime Audit

- direct SVG suitable:
- runtime asset architecture:
- favicon architecture:
- minimum required derivative set:

### Certification Matrix

- runtime SVG:
- PNG:
- WebP:
- favicon SVG:
- favicon 16:
- favicon 32:
- favicon.ico:
- apple-touch icon:

### Registry

- BR-001 entry:
- previous placeholder:
- MM-006 alias removed:
- runtime path:
- formats:
- preload:

### Sync

- sync tooling changed:
- deterministic:
- source authoritative:
- byte-identical SVG copy:

### Runtime Hashes

- file:
- SHA-256:

Repeat for each produced runtime file.

### Validation

- focused tests:
- sync/check:
- SVG validation:
- derivative dimensions:
- 48px visual:
- 32px visual:
- 16px visual:
- build/typecheck:

### Scope

- source artwork changed:
- MainMenuHome changed:
- CSS changed:
- SplashScreen changed:
- gameplay changed:
- domain changed:
- API changed:
- YAML changed:
- lifecycle closeout performed:

Expected:
NO for all above.

### Repository Integrity

- task-owned files:
- unrelated files modified:
- commit:
- push:
- tags moved:

### Final Decision

OPTION A / B / C / D

STOP.

---

# CORE PRINCIPLE

THE ART IS FINISHED.

PHASE 1C MUST NOT DESIGN ANYTHING.

THE SEALED SOURCE HASH IS:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

VERIFY IT FIRST.

KEEP IT BYTE-IDENTICAL.

DERIVE ONLY WHAT THE RUNTIME ACTUALLY NEEDS.

DO NOT COPY ICON-001 OR ICON-002 CONTRACTS BLINDLY.

BR-001 IS A VECTOR-FIRST BRAND ASSET.

REMOVE THE HISTORICAL MM-006 PLACEHOLDER RELATIONSHIP.

ESTABLISH A DETERMINISTIC RUNTIME CONTRACT.

CERTIFY HASHES.

DO NOT INTEGRATE MAINMENUHOME YET.

DO NOT TOUCH THE RELEASE.

AUDIT.
DERIVE.
REGISTER.
SYNC.
VALIDATE.
CERTIFY.
REPORT.
STOP.