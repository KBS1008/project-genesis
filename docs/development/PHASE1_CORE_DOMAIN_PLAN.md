# Phase 1 – Core Domain Plan

**Project:** Project Genesis

**Version:** 1.0

**Status:** Active

**Last Updated:** 2026-07-19

**Basis:** Repository-Audit vom 2026-07-19 · Commit `e850efa` · 417 Tests grün

---

# Purpose

Dieses Dokument definiert **Phase 1 – Core Domain** als strukturierten Umsetzungsplan.

Phase 1 schließt an die abgeschlossene **Content-Foundation** an und bereitet die Domain-Schicht deterministisch, frameworkunabhängig und testbar für spätere Phasen (insbesondere M7 World Simulation) vor.

Phase 1 ist **kein Greenfield-Implementierungsprojekt**. Der Audit vom 2026-07-19 zeigt, dass Aggregate, Repository-Ports, Application-Use-Cases und Simulation-Integration für alle acht Kernbereiche bereits existieren (M4–M6).

Ziel von Phase 1 ist deshalb:

- dokumentierte Domain-Reife herstellen,
- architektonische Lücken schließen,
- fehlende Domain- und Repository-Tests ergänzen,
- Application-Logik in die Domain verlagern, wo sie fachliche Regeln sind,
- bewusst **nicht** implementierte Bereiche klar abgrenzen.

---

# Position in der Roadmap

```text
Content-Foundation (abgeschlossen)
        ↓
Phase 1 – Core Domain (dieses Dokument)
        ↓
M7 – World Simulation
        ↓
M8+ – NPC Economy, UI, Content Expansion, …
```

**Beziehung zu offiziellen Milestones (`MILESTONE_PLAN.md`):**

| Milestone           | Status | Relevanz für Phase 1               |
| ------------------- | ------ | ---------------------------------- |
| M1 Foundation       | ✅     | Voraussetzung                      |
| M2 Architecture     | ✅     | Voraussetzung                      |
| M3 Governance       | 🟡     | Parallel (Doku, Gates)             |
| M4 Core Gameplay    | ✅     | Liefert Domain-Basis               |
| M5 Economy          | ✅     | Liefert Finance/Market             |
| M6 Logistics        | ✅     | Liefert Transport                  |
| M7 World Simulation | ⚪     | **Explizit außerhalb** von Phase 1 |

Phase 1 ist ein **Domänen-Härtungs-Workstream** zwischen M6-Abschluss und M7-Start.

---

# Verbindliche Baseline (nicht verändern)

Sofern kein nachgewiesener Fehler vorliegt, bleiben unverändert:

```text
src/content/**          Definitionen, Validatoren, Loader, Registries
game-content/**         YAML-Assets
docs/schemas/**         Schema-Dokumentation (separate Updates)
tools/validate-content.ts
```

Content-Schemas und Cross-Registry-Validierung sind die verbindliche Referenz für statische Daten.

---

# Scope

## In Scope

Phase 1 umfasst ausschließlich:

| Bereich    | Domain-Modul                                                                        |
| ---------- | ----------------------------------------------------------------------------------- |
| Company    | `src/domain/company/`                                                               |
| Inventory  | `src/domain/inventory/` + `src/domain/shared/` (Quantity, ResourceAmount, Capacity) |
| Money      | `src/domain/shared/Money.ts` + `src/domain/finance/`                                |
| Building   | `src/domain/building/`                                                              |
| Production | `src/domain/production/`                                                            |
| Logistics  | `src/domain/transport/` (+ `BuildingStorage`)                                       |
| Research   | `src/domain/research/`                                                              |
| Milestones | `src/domain/milestone/`                                                             |

Erlaubte begleitende Änderungen:

- Domain-Unit-Tests und Repository-Tests (In-Memory)
- Domain Policies, Specifications, Domain Services (neu oder extrahiert)
- Application-Anpassungen **nur**, wenn Domain-Extraktion erforderlich ist
- `IMPLEMENTATION_PROGRESS.md` nach abgeschlossenen Work Packages
- optionale Kurzberichte unter `docs/quality/` pro abgeschlossenem Work Package

## Out of Scope

Explizit **nicht** Bestandteil von Phase 1:

```text
UI / Next.js / Dashboard
REST / GraphQL / NestJS-Controller
Datenbankadapter / externe Persistenz
Netzwerkcode / WebSocket
Animationen / Rendering
Neue Tick-Engine / Scheduler / Worker Loop
Energy Loop (Erweiterung)
Vehicle-Entities / Transportbewegung über Zeit (DD-022 V1-Waiver)
World / Region / Biome / Map (M7)
NPC Economy (M8)
Neue Content-Typen oder Schema-Änderungen
Neue Simulation-Systeme mit Gameplay-Regeln
Cancel/Pause-Use-Cases (Production, Research, Transport)
```

Wenn ein Work Package eines dieser Out-of-Scope-Themen berührt: **STOP** und ADR / Milestone-Eskalation.

---

# Architektur- und Arbeitsregeln

Vor jeder Umsetzung gelten:

1. `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
2. Relevante ADRs (mindestens DD-003, DD-004, DD-009, DD-011, DD-015, DD-027, DD-029, DD-031, DD-032)
3. `docs/architecture/domain-model.md` (Zielbild, nicht vollständige Phase-1-Umsetzung)
4. `docs/architecture/bounded-contexts.md`
5. `src/domain/readme.md`

**Layer-Regeln:**

- Domain importiert **kein** `src/content/`, **kein** UI, **keine** Infrastructure
- Application orchestriert; Domain enthält fachliche Regeln
- Simulation führt aus; definiert **keine** neuen Gameplay-Regeln
- `Result<T>` / `DomainError` statt Exceptions für erwartete Fälle
- Kein `Date.now()`, kein `Math.random()`

---

# Ausgangslage – Domain-Reife (Audit 2026-07-19)

| Bereich    | Aggregate / VO                      | Repository | Domain-Tests | Hauptrisiko                                    |
| ---------- | ----------------------------------- | ---------- | ------------ | ---------------------------------------------- |
| Company    | ✅ `Company`                        | ✅         | 7            | Minimaler Lifecycle; Simulation-Stub           |
| Inventory  | ✅ `Inventory` + VOs                | ✅         | 7 (+ shared) | Kein dediziertes Warehouse-Aggregate (bewusst) |
| Money      | ⚠️ `Money` + `FinanceAccount`       | ✅         | 11           | VO nicht durchgängig in Finance                |
| Building   | ✅ `Building`, `BuildingStorage`    | ✅         | 12           | Kein Upgrade/Demolish                          |
| Production | ✅ `ProductionJob`                  | ✅         | 5            | Recipe nur in Content (DD-015-konform)         |
| Logistics  | ✅ `TransportOrder`                 | ✅         | **0 Domain** | Größte Testlücke                               |
| Research   | ✅ `CompanyResearch`, `ResearchJob` | ✅         | 5            | Completion-Service ohne Test                   |
| Milestone  | ✅ `CompanyMilestones`              | ✅         | 2            | Trigger-Logik in Application + Content-Import  |

**Querschnitt positiv:**

- 0× `TODO` / `NotImplemented` in `src/domain/` (Produktionscode)
- Clean Architecture eingehalten (Domain ohne Content-Imports)
- 417 Tests, Content-Validierung strict grün

---

# Zielbild Phase 1 – Exit-Kriterien (Gesamt)

Phase 1 gilt als abgeschlossen, wenn:

1. **Alle Work Packages P1-01 bis P1-06** erfüllt sind
2. **Quality Gates** (siehe unten) für jedes Work Package grün
3. **Keine Regression** in bestehenden 417+ Tests
4. Domain importiert weiterhin kein `src/content/`
5. `IMPLEMENTATION_PROGRESS.md` aktualisiert
6. Abschlussbericht `docs/quality/PHASE1_CORE_DOMAIN_REPORT.md` erstellt

**Nicht** erforderlich für Phase-1-Abschluss:

- World/Region/Vehicle
- Vollständige Abbildung von `domain-model.md`
- Neue Use Cases für Cancel/Pause

---

# Work Packages

## Übersicht

```text
P1-01 Logistics Domain Tests          (kritisch)
        ↓
P1-02 Milestone Domain Extraction     (architektonisch)
        ↓
P1-03 Research Test Coverage          (Qualität)
        ↓
P1-04 Money VO Consistency            (Konsistenz)
        ↓
P1-05 Company Domain Clarification    (Dokumentation + minimal)
        ↓
P1-06 Repository Test Coverage        (Querschnitt)
        ↓
Phase 1 Gate Review
```

---

## P1-01 – Logistics Domain Tests

**Priorität:** Kritisch

**Ziel:** `TransportOrder`-Aggregate und Repository-Verhalten unit-testbar absichern.

### Deliverables

| Artefakt          | Pfad (neu/ergänzt)                                                        |
| ----------------- | ------------------------------------------------------------------------- |
| Domain-Unit-Tests | `src/domain/transport/TransportOrder.test.ts`                             |
| Repository-Tests  | `src/infrastructure/persistence/InMemoryTransportOrderRepository.test.ts` |

### Testfokus (Minimum)

- Erstellung gültiger TransportOrders (Status, Payload, IDs)
- Statusübergänge (`PENDING` → `IN_PROGRESS` → `COMPLETED` / `WAITING` falls im Aggregate)
- Validierung ungültiger Zustandswechsel → `Result.fail`
- Domain Events bei Completion
- Repository: save/find/filter deterministisch

### Exit Criteria

- [ ] Mindestens 8 neue Tests
- [ ] Keine Application-/Simulation-Abhängigkeit in Domain-Tests
- [ ] `pnpm test` grün

### Betroffene Bereiche

Logistics · BuildingStorage indirekt (keine Änderung am Aggregate nötig, sofern Tests grün)

---

## P1-02 – Milestone Domain Extraction

**Priorität:** Hoch (Architektur)

**Ziel:** Milestone-Trigger-Auswertung aus Application in Domain verlagern; Content-Typen nicht direkt in Domain importieren.

### Ist-Zustand

- `MilestoneEvaluationService` importiert `MilestoneRegistry`, `MilestoneDefinition`, `MilestoneTriggerType`
- Trigger-Logik (`FIRST_SALE`, `PRODUCTION_VOLUME`, `PROFIT_THRESHOLD`) in Application

### Soll-Zustand

```text
Content (MilestoneDefinition)
        ↓
Application (lädt Definitionen, übergibt DTO/Port)
        ↓
Domain Policy / Specification (prüft Trigger gegen Domain-State)
        ↓
CompanyMilestones Aggregate (markiert erreicht)
```

### Deliverables

| Artefakt                         | Beschreibung                                                                                                                                 |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Domain Policy oder Specification | z. B. `MilestoneTriggerPolicy` oder pro Trigger eine Specification unter `src/domain/milestone/` oder `src/domain/specifications/milestone/` |
| Port (optional)                  | Schmaler Read-Port für Milestone-Metadaten, falls nötig — **kein** direkter Registry-Import in Domain                                        |
| Refactor Application             | `MilestoneEvaluationService` delegiert an Domain                                                                                             |
| Tests                            | Domain-Tests für jede Trigger-Variante; bestehende Service-Tests angepasst                                                                   |

### Exit Criteria

- [ ] Kein `import` aus `src/content/` in neuen Domain-Dateien
- [ ] `MilestoneEvaluationService.test.ts` weiterhin grün
- [ ] Neue Domain-Unit-Tests ≥ 6
- [ ] Verhalten unverändert gegenüber offiziellem `game-content/milestones/`

### ADR-Bezug

DD-015 (Static vs Dynamic), DD-029 (Modular Monolith), Clean Architecture

---

## P1-03 – Research Test Coverage

**Priorität:** Mittel

**Ziel:** Lücke `ResearchCompletionService` ohne Unit-Test schließen.

### Deliverables

| Artefakt                  | Pfad                                                                                     |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| Service-Unit-Tests        | `src/application/services/ResearchCompletionService.test.ts`                             |
| Optional Domain-Ergänzung | Tests für `CompanyResearch.completeTechnology()` Edge Cases in `CompanyResearch.test.ts` |

### Exit Criteria

- [ ] Happy Path: ResearchJob completed → Technology in CompanyResearch
- [ ] Fehlerfälle: unbekannte Company, ungültige Technology
- [ ] Mindestens 4 neue Tests

---

## P1-04 – Money VO Consistency

**Priorität:** Mittel

**Ziel:** `Money` als Value Object dort nutzen, wo `FinanceAccount` Geldbeträge modelliert — ohne Verhaltensänderung.

### Ist-Zustand

- `Money.ts` existiert mit Tests
- `FinanceAccount` nutzt intern `number` für Saldo und Transaktionen

### Deliverables

| Artefakt                  | Beschreibung                                                   |
| ------------------------- | -------------------------------------------------------------- |
| Refactor `FinanceAccount` | Saldo und Beträge über `Money` (add/subtract/compare)          |
| Erweiterung `Money`       | Nur falls für FinanceAccount nötig (minimale API)              |
| Tests                     | `FinanceAccount.test.ts` und `Money.test.ts` angepasst/ergänzt |

### Exit Criteria

- [ ] Keine öffentliche API-Änderung für Application Layer (Signaturen stabil oder mit minimalem Diff)
- [ ] Alle Finance-/Market-Tests grün
- [ ] Keine Magic Numbers — weiterhin `FinanceConstants` / `STARTING_MONEY`

### Risiko

Mittlerer Refactor-Touch in Application/Savegame-Serialisierung — vor Merge Savegame-Roundtrip prüfen.

---

## P1-05 – Company Domain Clarification

**Priorität:** Niedrig

**Ziel:** Erwartungshaltung für `Company`-Aggregate und `CompanySimulationSystem` dokumentieren und minimal konsistent machen.

### Option (empfohlen)

**Dokumentation first:** Company bleibt minimal (`create`, Status-Enum ohne Transition-Methoden). `CompanySimulationSystem` bleibt Stub mit explizitem Kommentar „Phase 1: no-op; erweitert in M7“.

### Deliverables

| Artefakt                            | Beschreibung                                                         |
| ----------------------------------- | -------------------------------------------------------------------- |
| Domain-Kommentar / README-Abschnitt | In `src/domain/company/` oder `IMPLEMENTATION_PROGRESS`              |
| Stub-Klarstellung                   | `CompanySimulationSystem.ts` — Intent-Kommentar, kein neues Gameplay |
| Optional                            | 1–2 Tests für `CompanyStatus`-Invarianten, falls fehlend             |

### Exit Criteria

- [ ] Kein Scope-Creep (kein Bankruptcy-Flow, kein World-Bezug)
- [ ] Architektur-Review: Stub ist bewusst und dokumentiert

---

## P1-06 – Repository Test Coverage

**Priorität:** Mittel

**Ziel:** In-Memory-Repositories für Phase-1-Kernbereiche mit expliziten Tests absichern.

### Deliverables

| Repository                            | Testdatei           | Status Audit       |
| ------------------------------------- | ------------------- | ------------------ |
| `InMemoryTransportOrderRepository`    | neu                 | fehlend            |
| `InMemoryCompanyResearchRepository`   | neu                 | fehlend            |
| `InMemoryResearchJobRepository`       | neu                 | fehlend            |
| `InMemoryCompanyMilestonesRepository` | neu                 | fehlend            |
| `InMemoryCompanyRepository`           | vorhanden (2 Tests) | optional erweitern |
| `InMemoryInventoryRepository`         | vorhanden (1 Test)  | optional erweitern |

### Exit Criteria

- [ ] Mindestens 4 neue Repository-Testdateien oder 12 neue Tests gesamt
- [ ] CRUD + Duplicate-/Not-Found-Verhalten abgedeckt
- [ ] Deterministische Sortierung wo spezifiziert (`getAll()`)

---

# Quality Gates (pro Work Package)

Jedes Work Package muss vor Merge alle folgenden Befehle bestehen:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm validate-content
pnpm validate-content --strict
```

Zusätzlich:

| Gate           | Kriterium                                          |
| -------------- | -------------------------------------------------- |
| Architecture   | `tests/architecture/dependency-rules.test.ts` grün |
| Domain purity  | Kein neuer `src/content/`-Import in `src/domain/`  |
| No scope creep | Keine Out-of-Scope-Features                        |
| Tests          | Neues Verhalten mit Unit-Tests abgedeckt           |
| Docs           | `IMPLEMENTATION_PROGRESS.md` nach WP-Abschluss     |

---

# Dokumentations-Updates (geplant)

| Work Package      | Dokument                                                                   |
| ----------------- | -------------------------------------------------------------------------- |
| P1-01             | `IMPLEMENTATION_PROGRESS.md` (Logistics Tests)                             |
| P1-02             | `IMPLEMENTATION_PROGRESS.md`; optional `domain-model.md`-Hinweis Milestone |
| P1-04             | `IMPLEMENTATION_PROGRESS.md` (Money VO)                                    |
| P1-05             | `src/domain/company/` README oder Progress-Doc                             |
| Phase 1 Abschluss | `docs/quality/PHASE1_CORE_DOMAIN_REPORT.md`                                |

**Nicht** automatisch ändern: Content-Schema-Dokumentation.

---

# Risiken und Mitigationen

| Risiko                               | Mitigation                                                 |
| ------------------------------------ | ---------------------------------------------------------- |
| P1-02 vergrößert Diff in Application | Kleine Schritte; Service-Tests als Regression              |
| P1-04 bricht Savegame                | `GameStateSerializer.test.ts` vor/nach Refactor            |
| Verwechslung Phase 1 vs M7           | Out-of-Scope-Liste in jedem PR referenzieren               |
| Content-Änderung „nur schnell“       | Baseline-Regel: STOP bei Content-Touch ohne Fehlernachweis |

---

# Phase 1 Gate Review (Abschluss)

Vor formalem Abschluss:

1. Alle Exit Criteria P1-01–P1-06 prüfen
2. Testzähler dokumentieren (Baseline 417 + Delta)
3. Domain-Import-Audit: `rg "from.*content" src/domain/` → 0 Treffer
4. Kurzbericht `PHASE1_CORE_DOMAIN_REPORT.md` mit:
   - erledigten Work Packages
   - verbleibenden Lücken (bewusst M7+)
   - Empfehlung für M7-Start

---

# Definition of Done – Phase 1

Phase 1 ist **Done**, wenn:

- [ ] Work Packages P1-01 bis P1-06 abgeschlossen
- [ ] Gesamt-Exit-Kriterien erfüllt
- [ ] Gate Review dokumentiert
- [ ] `IMPLEMENTATION_PROGRESS.md` Phase-1-Abschnitt vorhanden
- [ ] Keine offenen Blocker für M7-Domain-Erweiterungen (World/Region)

---

# Nächster Schritt nach Plan-Freigabe

**Empfohlener Implementierungsstart:** P1-01 (Logistics Domain Tests) — kleinster Risiko-Radius, höchster Audit-Impact.

Keine Code-Änderungen vor explizitem Start eines Work Packages.

---

# Referenzen

```text
docs/development/CURSOR_IMPLEMENTATION_GUIDE.md
docs/development/IMPLEMENTATION_PROGRESS.md
docs/project-management/MILESTONE_PLAN.md
docs/project-management/QUALITY_GATES.md
docs/architecture/domain-model.md
docs/architecture/bounded-contexts.md
docs/decisions/DD-015-static-definitions-vs-dynamic-state.md
docs/decisions/DD-022–abstract-logistics-network.md
src/domain/readme.md
```
