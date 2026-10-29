# PROJECT GENESIS — POST-V1 WORLD WEB

# SAFE COMMIT AND PUSH

## 0. MISSION

You are Cursor working in the existing Project Genesis repository:

`D:\Cursor\Project Genesis`

Your assignment is to safely commit and push the completed Post-V1 World Web development state, including the approved Visual Baseline documentation.

This is a **Git integration and repository synchronization task**.

Do not implement new features.

Do not modify gameplay.

Do not modify visual presentation.

Do not refactor source code.

Do not alter artwork.

Do not change personal saves.

Do not create a new branch.

Do not force-push.

### Primary objectives

1. Read the mandatory implementation guide.
2. Inspect the current Git state.
3. Identify changes belonging to the completed World Web development increments.
4. Distinguish intended project changes from unrelated WIP.
5. Exclude personal files, secrets, and temporary artifacts.
6. Verify the Visual Baseline documentation.
7. Stage only approved project changes.
8. Create one meaningful Git commit.
9. Push the commit to the current branch's existing upstream.
10. Verify that the remote branch contains the new commit.
11. Produce a concise final Git handover.

### Core principle

**Preserve all existing work and publish only the intended, safe project changes.**

---

# 1. MANDATORY FIRST ACTION

Before performing any Git operation, read:

`D:\Cursor\Project Genesis\docs\development\CURSOR_IMPLEMENTATION_GUIDE.md`

Record:

* Exact path.
* SHA-256.
* Read timestamp.
* Applicable Git requirements.
* Preservation rules.
* Documentation requirements.
* Relevant testing requirements.

Follow the guide.

If unavailable, stop:

`BLOCKED — IMPLEMENTATION GUIDE UNAVAILABLE`

---

# 2. CURRENT PROJECT BASELINE

The following development increments are administratively closed:

1. Slice 5 — Visual Polish & Game UI.
2. Slice 6 — Scenic World Operations & Logistics Presentation.
3. Scenic Map Visual Enhancement.
4. Scenic Map Visual Composition Upgrade.
5. Scenic Building Integration.
6. Scenic Scale and Perspective Review.
7. Scenic Building Grounding and Perspective.
8. Visual Baseline Freeze and Handover.

The canonical visual baseline is:

`docs/development/WORLD_WEB_VISUAL_BASELINE.md`

Verify that the file exists.

Do not recreate or modify it.

The current repository state is authoritative.

Historical handoffs provide context but do not automatically authorize staging every historical file.

---

# 3. APPROVED VISUAL FREEZE

The following properties must remain unchanged throughout this task.

## Region labels

Preserve:

* Font sizes.
* Light or white lettering.
* Dark outlines.
* Zoom behavior.
* Visibility behavior.
* Positioning.

## Buildings

Preserve:

* Existing building sizes.
* Existing building artwork.
* Existing visual anchors.
* Existing grounding treatment.
* Existing world positions.
* Existing selection behavior.

## Terrain

Preserve:

* Region artwork.
* Trees.
* Rivers.
* Paths.
* Landscape textures.

## Gameplay

Preserve:

* Construction.
* Economy.
* Transport.
* Camera.
* Minimap.
* Save schemas.
* API contracts.

This task must not change application behavior.

---

# 4. GIT PREFLIGHT

Run read-only Git inspection commands first.

Recommended commands:

```powershell
git rev-parse --show-toplevel
git branch --show-current
git rev-parse HEAD
git status --short
git status --porcelain=v1 --untracked-files=all
git remote -v
git branch -vv
git diff --stat
git diff --name-status
git diff --cached --name-status
```

Also inspect untracked files.

## Record

* Repository root.
* Current branch.
* Current HEAD.
* Current upstream.
* Remote name.
* Remote destination.
* Modified tracked files.
* Added files.
* Deleted files.
* Untracked files.
* Already staged files.
* Existing unrelated WIP.

Do not assume the branch is `main`.

Do not assume the remote is `origin`.

Do not assume the working tree is clean.

Do not switch branches.

---

# 5. REMOTE AND UPSTREAM SAFETY

Determine the current branch's existing upstream using Git.

The intended push destination must be derived from the actual repository configuration.

Do not invent a remote.

Do not invent a branch.

Do not change remote URLs.

Do not set a new upstream automatically.

Do not create a new remote branch automatically.

## Required condition

The current branch must already have an unambiguous upstream.

If no upstream exists, stop:

`BLOCKED — NO CONFIGURED UPSTREAM`

If the upstream destination is ambiguous, stop:

`BLOCKED — AMBIGUOUS PUSH DESTINATION`

If the branch is detached, stop:

`BLOCKED — DETACHED HEAD`

If the current branch is protected by repository-specific rules, follow those rules.

Do not bypass branch protection.

---

# 6. PROTECTED FILES

Never stage or commit personal data, local secrets, or unrelated temporary files.

## Explicitly protected

`Saves/browser-session.json`

`apps/web/.env.local`

`apps/api/saves/Daniela.json`

`apps/api/saves/Jallah.json`

Verify actual paths and case.

The two historical API saves must remain absent if they are currently absent.

Do not restore them.

## Additional protected categories

Exclude:

* Personal savegames.
* Local environment files.
* Credentials.
* API keys.
* Authentication tokens.
* Private certificates.
* Browser profiles.
* Browser session storage.
* Local databases containing personal data.
* Temporary test fixtures.
* Diagnostic screenshots containing sensitive information.
* Local backup files.
* Unrelated generated artifacts.
* Unrelated WIP.

Do not assume a file is safe merely because it is not listed above.

## Important

Do not modify `.gitignore` as part of this task.

Do not delete protected files.

Do not reset them.

Do not stash them.

Do not clean the working tree.

---

# 7. IDENTIFY THE INTENDED CHANGESET

Inspect the complete current Git diff.

Classify each changed or untracked path.

## Category A — Completed World Web implementation

Changes clearly belonging to the closed World Web development increments.

Examples may include:

* World Web renderer changes.
* Scenic layer presentation.
* Building marker presentation.
* Region inspector integration.
* Transport overlay presentation.
* Relevant styling.
* Relevant tests.

Verify actual paths and diffs.

## Category B — Approved baseline documentation

Include:

`docs/development/WORLD_WEB_VISUAL_BASELINE.md`

Include directly relevant development documentation where appropriate.

## Category C — Relevant supporting tests

Include tests directly supporting the completed implementation.

Do not stage unrelated test changes.

## Category D — Historical handoffs and evidence

Historical ZIP archives, screenshots, reports, and diagnostic artifacts are not automatically part of the source commit.

Include only files that are:

* Required by the repository's established documentation policy.
* Already intended to be version-controlled.
* Directly relevant to the completed development state.
* Safe to publish.

Do not add large archives simply because they exist.

## Category E — Unrelated WIP

Exclude unrelated changes.

Preserve them in the working tree.

## Category F — Protected or sensitive files

Exclude completely.

Do not stage.

Do not commit.

Do not publish.

---

# 8. CHANGESET SAFETY RULE

Do not use:

```powershell
git add .
git add -A
git add --all
```

Do not stage the entire repository indiscriminately.

Use explicit paths or carefully scoped pathspecs.

## Already staged files

Inspect the existing index before making changes.

If unrelated or protected files are already staged:

* Do not silently include them.
* Do not silently unstage them.
* Stop and report the conflict.

Use:

`BLOCKED — PREEXISTING STAGED CONTENT REQUIRES REVIEW`

If the index contains only clearly intended, safe changes, they may be included after verification.

## Ambiguous files

If a file cannot be confidently classified as part of the completed World Web work:

* Leave it unstaged.
* Document the reason.

Do not guess.

If ambiguity affects an essential file, stop before committing and request explicit approval.

---

# 9. DELETION SAFETY

Review every staged deletion.

Distinguish:

* Intentional source-code deletion.
* Intentional obsolete test deletion.
* Accidental deletion.
* Personal save deletion.
* Protected-file deletion.

Do not stage protected-file deletions.

Do not restore historical personal saves.

Do not use blanket restore commands.

Any deletion included in the commit must have a clear project-related justification.

---

# 10. SECRET AND PERSONAL-DATA REVIEW

Before staging, inspect candidate files for sensitive content.

Check for:

* Environment variables containing secrets.
* API tokens.
* Access keys.
* Private credentials.
* Session identifiers.
* Personal save contents.
* Absolute personal filesystem paths.
* Local-only configuration.

Do not print secret values in logs or final reports.

Use existing repository security tooling if available.

Do not install new dependencies solely for this task.

If sensitive content is found:

1. Do not stage the affected file.
2. Do not commit it.
3. Do not push.
4. Report the issue without revealing the secret.

Use:

`BLOCKED — SENSITIVE CONTENT DETECTED`

---

# 11. VERIFY VISUAL BASELINE

Confirm that:

`docs/development/WORLD_WEB_VISUAL_BASELINE.md`

exists and is included in the intended changeset if not already committed.

Verify that it documents:

* Approved region-label presentation.
* Frozen building sizes.
* Frozen terrain artwork.
* Frozen building artwork.
* Closed scenic-polish iteration.
* Known visual limitations.
* Future change-control rules.

Do not modify the document.

If the document is missing, stop:

`BLOCKED — VISUAL BASELINE DOCUMENT MISSING`

---

# 12. PRE-COMMIT VALIDATION

Run focused validation relevant to the intended changeset.

Prefer existing project commands.

Where appropriate:

* TypeScript check.
* Relevant unit tests.
* Relevant World Web tests.
* Build validation.

Do not start a full historical acceptance audit.

Do not install new dependencies unless explicitly required by the implementation guide.

## Validation rules

Record:

* Exact command.
* Exit code.
* Result.
* Relevant limitations.

If a directly relevant required check fails:

* Do not modify application code in this task.
* Do not create the commit.
* Report the failure.

Use:

`BLOCKED — PRE-COMMIT VALIDATION FAILED`

If a check cannot run because of an unavailable dependency or environment limitation, report it accurately.

Do not mark unavailable checks as PASS.

---

# 13. STAGE THE APPROVED CHANGESET

After completing classification and validation:

1. Stage only explicitly approved paths.
2. Use explicit Git path arguments.
3. Inspect the staged diff.
4. Inspect staged file names.
5. Verify staged deletions.
6. Verify no protected files are staged.
7. Verify no unrelated WIP is staged.
8. Verify the baseline documentation is included or already committed.

Recommended verification commands:

```powershell
git diff --cached --stat
git diff --cached --name-status
git diff --cached --check
git status --short
```

Also inspect the actual staged patch.

## Critical rule

If staged content differs from the approved changeset:

Do not commit.

Resolve only staging mistakes introduced by this task.

Do not alter pre-existing unrelated staged content.

---

# 14. REMOTE DIVERGENCE CHECK

Before committing, fetch the configured upstream safely.

Use the existing remote configuration.

Do not modify branches or working files.

Inspect:

* Local HEAD.
* Upstream HEAD.
* Ahead/behind counts.
* Divergence.

## Required behavior

If the upstream contains commits not present locally:

Do not automatically merge.

Do not automatically rebase.

Do not pull.

Do not force-push.

Stop:

`BLOCKED — UPSTREAM HAS NEW COMMITS`

Explain the situation and request a separate integration decision.

If fetch fails because of network or authentication issues:

Do not guess the remote state.

Stop:

`BLOCKED — REMOTE STATE NOT VERIFIED`

---

# 15. CREATE ONE COMMIT

If all safety checks pass, create exactly one commit.

Recommended commit message:

```text
feat(world-web): finalize scenic presentation and visual baseline
```

Optional commit body:

```text
Finalize the completed World Web scenic presentation work.

Include the approved visual baseline and relevant implementation
and test changes from the closed Post-V1 increments.

Preserve region labels, building sizes, artwork, gameplay,
personal saves, and unrelated work in progress.
```

Use the actual staged changeset.

Do not create an empty commit.

Do not amend an existing commit.

Do not squash historical commits.

Do not rewrite history.

Do not create tags.

Do not create a release.

Do not push yet if commit creation fails.

---

# 16. VERIFY THE LOCAL COMMIT

After committing, verify:

```powershell
git log -1 --format=fuller
git show --stat --oneline HEAD
git show --name-status --format= HEAD
git status --short
```

Confirm:

* The commit exists.
* The commit message is correct.
* Only intended files are included.
* Protected files are absent.
* Unrelated WIP remains preserved.
* No unintended file changes occurred.

If the commit includes unexpected content:

Do not push.

Do not automatically rewrite history.

Stop and report:

`BLOCKED — COMMIT CONTENT MISMATCH`

---

# 17. PUSH TO THE EXISTING UPSTREAM

Only after successful local verification:

1. Confirm the current branch again.
2. Confirm the configured upstream again.
3. Confirm that the remote has not advanced unexpectedly.
4. Push the current branch to its existing upstream.

Use a normal, non-force push.

Do not use:

* `--force`
* `--force-with-lease`
* `--mirror`
* `--all`
* `--tags`

Do not create a new upstream.

Do not push unrelated branches.

Do not bypass repository protections.

If the push is rejected:

* Do not retry with force.
* Do not automatically rebase.
* Do not automatically merge.
* Report the rejection.

---

# 18. VERIFY REMOTE SUCCESS

After a successful push:

1. Fetch the upstream state again.
2. Verify local HEAD.
3. Verify upstream HEAD.
4. Confirm both reference the same commit.
5. Confirm the current branch is synchronized.
6. Confirm unrelated WIP remains untouched.

## Required evidence

Record:

* Local branch.
* Upstream branch.
* Commit SHA.
* Remote commit SHA.
* Push exit code.
* Verification result.

Do not claim successful publication merely because the push command was attempted.

If remote verification is unavailable:

Use:

`PUSH_EXECUTED_REMOTE_VERIFICATION_INCOMPLETE`

Do not report full success.

---

# 19. POSTFLIGHT PRESERVATION

Verify:

* Personal saves remain unchanged.
* Local environment files remain unchanged.
* Protected deleted saves remain absent.
* Region artwork remains unchanged by this task.
* Building artwork remains unchanged by this task.
* Region-label presentation remains unchanged by this task.
* Building sizes remain unchanged by this task.
* Gameplay remains unchanged by this task.
* Unrelated WIP remains preserved.
* No additional branch was created.
* No history rewriting occurred.

Distinguish:

1. Changes intentionally included in the commit.
2. Existing unrelated working-tree changes.
3. Changes introduced by this Git task.

Do not claim that the working tree is clean if unrelated WIP remains.

A successful commit and push does not require deleting unrelated WIP.

---

# 20. FINAL REPORT

Produce a concise final report.

Do not create another large historical handoff archive.

## Required sections

### A. Git state before operation

* Branch.
* HEAD.
* Upstream.
* Working-tree summary.

### B. Included changes

* Number of committed files.
* Main implementation areas.
* Baseline documentation.
* Relevant tests.

### C. Excluded changes

* Protected files.
* Unrelated WIP.
* Historical artifacts not required for the commit.

### D. Validation

* Commands.
* Results.
* Limitations.

### E. Commit

* Full commit SHA.
* Commit message.
* Committed file count.

### F. Push

* Remote.
* Branch.
* Push result.
* Remote verification.

### G. Preservation

* Protected files.
* Existing WIP.
* Visual baseline.
* Gameplay.

### H. Final verdict

Use one of the defined outcomes below.

---

# 21. FINAL VERDICT

Assign exactly one verdict.

## OPTION A — COMMITTED AND PUSHED

Use only if:

* Intended changes were safely staged.
* Validation passed.
* Commit succeeded.
* Push succeeded.
* Remote commit was verified.
* Protected files remained safe.

## OPTION B — COMMITTED, PUSH NOT VERIFIED

Use if:

* Local commit succeeded.
* Push failed or remote verification could not be completed.
* No unsafe operation was performed.

## OPTION C — BLOCKED BEFORE COMMIT

Use if:

* Unsafe staged content exists.
* Sensitive content is detected.
* Required validation fails.
* Upstream has advanced.
* An essential file is missing.
* The intended changeset is ambiguous.

## OPTION D — NO COMMIT REQUIRED

Use if:

* All intended changes are already committed.
* The local branch is synchronized with its upstream.
* No additional commit is necessary.

## OPTION E — NOT STARTED

Use if:

* The operation could not begin.

Do not force OPTION A.

---

# 22. FINAL CURSOR RESPONSE

Your final response must include:

1. Final verdict.
2. Current branch.
3. Upstream branch.
4. Commit SHA.
5. Commit message.
6. Number of committed files.
7. Included change categories.
8. Excluded protected files.
9. Validation results.
10. Push result.
11. Remote verification result.
12. Remaining working-tree changes.
13. Any limitations or blockers.

Do not claim success without evidence.

---

# 23. FINAL NON-NEGOTIABLE INSTRUCTIONS

Read the implementation guide first.

Read the approved visual baseline.

Inspect the complete Git state.

Preserve unrelated WIP.

Preserve personal saves.

Preserve environment secrets.

Preserve intentionally deleted saves.

Preserve region labels.

Preserve building sizes.

Preserve artwork.

Preserve gameplay.

Do not implement new features.

Do not modify application code.

Do not use blanket staging.

Do not commit secrets.

Do not commit unrelated WIP.

Do not create a branch.

Do not change remotes.

Do not automatically configure upstream.

Do not merge or rebase automatically.

Do not force-push.

Do not rewrite history.

Do not create multiple commits.

Do not create another large handoff ZIP.

Create one safe commit when appropriate.

Push only to the verified existing upstream.

Verify the remote commit after pushing.

**The goal is to publish the completed Project Genesis World Web development state safely, preserve all personal and unrelated work, and establish a clean Git milestone for the next gameplay-development phase.**
