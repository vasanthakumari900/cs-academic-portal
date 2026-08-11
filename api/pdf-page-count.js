// api/pdf-page-count.js (Vercel Serverless Function)
import path from "path";
import fs from "fs/promises";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id, url } = req.query || {};
  let targetUrl = "";

  if (id) {
    targetUrl = `https://drive.google.com/uc?export=download&id=${id}&confirm=t`;
  } else if (url) {
    targetUrl = decodeURIComponent(url);
  }

  if (!id && !targetUrl) {
    return res.status(400).json({ error: "Missing id or url parameter", success: false });
  }

  try {
    let uint8Array = null;

    if (targetUrl.startsWith("/") || targetUrl.startsWith(".")) {
      const cleanPath = targetUrl.replace(/^\/+/, "");
      const filePath = path.join(process.cwd(), "public", cleanPath);
      const fileBuffer = await fs.readFile(filePath);
      uint8Array = new Uint8Array(fileBuffer);
    } else {
      const fetchRes = await fetch(targetUrl);
      if (!fetchRes.ok) {
        return res.status(fetchRes.status).json({ error: `Fetch failed: ${fetchRes.statusText}`, success: false });
      }
      const arrayBuffer = await fetchRes.arrayBuffer();
      uint8Array = new Uint8Array(arrayBuffer);
    }

    const pdfjs = await import("pdfjs-dist/build/pdf.mjs");
    const loadingTask = pdfjs.getDocument({ data: uint8Array, disableFontFace: true });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    return res.status(200).json({
      numPages: typeof numPages === "number" && numPages > 0 ? numPages : null,
      id: id || null,
      success: true,
    });
  } catch (err) {
    console.error("[PDF Page Count API Error]:", err);
    return res.status(500).json({ error: err.message, numPages: null, success: false });
  }
}
