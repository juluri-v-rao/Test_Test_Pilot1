(function () {
  const BATCH_SIZE = 25;
  const JAPANESE_REGEX = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uff66-\uff9f]/;
  const OPENAI_URL = "https://api.openai.com/v1/responses";

  const form = document.getElementById("translator-form");
  const apiKeyInput = document.getElementById("api-key");
  const modelInput = document.getElementById("model");
  const fileInput = document.getElementById("workbook-file");
  const translateButton = document.getElementById("translate-button");
  const downloadButton = document.getElementById("download-button");
  const status = document.getElementById("status");
  const progressBar = document.getElementById("progress-bar");
  const sheetCount = document.getElementById("sheet-count");
  const cellCount = document.getElementById("cell-count");
  const translatedCount = document.getElementById("translated-count");

  let translatedBlob = null;
  let translatedFilename = "";

  form.addEventListener("submit", handleTranslate);
  downloadButton.addEventListener("click", handleDownload);

  function setBusy(isBusy) {
    translateButton.disabled = isBusy;
    fileInput.disabled = isBusy;
    apiKeyInput.disabled = isBusy;
    modelInput.disabled = isBusy;
  }

  function setStatus(message) {
    status.textContent = message;
  }

  function setProgress(percent) {
    progressBar.style.width = String(percent) + "%";
  }

  function setStats(sheetTotal, scannedCells, translatedCells) {
    sheetCount.textContent = String(sheetTotal);
    cellCount.textContent = String(scannedCells);
    translatedCount.textContent = String(translatedCells);
  }

  async function handleTranslate(event) {
    event.preventDefault();

    const apiKey = apiKeyInput.value.trim();
    const file = fileInput.files[0];

    translatedBlob = null;
    translatedFilename = "";
    downloadButton.disabled = true;

    if (!window.XlsxPopulate) {
      setStatus("Workbook library failed to load. Check your internet connection and refresh the page.");
      return;
    }

    if (!apiKey) {
      setStatus("Enter an OpenAI API key.");
      return;
    }

    if (!file) {
      setStatus("Choose an .xlsx file first.");
      return;
    }

    setBusy(true);
    setStatus("Opening workbook...");
    setProgress(5);
    setStats(0, 0, 0);

    try {
      const workbook = await window.XlsxPopulate.fromDataAsync(file);
      const cellJobs = collectTranslatableCells(workbook);

      setStats(workbook.sheets().length, cellJobs.scannedCells, cellJobs.jobs.length);

      if (!cellJobs.jobs.length) {
        setStatus("No Japanese text cells were found. The workbook is ready to download unchanged.");
        translatedBlob = await workbook.outputAsync();
        translatedFilename = buildOutputFilename(file.name);
        downloadButton.disabled = false;
        setProgress(100);
        return;
      }

      let completed = 0;
      const total = cellJobs.jobs.length;

      for (let start = 0; start < total; start += BATCH_SIZE) {
        const batch = cellJobs.jobs.slice(start, start + BATCH_SIZE);
        setStatus(
          "Translating cells " +
            String(start + 1) +
            "-" +
            String(Math.min(start + batch.length, total)) +
            " of " +
            String(total) +
            "..."
        );

        const translations = await translateBatch(apiKey, modelInput.value, batch);
        applyTranslations(batch, translations);
        completed += batch.length;

        setStats(workbook.sheets().length, cellJobs.scannedCells, completed);
        setProgress(10 + Math.round((completed / total) * 80));
      }

      setStatus("Preparing translated workbook...");
      translatedBlob = await workbook.outputAsync();
      translatedFilename = buildOutputFilename(file.name);
      downloadButton.disabled = false;
      setProgress(100);
      setStatus("Translation complete. Download the translated workbook.");
    } catch (error) {
      setStatus(getErrorMessage(error));
      setProgress(0);
    } finally {
      setBusy(false);
    }
  }

  function collectTranslatableCells(workbook) {
    const sheets = workbook.sheets();
    const jobs = [];
    let scannedCells = 0;

    for (let sheetIndex = 0; sheetIndex < sheets.length; sheetIndex += 1) {
      const sheet = sheets[sheetIndex];
      const usedRange = sheet.usedRange();

      if (!usedRange) {
        continue;
      }

      const startCell = usedRange.startCell();
      const endCell = usedRange.endCell();
      const startRow = startCell.rowNumber();
      const endRow = endCell.rowNumber();
      const startColumn = startCell.columnNumber();
      const endColumn = endCell.columnNumber();

      for (let row = startRow; row <= endRow; row += 1) {
        for (let column = startColumn; column <= endColumn; column += 1) {
          const cell = sheet.cell(row, column);
          scannedCells += 1;

          if (hasFormula(cell)) {
            continue;
          }

          const value = cell.value();

          if (typeof value !== "string") {
            continue;
          }

          if (!containsJapanese(value)) {
            continue;
          }

          jobs.push({
            id: "sheet" + String(sheetIndex + 1) + "-r" + String(row) + "-c" + String(column),
            cell: cell,
            text: value,
          });
        }
      }
    }

    return {
      jobs: jobs,
      scannedCells: scannedCells,
    };
  }

  function hasFormula(cell) {
    try {
      return Boolean(cell.formula());
    } catch (error) {
      return false;
    }
  }

  function containsJapanese(value) {
    return JAPANESE_REGEX.test(value);
  }

  async function translateBatch(apiKey, model, batch) {
    const payload = {
      model: model,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are translating Excel cell text from Japanese to English. " +
                "Return valid JSON only. Preserve line breaks, placeholder tokens, numbers, punctuation, list markers, and surrounding spacing when possible. " +
                "Do not explain anything. Do not omit any item.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify({
                task: "Translate from Japanese to English",
                output_format: {
                  translations: [
                    {
                      id: "string",
                      text: "string",
                    },
                  ],
                },
                items: batch.map((item) => {
                  return {
                    id: item.id,
                    text: item.text,
                  };
                }),
              }),
            },
          ],
        },
      ],
    };

    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await safeJson(response);
      throw new Error(getApiErrorMessage(response.status, errorBody));
    }

    const data = await response.json();
    const outputText = extractOutputText(data);
    const parsed = parseModelJson(outputText);

    if (!parsed.translations || !parsed.translations.length) {
      throw new Error("The model response did not include any translations.");
    }

    return parsed.translations;
  }

  function applyTranslations(batch, translations) {
    const translationMap = {};

    for (let index = 0; index < translations.length; index += 1) {
      const item = translations[index];
      if (item && typeof item.id === "string") {
        translationMap[item.id] = item.text;
      }
    }

    for (let index = 0; index < batch.length; index += 1) {
      const job = batch[index];
      const translatedText = translationMap[job.id];

      if (typeof translatedText !== "string") {
        throw new Error("A translated cell was missing from the model response.");
      }

      job.cell.value(translatedText);
    }
  }

  function extractOutputText(data) {
    if (typeof data.output_text === "string" && data.output_text) {
      return data.output_text;
    }

    if (!data.output || !data.output.length) {
      throw new Error("OpenAI returned an empty response.");
    }

    let text = "";

    for (let outputIndex = 0; outputIndex < data.output.length; outputIndex += 1) {
      const outputItem = data.output[outputIndex];
      const content = outputItem.content || [];

      for (let contentIndex = 0; contentIndex < content.length; contentIndex += 1) {
        const part = content[contentIndex];
        if (part.type === "output_text" && typeof part.text === "string") {
          text += part.text;
        }
      }
    }

    if (!text) {
      throw new Error("OpenAI did not return text output.");
    }

    return text;
  }

  function parseModelJson(text) {
    const normalized = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    return JSON.parse(normalized);
  }

  async function safeJson(response) {
    try {
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  function getApiErrorMessage(statusCode, errorBody) {
    if (errorBody && errorBody.error && errorBody.error.message) {
      return "OpenAI API error (" + String(statusCode) + "): " + errorBody.error.message;
    }

    return "OpenAI API request failed with status " + String(statusCode) + ".";
  }

  function buildOutputFilename(originalName) {
    const dotIndex = originalName.lastIndexOf(".");
    if (dotIndex === -1) {
      return originalName + "-translated-en.xlsx";
    }

    return originalName.slice(0, dotIndex) + "-translated-en.xlsx";
  }

  function handleDownload() {
    if (!translatedBlob) {
      return;
    }

    const blobUrl = window.URL.createObjectURL(translatedBlob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = translatedFilename || "translated-workbook.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  }

  function getErrorMessage(error) {
    if (error && error.message) {
      return error.message;
    }

    return "Something went wrong while translating the workbook.";
  }
})();
