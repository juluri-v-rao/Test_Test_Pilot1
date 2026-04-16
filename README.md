# Excel Translator

A small browser app that uploads an `.xlsx` workbook, translates Japanese cell text to English with the OpenAI API, and exports a translated `.xlsx` while keeping the workbook structure intact.

## Run

Open `index.html` directly in your browser, then use the link to open the dedicated translator page.

For the smoothest experience, publish the branch with GitHub Pages or use any static host. The translator page also works as a local file if the browser can load the remote library script.

## Files

- `index.html`: landing page with link to the translator
- `translator.html`: dedicated workbook translator page
- `styles.css`: minimal page styling
- `src/main.js`: workbook parsing, translation workflow, and export logic

## How To Use

1. Open `index.html`.
2. Click `Open translator page`.
3. Paste an OpenAI API key.
4. Choose an `.xlsx` file.
5. Leave the translation route as `Japanese -> English`.
6. Click `Translate workbook`.
7. When processing finishes, click `Download translated file`.

## Notes

- The app translates only string cells that contain Japanese characters.
- It skips formulas, numbers, booleans, and empty cells.
- Workbook layout, sheet order, merged cells, and most formatting are preserved by editing the uploaded workbook in place before export.
- The API key is entered client-side and sent directly to OpenAI, so this version is best for internal or personal use.

## Manual Verification

- Upload a workbook with Japanese text, formulas, numbers, and empty cells.
- Confirm only Japanese text cells are translated.
- Confirm formulas and non-text cells are unchanged.
- Confirm sheet order and workbook styling remain intact after download.
- Confirm the downloaded file opens in Excel with the same worksheet structure.
