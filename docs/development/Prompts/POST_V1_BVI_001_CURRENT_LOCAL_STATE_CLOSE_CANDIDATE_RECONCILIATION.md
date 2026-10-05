# POST-V1 BVI-001
# Rail Terminal Visual Integrity
# Current Local State / Close-Candidate Reconciliation

## MODE

READ-ONLY / NON-DESTRUCTIVE CURRENT-STATE RECONCILIATION.

This is NOT a fresh visual-production task.

This is NOT permission to generate new rail-terminal artwork.

This is NOT permission to overwrite the current local `rail_terminal` assets.

The repository currently has an unusual state:

- authoritative `origin/master` does not yet contain the BVI-001 closure;
- local/uncommitted BVI-related work appears to exist;
- local `ICON-003-rail_terminal` PNG/WebP changes may already represent the intended replacement;
- human-gate / close-candidate material may already exist locally;
- unrelated WIP is also present.

The purpose of this task is to establish exactly what already exists and whether BVI-001 is:

A. already implemented locally and ready for runtime certification / closure;
B. almost complete but requires one small bounded delta;
C. not actually implemented despite the local artifacts;
D. blocked by contradictory or unverifiable visual authority.

Default rule:

> INSPECT FIRST. DO NOT REIMPLEMENT.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

---

# 1. PRIMARY QUESTION

Answer:

> What is the actual current local state of BVI-001 relative to authoritative `origin/master`, the approved human-gate candidate, the production `rail_terminal` primary, and its runtime derivative?

Then determine:

> Is the existing local state already a valid BVI-001 implementation close candidate?

Do not assume the answer.

---

# 2. READ FIRST

Read completely, where present:

- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/architecture/reviews/POST_V1_NEXT_MATERIAL_WORKSTREAM_REVIEW_AFTER_PDM_001.md`

Then locate and read the authoritative BVI-001 material already present in the repository/worktree.

Search specifically for:

- `BVI-001`
- `BV-I6`
- `rail_terminal`
- `ICON-003-rail_terminal`
- human gate
- visual integrity
- production replacement
- close candidate
- runtime certification
- promotion
- approved candidate

Read relevant BVI prompts/reports before inspecting or classifying the asset diff.

Do not assume filenames that do not exist.

Record the exact authoritative paths you find.

---

# 3. BASELINE

Record:

- branch;
- exact HEAD;
- HEAD subject;
- exact `origin/master`;
- HEAD/origin relationship;
- staged changes;
- unstaged changes;
- untracked files;
- local BVI-related paths;
- unrelated local WIP.

Expected reviewed baseline from the previous materiality review was:

- branch: `master`
- HEAD: `824a477c68b85216ffd8213ba44474799615e4c8`
- subject: `PDM-001: add direct map building placement.`
- `origin/master`: same SHA.

Verify actual truth.

Do not fail merely because unrelated WIP exists.

---

# 4. VERIFY BVI IS NOT ALREADY COMMITTED

Inspect Git history for BVI-001 / rail-terminal visual-integrity work.

Determine:

- whether a BVI commit already exists;
- whether it is an ancestor of HEAD;
- whether it exists only locally;
- whether `origin/master` contains it;
- whether the current production asset differs from HEAD only through local worktree changes.

If BVI-001 is already committed and pushed after the previous review:

STOP this reconciliation and report the new authoritative state.

Do not duplicate work.

---

# 5. PROTECT UNRELATED WIP

There is known unrelated local WIP.

Do not:

- reset;
- restore;
- clean;
- stash;
- stage;
- unstage;
- commit;
- push;
- delete;
- move;
- rewrite

anything.

Especially protect:

- PDM;
- unrelated ICON tracks;
- WFV/MSV;
- Scenario-B material;
- design uploads unrelated to BVI;
- dev building pilots;
- API saves;
- doc relocations;
- unrelated source assets.

A dirty worktree is expected.

---

# 6. BVI-001 SCOPE FIREWALL

This reconciliation concerns only the known visual-integrity problem:

> `rail_terminal` / Bahnterminal production artwork may depict the wrong facility semantics.

Do not expand this task into:

- other ICON-003 buildings;
- ICON-004;
- ICON-005;
- Scenario-B;
- World redesign;
- new building art production;
- visual style redesign;
- gameplay;
- save;
- API;
- region semantics;
- PDM;
- tutorial;
- category-label cleanup.

---

# 7. DO NOT GENERATE ART

Hard rule:

> DO NOT GENERATE A NEW IMAGE.

Do not:

- invoke image-generation tooling;
- produce another candidate;
- redraw the terminal;
- modify the approved candidate;
- retouch;
- upscale;
- recolor;
- crop;
- composite;
- reinterpret the human-approved image.

This task is reconciliation only.

If the existing approved candidate is missing or cannot be verified:

report the blocker.

Do not replace it with a newly generated approximation.

---

# 8. ESTABLISH THE HISTORICAL DEFECT

From the existing BVI / player-guidance review material, establish exactly what BV-I6 was.

Record:

- affected building ID;
- player-facing building name;
- production primary path;
- runtime derivative path;
- what semantic mismatch was identified;
- why it was considered incorrect game information rather than optional polish.

Do not embellish the defect beyond existing evidence.

Expected subject:

> `rail_terminal` / Bahnterminal artwork visually reads as recycling/processing rather than rail infrastructure.

Verify against actual repository material.

---

# 9. LOCATE THE HUMAN-GATE AUTHORITY

Locate the human-approved BVI candidate.

The previous materiality review reported an approved candidate under a path conceptually similar to:

`docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/`

Do not assume the exact filename.

Record:

- exact directory;
- exact candidate filename;
- exact gate/review document;
- exact approval wording;
- whether approval is unambiguous;
- whether more than one candidate exists;
- which candidate was approved;
- whether the candidate bytes currently exist.

The human gate is authoritative for visual selection.

Do not independently choose a different candidate based on taste.

---

# 10. VERIFY HUMAN APPROVAL

The candidate may be treated as approved only if repository evidence clearly identifies it as such.

Look for explicit language such as:

- APPROVED;
- PASS;
- SELECTED;
- PROMOTE;
- human gate passed;
- production candidate.

Do not infer approval merely because an image exists in a folder.

If approval is ambiguous:

return a blocker.

---

# 11. IDENTIFY THE PRODUCTION PRIMARY

Locate the authoritative production primary for:

> `rail_terminal`

Record:

- exact path;
- format;
- dimensions;
- file size;
- current Git state;
- HEAD blob identity/hash if practical;
- working-tree blob identity/hash if practical.

Determine whether the current working-tree primary differs from `origin/master`.

Do not modify it.

---

# 12. IDENTIFY THE RUNTIME DERIVATIVE

Locate the runtime asset actually consumed by the web UI for the Bahnterminal.

Record:

- exact path;
- format;
- dimensions;
- file size;
- current Git state;
- HEAD blob/hash if practical;
- working-tree blob/hash if practical.

Verify actual runtime resolution through the existing registry/resolver/presentation path.

Do not assume a similarly named WebP is actually used.

---

# 13. TRACE RUNTIME AUTHORITY

Trace:

> building definition / ID
> → presentation registry or asset resolver
> → production/runtime asset path
> → Buildings catalog rendering.

Answer:

- Which file does the Buildings catalog actually render for `rail_terminal`?
- Is the current local modified derivative the file the runtime would use?
- Is there any stale duplicate that could still win resolution?
- Is there fallback behavior?

Do not refactor the resolver.

---

# 14. BYTE / HASH RECONCILIATION

Perform non-destructive file comparison.

For:

- approved human-gate candidate;
- current local production primary;
- current local runtime derivative;
- `origin/master` production primary;
- `origin/master` runtime derivative

record suitable hashes/checksums.

Determine:

### Primary

Is the current local production primary:

- byte-identical to the approved candidate;
- derived from it;
- unrelated;
- unverifiable?

If the intended promotion convention requires byte identity:

verify exact byte identity.

### Runtime derivative

Determine whether the local runtime derivative is deterministically derived from the approved/promoted primary according to existing ICON pipeline conventions.

Do not demand byte identity between PNG and WebP.

---

# 15. IMAGE METADATA RECONCILIATION

Without editing files, inspect relevant image metadata.

Record as applicable:

- width;
- height;
- format;
- alpha/transparency characteristics;
- file size.

Compare against neighboring ICON-003 production conventions.

Do not create a new arbitrary visual standard.

Only flag actual pipeline/integrity mismatches.

---

# 16. VISUAL INSPECTION

Inspect the approved candidate and current local production/runtime assets visually.

This is required.

Determine whether:

- the approved candidate clearly reads as rail infrastructure / rail terminal;
- tracks, rail platform, terminal/depot/loading infrastructure, or equivalent rail semantics are visible;
- the current local primary matches the approved semantics;
- the runtime derivative preserves those semantics;
- no obvious corruption, wrong crop, wrong asset, or stale image is present.

Do not judge subjective micro-polish.

The question is semantic integrity.

---

# 17. COMPARE WITH OLD FAULTY PRIMARY

Where safely available from `origin/master` / Git history, inspect the old faulty production primary.

Do not restore it into the working tree.

Compare enough to answer:

- Is the approved/local candidate materially different?
- Does it resolve the identified recycling/processing semantic mismatch?
- Is there any risk that local changes merely re-encode the same faulty art?

Use temporary/read-only Git extraction if necessary.

Do not overwrite local files.

---

# 18. PROMOTION TOOLING

Locate any existing BVI promotion/regeneration tooling.

Record:

- exact script/tool paths;
- intended source;
- intended destination;
- derivative generation behavior;
- whether tooling has already apparently been run;
- whether running it now would overwrite local files.

Do NOT run a destructive promotion step in this reconciliation.

If the current local state already matches expected promotion output:

record that.

If it does not:

record the exact delta.

---

# 19. CLOSE-CANDIDATE MATERIAL

Locate any existing BVI close-candidate report.

Read it completely.

Determine:

- whether it describes the current local files;
- whether it predates or postdates current modifications;
- whether it claims promotion complete;
- whether it claims runtime evidence complete;
- whether it claims 23/23 integrity;
- whether it claims commit/push;
- whether those claims match actual Git/worktree truth.

Do not trust the report blindly.

---

# 20. EXISTING RUNTIME EVIDENCE

Locate any BVI runtime evidence already present.

Possible evidence may include:

- Buildings catalog screenshots;
- evidence JSON;
- asset-integrity output;
- 23/23 scan;
- runtime capture scripts;
- human-gate screenshots.

Determine whether existing runtime evidence:

- exists;
- corresponds to the current local asset bytes;
- corresponds to the current production/runtime paths;
- is recent enough;
- actually shows the Bahnterminal in the Buildings catalog;
- clearly demonstrates corrected rail-terminal semantics.

Do not recapture runtime evidence in this reconciliation unless required solely to inspect current state and it can be done without modifying production/test/assets.

Default:

> do not create new certification artifacts yet.

---

# 21. 23/23 INTEGRITY CLAIM

The previous materiality review referenced a possible:

> bounded 23/23 integrity scan.

Locate the authority for that number.

Determine:

- what the 23 items are;
- whether this is an existing ICON-003 integrity set rather than a new quota;
- whether the scan/tool exists;
- whether current local BVI changes preserve the rest of the set;
- whether existing results are current for the local state.

Do not turn 23 into a new content-production target.

Do not modify the other 22 assets.

---

# 22. DETERMINE WHETHER LOCAL PRIMARY IS ALREADY PROMOTED

Return one factual state:

### YES

The local production primary already equals the approved candidate according to repository promotion semantics.

### NO

The approved candidate exists but has not been promoted to the production primary.

### PARTIAL

The primary appears promoted but derivative/evidence/manifest is incomplete.

### UNVERIFIABLE

Authority or bytes cannot be reconciled.

Do not change the state.

---

# 23. DETERMINE WHETHER RUNTIME DERIVATIVE IS ALREADY CORRECT

Return one factual state:

### YES

Runtime derivative corresponds to the promoted approved primary and preserves the intended rail semantics.

### NO

Runtime derivative remains stale/wrong.

### PARTIAL

Derivative exists but integrity cannot yet be certified.

### UNVERIFIABLE

Pipeline authority cannot be established.

---

# 24. DETERMINE WHETHER BUILDINGS CATALOG WOULD USE IT

Answer:

> If the current local worktree were run now, would Buildings → Baukatalog render the corrected Bahnterminal asset?

Use actual runtime-resolution authority.

Return:

- YES;
- NO;
- UNVERIFIABLE.

Explain why.

---

# 25. LOCAL CHANGE OWNERSHIP

For every BVI-related local changed/untracked file classify:

- definitely BVI-001 task-owned;
- probably BVI-001 task-owned;
- unrelated;
- ambiguous ownership.

Do not stage anything.

Do not classify an entire directory as BVI-owned merely because one BVI file is inside it.

---

# 26. DUPLICATE / HISTORICAL FILES

Check for:

- duplicate candidate images;
- old faulty copies;
- archived candidates;
- temporary conversion output;
- generated previews;
- obsolete reports.

Do not delete them.

State whether they belong in a future BVI commit.

---

# 27. PRODUCTION PATH INTEGRITY

Verify BVI does NOT require:

- registry refactor;
- resolver refactor;
- new building ID;
- changed building definition;
- changed asset schema;
- changed API;
- changed save data.

If the current replacement can use the existing production path:

state:

> `ASSET REPLACEMENT ONLY`

plus derivative/evidence/docs as applicable.

---

# 28. GAMEPLAY FIREWALL

Verify no local BVI candidate work changes:

- building cost;
- prerequisites;
- category;
- construction;
- position;
- production behavior;
- workforce;
- transport;
- research;
- finance;
- progression.

Any such change is outside BVI.

Do not absorb it.

---

# 29. PDM FIREWALL

PDM-001 is:

> `CLOSED / PASS / SEALED`

BVI must not alter:

- placement flow;
- coordinate projection;
- World placement session;
- PDM runtime evidence;
- placement markers except through the normal existing building asset resolution if that naturally renders the updated asset.

Do not reopen PDM.

---

# 30. SCENARIO-B FIREWALL

Scenario-B remains paused.

BVI-001 is an integrity exception for one known incorrect production asset.

It is NOT authorization to restart:

- building-art generation;
- bulk visual production;
- visual quota work;
- world beautification.

No new art.

---

# 31. SOURCE OF TRUTH HIERARCHY

Use this hierarchy:

1. explicit human-gate approval for candidate selection;
2. actual current repository/worktree bytes;
3. production/runtime resolver truth;
4. existing BVI reports;
5. historical review claims.

If documentation contradicts actual bytes:

report the contradiction.

Do not silently rewrite history.

---

# 32. NO IMPLEMENTATION DURING RECONCILIATION

Expected modifications from this task:

> one reconciliation Markdown report only.

Do not:

- copy candidate into production;
- regenerate WebP;
- alter manifests;
- alter resolver;
- alter tests;
- alter scripts;
- modify screenshots;
- modify human-gate files.

Even if the missing step is obvious.

We first need a trustworthy state classification.

---

# 33. REPORT PATH

Create:

`docs/architecture/reviews/POST_V1_BVI_001_CURRENT_LOCAL_STATE_CLOSE_CANDIDATE_RECONCILIATION.md`

This is mandatory.

Do not overwrite existing BVI reports.

---

# 34. REQUIRED REPORT STRUCTURE

Use:

## A. Executive decision

## B. Repository baseline

## C. BVI authority discovered

## D. Historical BV-I6 defect

## E. Human-gate approval

## F. Approved candidate inventory

## G. Production primary state

## H. Runtime derivative state

## I. Runtime resolution path

## J. Hash / byte reconciliation

## K. Image metadata

## L. Visual semantic inspection

## M. Promotion tooling

## N. Existing close-candidate reconciliation

## O. Existing runtime evidence

## P. ICON-003 integrity / 23-of-23 status

## Q. Local BVI task-owned inventory

## R. Unrelated WIP firewall

## S. Gameplay / Save / API / PDM / Scenario-B firewall

## T. Missing work, if any

## U. Implementation-vs-certification readiness

## V. Recommended next prompt

## W. Final decision

---

# 35. AUTHORITY TABLE

Include:

| Authority | Exact path | What it establishes | Status |
|---|---|---|---|

Include at minimum, if found:

- human-gate document;
- approved candidate;
- production primary;
- runtime derivative;
- resolver/registry authority;
- promotion script;
- derivative-generation script;
- close-candidate report;
- runtime evidence;
- integrity scan/tool.

Do not fabricate missing paths.

---

# 36. ASSET RECONCILIATION TABLE

Include:

| Asset | Path | Git state | Hash/checksum | Dimensions | Relationship |
|---|---|---|---|---|---|

Rows should cover:

- approved candidate;
- current local production primary;
- `origin/master` production primary;
- current local runtime derivative;
- `origin/master` runtime derivative.

For Relationship use factual labels such as:

- `APPROVED SOURCE`
- `BYTE-IDENTICAL TO APPROVED`
- `DERIVED FROM APPROVED`
- `OLD FAULTY PRIMARY`
- `STALE DERIVATIVE`
- `UNVERIFIABLE`

---

# 37. VISUAL SEMANTICS TABLE

Include:

| Image | Rail-terminal semantics | Recycling/processing ambiguity | Corruption/crop issue | Result |
|---|---|---|---|---|

Do not score general beauty.

Only semantic correctness/integrity.

---

# 38. LOCAL INVENTORY TABLE

Include:

| Path | Git state | BVI ownership | Purpose | Future commit disposition |
|---|---|---|---|---|

Use future dispositions:

- `INCLUDE`
- `EXCLUDE — UNRELATED`
- `REVIEW BEFORE COMMIT`
- `GENERATED — POLICY DEPENDENT`

Do not stage or commit.

---

# 39. MISSING-WORK TABLE

Include:

| Required BVI step | Already complete locally? | Evidence | Remaining action |
|---|---:|---|---|

Possible steps:

- human approval;
- primary promotion;
- runtime derivative regeneration;
- integrity scan;
- Buildings runtime certification;
- closeout report;
- final root gates if production/tool changes require them;
- isolated commit/push.

This table is critical.

It determines whether another implementation prompt is actually needed.

---

# 40. IMPLEMENTATION VS CERTIFICATION CLASSIFICATION

Return exactly one classification:

### CLASS A — IMPLEMENTATION ALREADY COMPLETE LOCALLY

Use when:

- approved candidate is already promoted;
- runtime derivative is already correct;
- production path resolves to it;
- no asset implementation change remains.

Next work should be certification/closure only.

### CLASS B — SMALL IMPLEMENTATION DELTA REMAINS

Use when:

- approved candidate exists and authority is clear;
- one or more bounded promotion/derivative steps remain;
- no new art or architecture decision is required.

### CLASS C — LOCAL STATE DOES NOT REPRESENT VALID BVI IMPLEMENTATION

Use when:

- local modifications are not the approved candidate;
- derivative is wrong;
- close-candidate claims do not match bytes;
- implementation must be performed from known approved authority.

### CLASS D — AUTHORITY / INTEGRITY BLOCKED

Use when:

- approved candidate cannot be identified;
- human approval is ambiguous;
- production authority is contradictory;
- local files cannot be safely reconciled.

---

# 41. NEXT-PROMPT RULE

Based on the classification recommend exactly one next prompt type.

## If CLASS A

Recommend:

> `BVI-001 RUNTIME CERTIFICATION / FINAL CLOSEOUT`

Do NOT recommend another implementation slice.

## If CLASS B

Recommend:

> `BVI-001 MINIMAL PROMOTION / DERIVATIVE DELTA`

Only the exact missing steps may be implemented.

## If CLASS C

Recommend:

> `BVI-001 BOUNDED PRODUCTION REPLACEMENT`

Still no new art generation; use only the approved candidate.

## If CLASS D

Recommend:

> `BVI-001 AUTHORITY / HUMAN-GATE RESOLUTION`

No production modification.

---

# 42. RUNTIME CERTIFICATION READINESS

If CLASS A, determine whether current local state is ready to certify immediately.

Check whether:

- runtime asset path is known;
- deterministic app startup path exists;
- Buildings catalog can expose Bahnterminal;
- existing evidence tooling can be reused;
- current local asset bytes are stable enough to certify.

Return:

- `RUNTIME READY`
- `RUNTIME READY AFTER SMALL NON-PRODUCTION SETUP`
- `NOT RUNTIME READY`

Do not perform full certification in this prompt.

---

# 43. ROOT-GATE POLICY

This is a read-only reconciliation.

Do not rerun all root gates merely for ceremony.

If no production/test/tool files are changed by this prompt:

use existing gate state as contextual evidence only.

Do not claim this reconciliation newly certified root gates.

If existing BVI local modifications include only binary asset replacements:

state that accurately.

If scripts/source are also locally modified:

identify them.

Do not run fixes.

---

# 44. MATERIALITY IS ALREADY DECIDED

Do not repeat the entire Next Material Workstream Review.

BVI-001 has already been selected as the next material area.

This task asks only:

> What is already done locally, and what remains?

Do not reprioritize tutorial/category/iOS here.

---

# 45. iOS

Out of scope.

Do not discuss or begin iOS implementation.

The previous materiality review placed it behind BVI-001.

---

# 46. REQUIRED FACTUAL QUESTIONS

Explicitly answer:

1. What branch is under review?
2. What exact HEAD is under review?
3. What is the HEAD subject?
4. What is `origin/master`?
5. Does HEAD equal origin/master?
6. Is BVI-001 already committed?
7. Is BVI-001 already pushed?
8. What BVI-related local modified files exist?
9. What BVI-related untracked files exist?
10. What unrelated WIP exists?
11. What exact historical defect is BV-I6?
12. What building ID is affected?
13. What player-facing building name is affected?
14. What exact human-gate directory exists?
15. What exact human-gate document exists?
16. Does it explicitly approve a candidate?
17. What exact candidate is approved?
18. Is approval unambiguous?
19. Does the approved candidate file exist?
20. What is its checksum?
21. What are its dimensions?
22. What is the production primary path?
23. What is the HEAD/origin production-primary checksum?
24. What is the current local production-primary checksum?
25. Does the local primary differ from origin?
26. Is the local primary byte-identical to the approved candidate?
27. If not byte-identical, is the relationship authorized and explainable?
28. What is the runtime derivative path?
29. What is the origin runtime-derivative checksum?
30. What is the local runtime-derivative checksum?
31. Does the derivative differ from origin?
32. Is it derived from the approved/promoted primary?
33. What dimensions does the derivative have?
34. What resolver/registry path makes the Buildings catalog use it?
35. Would current local runtime render the corrected asset?
36. Is any stale duplicate able to override it?
37. Does the approved candidate visually read as rail infrastructure?
38. Does the local primary preserve that semantic?
39. Does the derivative preserve it?
40. Does the old origin asset reproduce the recycling/processing ambiguity?
41. What promotion tooling exists?
42. What derivative-generation tooling exists?
43. Has promotion apparently already been run?
44. Has derivative generation apparently already been run?
45. Would rerunning those tools overwrite current local files?
46. What existing BVI close-candidate report exists?
47. Does it match actual local bytes?
48. Does existing runtime evidence exist?
49. Does it correspond to current local bytes?
50. Does it show Buildings → Baukatalog → Bahnterminal?
51. Does it clearly show corrected rail semantics?
52. What is the authority for the 23/23 integrity set?
53. Has current local state passed that integrity set?
54. Is any other ICON-003 asset modified by BVI?
55. Are any other visual tracks modified by BVI?
56. Does BVI require registry/resolver changes?
57. Does BVI require gameplay changes?
58. Does BVI require Save changes?
59. Does BVI require API changes?
60. Does BVI require PDM changes?
61. Does BVI reopen Scenario-B?
62. What local files are definitely BVI task-owned?
63. Which files have ambiguous ownership?
64. Which files are definitely unrelated?
65. Is primary promotion already complete?
66. Is derivative regeneration already complete?
67. Is runtime certification already complete and current?
68. Is closeout documentation already complete and current?
69. What exact BVI work remains?
70. Is new art generation required?
71. Is any new product decision required?
72. Is any architecture decision required?
73. Which CLASS A/B/C/D applies?
74. Is runtime certification ready?
75. What exact next prompt should be run?
76. What report was created?
77. Were any production files modified by this reconciliation?
78. Were any test files modified?
79. Were any assets modified?
80. Was any art generated?
81. Was any commit performed?
82. Was any push performed?
83. Was any tag performed?

---

# 47. STOP CONDITIONS

STOP and return CLASS D or the relevant blocker if:

- human approval cannot be established;
- more than one candidate appears approved with no authority resolving them;
- approved candidate bytes are missing;
- production primary authority cannot be established;
- runtime resolver authority cannot be established;
- local modified primary cannot be safely distinguished from unrelated WIP;
- existing local asset appears corrupted;
- reports claim promotion but bytes contradict them materially;
- a new visual/product decision would be required.

Do not improvise.

---

# 48. FINAL DECISION

Return exactly ONE.

## OPTION A — CLASS A / IMPLEMENTATION ALREADY COMPLETE LOCALLY

Use only when no asset implementation step remains.

State:

> **BVI-001 RECONCILIATION:**  
> `PASS`

> **CLASSIFICATION:**  
> `CLASS A — IMPLEMENTATION ALREADY COMPLETE LOCALLY`

> **HUMAN-GATE AUTHORITY:**  
> `VERIFIED`

> **APPROVED CANDIDATE:**  
> `<exact path>`

> **PRODUCTION PRIMARY:**  
> `PROMOTED / VERIFIED`

> **RUNTIME DERIVATIVE:**  
> `CURRENT / VERIFIED`

> **BUILDINGS RUNTIME RESOLUTION:**  
> `CORRECTED ASSET`

> **NEW ART REQUIRED:**  
> `NO`

> **GAMEPLAY / SAVE / API / PDM:**  
> `UNCHANGED`

> **SCENARIO-B:**  
> `REMAINS PAUSED`

> **RUNTIME CERTIFICATION READINESS:**  
> `<RUNTIME READY / RUNTIME READY AFTER SMALL NON-PRODUCTION SETUP>`

> **NEXT PROMPT:**  
> `BVI-001 RUNTIME CERTIFICATION / FINAL CLOSEOUT`

> **COMMIT / PUSH / TAG:**  
> `NONE`

Then STOP.

---

## OPTION B — CLASS B / SMALL IMPLEMENTATION DELTA REMAINS

State:

> **BVI-001 RECONCILIATION:**  
> `PASS WITH SMALL DELTA`

> **CLASSIFICATION:**  
> `CLASS B — SMALL IMPLEMENTATION DELTA REMAINS`

> **HUMAN-GATE AUTHORITY:**  
> `VERIFIED`

> **ALREADY COMPLETE:**  
> `<steps>`

> **EXACT REMAINING IMPLEMENTATION:**  
> `<steps>`

> **NEW ART REQUIRED:**  
> `NO`

> **ARCHITECTURE DECISION REQUIRED:**  
> `NO`

> **NEXT PROMPT:**  
> `BVI-001 MINIMAL PROMOTION / DERIVATIVE DELTA`

> **COMMIT / PUSH / TAG:**  
> `NONE`

Then STOP.

---

## OPTION C — CLASS C / INVALID OR INCOMPLETE LOCAL IMPLEMENTATION

State:

> **BVI-001 RECONCILIATION:**  
> `IMPLEMENTATION REQUIRED`

> **CLASSIFICATION:**  
> `CLASS C — LOCAL STATE DOES NOT REPRESENT VALID BVI IMPLEMENTATION`

> **HUMAN-GATE AUTHORITY:**  
> `VERIFIED`

> **EXACT CONTRADICTION:**  
> `<evidence>`

> **APPROVED SOURCE TO USE:**  
> `<exact path>`

> **NEW ART REQUIRED:**  
> `NO`

> **NEXT PROMPT:**  
> `BVI-001 BOUNDED PRODUCTION REPLACEMENT`

> **COMMIT / PUSH / TAG:**  
> `NONE`

Then STOP.

---

## OPTION D — CLASS D / AUTHORITY OR INTEGRITY BLOCKED

State:

> **BVI-001 RECONCILIATION:**  
> `BLOCKED`

> **CLASSIFICATION:**  
> `CLASS D — AUTHORITY / INTEGRITY BLOCKED`

> **EXACT BLOCKER:**  
> `<evidence>`

> **PRODUCTION MODIFICATION:**  
> `NOT AUTHORIZED`

> **NEW ART:**  
> `NOT AUTHORIZED`

> **NEXT PROMPT:**  
> `BVI-001 AUTHORITY / HUMAN-GATE RESOLUTION`

> **COMMIT / PUSH / TAG:**  
> `NONE`

Then STOP.

---

## OPTION E — BVI ALREADY COMMITTED / BASELINE CHANGED

Use only if current authoritative Git state has moved beyond the previous materiality review and BVI is already committed/pushed.

State exact:

- HEAD;
- BVI commit;
- origin state;
- whether certification/closure remains.

Do not duplicate implementation.

Then STOP.

---

# 49. DEFINITION OF DONE

This reconciliation is complete only when:

- [ ] implementation guide read
- [ ] previous materiality review read
- [ ] current branch recorded
- [ ] exact HEAD recorded
- [ ] exact origin/master recorded
- [ ] HEAD/origin relationship recorded
- [ ] BVI Git history checked
- [ ] unrelated WIP protected
- [ ] BVI-related local changes identified
- [ ] historical BV-I6 defect verified
- [ ] affected building ID verified
- [ ] player-facing building name verified
- [ ] human-gate authority located
- [ ] explicit human approval verified
- [ ] approved candidate exact path recorded
- [ ] approved candidate bytes verified
- [ ] approved candidate checksum recorded
- [ ] approved candidate dimensions recorded
- [ ] production primary exact path recorded
- [ ] origin primary compared
- [ ] local primary compared
- [ ] runtime derivative exact path recorded
- [ ] origin derivative compared
- [ ] local derivative compared
- [ ] runtime resolver path traced
- [ ] Buildings catalog actual asset authority established
- [ ] visual semantic inspection completed
- [ ] old faulty asset comparison completed where available
- [ ] promotion tooling located
- [ ] derivative-generation tooling located
- [ ] destructive tooling NOT run
- [ ] existing close-candidate report reconciled
- [ ] existing runtime evidence reconciled
- [ ] 23/23 authority established
- [ ] local BVI task-owned inventory created
- [ ] unrelated WIP separated
- [ ] gameplay firewall verified
- [ ] Save firewall verified
- [ ] API firewall verified
- [ ] PDM firewall verified
- [ ] Scenario-B remains paused
- [ ] no new art generated
- [ ] exact missing work identified
- [ ] CLASS A/B/C/D/E selected
- [ ] runtime readiness stated where applicable
- [ ] exactly one next prompt recommended
- [ ] reconciliation report created
- [ ] no production files modified
- [ ] no test files modified
- [ ] no assets modified
- [ ] no commit
- [ ] no push
- [ ] no tag

---

# 50. CORE RULE

Do not mistake:

> local uncommitted work

for:

> missing implementation.

And do not mistake:

> an existing candidate image

for:

> approved production authority.

Reconcile all four layers:

1. human approval;
2. actual local bytes;
3. production/runtime resolution;
4. existing evidence and reports.

The purpose is to determine whether BVI-001 is already implemented locally.

If it is:

do not implement it again.

Move directly to runtime certification / final closeout.

If only a bounded promotion/derivative step is missing:

recommend only that delta.

If local files contradict the approved candidate:

recommend a bounded replacement using the existing approved source.

If authority is ambiguous:

STOP.

No new artwork.

No opportunistic cleanup.

No Scenario-B restart.

No PDM changes.

No gameplay changes.

No Save changes.

No API changes.

Create:

`docs/architecture/reviews/POST_V1_BVI_001_CURRENT_LOCAL_STATE_CLOSE_CANDIDATE_RECONCILIATION.md`

No commit.

No push.

No tag.

Then STOP.

# END OF PROMPT