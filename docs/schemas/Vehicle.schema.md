# Vehicle.schema.md

**Version:** 1.0
**Status:** Active
**Asset Type:** Vehicle
**Schema Version:** 1

---

# Purpose

Dieses Dokument definiert das kanonische Schema für alle Fahrzeug-Assets in Project Genesis.

Alle Fahrzeugdefinitionen müssen diesem Schema entsprechen.

Das Schema dient als Grundlage für:

- JSON-Assets
- Asset Registry
- Validierung
- Content Pipeline
- Editor
- Modding
- Savegame-Kompatibilität

---

# Asset Identity

Jedes Fahrzeug besitzt eine eindeutige Asset-ID.

Beispiele:

```text
vehicle.truck.small
vehicle.truck.large
vehicle.forklift.basic
vehicle.train.freight
vehicle.ship.cargo
vehicle.drone.delivery
```

---

# Required Fields

| Feld            | Typ     | Beschreibung                |
| --------------- | ------- | --------------------------- |
| id              | string  | Eindeutige Asset-ID         |
| version         | integer | Asset-Version               |
| displayName     | string  | Anzeigename                 |
| category        | string  | Fahrzeugkategorie           |
| vehicleType     | string  | Fahrzeugtyp                 |
| description     | string  | Beschreibung                |
| purchaseCost    | integer | Anschaffungskosten          |
| maintenanceCost | integer | Laufende Wartungskosten     |
| maxSpeed        | number  | Maximale Geschwindigkeit    |
| cargoCapacity   | number  | Maximale Transportkapazität |

---

# Optional Fields

| Feld              | Typ    |
| ----------------- | ------ |
| icon              | string |
| model             | string |
| rarity            | string |
| fuelType          | string |
| fuelConsumption   | number |
| energyConsumption | number |
| durability        | number |
| tags              | array  |
| localizationKey   | string |

---

# Statistics

```yaml
statistics:
  maxSpeed: number
  acceleration: number
  cargoCapacity: number
  durability: number
  reliability: number
  energyEfficiency: number
```

Alle Werte müssen größer oder gleich Null sein.

---

# Vehicle Categories

Empfohlene Kategorien:

```yaml
truck
forklift
train
ship
aircraft
drone
service
construction
```

Neue Kategorien können projektspezifisch ergänzt werden.

---

# Fuel & Energy

Beispiel:

```yaml
fuel:
  type: diesel
  consumption: 4.5

energy:
  type: electricity
  consumption: 12.0
```

Ein Fahrzeug darf entweder kraftstoff- oder energiebasiert betrieben werden. Hybridsysteme sind zulässig.

---

# Cargo

```yaml
cargo:
  capacity: 120
  allowedResources:
    - resource.iron_ore
    - resource.coal
    - resource.steel
```

Alle Referenzen erfolgen ausschließlich über Asset-IDs.

---

# Unlock Requirements

```yaml
requirements:
  research:
    - research.transport.basic

  buildings:
    - building.vehicle_depot
```

---

# Asset References

Ein Vehicle darf referenzieren:

- Resources
- Buildings
- Research
- Technologies
- Effects

Referenzen erfolgen ausschließlich über Asset-IDs.

---

# Localization

Texte werden nicht direkt gespeichert.

Beispiel:

```yaml
localizationKey: vehicle.truck.small
```

---

# Validation Rules

Ein gültiges Vehicle muss:

- eine eindeutige ID besitzen
- eine gültige Version besitzen
- eine definierte Kategorie besitzen
- positive Kosten besitzen
- eine Geschwindigkeit ≥ 0 besitzen
- eine Kapazität ≥ 0 besitzen
- ausschließlich gültige Asset-Referenzen verwenden

Ungültige Fahrzeuge dürfen nicht registriert oder geladen werden.

---

# Versioning

Schemaänderungen erhöhen die Schema-Version.

Inhaltsänderungen erhöhen die Asset-Version.

Die Asset-ID bleibt unverändert.

---

# Example

```yaml
id: vehicle.truck.small

version: 1

displayName: Small Delivery Truck

category: truck

vehicleType: logistics

description: Entry-level logistics truck.

purchaseCost: 18000

maintenanceCost: 120

statistics:
  maxSpeed: 70
  acceleration: 8
  cargoCapacity: 120
  durability: 100
  reliability: 95
  energyEfficiency: 88

fuel:
  type: diesel
  consumption: 5.2

cargo:
  capacity: 120
  allowedResources:
    - resource.iron_ore
    - resource.steel

requirements:
  research:
    - research.transport.basic

tags:
  - logistics
  - transport
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

- Fahrerzuweisung
- Wartungsintervalle
- Verschleißmodell
- Kraftstoffpreise
- Batteriemanagement
- KI-Fahrverhalten
- Modulare Fahrzeug-Upgrades
- Emissionssystem
- Individuelle Lackierungen
