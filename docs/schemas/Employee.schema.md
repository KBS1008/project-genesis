# Employee.schema.md

**Version:** 1.0
**Status:** Active
**Asset Type:** Employee
**Schema Version:** 1

---

# Purpose

Dieses Dokument definiert das kanonische Schema für alle Employee-Assets in Project Genesis.

Alle Mitarbeiterdefinitionen müssen diesem Schema entsprechen.

Das Schema dient als Grundlage für:

* JSON-Dateien
* Validierung
* Asset Registry
* Editor
* Modding
* Savegame-Kompatibilität

---

# Asset Identity

Jeder Employee besitzt eine eindeutige Asset-ID.

Beispiel:

```text
employee.engineer.basic
employee.scientist.senior
employee.logistics.operator
```

---

# Required Fields

| Feld         | Typ     | Beschreibung          |
| ------------ | ------- | --------------------- |
| id           | string  | eindeutige Asset-ID   |
| version      | integer | Schema-/Asset-Version |
| displayName  | string  | Anzeigename           |
| category     | string  | Mitarbeiterkategorie  |
| profession   | string  | Beruf                 |
| cost         | integer | Einstellungskosten    |
| salary       | integer | laufende Kosten       |
| productivity | number  | Produktivitätsfaktor  |
| description  | string  | Beschreibung          |

---

# Optional Fields

| Feld            | Typ    |
| --------------- | ------ |
| icon            | string |
| portrait        | string |
| rarity          | string |
| traits          | array  |
| requirements    | object |
| tags            | array  |
| localizationKey | string |

---

# Statistics

```yaml
statistics:
  productivity: number
  efficiency: number
  stamina: number
  intelligence: number
  reliability: number
```

Alle Werte sind positiv.

---

# Traits

Traits definieren besondere Eigenschaften.

Beispiel:

```yaml
traits:
  - fast_learner
  - night_shift
  - leadership
```

Traits werden separat registriert.

---

# Requirements

Beispiel:

```yaml
requirements:
  research:
    - research.hr.training
  buildings:
    - building.office
```

---

# Localization

Texte werden nicht direkt gespeichert.

Stattdessen:

```yaml
localizationKey:
  employee.engineer.basic
```

---

# Asset References

Ein Employee darf referenzieren:

* Research
* Buildings
* Traits
* Technologies

Referenzen erfolgen ausschließlich über Asset-IDs.

---

# Validation Rules

Erforderlich:

* eindeutige ID
* gültige Version
* positiver Salary
* positiver Cost
* gültige Kategorie
* gültige Referenzen

Ungültige Assets dürfen nicht geladen werden.

---

# Versioning

Änderungen am Schema erhöhen die Schema-Version.

Änderungen an einzelnen Assets erhöhen deren Asset-Version.

---

# Example

```yaml
id: employee.engineer.basic
version: 1

displayName: Junior Engineer

category: engineering

profession: engineer

cost: 1200

salary: 180

productivity: 1.0

description: Entry-level production engineer.

statistics:
  productivity: 1.0
  efficiency: 0.9
  stamina: 0.8
  intelligence: 1.1
  reliability: 1.0

traits:
  - fast_learner

requirements:
  research:
    - research.hr.training

tags:
  - worker
  - engineering
```

---

# Compatibility

Dieses Schema ist kompatibel mit:

* ASSET_ID_SYSTEM.md
* ASSET_VERSIONING.md
* REGISTRY_SCHEMA.md
* GLOBAL_ASSET_REGISTRY.md
* CONTENT_PIPELINE.md

---

# Future Extensions

Geplante Erweiterungen:

* Experience-System
* Skills
* Ausbildung
* Spezialisierungen
* Gehaltsentwicklung
* Zufriedenheit
* KI-Verhalten
* Persönlichkeitsprofile
