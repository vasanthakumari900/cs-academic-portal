// src/services/studyGuidePdfExporter.js
import jsPDF from "jspdf";

/**
 * Clean string of non-ASCII unicode characters and remove any unit numbers (e.g. Unit I, Unit 1, Unit III).
 */
function sanitizePdfText(text) {
  if (!text) return "";
  return String(text)
    .replace(/[^\x00-\x7F]/g, "") // Strip non-ASCII emojis/corrupt symbols
    .replace(/\bUnit\s+[I|V|X]+\b/gi, "")
    .replace(/\bUnit\s+\d+\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Export Study Guide PDF Engine (No Unit Numbers Mentioned)
 * Perfectly aligned layout with High-Contrast Visible Code Boxes and Real Technical Content.
 */
export function exportUnitStudyGuidePDF({
  subjectName = "Computer Science",
  rawUnitTitle = "",
  unitSubtitle = "Core Concepts",
  topics = [],
  lessons = [],
  examBank = { short2Mark: [], medium5Mark: [], long10Mark: [] },
  quickRevision = { importantDefinitions: [], keyDifferences: [], memoryTricks: [] },
}) {
  const cleanSubj = sanitizePdfText(subjectName).replace(/[^a-zA-Z0-9]/g, "_") || "Subject";
  const fileName = `${cleanSubj}_Complete_Study_Guide.pdf`;

  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

  let y = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  const checkPageOverflow = (neededHeight) => {
    if (y + neededHeight > pageHeight - 40) {
      doc.addPage();
      y = 40;
    }
  };

  // Helper: Section Title Banners
  const drawSectionHeader = (titleText) => {
    checkPageOverflow(32);
    doc.setFillColor(15, 76, 129); // #0F4C81 Navy
    doc.rect(margin, y, contentWidth, 24, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizePdfText(titleText).toUpperCase(), margin + 12, y + 16);
    y += 34;
  };

  // Helper: Render High-Contrast Visible Code Box (Dark Box + Bright Green Text)
  const drawCodeBox = (codeText) => {
    const cleanCode = sanitizePdfText(codeText);
    if (!cleanCode) return;

    doc.setFontSize(8.5);
    doc.setFont("courier", "bold");

    const lines = doc.splitTextToSize(cleanCode, contentWidth - 24);
    const boxHeight = lines.length * 11 + 14;

    checkPageOverflow(boxHeight + 10);

    // Draw Dark Charcoal Code Box Background
    doc.setFillColor(15, 23, 42); // #0F172A Slate Dark
    doc.rect(margin, y, contentWidth, boxHeight, "F");

    // Draw Code Box Border
    doc.setDrawColor(13, 148, 136); // Teal border
    doc.setLineWidth(1);
    doc.rect(margin, y, contentWidth, boxHeight, "S");

    // Render High-Contrast White / Emerald Code Text
    doc.setTextColor(52, 211, 153); // #34D399 Bright Emerald
    let codeY = y + 13;
    lines.forEach((line) => {
      doc.text(line, margin + 12, codeY);
      codeY += 11;
    });

    y += boxHeight + 12;
  };

  // 1. Header Banner (No Unit Number)
  doc.setFillColor(15, 76, 129);
  doc.rect(margin, y, contentWidth, 60, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`CS ACADEMIC PORTAL - ${sanitizePdfText(subjectName).toUpperCase()}`, margin + 15, y + 24);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`${sanitizePdfText(unitSubtitle)} - Complete Syllabus Study Guide`, margin + 15, y + 44);
  y += 75;

  // 2. Syllabus Roadmap
  drawSectionHeader("[SYLLABUS TOPICS COVERED IN THIS GUIDE]");
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);

  topics.forEach((topic, i) => {
    checkPageOverflow(14);
    doc.text(`${i + 1}. ${sanitizePdfText(topic)}`, margin + 10, y);
    y += 13;
  });
  y += 15;

  // 3. Topic-by-Topic Breakdown (Theory, Syntax, Example, Flowchart, Coding & Output)
  drawSectionHeader("[CLASSROOM TEACHER LESSONS - THEORY, SYNTAX, EXAMPLE, FLOWCHART & CODE]");

  lessons.forEach((l, idx) => {
    checkPageOverflow(40);

    // Topic Header Bar
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 22, "F");
    doc.setTextColor(13, 148, 136); // Teal
    doc.setFontSize(10.5);
    doc.setFont("helvetica", "bold");
    doc.text(`TOPIC ${idx + 1}: ${sanitizePdfText(l.title).toUpperCase()}`, margin + 8, y + 15);
    y += 30;

    // Subsections
    // 1. THEORY
    checkPageOverflow(25);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9);
    doc.text("1. THEORY & CORE CONCEPT BREAKDOWN:", margin + 5, y);
    y += 12;

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    const theoryLines = doc.splitTextToSize(
      `${sanitizePdfText(l.step1Intro)}\n${sanitizePdfText(l.step2Concept)}`,
      contentWidth - 15
    );
    theoryLines.forEach((line) => {
      checkPageOverflow(12);
      doc.text(line, margin + 12, y);
      y += 11;
    });
    y += 8;

    // 2. SYNTAX
    checkPageOverflow(20);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9);
    doc.text("2. SYNTAX & STRUCTURAL RULES:", margin + 5, y);
    y += 12;
    drawCodeBox(l.syntaxRule || `${l.title.toLowerCase().replace(/[^a-z0-9]/g, "_")} = value;`);

    // 3. PRACTICAL EXAMPLE
    checkPageOverflow(20);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9);
    doc.text("3. PRACTICAL REAL-WORLD EXAMPLE:", margin + 5, y);
    y += 12;

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    const exLines = doc.splitTextToSize(sanitizePdfText(l.step3Example), contentWidth - 15);
    exLines.forEach((line) => {
      checkPageOverflow(12);
      doc.text(line, margin + 12, y);
      y += 11;
    });
    y += 8;

    // 4. FLOWCHART
    checkPageOverflow(20);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9);
    doc.text("4. EXECUTION FLOWCHART & ARCHITECTURE DIAGRAM:", margin + 5, y);
    y += 12;
    drawCodeBox(l.flowchart || `[Start] --> [Validate ${l.title}] --> [Execute Routine] --> [Return Output]`);

    // 5. RUNNABLE CODE & OUTPUT
    checkPageOverflow(20);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9);
    doc.text("5. RUNNABLE CODE IMPLEMENTATION & EXPECTED OUTPUT:", margin + 5, y);
    y += 12;
    drawCodeBox(l.codeOrDiagram || `${l.codeSnippet}\n\n${l.codeOutput}`);

    // 6. EXAM FOCUS
    checkPageOverflow(20);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9);
    doc.text("6. CURRICULUM CONNECTION & EXAM FOCUS:", margin + 5, y);
    y += 12;

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    const examLines = doc.splitTextToSize(
      `${sanitizePdfText(l.step6Connect)}\n${sanitizePdfText(l.step7Exam)}`,
      contentWidth - 15
    );
    examLines.forEach((line) => {
      checkPageOverflow(12);
      doc.text(line, margin + 12, y);
      y += 11;
    });
    y += 16;
  });

  // 4. Quick Revision Section
  drawSectionHeader("[QUICK REVISION NOTES & DEFINITIONS]");

  (quickRevision.importantDefinitions || []).forEach((def) => {
    checkPageOverflow(20);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(245, 158, 11);
    doc.text(`- ${sanitizePdfText(def.term)}:`, margin + 5, y);
    y += 12;

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    const dLines = doc.splitTextToSize(sanitizePdfText(def.definition), contentWidth - 20);
    dLines.forEach((line) => {
      checkPageOverflow(12);
      doc.text(line, margin + 15, y);
      y += 11;
    });
    y += 4;
  });
  y += 10;

  // 5. University Exam Question Bank
  drawSectionHeader("[UNIVERSITY EXAM QUESTION BANK - MODEL ANSWERS]");

  // A. 2-MARK QUESTIONS
  checkPageOverflow(25);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(13, 148, 136);
  doc.text("--- PART A: 2-MARK SHORT DEFINITIONS & SYNTAX (3-4 Lines Each) ---", margin, y);
  y += 18;

  (examBank.short2Mark || []).forEach((qa) => {
    checkPageOverflow(30);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(194, 65, 12);
    doc.text(sanitizePdfText(qa.q), margin, y);
    y += 12;

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    const ansLines = doc.splitTextToSize(sanitizePdfText(qa.ans), contentWidth - 10);
    ansLines.forEach((line) => {
      checkPageOverflow(11);
      doc.text(line, margin + 10, y);
      y += 10.5;
    });
    y += 8;
  });

  // B. 5-MARK QUESTIONS
  checkPageOverflow(25);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(13, 148, 136);
  doc.text("--- PART B: 5-MARK STRUCTURED ESSAY ANSWERS (15-20 Lines Each) ---", margin, y);
  y += 18;

  (examBank.medium5Mark || []).forEach((qa) => {
    checkPageOverflow(35);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(194, 65, 12);
    const qLines = doc.splitTextToSize(sanitizePdfText(qa.q), contentWidth);
    qLines.forEach((qL) => {
      checkPageOverflow(12);
      doc.text(qL, margin, y);
      y += 12;
    });

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    const ansLines = doc.splitTextToSize(sanitizePdfText(qa.ans), contentWidth - 10);
    ansLines.forEach((line) => {
      checkPageOverflow(11);
      doc.text(line, margin + 10, y);
      y += 10.5;
    });
    y += 12;
  });

  // C. 10-MARK QUESTIONS (Rendered with Section Subheadings & Dark Code Boxes)
  checkPageOverflow(25);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(225, 29, 72);
  doc.text("--- PART C: 10-MARK COMPREHENSIVE ESSAY ANSWERS (40-50 Lines Each) ---", margin, y);
  y += 20;

  (examBank.long10Mark || []).forEach((qa) => {
    checkPageOverflow(40);
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(190, 18, 60);
    const qLines = doc.splitTextToSize(sanitizePdfText(qa.q), contentWidth);
    qLines.forEach((qL) => {
      checkPageOverflow(13);
      doc.text(qL, margin, y);
      y += 13;
    });

    // Render 10-Mark Sections cleanly with clear spacing
    if (qa.theory) {
      // 1. THEORY
      checkPageOverflow(25);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(13, 148, 136);
      doc.text("1. THEORETICAL FOUNDATIONS & ARCHITECTURE:", margin + 5, y);
      y += 12;

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const tLines = doc.splitTextToSize(sanitizePdfText(qa.theory), contentWidth - 15);
      tLines.forEach((line) => {
        checkPageOverflow(12);
        doc.text(line, margin + 12, y);
        y += 11;
      });
      y += 8;

      // 2. SYNTAX
      checkPageOverflow(20);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(13, 148, 136);
      doc.text("2. SYSTEM SYNTAX RULES:", margin + 5, y);
      y += 12;
      drawCodeBox(qa.syntax);

      // 3. EXAMPLE
      checkPageOverflow(20);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(13, 148, 136);
      doc.text("3. PRACTICAL REAL-WORLD EXAMPLE:", margin + 5, y);
      y += 12;

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const eLines = doc.splitTextToSize(sanitizePdfText(qa.example), contentWidth - 15);
      eLines.forEach((line) => {
        checkPageOverflow(12);
        doc.text(line, margin + 12, y);
        y += 11;
      });
      y += 8;

      // 4. FLOWCHART
      checkPageOverflow(20);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(13, 148, 136);
      doc.text("4. EXECUTION FLOWCHART & DIAGRAM:", margin + 5, y);
      y += 12;
      drawCodeBox(qa.flowchart);

      // 5. RUNNABLE CODE IMPLEMENTATION
      checkPageOverflow(20);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(13, 148, 136);
      doc.text("5. COMPLETE RUNNABLE CODE IMPLEMENTATION:", margin + 5, y);
      y += 12;
      drawCodeBox(qa.codeSnippet);

      // 6. EXPECTED CONSOLE OUTPUT
      checkPageOverflow(20);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(13, 148, 136);
      doc.text("6. EXPECTED CONSOLE OUTPUT:", margin + 5, y);
      y += 12;
      drawCodeBox(qa.codeOutput);

      // 7. KEY ADVANTAGES & CONCLUSION
      checkPageOverflow(20);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(13, 148, 136);
      doc.text("7. KEY ADVANTAGES & ESSAY CONCLUSION:", margin + 5, y);
      y += 12;

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const cLines = doc.splitTextToSize(sanitizePdfText(qa.advantages), contentWidth - 15);
      cLines.forEach((line) => {
        checkPageOverflow(12);
        doc.text(line, margin + 12, y);
        y += 11;
      });
      y += 18;
    } else {
      // Fallback formatting for string answer
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 41, 59);
      const ansLines = doc.splitTextToSize(sanitizePdfText(qa.ans), contentWidth - 10);
      ansLines.forEach((line) => {
        checkPageOverflow(11);
        doc.text(line, margin + 10, y);
        y += 10.5;
      });
      y += 16;
    }
  });

  // Save PDF Directly
  doc.save(fileName);
}
