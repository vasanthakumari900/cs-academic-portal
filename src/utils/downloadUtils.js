import toast from "react-hot-toast";

/**
 * Extract Google Drive File ID from various link formats or raw ID string.
 */
export function extractDriveFileId(input) {
  if (!input) return null;
  const str = String(input).trim();
  if (/^[a-zA-Z0-9_-]{25,}$/.test(str)) {
    return str;
  }
  const match = str.match(/(?:file\/d\/|id=|\/d\/|document\/d\/|spreadsheets\/d\/|presentation\/d\/)([a-zA-Z0-9_-]{25,})/);
  return match ? match[1] : null;
}

/**
 * Converts any Google Drive URL or File ID into a direct download URL.
 * Uses drive.usercontent.google.com for direct Content-Disposition: attachment header.
 */
export function getDirectDownloadUrl(input) {
  if (!input) return "";
  const fileId = extractDriveFileId(input);
  if (fileId) {
    if (String(input).includes("docs.google.com/document")) {
      return `https://docs.google.com/document/d/${fileId}/export?format=docx`;
    }
    return `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;
  }
  return String(input);
}

/**
 * Converts Google Drive URL into an embed preview URL.
 */
export function getDriveEmbedUrl(input) {
  if (!input) return "";
  const fileId = extractDriveFileId(input);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return String(input);
}

/**
 * Triggers direct download for Google Drive files and direct URLs.
 * Shows top-right notification: "📥 Download started successfully"
 * Displays loading indicator ONLY if Google Drive takes longer than 1 second to respond.
 */
export function downloadDriveFile(fileInput, customTitle = "") {
  if (!fileInput) {
    toast.error("Download file link is missing", { position: "top-right" });
    return;
  }

  const directUrl = getDirectDownloadUrl(fileInput);

  // 1. Immediately trigger top-right toast: "📥 Download started successfully"
  toast.success("📥 Download started successfully", {
    position: "top-right",
    duration: 3500,
    style: {
      borderRadius: "10px",
      background: "#0F4C81",
      color: "#ffffff",
      fontWeight: "600",
      fontSize: "13px",
      boxShadow: "0 4px 12px rgba(15, 76, 129, 0.2)",
    },
  });

  // 2. Set 1-second (1000ms) timer for slow response indicator
  let loadingToastId = null;
  const timerId = setTimeout(() => {
    loadingToastId = toast.loading("Preparing Google Drive download...", {
      position: "top-right",
      style: {
        borderRadius: "10px",
        fontSize: "13px",
      },
    });
  }, 1000);

  // 3. Initiate native direct download
  try {
    const link = document.createElement("a");
    link.href = directUrl;
    if (customTitle) link.setAttribute("download", customTitle);
    link.target = "_self";
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      clearTimeout(timerId);
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      if (link.parentNode) {
        document.body.removeChild(link);
      }
    }, 1500);
  } catch (err) {
    clearTimeout(timerId);
    if (loadingToastId) toast.dismiss(loadingToastId);
    window.location.href = directUrl;
  }
}
