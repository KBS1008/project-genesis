"""
Splittet ein Bild mit 5 nebeneinander angeordneten Grafiken (inkl. Namensbeschriftung
unter jedem Bild) in einzelne Dateien und benennt sie automatisch nach dem erkannten Text.

Voraussetzungen:
    pip install pillow pytesseract
    Tesseract-OCR muss installiert sein (z.B. "sudo apt install tesseract-ocr"
    unter Linux, oder https://github.com/UB-Mannheim/tesseract/wiki unter Windows).
    Für deutschen Text ggf. zusätzlich das deutsche Sprachpaket installieren:
        sudo apt install tesseract-ocr-deu

Nutzung:
    python bilder_splitten.py eingabe.png ausgabe_ordner
"""

import shutil
import sys
import re
from pathlib import Path

from PIL import Image
import pytesseract

_WINDOWS_TESSERACT_PFADE = (
    Path(r"C:\Program Files\Tesseract-OCR\tesseract.exe"),
    Path(r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe"),
)


def tesseract_konfigurieren() -> None:
    """Setzt den Tesseract-Pfad unter Windows, falls er nicht im PATH liegt."""
    if shutil.which("tesseract"):
        return

    for pfad in _WINDOWS_TESSERACT_PFADE:
        if pfad.is_file():
            pytesseract.pytesseract.tesseract_cmd = str(pfad)
            return

    raise FileNotFoundError(
        "Tesseract nicht gefunden. Bitte installieren oder zum PATH hinzufügen: "
        "https://github.com/UB-Mannheim/tesseract/wiki"
    )


def verfuegbare_sprache(gewuenscht: str) -> str:
    """Nutzt gewünschte Sprache, fällt bei fehlenden Paketen auf eng zurück."""
    verfuegbar = set(pytesseract.get_languages())

    if gewuenscht in verfuegbar:
        return gewuenscht

    if "+" in gewuenscht and all(teil in verfuegbar for teil in gewuenscht.split("+")):
        return gewuenscht

    if "eng" in verfuegbar:
        print(f"Hinweis: Sprachpaket '{gewuenscht}' nicht installiert, nutze 'eng'.")
        return "eng"

    raise RuntimeError(
        f"Kein passendes Tesseract-Sprachpaket für '{gewuenscht}' gefunden. "
        f"Verfügbar: {', '.join(sorted(verfuegbar))}"
    )


def sichere_dateiname(name: str) -> str:
    """Entfernt Zeichen, die in Dateinamen problematisch sind."""
    name = name.strip()
    name = re.sub(r"[^\w\-äöüÄÖÜß ]", "", name)
    name = re.sub(r"\s+", "_", name)
    return name or "unbenannt"


def bilder_splitten(
    eingabe_pfad: str,
    ausgabe_ordner: str,
    anzahl_bilder: int = 5,
    text_hoehe_anteil: float = 0.12,
    sprache: str = "deu",
):
    """
    anzahl_bilder:       Anzahl der nebeneinander liegenden Kacheln (Standard: 5)
    text_hoehe_anteil:   Anteil der Kachelhöhe, der für den Namenstext unten reserviert ist.
                         0.12 = unterste 12% jeder Kachel werden als Textbereich behandelt.
                         Falls die Namen falsch/gar nicht erkannt werden, diesen Wert anpassen.
    sprache:             Tesseract-Sprachcode, z.B. "deu" für Deutsch, "eng" für Englisch.
                         Bei Unsicherheit "deu+eng" verwenden.
    """
    tesseract_konfigurieren()
    sprache = verfuegbare_sprache(sprache)

    eingabe_pfad = Path(eingabe_pfad)
    ausgabe_ordner = Path(ausgabe_ordner)
    ausgabe_ordner.mkdir(parents=True, exist_ok=True)

    bild = Image.open(eingabe_pfad)
    breite, hoehe = bild.size

    kachel_breite = breite // anzahl_bilder

    for i in range(anzahl_bilder):
        left = i * kachel_breite
        right = breite if i == anzahl_bilder - 1 else (i + 1) * kachel_breite

        kachel = bild.crop((left, 0, right, hoehe))

        # Textbereich (unterer Streifen der Kachel) für OCR ausschneiden
        text_top = int(hoehe * (1 - text_hoehe_anteil))
        text_bereich = bild.crop((left, text_top, right, hoehe))

        roher_text = pytesseract.image_to_string(text_bereich, lang=sprache)
        name = sichere_dateiname(roher_text.splitlines()[0] if roher_text.strip() else f"bild_{i+1}")

        # Falls das reine Bild ohne Textstreifen gewünscht ist, hier abschneiden:
        nur_bild = bild.crop((left, 0, right, text_top))

        ziel_pfad = ausgabe_ordner / f"{name}.png"
        # Falls Name schon existiert, Nummer anhängen statt zu überschreiben
        zaehler = 2
        while ziel_pfad.exists():
            ziel_pfad = ausgabe_ordner / f"{name}_{zaehler}.png"
            zaehler += 1

        nur_bild.save(ziel_pfad)
        print(f"Gespeichert: {ziel_pfad}  (erkannter Text: {roher_text.strip()!r})")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Nutzung: python bilder_splitten.py eingabe.png ausgabe_ordner")
        sys.exit(1)

    bilder_splitten(sys.argv[1], sys.argv[2])
