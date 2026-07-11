Neue Architekturentscheidung (DD-017)

An dieser Stelle würde ich eine weitere wichtige Designentscheidung festhalten:

DD-017 – Ledger-Based Economy

Alle Kernsysteme der Wirtschaft basieren auf einem gemeinsamen Architekturprinzip:

| Domäne     | Aktueller Zustand | Historie (Ledger)            |
| ---------- | ----------------- | ---------------------------- |
| Inventory  | Inventory         | InventoryTransaction         |
| Finance    | Finance           | FinanceTransaction           |
| Production | ProductionJob     | ProductionEvent *(später)*   |
| Research   | Research          | ResearchProgress *(später)*  |
| Energy     | Energy            | EnergyTransaction *(später)* |

