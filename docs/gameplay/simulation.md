# Simulation

> Dieses Dokument beschreibt das Simulationsmodell von Project Genesis.

Version: 1.0

---

# Ziel

Project Genesis simuliert eine persistente Wirtschaftswelt.

Die Simulation muss:

- performant
- deterministisch
- reproduzierbar
- skalierbar
- erweiterbar

sein.

Alle Spielsysteme bauen auf dieser Simulation auf.

---

# Grundprinzip

Project Genesis verwendet eine **ereignisgesteuerte Simulation (Event-Driven Simulation)**.

Es existiert **kein globaler Tick**, der jede Sekunde alle Gebäude berechnet.

Stattdessen werden ausschließlich Änderungen verarbeitet.

---

# Simulationsmodell

Jede Aktion erzeugt ein Ereignis.

Beispiele:

- Produktionsauftrag gestartet
- Produktion abgeschlossen
- Forschung abgeschlossen
- Gebäude fertiggestellt
- Auftrag angenommen
- Energieversorgung geändert
- Marktauftrag ausgeführt

Nur diese Ereignisse verändern den Spielzustand.

---

# Zeitmodell

Die Zeit läuft kontinuierlich.

Jedes Ereignis besitzt einen eindeutigen Zeitstempel (UTC).

```text
08:00:00

↓

Produktion gestartet

↓

Endzeit = 08:01:00

↓

Keine Berechnung notwendig

↓

08:01:00

↓

Produktion abgeschlossen
```

---

# Offline-Simulation

Spieler müssen nicht online sein.

Beim Login wird berechnet:

```text
currentTime

-

lastSimulation

=

offlineDuration
```

Anschließend werden alle Ereignisse innerhalb dieses Zeitraums verarbeitet.

Dadurch entsteht derselbe Zustand, als wäre der Spieler online gewesen.

---

# Simulationsreihenfolge

Die Verarbeitung erfolgt immer in derselben Reihenfolge:

1. Produktion
2. Energie
3. Mitarbeiter
4. Forschung
5. Markt
6. Verträge
7. Gebäude
8. Ereignisse

Diese Reihenfolge ist verbindlich.

---

# Produktionsmodell

Jede Produktionslinie besitzt:

- aktuelles Rezept
- Status
- Startzeit
- Endzeit
- Input
- Output

Die Produktion wird ausschließlich bei Start und Abschluss berechnet.

Keine Zwischenberechnung.

---

# Warteschlangen

Jedes Gebäude besitzt eine Queue.

Beispiel

```text
Rezept A

↓

Rezept B

↓

Rezept C
```

Nach Abschluss startet automatisch das nächste Rezept.

---

# Ereignisse (Events)

Jedes Event besitzt:

- Event-ID
- Typ
- Spieler
- Zeitpunkt
- Daten
- Version

Beispiel

```yaml
eventId: EVT-000001

type: ProductionFinished

timestamp: 2026-07-01T08:01:00Z

buildingId: SAWMILL_01

recipeId: RECIPE_PLANKS
```

---

# Deterministische Simulation

Die Simulation muss reproduzierbar sein.

Gleiche Eingabedaten führen immer zum gleichen Ergebnis.

Dadurch werden:

- Tests
- Debugging
- Balancing
- Simulationen

erheblich vereinfacht.

---

# Serverautorität

Alle Spielberechnungen erfolgen ausschließlich auf dem Server.

Der Client kennt nur Ergebnisse.

Der Client darf niemals:

- Produktion berechnen
- Marktpreise berechnen
- Geld verändern
- Forschung abschließen

---

# Marktaktualisierung

Der Markt wird nicht permanent berechnet.

Nur bei:

- Kauf
- Verkauf
- Ablauf eines Angebots
- Systemereignissen

werden Preise angepasst.

---

# Energie

Energie wird nur neu berechnet wenn:

- Kraftwerk gebaut
- Kraftwerk entfernt
- Produktion startet
- Produktion endet
- Stromspeicher verändert

---

# Forschung

Forschung erzeugt genau zwei Ereignisse:

StartResearch

ResearchCompleted

---

# Gebäude

Gebäude besitzen folgende Zustände:

- Planung
- Bau
- Aktiv
- Pausiert
- Wartung
- Beschädigt
- Stillgelegt

Nur Statuswechsel erzeugen Simulationsevents.

---

# Automatisierung

Automatische Regeln werden ausschließlich geprüft wenn:

- Produktion endet
- Lagerbestand geändert wurde
- Marktpreis verändert wurde
- Energie geändert wurde

Nicht jede Sekunde.

---

# Markt

Marktaufträge erzeugen Events:

OrderCreated

OrderMatched

OrderCancelled

OrderExpired

---

# Logging

Alle Simulationsevents werden protokolliert.

Logs dienen:

- Debugging
- Replay
- Fehleranalyse

---

# Replay

Da alle Änderungen Events sind, kann ein Unternehmen theoretisch vollständig rekonstruiert werden.

Dies ermöglicht:

- Fehleranalyse
- Wirtschaftssimulation
- spätere Replays

---

# Skalierung

Die Simulation muss mehrere hunderttausend Gebäude verwalten können.

Daher gilt:

✔ Keine Sekunden-Ticks

✔ Keine Schleifen über alle Spieler

✔ Keine permanente Marktberechnung

✔ Berechnung nur bei Änderungen

---

# Regionen

Version 1 besitzt eine globale Region.

Die Simulation muss jedoch bereits unterstützen:

- mehrere Regionen
- unterschiedliche Zeitzonen (Anzeige)
- regionale Märkte
- regionale Rohstoffe

Die Simulationszeit bleibt immer UTC.

---

# Performance-Ziele

Ein einzelnes Ereignis soll innerhalb weniger Millisekunden verarbeitet werden.

Die Offline-Simulation eines durchschnittlichen Unternehmens (24 Stunden) soll in unter einer Sekunde abgeschlossen werden.

---

# Fehlertoleranz

Jedes Ereignis ist atomar.

Schlägt ein Ereignis fehl:

- Rollback
- Logging
- erneuter Versuch

Der Spielzustand darf niemals inkonsistent werden.

---

# Zukunft

Die Architektur muss folgende Erweiterungen ermöglichen:

- KI-Unternehmen
- Regionen
- Transportnetzwerke
- Wetter
- Naturkatastrophen
- Börse
- Weltpolitik
- Modding

ohne Änderungen am Simulationskern.

---

# Designprinzipien

- Ereignisgesteuert statt Tick-basiert.
- Server ist die einzige Quelle der Wahrheit.
- Alle Berechnungen sind deterministisch.
- Offline und Online liefern identische Ergebnisse.
- Performance hat Vorrang vor unnötiger Echtzeit.

---

# Leitsatz

> "Nicht die Zeit verändert die Welt – Ereignisse verändern sie."

Jede Änderung in Project Genesis entsteht durch ein nachvollziehbares Ereignis.