// src/utils/ocrService.js
// Client-side OCR engine for scanned marksheets (PDFs without a text layer, and image files).
// Uses pdf.js to rasterize PDF pages, then Tesseract.js to recognize text.

import { pdfjs } from "react-pdf";

// pdf.js worker config (same CDN approach used across the app)
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const OCR_SCALE = 3.5; // render scale for better OCR accuracy on small marksheet header text

/**
 * Preprocess a canvas for OCR: grayscale + contrast boost. Tesseract reads
 * high-contrast, flat-light images far more reliably than raw scans.
 * Optionally upscales (photos benefit; PDF-rendered pages are already high-res).
 */
function preprocessCanvasForOcr(sourceCanvas, upscaleFactor = 1) {
  const out = document.createElement("canvas");
  out.width = Math.round(sourceCanvas.width * upscaleFactor);
  out.height = Math.round(sourceCanvas.height * upscaleFactor);
  const ctx = out.getContext("2d");
  ctx.filter = "grayscale(1) contrast(1.5) brightness(1.05)";
  ctx.drawImage(sourceCanvas, 0, 0, out.width, out.height);
  return out;
}

/**
 * Preprocess an uploaded image file (photo marksheet) before OCR: grayscale + contrast
 * boost and upscaling so small header text (register number / name) becomes legible.
 * Photos skip the PDF render pipeline, so without this they'd be OCR'd raw.
 */
async function preprocessImageFile(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    const maxDim = 2400;
    const scale = Math.min(4, Math.max(1, maxDim / Math.max(img.width, img.height)));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    ctx.filter = "grayscale(1) contrast(1.4) brightness(1.05)";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Render every page of a PDF to an image data URL (canvas).
 * Returns an array of { pageNumber, dataUrl }.
 */
export async function renderPdfPagesToImages(file, onPageRendered) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({
    data: arrayBuffer,
    disableFontFace: true,
    ignoreErrors: true,
  }).promise;

  const numPages = pdf.numPages;
  const images = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: OCR_SCALE });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    await page.render({ canvasContext: ctx, viewport }).promise;

    // Preprocess for OCR readability, then capture
    const processed = preprocessCanvasForOcr(canvas);
    images.push({
      pageNumber: pageNum,
      dataUrl: processed.toDataURL("image/png"),
    });

    // Free canvas memory
    canvas.width = 0;
    canvas.height = 0;
    processed.width = 0;
    processed.height = 0;

    if (onPageRendered) onPageRendered(pageNum, numPages);
  }

  return images;
}

/**
 * Run Tesseract.js OCR on an image (data URL, blob, or File).
 * Returns recognized text. Throws on failure.
 */
export async function runOcrOnImage(imageInput, onProgress) {
  // Dynamic import so the heavy OCR bundle only loads when actually needed
  const Tesseract = await import("tesseract.js");
  const { createWorker } = Tesseract;

  // Photos (File/Blob) get preprocessed + upscaled for OCR readability; data URLs from
  // renderPdfPagesToImages are already preprocessed, so they pass through untouched.
  let input = imageInput;
  const isDataUrl = typeof imageInput === "string" && imageInput.startsWith("data:image");
  if (!isDataUrl && imageInput && typeof imageInput === "object") {
    try {
      input = await preprocessImageFile(imageInput);
    } catch (err) {
      console.warn("Image OCR preprocessing failed; using original image.", err);
    }
  }

  const worker = await createWorker("eng", 1, {
    logger: (m) => {
      if (onProgress && typeof m?.progress === "number") {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });

  try {
    const { data } = await worker.recognize(imageInput);
    return (data?.text || "").trim();
  } finally {
    await worker.terminate();
  }
}

/**
 * OCR a whole document: scanned PDFs get rasterized page-by-page; images get OCR'd directly.
 * Returns combined recognized text. Calls onProgress(percent) and onLog(message) during processing.
 */
export async function ocrDocument(file, { onProgress, onLog } = {}) {
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const isPdf = file.type.includes("pdf") || ext === "pdf";

  if (!isPdf) {
    if (onLog) onLog("🔍 Running OCR on image marksheet (this can take a few seconds)...");
    return runOcrOnImage(file, onProgress);
  }

  if (onLog) onLog("🔍 No text layer found — rasterizing scanned PDF pages for OCR...");
  const pageImages = await renderPdfPagesToImages(file, (pageNum, numPages) => {
    if (onLog) onLog(`🖼️ Rendered PDF page ${pageNum} of ${numPages} for OCR.`);
  });

  const allText = [];
  for (let i = 0; i < pageImages.length; i++) {
    const { pageNumber, dataUrl } = pageImages[i];
    if (onLog) onLog(`🔎 OCR reading page ${pageNumber}...`);
    const pageText = await runOcrOnImage(dataUrl, onProgress);
    if (onLog && pageText) onLog(`📄 Page ${pageNumber} OCR produced ${pageText.length} characters.`);
    allText.push(pageText);
  }

  return allText.join("\n").trim();
}
