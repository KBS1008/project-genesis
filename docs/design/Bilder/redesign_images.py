import os
import cv2
from PIL import Image
import pytesseract

# Pfad zu Ihren 100 Grid-Bildern und Zielordner
INPUT_DIR = "./grid_bilder"
OUTPUT_DIR = "./einzelne_bilder"

os.makedirs(OUTPUT_DIR, exist_ok=True)

for filename in os.listdir(INPUT_DIR):
    if filename.endswith((".png", ".jpg", ".jpeg")):
        img_path = os.path.join(INPUT_DIR, filename)
        img = Image.open(img_path)
        width, height = img.size

        # Beispiel: Wenn die 5 Bilder nebeneinander in einer Reihe liegen
        slice_width = width // 5

        for i in range(5):
            # 1. Bildbereich zuschneiden (x1, y1, x2, y2)
            left = i * slice_width
            right = (i + 1) * slice_width

            # Motiv zuschneiden (oberer Bereich)
            crop_img = img.crop((left, 0, right, int(height * 0.85)))

            # Textbereich unter dem Bild zuschneiden (unterer Bereich)
            label_crop = img.crop((left, int(height * 0.85), right, height))

            # 2. Text per OCR auslesen
            text = pytesseract.image_to_string(label_crop, config="--psm 6").strip()

            # Dateinamen bereinigen (Sonderzeichen entfernen)
            clean_name = "".join(
                c for c in text if c.isalnum() or c in (" ", "_", "-")
            ).strip()

            if not clean_name:
                clean_name = f"bild_{i+1}"

            # 3. Speichern
            crop_img.save(os.path.join(OUTPUT_DIR, f"{clean_name}.png"))

print("Fertig! Alle 500 Bilder wurden zugeschnitten und benannt.")
