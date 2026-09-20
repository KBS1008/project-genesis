# POST-V1 WFV-001 — Workforce Role Visual Identity Art-Direction & Coverage Pilot

**Prompt:** `docs/development/Prompts/POST_V1_WFV_001_WORKFORCE_ROLE_VISUAL_IDENTITY_ART_DIRECTION_COVERAGE_PILOT.md`  
**Branch:** `master`  
**HEAD:** `7426c477c33ed43d7773f6aacdf158685399a7d8`  
**Mode:** Bounded art-direction pilot — **no production activation**, **no commit**

---

## 1. Baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD | `7426c47` |
| WBM-001 / ICON-003–005 | Not reopened |
| Workforce runtime | Text-only `PGEmployeesWidget` + sidebar hire hints |

---

## 2. Working-tree classification

**Task-owned (this pilot):**

- `docs/design/workforce/**`
- `docs/architecture/reviews/POST_V1_WFV_001_*.md`
- `docs/architecture/reviews/evidence/WFV_001_*.png`
- `assets/WFV-001-*.png`
- `tools/compose-wfv-001-art-direction-evidence.mjs`
- `tools/repair-wfv-001-pilot-alpha.mjs`
- `docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md` (WFV pilot note only)

**Unrelated (not absorbed):** shell/dashboard churn, building-pilot dev pages, doc archive moves, `.next`, local saves.

---

## 3. Authoritative Employee-Type count

**19 / 19** enabled (`game-content/employees/*.yaml`).

---

## 4. Complete Employee-Type matrix

| ID | Display name | Category | Gameplay function (content) | Building assoc. | Visual cues (supported) | Ambiguity / risk | Depiction strategy |
|----|--------------|----------|----------------------------|-----------------|-------------------------|------------------|-------------------|
| `employee_production_worker` | Produktionsmitarbeiter | production | Operates plants in sawmills/factories | — | PPE, line work | Overlap with generic “worker” | PPE + machine-edge cue |
| `employee_senior_production_worker` | Erfahrener Produktionsmitarbeiter | production | Mid-tier manufacturing plants | `machine_shop` | Same family as production worker | Differentiate seniority without rank insignia | Shared industrial grammar + tool tier |
| `employee_operations_supervisor` | Produktionsleiter | production | Coordinates lines & training | `training_center` | Supervisory, not C-suite | vs executive roles | Clipboard/line overview cue |
| `employee_engineer_basic` | Junior-Ingenieur | engineering | Efficiency/maintenance in plants | — | Engineering tablet/tools | vs senior engineer | Lighter tool set |
| `employee_senior_engineer` | Senior-Ingenieur | engineering | Assembly/electronics optimization | `assembly_plant` | Precision, CAD, calipers | vs ICON-004 tech art | Human + precision jig |
| `employee_maintenance_technician` | Wartungstechniker | engineering | Downtime reduction | `maintenance_facility` | Tools, spares | vs production worker | Tool belt + lift cue |
| `employee_researcher_basic` | Forscher | research | Accelerates research | — | Lab coat, samples | vs senior researcher | Bench/lab cue |
| `employee_senior_researcher` | Senior-Forscher | research | Leads campus projects | `research_campus` | Leadership in research | vs lab director | Campus lab context |
| `employee_lab_director` | Laborleiter | research | University programs | `university` | Academic leadership | vs executive | Academic + transfer cue |
| `employee_logistics_operator` | Logistikmitarbeiter | logistics | Warehouse/transport efficiency | `warehouse` | Forklift/scanning (generic) | vs coordinator | Warehouse handheld |
| `employee_logistics_coordinator` | Logistikkoordinator | logistics | Plans flows & chains | `logistics_hub` | Planning boards | vs operator | Terminal + map abstract |
| `employee_distribution_clerk` | Distributionsmitarbeiter | logistics | DC stock & dispatch | `distribution_center` | Packing/stock | vs port/rail | DC station |
| `employee_port_operator` | Hafenlogistiker | logistics | Port/container handling | `port` | Crane/container | Terminal overlap | Port yard cue |
| `employee_rail_dispatcher` | Schienendisponent | logistics | Rail throughput | `rail_terminal` | Signal/rail panel | vs port | Dispatch desk |
| `employee_administrator_basic` | Verwaltungsmitarbeiter | administration | HQ organization support | `headquarters` | Office admin | Generic office risk | Desk + org abstract |
| `employee_financial_analyst` | Finanzanalyst | administration | Budget/cashflow | `regional_headquarters` | Charts (non-readable) | vs executive | Analytics desk |
| `employee_hr_manager` | HR-Manager | administration | HR development/training | `training_center` | People programs | soft semantics | Training/coaching cue |
| `employee_regional_manager` | Regionalleiter | administration | Regional coordination | `regional_headquarters` | Multi-site | vs executive | Map pins abstract |
| `employee_executive_director` | Executive Director | administration | Corporate strategy | `corporate_headquarters` | Suit, strategy | Demographic risk in portraits | Strategy table / HQ cue |

---

## 5. Three selected pilots

| ID | Name | Category bucket |
|----|------|-----------------|
| `employee_production_worker` | Produktionsmitarbeiter | Operational / industrial |
| `employee_senior_engineer` | Senior-Ingenieur | Technical / specialist |
| `employee_executive_director` | Executive Director | Administrative / management |

---

## 6. Selection rationale

- **Produktionsmitarbeiter:** clearest industrial PPE semantics in content; anchors the largest employee category cluster.
- **Senior-Ingenieur:** explicit assembly/electronics optimization + `assembly_plant` requirement — tests hardest cross-family boundary vs ICON-004/005.
- **Executive Director:** highest management tier with `corporate_headquarters` + `executive_leadership` research — tests non-factory roles without inventing HR/finance overlap.

---

## 7. Direction A — Person / Portrait findings

- Strongest **immediate “human role”** read in cross-family test.
- Industrial and executive pilots succeed with **face-reduced** stylization (avoids demographic lock-in).
- Scalability: repetitive bust grid risk across 19 roles; logistics/port/rail need prop differentiation beyond coveralls.
- **Cross-family:** PASS for workforce identity; occasional confusion with “admin UI avatar” if rendered too flat (not observed at pilot quality).

---

## 8. Direction B — Workstation findings

- Excellent **semantic honesty** for engineering desk and executive office vignettes.
- **Production worker station** reads well but approaches **ICON-005 process** territory (machine-forward).
- **Scalability:** research/engineering workstations risk **ICON-004 collision** for 6+ roles.
- **Cross-family:** MIXED — technology/production families already own apparatus-forward compositions.

---

## 9. Direction C — Hybrid findings

- Best balance of **game reward** and **human presence** at 96–128 px in scale board.
- Keeps industrial world connection without isometric building grammar.
- Complexity budget manageable with **one person + one cue** rule.
- **Cross-family:** PASS — human silhouette remains primary discriminator.

---

## 10. Nine-concept manifest

See `docs/design/workforce/pilot-wfv-001/WFV_001_PILOT_MANIFEST.json`.

---

## 11. Alpha QA

Report: `docs/design/workforce/pilot-wfv-001/WFV_001_PILOT_ALPHA_REPORT.json`

| Result | Count |
|--------|------:|
| 1024×1024 RGBA | 9/9 |
| Real transparency | 9/9 |
| Checkerboard suspect | 0/9 |
| **PASS** | **9/9** |

Repair: `tools/repair-wfv-001-pilot-alpha.mjs` (checkerboard key + black-key regen for two assets).

---

## 12. Scale QA

Board: `docs/architecture/reviews/evidence/WFV_001_SCALE_BOARD.png`

Representative hybrid (Senior-Ingenieur) remains readable at **64 px** (silhouette), **strong at 96–128 px**, reward-tier detail at **256 px**. Direction B executive desk loses legibility below ~96 px (acceptable for dense tables only with compact tier).

---

## 13. Workforce-context assessment

Evidence: `docs/architecture/reviews/evidence/WFV_001_WORKFORCE_CONTEXT_MOCK.png`

- Static mock approximates `PGEmployeesWidget` columns with **72 px** hybrid inset — improves recognition vs text-only.
- Current widget has **no art column**; adding primaries without layout slice would crowd mobile widths.
- **Honest blocker:** production integration needs a **bounded layout slice** (thumbnail column or row header) — out of scope for WFV-001 pilot.
- Text stats (Gehalt, Produktivität) remain readable in mock.

---

## 14. Cross-family assessment

Board: `docs/architecture/reviews/evidence/WFV_001_CROSS_FAMILY_BOARD.png`

| Direction | Workforce vs resource/building/tech/production |
|-----------|-----------------------------------------------|
| A Portrait | **PASS** |
| B Workstation | **MIXED** (tech/production overlap) |
| C Hybrid | **PASS** |

---

## 15. Full-inventory scalability matrix (summary)

Legend per model: **S** STRONG · **V** VIABLE · **W** WEAK · **R** SEMANTICALLY_RISKY

| Employee type | A | B | C |
|---------------|---|---|---|
| production_worker | S | V | S |
| senior_production_worker | V | V | S |
| operations_supervisor | V | W | S |
| engineer_basic | V | V | S |
| senior_engineer | V | V | S |
| maintenance_technician | V | V | S |
| researcher_basic | V | R | S |
| senior_researcher | V | R | V |
| lab_director | V | R | V |
| logistics_operator | V | W | S |
| logistics_coordinator | W | V | S |
| distribution_clerk | V | V | S |
| port_operator | V | W | S |
| rail_dispatcher | V | W | S |
| administrator_basic | W | V | V |
| financial_analyst | W | V | V |
| hr_manager | W | R | V |
| regional_manager | W | V | V |
| executive_director | V | V | S |

**Family read:** Model **C** has the highest STRONG count with controlled complexity; Model **A** viable as fallback for compact portrait-only contexts; Model **B** not recommended as the primary family grammar.

---

## 16. Visual-reward assessment (128–256 px)

| Role | A | B | C |
|------|---|---|---|
| Produktionsmitarbeiter | GOOD | GOOD | **STRONG** |
| Senior-Ingenieur | GOOD | GOOD | **STRONG** |
| Executive Director | **STRONG** | GOOD | **STRONG** |

---

## 17. Compact-tier assessment

- Detailed primary + optional **category compact glyph** appears useful for `PGOperationsTable` density.
- Do **not** introduce a 19-glyph compact family until primary direction is human-sealed.
- Existing generic dashboard icons remain sufficient for compact operational badges today.

---

## 18. Recommended production architecture (not approved)

1. Seal **Model C — Hybrid Human + Occupational Context** as primary Workforce Tier-1 grammar with strict **1 person + 1 cue** cap.
2. Allow **Model A** variants only where hybrid complexity fails (some admin roles) — still within one family style guide.
3. Defer compact tier to **WFV-002** or production Batch 1 planning after human gate.
4. Plan bounded **Workforce UI thumbnail column** slice before runtime registry activation.

**Recommended direction for human review:** **Direction C (Hybrid)** — not declared approved.

---

## 19. Scenario-B accounting

- Pilot adds **9 DEV concepts** — **not** counted toward authored production totals.
- Production workforce coverage remains **0 / 19**.
- Inventory updated: **WFV-001 ART-DIRECTION PILOT IN HUMAN REVIEW**.

---

## 20. Firewalls

No gameplay, API, save, ICON-003/004/005, WBM, ResearchScreen, ProductionScreen, or Workforce UX redesign changes.

---

## 21. Changed files (task-owned)

| Path |
|------|
| `docs/design/workforce/WORKFORCE_ROLE_VISUAL_IDENTITY_WFV_001_ART_CONTRACT.md` |
| `docs/design/workforce/pilot-wfv-001/WFV_001_PILOT_MANIFEST.json` |
| `docs/design/workforce/pilot-wfv-001/WFV_001_PILOT_ALPHA_REPORT.json` |
| `docs/design/workforce/pilot-wfv-001/WFV-001-*.png` (×9) |
| `assets/WFV-001-*.png` (×9 sources) |
| `docs/architecture/reviews/POST_V1_WFV_001_WORKFORCE_ROLE_VISUAL_IDENTITY_ART_DIRECTION_COVERAGE_PILOT.md` |
| `docs/architecture/reviews/evidence/WFV_001_*.png` (×7 boards) |
| `tools/compose-wfv-001-art-direction-evidence.mjs` |
| `tools/repair-wfv-001-pilot-alpha.mjs` |
| `docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md` |

---

## 22. Human-review evidence paths

| Artifact |
|----------|
| `docs/architecture/reviews/evidence/WFV_001_ART_DIRECTION_FAMILY_BOARD.png` |
| `docs/architecture/reviews/evidence/WFV_001_DIRECTION_A_PERSON_BOARD.png` |
| `docs/architecture/reviews/evidence/WFV_001_DIRECTION_B_WORKSTATION_BOARD.png` |
| `docs/architecture/reviews/evidence/WFV_001_DIRECTION_C_HYBRID_BOARD.png` |
| `docs/architecture/reviews/evidence/WFV_001_SCALE_BOARD.png` |
| `docs/architecture/reviews/evidence/WFV_001_WORKFORCE_CONTEXT_MOCK.png` |
| `docs/architecture/reviews/evidence/WFV_001_CROSS_FAMILY_BOARD.png` |

---

## 23. Final decision

### OPTION A — HUMAN VISUAL GATE READY

All nine concepts exist with passing alpha QA, evidence boards are complete, and **Direction C (Hybrid)** is credibly production-capable pending human seal. **Human approval still required.**

---

*Stop condition met — no commit, push, or tag per prompt.*
