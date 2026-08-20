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

export default defineConfig({
  plugins: [react(), pdfPageCountPlugin()],
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
