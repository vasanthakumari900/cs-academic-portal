// api/pdf-proxy.js (Vercel Serverless Function Proxy with SSRF Protection)
const ALLOWED_DOMAINS = [
  "drive.google.com",
  "docs.google.com",
  "googleusercontent.com",
  "firebasestorage.googleapis.com",
  "dgvc.in",
  "raw.githubusercontent.com",
];

function isAllowedUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    const hostname = parsed.hostname.toLowerCase();
    return ALLOWED_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith("." + domain)
    );
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id, url } = req.query || {};
  let targetUrl = "";

  if (id) {
    targetUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}&confirm=t`;
  } else if (url) {
    targetUrl = decodeURIComponent(url);
  }

  if (!targetUrl) {
    return res.status(400).json({ error: "Missing PDF id or url parameter" });
  }

  if (!isAllowedUrl(targetUrl)) {
    return res.status(403).json({ error: "Target domain is not allowed by proxy security policy" });
  }

  try {
    const googleRes = await fetch(targetUrl);
    if (!googleRes.ok) {
      return res.status(googleRes.status).send("Failed to fetch PDF resource");
    }

    const buffer = await googleRes.arrayBuffer();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
    return res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    console.error("PDF Proxy Error:", err);
    return res.status(500).json({ error: "PDF proxy error: " + err.message });
  }
}
