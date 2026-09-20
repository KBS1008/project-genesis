# Workforce Role Visual Identity — WFV-001 Art Contract

**Status:** `WFV-001 PRODUCTION COMPLETION — HUMAN REVIEW PENDING (19/19)`  
**Workstream:** WFV-001 — Workforce Role Identity (Scenario B)  
**Authority:** `POST_V1_WFV_001_WORKFORCE_ROLE_VISUAL_IDENTITY_ART_DIRECTION_COVERAGE_PILOT.md` · `POST_V1_WFV_001_WORKFORCE_ROLE_VISUAL_IDENTITY_PRODUCTION_BATCH_1.md`

---

## Version history

| Version | Date | Status |
|---------|------|--------|
| Pilot v1 | 2026-09-20 | Art-direction pilot — **HUMAN APPROVED / SEALED** (Direction C) |
| Production Batch 1 | 2026-09-20 | **8/19** hybrid primaries + runtime column |
| Production Completion 8→19 | 2026-09-20 | **19/19** — **HUMAN REVIEW PENDING** (10 new Direction C + 1 Direction A in completion slice; 1 Direction A = `employee_administrator_basic`) |
| Runtime resolution repair | 2026-09-20 | Completion runtime-visual gate **failed**; `WorkforceRoleVisual` onError fallback corrected — **HUMAN REVIEW PENDING** (see repair close candidate) |

## Human approval (sealed)

WFV-001 Workforce Role Visual Identity Art Direction: **APPROVED / PASS / SEALED**

**Tier-1 primary grammar:** Direction C — Hybrid Human + Occupational Context (`1 person + 1 dominant occupational cue`)

**Direction A:** controlled fallback only where hybrid would be semantically artificial  
**Direction B:** rejected as primary grammar (ICON-004/005 collision)

Production masters: **real RGBA transparency** — no blueprint/grid presentation backgrounds.

---

## Inventory baseline

- **19** enabled Employee Types (`game-content/employees/*.yaml`, all `enabled: true`).
- Runtime presentation: **WFV Batch-1** hybrid primaries in `PGEmployeesWidget` (80px desktop / 56px narrow) + ICON-002 category fallback for remaining types.
- Production coverage: **19 / 19** (`WFV_001_PRODUCTION_MANIFEST.json`).

---

## Visual goals

Workforce art must read as **people / professions / human capability** operating the industrial economy — not buildings (ICON-003), not research machines (ICON-004), not process apparatus (ICON-005), not resource commodities (ICON-001).

Target quality band: detailed stylized industrial realism comparable to sealed Scenario-B primaries, with a **distinct workforce identity**.

---

## Tested directions (pilot)

| Model | Pilot intent |
|-------|----------------|
| **A — Person / Role Portrait** | Shoulders-up occupational bust; PPE/clothing silhouette; minimal face detail |
| **B — Workstation / Tool Vignette** | Occupational station without visible person |
| **C — Hybrid Human + Context** | Person primary (~60% weight) + one strong occupational cue |

Three authoritative roles exercised all nine concepts (see manifest).

---

## Camera / composition

- **Primary master:** ~1024×1024 RGBA, transparent background, no baked UI frame.
- **Portrait (A):** bust or waist-up; strong central silhouette; avoid cropped PPE/tools.
- **Vignette (B):** single readable station cluster; avoid isometric building-catalog framing.
- **Hybrid (C):** one person + one context object; max two focal layers; no busy scenes.

---

## Human depiction rules

- Do not encode unsupported meaning via gender, ethnicity, age, or body type.
- Prefer **occupational signals:** coveralls, hard hat, safety glasses, suit silhouette, tools, desks, terminals.
- Avoid stereotypes and stock-photo realism.
- Faces may be stylized, obscured, or low-detail if consistency requires.

---

## Lighting / palette

- Controlled industrial palette: steel blue, charcoal, muted orange safety accents, restrained warm rim light.
- Deliberate directional lighting; consistent within a sealed family.
- Management roles may use cooler navy + subtle gold accent — not consumer glossy.

---

## Transparency / alpha

- Real RGBA transparency required; no baked checkerboard mattes.
- Pilot QA: `docs/design/workforce/pilot-wfv-001/WFV_001_PILOT_ALPHA_REPORT.json` (9/9 PASS after repair pass).

---

## Scale targets

- Must remain recognizable at **64–96 px** (compact contexts).
- **96–128 px:** primary UI target once a layout slice adds thumbnails.
- **128–256 px:** reward / detail contexts (hire unlock, inspector).

---

## Semantic honesty

Art cues must be supported by YAML descriptions, categories, building requirements, or tags — no invented uniforms, sites, or tools.

---

## Cross-family differentiation

Workforce pilots must remain distinguishable from resource, building, technology, and production primaries at a glance (see cross-family board evidence).

---

## Generated-art QA (pilot)

Inspect hands, faces, duplicated equipment, fake text/logos, floating objects, alpha halos, and scale collapse. Regenerate or key-repair task-local defects before human gate.

---

## Potential compact tier (assessment only)

A future **Workforce compact glyph** (category or role silhouette) may help dense tables — analogous to ICON-004 category tier — but **not built in WFV-001**. Current compact contexts may continue using text + generic `DashboardIcon` until a demonstrated need.

Recommended architecture if production proceeds: **Primary role art (detailed)** + optional **compact category glyph** for table rows.

---

## Scalability findings (summary)

| Model | Family scalability |
|-------|-------------------|
| A Portrait | Strong for industrial/logistics; risk of repetitive busts for 19 roles |
| B Workstation | Viable for technical roles; **WEAK / MIXED** vs ICON-004/005 for engineering & production categories |
| C Hybrid | **Strongest family candidate** — human anchor + one cue scales across categories with controlled complexity |

Full per-role matrix: review report §15.

---

## Production activation (Batch 1 + Completion)

**Active:** 19 hybrid primaries in `docs/design/workforce/icon-wfv-001/primary/` and `apps/web/public/assets/workforce/`.

**Grammar:** Direction C default; Direction A only for `employee_administrator_basic`.

**Resolver:** all 19 enabled types → WFV primary; unknown type → ICON-002 category fallback (retained).

**Coverage:** **19/19** complete candidate — human seal pending.

Pilot assets under `pilot-wfv-001/` remain DEV reference only.
