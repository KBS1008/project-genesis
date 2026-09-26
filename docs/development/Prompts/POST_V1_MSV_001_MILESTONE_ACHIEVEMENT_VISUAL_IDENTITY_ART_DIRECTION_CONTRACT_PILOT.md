# POST-V1 MSV-001 Milestone / Achievement Visual Identity
# Art-Direction & Contract Pilot

## Mode

BOUNDED VISUAL ART-DIRECTION PILOT.

This is NOT a production-completion batch.

This task must:

1. audit the authoritative semantics of all 8 enabled milestones,
2. freeze the MSV-001 semantic/art boundary,
3. create exactly FOUR representative milestone visual pilots,
4. compare candidate visual hierarchy at real game scales,
5. define the MSV-001 visual contract,
6. prepare evidence for HUMAN VISUAL APPROVAL,
7. STOP.

Do NOT activate MSV-001 in production runtime.

Do NOT modify gameplay/content semantics.

Do NOT continue automatically to 8/8.

Do NOT commit, push, or tag.

---

# 1. Authority

Scenario-B Visual Coverage Reassessment selected:

**MSV-001 — Milestone / Achievement Visual Identity**

as the next material visual workstream.

Current repository evidence:

- 8 enabled milestones
- 0/8 authored milestone visuals
- milestone progression currently collapses primarily to a numeric KPI/count
- no meaningful per-milestone visual reward
- milestone progression/reward assessment: ABSENT
- milestone visual gap: HIGH

Major existing visual families are SEALED:

- ICON-001 Resources
- ICON-002 Building Categories
- ICON-003 Buildings — 23/23
- ICON-004 Technologies — 22/22
- ICON-005 Production Processes — 7/7
- WFV-001 Workforce — 19/19
- World visual presentation
- WBM-001 World building-marker integration

Do NOT reopen those tracks.

MSV-001 must complement them rather than duplicate them.

---

# 2. Product objective

Milestones represent:

> “What significant industrial/economic accomplishment has the player achieved?”

The milestone visual must feel like a REWARD.

It must not look like:

- another resource icon,
- another building catalog item,
- another technology apparatus,
- another recipe/process illustration,
- another workforce portrait,
- a generic dashboard glyph.

The visual language should make progression feel authored and game-like.

A milestone should be recognizable as:

**an achievement / accomplishment / breakthrough moment**

rather than merely the object involved in its trigger.

---

# 3. Authoritative milestone audit

Inspect all currently enabled milestone YAML/content definitions.

Historical inventory expects 8:

- `first_production`
- `first_steel`
- `first_machine_parts`
- `first_industrial_machinery`
- `first_advanced_electronics`
- `first_consumer_goods`
- `first_profit`
- `profit_100`

VERIFY current repository truth.

For each enabled milestone record:

| Field | Required |
|---|---|
| milestone ID | yes |
| authoritative display name | yes |
| description | yes |
| trigger type | yes |
| trigger target | yes |
| relevant resource/recipe/system | yes |
| semantic accomplishment | yes |
| safe visual motifs | yes |
| misleading motifs to avoid | yes |

Do not infer mechanics that do not exist.

If English/German names are inconsistent, record it as separate localization debt.

Do NOT change content names in this task.

---

# 4. Exact pilot set

Create pilots for exactly these four milestones unless repository semantics prove one is no longer enabled:

1. `first_production`
2. `first_steel`
3. `first_profit`
4. `first_consumer_goods`

If one is absent or materially changed, STOP and report the semantic conflict rather than silently substituting another milestone.

Why these four:

### first_production

Tests:

- first industrial accomplishment
- “the factory has come alive”
- broad production semantics without tying the milestone to an invented machine

### first_steel

Tests:

- concrete industrial output
- strong material identity
- relationship to ICON-001 / ICON-005 without copying either

### first_profit

Tests:

- abstract economic achievement
- whether MSV-001 can communicate accomplishment without becoming a generic finance icon

### first_consumer_goods

Tests:

- downstream/value-chain accomplishment
- more sophisticated industrial progression
- differentiation from first-production and material-output milestones

This set deliberately spans:

- industrial activation
- material achievement
- economic achievement
- value-chain achievement

---

# 5. MSV-001 visual hierarchy to test

Test a two-tier milestone hierarchy.

Do NOT assume both tiers must ultimately ship.

## Tier 1 — Achievement Primary

Target use:

- milestone detail
- completion/reward presentation
- future progression panel
- larger achievement surface

Target useful size:

- approximately 96–128px minimum presentation
- rewarding at approximately 128–256px

Art direction:

**stylized industrial achievement vignette**

The image should communicate the accomplishment, not merely show an isolated object.

Examples of visual grammar:

- accomplishment composition
- controlled framing
- meaningful industrial motif
- sense of completion/payoff
- stronger silhouette than normal UI art
- visual hierarchy centered on the achieved result

Do NOT simply reuse an ICON-005 process illustration.

---

# 6. Tier 2 — Achievement Medallion

Target use:

- KPI surfaces
- milestone list
- compact completion marker
- future toast/notification
- approximately 48–64px

Test whether the compact form should be:

A. a derived medallion from the Tier-1 primary,

B. a dedicated symbolic compact,

or

C. unnecessary because a sufficiently strong primary can scale.

Evaluate visually.

Do not choose solely based on implementation convenience.

---

# 7. Achievement grammar

The visual family should explore a recognizable milestone framing language.

Possible components may include:

- industrial medallion framing,
- subtle metallic achievement surround,
- controlled halo/backplate,
- accomplishment emblem,
- restrained accent lighting,
- composition emphasizing “completed achievement”.

However:

Do NOT create literal trophy/cup imagery by default.

Do NOT use stars, ribbons, laurels, crowns, medals, or badges merely because this is an achievement system unless they fit Project Genesis' industrial visual language.

The achievement identity should feel native to:

**Project Genesis industrial strategy game**

not a generic mobile-game achievement popup.

---

# 8. Relationship to sealed families

MSV-001 may visually reference concepts from sealed families but must remain distinct.

## ICON-001

A milestone involving steel may reference steel materially.

Do not simply place the ICON-001 steel icon in a decorative frame and call it new milestone art.

## ICON-003

Buildings can appear as contextual silhouettes only where semantically justified.

Milestones must not read as building catalog art.

## ICON-004

Avoid “technology apparatus on a base” as the dominant grammar.

Milestones are accomplishments, not technologies.

## ICON-005

Processes may inspire industrial action/result motifs.

Do not reuse a recipe primary as milestone art.

## WFV-001

No portrait-first milestone language.

People are not required.

---

# 9. Detailed pilot art requirements

Create exactly FOUR detailed Tier-1 pilot concepts.

One per pilot milestone.

Preferred source:

- approximately 1024×1024
- RGBA
- real transparency where compatible with chosen framing
- production-quality visual fidelity

The art must:

- be detailed,
- look rewarding at 128–256px,
- remain understandable around 96px,
- have a strong central accomplishment silhouette,
- contain no readable text,
- contain no fake company logos,
- contain no pseudo-writing,
- contain no baked UI labels,
- contain no milestone name,
- contain no progress percentage,
- contain no “completed” text.

Generated-art QA is mandatory.

Reject/regenerate task-local pilots containing:

- pseudo-text,
- broken machinery,
- malformed geometry,
- nonsensical industrial structures,
- accidental logos,
- unexplained symbols,
- severe transparency artifacts.

---

# 10. Semantic targets

## first_production

The player should perceive:

> Industrial production has successfully begun.

Avoid reducing this to:

> picture of one random factory.

Explore motifs such as:

- first finished output leaving a production process,
- activated industrial line,
- completed production moment,
- controlled machinery + finished result.

Do not imply a specific recipe if the milestone semantics are generic.

## first_steel

The player should perceive:

> Steel production has been achieved.

Possible motifs:

- freshly produced steel,
- controlled metallurgical result,
- glowing-to-finished metal transformation,
- industrial accomplishment composition.

Do not merely duplicate the steel resource icon.

## first_profit

The player should perceive:

> The company has crossed from operation into profitable success.

This is the hardest semantic test.

Avoid:

- generic dollar sign,
- piles of coins,
- casino imagery,
- stock-market fantasy unsupported by gameplay.

Prefer an industrial/economic accomplishment metaphor grounded in Project Genesis.

Examples worth testing:

- industrial ledger/value output composition,
- profitable production represented through balanced output/value,
- company operating system transitioning into positive performance.

Do not bake numbers/text into the art.

## first_consumer_goods

The player should perceive:

> The production chain has matured enough to deliver finished consumer goods.

Avoid:

- random shopping bags,
- modern retail-store imagery unless content supports it,
- generic warehouse-only scene.

Prefer:

- finished-goods culmination,
- multi-stage production payoff,
- packaged final industrial output,
- visually more advanced value-chain accomplishment than `first_production`.

---

# 11. Compact medallion pilots

For each of the four milestones create a compact pilot derived from or paired with the primary.

Exactly four compact pilots.

Test at:

- 32px diagnostic only
- 48px
- 64px
- 96px

Primary target:

**48–64px**

At that scale each should still communicate a different achievement class.

The compact family must not rely only on color differences.

---

# 12. Completion-state treatment

Define, but do NOT production-integrate, state treatment for:

- LOCKED / not yet achieved
- COMPLETED

Prefer state treatment as shared UI/CSS/overlay logic rather than generating duplicate PNG families.

Explore:

### Locked

- reduced saturation
- reduced contrast
- restrained frame
- no implication that unavailable means broken

### Completed

- normal/full art
- stronger achievement framing
- restrained highlight/glow if appropriate

Do NOT create:

- separate locked master art for all milestones
- separate completed master art for all milestones

unless the pilot demonstrates an unavoidable visual need.

---

# 13. Evidence boards

Create at minimum:

`docs/architecture/reviews/evidence/MSV_001_ART_DIRECTION_4_PILOT_FAMILY_BOARD.png`

Shows all four detailed pilots together.

---

`docs/architecture/reviews/evidence/MSV_001_ACHIEVEMENT_MEDALLION_BOARD.png`

Shows four compact/medallion pilots at useful size.

---

`docs/architecture/reviews/evidence/MSV_001_SCALE_BOARD.png`

For at least two semantically different pilots show:

- 48
- 64
- 96
- 128
- 256

---

`docs/architecture/reviews/evidence/MSV_001_STATE_TREATMENT_BOARD.png`

Show representative:

- locked
- completed

without production integration.

---

`docs/architecture/reviews/evidence/MSV_001_CROSS_FAMILY_DIFFERENTIATION_BOARD.png`

Compare representative:

- ICON-001 Resource
- ICON-003 Building
- ICON-004 Technology
- ICON-005 Production
- WFV-001 Workforce
- MSV-001 Milestone

The milestone must visibly read as a separate achievement family.

---

`docs/architecture/reviews/evidence/MSV_001_STATIC_PROGRESSION_CONTEXT_MOCK.png`

Static DEV mock only.

Show how several milestone visuals could appear in a plausible progression/reward context.

This is NOT permission to create a production milestone screen.

No runtime wiring.

---

# 14. Full 8-milestone scalability assessment

After creating the four pilots, assess all 8 enabled milestones.

For every milestone classify:

- `SAFE_DETAILED`
- `SAFE_WITH_SHARED_GRAMMAR`
- `ABSTRACT_BUT_DEPICTABLE`
- `SEMANTICALLY_RISKY`
- `BLOCKED`

Provide:

| Milestone | Class | Primary motif | Compact motif | Differentiation risk | Production recommendation |
|---|---|---|---|---|---|

The key question:

> Can MSV-001 honestly produce a visually distinct and rewarding identity for all eight milestones without inventing mechanics or producing eight near-duplicates?

Do NOT create the other four production assets yet.

---

# 15. Contract

Create:

`docs/design/milestones/MILESTONE_VISUAL_IDENTITY_MSV_001_ART_CONTRACT.md`

Status:

**PILOT / HUMAN APPROVAL REQUIRED**

Include:

1. purpose
2. semantic boundary
3. relationship to sealed families
4. primary-art grammar
5. compact-medallion grammar
6. camera/composition rules if applicable
7. palette/material language
8. transparency/background policy
9. no-text/no-logo rule
10. scale targets
11. completion-state treatment
12. generated-art QA
13. semantic-honesty requirements
14. reuse policy
15. production naming convention
16. resolver/registry concept for future production
17. fallback concept
18. all-8 scalability assessment
19. version history

Do NOT mark it production authority yet.

Human approval is required first.

---

# 16. Pilot manifest

Create a pilot manifest using repository conventions.

It must clearly mark all eight pilot artifacts:

- 4 detailed
- 4 compact

as:

**DEV / PILOT / NOT PRODUCTION**

Do not add them to a production resolver.

Do not expose them through runtime registries.

---

# 17. Technical QA

For the four detailed pilots verify:

- expected dimensions
- valid image decode
- alpha/transparency behavior
- no accidental opaque checkerboard
- no obvious halo
- correct paths
- no duplicate concept masquerading as another milestone

For compact pilots verify:

- 48px readability
- 64px readability
- semantic distinction
- no text dependence

If scripts are needed, keep them pilot-local.

Do not create broad permanent tooling unless genuinely reusable and necessary.

---

# 18. Human visual gate

This task MUST stop for human review.

The reviewer must be able to decide:

### Art direction

- APPROVE
- REVISE
- REJECT

### Tier model

- primary + medallion approved
- primary only
- medallion only
- hierarchy needs revision

### Individual pilots

For each:

- PASS
- REVISE
- REJECT

### 8/8 scalability

- production completion appears viable
- some milestones require special handling
- art direction does not scale honestly

No production activation may happen before this gate.

---

# 19. Scenario-B accounting

These are PILOTS.

Do not count them as production-authored MSV-001 deliverables yet.

Record separately:

- 4 detailed pilot concepts
- 4 compact pilot concepts

If later promoted unchanged, each concept is counted once at promotion.

Do not double-count:

- source + runtime derivative
- primary + evidence screenshot
- pilot + identical promoted copy

---

# 20. Inventory update

Update:

`docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md`

Milestones should become something equivalent to:

**MSV-001 — ART-DIRECTION PILOT / HUMAN REVIEW REQUIRED**

Do NOT mark:

- ACTIVE
- COMPLETE
- 4/8 production
- 8/8

The runtime still has zero production milestone art after this task.

---

# 21. Report

Write:

`docs/architecture/reviews/POST_V1_MSV_001_MILESTONE_ACHIEVEMENT_VISUAL_IDENTITY_ART_DIRECTION_CONTRACT_PILOT.md`

Include:

1. baseline
2. milestone semantic inventory 8/8
3. exact four pilots
4. detailed-primary analysis
5. compact-medallion analysis
6. scale QA
7. semantic honesty
8. state-treatment proposal
9. cross-family differentiation
10. progression-context mock analysis
11. full 8-milestone scalability matrix
12. technical QA
13. Scenario-B accounting
14. firewalls
15. files changed
16. human-gate package
17. final decision

---

# 22. Final decision

Return exactly one:

## OPTION A — PILOT READY FOR HUMAN VISUAL APPROVAL

Use only when:

- exactly four detailed pilots exist,
- exactly four compact pilots exist,
- technical QA passes,
- evidence boards exist,
- all eight milestones have been semantically assessed,
- contract is complete,
- no production activation occurred.

## OPTION B — ONE BOUNDED PILOT REPAIR REQUIRED

Use when one or more pilot concepts fail:

- visual quality,
- semantic honesty,
- differentiation,
- scale,
- alpha,
- generated-art QA.

Repair within this task where obvious.

Return OPTION B only if a human/product decision is genuinely needed.

## OPTION C — MSV-001 ART DIRECTION DOES NOT SCALE

Use if the pilot demonstrates that a coherent milestone visual family cannot honestly cover the enabled milestone semantics.

Explain precisely why.

Do not force 8/8.

## OPTION D — PRODUCT SEMANTICS BLOCK VISUAL DIRECTION

Use only if milestone content itself is too ambiguous to create honest visuals without a product decision.

---

# 23. Firewalls

Do NOT:

- modify milestone gameplay
- modify milestone triggers
- rebalance thresholds
- change content YAML
- create a milestone screen
- change dashboard KPI behavior
- create notifications/toasts
- add runtime registry activation
- add production resolver activation
- modify ICON-001
- modify ICON-002
- modify ICON-003
- modify ICON-004
- modify ICON-005
- modify WFV-001
- modify World/WBM
- redesign shell/navigation
- solve localization debt
- continue to MSV production
- commit
- push
- tag

---

# 24. Core Definition of Done

This task is complete when:

> Project Genesis has one coherent, evidence-backed candidate visual language for milestone achievements, proven across four semantically different real milestones, tested as detailed reward art and compact achievement identity, technically validated, clearly differentiated from all sealed visual families, assessed for honest scalability across all eight milestones, and packaged for human visual approval — with zero production activation.

Then STOP.