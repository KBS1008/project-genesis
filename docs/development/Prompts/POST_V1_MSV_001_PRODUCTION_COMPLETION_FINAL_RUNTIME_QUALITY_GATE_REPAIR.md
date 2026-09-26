# POST-V1 MSV-001 — Production Completion Final Runtime & Quality-Gate Repair

## MODE

Bounded final repair / runtime certification / quality-gate closeout.

This is NOT:
- a new art batch,
- a new art-direction review,
- a milestone redesign,
- a milestone gameplay/content change,
- a new visual-family workstream,
- a general repository cleanup,
- a Scenario-B reassessment.

MSV-001 production content already exists at 8/8.

The sole purpose of this task is to close the remaining evidence and quality-gate gap identified by:

`docs/architecture/reviews/POST_V1_MSV_001_MILESTONE_ACHIEVEMENT_VISUAL_IDENTITY_PRODUCTION_COMPLETION_4_TO_8_CLOSE_CANDIDATE.md`

Current close-candidate decision:

`OPTION B — ONE BOUNDED REPAIR REQUIRED`

because:
1. production evidence PNG generation was not executed,
2. runtime capture was not executed,
3. root repository gates were not executed.

Complete those items, repair only task-local defects if necessary, and return ONE final close candidate.

---

# 1. AUTHORITATIVE INPUTS

Read and obey:

- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/design/milestones/MILESTONE_VISUAL_IDENTITY_MSV_001_ART_CONTRACT.md`
- `docs/design/milestones/icon-msv-001/MSV_001_PRODUCTION_MANIFEST.json`
- `docs/design/milestones/icon-msv-001/MSV_001_PRODUCTION_ALPHA_REPORT.json`
- `docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md`
- `docs/architecture/reviews/POST_V1_MSV_001_MILESTONE_ACHIEVEMENT_VISUAL_IDENTITY_PRODUCTION_COMPLETION_4_TO_8_CLOSE_CANDIDATE.md`

Also inspect the current implementation of:

- `MilestoneVisual`
- milestone asset IDs / resolver
- `visual-asset-registry.ts`
- `PGMilestonesWidget`
- company dashboard milestone view-data/mappers
- MSV evidence/capture scripts
- focused MSV tests

Do not assume the prior report is correct where current repository/runtime evidence can verify it.

---

# 2. BASELINE FIRST

Before modifying anything, record:

- branch,
- current HEAD,
- working-tree status,
- task-owned MSV-001 changes,
- unrelated pre-existing changes.

The previous report recorded baseline HEAD:

`65dcbfc`

but DO NOT assume that is still current.

Use the actual current repository state.

Do not overwrite, revert, stage, or absorb unrelated working-tree changes.

No commit.
No push.
No tag.

---

# 3. FROZEN MSV-001 AUTHORITY

The following decisions are FROZEN.

## Art direction

MSV-001 is:

> stylized industrial achievement vignette inside a restrained octagonal industrial frame.

Tier model:

- Tier 1 = achievement primary
- Tier 2 = derived medallion

State treatment:

- LOCKED = CSS/UI modulation
- COMPLETED = full-color art / restrained UI highlight
- no separate locked/completed authored PNG family

## Production coverage

Authoritative enabled milestone target is 8/8:

1. `first_production`
2. `first_steel`
3. `first_profit`
4. `first_consumer_goods`
5. `first_machine_parts`
6. `first_industrial_machinery`
7. `first_advanced_electronics`
8. `profit_100`

The repaired `first_profit` pilot is authoritative.

The old rejected baked-text `first_profit` asset MUST NOT be promoted or restored.

## Current expected production state

Expected:

- 8 Tier-1 production primaries
- 8 Tier-2 production medallions
- generic unknown milestone medallion fallback
- 8/8 production manifest coverage
- 8/8 resolver coverage
- runtime `MilestoneVisual`
- runtime integration in `PGMilestonesWidget`

Do not regenerate artwork merely because this task is being run.

---

# 4. HARD FIREWALLS

DO NOT:

- create new milestone concepts,
- regenerate already accepted milestone artwork without a concrete defect,
- change milestone triggers,
- change milestone rewards,
- change milestone IDs,
- change milestone YAML semantics,
- change milestone progression logic,
- change save-game semantics,
- rebalance anything,
- redesign Company Operations,
- redesign `PGMilestonesWidget`,
- add new milestone UX,
- create milestone notifications,
- create new achievement mechanics,
- reopen ICON-001,
- reopen ICON-002,
- reopen ICON-003,
- reopen ICON-004,
- reopen ICON-005,
- reopen WFV-001,
- reopen World/WBM,
- change Player Guidance,
- perform generic lint cleanup,
- perform generic refactors,
- update unrelated docs.

A task-local defect necessary to certify MSV-001 MAY be repaired.

Keep every repair minimal.

---

# 5. PRE-FLIGHT PRODUCTION INTEGRITY CHECK

Before runtime capture, verify the current production family programmatically.

Confirm:

## Primary assets

Exactly the eight authoritative milestone IDs resolve to production Tier-1 primaries.

## Medallions

Exactly the eight authoritative milestone IDs resolve to production Tier-2 medallions.

## Fallback

An unknown milestone ID resolves safely to the generic MSV-001 fallback.

It must not:

- crash,
- resolve to an unrelated ICON family,
- display a broken image,
- require a known milestone ID.

## Files

All manifest-referenced production files exist and decode.

## Rejected asset

Confirm the rejected old `first_profit` baked-text pilot is NOT referenced by:

- production manifest,
- production resolver,
- production registry,
- runtime consumer.

Record this explicitly.

---

# 6. RUN EXISTING MSV ASSET VERIFICATION

Run the existing production resolution verifier:

```bash
node tools/verify-msv-001-production-resolution.mjs