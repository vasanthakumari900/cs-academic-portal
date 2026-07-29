// src/services/ragService.js
// Optimized Document AI (RAG) Service with Pre-Indexed Inverted Search & Fast Retrieval.

import { sendMessage } from "./groqService";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

// In-memory active documents store for multi-turn sessions
let activeDocuments = [];

/**
 * Add a parsed document to active RAG session & pre-index word tokens
 */
export async function addDocumentToRAG(docData, userUid = "anonymous") {
  // Pre-tokenize and index page terms for fast lookup
  const indexedPages = docData.pages.map((page) => {
    const textLower = page.text.toLowerCase();
    const wordsSet = new Set(
      textLower.replace(/[^\w\s]/g, " ").split(/\s+/).filter((w) => w.length > 2)
    );
    return {
      ...page,
      textLower,
      wordsSet,
    };
  });

  const indexedDoc = {
    ...docData,
    pages: indexedPages,
  };

  const existingIdx = activeDocuments.findIndex((d) => d.fileName === docData.fileName);
  if (existingIdx >= 0) {
    activeDocuments[existingIdx] = indexedDoc;
  } else {
    activeDocuments.push(indexedDoc);
  }

  // Record document upload metadata in Firestore in background
  try {
    addDoc(collection(db, "documentAI_uploads"), {
      fileName: docData.fileName,
      fileType: docData.fileType,
      totalPages: docData.totalPages,
      wordCount: docData.wordCount,
      userUid,
      uploadedAt: serverTimestamp(),
    }).catch(() => {});
  } catch {
    // ignore non-critical metric errors
  }

  return activeDocuments;
}

/**
 * Get all active documents in current session
 */
export function getActiveDocuments() {
  return activeDocuments;
}

/**
 * Clear session documents
 */
export function clearActiveDocuments() {
  activeDocuments = [];
}

/**
 * Perform sub-millisecond term scoring across pre-indexed page chunks
 */
export function searchRelevantPages(queryText, topK = 4) {
  if (!queryText || activeDocuments.length === 0) return [];

  const rawQueryLower = queryText.toLowerCase();
  const queryTerms = rawQueryLower
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (queryTerms.length === 0) return [];

  const scoredPages = [];

  activeDocuments.forEach((doc) => {
    doc.pages.forEach((page) => {
      let score = 0;

      queryTerms.forEach((term) => {
        if (page.wordsSet && page.wordsSet.has(term)) {
          score += 3;
        } else if (page.textLower && page.textLower.includes(term)) {
          score += 1;
        }
      });

      // Exact phrase match boost
      if (page.textLower && page.textLower.includes(rawQueryLower)) {
        score += 12;
      }

      if (score > 0) {
        scoredPages.push({
          fileName: doc.fileName,
          pageNumber: page.pageNumber,
          text: page.text,
          score,
        });
      }
    });
  });

  scoredPages.sort((a, b) => b.score - a.score);
  return scoredPages.slice(0, topK);
}

/**
 * Fast Grounded RAG Question Answering Pipeline
 */
export async function answerQuestionFromDocuments(queryText, chatHistory = []) {
  if (activeDocuments.length === 0) {
    return "No document is currently attached. Please upload a document (PDF, DOCX, PPT, TXT) to ask questions about it.";
  }

  const topExcerpts = searchRelevantPages(queryText, 4);

  if (topExcerpts.length === 0) {
    return "The uploaded document does not contain information related to your question.";
  }

  const excerptsContext = topExcerpts
    .map(
      (e) =>
        `--- EXCERPT FROM [Document: "${e.fileName}", Page ${e.pageNumber}] ---\n${e.text}`
    )
    .join("\n\n");

  const systemInstructions = `You are a strict Document AI Assistant for the CS Academic Portal.
You must answer questions ONLY using the provided document excerpts below.

EXCERPTS FROM UPLOADED DOCUMENTS:
${excerptsContext}

STRICT GROUNDING INSTRUCTIONS:
1. Answer the user's question accurately using ONLY facts from the excerpts above.
2. ALWAYS cite the exact Page Number where the information was found, e.g., "[Page ${topExcerpts[0].pageNumber}]" or "[Page X, Page Y]".
3. If the answer to the user's question cannot be found in the excerpts above, reply EXACTLY with:
"The uploaded document does not contain information related to your question."
4. Do NOT invent, speculate, or use outside knowledge not present in the excerpts.
`;

  try {
    const reply = await sendMessage(
      chatHistory,
      queryText,
      systemInstructions
    );
    return reply;
  } catch (err) {
    console.error("RAG QA Error:", err);
    return "An error occurred while analyzing the document. Please try again.";
  }
}
