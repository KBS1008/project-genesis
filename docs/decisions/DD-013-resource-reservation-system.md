DD-013 – Resource Reservation System

Beim Erstellen dieses Schemas ist mir noch eine wichtige Architekturentscheidung aufgefallen.

Ich würde Ressourcen bereits beim Start eines Produktionsauftrags reservieren, anstatt sie erst beim Abschluss zu verbrauchen.

Beispiel:

Lager: 100 Holz
Sägewerk A startet → reserviert 60 Holz
Sägewerk B möchte starten → sieht nur noch 40 Holz verfügbar

So verhindern wir Rennbedingungen und Inkonsistenzen, wenn mehrere Gebäude gleichzeitig auf dieselben Ressourcen zugreifen. Das ist ein bewährtes Prinzip aus ERP- und Lagerverwaltungssystemen und passt hervorragend zu unserer Event-Driven-Architektur.