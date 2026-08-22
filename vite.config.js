import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs/promises";

function pdfPageCountPlugin() {
  return {
    name: "pdf-page-count-plugin",
    configureServer(server) {
      server.middlewares.use("/api/pdf-page-count", async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json");

        try {
          const reqUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
          const id = reqUrl.searchParams.get("id");
          const rawUrl = reqUrl.searchParams.get("url");

          let targetUrl = "";
          if (id) {
            targetUrl = `https://drive.google.com/uc?export=download&id=${id}&confirm=t`;
          } else if (rawUrl) {
            targetUrl = decodeURIComponent(rawUrl);
          }

          if (!id && !targetUrl) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Missing id or url parameter", success: false }));
            return;
          }

          let uint8Array = null;

          if (targetUrl.startsWith("/") || targetUrl.startsWith(".")) {
            const cleanPath = targetUrl.replace(/^\/+/, "");
            const filePath = path.join(process.cwd(), "public", cleanPath);
            const fileBuffer = await fs.readFile(filePath);
            uint8Array = new Uint8Array(fileBuffer);
          } else {
            const fetchRes = await fetch(targetUrl);
            if (!fetchRes.ok) {
              res.statusCode = fetchRes.status;
              res.end(JSON.stringify({ error: `Fetch failed: ${fetchRes.statusText}`, success: false }));
              return;
            }
            const arrayBuffer = await fetchRes.arrayBuffer();
            uint8Array = new Uint8Array(arrayBuffer);
          }

          const pdfjs = await import("pdfjs-dist/build/pdf.mjs");
          const loadingTask = pdfjs.getDocument({ data: uint8Array, disableFontFace: true });
          const pdf = await loadingTask.promise;
          const numPages = pdf.numPages;

          res.statusCode = 200;
          res.end(
            JSON.stringify({
              numPages: typeof numPages === "number" && numPages > 0 ? numPages : null,
              id: id || null,
              success: true,
            })
          );
        } catch (err) {
          console.error("[Local PDF Page Count Error]:", err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message, numPages: null, success: false }));
        }
      });
    },
  };
}

function groqApiPlugin() {
  return {
    name: "groq-api-plugin",
    configureServer(server) {
      server.middlewares.use("/api/groq", async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
          res.statusCode = 200;
          res.end();
          return;
        }

        const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
        if (!apiKey) {
          res.statusCode = 533;
          res.end(JSON.stringify({ error: "Groq API key missing on server", success: false }));
          return;
        }

        try {
          let bodyStr = "";
          req.on("data", (chunk) => { bodyStr += chunk; });
          req.on("end", async () => {
            try {
              const payload = JSON.parse(bodyStr || "{}");
              const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify(payload),
              });
              const data = await groqRes.json().catch(() => ({}));
              res.statusCode = groqRes.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(groqRes.ok ? { success: true, data } : { error: data?.error?.message || groqRes.statusText, success: false }));
            } catch (e) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: e.message, success: false }));
            }
          });
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: err.message, success: false }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), pdfPageCountPlugin(), groqApiPlugin()],
  server: {
    port: 5173,
    watch: {
      ignored: ["**/*.pdf", "**/sem 1 english/**", "**/website-tour/**"],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-pdf") || id.includes("pdfjs-dist")) {
              return "vendor-pdf";
            }
            if (id.includes("jspdf") || id.includes("html2canvas")) {
              return "vendor-jspdf";
            }
            if (id.includes("tesseract.js")) {
              return "vendor-ocr";
            }
            if (id.includes("recharts")) {
              return "vendor-charts";
            }
            if (id.includes("firebase")) {
              return "vendor-firebase";
            }
            if (id.includes("framer-motion") || id.includes("react-icons")) {
              return "vendor-ui";
            }
          }
        },
      },
    },
  },
});
