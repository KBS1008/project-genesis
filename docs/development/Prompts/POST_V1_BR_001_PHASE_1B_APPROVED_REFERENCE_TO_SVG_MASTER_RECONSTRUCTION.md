# Cursor Implementation Prompt
# Project Genesis — Post-V1 Visual Production

## BR-001 Phase 1B — Approved Reference → SVG Master Reconstruction

MODE:
BOUNDED VECTOR RECONSTRUCTION

THIS IS NOT A LOGO DESIGN TASK.

THE VISUAL DESIGN IS ALREADY APPROVED.

RECONSTRUCT THE APPROVED REFERENCE AS A CLEAN AUTHORITATIVE SVG MASTER.

DO NOT REDESIGN.
DO NOT EXPLORE.
DO NOT GENERATE ALTERNATIVES.

---

# 1. Purpose

BR-001 Phase 1A Art Brief is complete.

BR-001 visual concept exploration is complete.

The approved visual reference is the latest externally approved BR-001 image:

BR-001_Logo.png

It represents the selected final direction:

- symbol-first;
- modular industrial;
- three engineered modules;
- asymmetric construction;
- open outer silhouette;
- central negative-space channel;
- primary blue #2563EB;
- no wordmark;
- no literal gameplay semantics.

Your task is to reconstruct that approved visual reference as one clean SVG master.

---

# 2. Critical Authority Rule

THE APPROVED IMAGE IS THE VISUAL AUTHORITY.

Do not reinterpret the earlier Cursor-generated BR-001 SVG.

That earlier SVG is visually rejected and must be treated as:

SUPERSEDED / NOT FOR CERTIFICATION

Do not reuse its geometry unless some incidental coordinate happens to match the approved reference.

The approved reference image overrides any previous failed Phase-1B geometry.

---

# 3. Mandatory Repository Authority

Read:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Read:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1_ART_BRIEF_REQUIREMENTS_AUDIT.md

Inspect the currently existing:

docs/design/branding/BR-001_Logo.svg

if present.

Its current geometry is NOT authoritative if it is the previously rejected version.

Also inspect repository status before changing anything.

Do not reopen:

- BR-001 prioritization;
- Phase 1A identity model;
- concept selection;
- color selection;
- ICON-001;
- ICON-002;
- V1 release state.

---

# 4. Approved Visual Direction

Treat the following as locked.

Asset:

BR-001 — Project Genesis Brand Symbol

Identity model:

SYMBOL-FIRST

Concept:

MODULAR INDUSTRIAL

Primary color:

#2563EB

Artwork text:

NONE

Major components:

EXACTLY THREE

Core reading:

THREE ENGINEERED COMPONENTS
ASSEMBLED INTO ONE COHERENT SYSTEM

Do not change this.

---

# 5. Visual Structure to Preserve

The approved reference contains:

- one upper/right vertical-angular module;
- one left/upper horizontal-angular module;
- one lower/right horizontal-angular module;
- a shared central negative-space channel;
- intentional asymmetry;
- similar but not mechanically identical mass proportions;
- an open, non-contained outer silhouette;
- no enclosing geometric frame.

Preserve the overall spatial relationship.

The final SVG must visually match the reference at normal viewing size.

---

# 6. Do NOT Redesign

Do not:

- invent a fourth module;
- remove one of the three modules;
- make all three modules exact rotational copies;
- make the design perfectly rotationally symmetric;
- turn components into arrows;
- convert the mark into a hexagon;
- add a circle or badge;
- add a wordmark;
- add "PG";
- add "Project Genesis";
- add internal decoration;
- change the concept.

Do not "improve" the mark into a different logo.

This is reconstruction, not ideation.

---

# 7. Allowed Geometric Normalization

You MAY perform small geometric cleanup required to convert the raster reference into clean vector geometry.

Allowed:

- straighten intended edges;
- normalize nearly identical angles;
- remove raster anti-aliasing artifacts;
- make spacing intentional and consistent;
- align obvious shared axes;
- simplify tiny raster irregularities;
- make corner joins geometrically clean;
- adjust sub-pixel inconsistencies;
- ensure negative-space widths are robust.

These changes must be OPTICAL CLEANUP only.

They must not alter the recognizable composition.

---

# 8. Visual Similarity Rule

At approximately:

256 px display size

the reconstructed SVG should be immediately recognizable as the same approved symbol.

A reviewer should not reasonably describe it as:

"a new variation"

or:

"a redesign."

If the reconstruction noticeably changes silhouette, proportions, or module relationship:

revise it.

---

# 9. SVG Master Path

Authoritative target:

docs/design/branding/BR-001_Logo.svg

If that file already contains the rejected Cursor version:

OVERWRITE IT with the approved reconstruction.

Do not archive the rejected SVG unless an existing repository policy explicitly requires archival.

Do not create:

BR-001_Logo_v2.svg
BR-001_Final.svg
BR-001_New.svg
BR-001_Approved.svg

There must be exactly one authoritative source path.

---

# 10. Source Contract

The final file must be:

clean SVG vector artwork

with:

- explicit viewBox;
- transparent background;
- no raster image;
- no external linked assets;
- no external fonts;
- no <text>;
- no filters;
- no shadows;
- no gradients;
- no masks unless strictly necessary;
- no clipping path unless strictly necessary;
- no editor-specific metadata dependency.

Prefer simple path geometry.

Keep markup readable and deterministic.

---

# 11. Color Contract

Use:

#2563EB

as the master presentation color.

No gradients.

No secondary colors.

No opacity tricks.

The symbol geometry must also remain valid when recolored fully black or fully white.

Do not create separate monochrome files.

---

# 12. Background Contract

The SVG background must be transparent.

Do not include:

- white background rectangle;
- panel;
- bounding box;
- badge;
- decorative frame.

The white seen in the reference image is presentation background only.

It is NOT part of the artwork.

---

# 13. Component Count

The final SVG must visually contain:

EXACTLY THREE MAJOR BLUE MODULES.

They may each be represented by one path or multiple path segments if technically necessary.

However:

prefer one coherent vector shape per module.

Do not artificially fragment modules.

---

# 14. Negative Space

The central negative-space channel is a defining design feature.

Preserve it.

It must:

- remain clearly open;
- remain visually continuous;
- separate the three modules;
- survive small-size rendering;
- not collapse at 16 px.

Do not fill it.

Do not reduce it to tiny channels.

Do not turn it into a perfect circular or triangular spinner center.

---

# 15. Asymmetry

The approved design intentionally avoids perfect rotational symmetry.

Preserve this.

Do not construct:

one module
→ duplicated
→ rotated 120°
→ duplicated
→ rotated 120°

That would return the mark to a generic process/spinner identity.

The modules may share visual language, but their proportions/positions are intentionally not perfectly rotational.

---

# 16. Small-Size Requirement

After reconstruction, test rasterized previews at:

48×48
32×32
16×16

Temporary preview files are allowed locally for inspection.

They must not remain as production artifacts.

At each size check:

- silhouette remains recognizable;
- modules remain distinct;
- central negative space stays open;
- no accidental merging;
- no tiny unusable detail;
- mark still reads as one coherent symbol.

Especially at 16×16:

the form must remain structurally readable.

Do not redesign the artwork solely to maximize 16px perfection.

Only apply minimal optical normalization if needed.

---

# 17. Reference Comparison

Perform a visual comparison between:

approved BR-001_Logo.png reference

and

reconstructed BR-001_Logo.svg rendered at comparable size.

Report any deliberate deviations.

Expected:

NONE beyond geometric cleanup.

If deviations exist, classify them:

- raster artifact removal;
- spacing normalization;
- corner cleanup;
- small-size robustness.

Do not hide larger differences.

---

# 18. No Auto-Trace

Do NOT use a naive automatic image trace and accept the result.

Do NOT embed traced raster noise.

The reference contains anti-aliasing and raster rendering artifacts.

Reconstruct the intended geometry manually or with controlled vector geometry.

The final SVG should look designed, not traced.

---

# 19. No Runtime Work

Do NOT create:

PNG runtime derivative
WebP runtime derivative
favicon PNG
favicon.ico
SVG favicon

Do NOT modify:

visual asset registry
sync tooling
MainMenuHome
layout.tsx
CSS
preload configuration

Those belong to Phase 1C / 1D after SVG approval.

---

# 20. No Lifecycle Closeout

Do NOT modify:

VISUAL_ASSET_CATALOG.md
VISUAL_PRODUCTION_BACKLOG.md
VISUAL_ASSET_CHANGELOG.md

Do not mark BR-001 Phase 1 closed.

Only Phase 1B SVG reconstruction is in scope.

---

# 21. Scope Lock

Allowed task-owned production file:

docs/design/branding/BR-001_Logo.svg

Allowed task-owned report:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1B_SVG_MASTER_RECONSTRUCTION_REPORT.md

No other task-owned files.

Do not modify:

apps/web/**
packages/**
gameplay/**
domain/**
API/**
YAML
tests
runtime assets
release docs
MM-001
MM-006
MM-007

---

# 22. Validation

At minimum verify:

- SVG parses successfully;
- explicit viewBox exists;
- transparent background;
- exactly three major visual modules;
- no <text>;
- no <image>;
- no external href;
- no external resources;
- no embedded raster;
- no gradients;
- no filter effects;
- primary fill #2563EB;
- geometry fits within viewBox;
- no unintended clipping.

Use existing repository tooling if suitable.

Do not add dependencies.

---

# 23. Raster Inspection

Create temporary raster renders from the final SVG at:

256×256
48×48
32×32
16×16

Use them only for validation.

Do not stage them.

Delete them before repository integrity check.

Inspect:

256:
reference similarity

48:
main-menu scale

32:
favicon-scale legibility

16:
minimum-size structural survival

---

# 24. Monochrome Inspection

Temporarily render or inspect the same geometry as:

black

and

white.

Do not create permanent variant files.

Expected:

same recognizable geometry.

If the mark depends on blue to remain coherent:

FAIL.

---

# 25. Hash

After the SVG is final:

calculate SHA-256 for:

docs/design/branding/BR-001_Logo.svg

Record it in the report.

This is the candidate Phase-1B source hash.

Do NOT call it runtime certification yet.

---

# 26. Report

Create:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1B_SVG_MASTER_RECONSTRUCTION_REPORT.md

Required sections:

A. Executive Summary

B. Repository Baseline

C. Approved Visual Reference

D. Superseded Previous SVG State

E. Reconstruction Method

F. Geometry Description

G. Deviations From Reference

H. SVG Technical Validation

I. 256px Reference Comparison

J. 48px Review

K. 32px Review

L. 16px Review

M. Monochrome Review

N. MM-006 Separation

O. Scope Verification

P. SHA-256

Q. Repository Integrity

R. Final Status

---

# 27. Required Report Facts

Report:

Asset ID:
BR-001

Authoritative SVG:
docs/design/branding/BR-001_Logo.svg

Approved reference:
BR-001_Logo.png

Previous Cursor SVG:
SUPERSEDED / REPLACED

Identity model:
SYMBOL-FIRST

Concept:
MODULAR INDUSTRIAL

Major modules:
3

Perfect rotational symmetry:
NO

Primary color:
#2563EB

Transparent background:
YES

Embedded text:
NO

Embedded raster:
NO

External resources:
NO

Reference similarity:
PASS / FAIL

48px:
PASS / FAIL

32px:
PASS / FAIL

16px:
PASS / FAIL

Black monochrome:
PASS / FAIL

White monochrome:
PASS / FAIL

MM-006 reused:
NO

---

# 28. Visual Status

Do not declare final human approval.

If local checks pass, use:

RECONSTRUCTED — PENDING CHATGPT / HUMAN SVG VISUAL REVIEW

Do not use:

CERTIFIED
SEALED
FINAL APPROVED

Those require external review.

---

# 29. Repository Integrity

Run:

git status --short
git diff --stat
git diff --name-only
git diff --staged
git rev-parse HEAD
git rev-parse origin/master
git rev-list -n 1 v1.0.0
git rev-list -n 1 v1.0.0-rc.1

Expected task-owned files only:

docs/design/branding/BR-001_Logo.svg

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1B_SVG_MASTER_RECONSTRUCTION_REPORT.md

Preserve unrelated dirty work.

Do not clean unrelated files.

---

# 30. Commit Policy

DO NOT COMMIT.

DO NOT PUSH.

DO NOT TAG.

Do not move:

v1.0.0

v1.0.0-rc.1

The reconstructed SVG must remain available for external review first.

---

# 31. Execution Summary

Return:

# BR-001 Phase 1B — Approved Reference → SVG Master Reconstruction
## Execution Summary

### Baseline

- Branch:
- HEAD:
- origin/master:
- unrelated dirty work:
- v1.0.0:
- v1.0.0-rc.1:
- tags moved:

### Reference

- approved reference located:
- approved reference filename:
- previous SVG existed:
- previous SVG status:
- redesign performed:

Expected:
NO for redesign performed.

### SVG Master

- path:
- format:
- viewBox:
- major modules:
- primary color:
- transparent background:
- text:
- embedded raster:
- external resources:
- gradients:
- filters:

### Geometry

- three-module structure preserved:
- asymmetry preserved:
- central negative space preserved:
- open outer silhouette preserved:
- substantial deviation from approved reference:

Expected:
NO for substantial deviation.

### Visual Checks

- 256px reference similarity:
- 48px:
- 32px:
- 16px:
- black:
- white:

### Technical Validation

- SVG parse:
- explicit viewBox:
- clipping:
- external refs:
- SHA-256:

### Scope

- PNG created:
- WebP created:
- favicon created:
- registry changed:
- sync tooling changed:
- consumer changed:
- CSS changed:
- lifecycle docs changed:
- MM-006 changed:

Expected:
NO for all.

### Repository Integrity

- SVG modified:
- report created:
- unrelated files modified:
- commit:
- push:
- tags moved:

### Final Status

RECONSTRUCTED — PENDING CHATGPT / HUMAN SVG VISUAL REVIEW

STOP.

---

# CORE RULE

THE DESIGN IS ALREADY SELECTED.

DO NOT DESIGN A LOGO.

RECONSTRUCT THE APPROVED LOGO.

PRESERVE:

THREE MODULES
ASYMMETRY
CENTRAL NEGATIVE SPACE
OPEN SILHOUETTE
#2563EB
TEXT-FREE GEOMETRY

REMOVE ONLY RASTER IMPRECISION.

DO NOT MAKE CREATIVE CHANGES.

CREATE ONE CLEAN SVG MASTER.

VALIDATE IT.

HASH IT.

REPORT IT.

THEN STOP.