# PROJECT GENESIS — POST-V1 WORLD WEB

# SLICE 6 SPECIFICATION DEFINITION

## 0. MISSION

You are Cursor working in the existing Project Genesis repository:

`D:\Cursor\Project Genesis`

Your assignment is to create a **concrete, bounded, implementation-ready proposal** for:

**Post-V1 World Web Slice 6**

The previous specification-readiness review concluded:

**OPTION E — NO AUTHORITATIVE SLICE 6 SPECIFICATION**

This means that the repository currently lacks an approved definition of Slice 6's scope.

Your task is to resolve the planning gap by producing a carefully grounded **proposed specification for project-owner approval**.

This is not another specification-discovery exercise.

You must use the existing Project Genesis documentation to determine which development priorities are supported by the project's established direction, then propose an appropriate next increment.

The resulting specification must be sufficiently concrete that, once approved, it can serve as the basis for a focused implementation prompt.

### Primary objectives

1. Read the mandatory implementation guide.
2. Review the existing Project Genesis roadmap and architectural direction.
3. Review the completed World Web slices and their implemented capabilities.
4. Identify meaningful functionality that remains unimplemented.
5. Determine which remaining functionality is appropriate for the next bounded development slice.
6. Propose one coherent Slice 6 scope.
7. Define exact functional requirements.
8. Define explicit exclusions.
9. Define measurable acceptance criteria.
10. Define dependencies, preservation rules, and implementation boundaries.
11. Identify decisions requiring project-owner approval.
12. Produce a complete proposed specification and final handoff ZIP.

### Critical distinction

You are authorized to **propose** new Slice 6 requirements.

You are not authorized to represent those proposals as previously approved project requirements.

Every requirement must be classified as one of:

* `EXISTING_APPROVED_REQUIREMENT`
* `EXISTING_DOCUMENTED_DIRECTION`
* `DERIVED_TECHNICAL_REQUIREMENT`
* `NEW_SLICE_6_PROPOSAL`

Do not silently promote a proposal into an approved requirement.

### Final objective

Deliver one coherent specification proposal that the project owner can approve, reject, or revise.

Do not implement Slice 6.

---

# 1. MANDATORY FIRST ACTION

Before any other operation, read the complete implementation guide:

`D:\Cursor\Project Genesis\docs\development\CURSOR_IMPLEMENTATION_GUIDE.md`

Record:

* Exact path.
* SHA-256.
* Read timestamp.
* Applicable instructions.
* Documentation authority rules.
* Repository preservation requirements.
* Prompt and handoff conventions.
* Approval requirements.

Follow all applicable instructions.

If the guide is unavailable, stop and report:

`BLOCKED — IMPLEMENTATION GUIDE UNAVAILABLE`

Do not continue based on assumptions.

---

# 2. EXECUTION MODE

This is a **read-only analysis and specification-authoring task**.

## Allowed

You may:

* Read existing documentation.
* Read the project roadmap.
* Read architecture documents.
* Read development plans.
* Read historical prompts.
* Read relevant source files.
* Inspect existing tests without executing them.
* Read previous Slice 5 handoffs.
* Read the Slice 6 specification-readiness handoff.
* Run read-only Git commands.
* Calculate hashes.
* Create new specification documents.
* Create decision and requirement matrices.
* Create one final handoff ZIP.

## Forbidden

You must not:

* Implement features.
* Modify application code.
* Modify TypeScript or JavaScript.
* Modify CSS.
* Modify existing tests.
* Modify browser harnesses.
* Modify diagnostic scripts.
* Modify personal saves.
* Modify environment files.
* Modify artwork.
* Modify backups.
* Modify unrelated work-in-progress.
* Launch the application.
* Launch browser tests.
* Run Playwright.
* Run acceptance tests.
* Install dependencies.
* Execute automated fixes.
* Modify Git history.
* Commit.
* Reset.
* Clean.
* Stash.
* Reopen Slice 5 audits.
* Invent historical approvals.

Generate documentation in an isolated temporary directory.

Only the final documentation handoff may be written to the repository, subject to the implementation guide.

Do not modify or replace any existing approved specification.

---

# 3. ESTABLISHED PROJECT STATE

The preceding development slice is:

**Post-V1 World Web Slice 5 — Visual Polish & Game UI**

Its administrative status is:

`CLOSED WITH DOCUMENTED EVIDENCE LIMITATIONS`

Its independent evidence verdict remains:

`OPTION B`

Slice 5 is closed.

Do not reopen it.

Do not repeat:

* Minimap verification.
* Camera verification.
* Responsive layout verification.
* Keyboard accessibility verification.
* Construction placement verification.
* Construction persistence verification.
* Historical source-hash reconstruction.
* Historical preservation investigations.

Use existing evidence only to understand the implemented baseline.

## Relevant Slice 5 handoff

Locate, if available:

`project-genesis-post-v1-world-web-slice-5-final-signoff-and-handover.zip`

Previously reviewed SHA-256:

`f59ebef9e5d145865b7f6d4de5c0d2ce897ef9d0cc427374d6417026f06119f6`

Relevant documents:

* `FINAL_SIGNOFF.md`
* `SLICE_5_FUNCTIONAL_SUMMARY.md`
* `SLICE_5_HANDOVER_TO_SLICE_6.md`
* `SLICE_5_EVIDENCE_LIMITATIONS.md`

These documents establish the previous slice's handover context.

They do not define Slice 6.

---

# 4. READ THE PREVIOUS SLICE 6 READINESS REVIEW

Locate:

`project-genesis-post-v1-world-web-slice-6-specification-review-and-implementation-readiness-handoff.zip`

Previously reviewed SHA-256:

`b365ef033484fa34d974026f84799aa95d4e25f7169ab3ae332872e3b043ca67`

Read its relevant reports, including:

* `FINAL_REPORT.md`
* `SLICE_6_SPECIFICATION_DISCOVERY.json`
* `SLICE_6_SCOPE_AND_FEATURES.md`
* `SLICE_6_REQUIREMENTS_MATRIX.json`
* `SLICE_6_DEPENDENCY_READINESS.json`
* `SLICE_6_IMPLEMENTATION_READINESS.md`
* `SLICE_6_OPEN_DECISIONS.json`
* `SLICE_5_TO_SLICE_6_BOUNDARY.md`

The previous review concluded that no authoritative Slice 6 specification was found.

Accept this as the existing planning baseline unless an authoritative document clearly establishes otherwise.

**Do not repeat the previous broad specification search.**

Instead, use the already identified roadmap and architecture sources to construct a grounded proposal.

---

# 5. ESTABLISH THE DOCUMENTED PRODUCT DIRECTION

Read the relevant authoritative Project Genesis documents.

Prioritize:

1. Mandatory implementation guide.
2. Approved roadmap.
3. Approved product and game-design documentation.
4. Approved architecture.
5. World Web development plans.
6. Relevant backend and persistence contracts.
7. Existing implementation status.
8. Historical prompts, clearly marked as historical.

Identify the project's documented direction concerning:

* The World Web.
* The player's interaction with the world.
* Existing and planned gameplay systems.
* Construction.
* Economy and resources.
* Simulation.
* Regions.
* Progression.
* Persistence.
* User interface.
* Future development milestones.

These are **investigation categories**, not assumed Slice 6 features.

Only describe capabilities that are supported by actual project documentation.

## Required output

Create a short section titled:

`Documented Product Direction`

For every relevant direction, record:

* Description.
* Source path.
* Source section.
* Source authority.
* Whether it is implemented.
* Whether it remains planned.
* Whether its implementation status is uncertain.

Do not infer that a planned feature is unimplemented merely because it is absent from one source file.

---

# 6. IDENTIFY THE ALREADY IMPLEMENTED BASELINE

Establish which World Web capabilities have already been implemented.

Use:

* Previous slice specifications.
* Existing handoff reports.
* Relevant source files.
* Existing architecture documentation.

Do not run tests.

Do not perform another acceptance audit.

## Areas to consider

Where supported by the repository, document:

* World rendering.
* Regions.
* Camera controls.
* Minimap.
* Region overview.
* Responsive presentation.
* Keyboard accessibility.
* Construction placement.
* Construction cancellation.
* Construction persistence.
* Game UI.
* World-state integration.
* Existing backend interactions.

For each capability, classify:

* `IMPLEMENTED`
* `PARTIALLY_IMPLEMENTED`
* `PLANNED_NOT_IMPLEMENTED`
* `NOT_VERIFIED`
* `NOT_APPLICABLE`

Use the available evidence.

Do not claim runtime verification occurred during this task.

## Critical duplication rule

**Do not propose existing functionality as a new Slice 6 feature.**

An extension of an existing feature may be proposed only if it introduces clearly defined new behavior.

For every proposed extension, explicitly distinguish:

* Existing behavior.
* New behavior.
* Reason the extension is necessary.

---

# 7. HANDLE HISTORICAL SLICE NUMBERING

The previous review identified a historical document:

`POST_V1_WORLD_WEB_FINAL_2D_SCENIC_PRODUCTION_INTEGRATION_CONTRACT_REVIEW.md`

It reportedly used the label:

`Slice 6 — Minimap and Region Overview`

This historical classification must not automatically determine the new Post-V1 World Web Slice 6 scope.

Minimap and region-overview functionality have already been addressed in previous development work.

## Required handling

1. Identify the historical document's actual role.
2. Record the historical Slice 6 reference.
3. Explain whether it belongs to the same development sequence.
4. Distinguish historical review numbering from the current Post-V1 implementation sequence.
5. Avoid duplicating previously implemented functionality.
6. Preserve the numbering discrepancy as documentation context.

Do not create a new minimap implementation merely because an older document calls it Slice 6.

---

# 8. IDENTIFY CANDIDATE FEATURES

From the documented product direction and implementation baseline, identify candidate next-step features.

A candidate is valid only if:

1. It has a documented relationship to Project Genesis.
2. It is not already fully implemented.
3. It can be clearly described.
4. It has a plausible dependency path.
5. It can be bounded to a manageable development increment.
6. It does not require unsafe changes to protected data.
7. It does not contradict an approved architecture or roadmap.

## Candidate evaluation

For each candidate, record:

* Candidate ID.
* Feature name.
* User-visible purpose.
* Supporting source.
* Source authority.
* Current implementation status.
* Dependencies.
* Estimated complexity: LOW / MEDIUM / HIGH / UNKNOWN.
* Expected user value.
* Technical risk.
* Preservation risk.
* Relationship to existing World Web features.
* Reason to include or exclude it from Slice 6.

Complexity and value estimates are proposals, not verified project facts.

Label them accordingly.

## Do not create an unbounded wishlist

Identify only the strongest relevant candidates.

Prefer a short list of approximately three to five meaningful candidates when the documentation supports that many.

If fewer are supported, include fewer.

Do not invent candidates to reach a target count.

---

# 9. SELECT ONE COHERENT SLICE 6 PROPOSAL

Choose one recommended Slice 6 scope.

The selected scope must:

* Advance the documented product direction.
* Deliver a meaningful user-visible improvement.
* Avoid duplicating completed slices.
* Fit the existing architecture.
* Minimize unnecessary changes.
* Respect preservation requirements.
* Have a clear completion boundary.
* Support objective acceptance criteria.
* Be suitable for a focused implementation effort.

## Selection principles

Prioritize:

1. Alignment with approved project direction.
2. Dependencies already available.
3. Clear user value.
4. Manageable implementation complexity.
5. Limited regression risk.
6. Minimal impact on protected state.
7. Testable acceptance criteria.

Do not select a feature merely because it is visually impressive.

Do not select a feature merely because it is easy.

Do not select a feature that depends on major undefined systems unless the specification explicitly scopes those dependencies.

## Required decision record

Explain:

* Which candidate was selected.
* Why it was selected.
* Which candidates were deferred.
* Why they were deferred.
* Which assumptions require project-owner confirmation.

The selection is a recommendation, not an approval.

---

# 10. CREATE THE PROPOSED SLICE 6 SPECIFICATION

Create a complete proposed specification titled:

`POST_V1_WORLD_WEB_SLICE_6_PROPOSED_SPECIFICATION.md`

The document must contain the following sections.

## 10.1 Status

Set:

`PROPOSED — PENDING PROJECT OWNER APPROVAL`

Do not mark it approved.

## 10.2 Title

Provide a concise descriptive Slice 6 title derived from the selected functionality.

## 10.3 Purpose

Explain what Slice 6 accomplishes.

## 10.4 Player-facing outcome

Describe the visible or interactive result from the player's perspective.

## 10.5 Current baseline

Identify the existing functionality on which Slice 6 builds.

## 10.6 In-scope functionality

List the exact proposed features.

Avoid vague wording such as:

* Improve gameplay.
* Make the world more interactive.
* Enhance the UI.
* Polish the experience.

Every feature must describe observable behavior.

## 10.7 Out-of-scope functionality

Explicitly exclude:

* Previously completed Slice 5 work.
* Unrelated architectural rewrites.
* Unapproved gameplay systems.
* Unnecessary persistence migrations.
* Unrelated UI redesigns.
* Unrelated refactoring.

Add feature-specific exclusions as appropriate.

## 10.8 Functional requirements

Use requirement IDs:

`S6-FR-001`, `S6-FR-002`, etc.

For every requirement include:

* ID.
* Name.
* Description.
* Trigger.
* Expected behavior.
* Relevant state changes.
* Failure behavior.
* Dependencies.
* Source classification.

## 10.9 Nonfunctional requirements

Use IDs:

`S6-NFR-001`, `S6-NFR-002`, etc.

Include only relevant requirements.

Possible areas:

* Performance.
* Accessibility.
* Responsiveness.
* Persistence safety.
* Error handling.
* Browser compatibility.
* Maintainability.

Do not invent arbitrary numerical thresholds.

## 10.10 Acceptance criteria

Use IDs:

`S6-AC-001`, `S6-AC-002`, etc.

Each acceptance criterion must be:

* Observable.
* Unambiguous.
* Testable.
* Connected to at least one requirement.
* Limited to Slice 6's approved scope.

Specify the intended verification method:

* Unit test.
* Integration test.
* Browser test.
* Manual UI verification.
* Static inspection.

These are future implementation requirements.

Do not execute them during this specification task.

## 10.11 Architecture integration

Identify the existing components or interfaces that Slice 6 is expected to use.

Clearly distinguish:

* Existing architecture.
* Proposed extensions.
* New interfaces.
* Assumptions requiring verification during implementation.

Do not invent current source files.

## 10.12 Data and persistence

Specify whether Slice 6 is expected to:

* Read existing data.
* Modify existing state.
* Introduce new state.
* Persist new data.
* Require migrations.

If persistence behavior cannot yet be defined, mark it as a blocking specification decision.

Do not authorize destructive save changes.

## 10.13 UI and UX behavior

Describe relevant:

* Entry points.
* Controls.
* Visible states.
* Feedback.
* Error states.
* Keyboard interaction.
* Responsive behavior.

Only include elements necessary for the selected functionality.

## 10.14 Dependencies

List prerequisites and their observed readiness.

## 10.15 Risks

Identify realistic implementation risks.

Avoid speculative worst-case lists.

## 10.16 Preservation requirements

Carry forward all relevant repository protections.

## 10.17 Definition of Done

Specify the exact conditions for considering Slice 6 complete.

## 10.18 Approval

Include:

`Approval Status: PENDING PROJECT OWNER APPROVAL`

`Implementation Authorized: NO`

Do not invent an approval signature or date.

---

# 11. REQUIREMENT TRACEABILITY

Create:

`SLICE_6_REQUIREMENTS_TRACEABILITY.json`

For every requirement record:

* Requirement ID.
* Title.
* Source classification.
* Supporting source.
* Source section.
* Proposed behavior.
* Acceptance criteria.
* Dependencies.
* Implementation assumptions.
* Approval requirement.

## Source classification rules

### EXISTING_APPROVED_REQUIREMENT

Use only when an authoritative approved source explicitly requires the behavior.

### EXISTING_DOCUMENTED_DIRECTION

Use when project documentation establishes the direction but does not specify the exact implementation.

### DERIVED_TECHNICAL_REQUIREMENT

Use when a requirement follows from an existing architecture or interface constraint.

### NEW_SLICE_6_PROPOSAL

Use when the behavior is newly proposed for Slice 6.

Do not mislabel new proposals as existing approved requirements.

---

# 12. DEFINE IMPLEMENTATION BOUNDARIES

Identify the likely implementation areas.

For each area, record:

* Existing relevant paths.
* Expected responsibility.
* Proposed change category.
* Dependencies.
* Preservation concerns.

Do not modify those files.

Do not generate implementation code.

Do not create a patch.

## Scope-control rules

The future implementation must avoid:

* Unrelated refactoring.
* Broad architecture rewrites.
* Unnecessary new dependencies.
* Changes to protected personal data.
* Reimplementation of completed features.
* New systems outside the approved specification.

If the proposed scope requires a large architectural change, reconsider whether it is appropriate for one slice.

---

# 13. PRESERVATION REQUIREMENTS

Preserve the repository's existing work-in-progress and protected files.

Relevant categories include:

* Personal saves.
* Environment files.
* Deleted-save absence states.
* Artwork.
* Save backups.
* Existing diagnostic scripts.
* Browser harnesses.
* Unrelated tracked files.
* Unrelated untracked files.

Known examples include:

`Saves/browser-session.json`

`apps/web/.env.local`

`apps/api/saves/Daniela.json`

`apps/api/saves/Jallah.json`

Verify actual paths and case before referencing them as protected files.

Do not assume these examples are exhaustive.

Do not read or package private values unnecessarily.

Do not modify protected data.

Do not change save formats during this task.

---

# 14. PROJECT-OWNER DECISIONS

Create:

`SLICE_6_OWNER_APPROVAL_DECISIONS.md`

This document must make the approval decision straightforward.

Include:

## Proposed Slice 6 title

State the recommended title.

## Proposed outcome

Explain in plain language what the player gains.

## Proposed features

Summarize the exact features.

## Explicit exclusions

Explain what will not be developed.

## Why this is the recommended next step

Reference the project direction.

## Alternatives considered

Briefly explain the strongest alternatives.

## Risks and dependencies

Highlight only material issues.

## Required approval decisions

Separate:

* Scope approval.
* Feature-specific blocking decisions.
* Optional preferences.

## Approval choices

Provide:

### OPTION A — APPROVE PROPOSED SLICE 6

The project owner approves the proposed scope and authorizes preparation of an implementation prompt.

### OPTION B — APPROVE WITH SPECIFIC CHANGES

The project owner approves the general direction but requests explicitly listed modifications before implementation.

### OPTION C — SELECT A DIFFERENT CANDIDATE

The project owner chooses another documented feature candidate.

### OPTION D — DEFER SLICE 6

The project owner postpones the development slice.

These are **owner decision options**, not independent verification verdicts.

Do not select an approval option on the owner's behalf.

---

# 15. PROPOSE A SINGLE IMPLEMENTATION APPROACH

Create:

`SLICE_6_IMPLEMENTATION_APPROACH.md`

The implementation approach must be conditional on approval.

It should describe:

1. Expected implementation areas.
2. Logical order of work.
3. Main integration points.
4. Required tests.
5. Required browser verification, if relevant.
6. Persistence verification, if relevant.
7. Preservation safeguards.
8. Completion criteria.
9. Final handoff expectations.

Prefer one focused implementation prompt.

Do not generate a long sequence of audit or correction prompts.

Do not create the implementation prompt yet.

The implementation prompt must only be prepared after the project owner approves the proposed specification.

---

# 16. SPECIFICATION QUALITY CHECK

Before finalizing the proposal, verify the documentation itself.

This is a static consistency review.

Do not run application tests.

Check:

* Every feature has a clear purpose.
* Every mandatory requirement has acceptance criteria.
* Every acceptance criterion maps to a requirement.
* Requirements do not contradict one another.
* Scope exclusions are explicit.
* Dependencies are identified.
* Persistence implications are addressed.
* Protected assets are covered.
* Existing functionality is not duplicated.
* Source classifications are accurate.
* Proposed requirements are not presented as approved.
* The scope is realistically bounded.
* The Definition of Done is concrete.
* Blocking owner decisions are explicit.

If the proposal is not sufficiently complete, correct the specification documents within this same task.

Do not initiate another review cycle.

---

# 17. REQUIRED DELIVERABLES

Create one isolated handoff containing:

### 17.1 `FINAL_REPORT.md`

Executive summary of the proposed Slice 6 definition.

### 17.2 `POST_V1_WORLD_WEB_SLICE_6_PROPOSED_SPECIFICATION.md`

Complete proposed specification.

### 17.3 `SLICE_6_DOCUMENTED_PRODUCT_DIRECTION.md`

Relevant documented roadmap and architectural direction.

### 17.4 `SLICE_6_IMPLEMENTED_BASELINE.md`

Existing functionality and previously completed work.

### 17.5 `SLICE_6_CANDIDATE_EVALUATION.md`

Candidate features, evaluation, and selection rationale.

### 17.6 `SLICE_6_REQUIREMENTS_TRACEABILITY.json`

Requirements and source classifications.

### 17.7 `SLICE_6_ACCEPTANCE_CRITERIA.md`

Explicit, measurable acceptance criteria.

### 17.8 `SLICE_6_ARCHITECTURE_AND_DEPENDENCIES.md`

Integration points and technical dependencies.

### 17.9 `SLICE_6_PRESERVATION_BOUNDARIES.md`

Protected files, WIP, and preservation constraints.

### 17.10 `SLICE_6_OWNER_APPROVAL_DECISIONS.md`

Plain-language approval options.

### 17.11 `SLICE_6_IMPLEMENTATION_APPROACH.md`

Conditional implementation plan.

### 17.12 `SLICE_6_SPECIFICATION_QUALITY_CHECK.json`

Static consistency results.

### 17.13 `SLICE_6_SOURCE_REFERENCES.json`

Source paths, hashes, authority, and limitations.

### 17.14 `REPOSITORY_READONLY_STATE.json`

Read-only repository-state record.

### 17.15 `handoff-manifest.json`

SHA-256 and size for every packaged file except the manifest itself.

Do not include unrelated files.

Do not include personal save contents.

Do not include environment secrets.

---

# 18. FINAL HANDOFF ZIP

Create:

`project-genesis-post-v1-world-web-slice-6-specification-definition-handoff.zip`

Target location:

`D:\Cursor\Project Genesis\docs\architecture\reviews\project-genesis-post-v1-world-web-slice-6-specification-definition-handoff.zip`

Do not overwrite historical handoffs.

Do not modify existing specifications.

Do not create an approved Slice 6 specification in the canonical development directory before owner approval.

The proposed specification must remain clearly marked:

`PROPOSED — PENDING PROJECT OWNER APPROVAL`

---

# 19. ZIP INTEGRITY

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

# 20. FINAL CURSOR RESPONSE

Your final response must contain the following sections.

## A. Proposed Slice 6 title

State the recommended title.

## B. What Slice 6 would do

Explain the proposed functionality in plain language.

## C. Why this scope was selected

Reference the existing Project Genesis direction.

## D. What is already implemented

Identify relevant completed functionality that will not be duplicated.

## E. What Slice 6 will not do

Summarize the explicit exclusions.

## F. Main requirements

Summarize the proposed functional requirements.

## G. Acceptance criteria

Explain how the future implementation would be verified.

## H. Risks and dependencies

Identify only the relevant risks.

## I. Required owner decision

State:

`PROPOSED — PENDING PROJECT OWNER APPROVAL`

`IMPLEMENTATION AUTHORIZED — NO`

Present the approval options.

## J. Repository safety

Confirm:

* Application code changes: zero.
* Test changes: zero.
* Browser tests: zero.
* Runtime tests: zero.
* Protected-file changes: zero.
* Git mutations: zero.

## K. Final ZIP

Provide:

* Exact ZIP path.
* ZIP SHA-256.
* ZIP entry count.
* Manifest validation.
* CRC validation.

---

# 21. FINAL NON-NEGOTIABLE INSTRUCTIONS

Do not stop after merely reporting that Slice 6 has no existing specification.

That fact is already known.

Your assignment is to create a useful, concrete proposal grounded in the actual Project Genesis roadmap and architecture.

Do not invent historical requirements.

Do not duplicate completed functionality.

Do not propose an unbounded feature list.

Do not implement code.

Do not run tests.

Do not modify protected data.

Do not reopen Slice 5.

Do not mark the proposal approved.

Do not create an implementation prompt before owner approval.

Do not create another unnecessary audit cycle.

**Produce one coherent, bounded, technically grounded Slice 6 specification proposal that the project owner can meaningfully approve or revise.**
