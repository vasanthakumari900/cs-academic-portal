import { useState, useEffect } from "react";
import toast from "react-hot-toast";

/**
 * Extract Google Drive Folder ID from folder link.
 */
export function extractDriveFolderId(input) {
  if (!input) return null;
  const str = String(input).trim();
  if (str.includes("/folders/")) {
    const match = str.match(/\/folders\/([a-zA-Z0-9_-]{25,})/);
    return match ? match[1] : null;
  }
  return null;
}

/**
 * Extract Google Drive File ID from various link formats or raw ID string.
 */
export function extractDriveFileId(input) {
  if (!input) return null;
  const str = String(input).trim();
  if (str.includes("/folders/")) return null;
  if (/^[a-zA-Z0-9_-]{25,}$/.test(str)) {
    return str;
  }
  const match = str.match(
    /(?:file\/d\/|id=|\/d\/|document\/d\/|spreadsheets\/d\/|presentation\/d\/)([a-zA-Z0-9_-]{25,})/
  );
  return match ? match[1] : null;
}

/**
 * Converts any Google Drive URL or File ID into a direct PDF download URL.
 */
export function getDirectDownloadUrl(input) {
  if (!input) return "";
  const str = String(input).trim();
  const folderId = extractDriveFolderId(str);
  if (folderId) {
    return `https://drive.google.com/drive/folders/${folderId}`;
  }
  const fileId = extractDriveFileId(str);

  if (fileId) {
    if (str.includes("docs.google.com/document")) {
      return `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
    }
    if (str.includes("docs.google.com/presentation")) {
      return `https://docs.google.com/presentation/d/${fileId}/export/pdf`;
    }
    if (str.includes("docs.google.com/spreadsheets")) {
      return `https://docs.google.com/spreadsheets/d/${fileId}/export?format=pdf`;
    }
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return str;
}

/**
 * Converts Google Drive URL into an embed preview URL.
 */
export function getDriveEmbedUrl(input) {
  if (!input) return "";
  if (typeof input === "string" && input.startsWith("/")) return input;
  const folderId = extractDriveFolderId(input);
  if (folderId) {
    return `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
  }
  const fileId = extractDriveFileId(input);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return String(input);
}

/**
 * Converts Google Drive URL into a view URL.
 */
export function getDriveViewUrl(input) {
  if (!input) return "#";
  if (typeof input === "string" && input.startsWith("/")) return input;
  const folderId = extractDriveFolderId(input);
  if (folderId) {
    return `https://drive.google.com/drive/folders/${folderId}`;
  }
  const fileId = extractDriveFileId(input);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  }
  return String(input);
}

/**
 * Verify Google Drive link status - instantly resolves valid for all given PDF resources.
 */
export function verifyDriveLink(input) {
  return Promise.resolve({
    status: input ? "valid" : "unavailable",
    fileId: extractDriveFileId(input),
  });
}

/**
 * Custom React Hook for Drive link status - immediately ready ('valid')
 */
export function useDriveVerification(input) {
  const [status, setStatus] = useState("valid");
  useEffect(() => {
    setStatus(input ? "valid" : "unavailable");
  }, [input]);
  return status;
}

/**
 * Helper to check if current device is mobile (iOS / Android / Mobile Web)
 */
export function isMobileDevice() {
  if (typeof window === "undefined" || !navigator) return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768
  );
}

/**
 * Ensures a filename ends with .pdf format extension.
 */
export function ensurePdfExtension(name) {
  if (!name || typeof name !== "string") return "document.pdf";
  const clean = name.trim();
  if (clean.toLowerCase().endsWith(".pdf")) return clean;
  return clean.replace(/\.[^/.]+$/, "") + ".pdf";
}

/**
 * Format bytes or string file size into human-readable format.
 */
export function formatFileSize(size) {
  if (!size) return "2.0 MB";
  if (typeof size === "number") {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }
  const str = String(size).trim();
  if (/\d+/.test(str)) return str;
  return "2.0 MB";
}

/**
 * Triggers direct download for Google Drive files and direct URLs in PDF format.
 * Works seamlessly on Android, iPhone, and Desktop browsers.
 */
export async function downloadDriveFile(fileInput, customTitle = "", metadata = {}) {
  if (!fileInput) {
    toast.error("Download file link is missing or empty");
    return;
  }

  const folderId = extractDriveFolderId(fileInput);
  if (folderId || (typeof fileInput === "string" && fileInput.includes("/folders/"))) {
    const folderUrl = folderId ? `https://drive.google.com/drive/folders/${folderId}` : String(fileInput);
    toast.success("📂 Opening Google Drive Folder with Question Papers...", { position: isMobileDevice() ? "top-center" : "top-right" });
    window.open(folderUrl, "_blank");
    return;
  }

  const rawTitle = customTitle || metadata.title || metadata.fileName || "academic_resource";
  const pdfFileName = ensurePdfExtension(rawTitle);

  const fileId = extractDriveFileId(fileInput);
  const directDownloadUrl = getDirectDownloadUrl(fileInput);

  const isMobile = isMobileDevice();
  const toastPosition = isMobile ? "top-center" : "top-right";
  const isLocalFile = typeof fileInput === "string" && fileInput.startsWith("/");

  if (isMobile) {
    const toastId = toast.loading(`📥 Downloading ${pdfFileName}...`, {
      position: toastPosition,
      duration: 2500,
    });

    if (isLocalFile) {
      const a = document.createElement("a");
      a.href = fileInput;
      a.download = pdfFileName;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (a.parentNode) document.body.removeChild(a);
      }, 500);
    } else {
      const targetUrl = directDownloadUrl || (fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : String(fileInput));
      window.open(targetUrl, "_blank");
    }

    toast.success(`📥 PDF download initiated for ${pdfFileName}`, {
      id: toastId,
      position: toastPosition,
      duration: 3500,
    });
    return;
  }

  // Desktop Flow
  const toastId = toast.loading(`📥 Preparing PDF download (${pdfFileName})...`, {
    position: toastPosition,
  });

  try {
    let fetchedBlob = null;
    if (isLocalFile) {
      try {
        const response = await fetch(fileInput, { method: "GET" });
        if (response.ok) {
          const contentType = response.headers.get("content-type") || "";
          if (!contentType.includes("text/html")) {
            fetchedBlob = await response.blob();
          }
        }
      } catch {
        // Fallback below
      }
    }

    if (fetchedBlob && fetchedBlob.size > 500) {
      const blobUrl = URL.createObjectURL(fetchedBlob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = pdfFileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (a.parentNode) document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }, 1000);

      toast.success(`✅ PDF downloaded: ${pdfFileName}`, { id: toastId, position: toastPosition });
      return;
    }

    // Direct Anchor / Window location fallback for desktop
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = directDownloadUrl;
    downloadAnchor.download = pdfFileName;
    downloadAnchor.target = "_blank";
    downloadAnchor.rel = "noopener noreferrer";
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();

    setTimeout(() => {
      if (downloadAnchor.parentNode) document.body.removeChild(downloadAnchor);
    }, 1000);

    toast.success(`📥 PDF download initiated for ${pdfFileName}`, {
      id: toastId,
      position: toastPosition,
      duration: 3500,
    });
  } catch (err) {
    console.error("PDF Download error:", err);
    toast.error("Opening PDF in browser window...", { id: toastId });
    const fallbackUrl = fileId ? `https://drive.google.com/file/d/${fileId}/view?usp=sharing` : String(fileInput);
    window.open(fallbackUrl, "_blank");
  }
}
