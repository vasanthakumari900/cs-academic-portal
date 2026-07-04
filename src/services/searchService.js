// src/services/searchService.js
// Global search across videos, notes, question papers and placements.
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../utils/constants";

async function searchCollection(name, searchTerm, max = 20) {
  const q = query(collection(db, name), orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  const term = searchTerm.toLowerCase();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data(), _type: name }))
    .filter(
      (item) =>
        item.title?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.companyName?.toLowerCase().includes(term) ||
        item.subject?.toLowerCase().includes(term)
    );
}

export async function globalSearch(searchTerm) {
  if (!searchTerm?.trim()) return { videos: [], notes: [], questionPapers: [], placements: [] };

  const [videos, notes, questionPapers, placements] = await Promise.all([
    searchCollection(COLLECTIONS.VIDEOS, searchTerm),
    searchCollection(COLLECTIONS.NOTES, searchTerm),
    searchCollection(COLLECTIONS.QUESTION_PAPERS, searchTerm),
    searchCollection(COLLECTIONS.PLACEMENTS, searchTerm),
  ]);

  return { videos, notes, questionPapers, placements };
}
