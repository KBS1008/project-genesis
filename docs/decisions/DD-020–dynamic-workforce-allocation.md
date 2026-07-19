# DD-020 – Dynamic Workforce Allocation

Status: Accepted

Version: 1.0

Datum: 2026-07-02

---

# Kontext

Viele Wirtschaftsspiele arbeiten mit einer festen Anzahl an Mitarbeitenden pro Gebäude.

Beispiel:

- Sägewerk benötigt 10 Mitarbeiter.
- Sind 10 vorhanden, arbeitet das Gebäude mit 100 %.
- Fehlt ein Mitarbeiter, funktioniert das Gebäude nur eingeschränkt oder gar nicht.

Dieses Modell ist zwar einfach, bietet aber wenig strategische Tiefe und führt häufig zu einer "Alles-oder-Nichts"-Mechanik.

Project Genesis soll stattdessen ein flexibleres und realistischeres Personalsystem erhalten.

---

# Entscheidung

Jedes Gebäude besitzt einen definierten **Personalbedarf**.

Dem Gebäude können Mitarbeitende zugewiesen werden.

Die tatsächliche Leistung ergibt sich aus dem Verhältnis zwischen benötigtem und zugewiesenem Personal.

Die Formel lautet:

```text
Auslastung = Zugewiesene Mitarbeitende / Benötigte Mitarbeitende
```

Die Auslastung beeinflusst unmittelbar die Effizienz des Gebäudes.

---

# Beispiel

| Gebäude   | Bedarf | Zugewiesen | Auslastung |          Effizienz |
| --------- | -----: | ---------: | ---------: | -----------------: |
| Sägewerk  |     10 |         10 |      100 % |              100 % |
| Stahlwerk |     20 |         15 |       75 % |               75 % |
| Labor     |      8 |         10 |      125 % | 110 % (Obergrenze) |

Eine Überbesetzung kann Vorteile bringen, ist jedoch durch eine maximale Effizienz begrenzt.

---

# Effizienzgrenzen

Version 1

```text
0 % Personal = Gebäude inaktiv

50 % Personal = stark reduzierte Produktion

100 % Personal = optimale Produktion

>100 % Personal = maximal 110 % Effizienz
```

Diese Obergrenze verhindert unrealistische Skalierungen.

---

# Vorteile

## Strategische Personalplanung

Spieler entscheiden bewusst, welche Unternehmensbereiche priorisiert werden.

---

## Flexibilität

Personal kann kurzfristig zwischen Gebäuden umverteilt werden.

Beispiel:

```text
Mehr Mitarbeitende

↓

Forschung

↓

Schnellere Technologie

↓

Danach zurück in die Produktion
```

---

## Unternehmenswachstum

Mit jedem neuen Gebäude steigt automatisch der Personalbedarf.

Dadurch entsteht eine natürliche Wachstumsgrenze.

---

## Wirtschaftliche Entscheidungen

Spieler müssen abwägen:

- mehr Mitarbeitende einstellen
- höhere Gehaltskosten akzeptieren
- Produktion reduzieren
- Forschung priorisieren

---

# Auswirkungen auf andere Systeme

## Produktion

Die Produktionsgeschwindigkeit hängt direkt von der Auslastung ab.

---

## Forschung

Mehr Forschende verkürzen Forschungszeiten.

---

## Energie

Unterbesetzte Kraftwerke erzeugen weniger Energie.

---

## Wartung

Ingenieure erhöhen die Wartungseffizienz.

---

## Finanzen

Mehr Personal erhöht die laufenden Personalkosten.

---

# Versionierung

## Version 1

- Mitarbeitergruppen
- Dynamische Personalzuweisung
- Auslastungsberechnung
- Maximale Effizienz von 110 %

---

## Version 2

- Schichtsystem
- Weiterbildung
- Spezialisten
- Automatische Personalplanung

---

## Version 3

- Motivation
- Fluktuation
- Fachkräftemangel
- Unternehmenskultur

---

# Konsequenzen

## Vorteile

✔ Mehr strategische Entscheidungen

✔ Natürliches Unternehmenswachstum

✔ Keine starre Gebäudegrenze

✔ Realistische Simulation

✔ Gute Erweiterbarkeit

---

## Nachteile

- Zusätzliche Berechnung pro Simulationstick
- Etwas komplexeres Balancing

Diese Nachteile werden bewusst akzeptiert.

---

# Alternative

Ein starres Mitarbeitersystem wurde verworfen.

Gründe:

- geringe strategische Tiefe
- unrealistische Personalplanung
- wenig Flexibilität
- schlechtere Skalierbarkeit

---

# Implementierungshinweise

Die Personalzuweisung erfolgt auf Gebäudeebene.

Jedes Gebäude speichert:

- Personalbedarf
- Zugewiesene Mitarbeitende
- Aktuelle Auslastung
- Berechnete Effizienz

Die Berechnung erfolgt innerhalb der Simulation und beeinflusst unmittelbar Produktion, Forschung und Energieversorgung.

---

# Leitsatz

> "Nicht die Anzahl der Mitarbeitenden entscheidet über den Erfolg, sondern ihr effizienter Einsatz."

Project Genesis behandelt Mitarbeitende als strategische Unternehmensressource. Flexible Personalplanung ermöglicht unterschiedliche Unternehmensstrategien und erhöht die langfristige Spieltiefe.
