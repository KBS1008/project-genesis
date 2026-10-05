# POST-V1 BVI-001
# Rail Terminal Visual Integrity
# Runtime Certification / Final Closeout

## MODE

RUNTIME CERTIFICATION + FINAL CLOSEOUT.

BVI-001 implementation already exists locally.

The preceding reconciliation concluded:

> `CLASS A — IMPLEMENTATION ALREADY COMPLETE LOCALLY`

This task does NOT implement BVI-001 again.

This task does NOT generate artwork.

This task does NOT re-run production promotion merely for ceremony.

This task certifies the already-promoted local bytes, resolves bounded BVI documentation/evidence inconsistencies, runs the required integrity/runtime/quality checks, and produces the final close-candidate report for independent review.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

Do NOT commit.
Do NOT push.
Do NOT tag.

---

# 1. READ FIRST

Read completely:

- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/architecture/reviews/POST_V1_NEXT_MATERIAL_WORKSTREAM_REVIEW_AFTER_PDM_001.md`
- `docs/architecture/reviews/POST_V1_BVI_001_CURRENT_LOCAL_STATE_CLOSE_CANDIDATE_RECONCILIATION.md`

Then read all authoritative BVI material discovered by the reconciliation, including:

- `docs/architecture/reviews/POST_V1_PLAYER_GUIDANCE_DIRECT_MANIPULATION_CURRENT_STATE_REASSESSMENT.md`
- `docs/architecture/reviews/POST_V1_BVI_001_RAIL_TERMINAL_VISUAL_INTEGRITY_HUMAN_GATE.md`
- `docs/architecture/reviews/POST_V1_BVI_001_RAIL_TERMINAL_PRODUCTION_REPLACEMENT_RUNTIME_CERTIFICATION_CLOSE_CANDIDATE.md`
- `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/BVI-001-SOURCE_RECORD.json`
- relevant promotion/runtime evidence tooling.

Also inspect the approved candidate and current local production/runtime assets.

Do not trust reports over actual bytes.

---

# 2. SEALED INPUT STATE

Treat the following reconciliation findings as the expected current state, subject to byte verification:

## Approved candidate

Path:

`docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/BVI-001-ICON-003-rail_terminal-candidate-primary.png`

Expected:

- PNG;
- 1024×1024;
- SHA-256:

`26f0136b748c4aa3ea80262fa4f649edb3e3a55788f6842f721826faa69f758c`

## Local production primary

Path:

`docs/design/buildings/production/infrastructure/primary/ICON-003-rail_terminal.png`

Expected:

- byte-identical to approved candidate;
- SHA-256 `26f0136b...`.

## Local runtime PNG mirror

Path:

`apps/web/public/assets/buildings/ICON-003-rail_terminal.png`

Expected:

- byte-identical to approved candidate;
- SHA-256 `26f0136b...`.

## Local runtime WebP

Path:

`apps/web/public/assets/buildings/ICON-003-rail_terminal.webp`

Expected SHA-256 prefix:

`99c9d831...`

Expected:

- 1024×1024;
- deterministically derived from approved/promoted primary according to existing BVI promotion convention.

Verify exact full hashes from actual files / SOURCE_RECORD.

Do not assume.

---

# 3. AUTHORITATIVE VISUAL DECISION

The human-selected visual is already fixed.

Expected authority:

`BVI-001-SOURCE_RECORD.json`

contains:

> `"humanVisualGate": "PASS"`

and identifies the approved candidate/promotion hashes.

Do NOT:

- choose another image;
- compare alternative candidates for preference;
- reinterpret the visual direction;
- generate another candidate;
- retouch the approved candidate.

The visual-selection phase is over.

---

# 4. BASELINE

Record:

- branch;
- exact HEAD;
- HEAD subject;
- exact `origin/master`;
- HEAD/origin relationship;
- staged changes;
- unstaged changes;
- untracked files;
- BVI task-owned local changes;
- unrelated WIP.

Expected pre-BVI committed baseline from reconciliation:

- branch `master`;
- HEAD `824a477c68b85216ffd8213ba44474799615e4c8`;
- subject `PDM-001: add direct map building placement.`;
- `origin/master` same.

Verify actual Git truth.

If authoritative baseline has changed since reconciliation:

do not automatically fail.

Determine whether the change affects BVI authority/certification.

---

# 5. BVI COMMIT CHECK

Before doing certification, verify BVI is still local/uncommitted.

If BVI has already been committed/pushed since reconciliation:

do not duplicate work.

Determine:

- exact BVI commit;
- whether certification evidence corresponds to that commit;
- whether only final seal remains.

If the committed state materially differs from the reconciled bytes:

STOP and report.

---

# 6. PROTECT UNRELATED WIP

Do not:

- reset;
- restore;
- clean;
- stash;
- stage;
- unstage;
- commit;
- push;
- delete unrelated files;
- move unrelated files.

Known unrelated WIP may include:

- doc relocations;
- dev building pilots;
- API saves;
- source assets;
- unrelated ICON work;
- unrelated rail-terminal pilot source under `assets/`;
- other presentation work.

Only BVI-owned paths may be modified, and only where this prompt explicitly authorizes a documentation/evidence closeout correction.

---

# 7. HARD NO-ART RULE

Do NOT generate new artwork.

Do NOT:

- invoke image generation;
- redraw;
- retouch;
- upscale;
- recolor;
- crop;
- alter composition;
- create variants;
- replace the approved candidate.

If current bytes no longer match the approved candidate:

STOP.

Do not repair the artwork.

Return:

> `BYTE INTEGRITY BLOCKER`

---

# 8. HARD NO-REPROMOTION RULE

The reconciliation established that promotion already happened locally.

Do NOT run:

`tools/bvi-001-rail-terminal-production-promotion.mjs`

merely to reproduce existing files.

Do not overwrite:

- production primary;
- runtime PNG;
- runtime WebP

if they already match the approved/promoted hashes.

The promotion tool may be inspected and its non-destructive integrity logic may be reused conceptually, but do not invoke a destructive promotion step against already-correct files.

If an independent read-only scan mode exists:

it may be used.

If the script cannot scan without writing:

do not run it.

Use a separate non-mutating verification method instead.

---

# 9. BYTE FREEZE BEFORE CERTIFICATION

Before any documentation/evidence cleanup, calculate and record full SHA-256 for:

1. approved candidate;
2. production primary;
3. runtime PNG mirror;
4. runtime WebP;
5. recycling-facility runtime WebP;
6. any manifest/source record whose provenance matters.

Verify:

### Candidate ↔ primary

Expected:

> exact byte identity.

### Candidate ↔ runtime PNG

Expected:

> exact byte identity.

### Runtime WebP

Expected:

> matches SOURCE_RECORD post-promotion hash.

### Recycling firewall

Expected:

> recycling asset unchanged from committed baseline.

If any expected identity fails:

STOP before runtime certification.

---

# 10. HUMAN-GATE DOCUMENTATION TENSION

The reconciliation found a bounded documentation contradiction:

- `BVI-001-SOURCE_RECORD.json` says human visual gate `PASS`;
- promoted bytes match the approved candidate and SOURCE_RECORD hashes;
- the Human Gate Markdown still contains stale wording such as:
  - `READY FOR HUMAN GATE`;
  - `human art decision NOT YET MADE`.

Resolve this documentation inconsistency.

This task MAY update:

`docs/architecture/reviews/POST_V1_BVI_001_RAIL_TERMINAL_VISUAL_INTEGRITY_HUMAN_GATE.md`

but ONLY to make the document accurately reflect the already-recorded decision.

Do not rewrite the historical evidence.

Preserve:

- original gate context;
- candidate evidence;
- historical chronology.

Add/update a bounded final disposition that clearly states:

- human visual gate: PASS;
- approved candidate exact path;
- approval authority: SOURCE_RECORD / recorded human decision;
- production promotion occurred after the earlier evidence-repair snapshot;
- stale “not yet made” language is superseded by the recorded PASS.

Do not invent a new human decision.

---

# 11. SOURCE RECORD INTEGRITY

Inspect:

`docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/BVI-001-SOURCE_RECORD.json`

Verify:

- `humanVisualGate`;
- approved candidate identity;
- approved candidate SHA;
- production-promotion metadata;
- post-promotion primary hash;
- post-promotion runtime WebP hash;
- any runtime/evidence metadata.

Do not modify SOURCE_RECORD unless an obvious BVI-local metadata inconsistency is proven and correction is fully mechanical.

Default:

> SOURCE_RECORD FROZEN.

If modification appears necessary for anything beyond mechanical evidence-path bookkeeping:

STOP and report.

---

# 12. PRODUCTION MANIFEST

Inspect:

`docs/design/buildings/production/infrastructure/ICON_003_INFRASTRUCTURE_PRODUCTION_MANIFEST.json`

Verify the local BVI provenance entry accurately records the rail-terminal repair.

Check that it does NOT:

- redefine other assets;
- alter other building identities;
- introduce a new content quota;
- reopen Scenario-B.

If current local manifest metadata is already correct:

do not modify it.

---

# 13. RUNTIME RESOLUTION RECHECK

Reconfirm actual runtime path:

> `rail_terminal`
> → Buildings catalog
> → `BuildingTypeIcon`
> → `buildingTypeToIcon003PrimaryAssetId('rail_terminal')`
> → `ICON-003-rail_terminal`
> → `resolveVisualAssetUrl`
> → `/assets/buildings/ICON-003-rail_terminal.webp`

Verify current source.

No registry/resolver change is expected.

If runtime authority has changed since reconciliation:

STOP and report before modifying source.

---

# 14. RECYCLING FIREWALL

The original BV-I6 defect was semantic collision with Recyclinganlage.

Verify the actual recycling asset remains untouched.

At minimum verify:

`apps/web/public/assets/buildings/ICON-003-recycling_facility.webp`

against committed baseline.

Expected:

> unchanged.

If BVI local work modified recycling:

STOP.

BVI-001 owns only `rail_terminal`.

---

# 15. 23/23 ICON-003 INTEGRITY SCAN

Run a non-destructive integrity scan over the existing 23 ICON-003 primary building identities.

This is NOT a quota.

It is the established existing ICON-003 primary set.

Verify at minimum:

- all expected 23 primary identities resolve;
- no missing primary;
- no duplicate/hash collision introduced by rail-terminal replacement;
- `rail_terminal` primary has approved hash;
- `recycling_facility` remains distinct;
- no other primary changed as part of BVI;
- runtime asset resolution remains valid where the existing integrity tooling checks it.

If existing promotion script contains the scan but cannot run without rewriting assets:

do NOT run the promotion script.

Create/run only a non-destructive verification command or existing read-only helper.

Avoid creating permanent tooling unless genuinely necessary.

Record exact result.

Required target:

> `23 / 23 PASS`

If not 23/23:

STOP.

---

# 16. VISUAL SEMANTIC CERTIFICATION

Inspect the actual current local runtime WebP.

Certify only the intended semantic requirement:

> Does the production Bahnterminal clearly read as rail-terminal / rail-freight infrastructure rather than recycling/processing?

Expected rail cues may include:

- tracks;
- rail yard;
- ballast;
- terminal/depot structure;
- gantry/loading infrastructure;
- intermodal containers;
- freight-terminal organization.

Do not turn this into subjective beauty scoring.

Result must be:

- PASS;
- FAIL;
- NOT CERTIFIABLE.

FAIL/NOT CERTIFIABLE blocks closeout.

---

# 17. RUNTIME ENVIRONMENT

Use the normal repository-supported web runtime.

Do not alter production code to make evidence easier.

Record:

- startup command;
- local origin;
- browser/runtime tooling;
- fixture/session used;
- viewport;
- any environment recovery command such as `pnpm dev:restart`.

If stale `.next` state causes a known development-only problem:

using the established restart command is acceptable.

Do not classify cache cleanup as product repair.

---

# 18. RUNTIME FIXTURE

Use an existing legitimate deterministic fixture/session that exposes:

> Buildings → Baukatalog → Bahnterminal

without changing gameplay authority.

Do not manually edit:

- prerequisites;
- milestones;
- research;
- money;
- save schema

just to expose the icon.

If an existing BVI runtime capture script already has a legitimate fixture path:

reuse it.

Record exact fixture.

---

# 19. CANONICAL EVIDENCE LOCATION

The reconciliation found BVI runtime screenshots under:

`docs/architecture/reviews/evidence/alte Grafiken/`

while the close candidate referenced:

`docs/architecture/reviews/evidence/BVI-001_*.png`

Resolve this.

Canonical final BVI runtime evidence should live directly under:

`docs/architecture/reviews/evidence/`

using the existing BVI-001 filenames.

Do NOT leave final certification dependent solely on `alte Grafiken/`.

Preferred behavior:

- re-capture current certification directly to canonical paths.

If exact current screenshots can be proven to correspond to current bytes and repository convention permits copying them:

copying is acceptable.

However, because current runtime certification is being performed now, fresh capture from the current local worktree is preferred.

Do not delete historical copies from `alte Grafiken/`.

---

# 20. REQUIRED DESKTOP RUNTIME CERTIFICATION

Viewport:

> approximately `1440×900`

Navigate through actual UI to:

> Buildings → Baukatalog → Bahnterminal

Capture canonical evidence.

Verify:

- Bahnterminal entry is visible;
- actual production/runtime WebP is loaded;
- icon clearly shows rail-terminal semantics;
- it does not visually read as the recycling facility;
- no broken image;
- no fallback icon;
- no stale old faulty art;
- catalog layout remains usable;
- building identity/name remains Bahnterminal.

Required canonical artifact:

`docs/architecture/reviews/evidence/BVI-001_RAIL_TERMINAL_RUNTIME_CATALOG_DESKTOP_1440x900.png`

If existing repository naming convention differs slightly, preserve the already-authoritative BVI filename rather than inventing a second name.

---

# 21. REQUIRED NARROW RUNTIME CERTIFICATION

Viewport:

> approximately `480×900`

Navigate through actual UI to the same Bahnterminal catalog entry.

Verify:

- Bahnterminal is reachable;
- corrected icon renders;
- icon remains semantically readable at narrow size;
- no clipping/corruption makes it misleading;
- relevant catalog entry remains usable.

Required canonical artifact:

`docs/architecture/reviews/evidence/BVI-001_RAIL_TERMINAL_RUNTIME_CATALOG_NARROW_480x900.png`

Do not turn this into a general narrow-web audit.

---

# 22. RUNTIME ASSET IDENTITY PROOF

Where practical, supplement screenshots with a machine-readable runtime check.

Prove that the browser-requested asset corresponds to:

`/assets/buildings/ICON-003-rail_terminal.webp`

and that the local served file has the expected certified hash.

Do not rely solely on screenshot appearance if a deterministic asset-path/hash check is available.

Record:

- requested path;
- local source path;
- expected SHA;
- actual SHA;
- result.

No new complex harness is required if the existing capture script already establishes this.

---

# 23. RECYCLING RUNTIME DISTINCTION

During runtime certification, if practical within the same catalog view, confirm Bahnterminal is visually distinguishable from Recyclinganlage.

Do not create a new comparison-art project.

A simple factual observation is enough:

> rail_terminal corrected asset ≠ recycling_facility asset

and visual semantics are distinct.

Machine hash inequality may support this.

---

# 24. RUNTIME CAPTURE TOOL

Inspect:

`tools/capture-bvi-001-rail-terminal-runtime-evidence.mjs`

before running.

Verify it:

- uses normal runtime;
- does not mutate production assets;
- does not bypass gameplay;
- captures the actual Buildings catalog;
- targets canonical evidence paths or can be boundedly corrected to do so.

A small BVI-owned evidence-tool correction IS allowed if required solely to normalize final evidence paths or assert current asset identity.

Do not broaden the script.

If changed:

record exact change and include it in task-owned inventory.

---

# 25. CLOSE-CANDIDATE REPORT RECONCILIATION

The existing report:

`docs/architecture/reviews/POST_V1_BVI_001_RAIL_TERMINAL_PRODUCTION_REPLACEMENT_RUNTIME_CERTIFICATION_CLOSE_CANDIDATE.md`

already describes much of the intended closure but contains stale/misaligned claims.

Update this existing report rather than creating a competing second implementation report.

Reconcile at minimum:

- current baseline HEAD;
- current local hashes;
- human-gate final PASS;
- canonical evidence paths;
- actual 23/23 result;
- actual desktop runtime result;
- actual narrow runtime result;
- actual root-gate results;
- actual commit/push state.

Do not preserve a claim merely because it was previously written.

Actual current evidence wins.

---

# 26. FINAL CLOSEOUT REPORT

In addition to updating the close-candidate report, create the formal final closeout:

`docs/architecture/reviews/POST_V1_BVI_001_RUNTIME_CERTIFICATION_FINAL_CLOSEOUT.md`

This document is the final BVI-001 certification candidate for independent ChatGPT review.

Do not call BVI formally sealed on behalf of the independent reviewer.

Use:

> `READY FOR INDEPENDENT FINAL CLOSURE REVIEW`

rather than pretending the external review has already happened.

---

# 27. ROOT GATES

After all permitted BVI-owned documentation/evidence/tool corrections are complete, run:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build:web`

Record exact results.

Expected prior baseline context:

- typecheck PASS;
- lint 0 errors / 144 warnings;
- test 290 files / 1096 tests;
- build:web PASS.

Do NOT require the test count to remain exactly 1096.

Current actual results are authoritative.

If test count changes due unrelated baseline evolution:

record it.

Any failure must be investigated only enough to classify:

- BVI-local;
- pre-existing/unrelated;
- environment.

Do not fix unrelated failures.

A BVI-local failure blocks closeout.

---

# 28. POST-GATE CHANGE RULE

After successful root gates:

do not modify:

- production assets;
- runtime assets;
- BVI tooling;
- source/test code

without rerunning the relevant certification/gates.

Markdown-only factual report updates after gates do not require full gate rerun unless repository policy says otherwise.

Record whether certified asset bytes remained unchanged after gates.

---

# 29. GAMEPLAY FIREWALL

Verify BVI did not change:

- building definitions;
- cost;
- prerequisites;
- category;
- construction;
- production;
- workforce;
- transport;
- research;
- finance;
- milestones;
- placement;
- region behavior.

Expected:

> `UNCHANGED`

---

# 30. SAVE FIREWALL

Verify:

- no save-schema change;
- no migration;
- no serialization change;
- no save semantics change.

Expected:

> `UNCHANGED`

---

# 31. API FIREWALL

Verify:

- no API endpoint change;
- no request/response contract change;
- no persistence behavior change.

Expected:

> `UNCHANGED`

---

# 32. PDM FIREWALL

PDM-001 is sealed.

Verify BVI does not modify:

- direct map placement;
- coordinate adapter;
- placement session;
- World placement UI;
- PDM evidence.

Expected:

> `PDM-001 REMAINS SEALED`

---

# 33. SCENARIO-B FIREWALL

Verify:

- no new building artwork generated;
- no other ICON asset replaced;
- no bulk production resumed;
- no visual quota introduced.

Expected:

> `SCENARIO-B REMAINS PAUSED`

BVI is one integrity repair only.

---

# 34. FINAL TASK-OWNED INVENTORY

Produce an exact BVI-owned file inventory.

Classify:

## Production assets

Expected candidates:

- production `rail_terminal` primary PNG;
- runtime WebP;
- runtime PNG mirror;
- infrastructure production manifest.

## Human-gate material

- approved candidate;
- SOURCE_RECORD;
- evidence boards;
- faulty archive if repository policy retains it;
- human-gate Markdown.

## Tooling

- human-gate evidence tool;
- production-promotion tool;
- runtime capture tool.

## Runtime evidence

- canonical desktop screenshot;
- canonical narrow screenshot;
- any small machine-readable evidence artifact if already part of the workflow.

## Reports

- existing BVI close candidate;
- reconciliation report;
- this final closeout report.

## Prompts

Relevant BVI prompt chain if repository convention tracks prompts.

Do not include unrelated WIP.

---

# 35. GENERATED / HISTORICAL ARTIFACT POLICY

For every evidence/candidate artifact decide:

- INCLUDE;
- EXCLUDE — HISTORICAL/TRANSIENT;
- REVIEW BEFORE COMMIT.

Do not delete files in this task unless they were generated by this task in error and clearly task-owned.

Historical copies under:

`docs/architecture/reviews/evidence/alte Grafiken/`

should not be silently deleted.

If canonical duplicates now exist:

record their disposition for the eventual isolated commit.

---

# 36. BYTE STABILITY TABLE

Final report must include:

| Asset | Pre-cert SHA-256 | Post-cert SHA-256 | Expected authority | Result |
|---|---|---|---|---|

At minimum:

- approved candidate;
- production primary;
- runtime PNG;
- runtime WebP;
- recycling WebP.

Expected:

> certification does not alter any of these bytes.

---

# 37. RUNTIME EVIDENCE TABLE

Include:

| Viewport | Path | Bahnterminal visible | Correct asset | Rail semantics | Broken/fallback? | Result |
|---|---|---:|---:|---:|---:|---|

Required:

- desktop ~1440×900;
- narrow ~480×900.

Both must PASS.

---

# 38. INTEGRITY TABLE

Include:

| Integrity check | Result |
|---|---|
| Approved candidate exists | PASS/FAIL |
| Candidate hash matches authority | PASS/FAIL |
| Production primary byte-identical | PASS/FAIL |
| Runtime PNG byte-identical | PASS/FAIL |
| Runtime WebP matches recorded derivative | PASS/FAIL |
| Recycling asset unchanged | PASS/FAIL |
| Rail/recycling hashes distinct | PASS/FAIL |
| 23 expected primaries present | PASS/FAIL |
| 23 primary identities distinct as required | PASS/FAIL |
| Resolver points to rail-terminal runtime asset | PASS/FAIL |
| No stale override | PASS/FAIL |
| Desktop runtime | PASS/FAIL |
| Narrow runtime | PASS/FAIL |

---

# 39. HUMAN-GATE FINAL STATUS TABLE

Include:

| Item | Final state |
|---|---|
| Human visual decision | PASS |
| Approved candidate | `<exact path>` |
| Candidate SHA-256 | `<full hash>` |
| Stale gate wording corrected | YES/NO |
| SOURCE_RECORD changed | YES/NO |
| New human decision invented | NO |
| New artwork generated | NO |

---

# 40. ROOT-GATE TABLE

Include exact final results:

| Gate | Result |
|---|---|
| `pnpm typecheck` | ... |
| `pnpm lint` | ... |
| `pnpm test` | ... |
| `pnpm build:web` | ... |

For lint include:

- errors;
- warnings.

For tests include:

- files;
- tests.

---

# 41. CLOSEOUT STATUS

The final closeout may be considered a valid independent-review candidate only if ALL are true:

- approved candidate authority verified;
- candidate bytes stable;
- production primary exact match;
- runtime PNG exact match;
- runtime WebP verified;
- recycling asset unchanged;
- 23/23 integrity PASS;
- runtime resolver correct;
- desktop runtime PASS;
- narrow runtime PASS;
- human-gate stale wording reconciled;
- canonical evidence exists;
- close-candidate report reconciled;
- root gates PASS or any unrelated failure is conclusively proven non-BVI and separately disclosed;
- no BVI-local defect remains;
- no new art generated;
- no gameplay/save/API/PDM changes;
- Scenario-B remains paused.

---

# 42. NO COMMIT / PUSH / TAG

Even if every check passes:

do NOT commit.
do NOT push.
do NOT tag.

Independent review comes first.

The repository owner will commit/push after independent PASS.

---

# 43. RECOMMENDED COMMIT SUBJECT

If closeout is successful, recommend but do NOT execute:

`BVI-001: correct rail terminal production artwork.`

If repository history clearly uses a different BVI naming convention, use the established convention instead.

---

# 44. REQUIRED FINAL CLOSEOUT REPORT STRUCTURE

Create:

`docs/architecture/reviews/POST_V1_BVI_001_RUNTIME_CERTIFICATION_FINAL_CLOSEOUT.md`

with:

## A. Executive decision

## B. Repository baseline

## C. Authority chain

## D. Human-gate final disposition

## E. Approved candidate integrity

## F. Production primary integrity

## G. Runtime derivative integrity

## H. Recycling firewall

## I. Runtime resolver

## J. 23/23 ICON-003 integrity

## K. Desktop runtime certification

## L. Narrow runtime certification

## M. Canonical evidence manifest

## N. Close-candidate reconciliation

## O. Gameplay / Save / API / PDM / Scenario-B firewall

## P. Root gates

## Q. Post-gate byte stability

## R. Final task-owned inventory

## S. Generated / historical artifact disposition

## T. Remaining observations

## U. Commit readiness

## V. Final decision

---

# 45. REQUIRED FACTUAL QUESTIONS

Explicitly answer:

1. What branch was certified?
2. What exact HEAD was used?
3. What is the HEAD subject?
4. What is `origin/master`?
5. Does HEAD equal origin/master?
6. Is BVI still local/uncommitted?
7. Has BVI already been pushed?
8. What unrelated WIP remains?
9. What is the exact approved candidate path?
10. What is its full SHA-256?
11. What are its dimensions?
12. What authority records human PASS?
13. Was the human-gate Markdown stale?
14. Was its stale wording corrected?
15. Was SOURCE_RECORD modified?
16. What is the production primary path?
17. What is its full SHA-256 before certification?
18. Is it byte-identical to the approved candidate?
19. What is the runtime PNG path?
20. What is its full SHA-256?
21. Is it byte-identical to the approved candidate?
22. What is the runtime WebP path?
23. What is its full SHA-256?
24. Does it match SOURCE_RECORD?
25. What is its size/dimensions?
26. What is the recycling WebP path?
27. Is recycling unchanged from baseline?
28. Are rail-terminal and recycling runtime hashes distinct?
29. Was any promotion script run?
30. Were production asset bytes changed during certification?
31. Was any new artwork generated?
32. Was any approved artwork altered?
33. What runtime resolver path serves `rail_terminal`?
34. Is there any stale override?
35. Did the 23/23 integrity scan pass?
36. What exactly does 23 represent?
37. Did any other ICON-003 primary change?
38. What fixture/session was used for runtime?
39. What runtime startup command was used?
40. What local origin was used?
41. What browser/runtime tooling was used?
42. Did desktop 1440×900 pass?
43. What exact desktop evidence path exists?
44. Did the actual Bahnterminal entry render the corrected asset?
45. Did it visually read as rail-terminal infrastructure?
46. Was broken/fallback/stale art absent?
47. Did narrow 480×900 pass?
48. What exact narrow evidence path exists?
49. Was the corrected asset still semantically readable at narrow size?
50. Was the Buildings catalog usable at narrow size?
51. Was runtime asset identity machine-verified?
52. What requested asset URL/path was observed?
53. What served/local asset hash was verified?
54. Was Bahnterminal visually/hash-distinct from Recyclinganlage?
55. Were historical evidence copies deleted?
56. What canonical evidence artifacts now exist?
57. Was the existing close-candidate report updated?
58. Does it now match actual evidence paths?
59. Does it now match current baseline?
60. Does it now match current hashes?
61. Does it accurately state commit/push status?
62. Did `pnpm typecheck` pass?
63. Did `pnpm lint` pass?
64. How many lint errors?
65. How many lint warnings?
66. Did `pnpm test` pass?
67. How many test files passed?
68. How many tests passed?
69. Did `pnpm build:web` pass?
70. Did any BVI asset byte change after gates?
71. Did any BVI source/tool file change after gates?
72. If yes, was required revalidation performed?
73. Were gameplay rules changed?
74. Was Save changed?
75. Was API changed?
76. Was PDM changed?
77. Was Scenario-B reopened?
78. What exact BVI files are task-owned?
79. Which generated/historical files should be excluded from eventual commit?
80. Does any BVI-local defect remain?
81. Does any authority ambiguity remain?
82. Is BVI ready for independent final closure review?
83. Is the task-owned diff commit-ready after independent PASS?
84. What commit subject is recommended?
85. Is a tag required?
86. Was any commit performed?
87. Was any push performed?
88. Was any tag performed?

---

# 46. ALLOWED MODIFICATIONS

This certification may modify ONLY bounded BVI-owned closeout material such as:

- stale BVI human-gate Markdown disposition;
- BVI runtime evidence capture script if canonical-path correction is required;
- canonical BVI runtime evidence artifacts;
- existing BVI close-candidate report;
- new final closeout report.

It must NOT modify already-correct:

- approved candidate bytes;
- production primary bytes;
- runtime PNG bytes;
- runtime WebP bytes;
- unrelated ICON assets;
- production source code;
- gameplay code;
- tests

unless a hard BVI-local defect is discovered.

If a hard defect requires modification outside the allowed list:

STOP and return a delta requirement.

---

# 47. STOP CONDITIONS

STOP certification and do not seal if:

- approved candidate hash differs;
- production primary is no longer byte-identical;
- runtime PNG is no longer byte-identical;
- runtime WebP does not match recorded promoted derivative;
- recycling asset changed;
- runtime resolver no longer points to the expected asset;
- another stale asset overrides rail_terminal;
- 23/23 integrity fails;
- desktop runtime cannot show corrected Bahnterminal;
- narrow runtime cannot show corrected Bahnterminal;
- corrected asset still semantically reads as recycling/processing;
- human approval cannot actually be established;
- a new visual decision is required;
- gameplay/save/API/PDM changes would be required;
- unrelated WIP cannot be safely separated;
- BVI-local root gate failure remains.

Do not improvise a repair beyond the allowed closeout corrections.

---

# 48. FINAL DECISION

Return exactly ONE.

## OPTION A — BVI-001 RUNTIME CERTIFIED / CLOSE READY

Use only if all certification requirements pass.

State:

> **BVI-001 RUNTIME CERTIFICATION:**  
> `PASS`

> **IMPLEMENTATION STATE:**  
> `CLASS A — ALREADY COMPLETE LOCALLY`

> **HUMAN VISUAL GATE:**  
> `PASS / RECONCILED`

> **APPROVED CANDIDATE:**  
> `<exact path>`

> **PRODUCTION PRIMARY:**  
> `PASS / BYTE-IDENTICAL TO APPROVED`

> **RUNTIME PNG:**  
> `PASS / BYTE-IDENTICAL TO APPROVED`

> **RUNTIME WEBP:**  
> `PASS / VERIFIED DERIVATIVE`

> **RECYCLING FIREWALL:**  
> `PASS / UNCHANGED`

> **ICON-003 INTEGRITY:**  
> `23 / 23 PASS`

> **DESKTOP 1440×900:**  
> `PASS`

> **NARROW 480×900:**  
> `PASS`

> **CANONICAL EVIDENCE:**  
> `PASS`

> **GAMEPLAY / SAVE / API:**  
> `UNCHANGED`

> **PDM-001:**  
> `REMAINS SEALED`

> **SCENARIO-B:**  
> `REMAINS PAUSED`

> **ROOT GATES:**  
> `<exact results>`

> **KNOWN BVI-LOCAL DEFECTS:**  
> `NONE`

> **AUTHORITY AMBIGUITIES:**  
> `NONE`

> **FINAL CLOSEOUT REPORT:**  
> `docs/architecture/reviews/POST_V1_BVI_001_RUNTIME_CERTIFICATION_FINAL_CLOSEOUT.md`

> **INDEPENDENT REVIEW READINESS:**  
> `READY`

> **TASK-OWNED COMMIT READINESS AFTER INDEPENDENT PASS:**  
> `READY`

> **RECOMMENDED COMMIT SUBJECT:**  
> `BVI-001: correct rail terminal production artwork.`

> **TAG:**  
> `NOT REQUIRED`

> **COMMIT / PUSH / TAG PERFORMED:**  
> `NONE`

Then STOP.

---

## OPTION B — SMALL CERTIFICATION / CLOSEOUT DELTA REQUIRED

Use only for a bounded evidence/documentation/tooling issue that does NOT invalidate approved production bytes.

State:

> **BVI-001 RUNTIME CERTIFICATION:**  
> `NOT YET CLOSED`

> **PRODUCTION BYTES:**  
> `VALID / FROZEN`

> **EXACT DELTA:**  
> `<issue>`

> **NEXT STEP:**  
> `SMALL BVI-001 CERTIFICATION DELTA`

Do not alter artwork.

---

## OPTION C — BYTE / VISUAL INTEGRITY BLOCKER

Use when approved/promoted asset integrity fails.

State exact:

- expected hash;
- actual hash;
- affected path;
- visual consequence;
- required authority resolution.

No art generation.

No repromotion without a new bounded prompt.

---

## OPTION D — RUNTIME CERTIFICATION BLOCKED

Use when bytes are valid but runtime cannot be reliably certified.

State:

- exact environment/runtime blocker;
- which checks passed;
- which runtime check remains;
- minimal required next step.

Do not modify production assets.

---

## OPTION E — BVI-LOCAL QUALITY BLOCKER

Use when runtime/bytes are valid but a BVI-owned source/tooling change causes a root-gate failure.

State exact failure and owning path.

Do not fix unrelated debt.

---

## OPTION F — BASELINE CHANGED / BVI ALREADY COMMITTED

Use if authoritative Git state moved beyond the reconciliation.

State:

- exact HEAD;
- BVI commit;
- remote state;
- whether existing certification still applies;
- exact remaining closeout action.

Do not duplicate work.

---

# 49. DEFINITION OF DONE

This task is complete only when:

- [ ] implementation guide read
- [ ] materiality review read
- [ ] reconciliation report read
- [ ] BVI human-gate material read
- [ ] BVI close candidate read
- [ ] SOURCE_RECORD read
- [ ] current branch recorded
- [ ] exact HEAD recorded
- [ ] exact origin/master recorded
- [ ] BVI commit state checked
- [ ] unrelated WIP protected
- [ ] approved candidate full hash verified
- [ ] production primary full hash verified
- [ ] runtime PNG full hash verified
- [ ] runtime WebP full hash verified
- [ ] recycling hash verified
- [ ] candidate↔primary byte identity verified
- [ ] candidate↔runtime PNG byte identity verified
- [ ] WebP derivative authority verified
- [ ] no asset bytes changed by certification
- [ ] no new art generated
- [ ] human-gate stale wording reconciled
- [ ] SOURCE_RECORD integrity verified
- [ ] manifest provenance verified
- [ ] runtime resolver rechecked
- [ ] no stale override verified
- [ ] recycling firewall verified
- [ ] non-destructive 23/23 integrity check completed
- [ ] 23/23 PASS
- [ ] actual runtime WebP visually inspected
- [ ] rail-terminal semantics PASS
- [ ] runtime environment recorded
- [ ] legitimate fixture/session recorded
- [ ] desktop runtime certified
- [ ] narrow runtime certified
- [ ] desktop canonical evidence exists
- [ ] narrow canonical evidence exists
- [ ] runtime asset identity proven
- [ ] recycling distinction verified
- [ ] historical evidence not destructively removed
- [ ] close-candidate report reconciled
- [ ] final closeout report created
- [ ] root typecheck run
- [ ] root lint run
- [ ] root test run
- [ ] root build:web run
- [ ] exact gate results recorded
- [ ] post-gate byte stability verified
- [ ] gameplay firewall verified
- [ ] Save firewall verified
- [ ] API firewall verified
- [ ] PDM firewall verified
- [ ] Scenario-B remains paused
- [ ] final task-owned inventory produced
- [ ] generated/historical artifact disposition produced
- [ ] no BVI-local defect remains for Option A
- [ ] no authority ambiguity remains for Option A
- [ ] exactly one final option returned
- [ ] no commit
- [ ] no push
- [ ] no tag

---

# 50. CORE RULE

The artwork is already selected.

The artwork is already promoted locally.

The runtime derivative is already present locally.

Do not redo those steps.

This task certifies the current BVI state.

Freeze the approved bytes.

Resolve only factual BVI documentation/evidence inconsistencies.

Run a non-destructive 23/23 integrity check.

Certify the actual Buildings catalog at desktop and narrow viewport.

Use canonical evidence paths.

Reconcile the existing close-candidate report.

Run current root gates.

Prove the certified asset bytes did not change.

Do not generate art.

Do not repromote.

Do not modify gameplay.

Do not modify Save.

Do not modify API.

Do not modify PDM.

Do not restart Scenario-B.

If everything passes:

return:

> `BVI-001 RUNTIME CERTIFIED / CLOSE READY`

and prepare it for independent review.

Do NOT commit.

Do NOT push.

Do NOT tag.

Create:

`docs/architecture/reviews/POST_V1_BVI_001_RUNTIME_CERTIFICATION_FINAL_CLOSEOUT.md`

Then STOP.

# END OF PROMPT