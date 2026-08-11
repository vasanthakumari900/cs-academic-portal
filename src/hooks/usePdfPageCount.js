// src/hooks/usePdfPageCount.js
import { useState, useEffect } from "react";
import { extractDriveFileId, getDirectDownloadUrl } from "../utils/downloadUtils";

// In-memory cache map for fast lookups across component renders
const memoryCache = new Map();

// Helper for sessionStorage cache
function getSessionCachedCount(key) {
  if (typeof window === "undefined" || !key) return undefined;
  try {
    const val = sessionStorage.getItem(`pdf_pages_${key}`);
    if (val !== null) {
      const num = parseInt(val, 10);
      return isNaN(num) ? null : num;
    }
  } catch {
    // sessionStorage unavailable
  }
  return undefined;
}

function setSessionCachedCount(key, val) {
  if (typeof window === "undefined" || !key) return;
  try {
    sessionStorage.setItem(`pdf_pages_${key}`, val === null ? "null" : String(val));
  } catch {
    // sessionStorage write error ignored
  }
}

// Queue for batching server requests to prevent network congestion
const pendingQueue = [];
let activeServerRequests = 0;
const MAX_CONCURRENT = 5;

function drainQueue() {
  if (activeServerRequests >= MAX_CONCURRENT || pendingQueue.length === 0) return;
  const task = pendingQueue.shift();
  activeServerRequests++;
  task().finally(() => {
    activeServerRequests--;
    drainQueue();
  });
}

function enqueueRequest(fn) {
  return new Promise((resolve, reject) => {
    pendingQueue.push(() => fn().then(resolve).catch(reject));
    drainQueue();
  });
}

async function fetchNumPagesFromServer(fileId, targetUrl) {
  let endpoint = "/api/pdf-page-count";
  if (fileId) {
    endpoint += `?id=${encodeURIComponent(fileId)}`;
  } else if (targetUrl) {
    endpoint += `?url=${encodeURIComponent(targetUrl)}`;
  } else {
    return null;
  }

  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      console.warn(`[usePdfPageCount] Server API error for ${fileId || targetUrl}: ${res.status} ${res.statusText}`);
      return null;
    }
    const data = await res.json();
    if (data && typeof data.numPages === "number" && data.numPages > 0) {
      return data.numPages;
    }
    if (data && data.error) {
      console.warn(`[usePdfPageCount] Server PDF parse message:`, data.error);
    }
    return null;
  } catch (err) {
    console.error(`[usePdfPageCount] Network error calling /api/pdf-page-count:`, err);
    return null;
  }
}

/**
 * Reusable React Hook to get exact PDF page count from server endpoint.
 */
export function usePdfPageCount(fileInput) {
  let fileId = null;
  let targetUrl = "";

  if (fileInput) {
    if (typeof fileInput === "string") {
      fileId = extractDriveFileId(fileInput);
      targetUrl = getDirectDownloadUrl(fileInput);
    } else if (typeof fileInput === "object") {
      const rawFileUrl = fileInput.fileUrl || fileInput.url || fileInput.link || "";
      if (rawFileUrl && (rawFileUrl.startsWith("/") || rawFileUrl.startsWith("."))) {
        targetUrl = rawFileUrl;
      } else {
        fileId = fileInput.driveFileId || fileInput.fileId || extractDriveFileId(rawFileUrl || fileInput.driveUrl || fileInput.id);
        targetUrl = getDirectDownloadUrl(rawFileUrl || fileInput.driveUrl || fileId || fileInput.id);
      }
    }
  }

  const cacheKey = fileId || targetUrl || (typeof fileInput === "object" ? fileInput.id || fileInput.title : String(fileInput));

  const [state, setState] = useState(() => {
    if (!cacheKey || cacheKey === "undefined" || (!targetUrl && !fileId)) {
      return { text: "Page count unavailable", loading: false, pageCount: null, error: true };
    }

    if (memoryCache.has(cacheKey)) {
      const cached = memoryCache.get(cacheKey);
      if (typeof cached === "number") {
        return { text: cached === 1 ? "1 page" : `${cached} pages`, loading: false, pageCount: cached, error: false };
      } else {
        return { text: "Page count unavailable", loading: false, pageCount: null, error: true };
      }
    }

    const sessionVal = getSessionCachedCount(cacheKey);
    if (sessionVal !== undefined) {
      memoryCache.set(cacheKey, sessionVal);
      if (typeof sessionVal === "number") {
        return { text: sessionVal === 1 ? "1 page" : `${sessionVal} pages`, loading: false, pageCount: sessionVal, error: false };
      } else {
        return { text: "Page count unavailable", loading: false, pageCount: null, error: true };
      }
    }

    return { text: "Checking pages...", loading: true, pageCount: null, error: false };
  });

  useEffect(() => {
    if (!cacheKey || cacheKey === "undefined" || (!targetUrl && !fileId)) {
      setState({ text: "Page count unavailable", loading: false, pageCount: null, error: true });
      return;
    }

    if (memoryCache.has(cacheKey)) {
      const cached = memoryCache.get(cacheKey);
      if (typeof cached === "number") {
        setState({ text: cached === 1 ? "1 page" : `${cached} pages`, loading: false, pageCount: cached, error: false });
      } else {
        setState({ text: "Page count unavailable", loading: false, pageCount: null, error: true });
      }
      return;
    }

    const sessionVal = getSessionCachedCount(cacheKey);
    if (sessionVal !== undefined) {
      memoryCache.set(cacheKey, sessionVal);
      if (typeof sessionVal === "number") {
        setState({ text: sessionVal === 1 ? "1 page" : `${sessionVal} pages`, loading: false, pageCount: sessionVal, error: false });
      } else {
        setState({ text: "Page count unavailable", loading: false, pageCount: null, error: true });
      }
      return;
    }

    let isMounted = true;
    setState({ text: "Checking pages...", loading: true, pageCount: null, error: false });

    enqueueRequest(() => fetchNumPagesFromServer(fileId, targetUrl))
      .then((count) => {
        memoryCache.set(cacheKey, count);
        setSessionCachedCount(cacheKey, count);

        if (isMounted) {
          if (typeof count === "number") {
            setState({ text: count === 1 ? "1 page" : `${count} pages`, loading: false, pageCount: count, error: false });
          } else {
            setState({ text: "Page count unavailable", loading: false, pageCount: null, error: true });
          }
        }
      })
      .catch((err) => {
        console.error(`[usePdfPageCount] Error fetching page count for ${cacheKey}:`, err);
        memoryCache.set(cacheKey, null);
        setSessionCachedCount(cacheKey, null);
        if (isMounted) {
          setState({ text: "Page count unavailable", loading: false, pageCount: null, error: true });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [cacheKey, targetUrl, fileId]);

  return state;
}
