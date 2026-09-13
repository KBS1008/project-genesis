# Cursor Delta Prompt
# Project Genesis — BR-001 Phase 1B

## Geometry Asymmetry Delta

MODE:
BOUNDED GEOMETRY CORRECTION

THIS IS NOT A REDESIGN.

DO NOT REOPEN ART DIRECTION.
DO NOT CREATE NEW CONCEPTS.
DO NOT CHANGE COLOR.
DO NOT CHANGE MODULE COUNT.
DO NOT CHANGE ASSET ROLE.
DO NOT PROCEED TO PHASE 1C.

---

# 1. Reason for Delta

The current BR-001 SVG reconstruction is technically clean but fails one
important visual requirement.

Current reconstruction method:

- one base module
- duplicated
- rotated by 120°
- duplicated
- rotated by 240°

This creates:

PERFECT THREE-FOLD ROTATIONAL SYMMETRY

The approved visual direction explicitly requires:

CONTROLLED ASYMMETRY

The mark must read as:

ENGINEERED ASSEMBLY

not:

PROCESS / SYNC / SPINNER SYMBOL

The current Phase-1B candidate hash:

c8e10be0af9299451a5bf8f4f3c6e5748749968380f13ea99ce97d63f9b3a006

is NOT approved for Phase 1C.

---

# 2. Authority

Read:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Read:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1B_SVG_MASTER_RECONSTRUCTION_REPORT.md

Read:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1_ART_BRIEF_REQUIREMENTS_AUDIT.md

Inspect:

docs/design/branding/BR-001_Logo.svg

The approved BR-001 visual direction remains:

- symbol-first
- modular industrial
- three engineered modules
- open outer silhouette
- central negative-space channel
- primary blue #2563EB
- transparent background
- no text
- no literal gameplay object

All of that remains LOCKED.

---

# 3. Exact Problem to Fix

Current problem:

all three modules are mathematically identical rotated copies.

That must change.

The final mark must NOT have exact 120° rotational symmetry.

Do not construct it as:

module A
→ rotate 120°
→ module B
→ rotate 120°
→ module C

At least two of the three modules must differ geometrically in a meaningful but
subtle way.

---

# 4. What Must Be Preserved

Preserve:

- exactly 3 major blue modules
- the overall approved silhouette family
- central negative-space channel
- open outer silhouette
- modular/interlocking relationship
- approximately square footprint
- bold mass-based geometry
- small-size readability
- #2563EB
- transparent background

Do not make the result look like a new logo.

---

# 5. Allowed Asymmetry Adjustments

You MAY make small controlled changes to individual modules, such as:

- slightly different arm lengths;
- slightly different outer extents;
- slightly different elbow positions;
- slightly different inner return lengths;
- slightly different distance from center;
- slightly different visual mass.

Use only what is needed.

The result should still clearly belong to the same selected D concept.

---

# 6. Preferred Structural Principle

Use:

SHARED DESIGN LANGUAGE
WITHOUT IDENTICAL GEOMETRY

The modules should look related because they use:

- the same angle family;
- the same stroke/mass language;
- the same corner logic;
- the same overall industrial geometry.

But they should not be clones.

Think:

three coordinated engineered components

not:

three copies of one rotating element.

---

# 7. Negative Space Requirement

The central negative-space channel remains a defining feature.

Preserve it.

Ensure:

- it remains continuous;
- it remains open at 16px;
- it does not become circular;
- it does not become a perfect triangular spinner center;
- it does not create obvious arrowheads.

A small amount of asymmetry in the channel is desirable if it helps remove the
spinner/process reading.

---

# 8. Do Not Overcorrect

Do NOT:

- make modules dramatically different;
- break the family resemblance;
- add a fourth module;
- remove a module;
- introduce curved geometry;
- add decoration;
- create detached small pieces;
- create a wordmark;
- create letters;
- turn the mark into a building;
- turn the mark into arrows;
- enclose it in a badge;
- change concept direction.

This is a delta, not a redesign.

---

# 9. Technical SVG Contract

Keep:

docs/design/branding/BR-001_Logo.svg

as the single authoritative source path.

SVG must still have:

- explicit viewBox
- transparent background
- exactly 3 major blue paths/shapes
- fill #2563EB
- no <text>
- no <image>
- no raster
- no external resources
- no gradients
- no filters
- no shadows
- no background rectangle

---

# 10. Visual Validation

Render temporary previews at:

256×256
48×48
32×32
16×16

Check:

256px:
- clearly same BR-001 selected design family
- no longer perfectly rotationally symmetric
- less spinner/process reading
- still visually balanced

48px:
- modules distinct
- central channel open
- strong menu-brand readability

32px:
- coherent favicon-scale silhouette

16px:
- three-part structure still survives
- negative space remains open
- no accidental merges

Temporary previews must be deleted before integrity check.

---

# 11. Required Comparison

Compare:

CURRENT pre-delta SVG

against

UPDATED delta SVG

Report specifically:

- which module geometries changed;
- which dimensions/proportions changed;
- how perfect rotational symmetry was removed;
- whether outer silhouette changed substantially;
- whether central negative space changed;
- whether small-size readability changed.

Expected:

substantial concept change:
NO

perfect rotational symmetry after delta:
NO

---

# 12. Success Criteria

PASS only if all are true:

- exactly 3 modules remain;
- modules share one coherent visual language;
- modules are NOT three identical rotated copies;
- no exact 120° rotational symmetry remains;
- central negative space remains open;
- silhouette remains recognizably BR-001 D-family;
- 48px passes;
- 32px passes;
- 16px passes;
- no new gameplay/object semantics appear;
- no runtime work performed.

---

# 13. Hash

After finalizing the delta:

calculate SHA-256 of:

docs/design/branding/BR-001_Logo.svg

Record:

- old candidate hash
- new candidate hash

The new hash is still only:

PHASE-1B CANDIDATE SOURCE HASH

Do not call it runtime certification.

---

# 14. Report

Create:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1B_GEOMETRY_ASYMMETRY_DELTA_REPORT.md

Required sections:

A. Executive Summary

B. Baseline

C. Delta Reason

D. Pre-Delta Geometry

E. Geometry Changes

F. Asymmetry Verification

G. Negative Space Verification

H. 256px Comparison

I. 48px Review

J. 32px Review

K. 16px Review

L. Technical SVG Validation

M. Hash Delta

N. Scope Verification

O. Repository Integrity

P. Final Status

---

# 15. Required Report Facts

Report:

Asset ID:
BR-001

Source:
docs/design/branding/BR-001_Logo.svg

Pre-delta hash:
c8e10be0af9299451a5bf8f4f3c6e5748749968380f13ea99ce97d63f9b3a006

New hash:

Major modules:
3

Identical rotated copies before:
YES

Identical rotated copies after:
NO

Perfect rotational symmetry before:
YES

Perfect rotational symmetry after:
NO

Central negative space preserved:
YES / NO

Open outer silhouette preserved:
YES / NO

Same concept family:
YES / NO

Substantial redesign:
NO

48px:
PASS / FAIL

32px:
PASS / FAIL

16px:
PASS / FAIL

Primary fill:
#2563EB

Text:
NO

Raster:
NO

External resources:
NO

---

# 16. Scope Lock

Allowed task-owned files only:

docs/design/branding/BR-001_Logo.svg

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1B_GEOMETRY_ASYMMETRY_DELTA_REPORT.md

Do NOT modify:

apps/web/**
packages/**
tests/**
visual asset registry
sync tooling
MainMenuHome
layout.tsx
CSS
favicons
PNG/WebP runtime assets
lifecycle docs
MM-006
gameplay
domain
API
YAML
release docs

---

# 17. Repository Integrity

Run:

git status --short
git diff --stat
git diff --name-only
git diff --staged
git rev-parse HEAD
git rev-parse origin/master
git rev-list -n 1 v1.0.0
git rev-list -n 1 v1.0.0-rc.1

Preserve unrelated dirty work.

Do not clean unrelated files.

Expected task-owned changes only:

docs/design/branding/BR-001_Logo.svg

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1B_GEOMETRY_ASYMMETRY_DELTA_REPORT.md

---

# 18. Commit Policy

DO NOT COMMIT.

DO NOT PUSH.

DO NOT TAG.

Do not move release tags.

---

# 19. Final Status

If all checks pass, report:

ASYMMETRY DELTA COMPLETE —
PENDING CHATGPT / HUMAN VISUAL REVIEW

Do NOT report:

CERTIFIED
SEALED
PHASE 1C READY

until external review.

STOP.

---

# CORE PRINCIPLE

FIX ONE THING:

REMOVE PERFECT 120° ROTATIONAL SYMMETRY.

KEEP EVERYTHING ELSE AS CLOSE AS POSSIBLE.

THREE MODULES.
ONE FAMILY.
NOT THREE CLONES.

ENGINEERED ASSEMBLY,
NOT SPINNER ICON.

APPLY THE MINIMUM GEOMETRY DELTA.

VALIDATE.

HASH.

REPORT.

STOP.