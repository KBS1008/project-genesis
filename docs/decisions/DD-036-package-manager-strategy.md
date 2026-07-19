# DD-036 – Package Manager Strategy

Version: 1.0.0

Status: Accepted

Date: 2026-07-10

---

# Titel

Verwendung von **pnpm** als offizieller Package Manager für Project Genesis.

---

# Status

**Accepted**

Diese Entscheidung gilt für das gesamte Repository.

---

# Kontext

Project Genesis ist ein langfristig angelegtes Softwareprojekt mit folgenden Eigenschaften:

- TypeScript-basierte Entwicklung
- Clean Architecture
- Domain-Driven Design (DDD)
- Documentation First
- umfangreiche Projektstruktur
- zahlreiche Entwicklungswerkzeuge (TypeScript, ESLint, Prettier, Vitest usw.)
- mögliche zukünftige Erweiterung zu einem Monorepo

Für die Verwaltung von Abhängigkeiten wird ein moderner, performanter und reproduzierbarer Package Manager benötigt.

---

# Entscheidung

Project Genesis verwendet **pnpm** als offiziellen Package Manager.

Alle Entwickler, Build-Skripte und CI/CD-Pipelines verwenden ausschließlich `pnpm`.

Alternative Package Manager wie `npm`, `yarn` oder `bun` werden für dieses Repository nicht unterstützt.

---

# Begründung

## Performance

`pnpm` installiert Abhängigkeiten deutlich schneller als klassische Package Manager, da Pakete in einem globalen Content Store gespeichert und per Hardlinks eingebunden werden.

---

## Geringerer Speicherverbrauch

Gemeinsam genutzte Pakete werden nur einmal gespeichert.

Dies reduziert den Speicherbedarf insbesondere bei mehreren lokalen Projekten erheblich.

---

## Reproduzierbare Installationen

Durch den Lockfile-Mechanismus (`pnpm-lock.yaml`) erhalten alle Entwickler identische Abhängigkeitsversionen.

Dadurch werden Unterschiede zwischen Entwicklungsumgebungen minimiert.

---

## Strikte Abhängigkeitsauflösung

`pnpm` erzwingt eine saubere Trennung der Abhängigkeiten.

Fehlerhafte oder implizite Abhängigkeiten werden früh erkannt und können gezielt behoben werden.

Dies unterstützt die langfristige Wartbarkeit der Architektur.

---

## Zukunftssicherheit

`pnpm` eignet sich sowohl für kleine Projekte als auch für große Monorepos.

Sollte Project Genesis zukünftig zusätzliche Anwendungen oder Werkzeuge enthalten (z. B. Editor, Modding-Tools oder Server-Komponenten), kann die bestehende Infrastruktur ohne Wechsel des Package Managers erweitert werden.

---

# Konsequenzen

## Positiv

- Schnellere Installation von Abhängigkeiten
- Geringerer Speicherverbrauch
- Einheitliche Entwicklungsumgebung
- Reproduzierbare Builds
- Gute Unterstützung moderner TypeScript-Projekte
- Hervorragende Monorepo-Unterstützung

---

## Negativ

- Neue Entwickler müssen `pnpm` einmalig installieren oder über Corepack aktivieren.
- Einige ältere Tutorials beziehen sich ausschließlich auf `npm`.

Diese Nachteile werden als gering eingestuft.

---

# Installation

Empfohlene Aktivierung über Corepack:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

Alternativ:

```bash
npm install -g pnpm
```

---

# Auswirkungen auf das Repository

Folgende Dateien und Prozesse verwenden `pnpm`:

- `package.json`
- `README.md`
- `CONTRIBUTING.md`
- Build-Skripte
- Test-Skripte
- CI/CD-Pipelines
- Entwicklerdokumentation

---

# Verworfene Alternativen

## npm

Vorteile:

- Bestandteil von Node.js
- Sehr weit verbreitet

Nachteile:

- Höherer Speicherverbrauch
- Langsamere Installation
- Weniger effiziente Verwaltung gemeinsamer Abhängigkeiten

---

## Yarn

Vorteile:

- Gute Performance
- Große Verbreitung

Nachteile:

- Zusätzliche Komplexität
- Geringerer Mehrwert gegenüber `pnpm`

---

## Bun

Vorteile:

- Sehr hohe Geschwindigkeit
- Integrierte Laufzeitumgebung

Nachteile:

- Jüngeres Ökosystem
- Geringere Verbreitung
- Noch nicht primäre Zielplattform für Project Genesis

---

# Referenzen

- technology-stack.md
- README.md
- CONTRIBUTING.md
- DD-010 – Documentation First
- DD-027 – Event-Driven Simulation Architecture
- DD-029 – Dependency Injection
