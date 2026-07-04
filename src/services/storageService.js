// src/services/storageService.js
// Handles uploading/deleting files (videos, PDFs, logos) in Firebase Storage.
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase/config";

/**
 * Upload a file with progress tracking.
 * @param {string} path - storage path, e.g. "videos/"
 * @param {File} file
 * @param {(percent: number) => void} onProgress
 * @returns {Promise<string>} download URL
 */
export function uploadFile(path, file, onProgress) {
  return new Promise((resolve, reject) => {
    const fileRef = ref(storage, `${path}${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(fileRef, file);

    task.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onProgress?.(percent);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

export async function deleteFile(url) {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (err) {
    // File may already be gone — non-fatal.
    console.warn("deleteFile:", err.message);
  }
}
