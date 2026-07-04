// src/utils/constants.js
export const ROLES = {
  STUDENT: "student",
  FACULTY: "faculty",
  ADMIN: "admin",
};

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const UG_SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
export const PG_SEMESTERS = [1, 2, 3, 4];

export const COURSE_TYPES = [
  { value: "ug", label: "UG" },
  { value: "pg", label: "PG" },
];

export const YEARS = [
  { value: 1, label: "1st Year" },
  { value: 2, label: "2nd Year" },
  { value: 3, label: "3rd Year" },
];

export const VIDEO_TYPES = [
  { value: "lecture", label: "Lecture" },
  { value: "class_recording", label: "Class Recording" },
];

export const SUBJECTS = [
  "Data Structures",
  "Algorithms",
  "Operating Systems",
  "Database Systems",
  "Computer Networks",
  "Machine Learning",
  "Software Engineering",
  "Web Technologies",
  "Compiler Design",
  "Artificial Intelligence",
  "Programming in C",
  "C++",
  "Java",
  "Python",
  "Cloud Computing",
  "Data Mining",
  "Cyber Security",
  "Computer Graphics",
  "Internet of Things",
  "Mobile Computing",
];

export const ALL_SUBJECTS = [...new Set(SUBJECTS)];

export const COLLECTIONS = {
  USERS: "users",
  VIDEOS: "videos",
  NOTES: "notes",
  QUESTION_PAPERS: "questionPapers",
  PLACEMENTS: "placements",
  BOOKMARKS: "bookmarks",
  NOTIFICATIONS: "notifications",
};

// Faculty names per subject (as specified)
export const FACULTY_NAMES = {
  DBMS: "M P Sudha",
  ASPNET: "R Saranya",
  OS: "Dr Dharani",
  DMT: "V Ponnila",
};

// Sample placement drives shown as fallback when Firestore has no data.
export const SAMPLE_PLACEMENTS = [
  {
    id: "sample-1",
    companyName: "Google",
    role: "Software Engineer",
    package: "32",
    eligibility: "CGPA 8+",
    skills: "DSA, System Design",
    deadline: "2026-08-15",
    applyLink: "https://careers.google.com",
  },
  {
    id: "sample-2",
    companyName: "Microsoft",
    role: "SDE",
    package: "28",
    eligibility: "CGPA 7.5+",
    skills: "C++, Azure",
    deadline: "2026-09-01",
    applyLink: "https://careers.microsoft.com",
  },
  {
    id: "sample-3",
    companyName: "Amazon",
    role: "SDE-1",
    package: "26",
    eligibility: "CGPA 7+",
    skills: "Java, AWS",
    deadline: "2026-09-10",
    applyLink: "https://amazon.jobs",
  },
  {
    id: "sample-4",
    companyName: "TCS Digital",
    role: "Systems Engineer",
    package: "12",
    eligibility: "CGPA 6+",
    skills: "Any Graduate",
    deadline: "2026-07-30",
    applyLink: "https://www.tcs.com/careers",
  },
  {
    id: "sample-5",
    companyName: "Infosys",
    role: "Technology Analyst",
    package: "9.5",
    eligibility: "CGPA 6.5+",
    skills: "Python, SQL",
    deadline: "2026-08-20",
    applyLink: "https://www.infosys.com/careers",
  },
  {
    id: "sample-6",
    companyName: "Wipro",
    role: "Project Engineer",
    package: "8",
    eligibility: "CGPA 6+",
    skills: "Any Graduate",
    deadline: "2026-08-25",
    applyLink: "https://careers.wipro.com",
  },
  {
    id: "sample-7",
    companyName: "Accenture",
    role: "Associate Software Engineer",
    package: "10",
    eligibility: "CGPA 6.5+",
    skills: "Communication, Logic",
    deadline: "2026-09-05",
    applyLink: "https://www.accenture.com/careers",
  },
  {
    id: "sample-8",
    companyName: "Flipkart",
    role: "SDE-1",
    package: "22",
    eligibility: "CGPA 7.5+",
    skills: "DSA, React, Node",
    deadline: "2026-09-15",
    applyLink: "https://www.flipkartcareers.com",
  },
  {
    id: "sample-9",
    companyName: "Zomato",
    role: "Software Developer",
    package: "18",
    eligibility: "CGPA 7+",
    skills: "Full Stack",
    deadline: "2026-09-20",
    applyLink: "https://www.zomato.com/careers",
  },
  {
    id: "sample-10",
    companyName: "Deloitte",
    role: "Analyst",
    package: "14",
    eligibility: "CGPA 7+",
    skills: "Analytics, Excel",
    deadline: "2026-08-10",
    applyLink: "https://www.deloitte.com/careers",
  },
  {
    id: "sample-11",
    companyName: "Cognizant",
    role: "Programmer Analyst",
    package: "7.5",
    eligibility: "CGPA 6+",
    skills: "Any Graduate",
    deadline: "2026-08-18",
    applyLink: "https://www.cognizant.com/careers",
  },
  {
    id: "sample-12",
    companyName: "IBM",
    role: "Associate Developer",
    package: "11",
    eligibility: "CGPA 7+",
    skills: "Java, Cloud",
    deadline: "2026-09-25",
    applyLink: "https://www.ibm.com/careers",
  },
];

// Fallback PDF URL (kept for backward compatibility — real PDFs are generated via pdfGenerator.js)
const SAMPLE_PDF = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

// Sample notes with metadata — PDFs are generated on-the-fly with real educational content
export const SAMPLE_NOTES = [
  { id: "sn-1", title: "Data Structures — Complete Lecture Notes", description: "Comprehensive notes covering arrays, linked lists, trees, graphs, and sorting algorithms with example code in C.", subject: "Data Structures", semester: 3, facultyName: "Dr. Ananya Rao", fileUrl: SAMPLE_PDF, year: 2, pages: 124, downloads: 2300, courseType: "ug" },
  { id: "sn-2", title: "Operating Systems — Process Management", description: "Detailed notes on processes, threads, CPU scheduling, synchronization, and deadlocks with diagrams.", subject: "Operating Systems", semester: 4, facultyName: "Dr Dharani", fileUrl: SAMPLE_PDF, year: 2, pages: 98, downloads: 1850, courseType: "ug" },
  { id: "sn-3", title: "Database Systems — SQL & Normalization", description: "SQL queries, joins, normalization forms, ER diagrams, and transaction management explained with examples.", subject: "Database Systems", semester: 4, facultyName: "M P Sudha", fileUrl: SAMPLE_PDF, year: 2, pages: 112, downloads: 2100, courseType: "ug" },
  { id: "sn-4", title: "Computer Networks — Protocols & Architecture", description: "OSI model, TCP/IP, routing algorithms, HTTP, DNS, and network security fundamentals.", subject: "Computer Networks", semester: 5, facultyName: "Prof. Rohan Das", fileUrl: SAMPLE_PDF, year: 3, pages: 136, downloads: 1650, courseType: "ug" },
  { id: "sn-5", title: "Machine Learning — Supervised Learning Algorithms", description: "Linear regression, decision trees, SVM, ensemble methods, and model evaluation techniques.", subject: "Machine Learning", semester: 6, facultyName: "Dr. Ananya Rao", fileUrl: SAMPLE_PDF, year: 3, pages: 88, downloads: 3100, courseType: "pg" },
  { id: "sn-6", title: "Web Technologies — HTML, CSS & JavaScript", description: "Frontend development fundamentals, DOM manipulation, responsive design, and introduction to React.", subject: "Web Technologies", semester: 5, facultyName: "Prof. Rohan Das", fileUrl: SAMPLE_PDF, year: 3, pages: 76, downloads: 4200, courseType: "ug" },
  { id: "sn-7", title: "Programming in C — Pointers & Memory Management", description: "Deep dive into pointers, dynamic memory allocation, file I/O, and data structures in C.", subject: "Programming in C", semester: 1, facultyName: "Dr. Meera Nair", fileUrl: SAMPLE_PDF, year: 1, pages: 92, downloads: 5400, courseType: "ug" },
  { id: "sn-8", title: "Python Programming — Object Oriented Concepts", description: "OOP in Python, inheritance, polymorphism, exception handling, and standard library tour.", subject: "Python", semester: 3, facultyName: "Prof. Karthik Iyer", fileUrl: SAMPLE_PDF, year: 2, pages: 68, downloads: 3800, courseType: "pg" },
];

export const SAMPLE_QUESTION_PAPERS = [
  { id: "sq-1", title: "Data Structures — End Semester Exam 2025", description: "Full question paper with 5 sections covering all DS topics. Includes algorithm design questions.", subject: "Data Structures", semester: 3, facultyName: "Dr. Ananya Rao", fileUrl: SAMPLE_PDF, year: "2025", regulation: "R2021", pages: 4, downloads: 3200, courseType: "ug" },
  { id: "sq-2", title: "Operating Systems — Mid Semester 2025", description: "2-hour mid-semester paper covering processes, threads, and CPU scheduling algorithms.", subject: "Operating Systems", semester: 4, facultyName: "Dr Dharani", fileUrl: SAMPLE_PDF, year: "2025", regulation: "R2021", pages: 3, downloads: 2800, courseType: "ug" },
  { id: "sq-3", title: "Database Systems — End Semester 2024", description: "Comprehensive paper with SQL queries, ER diagrams, normalization, and transaction problems.", subject: "Database Systems", semester: 4, facultyName: "M P Sudha", fileUrl: SAMPLE_PDF, year: "2024", regulation: "R2021", pages: 6, downloads: 4100, courseType: "ug" },
  { id: "sq-4", title: "Computer Networks — End Semester 2025", description: "Question paper covering OSI layers, routing, TCP/IP, and network security.", subject: "Computer Networks", semester: 5, facultyName: "Prof. Rohan Das", fileUrl: SAMPLE_PDF, year: "2025", regulation: "R2021", pages: 4, downloads: 1900, courseType: "ug" },
  { id: "sq-5", title: "Machine Learning — Mid Semester 2025", description: "Mid-term paper focused on regression, classification, and evaluation metrics.", subject: "Machine Learning", semester: 6, facultyName: "Dr. Ananya Rao", fileUrl: SAMPLE_PDF, year: "2025", regulation: "R2021", pages: 3, downloads: 3600, courseType: "pg" },
  { id: "sq-6", title: "Web Technologies — End Semester 2024", description: "Practical paper with HTML/CSS layout tasks, JavaScript programming, and React basics.", subject: "Web Technologies", semester: 5, facultyName: "Prof. Rohan Das", fileUrl: SAMPLE_PDF, year: "2024", regulation: "R2021", pages: 5, downloads: 4500, courseType: "ug" },
  { id: "sq-7", title: "Programming in C — End Semester 2025", description: "C programming paper with pointer problems, file handling, and data structure implementation.", subject: "Programming in C", semester: 1, facultyName: "Dr. Meera Nair", fileUrl: SAMPLE_PDF, year: "2025", regulation: "R2021", pages: 4, downloads: 5100, courseType: "ug" },
  { id: "sq-8", title: "Python — End Semester 2024", description: "Python OOP, exception handling, file I/O, and standard library usage questions.", subject: "Python", semester: 3, facultyName: "Prof. Karthik Iyer", fileUrl: SAMPLE_PDF, year: "2024", regulation: "R2021", pages: 3, downloads: 3400, courseType: "pg" },
];

export const STORAGE_PATHS = {
  VIDEOS: "videos/",
  NOTES: "notes/",
  QUESTION_PAPERS: "questionpapers/",
  LOGOS: "logos/",
};
