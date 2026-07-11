DD-015 – Static Definitions vs. Dynamic State

Mit diesem Dokument sollten wir eine weitere Architekturregel festschreiben, die sich durch das gesamte Projekt zieht.

Wir trennen konsequent zwischen statischen Definitionen und dynamischem Spielzustand:

Statische Definition	Dynamischer Zustand
ResourceType	InventoryItem
BuildingType	Building
Recipe	ProductionJob
ResearchType	ResearchProgress
EmployeeType	Employee
ContractType	Contract
VehicleType	Vehicle

Diese Trennung ist extrem wertvoll:

Definitionen ändern sich selten und können versioniert werden.
Instanzen enthalten ausschließlich spielerspezifische Daten.
Daten werden nicht doppelt gespeichert.
Mehrsprachigkeit wird einfacher.
Balancing erfolgt zentral an den Definitionen.

Ich würde daraus die nächste Designentscheidung DD-015-static-definitions-vs-dynamic-state.md machen und diese Regel für das gesamte Projekt verbindlich festschreiben. Sie wird uns später bei Datenbankdesign, API und Implementierung sehr viel Konsistenz bringen.