---
Document-ID: DD-034
Title: API Versioning and Compatibility
Type: Architecture Decision Record
Status: Accepted
Version: 1.0.0
Created: 2026-07-03
Last Updated: 2026-07-03

Authors:
  - Project Genesis Architecture

Reviewers:
  - TBD

Related Documents:
  - ARCH-002 (SAD.md)
  - ARCH-003 (DDD.md)
  - ARCH-004 (technology-stack.md)

Related Decisions:
  - DD-026 – Hybrid Data Access Strategy
  - DD-028 – CQRS Lite
  - DD-029 – Modular Monolith Architecture

Affected Components:
  - REST API
  - WebSocket Gateway
  - Frontend
  - Mobile Clients
  - Admin Tools

Tags:
  - api
  - versioning
  - compatibility
  - backend
---

# DD-034 – API Versioning and Compatibility

## Status

**Accepted**

---

# Zusammenfassung

Alle öffentlichen Schnittstellen von Project Genesis werden versioniert.

Versionierung erfolgt unabhängig von der internen Softwareversion.

Die API wird so entwickelt, dass bestehende Clients möglichst lange kompatibel bleiben.

---

# Motivation

Project Genesis soll langfristig weiterentwickelt werden.

Im Laufe der Zeit werden:

- neue Felder
- neue Endpunkte
- neue Spielmechaniken
- neue Clients
- externe Tools

hinzukommen.

Eine stabile API verhindert unnötige Anpassungen bestehender Clients.

---

# Problem

Ohne Versionierung führen Änderungen häufig zu:

- inkompatiblen Frontends
- fehlerhaften Mobile Apps
- instabilen WebSocket-Verbindungen
- aufwändigen Rollbacks

---

# Entscheidung

Alle öffentlichen APIs besitzen eine Version.

Versionen werden im URL-Pfad geführt.

Beispiel:

```
/api/v1/
```

---

# REST API

Grundstruktur:

```
/api/v1/auth

/api/v1/company

/api/v1/buildings

/api/v1/production

/api/v1/inventory

/api/v1/finance

/api/v1/research

/api/v1/market

/api/v1/statistics
```

---

# WebSocket

Auch WebSocket-Verbindungen besitzen eine Version.

Beispiel:

```
/ws/v1
```

Neue Protokollversionen erhalten eigene Namespaces.

---

# Kompatibilitätsregeln

Innerhalb einer Hauptversion gilt:

- Keine Breaking Changes
- Felder dürfen ergänzt werden
- Endpunkte dürfen ergänzt werden
- Optionale Parameter dürfen ergänzt werden

Nicht erlaubt:

- Pflichtfelder entfernen
- Datentypen ändern
- Semantik bestehender Felder ändern

---

# DTOs

Alle APIs verwenden DTOs.

Entities werden niemals direkt übertragen.

Beispiel:

```
CompanyEntity

↓

CompanyDto

↓

JSON
```

Dadurch können interne Änderungen erfolgen, ohne die API zu beeinflussen.

---

# Deprecation

Veraltete Endpunkte werden nicht sofort entfernt.

Lebenszyklus:

```
Active

↓

Deprecated

↓

Hidden

↓

Removed
```

Jede Deprecation wird dokumentiert.

---

# Fehlerformat

Alle REST-Endpunkte liefern ein einheitliches Fehlerformat.

Beispiel:

```json
{
  "error": {
    "code": "BUILDING_NOT_FOUND",
    "message": "Building not found",
    "details": null,
    "requestId": "8d3b6b0c..."
  }
}
```

---

# Erfolgsformat

Alle Antworten besitzen eine konsistente Struktur.

Beispiel:

```json
{
  "data": {},
  "meta": {
    "apiVersion": "v1"
  }
}
```

---

# Pagination

Listen werden grundsätzlich paginiert.

Standard:

```
page

pageSize

totalItems

totalPages
```

Cursor-basierte Pagination kann später ergänzt werden.

---

# Filter

Filterparameter folgen einer einheitlichen Struktur.

Beispiel:

```
?status=active

?sort=name

?order=asc
```

---

# Datumsformat

Alle Zeitangaben werden als ISO-8601 übertragen.

Beispiel:

```
2026-07-03T12:45:00Z
```

Die Simulation selbst verwendet intern Ticknummern.

---

# IDs

Alle öffentlichen IDs sind UUIDs.

Interne Datenbank-IDs werden niemals exponiert.

---

# API-Dokumentation

Die REST-API wird automatisch dokumentiert.

Verwendet wird:

- OpenAPI
- Swagger

Die Dokumentation wird aus dem Quellcode generiert.

---

# Versionierungsstrategie

Major-Version

- Breaking Changes

Minor-Version

- Neue Features

Patch-Version

- Fehlerbehebungen

API-Version und Softwareversion werden getrennt geführt.

---

# Erweiterbarkeit

Neue Module erhalten neue Endpunkte innerhalb derselben API-Version.

Beispiel:

```
/api/v1/environment

/api/v1/transport

/api/v1/contracts
```

---

# Sicherheit

Alle APIs unterstützen:

- JWT Authentication
- Rollenbasierte Berechtigungen
- Rate Limiting
- Request Validation

---

# Vorteile

- Langfristige Stabilität
- Einfache Erweiterbarkeit
- Klare Migrationspfade
- Einheitliche Schnittstellen
- Gute Dokumentation

---

# Nachteile

- Zusätzlicher Wartungsaufwand
- Alte Versionen müssen zeitweise unterstützt werden

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternativen

## Keine Versionierung

Verworfen.

Grund:

Breaking Changes wären unvermeidbar.

---

## Header-basierte Versionierung

Verworfen.

Grund:

URL-basierte Versionierung ist transparenter und einfacher zu dokumentieren.

---

## Versionierung pro Endpunkt

Verworfen.

Grund:

Uneinheitlich und schwer wartbar.

---

# Implementierung

Projektstruktur:

```
src/

modules/

company/
controllers/

v1/

CompanyController.ts

dto/

CompanyDto.ts
```

Spätere Versionen werden parallel angelegt.

---

# Hinweise für Cursor AI

Beim Erstellen neuer APIs gelten folgende Regeln:

- Jeder neue Endpunkt gehört zu einer API-Version.
- Entities dürfen niemals direkt serialisiert werden.
- DTOs sind verpflichtend.
- Neue Felder müssen optional sein, sofern bestehende Clients betroffen sind.
- Breaking Changes dürfen nur mit einer neuen Major-Version eingeführt werden.
- Fehlerantworten folgen dem Standardformat.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Stabilität
- Wartbarkeit
- Rückwärtskompatibilität
- Dokumentation
- Erweiterbarkeit

---

# Risiken

Mögliche Risiken:

- Zu lange Unterstützung veralteter Versionen
- Inkonsistente DTOs
- Fehlende Dokumentation

Diese Risiken werden durch API-Governance, Code Reviews und automatisierte Tests minimiert.

---

# Änderungsprotokoll

| Version | Datum      | Änderung         |
| ------- | ---------- | ---------------- |
| 1.0.0   | 2026-07-03 | Initiale Version |

---

# Leitsatz

> **"Eine öffentliche API ist ein Vertrag mit ihren Clients."**

Project Genesis behandelt seine REST- und WebSocket-Schnittstellen als stabile, versionierte Verträge. Dadurch können Frontend, Mobile Apps und zukünftige Integrationen unabhängig vom Backend weiterentwickelt werden, ohne bestehende Clients zu beeinträchtigen.
