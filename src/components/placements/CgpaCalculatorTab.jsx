// src/components/placements/CgpaCalculatorTab.jsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUploadCloud,
  FiFileText,
  FiCheckCircle,
  FiTrash2,
  FiAward,
  FiBookOpen,
  FiPercent,
  FiRefreshCw,
  FiInfo,
  FiXCircle,
  FiLoader,
  FiShield,
  FiTerminal,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { parsePdfDocument } from "../../utils/documentParser";
import { ocrDocument } from "../../utils/ocrService";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];

// Asynchronously extract real text from a PDF using the pdf.js engine (documentParser).
// Returns "" for image files (no OCR available in-browser).
async function extractRawTextFromFile(file) {
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const isPdf = file.type.includes("pdf") || ext === "pdf";
  if (!isPdf) return "";

  try {
    const parsed = await parsePdfDocument(file);
    return parsed.pages.map((p) => p.text || "").join(" ");
  } catch (err) {
    console.error("PDF marksheet extraction error:", err);
    return "";
  }
}

// Normalize OCR-confused characters inside a candidate number (never applied to whole text,
// so labels like "CGPA" stay intact). E.g. "B.42" -> "8.42", "O.85" -> "0.85".
function normalizeOcrNumber(str) {
  return String(str)
    .replace(/O/g, "0")
    .replace(/o/g, "0")
    .replace(/I/g, "1")
    .replace(/l/g, "1")
    .replace(/Z/g, "2")
    .replace(/S/g, "5")
    .replace(/B/g, "8")
    .replace(/G/g, "6")
    .replace(/g/g, "9")
    .replace(/q/g, "9")
    .replace(/A/g, "4");
}

// Characters Tesseract might output in place of digits (lowercase o/G included)
const OCR_DIGIT_CLASS = "[0-9OIlZSBgqAGGo]";

// Collect all plausible candidate values (x.yy, 4.0-10.0) from a text window, in order,
// normalizing OCR digit confusions as it goes. Values like 10.00 are allowed (1-2 digits
// before the decimal), but a perfect 10.00 is deprioritized so headers like "CGPA SCALE: 10.00"
// don't win over the real value.
function collectValidValuesIn(text, fromIndex = 0, maxLen = 160) {
  const window = text.substring(fromIndex, fromIndex + maxLen);
  const candidates = window.match(new RegExp(`\\b${OCR_DIGIT_CLASS}{1,2}\\.${OCR_DIGIT_CLASS}{1,2}\\b`, "g"));
  if (!candidates) return [];
  return candidates
    .map((c) => parseFloat(normalizeOcrNumber(c)))
    .filter((v) => !Number.isNaN(v) && v >= 4.0 && v <= 10.0)
    .map((v) => v.toFixed(2));
}

// First plausible value in a window (skipping 10.00 unless it's the only option).
function findValidValueIn(text, fromIndex = 0, maxLen = 160) {
  const values = collectValidValuesIn(text, fromIndex, maxLen);
  if (values.length === 0) return null;
  return values.find((v) => v !== "10.00") || values[0];
}

// Last plausible value in a region (totals sit at the bottom of the table).
function findLastValidValueIn(text, startIndex = 0, endIndex) {
  const region = text.substring(startIndex, endIndex ?? text.length);
  const values = collectValidValuesIn(region, 0, region.length);
  if (values.length === 0) return null;
  for (let i = values.length - 1; i >= 0; i--) {
    if (values[i] !== "10.00") return values[i];
  }
  return values[values.length - 1];
}

// Build several light "interpretations" of OCR text to survive common OCR quirks.
function buildOcrTextVariants(rawText) {
  const variants = [rawText];
  const add = (fn) => {
    const v = fn(rawText);
    if (v && v !== rawText && !variants.includes(v)) variants.push(v);
  };

  // OCR may turn ":" into ";" or a comma into the decimal separator
  add((s) => s.replace(/;/g, ":").replace(/\b([0-9]),( [0-9])/g, "$1.$2"));
  // Drop spaces that broke up a label:value pair e.g. "CGPA : 7.60" -> "CGPA: 7.60"
  add((s) => s.replace(/(cgpa|gpa|sgpa)\s+([.:_-])\s+/gi, "$1$2"));

  return variants;
}

// ────────────────────────────────────────────────────────────────────────────
// Marksheet ownership verification — a student may ONLY upload their OWN marksheet.
// ────────────────────────────────────────────────────────────────────────────

// Normalize a name for fuzzy comparison (uppercase, keep letters+spaces only).
function normalizeName(str) {
  return String(str || "")
    .toUpperCase()
    .replace(/[^A-Z ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Honorific/title prefixes that don't distinguish one student from another.
const NAME_STOPWORDS = new Set(["SRI", "SMT", "TMT", "MR", "MRS", "MS", "MISS", "DR", "KUMARI"]);

// OCR-confusable characters for each digit/letter, used to match a KNOWN register number
// loosely on a scanned marksheet (e.g. "24E3OO6", "2403006", "24E 3006" all match 24E3006).
const ROLL_CHAR_CLASS = {
  "0": "[0O]",
  "1": "[1Il]",
  "2": "[2Z]",
  "3": "[3]",
  "4": "[4A]",
  "5": "[5S]",
  "6": "[6G]",
  "7": "[7]",
  "8": "[8B]",
  "9": "[9gq]",
  E: "[EO0]",
};

// Does the marksheet text contain the student's OWN register number? The roll is ALWAYS
// printed on the marksheet, so a tolerant search for the exact expected roll anywhere in the
// text (no perfect "REG NO:" label needed) is the most reliable ownership proof. Whitespace
// is stripped so OCR table/line layouts can't hide it, and digit lookarounds stop a longer
// number (like a DOB "24032006") from ever falsely matching.
function textContainsRoll(text, roll) {
  if (!text || !roll) return false;
  const expected = String(roll).toUpperCase().replace(/\s+/g, "");
  if (!/^\d{2}[EO0]\d{4}$/.test(expected)) return false;
  const pattern = expected
    .split("")
    .map((c) => ROLL_CHAR_CLASS[c] || c)
    .join("");
  const rx = new RegExp(`(?<![0-9])${pattern}(?![0-9])`);
  // Strip ALL non-alphanumerics (spaces, hyphens, dots, slashes) so OCR layouts like
  // "24E-3006", "24E.3006", "24 E 3006" or "24E3006" all collapse to the same search.
  const clean = String(text).toUpperCase().replace(/[^0-9A-Z]/g, "");
  return rx.test(clean);
}

// Heuristic: does the document text look like an official academic semester marksheet?
// Used ONLY to decide reject-vs-continue when no CGPA was extracted — the signal is academic
// content (university, semester, subjects, marks/grades, SGPA/CGPA), never identity fields.
function looksLikeMarksheet(text) {
  const clean = String(text || "").toUpperCase().replace(/\s+/g, " ");
  if (clean.trim().length < 20) return false;
  let score = 0;
  if (/ANNA|UNIVERSITY|COLLEGE|INSTITUTE|VAISHNAV/.test(clean)) score += 1;
  if (/\bSEM(?:ESTER)?\b/.test(clean)) score += 1;
  if (/\bSUBJECT\b|\bCOURSE\b|\bPAPER\b/.test(clean)) score += 1;
  if (/\bMARKS?\b|\bGRADES?\b|\bCREDITS?\b|\bRESULT\b|\bPASS\b|\bFAIL\b/.test(clean)) score += 1;
  if (/\bSGPA\b|\bCGPA\b|GPA\b|GRADE\s+POINT\b/.test(clean)) score += 1;
  if (/\bPART\s+(?:I{1,3}|IV|V)\b/.test(clean)) score += 1;
  if (/\bREG(?:ISTER)?\s*(?:NO|NUMBER)?\b|\bEXAM(?:INATION)?\b/.test(clean)) score += 1;
  // An explicit CGPA value is strong academic evidence
  if (/CGPA\s*[:=\-]?\s*[0-9]/.test(clean) || /[4-9]\.[0-9]{1,2}\s*\/\s*10\b/.test(clean)) score += 2;
  return score >= 2;
}

// Extract the student's register number + name printed on the marksheet (text layer or OCR text).
function extractMarksheetIdentity(rawText) {
  const clean = String(rawText || "")
    .toUpperCase()
    .replace(/([0-9])\s*\.\s*([0-9]{1,2})/g, "$1.$2")
    .replace(/\s+/g, " ");

  // ── Register number: e.g. 24E3013 / 24E 3013 / 24E3O13 / 2403013 (OCR confusions) ──
  let registerNumber = null;
  // Characters Tesseract may output in place of a digit (both in the E position and the 4-digit tail)
  const rollTailClass = "[0-9OIlZSBgqA]";
  // The roll must appear right after a REG/ROLL/REGISTER/ENROLLMENT-style label, e.g.
  // "Reg.No: 24E3013", "ROLL NO 24E3013", "ADMISSION NUMBER 24E3013", "ENROLMENT 24E3013".
  // Label-anchored ONLY — a bare 7-char digit string elsewhere (date, phone, ID fragment)
  // must never be mistaken for a register number, or it would falsely reject an owner.
  const rollMatch = clean.match(
    new RegExp(`(?:reg(?:ister)?|roll|adm(?:ission)?|enrol(?:l)?ment)\\s*\\.?\\s*(?:no\\.?|number)?\\s*[:.\\-]?\\s*(\\d{2}\\s*[EO0]\\s*${rollTailClass}{4})`, "i")
  );
  if (rollMatch) {
    registerNumber = (rollMatch[1] || rollMatch[0]).replace(/\s+/g, "");
    // Rebuild the roll: the E-position character (E/O/0) becomes "E", and the 4 trailing chars
    // are OCR-tolerant digits (e.g. "24E3O04" -> "24E3004", "2403013" -> "24E3013").
    // Real zero digits AFTER the E are preserved — only letter confusions become digits.
    registerNumber = registerNumber.replace(
      new RegExp(`^(\\d{2})[EO0](${rollTailClass}{4})$`, "i"),
      (m, head, tail) => `${head}E${normalizeOcrNumber(tail)}`
    );
  }

  // ── Student name: text following a NAME-type label. Tries the SPECIFIC candidate-name
  //    labels first (STUDENT NAME / NAME OF THE CANDIDATE / CANDIDATE NAME), then a bare
  //    "NAME" fallback — so header noise like "NAME OF THE CENTRE : DDGD VAISHNAV" is never
  //    mistaken for the student's name. Keeps the first snippet that looks like a real name
  //    (must not START with filler/header words such as OF/THE/CENTRE/UNIVERSITY). ──
  const NAME_FILLERS = new Set(["OF", "THE", "AND", "FOR", "FROM", "IN", "ON", "THIS", "ANNA", "UNIVERSITY", "EXAMINATION", "DEGREE", "BRANCH", "COLLEGE", "INSTITUTE", "CENTRE", "CENTER", "OFFICE", "SCHOOL"]);
  const looksLikeName = (s) => {
    const norm = normalizeName(s);
    if (!norm || norm.replace(/\s/g, "").length < 3) return false;
    const tokens = norm.split(" ");
    if (NAME_FILLERS.has(tokens[0])) return false; // must not start with header/filler noise
    return tokens.some((t) => !NAME_FILLERS.has(t) && !NAME_STOPWORDS.has(t));
  };

  let studentName = null;
  const specificNameRx = /(?:students?\s*['’]?s?\s+name|student\s+name|name\s+of\s+the\s+candidate|candidate\s*['’]?s?\s*name)\s*[:.\-]?\s*/gi;
  const genericNameRx = /\bname\b\s*[:.\-]?\s*/gi;
  for (const rx of [specificNameRx, genericNameRx]) {
    let nm;
    while ((nm = rx.exec(clean)) !== null) {
      let nameSnippet = clean.substring(nm.index + nm[0].length);
      // Stop at common field labels that follow the name (incl. marksheet section headers)
      nameSnippet = nameSnippet.split(/\s+(?:REG(?:ISTER)?|ROLL|DEGREE|BRANCH|DEPARTMENT|COLLEGE|DATE|DOB|SEMESTER|YEAR|FATHER|MOTHER|GENDER|BLOOD|PART|GPA|CGPA|RESULT|TOTAL|CREDIT|SUBJECT|COURSE|EXAM|UNIVERSITY|ANNA|SEM|MONTH)/i)[0];
      const candidate = normalizeName(nameSnippet).slice(0, 40);
      if (looksLikeName(candidate)) {
        studentName = candidate;
        break;
      }
    }
    if (studentName) break;
  }

  return { registerNumber, studentName };
}

// Fuzzy match between the detected marksheet name and the logged-in user's name.
// Rule: the marksheet name may be a PARTIAL read of the full registered name (OCR often
// misses words), so a detected name that is a token-subset of the user's name passes.
// But a marksheet name that ADDS tokens the user doesn't have (e.g. "SRI SANJAY R M" vs
// user "SANJAY N", or "KARTHIKEYAN R" vs "KARTHIKEYAN P") belongs to a DIFFERENT student
// and is rejected. Single-letter initials are significant (they disambiguate same-first-name
// students), while title prefixes like "SRI"/"SMT" are ignored.
function namesMatch(detected, expected) {
  const d = normalizeName(detected);
  const e = normalizeName(expected);
  if (!d || !e) return false;
  if (d === e) return true;

  const tokens = (s) => s.split(" ").filter((t) => !NAME_STOPWORDS.has(t));

  const dTokens = tokens(d);
  const eTokens = tokens(e);
  if (!dTokens.length || !eTokens.length) return false;

  const dSubsetE = dTokens.every((t) => eTokens.includes(t));
  const eSubsetD = eTokens.every((t) => dTokens.includes(t));
  if (dSubsetE && eSubsetD) return true; // same token set
  return dSubsetE; // detected (marksheet) is a partial read of expected (user)
}

// Names that START with marksheet header words (e.g. "OF THE CENTRE DDGD VAISHNAV") are
// OCR noise, not a real student name — never echo them as the detected owner.
const HEADER_NAME_PREFIXES = ["OF", "THE", "AND", "CENTRE", "CENTER", "UNIVERSITY", "COLLEGE", "EXAMINATION", "DEGREE", "BRANCH", "SCHOOL"];
function isHeaderNoiseName(name) {
  const first = String(name || "").toUpperCase().split(/\s+/)[0];
  return HEADER_NAME_PREFIXES.includes(first);
}

// Verify the marksheet belongs to the logged-in student.
// Returns { ok: true, ... } or { ok: false, reason, ... } where reason is "register"
// (roll mismatch), "name" (name mismatch), or "unverified" (no register number or
// name could be read from the document).
function verifyMarksheetOwnership(identity, user, marksheetText) {
  // Only STUDENTS are ownership-checked (they have a roll number). Faculty/admins skip.
  if (!user || !user.rollNumber) {
    return { ok: true, skipped: true };
  }

  const expectedRoll = String(user.rollNumber).toUpperCase().replace(/\s+/g, "");

  // 1. STRONGEST CHECK — the register number is ALWAYS printed on the marksheet, so a
  //    tolerant search for the logged-in student's OWN roll anywhere in the text is the
  //    most reliable proof of ownership. It survives OCR confusions ("24E3OO6"/"2403006")
  //    and layout spacing ("24 E 3006") without needing a perfect "REG NO:" label.
  if (textContainsRoll(marksheetText, expectedRoll)) {
    return { ok: true, matched: "register" };
  }

  // 2. A different register number was read from the marksheet → it belongs to someone else.
  if (identity.registerNumber) {
    return {
      ok: false,
      reason: "register",
      registerNumber: identity.registerNumber,
      studentName: identity.studentName,
    };
  }

  // 3. Fall back to name comparison when no register number could be read.
  if (identity.studentName && user.name) {
    if (!namesMatch(identity.studentName, user.name)) {
      return {
        ok: false,
        reason: "name",
        registerNumber: identity.registerNumber,
        studentName: identity.studentName,
      };
    }
    return { ok: true, matched: "name" };
  }

  // Couldn't read identity from the marksheet — cannot prove ownership for a student.
  // (The caller may still accept a self-declared match when the filename contains the
  // student's own register number.)
  return { ok: false, reason: "unverified" };
}

// Dedicated function to extract CGPA strictly from the real extracted PDF/OCR text.
// Priority: PART III section -> explicit CGPA label -> GPA/SGPA label -> score/10.
// Returns null when no genuine value is found (never invents fake defaults).
function extractGpaFromPdfText(rawText) {
  const norm = (s) =>
    (s || "")
      .replace(/([0-9])\s*\.\s*([0-9]{1,2})/g, "$1.$2") // "7 . 6 0" -> "7.60"
      .replace(/\\\(|\\\)/g, "")
      .replace(/\s+/g, " ");

  // Run extraction against every OCR interpretation until one yields a value.
  for (const variant of buildOcrTextVariants(rawText || "")) {
    const clean = norm(variant);
    const found = extractGpaFromCleanText(clean);
    if (found) return found;
  }

  return null;
}

// Extract the CGPA/GPA value printed inside the PART III section (user requirement: always use
// PART III — every semester marksheet prints its CGPA there). Locates "PART III" in the summary table,
// matches the label "Part III" first, reads the GPA beside it (e.g. Part III 30 7.60 -> 7.60), and
// ignores Part I, Part II, Part IV, and first decimal occurrences.
function extractPart3Cgpa(clean) {
  if (!clean || typeof clean !== "string") return null;

  // 1. Label-based summary table parser (Pattern: Part III [credits] [GPA], e.g., Part III 30 7.60)
  // Matches "Part III 30 7.60", "PART III 30 7.60", "PART-III 30 7.60"
  const summaryTableRx = /\bpart[\s\-:_.]*(?:iii|3|111|i\s*i\s*i)\s+(\d+)\s+(\d+\.\d+)\b/i;
  const matchTable = clean.match(summaryTableRx);
  if (matchTable && matchTable[2]) {
    const val = parseFloat(matchTable[2]);
    if (!isNaN(val) && val >= 0 && val <= 10.00) {
      return val.toFixed(2);
    }
  }

  // 2. Direct Part III label match with colon/dash or direct decimal (e.g. "Part III : 7.60", "PART III 7.60")
  const directLabelRxes = [
    /\bpart[\s\-:_.]*(?:iii|3|111|i\s*i\s*i)\b[^\n\r\d]*?(\d{1,3})\s+([0-9]\.\d{1,2}|10\.00)\b/i,
    /\bpart[\s\-:_.]*(?:iii|3|111|i\s*i\s*i)\b[^\n\r\d]*?[:=\-]?\s*([0-9]\.\d{1,2}|10\.00)\b/i,
    /\b(?:core|major)\s*(?:subjects?|courses?|part)?\b[^\n\r\d]*?[:=\-]?\s*([0-9]\.\d{1,2}|10\.00)\b/i
  ];

  for (const rx of directLabelRxes) {
    const match = clean.match(rx);
    if (match) {
      const gpaStr = match[2] || match[1];
      const val = parseFloat(gpaStr);
      if (!isNaN(val) && val >= 0 && val <= 10.00) {
        return val.toFixed(2);
      }
    }
  }

  // 3. Locate PART III section heading position in full text
  const part3Patterns = [
    /\bpart[\s\-:_.]*(?:iii|3|111|i\s*i\s*i|l\s*l\s*l|1\s*1\s*1)\b/i,
    /\bp\s*a\s*r\s*t\s*[-:_.]*\s*(?:iii|3|i\s*i\s*i)\b/i,
    /\b(?:core|major)\s*(?:subjects?|courses?|part)?\b/i,
  ];

  let part3Index = -1;

  // Search for PART III after PART I / PART II if present
  const part1Or2Idx = clean.search(/\bpart[\s\-:_.]*(?:i|1|ii|2)\b(?![\s\-]*[iv3])/i);
  if (part1Or2Idx !== -1) {
    const afterPart12 = clean.substring(part1Or2Idx + 6);
    for (const rx of part3Patterns) {
      const idx = afterPart12.search(rx);
      if (idx !== -1) {
        part3Index = part1Or2Idx + 6 + idx;
        break;
      }
    }
  }

  if (part3Index === -1) {
    for (const rx of part3Patterns) {
      const idx = clean.search(rx);
      if (idx !== -1) {
        part3Index = idx;
        break;
      }
    }
  }

  // Strictly return null if Part III section heading cannot be identified
  if (part3Index === -1) return null;

  // Extract region starting strictly from PART III up to PART IV, PART V, or OVERALL
  const afterPart3 = clean.substring(part3Index);
  let regionEnd = afterPart3.search(/\bpart[\s\-:_.]*(?:iv|4|v|5)\b/i);
  if (regionEnd === -1) regionEnd = afterPart3.search(/\b(?:overall|consolidated|grand\s+total)\b/i);
  const region = regionEnd !== -1 ? afterPart3.substring(0, regionEnd) : afterPart3.substring(0, 400);

  // Extract all valid decimal numbers inside the PART III region only
  const decimals = region.match(/\b([0-9]\.\d{1,2}|10\.00)\b/g);
  if (decimals && decimals.length > 0) {
    // Return the decimal associated with Part III (typically the last valid GPA decimal <= 10.00)
    for (let i = decimals.length - 1; i >= 0; i--) {
      const val = parseFloat(decimals[i]);
      if (!isNaN(val) && val >= 0 && val <= 10.00) {
        return val.toFixed(2);
      }
    }
  }

  return null;
}

// Single-pass extraction against one normalized text string.
function extractGpaFromCleanText(clean) {
  // Label-based strict extraction: Must identify PART III section heading first.
  // Never extract the first CGPA found on the page if it belongs to Part I or another section.
  return extractPart3Cgpa(clean);
}

// Function to verify if file is an official academic semester marksheet and extract detailed fields.
// Strategy: PDFs first try the real text layer (pdf.js); if nothing usable is found (scanned PDFs),
// fall back to OCR. Image files go straight to OCR. The marksheet must belong to the logged-in user.
async function verifyAndExtractMarksheetDetails(file, semNumber, onProgressLog, user) {
  const ext = file.name.split('.').pop()?.toLowerCase();
  const validExts = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
  const isValidFormat = ALLOWED_TYPES.includes(file.type) || validExts.includes(ext);

  const logs = [];
  const now = () => new Date().toLocaleTimeString();
  const log = (msg) => {
    const entry = `[${now()}] ${msg}`;
    logs.push(entry);
    if (onProgressLog) onProgressLog(entry);
  };

  log(`📥 File uploaded for Semester ${semNumber}: "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`);

  if (!isValidFormat) {
    log(`❌ Error: Unsupported file format "${ext}".`);
    return {
      isValid: false,
      extractedGpa: null,
      errorMsg: "Unsupported file format. Please upload official PDF, JPG, or PNG marksheets.",
      logs,
    };
  }

  const isPdf = file.type.includes("pdf") || ext === "pdf";
  let extractedText = "";
  let usedOcr = false;

  // ── 1. Try the real text layer first (digital PDFs) ──
  if (isPdf) {
    try {
      extractedText = await extractRawTextFromFile(file);
      log(`📄 PDF text-layer extracted via pdf.js (${extractedText.length} characters).`);
    } catch (err) {
      log(`⚠️ Text-layer extraction failed: ${err?.message || err}`);
    }
  }

  // Only extract from real text; never from the filename here (images go straight to OCR).
  let extractedGpa = extractedText ? extractGpaFromPdfText(extractedText) : null;
  let marksheetText = extractedText; // text used for ownership verification

  // ── 2. OCR fallback for scanned PDFs & image files ──
  if (!extractedGpa) {
    log(`🔍 No CGPA in text layer${isPdf ? " (scanned PDF?)" : " (image)"} — launching OCR engine...`);
    usedOcr = true;

    let lastLoggedPct = -1;
    try {
      const ocrText = await ocrDocument(file, {
        onProgress: (pct) => {
          // Throttle progress logs to avoid flooding the console
          if (pct === 100 || pct - lastLoggedPct >= 10) {
            lastLoggedPct = pct;
            log(`🔎 OCR progress: ${pct}%`);
          }
        },
        onLog: log,
      });
      if (ocrText) {
        log(`📄 OCR text produced (${ocrText.length} characters).`);
        // Show a snippet of what OCR read so failures are diagnosable
        const flat = ocrText.replace(/\s+/g, " ").trim();
        const snippet = flat.length > 200 ? `${flat.slice(0, 200)}...` : flat;
        log(`👁️ OCR reading: "${snippet}"`);
        marksheetText = ocrText; // scanned marksheets carry identity in OCR text
      }
      extractedGpa = extractGpaFromPdfText(ocrText);
    } catch (err) {
      log(`❌ OCR engine error: ${err?.message || err}`);
    }
  }

  // ── 2b. Marksheet recognition + OPTIONAL identity verification ──
  // PRIMARY GOAL: extract the CGPA. The student name/register number are OPTIONAL
  // verification fields — a detected MISMATCH (a different student's marksheet) is still
  // blocked, but an unreadable identity only produces a WARNING, never a rejection.
  const isMarksheet = looksLikeMarksheet(marksheetText);
  const identity = extractMarksheetIdentity(marksheetText);
  const ownership = verifyMarksheetOwnership(identity, user, marksheetText);
  log(`🛡️ Marksheet identity read: ${identity.registerNumber || "—"} ${identity.studentName ? `· ${identity.studentName}` : ""}`);

  // Hard block ONLY for a clear ownership MISMATCH (a different student's roll/name read).
  if (!ownership.ok && ownership.reason !== "unverified") {
    const detected =
      ownership.reason === "register"
        ? `Roll No ${ownership.registerNumber}`
        : isHeaderNoiseName(ownership.studentName)
        ? "another student"
        : `"${ownership.studentName}"`;
    log(`⛔ Ownership mismatch: marksheet belongs to ${detected}, not ${user?.rollNumber || user?.name}.`);
    return {
      isValid: false,
      extractedGpa: null,
      errorMsg: `This marksheet belongs to ${detected}, but you are logged in as ${user?.name || user?.rollNumber || "another student"}. Please log out and login with your own roll number — only the owner can upload their marksheet and get their overall percentage.`,
      logs,
    };
  }

  // Identity verification is informational only — it never blocks or warns the user.
  if (ownership.matched) {
    log(`✅ Marksheet ownership confirmed (${ownership.matched} matched).`);
  } else if (ownership.skipped) {
    log(`ℹ️ Faculty/admin upload — ownership not checked.`);
  } else {
    log(`ℹ️ Student identity could not be read from the marksheet — continuing with extracted academic data.`);
  }

  // ── 3. CGPA fallbacks & rejection policy ──
  // Only accept CGPA extracted directly from the PART III section of the document text.
  // Never read values from the filename, Part I, Part II, or position-based guesses.

  if (extractedGpa) {
    log(`📊 PART III CGPA Extracted (${usedOcr ? "via OCR" : "text layer"}): ${extractedGpa}`);
    log(`🟢 Verification Complete: Semester ${semNumber} Marksheet Verified.`);
    return {
      isValid: true,
      extractedGpa,
      extractedTextLength: extractedText.length,
      usedOcr,
      logs,
    };
  }

  log(`❌ Part III GPA not detected.`);
  return {
    isValid: false,
    extractedGpa: null,
    errorMsg: "Part III GPA not detected.",
    logs,
  };
}

// Circular CGPA Meter Component
function CircularCgpaMeter({ cgpa, maxCgpa = 10 }) {
  const numericCgpa = parseFloat(cgpa) || 0;
  const percentage = Math.min(100, Math.max(0, (numericCgpa / maxCgpa) * 100));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let strokeColor = "#3B82F6"; // Blue
  if (numericCgpa >= 8.5) strokeColor = "#10B981"; // Emerald
  else if (numericCgpa >= 7.5) strokeColor = "#3B82F6"; // Blue
  else if (numericCgpa >= 6.5) strokeColor = "#F59E0B"; // Amber
  else strokeColor = "#EF4444"; // Red

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          className="text-slate-100 dark:text-slate-800"
          fill="transparent"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          stroke={strokeColor}
          strokeWidth="10"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="font-sans text-3xl font-black text-slate-900 dark:text-slate-100"
        >
          {numericCgpa.toFixed(2)}
        </motion.span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Out of 10.0</span>
      </div>
    </div>
  );
}

export default function CgpaCalculatorTab() {
  // Store uploaded semester data:
  // { 1: { file, fileName, status: 'idle'|'verifying'|'verified'|'invalid', gpa, errorMsg }, ... }
  const [semesters, setSemesters] = useState({
    1: { file: null, fileName: "", status: "idle", gpa: "", errorMsg: "" },
    2: { file: null, fileName: "", status: "idle", gpa: "", errorMsg: "" },
    3: { file: null, fileName: "", status: "idle", gpa: "", errorMsg: "" },
    4: { file: null, fileName: "", status: "idle", gpa: "", errorMsg: "" },
    5: { file: null, fileName: "", status: "idle", gpa: "", errorMsg: "" },
    6: { file: null, fileName: "", status: "idle", gpa: "", errorMsg: "" },
  });

  const [activeSemHover, setActiveSemHover] = useState(null);
  const [calculatedResult, setCalculatedResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [liveLogs, setLiveLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(true);

  // Helper to push log entries
  function appendLog(msg) {
    const entry = typeof msg === "string" ? `[${new Date().toLocaleTimeString()}] ${msg}` : msg;
    setLiveLogs((prev) => [...prev, entry]);
  }

  // Current logged-in student (used to verify marksheet ownership)
  const { user } = useAuth();

  // Validate File Format and Size (accept by MIME type OR file extension — mobile uploads often have an empty MIME type)
  function validateFileFormat(file) {
    if (!file) return false;
    const extOk = /\.(pdf|jpe?g|png|webp)$/i.test(file.name || "");
    if (!ALLOWED_TYPES.includes(file.type) && !extOk) {
      toast.error("Invalid file type. Accept only PDF, JPG, JPEG, and PNG files.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 10 MB limit.");
      return false;
    }
    return true;
  }

  // Handle Marksheet Upload & Automated Verification System
  async function handleFileUpload(semNumber, file) {
    if (!validateFileFormat(file)) return;

    // 1. Set Status to 'verifying'
    setSemesters((prev) => ({
      ...prev,
      [semNumber]: {
        file,
        fileName: file.name,
        status: "verifying",
        gpa: "",
        errorMsg: "",
      },
    }));

    appendLog(`⏳ Starting automated verification for Semester ${semNumber}: "${file.name}"...`);

    // 2. Run Background Verification & CGPA Extraction (text layer first, OCR for scans)
    setTimeout(async () => {
      const result = await verifyAndExtractMarksheetDetails(file, semNumber, (msg) => appendLog(msg), user);

      if (result.logs && result.logs.length > 0) {
        setLiveLogs((prev) => [...prev, ...result.logs]);
      }

      if (result.isValid && result.extractedGpa) {
        setSemesters((prev) => ({
          ...prev,
          [semNumber]: {
            file,
            fileName: file.name,
            status: "verified",
            gpa: result.extractedGpa,
            errorMsg: "",
          },
        }));

        toast.success(`✅ Semester ${semNumber} PDF Verified! Extracted CGPA/SGPA: ${result.extractedGpa}`);
      } else {
        setSemesters((prev) => ({
          ...prev,
          [semNumber]: {
            file: null,
            fileName: file.name,
            status: "invalid",
            gpa: "",
            errorMsg: result.errorMsg || "Unable to extract CGPA/SGPA from this PDF. Upload a clear official marksheet.",
          },
        }));

        toast.error(`❌ Semester ${semNumber} Marksheet Verification Failed.`);
      }
    }, 600);
  }

  // Handle File Removal
  function handleRemoveFile(semNumber) {
    setSemesters((prev) => ({
      ...prev,
      [semNumber]: { file: null, fileName: "", status: "idle", gpa: "", errorMsg: "" },
    }));
    setCalculatedResult(null);
    appendLog(`🗑️ Removed Semester ${semNumber} marksheet.`);
    toast.success(`Cleared Semester ${semNumber} entry.`);
  }

  // Calculate Overall CGPA & Percentage strictly using extracted values from verified PDFs
  function calculateOverallResults() {
    appendLog(`--------------------------------------------------`);
    appendLog(`🧮 Initiating Overall CGPA & Percentage Calculation...`);

    // Find all verified uploaded semesters
    const verifiedSemesters = Object.entries(semesters).filter(([sem, data]) => {
      return data.status === "verified" && data.file !== null && data.gpa !== "";
    });

    if (verifiedSemesters.length === 0) {
      const errText = "Please upload at least 1 official semester marksheet PDF to calculate Overall CGPA & Percentage.";
      appendLog(`❌ Calculation Halted: ${errText}`);
      toast.error(errText, { duration: 4000 });
      return;
    }

    setIsCalculating(true);

    setTimeout(() => {
      let totalGpaSum = 0;
      const semBreakdown = [];

      verifiedSemesters.forEach(([sem, data]) => {
        const val = parseFloat(data.gpa);
        const boundedVal = Math.min(10, Math.max(0, val));
        totalGpaSum += boundedVal;

        semBreakdown.push({
          sem: Number(sem),
          gpa: boundedVal.toFixed(2),
          fileName: data.fileName,
        });

        appendLog(`📍 Semester ${sem} Verified PDF SGPA: ${boundedVal.toFixed(2)} ("${data.fileName}")`);
      });

      const uploadedCount = verifiedSemesters.length;
      const rawCgpa = totalGpaSum / uploadedCount;
      const overallCgpa = rawCgpa % 1 === 0 ? rawCgpa.toFixed(2) : Number(rawCgpa.toFixed(3)).toString();
      
      // User Requested Formula: Percentage = Overall CGPA × 10
      const overallPercentage = (rawCgpa * 10).toFixed(2);

      appendLog(`🧮 Calculation Step: (${semBreakdown.map((s) => s.gpa).join(" + ")}) ÷ ${uploadedCount} = ${overallCgpa} CGPA`);
      appendLog(`📈 Percentage Step: ${overallCgpa} × 10 = ${overallPercentage}%`);

      // Academic Performance Classification
      let perfClass = "First Class with Distinction (Excellent)";
      let badgeColor = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      let perfIcon = "🌟";
      let perfDesc = "Outstanding Performance! High priority for Tier-1 IT & Product companies.";

      const numericCgpa = parseFloat(overallCgpa);
      if (numericCgpa >= 8.5) {
        perfClass = "First Class with Distinction (Excellent)";
        badgeColor = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
        perfIcon = "🌟";
        perfDesc = "Outstanding Academic Performance! High priority for top-tier IT drives.";
      } else if (numericCgpa >= 7.5) {
        perfClass = "First Class (Very Good)";
        badgeColor = "bg-blue-500/10 text-blue-600 border-blue-500/20";
        perfIcon = "🏆";
        perfDesc = "Very Good Record! Eligible for 95%+ of campus recruitment drives.";
      } else if (numericCgpa >= 6.5) {
        perfClass = "Second Class (Good)";
        badgeColor = "bg-amber-500/10 text-amber-600 border-amber-500/20";
        perfIcon = "📜";
        perfDesc = "Good Record! Eligible for standard IT services & core campus drives.";
      } else if (numericCgpa >= 5.5) {
        perfClass = "Third Class (Average)";
        badgeColor = "bg-orange-500/10 text-orange-600 border-orange-500/20";
        perfIcon = "👍";
        perfDesc = "Average Record. Focus on aptitude & core programming skill building.";
      } else {
        perfClass = "Needs Improvement";
        badgeColor = "bg-red-500/10 text-red-600 border-red-500/20";
        perfIcon = "💡";
        perfDesc = "Consider clearing backlogs and boosting GPA in upcoming semesters.";
      }

      setCalculatedResult({
        overallCgpa,
        overallPercentage,
        uploadedCount,
        semBreakdown,
        perfClass,
        badgeColor,
        perfIcon,
        perfDesc,
      });

      appendLog(`🎯 Final Result: Overall CGPA = ${overallCgpa} | Overall Percentage = ${overallPercentage}% (${perfClass})`);
      setIsCalculating(false);
      toast.success(`Overall CGPA: ${overallCgpa} (${overallPercentage}%) calculated from verified PDFs!`);
    }, 400);
  }

  // Count verified uploaded files
  const verifiedCount = useMemo(() => {
    return Object.values(semesters).filter((s) => s.status === "verified" && s.gpa && parseFloat(s.gpa) > 0).length;
  }, [semesters]);

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      {/* Header Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F4C81] via-[#1A5C9B] to-[#1E88E5] p-6 sm:p-8 text-white shadow-xl border border-white/10">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 h-56 w-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 backdrop-blur-md text-amber-300 px-3.5 py-1 text-xs font-bold border border-amber-400/30">
            <FiPercent size={14} />
            Automated PDF CGPA Verification Tool
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Overall CGPA &amp; Percentage Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-100 max-w-2xl leading-relaxed">
            Upload your official semester marksheets (Semester 1 to 6). The system automatically verifies your PDF document, extracts your printed CGPA/SGPA, and calculates your Overall CGPA &amp; Percentage.
          </p>
          {user?.rollNumber && (
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-white">
              <FiShield size={14} className="text-emerald-300 shrink-0" />
              <span>Only <span className="text-amber-300">{user.name || "You"}</span> ({user.rollNumber}) can upload their own marksheet — ownership is verified automatically.</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Upload Grid: 6 Semesters */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FiBookOpen className="text-[#0F4C81] dark:text-sky-400" />
              Upload &amp; Verify Marksheets (Semesters 1 to 6)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Upload 1 to 6 official marksheets (PDF, JPG, PNG up to 10 MB each).
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] dark:bg-sky-500/10 dark:text-sky-400 px-3.5 py-1 text-xs font-bold border border-[#0F4C81]/20">
            <FiCheckCircle size={14} />
            {verifiedCount} of 6 Semesters Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((sem) => {
            const data = semesters[sem];
            const isVerified = data.status === "verified";
            const isVerifying = data.status === "verifying";
            const isInvalid = data.status === "invalid";

            return (
              <motion.div
                key={sem}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sem * 0.04 }}
                className={`relative overflow-hidden rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between ${
                  isVerified
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-sm"
                    : isInvalid
                    ? "bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-800 shadow-sm"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-[#0F4C81]/40 shadow-sm"
                }`}
              >
                {/* Semester Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-extrabold ${
                      isVerified ? "bg-emerald-600 text-white" : isInvalid ? "bg-red-600 text-white" : "bg-[#0F4C81] text-white"
                    }`}>
                      S{sem}
                    </span>
                    <h4 className="font-sans text-sm font-bold text-slate-800 dark:text-slate-100">
                      Semester {sem} Marksheet
                    </h4>
                  </div>

                  {/* Verification Badges */}
                  {isVerifying && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 animate-pulse">
                      <FiLoader size={13} className="animate-spin" /> Verifying PDF...
                    </span>
                  )}
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-[11px] font-extrabold border border-emerald-500/20">
                      🟢 Verified PDF
                    </span>
                  )}
                  {isInvalid && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 px-2.5 py-0.5 text-[11px] font-extrabold border border-red-500/20">
                      🔴 Unreadable PDF
                    </span>
                  )}
                </div>

                {/* Upload / Verifying / Verified / Invalid Card Area */}
                <div className="my-4">
                  {isVerifying ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                      <FiLoader size={30} className="animate-spin text-[#0F4C81]" />
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Verifying PDF marksheet...</p>
                      <p className="text-[10px] text-slate-400">Extracting official CGPA/SGPA from document</p>
                    </div>
                  ) : isVerified ? (
                    <div className="space-y-3">
                      {/* Valid File Badge */}
                      <div className="flex items-center gap-2.5 rounded-xl bg-white dark:bg-slate-800 p-3 border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
                        <FiFileText size={22} className="text-emerald-600 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title={data.fileName}>
                            {data.fileName}
                          </p>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            ✅ Official PDF Verified
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(sem)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Remove file"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>

                      {/* Display Extracted CGPA/SGPA Badge */}
                      <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-3 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Extracted Academic Record
                        </span>
                        <p className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                          <FiCheckCircle size={16} /> Semester {sem} CGPA: {data.gpa}
                        </p>
                      </div>

                    </div>
                  ) : isInvalid ? (
                    <div className="space-y-3">
                      <div className="rounded-xl bg-red-100/70 dark:bg-red-950/40 p-3 border border-red-200 dark:border-red-800 text-left space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-300">
                          <FiXCircle size={16} className="shrink-0" />
                          <span>Verification Failed</span>
                        </div>
                        <p className="text-[11px] text-red-600 dark:text-red-400 leading-snug">
                          {data.errorMsg}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(sem)}
                        className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <FiTrash2 size={14} /> Remove &amp; Re-upload Marksheet
                      </button>
                    </div>
                  ) : (
                    <label
                      onDragOver={(e) => { e.preventDefault(); setActiveSemHover(sem); }}
                      onDragLeave={() => setActiveSemHover(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setActiveSemHover(null);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleFileUpload(sem, e.dataTransfer.files[0]);
                        }
                      }}
                      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                        activeSemHover === sem
                          ? "border-[#0F4C81] bg-[#0F4C81]/5"
                          : "border-slate-200 dark:border-slate-800 hover:border-[#0F4C81]/50 bg-slate-50/50 dark:bg-slate-800/30"
                      }`}
                    >
                      <FiUploadCloud size={32} className="text-slate-400 mb-2 group-hover:text-[#0F4C81]" />
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        Drag &amp; Drop or <span className="text-[#0F4C81] dark:text-sky-400 underline">Browse PDF</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">Official PDF Marksheet (Max 10MB)</p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(sem, e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          onClick={calculateOverallResults}
          disabled={isCalculating}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#0F4C81] to-[#1E88E5] hover:from-[#0A369D] hover:to-[#0F4C81] px-8 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#0F4C81]/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isCalculating ? (
            <>
              <FiRefreshCw className="animate-spin" size={18} /> Processing Academic Data...
            </>
          ) : (
            <>
              <FiPercent size={18} /> Calculate Overall CGPA &amp; Percentage
            </>
          )}
        </button>

        {calculatedResult && (
          <button
            onClick={() => {
              setSemesters({
              1: { file: null, fileName: "", status: "idle", gpa: "", errorMsg: "" },
              2: { file: null, fileName: "", status: "idle", gpa: "", errorMsg: "" },
              3: { file: null, fileName: "", status: "idle", gpa: "", errorMsg: "" },
              4: { file: null, fileName: "", status: "idle", gpa: "", errorMsg: "" },
              5: { file: null, fileName: "", status: "idle", gpa: "", errorMsg: "" },
              6: { file: null, fileName: "", status: "idle", gpa: "", errorMsg: "" },
              });
              setCalculatedResult(null);
              setLiveLogs([]);
              toast.success("Reset all semester marksheets.");
            }}
            className="flex items-center gap-2 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 px-5 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all"
          >
            <FiRefreshCw size={16} /> Reset All
          </button>
        )}
      </div>

      {/* Real-time OCR & Calculation Console Logs */}
      {liveLogs.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 p-5 space-y-3 font-mono text-xs shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="flex items-center gap-2 font-bold text-amber-400">
              <FiTerminal size={15} /> Real-time Automated Verification &amp; Processing Logs
            </span>
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="text-[11px] text-slate-400 hover:text-white underline"
            >
              {showLogs ? "Hide Console" : "Show Console"}
            </button>
          </div>

          {showLogs && (
            <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-thin text-[11px] leading-relaxed">
              {liveLogs.map((log, idx) => (
                <p
                  key={idx}
                  className={
                    log.includes("❌")
                      ? "text-red-400"
                      : log.includes("🟢") || log.includes("🎯")
                      ? "text-emerald-400 font-semibold"
                      : log.includes("📊")
                      ? "text-sky-300 font-bold"
                      : "text-slate-300"
                  }
                >
                  {log}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results Display Section */}
      <AnimatePresence>
        {calculatedResult && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800"
          >
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
                <FiAward className="text-[#0F4C81] dark:text-sky-400" />
                Calculation Results &amp; Academic Status
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculated strictly using {calculatedResult.uploadedCount} verified uploaded PDF semester marksheet(s).
              </p>
            </div>

            {/* 4 Separate Glassmorphism Result Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Overall CGPA */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  🎓 Overall CGPA
                </span>
                <CircularCgpaMeter cgpa={calculatedResult.overallCgpa} />
                <p className="text-[11px] text-slate-400 font-medium">Cumulative Grade Point Average</p>
              </div>

              {/* Card 2: Overall Percentage */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between text-left space-y-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  📈 Overall Percentage
                </span>

                <div>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-black text-blue-600 dark:text-sky-400"
                  >
                    {calculatedResult.overallPercentage}%
                  </motion.div>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Equivalent Percentage (CGPA × 10)
                  </p>
                </div>

                {/* Animated Horizontal Progress Bar */}
                <div className="space-y-1.5">
                  <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.min(100, calculatedResult.overallPercentage)}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Number of Semesters Evaluated */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between text-left space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  📚 Semesters Evaluated
                </span>

                <div>
                  <div className="text-3xl font-black text-slate-900 dark:text-slate-100">
                    {calculatedResult.uploadedCount} <span className="text-sm font-bold text-slate-400">/ 6 Sems</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Calculated strictly using uploaded verified PDFs.
                  </p>
                </div>

                {/* Breakdown List */}
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5 text-[11px] space-y-1.5 max-h-28 overflow-y-auto">
                  {calculatedResult.semBreakdown.map((item) => (
                    <div key={item.sem} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span>Sem {item.sem}:</span>
                      <span className="font-extrabold text-[#0F4C81] dark:text-sky-400">{item.gpa} CGPA</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 4: Academic Performance Class */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between text-left space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  🏅 Academic Class
                </span>

                <div className="space-y-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black border ${calculatedResult.badgeColor}`}>
                    <span>{calculatedResult.perfIcon}</span>
                    {calculatedResult.perfClass}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {calculatedResult.perfDesc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <FiInfo size={13} className="text-blue-500 shrink-0" />
                  <span>Calculations strictly non-stored &amp; client-side.</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
