// src/services/searchService.js
// Global search across videos, notes, question papers and placements.
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../utils/constants";
import { NOTES_DATA } from "../pages/Notes";

// Static Knowledge Base Fallbacks to guarantee 100% search reliability
const STATIC_QUESTION_PAPERS = [
  { id: "qp-py-2024", title: "Python Programming Essentials - Nov 2024 Question Paper", subject: "PYTHON PROGRAMMING ESSENTIALS", year: 2024, semester: 1, fileUrl: "https://drive.google.com/file/d/1JJPedETy61bgpiHGvwZTwa8ZxBM9bwbU/view" },
  { id: "qp-dbms-2024", title: "Database Management Systems (DBMS) - CIA 1 Question Paper", subject: "DATABASE MANAGEMENT SYSTEMS", year: 2024, semester: 3, fileUrl: "https://drive.google.com/file/d/1UjASUBSy3l3qKiDXQLXCJhQV1JsfUU4y/view" },
  { id: "qp-os-2024", title: "Operating Systems (OS) - End Semester Model Paper 2024", subject: "OPERATING SYSTEMS", year: 2024, semester: 4, fileUrl: "https://drive.google.com/file/d/12KGfZJjbkQ7kJ16LpLG9xb7B1eUVblED/view" },
  { id: "qp-eng-2024", title: "Foundation English II - Semester Exam Question Paper", subject: "FOUNDATION ENGLISH", year: 2024, semester: 2, fileUrl: "https://drive.google.com/file/d/1W_CsJAb5kZ4cszRzAz8ndHVoyMuz27T9/view" },
  { id: "qp-cpp-2023", title: "Object Oriented Programming in C++ - Model Question Paper", subject: "PROGRAMMING IN C++", year: 2023, semester: 2, fileUrl: "https://drive.google.com/file/d/1uQjkEwLU3bNy08kwzf4tnRR6ozHTyL0U/view" },
  { id: "qp-web-2024", title: "Web Technology & React - CIA Examination Question Paper", subject: "WEB TECHNOLOGY", year: 2024, semester: 5, fileUrl: "https://drive.google.com/file/d/1xNibq4k2CFPrDJBPwwte8sObe8AD92oh/view" },
];

const STATIC_VIDEOS = [
  { id: "vid-py-1", title: "Python Programming Essentials - Unit 1 Complete Lecture", subject: "PYTHON PROGRAMMING ESSENTIALS", semester: 1, videoType: "class_recording", facultyName: "Dr. S. Kausalya", views: 420, likes: 38, thumbnailUrl: "https://img.youtube.com/vi/rfscVS0vtbw/0.jpg", youtubeUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw" },
  { id: "vid-dbms-1", title: "DBMS SQL & Normalization Full Course Tutorial", subject: "DATABASE MANAGEMENT SYSTEMS", semester: 3, videoType: "class_recording", facultyName: "Prof. R. Vijayalakshmi", views: 610, likes: 54, thumbnailUrl: "https://img.youtube.com/vi/HXV3zeQKqGY/0.jpg", youtubeUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
  { id: "vid-os-1", title: "Operating Systems Process Scheduling & Deadlocks", subject: "OPERATING SYSTEMS", semester: 4, videoType: "lecture", facultyName: "Dr. M. Barathi", views: 380, likes: 29, thumbnailUrl: "https://img.youtube.com/vi/26QPDBe-NB8/0.jpg", youtubeUrl: "https://www.youtube.com/watch?v=26QPDBe-NB8" },
  { id: "vid-ds-1", title: "Data Structures & Algorithms - Arrays, Linked Lists & Trees", subject: "DATA STRUCTURES", semester: 2, videoType: "lecture", facultyName: "Prof. K. Anand", views: 890, likes: 72, thumbnailUrl: "https://img.youtube.com/vi/RBSGKlAvoiM/0.jpg", youtubeUrl: "https://www.youtube.com/watch?v=RBSGKlAvoiM" },
];

const STATIC_PLACEMENTS = [
  { id: "place-tcs-2025", companyName: "TCS (Tata Consultancy Services)", role: "Ninja & Digital Software Engineer", subject: "Placements 2025", package: "₹3.6 - ₹7.0 LPA", eligibility: "B.Sc CS & M.Sc CS (CGPA >= 6.0)", description: "On-campus recruitment drive for 2025 graduating batch. Registration open for CS department students." },
  { id: "place-infosys-2025", companyName: "Infosys Limited", role: "Systems Associate & Specialist Programmer", subject: "Placements 2025", package: "₹3.6 - ₹9.5 LPA", eligibility: "B.Sc CS & M.Sc CS (No active arrears)", description: "Specialist programming & systems associate recruitment for Computer Science department." },
  { id: "place-[#D97706]", companyName: "Cognizant (CTS)", role: "Programmer Analyst Trainee (PAT)", subject: "Placements 2025", package: "₹4.0 - ₹6.5 LPA", eligibility: "B.Sc / M.Sc CS", description: "Campus hiring drive for full-stack developer & cloud infrastructure roles." },
  { id: "place-zoho-2025", companyName: "Zoho Corporation", role: "Software Development Engineer (SDE 1)", subject: "Placements 2025", package: "₹6.0 - ₹12.0 LPA", eligibility: "Open to All CS Students with Strong Coding Skills", description: "Off-campus & campus coding test hiring for core product development team." },
];

// Helper to extract static notes from NOTES_DATA
function getStaticNotes(searchTerm) {
  const term = searchTerm.toLowerCase();
  const results = [];

  if (!NOTES_DATA) return results;

  Object.entries(NOTES_DATA).forEach(([subjectName, subjectData]) => {
    if (!subjectData?.units) return;

    Object.entries(subjectData.units).forEach(([unitNum, unitData]) => {
      const title = `${subjectName} - ${unitData.title}: ${unitData.subtitle || ""}`;
      const description = unitData.syllabus || "";

      if (
        subjectName.toLowerCase().includes(term) ||
        unitData.title?.toLowerCase().includes(term) ||
        unitData.subtitle?.toLowerCase().includes(term) ||
        description.toLowerCase().includes(term)
      ) {
        const fileObj = unitData.files?.[0];
        results.push({
          id: `static-note-${subjectName}-${unitNum}`,
          title: title.trim(),
          subject: subjectName,
          unit: `Unit ${unitNum}`,
          description: description,
          fileName: fileObj?.fileName || `${subjectName}_Unit_${unitNum}.pdf`,
          fileUrl: fileObj?.fileId ? `https://drive.google.com/file/d/${fileObj.fileId}/view` : "",
          createdAt: new Date().toISOString(),
          _type: "notes",
        });
      }
    });
  });

  return results;
}

async function searchCollection(name, searchTerm, max = 20) {
  try {
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
  } catch (err) {
    console.warn(`Firestore search query for ${name} notice:`, err);
    return [];
  }
}

export async function globalSearch(searchTerm) {
  if (!searchTerm?.trim()) return { videos: [], notes: [], questionPapers: [], placements: [] };

  const term = searchTerm.toLowerCase().trim();

  // Query Firestore collections safely
  const [fsVideos, fsNotes, fsQuestionPapers, fsPlacements] = await Promise.all([
    searchCollection(COLLECTIONS.VIDEOS, term),
    searchCollection(COLLECTIONS.NOTES, term),
    searchCollection(COLLECTIONS.QUESTION_PAPERS, term),
    searchCollection(COLLECTIONS.PLACEMENTS, term),
  ]);

  // Query static fallback knowledge base
  const staticNotes = getStaticNotes(term);

  const staticQuestionPapers = STATIC_QUESTION_PAPERS.filter(
    (qp) =>
      qp.title.toLowerCase().includes(term) ||
      qp.subject.toLowerCase().includes(term)
  );

  const staticVideos = STATIC_VIDEOS.filter(
    (v) =>
      v.title.toLowerCase().includes(term) ||
      v.subject.toLowerCase().includes(term) ||
      v.facultyName.toLowerCase().includes(term)
  );

  const staticPlacements = STATIC_PLACEMENTS.filter(
    (p) =>
      p.companyName.toLowerCase().includes(term) ||
      p.role.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
  );

  // Merge and deduplicate by title or id
  const videosMap = new Map();
  [...fsVideos, ...staticVideos].forEach((v) => videosMap.set(v.title || v.id, v));

  const notesMap = new Map();
  [...fsNotes, ...staticNotes].forEach((n) => notesMap.set(n.title || n.id, n));

  const qpMap = new Map();
  [...fsQuestionPapers, ...staticQuestionPapers].forEach((qp) => qpMap.set(qp.title || qp.id, qp));

  const placeMap = new Map();
  [...fsPlacements, ...staticPlacements].forEach((p) => placeMap.set(p.companyName || p.id, p));

  return {
    videos: Array.from(videosMap.values()),
    notes: Array.from(notesMap.values()),
    questionPapers: Array.from(qpMap.values()),
    placements: Array.from(placeMap.values()),
  };
}

