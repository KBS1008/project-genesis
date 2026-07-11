# DD-012 – Hybrid Event Architecture

Status: Accepted

Version: 1.0

Datum: 2026-06-30

---

# Problem

Project Genesis simuliert eine persistente Wirtschaft.

Eine klassische Tick-Simulation verursacht bei vielen Spielern eine hohe Serverlast.

Ein vollständiges Event-Sourcing-System bietet zwar maximale Nachvollziehbarkeit, erhöht jedoch den Entwicklungsaufwand erheblich.

Gesucht wird eine Architektur, die:

- performant
- nachvollziehbar
- skalierbar
- wartbar

ist.

---

# Entscheidung

Project Genesis verwendet eine Hybrid Event Architecture.

Dabei werden zwei Dinge parallel gespeichert.

## 1. Aktueller Zustand

Der aktuelle Spielzustand befindet sich in PostgreSQL.

Beispiele:

- Spieler
- Gebäude
- Lager
- Produktionen
- Forschung
- Marktaufträge
- Kontostände

Diese Daten werden direkt vom Spiel verwendet.

---

## 2. Ereignisprotokoll

Wichtige Änderungen werden zusätzlich als Events gespeichert.

Beispiele:

- Produktion gestartet
- Produktion abgeschlossen
- Gebäude gebaut
- Forschung begonnen
- Forschung abgeschlossen
- Marktauftrag erstellt
- Marktauftrag ausgeführt
- Kredit aufgenommen
- Gebäude verbessert

Diese Events dienen ausschließlich der Nachvollziehbarkeit und Analyse.

---

# Beispiel

08:00

ProductionStarted

↓

08:01

ProductionFinished

↓

InventoryChanged

↓

MoneyChanged

↓

08:02

MarketOrderCreated

↓

08:03

MarketOrderMatched

---

# Ziel

Nicht jeder Datenbankeintrag erzeugt automatisch ein Event.

Nur spielrelevante Änderungen.

---

# Vorteile

✔ Sehr hohe Performance

✔ Einfache Datenbankabfragen

✔ Nachvollziehbare Spielhistorie

✔ Replay einzelner Vorgänge möglich

✔ Gute Grundlage für Statistiken

✔ Exploit-Erkennung

✔ Balancing-Auswertungen

✔ Erweiterbar

---

# Nachteile

- Zusätzlicher Speicherbedarf

- Eventdefinitionen müssen gepflegt werden

- Zwei Datenquellen müssen konsistent bleiben

---

# Eventstruktur

Jedes Event besitzt mindestens:

eventId

eventType

timestamp

playerId

entityType

entityId

payload

version

---

Beispiel

```json
{
  "eventId": "EVT-120394",
  "eventType": "ProductionFinished",
  "timestamp": "2026-07-01T08:01:00Z",
  "playerId": "PLAYER-42",
  "entityType": "Building",
  "entityId": "SAWMILL-01",
  "payload": {
    "recipe": "RECIPE_PLANKS",
    "amount": 120
  },
  "version": 1
}
```

---

# Event-Aufbewahrung

Nicht alle Events werden dauerhaft gespeichert.

Klassen:

Short-Term

30 Tage

für Debugging

---

Mid-Term

365 Tage

für Balancing

---

Long-Term

dauerhaft

nur besonders wichtige Ereignisse

Beispiele

- Firmengründung
- Insolvenzen
- Weltrekorde
- globale Events

---

# Verwendung

Die Event-Historie wird verwendet für:

- Unternehmenshistorie
- Wirtschaftsanalyse
- Replay
- Statistiken
- Admin-Tools
- Debugging
- Cheat-Erkennung
- Balancing

---

# Nicht Bestandteil von Version 1

Nicht umgesetzt werden zunächst:

- vollständiges Replay
- vollständiges Event-Sourcing
- CQRS
- Event-Streaming

Die Architektur bleibt jedoch kompatibel.

---

# Auswirkungen

Diese Entscheidung beeinflusst:

- Simulation
- Datenbank
- API
- Produktion
- Forschung
- Markt
- Logistik
- Admin-Backend

---

# Zukünftige Erweiterungen

Die Architektur ermöglicht später:

- Live-Zeitreise (Replay)

- Wirtschaftsdiagramme

- Heatmaps

- Produktionsanalysen

- KI-Auswertungen

- Event-Bus

- Kafka/RabbitMQ

ohne grundlegende Architekturänderungen.

---

# Entscheidung

Accepted

Die Hybrid Event Architecture ist Bestandteil der Kernarchitektur von Project Genesis.