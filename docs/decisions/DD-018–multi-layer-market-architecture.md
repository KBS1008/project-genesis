# DD-018 – Multi-Layer Market Architecture

Status: Accepted

Version: 1.0

Datum: 2026-07-02

---

# Kontext

Klassische Browser-Wirtschaftsspiele verwenden häufig einen einzigen globalen Markt.

Dieses Modell führt langfristig zu mehreren Problemen:

- Rohstoffe können dauerhaft vom Markt verschwinden.
- Neue Spieler finden keine günstigen Einstiegspreise.
- Einzelne Großspieler können den Markt dominieren.
- Preismanipulation wird zu einfach.
- Die Wirtschaft wird instabil.

Project Genesis verfolgt deshalb einen anderen Ansatz.

---

# Entscheidung

Der Handel wird in drei voneinander getrennte Ebenen aufgeteilt.

```text
                    Market

                      │

      ┌───────────────┼───────────────┐

      ▼               ▼               ▼

 Player Market   NPC Economy   Contract Market
```

Jede Ebene besitzt eine eigene Aufgabe.

---

# 1. Player Market

Der Player Market ist der eigentliche freie Markt.

Hier handeln ausschließlich Spieler miteinander.

Eigenschaften:

- Angebot und Nachfrage bestimmen den Preis
- Orderbuch
- Kaufaufträge
- Verkaufsaufträge
- Marktgebühren
- Statistiken
- Preisdiagramme

Dies ist die wichtigste Handelsplattform.

---

# 2. NPC Economy

Die NPC Economy dient ausschließlich der Stabilisierung der Spielwirtschaft.

NPC-Unternehmen produzieren und kaufen Waren.

Dadurch wird verhindert, dass:

- wichtige Rohstoffe komplett verschwinden
- Preise dauerhaft explodieren
- Anfänger blockiert werden

Die NPC Economy simuliert eine Grundversorgung.

Sie konkurriert nicht aggressiv mit Spielern.

Sie wirkt lediglich stabilisierend.

---

# 3. Contract Market

Unternehmen können langfristige Lieferverträge abschließen.

Beispiele:

- 500 Holz pro Stunde
- 200 Stahl täglich
- 50 Maschinen pro Woche

Eigenschaften:

- feste Preise
- feste Laufzeit
- garantierte Lieferungen
- automatische Abwicklung

Dadurch entstehen langfristige Wirtschaftsbeziehungen.

---

# Vorteile

## Stabilität

Die Wirtschaft bleibt auch bei geringer Spielerzahl funktionsfähig.

---

## Fairness

Neue Spieler können jederzeit handeln.

---

## Strategie

Unternehmen entscheiden selbst:

- kurzfristiger Handel
- langfristige Verträge
- Marktbeobachtung
- Lagerhaltung

---

## Spezialisierung

Ein Unternehmen kann sich beispielsweise konzentrieren auf:

- Rohstoffhandel
- Industrieproduktion
- Vertragslieferungen
- Spekulation

---

# Versionierung

## Version 1

Player Market

-

NPC Economy (vereinfacht)

---

## Version 2

Contract Market

---

## Version 3

Regionale Märkte

Transportkosten

Import

Export

---

## Version 4

Internationale Handelsplätze

Terminmärkte

Rohstoffbörsen

Finanzmärkte

---

# Konsequenzen

## Vorteile

✔ Dynamische Wirtschaft

✔ Markt bleibt stabil

✔ Neue Spieler werden nicht benachteiligt

✔ Mehrere Spielstile möglich

✔ Erweiterbar

---

## Nachteile

- höhere Komplexität im Backend
- zusätzliche Simulation erforderlich
- mehr Markttransaktionen

Diese Nachteile werden bewusst akzeptiert.

---

# Alternative

Ein einzelner globaler Markt wurde verworfen.

Gründe:

- instabile Wirtschaft
- starke Preisschwankungen
- Dominanz einzelner Spieler
- schlechte Skalierbarkeit

---

# Leitsatz

> "Eine lebendige Wirtschaft benötigt Wettbewerb, Stabilität und langfristige Beziehungen."

Project Genesis trennt deshalb den Handel in einen freien Spielermarkt, eine stabilisierende NPC-Wirtschaft und einen Markt für langfristige Lieferverträge.
