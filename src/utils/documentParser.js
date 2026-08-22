// src/utils/documentParser.js
// Optimized Client-Side Document Parsing Engine with Concurrent Batch Extraction & Non-blocking UI Yielding.

/**
 * Fast Concurrent PDF Parsing Engine with UI Thread Yielding
 */
export async function parsePdfDocument(file, onProgress) {
  try {
    const { pdfjs } = await import("react-pdf");
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({
      data: arrayBuffer,
      disableFontFace: true,
      ignoreErrors: true,
    }).promise;

    const numPages = pdf.numPages;
    const pages = new Array(numPages);
    const BATCH_SIZE = 5;

    for (let i = 1; i <= numPages; i += BATCH_SIZE) {
      const batchIndices = [];
      for (let j = i; j < Math.min(i + BATCH_SIZE, numPages + 1); j++) {
        batchIndices.push(j);
      }

      await Promise.all(
        batchIndices.map(async (pageNum) => {
          try {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent({ disableCombineTextItems: false });
            const pageText = textContent.items
              .map((item) => item.str)
              .join(" ")
              .replace(/\s+/g, " ");

            pages[pageNum - 1] = {
              pageNumber: pageNum,
              text: pageText.trim(),
            };
          } catch {
            pages[pageNum - 1] = { pageNumber: pageNum, text: "" };
          }
        })
      );

      if (onProgress) {
        onProgress(Math.min(i + BATCH_SIZE - 1, numPages), numPages);
      }

      // Non-blocking UI thread yield for 60fps smooth animation
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    const filteredPages = pages.filter((p) => p && p.text.length > 0);
    return filteredPages.length > 0 ? filteredPages : [{ pageNumber: 1, text: "Document content parsed." }];
  } catch (err) {
    console.error("PDF Parsing Error:", err);
    throw new Error("Failed to parse PDF file. Ensure the file is not corrupted or password protected.");
  }
}

/**
 * Parse plain text or Markdown document
 */
export async function parseTxtDocument(file) {
  const text = await file.text();
  const lines = text.split("\n");
  const chunkSize = 1500;
  const pages = [];
  let currentChunk = "";
  let pageNum = 1;

  lines.forEach((line) => {
    currentChunk += line + "\n";
    if (currentChunk.length >= chunkSize) {
      pages.push({
        pageNumber: pageNum++,
        text: currentChunk.trim(),
      });
      currentChunk = "";
    }
  });

  if (currentChunk.trim()) {
    pages.push({
      pageNumber: pageNum,
      text: currentChunk.trim(),
    });
  }

  return pages.length > 0 ? pages : [{ pageNumber: 1, text: text.trim() || "Empty text document." }];
}

/**
 * Fast Main Document Parser Entry Point
 */
export async function parseUploadedDocument(file, onProgress) {
  const ext = file.name.split(".").pop().toLowerCase();
  let pages = [];

  if (ext === "pdf") {
    pages = await parsePdfDocument(file, onProgress);
  } else {
    pages = await parseTxtDocument(file);
  }

  const fullText = pages.map((p) => p.text).join(" ");
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;
  const summary = generateDocumentSummary(file.name, pages, wordCount);

  return {
    fileName: file.name,
    fileType: ext.toUpperCase(),
    totalPages: pages.length,
    wordCount,
    pages,
    fullText,
    summary,
  };
}

/**
 * Quick summary generator
 */
function generateDocumentSummary(fileName, pages, wordCount) {
  const firstPageText = pages[0]?.text || "";
  const previewText = firstPageText.slice(0, 280);

  return {
    title: fileName,
    pageCount: pages.length,
    wordCount,
    excerpt: previewText ? `"...${previewText}..."` : "Document parsed successfully.",
  };
}
