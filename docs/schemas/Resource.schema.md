# Resource.schema.md

**Version:** 1.0
**Status:** Active
**Asset Type:** Resource
**Schema Version:** 1

---

# Purpose

Dieses Dokument definiert das kanonische Schema für alle Ressourcen-Assets in Project Genesis.

Ressourcen bilden die Grundlage sämtlicher Produktions-, Transport-, Lager-, Handels- und Verbrauchsprozesse.

Alle Ressourcen müssen diesem Schema entsprechen.

Das Schema dient als Grundlage für:

- JSON-Assets
- Asset Registry
- Content Pipeline
- Validierung
- Savegames
- Editor
- Modding

---

# Asset Identity

Jede Ressource besitzt eine eindeutige Asset-ID.

Beispiele:

```text
resource.iron_ore
resource.coal
resource.steel
resource.copper
resource.plastic
resource.water
resource.electricity
```

---

# Required Fields

| Feld        | Typ     | Beschreibung         |
| ----------- | ------- | -------------------- |
| id          | string  | Eindeutige Asset-ID  |
| version     | integer | Asset-Version        |
| displayName | string  | Anzeigename          |
| category    | string  | Ressourcenkategorie  |
| description | string  | Beschreibung         |
| stackSize   | integer | Maximale Stapelgröße |
| baseValue   | number  | Basiswert für Handel |
| mass        | number  | Gewicht pro Einheit  |

---

# Optional Fields

| Feld                | Typ    |
| ------------------- | ------ |
| icon                | string |
| color               | string |
| rarity              | string |
| localizationKey     | string |
| tags                | array  |
| properties          | object |
| storageRequirements | object |
| production          | object |

---

# Resource Categories

Empfohlene Kategorien:

```yaml
raw_material
processed_material
component
consumer_good
liquid
gas
energy
waste
special
```

Neue Kategorien können projektspezifisch ergänzt werden.

---

# Physical Properties

```yaml
properties:
  mass: 1.2
  volume: 0.8
  density: 1.5
  flammable: false
  hazardous: false
  radioactive: false
```

Alle Werte müssen gültige physikalische Eigenschaften beschreiben.

---

# Storage Requirements

```yaml
storageRequirements:
  warehouse: true
  refrigerated: false
  hazardousStorage: false
  liquidTank: false
  silo: false
```

Definiert besondere Lagerbedingungen.

---

# Production

Optional kann definiert werden, wie eine Ressource erzeugt wird.

```yaml
production:
  producedBy:
    - building.smelter

  recipes:
    - recipe.steel
```

Referenzen erfolgen ausschließlich über Asset-IDs.

---

# Consumption

```yaml
consumption:
  consumedBy:
    - recipe.steel
    - building.power_plant
```

---

# Trading

```yaml
trading:
  tradable: true
  baseValue: 25
  marketCategory: industrial
```

---

# Asset References

Eine Ressource darf referenzieren:

- Buildings
- Recipes
- Technologies
- Scenarios
- Effects

Referenzen erfolgen ausschließlich über Asset-IDs.

---

# Localization

Texte werden ausschließlich über Lokalisierungsschlüssel referenziert.

Beispiel:

```yaml
localizationKey: resource.iron_ore
```

---

# Validation Rules

Eine Ressource ist gültig, wenn:

- eine eindeutige Asset-ID vorhanden ist
- die Version gültig ist
- eine Kategorie definiert wurde
- Stackgröße > 0
- Basiswert ≥ 0
- Masse ≥ 0
- sämtliche Referenzen existieren

Ungültige Ressourcen dürfen nicht geladen werden.

---

# Versioning

Schemaänderungen erhöhen die Schema-Version.

Änderungen an einzelnen Ressourcen erhöhen die Asset-Version.

Die Asset-ID bleibt unverändert.

---

# Example

```yaml
id: resource.iron_ore

version: 1

displayName: Iron Ore

category: raw_material

description: Raw iron ore extracted from mines.

stackSize: 1000

baseValue: 12

mass: 1.8

properties:
  mass: 1.8
  volume: 0.7
  density: 2.5
  flammable: false
  hazardous: false

storageRequirements:
  warehouse: true

production:
  producedBy:
    - building.iron_mine

consumption:
  consumedBy:
    - recipe.iron_ingots

trading:
  tradable: true
  baseValue: 12
  marketCategory: industrial

tags:
  - mining
  - raw
```

---

# Compatibility

Dieses Schema ist kompatibel mit:

- ASSET_ID_SYSTEM.md
- ASSET_VERSIONING.md
- REGISTRY_SCHEMA.md
- GLOBAL_ASSET_REGISTRY.md
- CONTENT_PIPELINE.md

---

# Future Extensions

Geplante Erweiterungen:

- Qualitätsstufen
- Reinheitsgrad
- Verderblichkeit
- Temperaturabhängigkeit
- Feuchtigkeit
- Recyclingfähigkeit
- Herkunft (Origin Tracking)
- Emissionsfaktor
- Marktpreisschwankungen
- Dynamische Rohstoffqualitäten
