// src/services/bookmarkService.js
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../utils/constants";

export async function addBookmark(uid, itemId) {
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    bookmarks: arrayUnion(itemId),
  });
}

export async function removeBookmark(uid, itemId) {
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    bookmarks: arrayRemove(itemId),
  });
}
