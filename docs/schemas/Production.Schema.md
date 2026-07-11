# Production Schema

> Definiert das Datenmodell für Produktionswarteschlangen und Produktionsaufträge.

Version: 1.0

---

# Zweck

Die Produktionslogik trennt zwischen:

- Rezepten
- Produktionswarteschlangen
- laufenden Produktionsaufträgen

Dadurch können Gebäude mehrere Produkte herstellen, Produktionen pausiert werden und spätere Automatisierungssysteme einfach integriert werden.

---

# Architektur

```
Building
    │
    ▼
Production Queue
    │
    ▼
Production Job
    │
    ▼
Finished Products
```

---

# Übersicht

## Recipe

Beschreibt **was** produziert wird.

Beispiel

```
Bretter herstellen
```

---

## Queue

Beschreibt **was als Nächstes produziert werden soll**.

Beispiel

```
100x Bretter

↓

20x Balken

↓

50x Papier
```

---

## Job

Beschreibt den aktuell laufenden Produktionsauftrag.

Beispiel

```
Produktion:

Bretter

Fortschritt:

73 %

Restzeit:

16 Sekunden
```

---

# Production Queue Schema

```yaml
id:

buildingId:

playerId:

entries:

repeatMode:

priority:

enabled:

createdAt:

updatedAt:
```

---

## id

Eindeutige Queue-ID.

---

## buildingId

Gebäude, zu dem die Queue gehört.

---

## playerId

Besitzer.

---

## entries

Liste geplanter Produktionen.

---

## repeatMode

Mögliche Werte

```text
NONE

LOOP

UNTIL_RESOURCES_EMPTY

UNTIL_STORAGE_FULL

CUSTOM_RULES
```

---

## priority

Ganzzahl

1 = höchste Priorität

---

## enabled

Queue aktiv oder pausiert.

---

# Queue Entry Schema

```yaml
id:

recipeId:

amount:

remaining:

priority:

conditions:

createdAt:
```

---

## recipeId

Verwendetes Rezept.

---

## amount

Geplante Produktionszyklen.

---

## remaining

Noch ausstehende Zyklen.

---

## priority

Priorität innerhalb der Queue.

---

## conditions

Optionale Automatisierungsregeln.

Beispiel

```yaml
conditions:

- STORAGE_BELOW_500
```

---

# Production Job Schema

```yaml
id:

buildingId:

recipeId:

playerId:

status:

startTime:

endTime:

progress:

energyReserved:

workersAssigned:

inputs:

outputs:

createdAt:

updatedAt:
```

---

# Status

```text
WAITING

STARTING

RUNNING

PAUSED

BLOCKED

FINISHED

CANCELLED

FAILED
```

---

# Statusbeschreibung

## WAITING

Wartet auf Ressourcen.

---

## STARTING

Input wird reserviert.

---

## RUNNING

Produktion läuft.

---

## PAUSED

Manuell pausiert.

---

## BLOCKED

Fehlende Voraussetzungen.

Beispiele

- Strom fehlt
- Material fehlt
- Mitarbeiter fehlen

---

## FINISHED

Produktion erfolgreich abgeschlossen.

---

## CANCELLED

Abgebrochen.

---

## FAILED

Fehler.

Beispiel

Serverproblem.

---

# Input Reservation

Beim Produktionsstart werden Ressourcen reserviert.

Nicht erst am Ende.

Dadurch entstehen keine Doppelverwendungen.

---

# Output

Nach erfolgreicher Produktion werden Produkte:

- erzeugt
- ins Lager eingelagert
- Events erzeugt

---

# Produktionsfortschritt

Version 1

```text
progress

0 - 100 %
```

Der Fortschritt dient ausschließlich der Anzeige.

Der Abschluss wird über die Endzeit bestimmt.

---

# Energie

Beim Produktionsstart wird geprüft:

- genügend Strom vorhanden?

Falls nein:

Status

```
BLOCKED
```

---

# Mitarbeiter

Benötigte Mitarbeiter werden beim Produktionsstart reserviert.

Fehlen Mitarbeiter,

startet der Job nicht.

---

# Produktionskosten

Produktionskosten werden beim Start berechnet.

Beispiele

- Werkzeuge
- Schmierstoffe
- Chemikalien

Nicht:

Marktpreise.

---

# Wartung

Jeder Produktionszyklus erzeugt:

```text
usage
```

Gebäudeverschleiß wird separat berechnet.

---

# Abbruch

Ein Job kann abgebrochen werden.

Regel:

Input wird nicht automatisch vollständig zurückgegeben.

Ein Teil kann verloren gehen.

---

# Offlineproduktion

Beim Login werden Jobs geprüft.

Falls

```
currentTime

>

endTime
```

werden sie automatisch abgeschlossen.

Anschließend startet der nächste Queue-Eintrag.

---

# Events

Ein Job erzeugt:

```
ProductionStarted

↓

ProductionFinished

↓

InventoryChanged

↓

MoneyChanged

(optional)

↓

NextJobStarted
```

---

# Beziehungen

```
Production Queue

├── gehört zu → Building

├── enthält → QueueEntry

└── startet → Production Job
```

---

```
Production Job

├── nutzt → Recipe

├── reserviert → Resources

├── verbraucht → Energy

├── reserviert → Employees

├── erzeugt → Resources

├── erzeugt → Events

└── gehört zu → Player
```

---

# Datenfluss

```
Queue

↓

Input prüfen

↓

Input reservieren

↓

Job starten

↓

Zeit läuft

↓

Produktion fertig

↓

Output erzeugen

↓

Lager aktualisieren

↓

Events erzeugen

↓

Nächster Queue-Eintrag
```

---

# Designregeln

✔ Ein Gebäude besitzt genau eine Queue.

✔ Eine Queue besitzt beliebig viele Einträge.

✔ Ein Gebäude besitzt maximal einen aktiven Job.

✔ Ein Job nutzt genau ein Rezept.

✔ Inputs werden reserviert.

✔ Outputs entstehen erst nach erfolgreichem Abschluss.

✔ Alle Änderungen erzeugen Events.

✔ Produktion läuft vollständig serverseitig.

---

# Definition of Done

Eine Produktionsinstanz ist vollständig definiert, wenn:

- Rezept bekannt
- Gebäude bekannt
- Input reserviert
- Endzeit berechnet
- Status gesetzt
- Events definiert
- Output definiert

---

# Roadmap

## Version 1

- Eine Queue pro Gebäude
- Ein aktiver Job pro Gebäude
- Serielle Produktion

---

## Version 2

- Mehrere Produktionslinien
- Priorisierte Queues
- Lastverteilung
- Produktionscluster

---

## Version 3

- Produktionsnetzwerke
- KI-Optimierung
- Fabrikverbünde
- Regionale Fertigung

---

# Leitsatz

> "Rezepte definieren die Herstellung, Warteschlangen planen die Zukunft und Produktionsaufträge erschaffen die Realität."

Production Jobs sind die ausführbare Einheit der Wirtschaftssimulation von Project Genesis.