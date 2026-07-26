Bibliothek
/
IMAGE_MOCKUP_EXTRACTION_WORKFLOW.md


IMAGE MOCKUP EXTRACTION WORKFLOW
Project: Project Genesis
Purpose: Binding workflow for generating, separating, naming, validating, and packaging UI mockups
Repository path: docs/design/IMAGE_MOCKUP_EXTRACTION_WORKFLOW.md
Status: Mandatory

1. Core Rule
Never assume that a generated image contains separate downloadable files.

Image generation may return a single montage or contact sheet.

When a montage is returned, every panel must be extracted and validated before a ZIP file is created.

Do not claim success before validation is complete.

2. Standard Output Structure
For Main Menu mockups:

docs/
└── design/
    └── mockups/
        └── main-menu/
            ├── MM-001_Main_Menu_v1.png
            ├── MM-001_Main_Menu_v2.png
            ├── MM-002_New_Game_Dialog_v1.png
            ├── MM-002_New_Game_Dialog_v2.png
            ├── MM-002_New_Game_Dialog_v3.png
            ├── MM-002_New_Game_Dialog_v4.png
            └── MM-002_New_Game_Dialog_v5.png
ZIP archives must preserve the target subfolder:

main-menu/
├── MM-002_New_Game_Dialog_v1.png
├── MM-002_New_Game_Dialog_v2.png
├── MM-002_New_Game_Dialog_v3.png
├── MM-002_New_Game_Dialog_v4.png
└── MM-002_New_Game_Dialog_v5.png
3. Required Workflow
Step 1 — Locate the exact source image
Use the actual generated PNG file.

Do not use:

a previous montage

a similarly named image

the newest PNG without verifying it

a ZIP that may already contain incorrect crops

Record:

source filename

width

height

expected number of panels

Step 2 — Inspect the montage visually
Before cropping:

open the source image

identify every panel boundary

identify white gutters

identify captions below panels

identify outer margins

identify shadows or borders belonging to the panel

Do not estimate the layout from percentages alone.

Do not assume equal panel sizes unless the image visibly confirms it.

Step 3 — Determine exact crop bounds
For every panel, record:

filename
left
top
right
bottom
expected aspect ratio
Crop bounds must include the complete UI screen and exclude:

neighboring panels

captions

white background

unrelated borders

empty black areas

Step 4 — Extract each panel
Each file must contain one complete, meaningful screen.

Never output:

partial menus

isolated corners

empty dark panels

fragments without context

cropped-off buttons

cropped-off titles

Step 5 — Validate every extracted image
This step is mandatory.

Open every cropped PNG and verify:

the complete screen is visible

the title is visible

the primary content is visible

all important buttons are visible

no neighboring screen is included

no caption text is included

no white gutter remains

no large accidental black area exists

the image has a plausible aspect ratio

the image resolution is useful

Minimum validation checks:

width >= 450 px
height >= 350 px
For full-screen mockups, prefer a widescreen aspect ratio.

For dialogs, a more compact aspect ratio is acceptable.

Step 6 — Create a validation contact sheet
Before packaging, create a temporary contact sheet showing all extracted files with their filenames.

Inspect the contact sheet.

The contact sheet is for validation only and must not replace the individual files.

If any crop is incorrect, fix it before creating the ZIP archive.

Step 7 — Package the ZIP
Only after all individual files pass validation:

create the correct target folder inside the ZIP

add only validated files

use the final filenames exactly

do not include temporary contact sheets

do not include source montages

do not include duplicate files

Step 8 — Final response
Provide:

a direct link to the ZIP archive

the exact list of included files

no claim of success unless every crop was visually validated

4. Naming Rules
Format:

<AREA>-<NUMBER>_<DESCRIPTIVE_NAME>_v<VERSION>.png
Examples:

MM-001_Main_Menu_v1.png
MM-002_New_Game_Dialog_v1.png
MM-003_Load_Game_v1.png
MM-004_Settings_v1.png
Never rename different screens as versions of the same screen unless they are genuine design variations.

Example:

MM-002_New_Game_Dialog_v1.png and v2.png should be alternative versions of the same New Game dialog.

A Scenario Selection screen should receive its own descriptive asset ID if it is a different workflow screen.

5. Quality Gate
A ZIP archive must not be delivered when any of the following is true:

crop coordinates were guessed without visual inspection

any output is only a fragment

output dimensions are suspiciously small

panel captions remain visible

a panel is missing content

files were not opened after extraction

the wrong source image may have been used

Required final verdict:

VALIDATED — READY FOR DOWNLOAD
or:

VALIDATION FAILED — DO NOT DELIVER
6. Preferred Future Strategy
Preferred order:

Generate one screen per image.

If the generator still returns a montage, use the extraction workflow above.

Validate every result.

Package only after validation.

Never rely on the generator to create multiple independently named files in one generation.

7. Assistant Instruction
For every future Project Genesis image request:

follow this document automatically

treat visual validation as mandatory

never reuse previous crop coordinates without checking the current source

never state that extraction succeeded until every output has been opened and inspected

preserve the repository naming and folder conventions