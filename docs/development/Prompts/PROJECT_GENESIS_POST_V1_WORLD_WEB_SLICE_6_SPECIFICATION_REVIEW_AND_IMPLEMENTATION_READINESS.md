# PROJECT GENESIS — POST-V1 WORLD WEB

# SLICE 6 SPECIFICATION REVIEW AND IMPLEMENTATION READINESS

## 0. MISSION

You are Cursor working in the existing Project Genesis repository:

`D:\Cursor\Project Genesis`

Your assignment is to perform a focused, read-only specification review and implementation-readiness assessment for the next development slice after:

**Post-V1 World Web Slice 5 — Visual Polish & Game UI**

The purpose is to determine what **Slice 6 actually contains**, based on the project's existing authoritative documentation.

Do not assume that Slice 6 has already been defined.

Do not invent a feature scope based on the slice number.

Do not infer requirements merely from typical game-development practices.

Do not begin implementation.

Your objectives are to:

1. Locate the authoritative Project Genesis roadmap and relevant development specifications.
2. Determine whether a formally defined Slice 6 exists.
3. Identify its exact name, purpose, scope, and intended functionality.
4. Explain how Slice 6 fits into the existing World Web development sequence.
5. Identify dependencies on previous slices.
6. Determine whether the existing implementation is ready for Slice 6.
7. Identify missing decisions or specifications that must be resolved before implementation.
8. Recommend a bounded implementation approach only when supported by the actual documentation.
9. Produce one concise, independently reviewable handoff.
10. Avoid reopening the completed Slice 5 audit cycle.

This is a **specification-discovery and readiness task**, not an implementation or acceptance-testing task.

---

## 1. MANDATORY FIRST ACTION

Before performing any other operation, read the complete repository implementation guide:

`D:\Cursor\Project Genesis\docs\development\CURSOR_IMPLEMENTATION_GUIDE.md`

Record:

* Exact path.
* SHA-256.
* Read timestamp.
* Applicable instructions.
* Documentation hierarchy.
* Preservation requirements.
* Implementation and handoff conventions.

Follow the guide's requirements.

If the guide cannot be read, stop and report:

`BLOCKED — IMPLEMENTATION GUIDE UNAVAILABLE`

Do not continue based on assumptions.

---

## 2. STRICT EXECUTION BOUNDARIES

### Allowed operations

You may:

* Read repository documentation.
* Inspect existing roadmap files.
* Inspect existing slice specifications.
* Inspect architecture documents.
* Inspect existing implementation plans.
* Inspect relevant source files to understand the current implementation.
* Inspect existing test definitions without executing them.
* Inspect existing Slice 5 closure and handover documents.
* Run read-only Git commands.
* Compute file hashes.
* Create a specification-review report.
* Create an implementation-readiness matrix.
* Create a proposed implementation breakdown.
* Package documentation into a handoff ZIP.

### Forbidden operations

You must not:

* Modify application code.
* Modify TypeScript or JavaScript files.
* Modify CSS.
* Modify tests.
* Modify browser harnesses.
* Modify diagnostic scripts.
* Modify personal saves.
* Modify environment files.
* Modify artwork.
* Modify backups.
* Modify unrelated work-in-progress.
* Run the application.
* Launch a browser.
* Run Playwright.
* Run unit tests.
* Run integration tests.
* Run acceptance tests.
* Install dependencies.
* Run automated fixes.
* Modify Git history.
* Commit changes.
* Reset Git.
* Clean Git.
* Stash changes.
* Create a new feature implementation.
* Reopen historical Slice 5 evidence investigations.

All analysis must be read-only.

Generate reports in an isolated temporary directory.

The only authorized repository output is the final handoff ZIP, if permitted by the implementation guide.

---

## 3. SLICE 5 IS CLOSED

Treat the previous development slice as administratively closed:

**SLICE 5 — CLOSED WITH DOCUMENTED EVIDENCE LIMITATIONS**

Its independent evidence status remains:

**OPTION B**

This does not mean that all historical evidence was independently verified.

It means that the Slice 5 implementation and review cycle has been closed with explicitly documented limitations.

Do not attempt to upgrade Slice 5 to OPTION A.

Do not repeat Slice 5 tests.

Do not reopen:

* Minimap testing.
* Camera testing.
* Responsive layout testing.
* Keyboard accessibility testing.
* Construction placement testing.
* Construction persistence testing.
* Historical source-hash reconciliation.
* Historical preservation investigations.

Only consult the existing handover where it is relevant to Slice 6.

### Relevant existing handover

Locate, if available:

`project-genesis-post-v1-world-web-slice-5-final-signoff-and-handover.zip`

Previously reviewed SHA-256:

`f59ebef9e5d145865b7f6d4de5c0d2ce897ef9d0cc427374d6417026f06119f6`

Read:

* `FINAL_SIGNOFF.md`
* `SLICE_5_HANDOVER_TO_SLICE_6.md`
* `SLICE_5_FINAL_STATUS.json`
* `SLICE_5_EVIDENCE_LIMITATIONS.md`

Use these only to establish the starting point for Slice 6.

Do not initiate another Slice 5 audit.

---

## 4. DISCOVER THE AUTHORITATIVE DEVELOPMENT ROADMAP

Search the existing repository documentation for the project's actual development sequence.

Prioritize:

1. The implementation guide.
2. Approved project roadmaps.
3. Approved architecture documents.
4. Explicit World Web development plans.
5. Numbered Post-V1 World Web slice specifications.
6. Existing development prompts.
7. Relevant architecture reviews.
8. Historical planning notes, clearly marked as historical.

Search relevant documentation directories, including:

`docs/development/`

`docs/architecture/`

`docs/architecture/reviews/`

Also inspect other documentation locations referenced by the implementation guide.

Do not assume that every historical prompt remains authoritative.

### Required discovery questions

Determine:

* Is Slice 6 explicitly defined?
* What is its exact documented title?
* Which document defines it?
* Is the document approved, draft, superseded, or historical?
* Does the roadmap define Slice 6 differently from a standalone specification?
* Are there conflicting descriptions?
* Does Slice 6 belong to the Post-V1 World Web sequence?
* Is Slice 6 the immediate successor to Slice 5?
* Is the next planned development step possibly named differently?

### Source hierarchy

When sources conflict:

1. Follow the implementation guide's documented authority rules.
2. Prefer explicitly approved current specifications over historical drafts.
3. Preserve conflicting statements in the report.
4. Do not silently merge incompatible scopes.
5. Do not choose a scope merely because it seems technically reasonable.

If no authoritative Slice 6 specification exists, state that clearly.

---

## 5. CLASSIFY THE SLICE 6 SPECIFICATION STATUS

Assign exactly one status:

### `DEFINED_AND_APPROVED`

An authoritative, sufficiently complete Slice 6 specification exists and is approved for implementation.

### `DEFINED_BUT_DRAFT`

A recognizable Slice 6 specification exists, but approval or mandatory details are missing.

### `PARTIALLY_DEFINED`

Slice 6 is mentioned in a roadmap or planning document, but its implementation scope is incomplete.

### `CONFLICTING_DEFINITIONS`

Multiple relevant sources describe materially different Slice 6 scopes without an authoritative resolution.

### `NOT_DEFINED`

No reliable project documentation establishes what Slice 6 contains.

### `NOT_VERIFIED`

The available repository evidence is insufficient to determine the specification status.

Do not convert `PARTIALLY_DEFINED` or `NOT_DEFINED` into `DEFINED_AND_APPROVED` by proposing your own features.

---

## 6. EXTRACT THE ACTUAL SLICE 6 SCOPE

If a Slice 6 specification exists, extract its contents faithfully.

For every feature or requirement, record:

* Requirement ID, if present.
* Exact requirement name.
* Short description.
* Source document.
* Source section or line reference.
* Whether it is mandatory or optional.
* Acceptance criterion, if defined.
* Dependencies.
* Explicit exclusions.
* Open questions.

Organize the scope according to the original specification's structure.

Do not replace the source's terminology with invented game-design concepts.

### Functional scope

Identify only features explicitly supported by the documentation.

Possible categories may include:

* World interaction.
* Game UI.
* Construction.
* Economy.
* Simulation.
* Persistence.
* Navigation.
* Accessibility.
* Visual presentation.
* Backend integration.

These are **search categories**, not assumed Slice 6 requirements.

Include a category only when the actual specification supports it.

### Nonfunctional scope

Identify documented requirements concerning:

* Performance.
* Accessibility.
* Responsiveness.
* Browser compatibility.
* Data preservation.
* Savegame compatibility.
* Security.
* Reliability.
* Testing.
* Documentation.

Do not invent numeric thresholds.

### Explicit exclusions

Record any functionality that the specification explicitly places outside Slice 6.

If exclusions are not documented, say so.

---

## 7. EXPLAIN SLICE 6 IN PLAIN LANGUAGE

Produce a clear, nontechnical overview suitable for the project owner.

Answer:

1. What is Slice 6 called?
2. What is its main purpose?
3. What new functionality would the user experience?
4. Which existing functionality would be extended?
5. What would remain unchanged?
6. How does Slice 6 differ from Slice 5?
7. What is explicitly outside its scope?
8. What must be completed before implementation?

Use concrete examples only when they follow from the specification.

If the specification does not support a concrete gameplay example, do not invent one.

The overview should allow the project owner to understand the actual development goal without reading every source document.

---

## 8. VERIFY IMPLEMENTATION DEPENDENCIES

Identify the prerequisites explicitly required by the Slice 6 specification.

Relevant areas may include:

* Existing World Web architecture.
* Existing world-state model.
* Existing UI components.
* Construction integration.
* Savegame and persistence interfaces.
* Backend contracts.
* Shared types.
* Existing test infrastructure.
* Required assets.

These are investigation areas, not assumed dependencies.

For each documented dependency, record:

* Dependency name.
* Source requirement.
* Relevant repository path.
* Current observed state.
* Whether the dependency appears available.
* Whether its readiness is proven or only inferred.
* Any blocking gap.

Use read-only source inspection.

Do not execute tests.

Do not modify implementation files.

### Slice 5 dependencies

Use the existing Slice 5 handover to identify any relevant preserved interfaces or assumptions.

Do not require the historical Slice 5 audit to be reopened before Slice 6 can begin.

---

## 9. ASSESS CURRENT REPOSITORY READINESS

Capture:

* Current branch.
* Current HEAD.
* Read-only Git status.
* Relevant source locations.
* Existing work-in-progress considerations.
* Relevant protected files and directories.

Previously reported historical values were:

* Branch: `master`
* HEAD: `0d3dc7eb699792a75b4950c07482ec308e7dfcfc`

Do not assume these remain current.

Record the actual observed values.

### Readiness categories

For each relevant prerequisite, use:

* `READY`
* `READY_WITH_LIMITATIONS`
* `NOT_READY`
* `NOT_VERIFIED`
* `NOT_APPLICABLE`

Explain each classification.

Do not classify a feature as ready merely because a file with a plausible name exists.

Do not claim runtime functionality was verified during this read-only task.

---

## 10. PRESERVATION AND WORKTREE SAFETY

The Project Genesis repository contains existing work-in-progress and protected data.

Carry forward the preservation requirements documented in the implementation guide and Slice 5 handover.

At minimum, account for:

* Personal saves.
* Environment files.
* Deleted saves expected to remain absent.
* Artwork.
* Save backups.
* Unrelated tracked WIP.
* Unrelated untracked WIP.
* Existing diagnostic scripts.
* Existing browser harnesses.

Known protected examples include:

`Saves/browser-session.json`

`apps/web/.env.local`

`apps/api/saves/Daniela.json`

`apps/api/saves/Jallah.json`

**Verify exact path spelling and case against the repository.**

Do not assume the examples are the complete protected inventory.

Do not modify any of these files.

Do not include private save contents or environment secrets in the handoff.

### Read-only safety verification

Capture Git status before and after the review.

If possible, compare the relevant protected-file hashes without exposing contents.

If unexpected changes appear, document them.

Do not automatically revert anything.

---

## 11. IDENTIFY MISSING SPECIFICATION DECISIONS

Determine whether the Slice 6 specification is complete enough to implement safely.

Check whether the available documentation defines:

* Feature scope.
* Mandatory requirements.
* Optional requirements.
* Acceptance criteria.
* Explicit exclusions.
* Architecture constraints.
* Data contracts.
* Persistence implications.
* UI expectations.
* Accessibility expectations.
* Test expectations.
* Preservation requirements.
* Dependencies.
* Approval status.

Do not require unnecessary detail where the specification deliberately leaves implementation choices open.

Separate:

### Blocking decisions

Questions that must be resolved before implementation can begin.

### Nonblocking implementation choices

Details that can reasonably be decided during implementation without changing the approved scope.

### Optional future improvements

Ideas outside the approved Slice 6 scope.

Do not turn optional ideas into mandatory work.

---

## 12. IMPLEMENTATION READINESS VERDICT

Assign exactly one overall verdict.

### OPTION A — READY FOR IMPLEMENTATION

Use only if:

* The authoritative Slice 6 scope is identified.
* The specification is approved or otherwise valid under project rules.
* Mandatory requirements are sufficiently clear.
* Critical dependencies are available.
* No unresolved blocking decision prevents implementation.
* Preservation constraints are understood.

### OPTION B — READY WITH LIMITED CLARIFICATIONS

Use if:

* The scope is substantially defined.
* Implementation can reasonably begin.
* Some noncritical details require clarification.
* No unresolved issue makes the implementation scope fundamentally ambiguous.

### OPTION C — SPECIFICATION INCOMPLETE

Use if:

* Slice 6 is partially defined.
* Mandatory requirements or acceptance criteria are missing.
* Significant implementation decisions remain unresolved.

### OPTION D — CONFLICTING OR UNSAFE TO START

Use if:

* Authoritative sources materially conflict.
* A critical dependency is unavailable.
* The proposed implementation would violate documented preservation or architecture requirements.

### OPTION E — NO AUTHORITATIVE SLICE 6 SPECIFICATION

Use if:

* No authoritative document establishes Slice 6's scope.

Do not force OPTION A or B.

A clear OPTION C or E is preferable to implementing an invented feature set.

---

## 13. PROPOSE A BOUNDED IMPLEMENTATION APPROACH

Only if the actual specification provides enough information, propose a practical implementation breakdown.

The proposal must be derived from the documented requirements.

### Required characteristics

* Small, logically grouped implementation steps.
* Explicit scope boundaries.
* Relevant source locations.
* Expected deliverables.
* Acceptance evidence for each step.
* Preservation safeguards.
* Clear completion criteria.
* No unnecessary audit loops.

### Important restriction

Do not generate a sequence of speculative Cursor prompts.

Do not create 10–20 follow-up tasks.

Prefer one well-scoped implementation prompt when the specification is ready.

If the scope is too large for one safe implementation pass, explain the minimum justified division.

Do not arbitrarily split the work merely to create more prompts.

### If Slice 6 is not defined

Do not propose an implementation plan.

Instead, provide the minimum decisions needed to create an authoritative specification.

---

## 14. REQUIRED REPORTS

Create a new isolated documentation handoff containing the following files.

### 14.1 `FINAL_REPORT.md`

A concise but complete report covering:

1. Executive summary.
2. Authoritative sources.
3. Slice 6 specification status.
4. Actual Slice 6 scope.
5. Plain-language feature overview.
6. Dependencies.
7. Current repository readiness.
8. Preservation requirements.
9. Blocking questions.
10. Recommended next action.
11. Final readiness verdict.

### 14.2 `SLICE_6_SPECIFICATION_DISCOVERY.json`

Include:

* Discovered roadmap files.
* Discovered Slice 6 specifications.
* Source paths.
* SHA-256 values.
* Approval status.
* Authority classification.
* Conflicts.
* Final specification-status verdict.

### 14.3 `SLICE_6_SCOPE_AND_FEATURES.md`

Explain what Slice 6 actually does.

Use clear language.

Do not invent requirements.

### 14.4 `SLICE_6_REQUIREMENTS_MATRIX.json`

For every documented requirement include:

* ID.
* Name.
* Description.
* Source.
* Source section.
* Mandatory or optional.
* Acceptance criterion.
* Dependencies.
* Exclusions.
* Open questions.

### 14.5 `SLICE_6_DEPENDENCY_READINESS.json`

Record each relevant dependency and its observed readiness.

### 14.6 `SLICE_6_IMPLEMENTATION_READINESS.md`

Explain:

* Whether implementation can begin.
* What is ready.
* What is missing.
* What is blocking.
* What is nonblocking.
* Which decisions require project-owner approval.

### 14.7 `SLICE_6_PROPOSED_IMPLEMENTATION_BREAKDOWN.md`

Provide a bounded implementation approach only when supported by the specification.

Otherwise state:

`Implementation breakdown deferred until an authoritative Slice 6 specification is available.`

### 14.8 `SLICE_6_OPEN_DECISIONS.json`

Include:

* Decision ID.
* Description.
* Source.
* Blocking or nonblocking.
* Options explicitly supported by project documentation.
* Recommended resolution, if justified.
* Required decision owner, if documented.

Do not invent decision owners.

### 14.9 `SLICE_5_TO_SLICE_6_BOUNDARY.md`

Record:

* Slice 5 closure status.
* Relevant inherited interfaces.
* Protected assets.
* Known historical evidence limitations.
* Explicit boundary between completed Slice 5 work and proposed Slice 6 work.

### 14.10 `REPOSITORY_READONLY_STATE.json`

Record:

* Branch.
* HEAD.
* Git-status summary.
* Read-only operations performed.
* Confirmation of no code changes.
* Confirmation of no tests executed.
* Confirmation of no browser sessions launched.

### 14.11 `SOURCE_REFERENCES.json`

Include every source materially used in the review.

For each source record:

* Exact path.
* SHA-256.
* Availability.
* Authority classification.
* Relevant sections.
* Limitations.

### 14.12 `handoff-manifest.json`

Include:

* Manifest schema.
* Every packaged file except the manifest itself.
* Relative path.
* File size.
* SHA-256.

Additional documentation may be included if necessary.

Do not include unrelated repository files.

Do not package private save contents, environment secrets, credentials, or unrelated WIP.

---

## 15. FINAL HANDOFF ZIP

Create:

`project-genesis-post-v1-world-web-slice-6-specification-review-and-implementation-readiness-handoff.zip`

Target path:

`D:\Cursor\Project Genesis\docs\architecture\reviews\project-genesis-post-v1-world-web-slice-6-specification-review-and-implementation-readiness-handoff.zip`

Do not overwrite historical Slice 5 handoffs.

Do not create additional ZIP archives unless the implementation guide explicitly requires them.

This is a specification-review handoff.

It must not contain newly implemented Slice 6 features.

---

## 16. ZIP INTEGRITY

After creating the ZIP:

1. Reopen the archive.
2. Verify all CRC values.
3. Verify every manifest-listed SHA-256.
4. Verify every manifest-listed file size.
5. Check for missing files.
6. Check for unexpected files.
7. Check for duplicate entries.
8. Check for absolute paths.
9. Check for path traversal.
10. Calculate the complete ZIP SHA-256.

Do not claim integrity PASS unless every check succeeds.

---

## 17. FINAL CURSOR RESPONSE

Your final response must clearly answer the following questions.

### A. What is Slice 6?

State the exact documented title and purpose.

If no authoritative specification exists, say so.

### B. What functionality does Slice 6 introduce?

Summarize only the features supported by actual documentation.

### C. How does it differ from Slice 5?

Explain the scope boundary.

### D. Is Slice 6 ready for implementation?

Provide the final OPTION A/B/C/D/E readiness verdict.

### E. What is missing?

Identify only genuine blockers and necessary clarifications.

### F. What should happen next?

Recommend exactly one next action:

* Begin implementation using the approved specification.
* Resolve a small number of nonblocking clarifications while preparing implementation.
* Complete or approve the missing specification.
* Resolve a documented architecture or dependency blocker.

Do not recommend another broad audit cycle.

### G. What was modified?

Confirm:

* Application code changes: zero.
* Test changes: zero.
* Browser tests: zero.
* Runtime tests: zero.
* Protected-file changes: zero.
* Git mutations: zero.

### H. Final handoff

Provide:

* Exact ZIP path.
* ZIP SHA-256.
* ZIP entry count.
* Manifest validation.
* CRC validation.

---

## 18. FINAL NON-NEGOTIABLE INSTRUCTIONS

**This task is about discovering and understanding the real Slice 6 specification.**

Do not invent Slice 6 features.

Do not assume its purpose.

Do not implement anything.

Do not run tests.

Do not modify protected files.

Do not reopen Slice 5.

Do not manufacture acceptance criteria.

Do not turn historical drafts into approved requirements.

Do not generate an unnecessary sequence of follow-up prompts.

If Slice 6 is defined, explain it clearly and assess implementation readiness.

If Slice 6 is not defined, say so and identify the minimum decisions required.

**Produce one focused, evidence-based specification-review handoff that enables the project owner to make the next development decision.**
