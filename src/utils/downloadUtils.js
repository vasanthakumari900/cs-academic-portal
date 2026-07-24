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
 * Helper to check if current device is mobile (iOS / Android / Mobile Web)
 */
export function isMobileDevice() {
  if (typeof window === "undefined" || !navigator) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
}

/**
 * Triggers direct download for Google Drive files and direct URLs.
 * Shows top notification: "📥 Download started successfully" at top of screen.
 * Displays loading indicator ONLY if Google Drive takes longer than 1 second to respond.
 */
export function downloadDriveFile(fileInput, customTitle = "") {
  if (!fileInput) {
    toast.error("Download file link is missing");
    return;
  }

  const directUrl = getDirectDownloadUrl(fileInput);
  const isMobile = isMobileDevice();
  const toastPosition = isMobile ? "top-center" : "top-right";

  // 1. Immediately trigger top notification
  toast.success("📥 Download started successfully", {
    position: toastPosition,
    duration: 3500,
    style: {
      borderRadius: "12px",
      background: "#0F4C81",
      color: "#ffffff",
      fontWeight: "700",
      fontSize: "13px",
      padding: "12px 18px",
      boxShadow: "0 10px 25px -5px rgba(15, 76, 129, 0.4)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
  });

  // 2. Set 1-second (1000ms) timer for slow response indicator
  let loadingToastId = null;
  const timerId = setTimeout(() => {
    loadingToastId = toast.loading("Preparing Google Drive download...", {
      position: toastPosition,
      style: {
        borderRadius: "12px",
        fontSize: "13px",
      },
    });
  }, 1000);

  // 3. Initiate native download optimized for mobile (iOS / Android) and desktop
  try {
    if (isMobile) {
      // On mobile phones, opening direct download URL triggers native mobile download popup at top of screen
      const win = window.open(directUrl, "_blank");
      if (!win) {
        window.location.href = directUrl;
      }
    } else {
      // On desktop, anchor click triggers direct download without leaving tab
      const link = document.createElement("a");
      link.href = directUrl;
      if (customTitle) link.setAttribute("download", customTitle);
      link.target = "_self";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (link.parentNode) document.body.removeChild(link);
      }, 1000);
    }

    setTimeout(() => {
      clearTimeout(timerId);
      if (loadingToastId) toast.dismiss(loadingToastId);
    }, 1500);

  } catch (err) {
    clearTimeout(timerId);
    if (loadingToastId) toast.dismiss(loadingToastId);
    window.location.href = directUrl;
  }
}
