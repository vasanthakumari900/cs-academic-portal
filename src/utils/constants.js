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



export const STORAGE_PATHS = {
  VIDEOS: "videos/",
  NOTES: "notes/",
  QUESTION_PAPERS: "questionpapers/",
  LOGOS: "logos/",
};
