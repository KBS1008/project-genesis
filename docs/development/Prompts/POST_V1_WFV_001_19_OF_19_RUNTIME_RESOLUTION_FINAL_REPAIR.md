# POST-V1 WFV-001 — 19/19 Runtime Resolution Final Repair

## Mode

BOUNDED FINAL REPAIR / RUNTIME RESOLUTION / EVIDENCE CORRECTION

This is NOT:
- a new Workforce art batch,
- a new art-direction pilot,
- a Workforce UX redesign,
- a new icon-family project,
- a gameplay/content change,
- or a broad cleanup pass.

WFV-001 art direction is already approved.

The production-completion close candidate reached nominal 19/19 asset and
resolver coverage, but independent human review rejected the final seal because
the supplied real Workforce runtime screenshots visibly showed generic
black/white fallback-style symbols for several newly covered roles instead of
their WFV-001 authored primary art.

This repair exists only to resolve that discrepancy and produce one truthful
final close candidate.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

Do not commit, push, or tag.

---

# 1. Authoritative predecessor state

Read first:

- `docs/design/workforce/WORKFORCE_ROLE_VISUAL_IDENTITY_WFV_001_CONTRACT.md`
  or the actual authoritative WFV-001 contract path if named differently
- WFV-001 pilot report
- WFV-001 Production Batch 1 report
- `docs/architecture/reviews/POST_V1_WFV_001_WORKFORCE_ROLE_VISUAL_IDENTITY_PRODUCTION_COMPLETION_8_TO_19_CLOSE_CANDIDATE.md`
- `WFV_001_PRODUCTION_MANIFEST.json`
- current visual asset registry / workforce resolver
- current `PGEmployeesWidget` / actual Workforce runtime consumer
- existing WFV-001 asset tests

Also inspect the rejected final runtime evidence:

- `WFV_001_PRODUCTION_COMPLETION_WORKFORCE_DESKTOP.png`
- `WFV_001_PRODUCTION_COMPLETION_WORKFORCE_NARROW.png`
- `WFV_001_PRODUCTION_COMPLETION_NEW_ROLE_COVERAGE.png`

The predecessor report claims:

- starting coverage 8/19
- ending coverage 19/19
- 11 new authored primaries
- 19 enabled employee types mapped
- all 19 enabled types:
  - production asset YES
  - resolver YES
  - runtime YES
- unknown-ID fallback retained
- root gates green

However, independent human review found that the supplied real runtime evidence
still visibly rendered generic black/white fallback-style icons for at least:

- researcher
- administrator
- junior engineer

while production-worker rows correctly displayed WFV-001 art.

Therefore:

**WFV-001 is NOT SEALED yet.**

Treat the previous `OPTION A` as a close candidate that failed the external
runtime-visual gate.

---

# 2. Hard scope

You own only what is necessary to make the already-authored WFV-001 production
art resolve correctly in the real Workforce runtime consumer and to prove that
it does.

Allowed:

- workforce visual resolver/registry correction
- employee-type-ID normalization if objectively required
- manifest/path correction
- runtime asset-path correction
- `WorkforceRoleVisual` correction
- bounded `PGEmployeesWidget` integration correction
- fixture/capture correction
- tests directly protecting this mapping
- evidence tooling directly needed for this final repair
- WFV-001 contract/report/inventory status correction

Not allowed:

- creating a new art direction
- regenerating the 19 WFV-001 primaries merely to fix runtime resolution
- changing approved artwork for aesthetic reasons
- creating new role concepts
- changing employee gameplay
- changing salaries/productivity/assignment rules
- changing APIs or saves unless a concrete existing bug makes this unavoidable
- redesigning the Workforce screen
- redesigning tables/cards/search
- changing ICON-001/002/003/004/005
- changing Buildings
- changing Research
- changing Production
- changing World
- changing Player Guidance
- broad shell/navigation work
- broad responsive redesign
- unrelated cleanup
- speculative refactoring

Do not absorb unrelated working-tree churn.

---

# 3. Critical rule: diagnose before changing

Do NOT assume the cause.

The human-visible symptom is:

> Some newly covered employee roles render generic black/white symbols in the
> actual Workforce widget even though the completion report says their WFV-001
> production primaries exist and resolve.

Trace the complete runtime chain for the affected rows.

For each affected employee row determine:

1. actual employee instance/type value returned to the UI
2. authoritative employee type ID
3. value passed by `PGEmployeesWidget`
4. value passed into the workforce visual presentation primitive
5. resolver lookup key
6. registry entry
7. asset URL/path returned
8. whether the browser requests the asset
9. whether that request succeeds
10. whether the `<img>`/visual element actually renders
11. whether a fallback branch is taken
12. exactly why that fallback branch is taken

Do this before implementing the repair.

Document the actual root cause.

Examples of possible causes include, but are not limited to:

- employee instance ID passed instead of employee type ID
- stale fixture IDs
- type-ID mismatch
- prefix mismatch
- registry mismatch
- manifest mismatch
- path mismatch
- consumer bypassing the new resolver
- failed image load causing fallback
- test fixture not representing production IDs
- capture tooling creating artificial/unknown roles
- CSS hiding/replacing images
- stale browser/build assets

These are hypotheses only.

Do not choose one without evidence.

---

# 4. Re-audit authoritative 19-role inventory

Re-read the actual enabled employee-type content.

Produce a deterministic table containing all 19 enabled types:

| Employee type ID | Player name | Production primary exists | Registry | Resolver | Runtime fixture | Actual runtime rendered source |
|---|---|---:|---:|---:|---:|---|

Do not copy the previous table blindly.

Verify it against the current repository state.

The goal is to distinguish:

- asset coverage
from
- resolver coverage
from
- actual runtime rendering.

These are three different gates.

All three must be true for 19/19.

---

# 5. Mandatory affected-role reproduction

At minimum reproduce real runtime rows for:

- a production-worker role already known to work
- `employee_researcher_basic`
- `employee_administrator_basic`
- `employee_engineer_basic`

Use their actual current IDs from authoritative content if they differ.

The test must prove that the latter three do NOT resolve to their previous
generic black/white symbols once repaired.

Also include enough additional roles from the completion batch to prove the fix
is not narrowly hard-coded to these three IDs.

Prefer a multi-domain fixture including examples such as:

- production
- engineering
- research
- administration
- logistics/distribution
- port/rail
- management

using real enabled role IDs.

---

# 6. Existing art is authoritative

The 19 production primaries already authored by WFV-001 are the source material
for this repair.

Do not regenerate them unless objective file corruption is demonstrated.

Specifically:

- Batch-1 8 remain unchanged.
- Completion 11 remain unchanged unless technically corrupt.
- Direction C remains the approved default.
- Direction A remains the approved intentional exception where already
  documented.
- `employee_administrator_basic` must not be replaced merely because its
  Direction-A artwork differs from the hybrid majority.

This is a runtime-resolution repair, not an art review.

---

# 7. Resolver contract

After repair there must be one clear runtime hierarchy.

For an enabled employee type with WFV-001 production art:

`employee type ID`
→ `WFV-001 production resolver`
→ `WFV-001 primary asset`

For an unknown/unsupported future ID:

`unknown employee type ID`
→ existing safe generic/category fallback

The fallback MUST remain.

But:

**No currently enabled one of the authoritative 19 employee types may reach
that fallback.**

Do not solve this by removing the fallback.

Do not solve it with 19 ad-hoc JSX conditionals.

Do not duplicate the production mapping in the Workforce screen.

The production registry/resolver remains the authority.

---

# 8. Runtime consumer requirement

Inspect the actual production Workforce consumer.

The final proof must use the same rendering path a player sees.

If the project uses a reusable component such as:

`WorkforceRoleVisual`

then the real `PGEmployeesWidget` must use that authoritative path.

Do not create a parallel evidence-only renderer.

Do not make the screenshot tool inject image elements directly.

Do not create an artificial dev-only UI and call it runtime proof.

The screenshots must demonstrate the real production component hierarchy.

---

# 9. No fake 19/19 evidence

The previous report's biggest problem was not necessarily the implementation;
it was that `Runtime YES` was asserted while the supplied human-visible
evidence contradicted it.

For this repair:

A role counts as runtime PASS only when all are true:

1. real enabled employee type
2. WFV-001 production asset exists
3. production resolver returns that asset
4. browser asset request succeeds
5. actual Workforce row renders that asset
6. screenshot visibly confirms authored WFV-001 art rather than generic fallback

Programmatic existence alone is insufficient.

Resolver unit tests alone are insufficient.

A manifest entry alone is insufficient.

---

# 10. Mandatory runtime instrumentation

Add bounded diagnostic capability to the capture/test tooling if necessary.

For every employee row used in the final runtime fixture, record:

- employee display name
- employee type ID
- resolved visual family
- resolved asset path
- fallback yes/no
- image load success/failure

This may be capture/test-only instrumentation.

Do not expose debug information in normal production UI.

Produce a machine-readable result such as:

`docs/architecture/reviews/evidence/WFV_001_FINAL_RUNTIME_RESOLUTION_REPORT.json`

Example conceptual structure:

```json
{
  "employeeTypeId": "employee_researcher_basic",
  "resolvedFamily": "WFV-001",
  "assetPath": "...",
  "fallback": false,
  "loaded": true
}