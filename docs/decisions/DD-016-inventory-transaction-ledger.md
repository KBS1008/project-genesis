Neue Architekturidee (DD-016)

Beim Erstellen des Inventars ist mir eine weitere wichtige Entscheidung aufgefallen.

Ich würde das Lager niemals direkt verändern.

Stattdessen erfolgt jede Änderung ausschließlich über Inventory Transactions.

Beispiele:

+500 Holz (Produktion abgeschlossen)

-120 Holz (Produktion gestartet)

+300 Stahl (Marktkauf)

-50 Bretter (Verkauf)

+20 Kohle (Transport angekommen)

Der aktuelle Lagerbestand ergibt sich dann aus diesen Transaktionen (ggf. mit regelmäßig aktualisierten Summen für die Performance).

Vorteile:

Vollständige Nachvollziehbarkeit aller Lagerbewegungen.
Einfaches Debugging.
Unterstützung für Berichte und Statistiken.
Gute Grundlage für eine spätere Buchhaltung.
Konsistent mit unserer Hybrid Event Architecture (DD-012).