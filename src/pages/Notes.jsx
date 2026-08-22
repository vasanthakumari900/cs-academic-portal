import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFileText, FiDownload, FiBookOpen,
  FiArrowLeft, FiChevronRight, FiLayers,
  FiChevronDown, FiExternalLink, FiSearch, FiUploadCloud, FiCode, FiX,
  FiSliders, FiUserCheck, FiHeadphones, FiMic,
} from "react-icons/fi";
import { useFirestoreList } from "../hooks/useFirestoreList";
import { noteService } from "../services/noteService";
import { useAuth } from "../context/AuthContext";
import { STORAGE_PATHS } from "../utils/constants";
import { uploadFile } from "../services/storageService";
import toast from "react-hot-toast";
import { CURRICULUM, CURRICULUM_PG } from "../utils/curriculum";
import { downloadDriveFile } from "../utils/downloadUtils";
import PdfFileCard from "../components/common/PdfFileCard";
import { getSubjectIcon } from "../utils/subjectIcons";
import NotesTopAiHeader from "../components/notes/NotesTopAiHeader";
import AudioPodcastPlayerModal from "../components/notes/AudioPodcastPlayerModal";
import { loadUnitProgress } from "../services/aiTeacherPodcastEngine";
import AiVoiceVivaModule from "../components/common/AiVoiceVivaModule";

const COURSE_OPTIONS = [
  { value: "ug", label: "UG", desc: "Bachelor of Science in Computer Science (B.Sc.)" },
  { value: "pg", label: "PG", desc: "Master of Science in Computer Science (M.Sc.)" },
];

const PG_FIRST_YEAR_SEM1_FACULTY = {
  "Advanced Design and Analysis of Algorithms": "Ms. P. REVATHI",
  "Advanced Software Engineering": "Ms. Dr. N.M. Sangeetha",
  "Contemporary Web Technologies": "Ms. P. SUGANYA",
  "Data Communication and Networking": "Ms. M.P. SUDHA",
  "Python for Data Science": "Ms. S. Karthika",
};

const yearStyles = {
  1: { bg: "bg-[#0F4C81] text-white border-[#0A3356]", text: "text-[#0F4C81]" },
  2: { bg: "bg-[#0F4C81] text-white border-[#0A3356]", text: "text-[#0F4C81]" },
  3: { bg: "bg-[#0F4C81] text-white border-[#0A3356]", text: "text-[#0F4C81]" },
};

const subjectColors = [
  { from: "bg-[#F0F4F8]", to: "text-[#0F4C81] border-[#D9E2EC]", badge: "bg-[#F0F4F8] text-[#0F4C81]" },
  { from: "bg-[#E8F5E9]", to: "text-[#2E7D32] border-[#C8E6C9]", badge: "bg-[#E8F5E9] text-[#2E7D32]" },
  { from: "bg-[#FFF3E0]", to: "text-amber-800 border-[#FFE0B2]", badge: "bg-[#FFF3E0] text-amber-800" },
  { from: "bg-[#FFEBEE]", to: "text-red-800 border-[#FFCDD2]", badge: "bg-[#FFEBEE] text-red-800" },
  { from: "bg-[#E8EAF6]", to: "text-[#303F9F] border-[#C5CAE9]", badge: "bg-[#E8EAF6] text-[#303F9F]" },
];

const FACULTY_MAP = {
  "OPERATING SYSTEM": "Ms. Dr. DHARANI", "DATA MINING TECHNIQUES": "Ms. V. PONNILA",
  "ASP.NET": "Ms. R. SARANYA", "DATABASE MANAGEMENT SYSTEM": "Ms. M.P. SUDHA",
  "SOFTWARE ENGINEERING": "Ms. V. PONNILA",
  "Ethical Hacking": "Mrs. R. Poojitha Shree",
};

// Placeholder subjects in 2nd Year that share names with higher years — show name only, no content
const PLACEHOLDER_SUBJECTS = new Set(["OPERATING SYSTEM"]);

// Subjects that appear name-only in specific year+semester combos (subject listed but no notes/syllabus)
const NAME_ONLY_MAP = {
  "1-1": new Set(["FOUNDATION ENGLISH - I"]), // 1st Year Sem 1 - FOUNDATION ENGLISH - I name-only
  "1-2": new Set(["ENGLISH"]),          // 1st Year Sem 2 - ENGLISH name only (Tamil added)
  "2-1": new Set([]),                  // 2nd Year Sem 1 - None are name only
  "2-2": new Set(["ENGLISH"]),          // 2nd Year Sem 2 - ENGLISH name only
};

// Semester-specific unit keys for subjects shared across different semesters
// Maps "year-semester" -> subject -> Set of allowed unit numbers
const SEMESTER_UNITS = {
  "1-1": { "TAMIL": new Set([14, 15, 16, 17, 18]) },
  "1-2": { "ENGLISH": new Set([1]), "TAMIL": new Set([19, 20, 21, 22, 23]) },
  "2-1": { "TAMIL": new Set([1,2,3,4,5,6,7,8]), "Foundation English - III": new Set([1]) },
  "2-2": { "TAMIL": new Set([9,10,11,12,13]), "ENGLISH": new Set([2]) },
};

// Teachers exclusive to 1st Year Semester 1
const FIRST_YEAR_SEM1_FACULTY = {
  "TAMIL": "Dr. K. VADIVELMURUGAN / Dr. C. Karthik, Dr. J. SIVAKUMAR",
  "FOUNDATION ENGLISH - I": "Ms. S. RITZY WONDERBELL / Ms. C. VIDHYA",
  "MATHEMATICS PAPER I": "Mr. P. KARNAN, Mr. S. SATHISHKUMAR / Mr. R. SHANKAR",
  "PYTHON PROGRAMMING ESSENTIALS": "Ms. V. PONNILA / Ms. R. POOJITHA SHREE",
  "DATA STRUCTURES": "Ms. R. Lalitha / Ms. P.J. RAJAM",
};

// Teachers exclusive to 2nd Year Semester 1
const SECOND_YEAR_SEM1_FACULTY = {
  "Foundation English - III": "Ms. C. MALINI / Ms. C. VIDHYA",
  "TAMIL": "Dr. J. SIVAKUMAR / Dr. K. VADIVELMURUGAN",
  "Statistical Methods for Computer Science – I": "Ms. Dr. N.S. INDHUMATHY",
  "Web Application Development using ReactJS and Node.js": "Ms. K. DURGADEVI / Ms. Dr. N.M. Sangeetha",
  "Principles of operating Systems": "Ms. Dr. A. KAVITHA / Ms. K. DURGADEVI",
  "Object Oriented Programming Concepts using JAVA": "Ms. Dr. A. KAVITHA, Ms. S. Tamilarasi / Ms. Dr. G. SRILAKSHMI",
  "Web Application Development using AngularJS and Node.js": "Ms. Dr. N.M. Sangeetha",
};

const LAB_RECORDS_DATA = {
  "1-1": [
    { id: "lab-1-1-1", title: "Python Programming Essentials Practical Lab Manual & Record", subject: "PYTHON PROGRAMMING ESSENTIALS", fileName: "1st_Year_Sem1_Lab_Record.pdf", fileId: "1tCqpPAL_KYoQkEO1ksNbeLyxTbxBYV-N", type: "pdf" },
  ],
  "1-2": [
    { id: "lab-1-2-1", title: "Object Oriented Programming using C++ Practical Lab Record", subject: "OBJECT ORIENTED PROGRAMMING USING C++", fileName: "1st_Year_Sem2_Lab_Record.pdf", fileId: "1mwOgB_VcUtmgL4WOk3xRZHZbh5WrU-3d", type: "pdf" },
  ],
  "2-1": [
    { id: "lab-2-1-1", title: "Java Programming Concepts Practical Lab Record", subject: "Object Oriented Programming Concepts using JAVA", fileName: "2nd_Year_Sem1_Lab_Record.pdf", fileId: "1MODmT8KkDXWaFbpaDDXjGo63pLfLIAhH", type: "pdf" },
  ],
  "2-2": [
    { id: "lab-2-2-1", title: "Android App Development Practical Lab Record", subject: "ANDROID APP DEVELOPMENT", fileName: "2nd_Year_Sem2_Lab_Record.pdf", fileId: "1D9eAu2VLm4moN-_M0hWUzcRyZVLco2SD", type: "pdf" },
  ],
  "3-1": [
    { id: "lab-3-1-1", title: "Database Management System Practical Lab Record (Part 1)", subject: "DATABASE MANAGEMENT SYSTEM", fileName: "3rd_Year_Sem1_Lab_Record_Part1.pdf", fileId: "1vywg9DWpIPa6uWj71G0Gjc9dqDtD_dYr", type: "pdf" },
  ],
  "3-2": [],
};

const INFO_SECURITY_PDFS = [
  { id: "is-mod1", title: "Information Security - Module I Notes", fileName: "Information_Security_Module_1.pdf", fileId: "1rOBl2IZvrqGLfoqifWoE3n71KAVcIxGz", type: "pdf", subtitle: "Security Attacks, Services & Mechanisms" },
  { id: "is-mod2", title: "Information Security - Module II Notes", fileName: "Information_Security_Module_2.pdf", fileId: "1gepvH3Dj_hxmlqkk5w4E_1OHiUGUHDBu", type: "pdf", subtitle: "Public Key Cryptography & Key Management" },
  { id: "is-mod3", title: "Information Security - Module III Notes", fileName: "Information_Security_Module_3.pdf", fileId: "11pbyVnGKq-9qRvyljPptGVIU-ZT4G0P9", type: "pdf", subtitle: "Email Privacy & IP Security" },
  { id: "is-mod4", title: "Information Security - Module IV Notes", fileName: "Information_Security_Module_4.pdf", fileId: "1PXNKKpBDZQlGNFGjOqelLyepCJupne7P", type: "pdf", subtitle: "Web Security Requirements & Protocols" },
  { id: "is-mod5", title: "Information Security - Module V Notes", fileName: "Information_Security_Module_5.pdf", fileId: "19MGyHraoe4Y71UKG2YnIiKs2shHy-9Cr", type: "pdf", subtitle: "SNMP, Threats, Firewalls & IDS" },
];

const ADVANCED_SE_PDFS = [
  { id: "ase-pdf-1", title: "03-11.pdf", fileName: "03-11.pdf", fileId: "1qDHHJw_SAlwPTr40NSA5vkFKl3DLg033", type: "pdf", subtitle: "Lecture Notes (Units 3 to 11)" },
  { id: "ase-pdf-2", title: "03Jul20151007419.pdf", fileName: "03Jul20151007419.pdf", fileId: "19IMRYMfMm9SAcR-8J6TbfzdcwKkVpx62", type: "pdf", subtitle: "Software Engineering Principles & Practice Guide" },
  { id: "ase-pdf-3", title: "A Comprehensive Review of Software Development Life Cycle methodo.pdf", fileName: "A Comprehensive Review of Software Development Life Cycle methodo.pdf", fileId: "16KlqAVVsOO4pLkLNTD0fZTSe9lb-cQAP", type: "pdf", subtitle: "SDLC Methodologies Review Paper" },
  { id: "ase-pdf-4", title: "A3 - Arch Styles.pdf", fileName: "A3 - Arch Styles.pdf", fileId: "1Z7EWoRKlkBWx4533EdlY4eI5hpuAPq8b", type: "pdf", subtitle: "Software Architectural Styles & Patterns" },
  { id: "ase-pdf-5", title: "Sarabjeet-Kaur_-Comparative-Study-of-Effort-Estimation-Models-in-Software-Engineering_Paper.pdf", fileName: "Sarabjeet-Kaur_-Comparative-Study-of-Effort-Estimation-Models-in-Software-Engineering_Paper.pdf", fileId: "18TsmKjmiNG8tmT6PTwUb7_f4K0JGZ7sa", type: "pdf", subtitle: "Comparative Study of Effort Estimation Models" },
  { id: "ase-pdf-6", title: "SE_-UNIT-1-To-4-All.pptx.pdf", fileName: "SE_-UNIT-1-To-4-All.pptx.pdf", fileId: "1kYzAFuslGv6HtT2Q5qMK2BmDYO3wIeGA", type: "pdf", subtitle: "Software Engineering Units 1 to 4 Presentation Slides" },
];

const NOTES_DATA = {
  "PYTHON PROGRAMMING ESSENTIALS": {
    units: {
      1: {
        title: "Unit I",
        subtitle: "Setting and Checking variables",
        syllabus: "Setting and Checking variables: Data types - Using Constants - Introduction to Python -Values and types - Variables - Variable names and keywords - Operators and Operands-Expressions and Statements-Order of Operations-Comments.",
        hrs: 10,
        co: "CO1",
        files: [
          { id: "py-u1-1", title: "Python Programming Essentials - Unit I", fileName: "Python_Programming_Unit_1.pdf", fileId: "1JJPedETy61bgpiHGvwZTwa8ZxBM9bwbU", type: "pdf" }
        ]
      },
      2: {
        title: "Unit II",
        subtitle: "Functions & Recursion",
        syllabus: "Functions: Function calls-Type conversion functions-Math functions Definitions and uses Parameters arguments Local variables and parameters Fruitful functions Conditionals and Recursion: Modulus operator Boolean expressions Logical operators- Conditional execution-Alternative execution-Chained conditionals-Nested Conditionals-Recursion.",
        hrs: 10,
        co: "CO2",
        files: []
      },
      3: {
        title: "Unit III",
        subtitle: "Iteration & Strings",
        syllabus: "Iteration-Multiple assignment-Updating variables-While statement-break- String - Len-FString slices- Looping and counting-String methods-in operator-String comparison.",
        hrs: 10,
        co: "CO3",
        files: [
          { id: "py-u3-1", title: "Python Programming Essentials - Unit III (Part 1)", fileName: "Python_Programming_Unit_3_Part1.pdf", fileId: "1UjASUBSy3l3qKiDXQLXCJhQV1JsfUU4y", type: "pdf" },
          { id: "py-u3-2", title: "Python Programming Essentials - Unit III Notes", fileName: "Python_Programming_Unit_3_Notes.docx", fileId: "1G0TZNpATWYTw6D0nLl8A1L8o2gu-ZqzQ", type: "doc" }
        ]
      },
      4: {
        title: "Unit IV",
        subtitle: "Lists, Dictionaries & Tuples",
        syllabus: "Lists: List operations-list slices-list methods-Deleting elements-Lists and strings-Dictionaries: Dictionary as a set of counters-Looping and dictionaries-Reverse lookup-Global Variables, Tuples: Immutable-Tuple assignment-Tuples as return values Lists and tuples Dictionaries and tuples. Files: Reading and writing-Format operator- Filenames and Paths-Catching exceptions.",
        hrs: 15,
        co: "CO4",
        files: [
          { id: "py-u4-1", title: "Python Programming Essentials - Unit IV (Part 1)", fileName: "Python_Programming_Unit_4_Part1.pdf", fileId: "12KGfZJjbkQ7kJ16LpLG9xb7B1eUVblED", type: "pdf" },
          { id: "py-u4-2", title: "Python Programming Essentials - Unit IV (Part 2)", fileName: "Python_Programming_Unit_4_Part2.pdf", fileId: "1W_CsJAb5kZ4cszRzAz8ndHVoyMuz27T9", type: "pdf" },
          { id: "py-u4-3", title: "Python Programming Essentials - Unit IV (Part 3)", fileName: "Python_Programming_Unit_4_Part3.pdf", fileId: "1uQjkEwLU3bNy08kwzf4tnRR6ozHTyL0U", type: "pdf" },
          { id: "py-u4-4", title: "Python Programming Essentials - Unit IV (Part 4)", fileName: "Python_Programming_Unit_4_Part4.pdf", fileId: "1hRUpuWk7F4zd9Nt36bNSO-CkPna4Y-Hx", type: "pdf" },
          { id: "py-u4-5", title: "Python Programming Essentials - Unit IV (Part 5)", fileName: "Python_Programming_Unit_4_Part5.pdf", fileId: "1xNibq4k2CFPrDJBPwwte8sObe8AD92oh", type: "pdf" }
        ]
      },
      5: {
        title: "Unit V",
        subtitle: "Classes & Objects",
        syllabus: "Classes and Objects: User-defined types-Attributes- Instances as return values. Classes and functions: Time-Pure functions-Modifiers. Classes and methods: Object oriented features init method-str method-Operator overloading- Polymorphism- Inheritance- Class diagrams- Data encapsulation.",
        hrs: 15,
        co: "CO5",
        files: [
          { id: "py-u5-1", title: "Python Programming Essentials - Unit V Notes", fileName: "Python_Programming_Unit_5_Notes.docx", fileId: "1WF-X-0DN1gKR_xew77tpCG66QwSeQF5U", type: "doc" }
        ]
      }
    }
  },
  "FOUNDATION ENGLISH - I": {
    units: {
      1: {
        title: "Unit I",
        subtitle: "Environment and Sustainability",
        syllabus: "Poem: A Bird, came down the Walk - Emily Dickinson | Speech: Nobel Acceptance Speech - Wangari Mathai | Film: Elephant Whisperers - Kartiki Gonsalves",
        hrs: 12,
        co: "CO1",
        files: [{ id: "eng1-u1-1", title: "English Course Book - Semester I", fileName: "English_1stYear.pdf", fileId: "1hz0m4SITKQiGVa8wax8mIRSOuKryOYQp", type: "pdf" }]
      },
      2: {
        title: "Unit II",
        subtitle: "Food and Well-being",
        syllabus: "Feature: Phuphee and her healing Kyaele tchot - Sabah Mahjoor | Essay: Flavours that Attracted the Cream - Kamala Ramakrishnan | Book extract: The Bicycle and the Sweet Shop - Roald Dahl",
        hrs: 12,
        co: "CO2",
        files: []
      },
      3: {
        title: "Unit III",
        subtitle: "Hope and Humanity",
        syllabus: "Short Story: The Last Leaf - O’Henry | Biography: Vera Shaufeld - Holocaust Memorial Day Trust | Feature: A Real Good Samaritan - Bernard Hare | Speaking: Character sketches / Speaking activity based on the prescribed texts",
        hrs: 12,
        co: "CO3",
        files: []
      },
      4: {
        title: "Unit IV",
        subtitle: "Writing, Reading and Listening",
        syllabus: "Writing: Constructing sentences, Writing from pictures, Writing on food | Reading: Informative/factual passages, News reports | Listening: Announcements, Information",
        hrs: 12,
        co: "CO4",
        files: []
      },
      5: {
        title: "Unit V",
        subtitle: "Grammar and Vocabulary",
        syllabus: "Grammar in use | Error correction | Vocabulary activities based on the texts | Sample question papers",
        hrs: 12,
        co: "CO5",
        files: []
      }
    }
  },
  "DATA STRUCTURES": {
    units: {
      1: {
        title: "Unit I",
        subtitle: "Introduction & Arrays",
        syllabus: "Concept of Data Structures, Abstract Data Types (ADT). Linear vs Non-Linear. Arrays: Single and Multi-dimensional, address calculation, operations.",
        hrs: 12,
        co: "CO1",
        files: [
          { id: "ds-u1-1", title: "Data Structures - Unit I", fileName: "Data_Structures_Unit_1.pdf", fileId: "1-NsmikB2hUOR_Xs72yiFSTsnHW3g7Edp", type: "pdf" }
        ]
      },
      2: {
        title: "Unit II",
        subtitle: "Stacks & Queues",
        syllabus: "Stack ADT: Implementation using array, operations, applications (Infix to Postfix conversion, Evaluation of postfix). Queue ADT: Implementation using array, Circular Queue, Double Ended Queue (Deque), applications.",
        hrs: 12,
        co: "CO2",
        files: [
          { id: "ds-u2-1", title: "Data Structures - Unit II (Part 1)", fileName: "Data_Structures_Unit_2_Part1.pdf", fileId: "1wxSNRHHzGpxiiEQ1JTaDg9Fv2Shj1gaG", type: "pdf" },
          { id: "ds-u2-2", title: "Data Structures - Unit II (Part 2)", fileName: "Data_Structures_Unit_2_Part2.pdf", fileId: "1t1HzQSM1WuXwobKbL5OrRlTCw6SJopN3", type: "pdf" },
          { id: "ds-u2-3", title: "Data Structures - Unit II Notes", fileName: "Data_Structures_Unit_2_Notes.docx", fileId: "15_1A-AfD5Ols0ZgQaZ3AmM9JdESSbvNo", type: "doc" }
        ]
      },
      3: {
        title: "Unit III",
        subtitle: "Linked Lists",
        syllabus: "Singly Linked List: node creation, insertion, deletion, traversal. Doubly Linked List, Circular Linked List. Linked stacks and linked queues.",
        hrs: 12,
        co: "CO3",
        files: [
          { id: "ds-u3-1", title: "Data Structures - Unit III", fileName: "Data_Structures_Unit_3.pdf", fileId: "1TJezUtGE15YbkndWHBBuAENpWOtgWLl1", type: "pdf" }
        ]
      },
      4: {
        title: "Unit IV",
        subtitle: "Trees & Graphs",
        syllabus: "Trees: Basic terminology, Binary Trees, Traversals (Preorder, Inorder, Postorder). Binary Search Trees (BST): Search, insert, delete. Graphs: Representation (Matrix, List), Traversals (BFS, DFS).",
        hrs: 12,
        co: "CO4",
        files: [
          { id: "ds-u4-1", title: "Data Structures - Unit IV (Part 1)", fileName: "Data_Structures_Unit_4_Part1.docx", fileId: "1d6UqMCMnMn1GC5JDc5Qk7pgSIpBcF4ks", type: "doc" },
          { id: "ds-u4-2", title: "Data Structures - Unit IV (Part 2)", fileName: "Data_Structures_Unit_4_Part2.docx", fileId: "1gPo6klP5Y6O8Z1nqvhx0VdUeSzpsz4PG", type: "doc" }
        ]
      },
      5: {
        title: "Unit V",
        subtitle: "Sorting, Searching & Hashing",
        syllabus: "Sorting: Bubble sort, Insertion sort, Merge sort, Quick sort. Searching: Linear and Binary Search. Hashing: Hash tables, Hash functions, Collision resolution techniques.",
        hrs: 12,
        co: "CO5",
        files: []
      }
    }
  },
  "MATHEMATICS PAPER I": {
    units: {
      1: {
        title: "Unit I",
        subtitle: "Matrices",
        syllabus: "Symmetric, skew-symmetric, orthogonal and unitary matrices, eigen values and eigen-vectors (Diagonalization excluded), Cayley-Hamilton theorem (statement only) - verification of Cayley-Hamilton theorem - computation of inverse matrix using Cayley-Hamilton theorem.",
        hrs: 15,
        co: "CO1",
        files: []
      },
      2: {
        title: "Unit II",
        subtitle: "Trigonometry",
        syllabus: "Expansion of cos(nθ), sin(nθ) (where n is a positive integer) – Expansion of cos^n(θ), sin^n(θ) in a series of sines and cosines of multiples of θ. Hyperbolic functions - Relations between hyperbolic functions.",
        hrs: 15,
        co: "CO2",
        files: []
      },
      3: {
        title: "Unit III",
        subtitle: "Trigonometry, Calculus & Fourier Series",
        syllabus: "Inverse hyperbolic functions sinh^-1(x), cosh^-1(x) and tanh^-1(x) in terms of logarithmic functions. Separation into real and imaginary parts of sin(x+iy), cos(x+iy), and tan^-1(x+iy) - simple problems. INTEGRAL CALCULUS - Bernoulli's formula, reduction formulas for ∫ sin^n(x) dx, ∫ cos^n(x) dx, ∫ sin^m(x) cos^n(x) dx (m, n being positive integers). FOURIER SERIES – Fourier series for functions in (0, 2π).",
        hrs: 15,
        co: "CO3",
        files: []
      },
      4: {
        title: "Unit IV",
        subtitle: "Differential Calculus",
        syllabus: "Jacobians, curvature and radius of curvature in Cartesian coordinates, maxima and minima of functions of two variables - Simple problems.",
        hrs: 15,
        co: "CO4",
        files: []
      },
      5: {
        title: "Unit V",
        subtitle: "Laplace Transforms",
        syllabus: "Laplace transforms of standard functions. Laplace transform of e^-at f(t), t f(t), f(t)/t. Inverse Laplace transforms - Application to solution of linear differential equations of second order with constant coefficients - simple problems.",
        hrs: 15,
        co: "CO5",
        files: []
      }
    }
  },
  "PROGRAMMING IN PHP": {
    units: {
      1: {
        title: "Unit I",
        subtitle: "Variables & Control Flow",
        syllabus: "Checking variables Data types Using Constants Manipulating Variables with Operators. Controlling Program Flow: Writing Simple Conditional Statements - Writing More Complex Conditional Statements Repeating Action with Loops Working with String and NumericFunctions.",
        hrs: 15,
        co: "CO1",
        files: []
      },
      2: {
        title: "Unit II",
        subtitle: "Arrays & Date/Time",
        syllabus: "Working with Arrays: Storing Data in Arrays Processing Arrays with Loops and Iterations Using Arrays with Forms - Working with Array Functions Working with Dates and Times.",
        hrs: 15,
        co: "CO2",
        files: []
      },
      3: {
        title: "Unit III",
        subtitle: "Functions & Classes",
        syllabus: "Using Functions and Classes: Creating User-Defined Functions - Creating Classes Using Advanced OOP Concepts.",
        hrs: 15,
        co: "CO3",
        files: []
      },
      4: {
        title: "Unit IV",
        subtitle: "File Handling & Sessions",
        syllabus: "Working with Files and Directories: Reading Files-Writing Files- Processing Directories Cookies Session Management.",
        hrs: 15,
        co: "CO4",
        files: []
      },
      5: {
        title: "Unit V",
        subtitle: "Database & Input Validation",
        syllabus: "Working MySQL with PHP-database connectivity- Usage of MYSQL commands in PHP - Processing result sets of queries- Validating user input through Database layer and Application layer- Formatting query output with Character, Numeric, Date and time.",
        hrs: 15,
        co: "CO5",
        files: []
      }
    }
  },
  "CLOUD COMPUTING": {
    units: {
      1: {
        title: "Unit I",
        subtitle: "Cloud Foundation",
        syllabus: "Cloud Computing Foundation: Introduction to Cloud Computing Move to Cloud Computing Types of Cloud Working of Cloud Computing",
        hrs: 15,
        co: "CO1",
        files: []
      },
      2: {
        title: "Unit II",
        subtitle: "Cloud Architecture & Virtualization",
        syllabus: "Cloud Computing Architecture : Cloud Computing Technology Cloud Architecture Cloud Modeling and Design - Virtualization : Foundation Grid, Cloud and Virtualization Virtualization and Cloud Computing",
        hrs: 15,
        co: "CO2",
        files: []
      },
      3: {
        title: "Unit III",
        subtitle: "Data Storage & Services",
        syllabus: "Data Storage and Cloud Computing : Data Storage Cloud Storage Cloud Storage from LANs to WANs Cloud Computing Services : Cloud Services Cloud Computing at Work",
        hrs: 15,
        co: "CO3",
        files: []
      },
      4: {
        title: "Unit IV",
        subtitle: "Security & Cloud Tools",
        syllabus: "Cloud Computing and Security : Risks in Cloud Computing Data Security in Cloud Cloud Security Services Cloud Computing Tools : Tools and Technologies for Cloud Cloud Mashaps Apache Hadoop Cloud Tools",
        hrs: 15,
        co: "CO4",
        files: []
      },
      5: {
        title: "Unit V",
        subtitle: "Cloud Applications",
        syllabus: "Cloud Applications Moving Applications to the Cloud Microsoft Cloud Services Google Cloud Applications Amazon Cloud Services Cloud Applications",
        hrs: 15,
        co: "CO5",
        files: []
      }
    }
  },
  "COMPUTER NETWORKS": {
    units: {
      1: {
        title: "Unit I",
        subtitle: "Network Models",
        syllabus: "Introduction Uses of Computer Networks Network Hardware- Network Software- OSI Reference Model TCP/IPReference Model.",
        hrs: 10,
        co: "CO1",
        files: [
          { id: "cn-u1-1", title: "Computer Networks - Unit I (Part 1)", fileName: "Computer_Networks_Unit_1_Part1.pdf", fileId: "1aZFnGvezjY2LptWKchO-uZvh7iFls_VQ", type: "pdf" },
          { id: "cn-u1-2", title: "Computer Networks - Unit I (Part 2)", fileName: "Computer_Networks_Unit_1_Part2.pdf", fileId: "1-6FGW9OWqsNK7LVs9-iLrNBbVbg4hvB9", type: "pdf" }
        ]
      },
      2: {
        title: "Unit II",
        subtitle: "Physical Layer",
        syllabus: "Physical Layer Guided Transmission media Wireless Transmission Public switched Telephone Network LocalLoop Trunks Multiplexing- Switching.",
        hrs: 10,
        co: "CO2",
        files: [
          { id: "cn-u2-1", title: "Computer Networks - Unit II (Part 1)", fileName: "Computer_Networks_Unit_2_Part1.pdf", fileId: "14fTt0LfjL8uh_Q5JhJau5S6hqPi9k3jW", type: "pdf" },
          { id: "cn-u2-2", title: "Computer Networks - Unit II (Part 2)", fileName: "Computer_Networks_Unit_2_Part2.pdf", fileId: "15qvKa7Hvh9MtaJEkeTxM_UjFMNJbZf__", type: "pdf" },
          { id: "cn-u2-3", title: "Computer Networks - Unit II (Part 3)", fileName: "Computer_Networks_Unit_2_Part3.pdf", fileId: "1-1GOh8SnD_T3fDWBk6QkgvioMhGqBv4q", type: "pdf" },
          { id: "cn-u2-4", title: "Computer Networks - Unit II (Part 4)", fileName: "Computer_Networks_Unit_2_Part4.pdf", fileId: "1eATbXK3Anq13NygYiksGLDkCd12Hnz8d", type: "pdf" },
          { id: "cn-u2-5", title: "Computer Networks - Unit II (Part 5)", fileName: "Computer_Networks_Unit_2_Part5.pdf", fileId: "1ozK8A9tOHN-pttINfV8_XzKAWxE78hxz", type: "pdf" }
        ]
      },
      3: {
        title: "Unit III",
        subtitle: "Data Link Layer",
        syllabus: "Data Link Layer Design Issues- Error Detection and Correction- Simplex Stop andWait Protocol- Sliding Window Protocol.",
        hrs: 15,
        co: "CO3",
        files: []
      },
      4: {
        title: "Unit IV",
        subtitle: "Network Layer",
        syllabus: "Network Layer Design Issues Routing Algorithm- IP Protocol IP Addresses- Internet Control Protocols.",
        hrs: 15,
        co: "CO4",
        files: []
      },
      5: {
        title: "Unit V",
        subtitle: "Transport & Application Layers",
        syllabus: "Transport Layer: Addressing- Connection Establishment-Connection Release. Internet Transport Protocol: UDP-TCP. Application Layer: DNS- Electronic Mail- World Wide Web.",
        hrs: 15,
        co: "CO5",
        files: []
      }
    }
  },
  "INTRODUCTION TO DATA SCIENCE": {
    units: {
      1: {
        title: "Unit I",
        subtitle: "Introduction to Data Science",
        syllabus: "Introduction to Data Science Benefits and uses Facets of data Data science process Big data Ecosystem and data science",
        hrs: 15,
        co: "CO1",
        files: []
      },
      2: {
        title: "Unit II",
        subtitle: "Data Science Process",
        syllabus: "The Data science process Overview research goals - retrieving data - transformation ExploratoryData Analysis Model building",
        hrs: 15,
        co: "CO2",
        files: []
      },
      3: {
        title: "Unit III",
        subtitle: "Algorithms & Machine Learning",
        syllabus: "Algorithms - Machine learning algorithms Modeling process Types Supervised Unsupervised -Semi-supervised",
        hrs: 15,
        co: "CO3",
        files: []
      },
      4: {
        title: "Unit IV",
        subtitle: "Hadoop & NoSQL",
        syllabus: "Introduction to Hadoop framework Spark replacing MapReduce NoSQL ACID CAP BASE types",
        hrs: 15,
        co: "CO4",
        files: []
      },
      5: {
        title: "Unit V",
        subtitle: "Case Study",
        syllabus: "Case Study Prediction of Disease - Setting research goals - Data retrieval preparation - exploration -Disease profiling - presentation and automation",
        hrs: 15,
        co: "CO5",
        files: []
      }
    }
  },
  "DIGITAL IMAGE PROCESSING": {
    units: {
      1: {
        title: "Unit I",
        subtitle: "DIP Steps & Color Models",
        syllabus: "Introduction steps in image processing, Image acquisition, representation, sampling and quantization, relationship between pixels. color models basics of color image processing",
        hrs: 15,
        co: "CO1",
        files: []
      },
      2: {
        title: "Unit II",
        subtitle: "Spatial Domain Enhancement",
        syllabus: "Image enhancement in spatial domain some basic gray level transformations histogram processing enhancement using arithmetic, logic operations basics of spatial filtering and smoothing.",
        hrs: 15,
        co: "CO2",
        files: []
      },
      3: {
        title: "Unit III",
        subtitle: "Frequency Domain Enhancement",
        syllabus: "Image enhancement in Frequency domain Introduction to Fourier transform: 1-D, 2 D DFT and its inverse transform, smoothing and sharpening filters.",
        hrs: 15,
        co: "CO3",
        files: []
      },
      4: {
        title: "Unit IV",
        subtitle: "Image Restoration & Segmentation",
        syllabus: "Image restoration: Model of degradation and restoration process noise models restoration in the presence of noise- periodic noise reduction. Image segmentation: Thresholding and region based segmentation.",
        hrs: 15,
        co: "CO4",
        files: []
      },
      5: {
        title: "Unit V",
        subtitle: "Image Compression",
        syllabus: "Image compression: Fundamentals models information theory error free compression Lossy compression: predictive and transform coding. JPEG standard",
        hrs: 15,
        co: "CO5",
        files: []
      }
    }
  },
  "UNIFIED MODELING LANGUAGE": {
    units: {
      1: {
        title: "Unit I",
        subtitle: "UML Intro & Conceptual Model",
        syllabus: "Introduction to UML: Importance of modeling, principles of modeling, object oriented modeling, conceptual model of the UML, Architecture",
        hrs: 15,
        co: "CO1",
        files: []
      },
      2: {
        title: "Unit II",
        subtitle: "Basic Structural Modeling",
        syllabus: "Basic Structural Modeling: Classes, Relationships, common Mechanisms, anddiagrams.Interfaces,Types and Roles, Packages. Class & Object Diagrams: Terms, Concepts, modeling techniques for Class & Object Diagrams.",
        hrs: 15,
        co: "CO2",
        files: []
      },
      3: {
        title: "Unit III",
        subtitle: "Basic Behavioral Modeling",
        syllabus: "Basic Behavioral Modeling: Interactions, Interaction diagrams. Use cases, Use case Diagrams, Activity Diagrams",
        hrs: 15,
        co: "CO3",
        files: []
      },
      4: {
        title: "Unit IV",
        subtitle: "Advanced Behavioral Modeling",
        syllabus: "Advanced Behavioral Modeling: Events and signals, state machines, processes and Threads, time and space, state chart diagrams.",
        hrs: 15,
        co: "CO4",
        files: []
      },
      5: {
        title: "Unit V",
        subtitle: "Architectural Modeling",
        syllabus: "Architectural Modeling: Component, Deployment, Component diagrams and Deployment diagrams.",
        hrs: 15,
        co: "CO5",
        files: []
      }
    }
  },
  "Principles of operating Systems": { units: { 1: { title: "Unit I", subtitle: "Introduction to OS", syllabus: "INTRODUCTION - VIEWS AND GOALS - OPERATING-SYSTEM SERVICES - USER AND OPERATING-SYSTEM INTERFACE - SYSTEM CALL - TYPES OF SYSTEM CALLS", files: [{ id: "pos-u1-1", title: "Principles of Operating Systems - Unit I", fileName: "Principles_of_Operating_Systems_Unit1.pdf", fileId: "1g9NPHnEMAmQJoKvyB7qbpzpMxmUcB-99", type: "pdf" }] }, 2: { title: "Unit II", subtitle: "Process Scheduling & Synchronization", syllabus: "PROCESS SCHEDULING: BASIC CONCEPTS - SCHEDULING CRITERIA - SCHEDULING ALGORITHON - MULTIPLE-PROCESSOR SCHEDULING - CPU SCHEDULING. SYNCHRONIZATION: THE CRITICAL-SECTION PROBLEM - SYNCHRONIZATION HARDWARE - SEMAPHORES",          files: []
        }, 3: { title: "Unit III", subtitle: "Deadlocks", syllabus: "DEADLOCKS: DEADLOCK CHARACTERIZATION - METHODS FOR HANDLING DEADLOCKS - DEADLOCK PREVENTION - DEADLOCK AVOIDANCE - DEADLOCK DETECTION - RECOVERY FROM DEADLOCK", files: []
        }, 4: { title: "Unit IV", subtitle: "Memory Management", syllabus: "MEMORY-MANAGEMENT STRATEGIES: SWAPPING - CONTIGUOUS MEMORY ALLOCATION - SEGMENTATION - PAGING - STRUCTURE OF THE PAGE TABLE", files: []
        }, 5: { title: "Unit V", subtitle: "Storage Management", syllabus: "STORAGE MANAGEMENT: FILE SYSTEM - FILE CONCEPT - ACCESS METHODS - DIRECTORY AND DISK STRUCTURE - FILE SHARING - PROTECTION", files: []
        } } },
  "WEB TECHNOLOGY": {
    units: {
      1: {
        title: "Unit I",
        subtitle: "Introduction to HTML",
        syllabus: "Introduction to HTML -Anchor Tag - Hyperlink - Head and Body Section -Heading Horizontal - Ruler Paragraphs Tags -Images and Picture - Lists - Tables - Frames - Forms and forms elements.",
        files: [{ id: "wt-u1-1", title: "Web Technology - Unit I", fileName: "Web_Technology_Unit_I.pptx", fileId: "12dv8jFAYcQwZbXUEfAuFUrKYYuw736OJ", type: "pptx" }]
      },
      2: {
        title: "Unit II",
        subtitle: "HTML Forms and CSS",
        syllabus: "DHTML and Style sheets - Defining styles - Elements of style -Linking a style sheet to a html documents - Inline style - External style sheets - Multiple styles- Web page designing",
        files: [{ id: "wt-u2-1", title: "Web Technology - Unit II", fileName: "Web_Technology_Unit_II.pptx", fileId: "1ZEHoSFvqerdMt4cMtLMHIlNwh-UXSsqC", type: "pptx" }]
      },
      3: {
        title: "Unit III",
        subtitle: "JavaScript Basics",
        syllabus: "Introduction to Java script - Advantage of JavaScript - Data type -Variable Array - Operator and Expression - Control and looping Constructs - Functions - Dialog Boxes.",
        files: [{ id: "wt-u3-1", title: "Web Technology - Unit III", fileName: "Web_Technology_Unit_III.pptx", fileId: "1m-iUfVYv8GrE2TC4rLA3jiLLP7wxLuUC", type: "pptx" }]
      },
      4: {
        title: "Unit IV",
        subtitle: "XML and DHTML",
        syllabus: "JavaScript Document Object Model - Event Handling - Form Object Built in Object - User Defined Object-Cookies.",
        files: [{ id: "wt-u4-1", title: "Web Technology - Unit IV", fileName: "Web_Technology_Unit_IV.pdf", fileId: "1inVaANm-llf0-ixvVVwh2MpQhb-VqhAt", type: "pdf" }]
      },
      5: {
        title: "Unit V",
        subtitle: "Server Side Scripting (PHP)",
        syllabus: "Angular JS - Introduction - Data Binding and Directives - Services - Components and templates - Forms and validation",
        files: [{ id: "wt-u5-1", title: "Web Technology - Unit V", fileName: "Web_Technology_Unit_V.docx", fileId: "1LUux3fYsHW-CCkuEV0nogtqrRHfgDOOR", type: "doc" }]
      }
    }
  },
  "Web Application Development using ReactJS and Node.js": {
    units: {
      1: {
        title: "Unit I",
        subtitle: "Introduction to React",
        syllabus: "Introduction to ReactJS: Library vs Framework, Virtual DOM, create-react-app. React Elements, JSX, Components (Functional and Class), Props.",
        hrs: 12,
        co: "CO1",
        files: []
      },
      2: {
        title: "Unit II",
        subtitle: "State & Hooks",
        syllabus: "State Management: useState, useEffect. Handling Events, Conditional Rendering, Lists and Keys. Forms and Controlled Components.",
        hrs: 12,
        co: "CO2",
        files: []
      },
      3: {
        title: "Unit III",
        subtitle: "Component Patterns & Routing",
        syllabus: "Component Lifecycle, Composition vs Inheritance. React Router: Setup, Route, Link, useParams, useNavigate. Context API for global state.",
        hrs: 12,
        co: "CO3",
        files: []
      },
      4: {
        title: "Unit IV",
        subtitle: "Node.js Basics & Express",
        syllabus: "Introduction to Node.js: Event Loop, modules, npm. Express.js Framework: Router, Middlewares, handling HTTP requests and responses.",
        hrs: 12,
        co: "CO4",
        files: []
      },
      5: {
        title: "Unit V",
        subtitle: "Full Stack Integration",
        syllabus: "Connecting React frontend to Express/Node backend. REST API integration using fetch/axios. Database CRUD operations, deployment basics.",
        hrs: 12,
        co: "CO5",
        files: []
      }
    }
  },
  "Foundation English - III": {
    units: {
      1: {
        title: "Unit I",
        subtitle: "2nd Year - English Complete Notes",
        syllabus: "Language skills, advanced prose, reading comprehension, writing skill refinement.",
        files: [{ id: "eng-u2-1", title: "2nd Year English - Complete Notes", fileName: "English_2ndYear.pdf", fileId: "1Ji6UOgrPlrPk338Amz6s_9GnXuj7WosW", type: "pdf" }]
      },
      2: { title: "Unit II", subtitle: "Advanced Writing", syllabus: "Essay writing, report writing, summarizing and paraphrasing.", files: [] },
      3: { title: "Unit III", subtitle: "Literature and Drama", syllabus: "Selected literary works and drama, analytical studies of text.", files: [] },
      4: { title: "Unit IV", subtitle: "Communication Skills", syllabus: "Public speaking, presentation skills, group discussion preparation.", files: [] },
      5: { title: "Unit V", subtitle: "Vocabulary and Grammar", syllabus: "Idioms and phrases, advanced syntax, vocabulary building.", files: [] }
    }
  },
  "OPERATING SYSTEM": { units: { 1: { title: "Unit I", subtitle: "Introduction to OS", syllabus: "INTRODUCTION - VIEWS AND GOALS - OPERATING-SYSTEM SERVICES - USER AND OPERATING-SYSTEM INTERFACE - SYSTEM CALL - TYPES OF SYSTEM CALLS", files: [{ id: "os-u1-1", title: "OS Introduction", fileName: "OS-INTRO.pptx", fileId: "1GixI9_7uxRNzbf5qSe_wf4McmWaylQDS", type: "pptx" },{ id: "os-u1-2", title: "Session 2 - OS Basics", fileName: "ses-2.pptx", fileId: "1Zny7cAR4GR0YTRr3sIZT-u-FAOIQvQ-d", type: "pptx" },{ id: "os-u1-3", title: "OS Structures - Unit 1", fileName: "os structures-unit 1.pdf", fileId: "1O8-gnDMSgXurNN6O99N4S26z-UlONUbu", type: "pdf" },{ id: "os-u1-4", title: "OS Structures", fileName: "OSStructures.ppt", fileId: "1xqoPAFz_xavBAX8RR8nNErwANXnce-3B", type: "ppt" },{ id: "os-u1-5", title: "Processes", fileName: "os-processes.ppt", fileId: "1MoiwrzKonwOc4MH9wuO_sxKm92coXyYM", type: "ppt" },{ id: "os-u1-6", title: "Interprocess Communication", fileName: "interprocesscommunication-180721182943.pptx", fileId: "14mf_5YIS0TZB00phmq2kTSN8gT1gpfJY", type: "pptx" },{ id: "os-u1-7", title: "Threads - Unit 1", fileName: "threads-unit 1.pdf", fileId: "172mi8UGGUnGPAPF7zOeSKEBkqFucF5SM", type: "pdf" },{ id: "os-u1-8", title: "THREADS", fileName: "THREADS.pptx", fileId: "1uU4O05stk5cg2AVhfQBdC1VifAd_nrgJ", type: "pptx" }] }, 2: { title: "Unit II", subtitle: "Process Scheduling & Synchronization", syllabus: "PROCESS SCHEDULING: BASIC CONCEPTS - SCHEDULING CRITERIA - SCHEDULING ALGORITHON - MULTIPLE-PROCESSOR SCHEDULING - CPU SCHEDULING. SYNCHRONIZATION: THE CRITICAL-SECTION PROBLEM - SYNCHRONIZATION HARDWARE - SEMAPHORES",          files: [
            { id: "os-u2-1", title: "OS Unit 2 - Process Scheduling & Synchronization", fileName: "OS_Unit2.pdf", fileId: "1J8M3d7mVSU4oxkyp6q_Dq-m4tuhdVmLV", type: "pdf" }
          ]
        }, 3: { title: "Unit III", subtitle: "Deadlocks", syllabus: "DEADLOCKS: DEADLOCK CHARACTERIZATION - METHODS FOR HANDLING DEADLOCKS - DEADLOCK PREVENTION - DEADLOCK AVOIDANCE - DEADLOCK DETECTION - RECOVERY FROM DEADLOCK", files: [
            { id: "os-u3-1", title: "Deadlocks - Characterization, Prevention & Avoidance", fileName: "Deadlocks_Unit3.pdf", fileId: "1KEvkmZURClibxejv1uiRlpAENXP9mlSE", type: "pdf" }
          ]
        }, 4: { title: "Unit IV", subtitle: "Memory Management", syllabus: "MEMORY-MANAGEMENT STRATEGIES: SWAPPING - CONTIGUOUS MEMORY ALLOCATION - SEGMENTATION - PAGING - STRUCTURE OF THE PAGE TABLE", files: [
            { id: "os-u4-1", title: "Memory Management - Swapping & Contiguous Allocation", fileName: "Memory_Swapping_Allocation.pdf", fileId: "1w5o-MsZ6pgyB3DEbMuA7UHF2e38Dd3Jc", type: "pdf" },
            { id: "os-u4-2", title: "Segmentation", fileName: "Segmentation.pdf", fileId: "1pzxj1nLB8W2cbjLyfRXTx1SSfLu4KixD", type: "pdf" },
            { id: "os-u4-3", title: "Paging", fileName: "Paging.pdf", fileId: "1kIsJciTjPagETuo350PmDQUgOWLlbeAO", type: "pdf" },
            { id: "os-u4-4", title: "Structure of the Page Table", fileName: "Page_Table_Structure.pdf", fileId: "1U_G19A8JVehszrXY2XFjxKx6SBfBbptL", type: "pdf" },
            { id: "os-u4-5", title: "Memory Management Strategies Overview", fileName: "Memory_Management_Strategies.pdf", fileId: "1NkJUQVv7ufUccXPE1sI_zhfXFVRTql6L", type: "pdf" }
          ]
        }, 5: { title: "Unit V", subtitle: "Storage Management", syllabus: "STORAGE MANAGEMENT: FILE SYSTEM - FILE CONCEPT - ACCESS METHODS - DIRECTORY AND DISK STRUCTURE - FILE SHARING - PROTECTION", files: [
            { id: "os-u5-1", title: "File System & File Concept", fileName: "File_System_Concept.pdf", fileId: "1HYnm9Ih13bwLt2Z6XtCZS_ORu1BU5XVW", type: "pdf" },
            { id: "os-u5-2", title: "Access Methods & Directory Structure", fileName: "Access_Methods_Directory.pdf", fileId: "1Nu7e79tt6PV6la3cXv9ulvb_BCgMaEX1", type: "pdf" },
            { id: "os-u5-3", title: "File Sharing & Protection", fileName: "File_Sharing_Protection.pdf", fileId: "1c_UXqc3WB3whDm9r3tDZtPH3asdONrzK", type: "pdf" }
          ]
        } } },

  "DATABASE MANAGEMENT SYSTEM": { units: { 1: { title: "Unit I", subtitle: "Introduction to DBMS", syllabus: "INTRODUCTION - DATABASE SYSTEM - CHARACTERISTICS OF DBMS - ARCHITECTURE - DATABASE MODELS - SDLC - ENTITY RELATIONSHIP MODEL", files: [{ id: "dbms-u1-1", title: "DBMS Unit 1 - Introduction", fileName: "DBMS_Unit1.pdf", fileId: "1DJaFq3m3TLqlbDrfrcbNPHJiW-Q2u5kD", type: "pdf" }] }, 2: { title: "Unit II", subtitle: "Relational Model & Normalization", syllabus: "INTRODUCTION TO RELATIONAL DATABASE MODEL - KEYS - RELATIONAL ALGEBRA - NORMALIZATION", files: [] }, 3: { title: "Unit III", subtitle: "SQL", syllabus: "SQL: INTRODUCTION - DATA RETRIEVAL - FUNCTIONS - SUB QUERY - JOINS - DML - TCL", files: [
        { id: "dbms-u3-1", title: "DBMS Unit 3 - SQL (Part 1)", fileName: "DBMS_Unit3_SQL_Part1.pdf", fileId: "13Q9KqqdnfBfgK8QtHz0jBxwB8BUI_NRo", type: "pdf" },
        { id: "dbms-u3-2", title: "DBMS Unit 3 - SQL (Part 2)", fileName: "DBMS_Unit3_SQL_Part2.pdf", fileId: "1RkEh1IbKIwWJlT92ei4N10vJYoCySGAR", type: "pdf" }
      ] }, 4: { title: "Unit IV", subtitle: "PL/SQL", syllabus: "PL/SQL: INTRODUCTION - BASIC - CHARACTER SET - STRUCTURE - SQL CURSOR - SUBPROGRAMS", files: [] }, 5: { title: "Unit V", subtitle: "Exception Handling & Triggers", syllabus: "EXCEPTION HANDLER - TRIGGERS - CURSORS", files: [
        { id: "dbms-u5-1", title: "DBMS Unit 5 - Exception Handling & Triggers", fileName: "DBMS_Unit5_PLSQL_Exceptions_Triggers.pdf", fileId: "1WMupbPozr62sBzjuencYhYaSP1BRJBIz", type: "pdf" }
      ] } } },
  "DATA MINING TECHNIQUES": { units: {
    1: { title: "Unit I", subtitle: "Introduction to Data Mining", syllabus: "INTRODUCTION - DATA MINING - KINDS OF DATA - KINDS OF PATTERNS - APPLICATIONS - ISSUES", files: [
      { id: "dmt-u1-1", title: "DMT Unit 1 - Introduction to Data Mining (Part 1)", fileName: "DMT_Unit1_Part1.pptx", fileId: "1_8xLyy3sW6wik6TwtyIByBXbAsEAR8zc", type: "pptx" },
      { id: "dmt-u1-2", title: "DMT Unit 1 - Introduction to Data Mining (Part 2)", fileName: "DMT_Unit1_Part2.pptx", fileId: "1M4m8rqaFHIcpVHVWWHQvsK86yDOjTq9e", type: "pptx" },
      { id: "dmt-u1-3", title: "DMT Unit 1 - Kinds of Data & Patterns", fileName: "DMT_Unit1_Part3.pptx", fileId: "1PX-Eg6OUlGqwxF9Q4VWDAYhh_-pyeeEK", type: "pptx" }
    ] },
    2: { title: "Unit II", subtitle: "Data Preprocessing", syllabus: "DATA PREPROCESSING - DATA CLEANING - DATA INTEGRATION - DATA REDUCTION", files: [
      { id: "dmt-u2-1", title: "DMT Unit 2 - Data Preprocessing (Part 1)", fileName: "DMT_Unit2_Part1.pptx", fileId: "1JIDI_w7MlYt00c0mZH-1r8Zi-jAZKYXW", type: "pptx" },
      { id: "dmt-u2-2", title: "DMT Unit 2 - Data Preprocessing (Part 2)", fileName: "DMT_Unit2_Part2.pdf", fileId: "1mV8bZwHl2q5Npp0dZR2fjiwC_DeJqDXm", type: "pdf" },
      { id: "dmt-u2-3", title: "DMT Unit 2 - Data Cleaning & Integration", fileName: "DMT_Unit2_Part3.pptx", fileId: "1iMoQ5BCEGBhCwPiPXUlw0EADnKgmNNrU", type: "pptx" },
      { id: "dmt-u2-4", title: "DMT Unit 2 - Data Reduction", fileName: "DMT_Unit2_Part4.pdf", fileId: "1kwXx7RvoqPCuX-iAue_TLZ3PoZq0imPD", type: "pdf" }
    ] },
    3: { title: "Unit III", subtitle: "Mining Frequent Patterns", syllabus: "MINING FREQUENT PATTERNS - APRIORI ALGORITHM - ASSOCIATION RULES", files: [
      { id: "dmt-u3-1", title: "DMT Unit 3 - Frequent Patterns & Apriori Algorithm", fileName: "DMT_Unit3.pptx", fileId: "1T0hcjDoxW57II_5eXDXIXjMxzQsCEF-o", type: "pptx" }
    ] },
    4: { title: "Unit IV", subtitle: "Classification", syllabus: "CLASSIFICATION - DECISION TREE - BAYES CLASSIFICATION - RULE-BASED CLASSIFICATION", files: [
      { id: "dmt-u4-1", title: "DMT Unit 4 - Classification (Part 1)", fileName: "DMT_Unit4_Part1.pptx", fileId: "16MOr4LnUukcXE4Ey11RaTV67VCOiaz4y", type: "pptx" },
      { id: "dmt-u4-2", title: "DMT Unit 4 - Decision Tree & Bayes Classification", fileName: "DMT_Unit4_Part2.pptx", fileId: "1Oavo7kURP2xJlTjnNMLaYk2bYpuU2JJt", type: "pptx" },
      { id: "dmt-u4-3", title: "DMT Unit 4 - Rule-Based Classification", fileName: "DMT_Unit4_Part3.docx", fileId: "1d-tI-YD39y6KkfvBImYL0XxuF1X9w5VM", type: "doc" }
    ] },
    5: { title: "Unit V", subtitle: "Cluster Analysis", syllabus: "CLUSTER ANALYSIS - PARTITIONING METHODS - OUTLIER DETECTION", files: [
      { id: "dmt-u5-1", title: "DMT Unit 5 - Cluster Analysis & Outlier Detection", fileName: "DMT_Unit5.docx", fileId: "1MctHUSXAcVlRozM-aLbvm4qzQSDBOLFv", type: "doc" }
    ] }
  } },
  "ENGLISH": { units: { 1: { title: "Unit I", subtitle: "1st Year - English Complete Notes", syllabus: "PROSE, GRAMMAR AND VOCABULARY - LISTENING SKILLS - READING COMPREHENSION - VOCABULARY BUILDING - PARTS OF SPEECH - TENSES AND ARTICLES", files: [{ id: "eng-u1-1", title: "English Course Book - Semester II", fileName: "English_Sem2_Complete_Notes.pdf", fileId: "/English_Sem2_Complete_Notes.pdf", type: "pdf" }] }, 2: { title: "Unit II", subtitle: "2nd Year - English Complete Notes", syllabus: "POETRY AND COMMUNICATION SKILLS - POETRY APPRECIATION - EFFECTIVE COMMUNICATION - SENTENCE CONSTRUCTION - PARAGRAPH WRITING - TECHNICAL VOCABULARY", files: [{ id: "eng-u2-1", title: "2nd Year English - Complete Notes", fileName: "English_2ndYear.pdf", fileId: "1YzMj4-aF3A3g_J6mVV3VRwXzaWl9XKkk", type: "pdf" }] }, 3: { title: "Unit III", subtitle: "Short Stories & Writing Skills", syllabus: "SHORT STORIES AND WRITING SKILLS - LITERARY ANALYSIS - ESSAY WRITING - LETTER WRITING - RESUME PREPARATION - BUSINESS CORRESPONDENCE", files: [] }, 4: { title: "Unit IV", subtitle: "Drama & Presentation Skills", syllabus: "DRAMA AND PRESENTATION SKILLS - DRAMATIC LITERATURE - ORAL PRESENTATIONS - GROUP DISCUSSIONS - PUBLIC SPEAKING SKILLS - REPORT WRITING", files: [] }, 5: { title: "Unit V", subtitle: "Functional English & Soft Skills", syllabus: "FUNCTIONAL ENGLISH AND SOFT SKILLS - SOFT SKILLS DEVELOPMENT - INTERVIEW SKILLS - PROFESSIONAL ETIQUETTE - SUMMARIZING - PRECISE WRITING", files: [] } } },
  "ASP.NET": { units: { 1: { title: "Unit I", subtitle: "Overview of ASP.NET Framework", syllabus: "OVERVIEW OF ASP.NET FRAMEWORK - PAGE STRUCTURE - COMPILER DIRECTIVES - NAMESPACE", files: [{ id: "u1-1", title: "Overview of ASP.Net Framework", fileName: "Overview of ASP.Net Framework.pdf", fileId: "173-KUv6pOGV8o8ihTckpLwvkvDyKv9nj", type: "pdf" },{ id: "u1-2", title: "ASP Page Structure", fileName: "ASP page structure.pdf", fileId: "1OcVM4CDJTvGvdT9WfqLHFd1Sz61kEO3a", type: "pdf" },{ id: "u1-3", title: "Compiler Directives", fileName: "Compiler Directives.pdf", fileId: "14CpNpp7OVns3R6Kj4dWy81Io4FiFVvYi", type: "pdf" },{ id: "u1-4", title: "NAMESPACE", fileName: "NAMESPACE.pdf", fileId: "1cbb7Mt3m7MKXJkW_Hu_YsR4tWKDJanP3", type: "pdf" },{ id: "u1-5", title: "Overview of ASP.Net Framework (Notes)", fileName: "Overview of ASP.Net Framework (Notes)", fileId: "1VjVHcuCldGrTi6trGyb5gf4Z81RwpzsmsEqKm4Tajfg", type: "doc" }] }, 2: { title: "Unit II", subtitle: "ASP.NET Controls", syllabus: "UNDERSTANDING ASP.NET CONTROLS - STANDARD CONTROLS - DISPLAYING INFORMATION - ACCEPTING USER INPUT", files: [{ id: "u2-1", title: "ASP.NET UNIT - 2", fileName: "ASP.NET UNIT -2.pptx", fileId: "1t4g4ab9d5HdKZGuGxmYpWcAwTkjmoqjm", type: "pptx" }] }, 3: { title: "Unit III", subtitle: "Validation & Rich Controls", syllabus: "VALIDATION CONTROLS - REQUIRED FIELD VALIDATOR - RANGE VALIDATOR - RICH CONTROLS - ADROTATOR, CALENDAR", files: [{ id: "u3-1", title: "Validation Controls", fileName: "Validation Controls.docx", fileId: "1z-1R0gaqaVaSIvgRybN5AiA8ExYGsJfY", type: "docx" },{ id: "u3-2", title: "Calendar Control in ASP.NET", fileName: "Calendar Control in ASP.pdf", fileId: "1DInHlyYjC7OpG7sY1i0l987_uZLjo5iY", type: "pdf" },{ id: "u3-3", title: "Rich Controls", fileName: "RICH CONTROLS.pdf", fileId: "1xE1sIoFOWnkI5D7GRbm0EtgyDHpxwYg0", type: "pdf" }] }, 4: { title: "Unit IV", subtitle: "Data Access in ASP.NET", syllabus: "DATA BOUND CONTROL - SQLDATASOURCE - OLEDB - DATASET", files: [{ id: "u4-1", title: "Data Bound Controls", fileName: "data bound controls.docx", fileId: "1IXY-buceR6cV10jEbMClDXUuveYjVWUo", type: "docx" },{ id: "u4-2", title: "Simple Data Bound Controls", fileName: "Simple Data Bound Controls.pdf", fileId: "1PCHmZ2U3uUV8Ah83Do1vZ2bTk4uBArx7", type: "pdf" }] }, 5: { title: "Unit V", subtitle: "List Controls & State Management", syllabus: "LIST CONTROLS - GRID VIEW - REPEATER - STATE MANAGEMENT - COOKIES - SESSION", files: [{ id: "u5-1", title: "List Controls", fileName: "Listbox RadiobuttionList CheckboxList BulletedList.pdf", fileId: "1hGMGwEMhCFf1J_RyY3pKNKNAEVXnkwH2", type: "pdf" },{ id: "u5-2", title: "ADO.NET Architecture", fileName: "ADO.NET ARCHITECTURE.pdf", fileId: "12EETP-MtzBDgmT_ybJ0xiTebiksP5In4", type: "pdf" },{ id: "u5-3", title: "Application and Session State", fileName: "Application and Session State.pdf", fileId: "1FnobkINTlyJp4Nbi31oTLAtN6_PtLrUX", type: "pdf" },{ id: "u5-4", title: "Cookies", fileName: "COOKIES.pdf", fileId: "1Lw-RzMw2vLCAbYNxR7HzcfYs_Wt102Ob", type: "pdf" },{ id: "u5-5", title: "Web Service", fileName: "WEB SERVICE.pdf", fileId: "1lbt5Eqo79yie2GsHA6O5sgvq0j2V3xnu", type: "pdf" }] } } },
 "Object Oriented Programming Concepts using JAVA": { units: {
       1: { title: "Unit I", subtitle: "Introduction to Java", syllabus: "Introduction to Java - Features of Java - Java Environment - Tokens- Data Types - Variables - Arrays - Operators - Conditional Statements-Iterative Statements-General Structure of a Java Program - Fields and Methods Declaration-Command Line Arguments.", hrs: 12, co: "CO1", files: [{ id: "java-u1-1", title: "Java Unit 1 - Introduction to Java (Part 1)", fileName: "Java_Unit1_Part1.pdf", fileId: "1EAcmy8ppwjPZ25Ver8c6XhZuRxwh3e6l", type: "pdf" }, { id: "java-u1-2", title: "Java Unit 1 - Introduction to Java (Part 2)", fileName: "Java_Unit1_Part2.pdf", fileId: "11cymR4t4VldBQ5bRpXBmpMsqTRXncvgs", type: "pdf" }] },
       2: { title: "Unit II", subtitle: "Classes and Objects & Inheritance", syllabus: "Classes and Objects - Constructors - Method Overloading - Static keyword - Final keyword--String & String Buffer Class. Inheritance: Keyword extends -Types -of Inheritance -Keyword super - Overriding of methods - Abstract class and methods. Interface: Defining Interface-Keyword implements -Multiple Inheritance using Interface.", hrs: 12, co: "CO1, CO2", files: [{ id: "java-u2-1", title: "Java Unit 2 - Classes and Inheritance", fileName: "Java_Unit2.pdf", fileId: "1PRi2MFawHIDfj3eDrJZ6nqRzwqhKn5rW", type: "pdf" }] },
       3: { title: "Unit III", subtitle: "Packages & Exception Handling", syllabus: "Packages: User-Defined Packages: Naming conventions - Creating and accessing Packages. Exception Handling: Types of errors - Syntax of Exception handling code - Built-in Exceptions - Multiple catch statements - Nested try block - Finally statement- Throwing our exception using throw - Method throwing exception using throws keyword.", hrs: 12, co: "CO1, CO3", files: [{ id: "java-u3-1", title: "Java Unit 3 - Exception Handling & Multithreading", fileName: "Java_Unit3.pdf", fileId: "1b1ucYCpHPUvq614eY8dU6NsGe07tMcOK", type: "pdf" }] },
       4: { title: "Unit IV", subtitle: "Threads & I/O Streams", syllabus: "Threads: Introduction- Thread States or life cycle of thread- Creation of threads using Thread class and Runnable interface - Thread methods -Thread Priorities -Thread Synchronization. I/O Streams: Stream classes - Byte stream classes -Character stream classes - File Streams - Using File class - I/O Exceptions-Random access files.", hrs: 12, co: "CO4", files: [{ id: "java-u4-1", title: "Java Unit 4 - Collections Framework", fileName: "Java_Unit4.pdf", fileId: "1oSZNVAFTDgVoFS-XGOT89N88YRVAo5RE", type: "pdf" }] },
       5: { title: "Unit V", subtitle: "Applets & AWT Controls", syllabus: "Applets: Difference between applet and application - Applet life cycle - Building Applet code using Applet tag - Passing parameters to Applets- Drawing various shapes using Graphics Class. AWT Controls: Buttons, Labels, TextField, TextArea, Choice, CheckBox, List, ScrollBar and Layout Managers.", hrs: 12, co: "CO5", files: [{ id: "java-u5-1", title: "Java Unit 5 - Applets & GUI", fileName: "Java_Unit5.pdf", fileId: "1X3bah3gZVtI4Xuih0P9WXAU-jZ8xgyMP", type: "pdf" }] }
    } },
 "TAMIL": { units: {
      1: { title: "செய்யுள் I", subtitle: "சங்க இலக்கியம் - சங்க இலக்கியங்களின் தோற்றம்", syllabus: "சங்க இலக்கியத் தோற்றம் - சங்க காலம் - சங்க இலக்கியங்கள் - பதினெண் மேல்கணக்கு - பதினெண் கீழ்க்கணக்கு", files: [{ id: "tam-u1-1", title: "தமிழ் செய்யுள் 1 - சங்க இலக்கியம்", fileName: "Tamil_Unit1.pdf", fileId: "1G8K2_-fioXUfYxVYrkMewrUXXVCif4gs", type: "pdf" },{ id: "tam-u1-2", title: "தமிழ் இலக்கிய வரலாறு", fileName: "Tamil_Ilakkiya_Varalaru.pdf", fileId: "1rdcO8C66yHARYLaTkuvSOKCWampdAgPJ", type: "pdf" }] },
      2: { title: "செய்யுள் II", subtitle: "சங்க இலக்கியங்களின் போர்க்களங்கள்", syllabus: "சங்க போர்க்களங்கள் - ஐந்திணை - திணைக் கோட்பாடு - திணை மயக்கம்", files: [{ id: "tam-u2-1", title: "தமிழ் செய்யுள் 2 - சங்க போர்க்களங்கள்", fileName: "Tamil_Unit2.pdf", fileId: "1nUaNYAvG0ctYGMoZsUtmkVacDfwTPufY", type: "pdf" }] },
      3: { title: "செய்யுள் III", subtitle: "சிலப்பதிகாரம் - காப்பிய இலக்கியம்", syllabus: "சிலப்பதிகாரம் - காப்பியத் தோற்றம் - காப்பிய இலக்கியங்களின் தன்மைகள் - சாதுவின் உண்மை", files: [{ id: "tam-u3-1", title: "தமிழ் செய்யுள் 3 - சிலப்பதிகாரம்", fileName: "Tamil_Unit3.pdf", fileId: "1pi3c_P_-ebA-GWVnAIb-803UllYsXErA", type: "pdf" }] },
      4: { title: "செய்யுள் IV", subtitle: "மணிமேகலை - புத்தத்த இலக்கியம்", syllabus: "மணிமேகலை - புத்தத்த இலக்கியத் தோற்றம் - சாதுகளின் வரையறை - இனக்கம்", files: [{ id: "tam-u4-1", title: "தமிழ் செய்யுள் 4 - மணிமேகலை", fileName: "Tamil_Unit4.pdf", fileId: "1q5Tj-YCdd5x4-KtG5Cm9PxsmP9tywZtN", type: "pdf" }] },
      5: { title: "செய்யுள் V", subtitle: "தேவாரம் - பக்தி இலக்கியம்", syllabus: "தேவாரம் - பக்தி இலக்கியத் தோற்றம் - நாயன்மார்கள் - நால்வர் - முதல் வரலாறு", files: [{ id: "tam-u5-1", title: "தமிழ் செய்யுள் 5 - தேவாரம்", fileName: "Tamil_Unit5.pdf", fileId: "112PmbaBnPjUog2Tbwj-FeoOGyoij1k1c", type: "pdf" }] },
      6: { title: "செய்யுள் VI", subtitle: "திருவாசகம் - சைவ இலக்கியம்", syllabus: "திருவாசகம் - சைவ இலக்கியம் - மாணிக்கவாசகர் - பதிற்றுப்பத்தந்தாதி", files: [{ id: "tam-u6-1", title: "தமிழ் செய்யுள் 6 - திருவாசகம்", fileName: "Tamil_Unit6.pdf", fileId: "18ZCqfqlvXawkRyeanusTdQp7LHsQwb8e", type: "pdf" }] },
      7: { title: "செய்யுள் VII", subtitle: "கலித்தொகை - பட்டுப்பாட்டு", syllabus: "கலித்தொகை - பட்டுப்பாட்டு - முதல் குழு - திணைமலை நூறு - எட்டுத்தொகை", files: [{ id: "tam-u7-1", title: "தமிழ் செய்யுள் 7 - கலித்தொகை", fileName: "Tamil_Unit7.pdf", fileId: "1il76fMyzY3311msevv5oNsseaMkeXWqx", type: "pdf" }] },
      8: { title: "செய்யுள் VIII", subtitle: "தொல்காப்பியம் - இலக்கண இலக்கியம்", syllabus: "தொல்காப்பியம் - இலக்கண இலக்கியத் தோற்றம் - எழுத்து, சொல், பொருளதிகாரம் - தொல்காப்பியர்", files: [{ id: "tam-u8-1", title: "தமிழ் செய்யுள் 8 - தொல்காப்பியம்", fileName: "Tamil_Unit8.pdf", fileId: "11pNVGPtJUkKb3WzNhdobc2ddet9fk0b2", type: "pdf" }] },
      9: { title: "செய்யுள் I", subtitle: "பாலைத்திணை - பிரிவு மற்றும் காதல்", syllabus: "பாலைத்திணை - பிரிவுத் துன்பம் - தலைவன் பிரிவு - தலைவி ஏக்கம் - பாலை நில இயற்கை - வழிப்பயண இடையூறுகள்", files: [{ id: "tam-u9-1", title: "தமிழ் செய்யுள் 9 - பாலைத்திணை", fileName: "Tamil_Unit9.pdf", fileId: "1NiWfJD5z_2lC2jyFne9sc2c57_OIRG6W", type: "pdf" }] },
      10: { title: "செய்யுள் II", subtitle: "குறிஞ்சித்திணை - கபிலர் பாடல்கள்", syllabus: "குறிஞ்சித்திணை - கபிலர் - மலை நிலம் - தலைவன் தலைவி சந்திப்பு - குறிஞ்சி நில இயற்கை வளம்", files: [{ id: "tam-u10-1", title: "தமிழ் செய்யுள் 10 - குறிஞ்சித்திணை", fileName: "Tamil_Unit10.pdf", fileId: "1Z-7eaIjSCL-pbiyCoeaweIOrdK8gibRJ", type: "pdf" }] },
      11: { title: "செய்யுள் III", subtitle: "அகநானூறு - திணைக் கோட்பாடு", syllabus: "அகநானூறு - முல்லைத்திணை - நெய்தற்றிணை - மருதத்திணை - ஐந்திணை இலக்கணம் - திணைக் கோட்பாடு", files: [{ id: "tam-u11-1", title: "தமிழ் செய்யுள் 11 - அகநானூறு", fileName: "Tamil_Unit11.pdf", fileId: "1XwHqqWbQ6fXACwLYcZfNa4VzQTYzj4sq", type: "pdf" }] },
      12: { title: "செய்யுள் IV", subtitle: "கலித்தொகை - பாலைக்கலி", syllabus: "கலித்தொகை - பாலைக்கலி - குறிஞ்சிக்கலி - கலிப்பாடல்கள் - தலைவன் தலைவி உரையாடல் - கற்பு மற்றும் களவு வாழ்க்கை", files: [{ id: "tam-u12-1", title: "தமிழ் செய்யுள் 12 - கலித்தொகை", fileName: "Tamil_Unit12.pdf", fileId: "1xILKC8OrlJ61HYwTnAsF0v0EWpMKWH6J", type: "pdf" }] },
      13: { title: "செய்யுள் V", subtitle: "ஐங்குறுநூறு - பாலை மற்றும் குறிஞ்சி", syllabus: "ஐங்குறுநூறு - பாலைப்பாட்டு - குறிஞ்சிப்பாட்டு - சிற்றிலக்கியங்கள் - பத்துப்பாட்டு - எட்டுத்தொகை மரபு", files: [{ id: "tam-u13-1", title: "தமிழ் செய்யுள் 13 - ஐங்குறுநூறு", fileName: "Tamil_Unit13.pdf", fileId: "1oU3_V7mFYfYPjJlMbesrdkBWDaVabNjX", type: "pdf" }] },
      14: { title: "அலகு I", subtitle: "செய்யுள், சிறுகதை, மொழிப்பயிற்சி, இலக்கிய வரலாறு", syllabus: "செய்யுள்: 1. மகாகவி சுப்பிரமணிய பாரதியார் - தமிழ், கண்ணன் பாட்டு - கண்ணம்மா என் காதலி - 6; 2. பாவேந்தர் பாரதிதாசன் - நூலைப்படி; 3. கவிமணி தேசிக விநாயகம்பிள்ளை - மலரும் மாலையும் - வாழ்க்கைத் தத்துவங்கள். சிறுகதை: புதுமைப்பித்தன் - பால்வண்ணம்பிள்ளை. மொழிப்பயிற்சி: 5. பிழை நீக்கி எழுதுதல் (ர - ற வேறுபாடு, ல - ள - ழ வேறுபாடு, ந - ண - ன வேறுபாடு). பாடம் தழுவிய இலக்கிய வரலாறு: 6. மரபுக் கவிதைகள் தோற்றமும் வளர்ச்சியும்.", co: "CO1", files: [] },
      15: { title: "அலகு II", subtitle: "செய்யுள், சிறுகதை, மொழிப்பயிற்சி, இலக்கிய வரலாறு", syllabus: "செய்யுள்: 7. கவிஞர் தமிழ் ஒளி - வருங்கால மனிதன் வருக!; 8. கவிஞாயிறு தாராபாரதி - வேலைகளல்ல வேள்விகளே; 9. கவிஞர் மு. மேத்தா - ஆகாயத்துக்கு அடுத்த வீடு - இடிந்து கிடக்கின்றன மசூதிகள்; 10. கவிக்கோ அப்துல் ரகுமான் - ஆலாபனை பற்று வரவு. சிறுகதை: 11. ஜெயகாந்தன் - நான் இருக்கிறேன். மொழிப்பயிற்சி: 12. வல்லினம் மிகும் இடங்கள், வல்லினம் மிகா இடங்கள். பாடம் தழுவிய இலக்கிய வரலாறு: 13. புதுக்கவிதைகள் தோற்றமும் வளர்ச்சியும்.", co: "CO2", files: [] },
      16: { title: "அலகு III", subtitle: "செய்யுள், சிறுகதை, மொழிப்பயிற்சி, இலக்கிய வரலாறு", syllabus: "செய்யுள்: 14. கவிஞர் நா. காமராசன் - கறுப்பு மலர்கள் - காகிதப் பூக்கள்; 15. கவிஞர் நா. முத்துக்குமார் - குழந்தைகள் நிறைந்த வீடு - (தேர்ந்தெடுக்கப் பெற்ற 10 ஐக்கூக் கவிதைகள்); 16. நாட்டுப்புறப் பாடல்கள் - நாட்டுப்புறத்தில் - மு. தங்கராசன் - தாலாட்டுப் பாடல்கள் (தேர்ந்தெடுக்கப் பெற்ற 3 பாடல்கள்). சிறுகதை: 17. கி. ராஜநாராயணன் - கதவு. மொழிப்பயிற்சி: 18. தொடர்ப்பிழை நீக்கம், திணை, பால், காலம், இடம், எண் மயக்கங்கள். பாடம் தழுவிய இலக்கிய வரலாறு: 19. சிறுகதை தோற்றமும் வளர்ச்சியும்.", co: "CO3", files: [] },
      17: { title: "அலகு IV", subtitle: "செய்யுள், சிறுகதை, மொழிப்பயிற்சி, இலக்கிய வரலாறு", syllabus: "செய்யுள்: 20. மொழிபெயர்ப்புக் கவிதைகள் (I. பாப்லோ நெருடா கவிதைகள் - துயர்மிகு வரிகளை இன்றிரவு நான் எழுதலாம் - கவிதை - தமிழாக்கம்: ஆ. இரா. வேங்கடாசலபதி | II. இரவீந்திரநாத் தாகூர் - தாகூரின் தமிழ்க் கீதாஞ்சலி என் பிரார்த்தனை - தமிழாக்கம்: சி. ஜெயபாரதன்); 21. அயலகக் கவிதைகள் (I. இரா. தண்டாயுதம் - மலேசிய நாட்டுப்புறப் பாடல்கள் (தேர்ந்தெடுக்கப் பெற்ற 2 கவிதைகள்): 1. தோட்டப்புறத் தொழில், 2. வந்தகத வாழ்ந்தகத | II. மஹாகவி - பதினோரு ஈழத்துக் கவிஞர்கள் - தேரும் திங்களும் | III. சேரன் - நீ இப்பொழுது இறங்கும் ஆறு கானல் வரி). சிறுகதை: 22. ஆர். சூடாமணி - அந்நியர்கள். மொழிப்பயிற்சி: 23. பேச்சுக்கலை - பேச்சாளராக - அ. கி. பரந்தாமன். பாடம் தழுவிய இலக்கிய வரலாறு: 24. புதினம் தோற்றமும் வளர்ச்சியும்.", co: "CO4", files: [] },
      18: { title: "அலகு V", subtitle: "நாடகம், மொழிப்பயிற்சி, இலக்கிய வரலாறு", syllabus: "நாடகம்: 25. ந. முத்துசாமி - நாற்காலிக்காரர். மொழிப்பயிற்சி: 26. படைப்புக்கலை - கவிதை, சிறுகதை (மாணவர்கள் சொந்தமாகக் கவிதை, சிறுகதை ஆகியனவற்றைப் படைத்தல்). பாடம் தழுவிய இலக்கிய வரலாறு: 27. நாடகம் தோற்றமும் வளர்ச்சியும்.", co: "CO5", files: [] },
      19: { title: "அலகு I", subtitle: "செய்யுள், கட்டுரை, மொழிப்பயிற்சி, இலக்கிய வரலாறு", syllabus: "செய்யுள்: 1. மீனாட்சியம்மை பிள்ளைத்தமிழ் - குமரகுருபரர் (தேர்ந்தெடுக்கப் பெற்ற இரண்டு பாடல்கள்); 2. அபிராமியம்மைப் பதிகம், அபிராமி அந்தாதி - அபிராமிபட்டர் (1. கலையாத கல்வியும், 2. தனம் தரும் கல்வி தரும் (பாடல் எண் 69), 3. விழிக்கே அருள் உண்டு (பாடல் எண் 79), 4. கூட்டியவா என்னை (பாடல் எண் 80)). கட்டுரை: 1. தமிழ் இன்பம் - பாரதப் பண்பாடு - இரா. பி. சேதுப்பிள்ளை. மொழிப்பயிற்சி: கலைச் சொல்லாக்கம். பாடம் தழுவிய இலக்கிய வரலாறு: 5. சிற்றிலக்கியம் தோற்றமும் வளர்ச்சியும்.", co: "CO1", files: [] },
      20: { title: "அலகு II", subtitle: "செய்யுள், கட்டுரை, மொழிப்பயிற்சி, இலக்கிய வரலாறு", syllabus: "செய்யுள்: 6. தமிழ்விடு தூது - 61ஆம் கண்ணி முதல் 70 ஆம் கண்ணி வரை; 7. திருக்குற்றாலக் குறவஞ்சி - திரிகூடராசப்பக் கவிராயர் (1. எங்கள் மலையே (3 பாடல்கள்), 2. சிங்கன் சிங்கி உரையாடல்). கட்டுரை: 8. கப்பலோட்டிய தமிழன் வ. உ. சிதம்பரனார் (வ.உசியின் கனவு) - ம.பொ. சிவஞானம். மொழிப்பயிற்சி: 9. அகரவரிசைப்படுத்துதல். பாடம் தழுவிய இலக்கிய வரலாறு: 10. இசுலாமிய இலக்கிய வரலாறு.", co: "CO2", files: [] },
      21: { title: "அலகு III", subtitle: "செய்யுள், கட்டுரை, மொழிப்பயிற்சி", syllabus: "செய்யுள்: 11. திருவரங்கக் கலம்பகம் - பிள்ளைப் பெருமாள் ஐயங்கார் (1. தவம் (பாடல் எண் 20), 2. தலைவி இரங்கல் (பாடல் எண் 21), 3. மறம் (பாடல் எண் 53)); 12. சீறாப்புராணம் - உமறுப்புலவர் - மானுக்குப் பிணை நின்ற படலம். கட்டுரை: 13. நல்வாழ்வு - (1) உரிமையும் கடமையும், (2) புலனடக்கம் - மு. வரதராசனார். மொழிப்பயிற்சி: 14. தொகைநிலைத் தொடர்.", co: "CO3", files: [] },
      22: { title: "அலகு IV", subtitle: "செய்யுள், கட்டுரை, மொழிப்பயிற்சி, இலக்கிய வரலாறு", syllabus: "செய்யுள்: 15. இரட்சணிய யாத்திரிகம் - எச். ஏ. கிருஷ்ணபிள்ளை (குமார பருவம் - இரட்சணிய சரிதப் படலம் - சிலுவைப்பாடு, பாடல் எண்கள்: 305, 308, 319, 326, 334, 338, 342); 16. குமரேச சதகம் - குருபாததாசர் (1. இறந்தும் வாழ்வோர் (பாடல் எண் 31), 2. இயல்பறிதல் (பாடல் எண் 54), 3. இறைவன் செயல் (பாடல் எண் 85)). கட்டுரை: 17. எண்ணங்கள் - லட்சியப்பாதை - எம். எஸ். உதயமூர்த்தி. மொழிப்பயிற்சி: 18. தொகாநிலைத் தொடர். பாடம் தழுவிய இலக்கிய வரலாறு: 19. கிறித்துவ இலக்கிய வரலாறு.", co: "CO4", files: [] },
      23: { title: "அலகு V", subtitle: "தமிழ்க்கணினிப் பயிற்சி, கட்டுரை, மொழிப்பயிற்சி", syllabus: "தமிழ்க்கணினிப் பயிற்சி: 20. தமிழ்க் கணினியும் தகவல் தொழில் நுட்பமும். கட்டுரை: 21. ஜெயித்துக்காட்டுவோம் - புதிய எண்ணங்களுடன் வெற்றி காண்க - அப்துல்கலாம். மொழிப்பயிற்சி: 22. (அ) ஒரு பொருள் குறித்த பல சொற்கள், (ஆ) பல பொருள் குறித்த ஒரு சொல்.", co: "CO5", files: [] }
    } },

 "Statistical Methods for Computer Science – I": { units: {
      1: { title: "Unit I", subtitle: "Introduction to Statistics", syllabus: "INTRODUCTION - STATISTICS - MEASURES OF CENTRAL TENDENCY - MEAN, MEDIAN, MODE - MEASURES OF DISPERSION - VARIANCE, STANDARD DEVIATION", files: [{ id: "stats-u1-1", title: "Statistics Unit 1 - Introduction to Statistics", fileName: "Stats_Unit1.pdf", fileId: "1CaoFLLcl1gi5CWvutD8m6BJnUswieCjA", type: "pdf" }] },
      2: { title: "Unit II", subtitle: "Probability Theory", syllabus: "PROBABILITY - BASIC CONCEPTS - AXIOMS OF PROBABILITY - CONDITIONAL PROBABILITY - BAYES THEOREM - RANDOM VARIABLES", files: [{ id: "stats-u2-1", title: "Statistics Unit 2 - Probability Theory", fileName: "Stats_Unit2.pdf", fileId: "1hMQguilzowigHuBpoGyilbGY0hGZRBUY", type: "pdf" }] },
      3: { title: "Unit III", subtitle: "Probability Distributions", syllabus: "PROBABILITY DISTRIBUTIONS - BINOMIAL DISTRIBUTION - POISSON DISTRIBUTION - NORMAL DISTRIBUTION - APPLICATIONS", files: [{ id: "stats-u3-1", title: "Statistics Unit 3 - Probability Distributions", fileName: "Stats_Unit3.pdf", fileId: "1Z7LLBa_EAQeG2Q_ILavs5zItgcbOTd26", type: "pdf" }] },
      4: { title: "Unit IV", subtitle: "Sampling and Estimation", syllabus: "SAMPLING THEORY - SAMPLING METHODS - SAMPLING DISTRIBUTION - POINT ESTIMATION - INTERVAL ESTIMATION", files: [{ id: "stats-u4-1", title: "Statistics Unit 4 - Sampling and Estimation", fileName: "Stats_Unit4.pdf", fileId: "1vpROUE_BETA4RpyKM-K9t2I1tVrjT35Z", type: "pdf" }] },
      5: { title: "Unit V", subtitle: "Correlation and Regression", syllabus: "CORRELATION ANALYSIS - PEARSON'S CORRELATION COEFFICIENT - REGRESSION ANALYSIS - LINEAR REGRESSION - APPLICATIONS", files: [{ id: "stats-u5-1", title: "Statistics Unit 5 - Correlation and Regression", fileName: "Stats_Unit5.pdf", fileId: "1JNaI61ehmV6QnLNG6YQvedoV1iBb1gHs", type: "pdf" }] }
    } },
 "STATISTICAL METHODS FOR COMPUTER SCIENCE - II": { units: {
      1: { title: "Unit I", subtitle: "Testing of Hypothesis - Basic Concepts", syllabus: "INTRODUCTION TO TESTING OF HYPOTHESIS - SAMPLE SPACE - EVENTS - DEFINITION OF PROBABILITY - NULL AND ALTERNATIVE HYPOTHESIS - TYPE I AND TYPE II ERRORS - LEVEL OF SIGNIFICANCE", files: [{ id: "stats2-u1-1", title: "Stats 2 Unit 1 - Basic Concepts of Testing", fileName: "Stats2_Unit1.pdf", fileId: "144VSC7IsknD8td--AIvTXLzaDUrnovYN", type: "pdf" }] },
      2: { title: "Unit II", subtitle: "Large Sample Tests", syllabus: "LARGE SAMPLE TESTS - TEST FOR SINGLE MEAN - TEST FOR DIFFERENCE OF MEANS - TEST FOR SINGLE PROPORTION - TEST FOR DIFFERENCE OF PROPORTIONS", files: [{ id: "stats2-u2-1", title: "Stats 2 Unit 2 - Large Sample Tests", fileName: "Stats2_Unit2.pdf", fileId: "1VDRWVCxvvKqnr7QnhypF0CdJBFMz3RR5", type: "pdf" }] },
      3: { title: "Unit III", subtitle: "Small Sample Tests", syllabus: "SMALL SAMPLE TESTS - STUDENT'S T-TEST - F-TEST FOR EQUALITY OF VARIANCES - PAIRED T-TEST - TEST FOR SINGLE MEAN - TEST FOR DIFFERENCE OF MEANS", files: [{ id: "stats2-u3-1", title: "Stats 2 Unit 3 - Small Sample Tests", fileName: "Stats2_Unit3.pdf", fileId: "1eu32jW_4pXdJpgSIjiF3RpKox6y_DLPs", type: "pdf" }] },
      4: { title: "Unit IV", subtitle: "Chi-square Test and Non-Parametric Tests", syllabus: "CHI-SQUARE DISTRIBUTION - CHI-SQUARE TEST FOR GOODNESS OF FIT - CHI-SQUARE TEST FOR INDEPENDENCE - SAMPLING DISTRIBUTION - STANDARD ERROR - PROCEDURE FOR TESTING OF HYPOTHESIS", files: [{ id: "stats2-u4-1", title: "Stats 2 Unit 4 - Chi-square & Non-Parametric Tests", fileName: "Stats2_Unit4.pdf", fileId: "1S3KFoOlwqYbgcrPey8GT0l3E8uMRXx_Z", type: "pdf" }] },
      5: { title: "Unit V", subtitle: "Design of Experiments", syllabus: "DESIGN OF EXPERIMENTS - PRINCIPLES OF EXPERIMENTATION - RANDOMIZATION - REPLICATION - LOCAL CONTROL - COMPLETELY RANDOMIZED DESIGN (CRD) - RANDOMIZED BLOCK DESIGN (RBD) - LATIN SQUARE DESIGN (LSD) - ANOVA TABLE", files: [{ id: "stats2-u5-1", title: "Stats 2 Unit 5 - Design of Experiments", fileName: "Stats2_Unit5.pdf", fileId: "1dMY4-_myb2rUKHlYyuaqeB6hyg_mbecZ", type: "pdf" }] }
    } },
 "ANDROID APP DEVELOPMENT": { units: {
      1: { title: "Unit I", subtitle: "Introduction to Mobile Applications", syllabus: "INTRODUCTION TO MOBILE APPLICATIONS - MARKET AND BUSINESS DRIVERS FOR MOBILE APPLICATIONS - REQUIREMENTS GATHERING AND VALIDATION FOR MOBILE APPLICATIONS - PUBLISHING AND DELIVERY OF MOBILE APPLICATIONS", files: [
        { id: "android-u1-1", title: "Unit 1 - Introduction to Mobile Applications", fileName: "Android_Unit1.pdf", fileId: "1bf8euP-fJ8kGISfyjokbxoM_oE04dyte", type: "pdf" }
      ] },
      2: { title: "Unit II", subtitle: "Android Development Basics", syllabus: "INTRODUCTION TO ANDROID: THE ANDROID PLATFORM - ANDROID SDK - ANDROID DEVELOPMENT BASICS - HARDWARE TOOLS AND SOFTWARE TOOLS - BUILDING YOUR FIRST ANDROID APPLICATION - UNDERSTANDING STRUCTURE OF ANDROID APPLICATION - ANDROID MANIFEST FILE", files: [
        { id: "android-u2-1", title: "Unit 2 - Android Development Basics", fileName: "Android_Unit2.pdf", fileId: "1CTXrJiAv0A7eS2l-B4Sb9RLxP02AqpxC", type: "pdf" }
      ] },
      3: { title: "Unit III", subtitle: "User Interface Design", syllabus: "ANDROID USER INTERFACE DESIGN ESSENTIALS - USER INTERFACE SCREEN ELEMENTS - DESIGNING USER INTERFACES WITH LAYOUTS - USING INTENT FILTER - PERMISSIONS - CREATING YOUR FIRST ACTIVITY - WORKING WITH THE ANDROID FRAMEWORK CLASSES", files: [
        { id: "android-u3-1", title: "Unit 3 - User Interface Design", fileName: "Android_Unit3.pdf", fileId: "14LFwvnVAA8gh8pCskBuMAm1u8XtcZRsW", type: "pdf" }
      ] },
      4: { title: "Unit IV", subtitle: "Coding the Application & Resources", syllabus: "CREATING INSTALLING YOUR APPLICATION - CODING YOUR APPLICATION - UNDERSTANDING ACTIVITIES AND THE ACTIVITY LIFECYCLE - TESTING ANDROID APPLICATIONS - PUBLISHING ANDROID APPLICATION - UNDERSTANDING RESOURCES - WORKING WITH RESOURCES", files: [
        { id: "android-u4-1", title: "Unit 4 - Coding the Application & Resources", fileName: "Android_Unit4.pdf", fileId: "1SqQf0Q9amOPx4TBLtgecX6UVnpcCN0-W", type: "pdf" }
      ] },
      5: { title: "Unit V", subtitle: "Case Study & Advanced Topics", syllabus: "INTRODUCTION TO OBJECTIVE C - ANDROID STUDIO PERMISSIONS - WORKING WITH FILES - WORKING WITH THE NETWORK - DEBUGGING ANDROID APPS - PROVIDING FEEDBACK TO THE USER - VIBRATION - SOUND - FLASH - RAW CAMERA USAGE - TOUCH GESTURES", files: [
        { id: "android-u5-1", title: "Unit 5 - Case Study & Advanced Topics", fileName: "Android_Unit5.pdf", fileId: "1Tm0YW1xkhvkSLDgo73DYyf15h2CS44Zn", type: "pdf" }
      ] }
    } },
 "ARTIFICIAL INTELLIGENCE AND EXPERT SYSTEM": { units: {
      1: { title: "Unit I", subtitle: "Introduction to Artificial Intelligence", syllabus: "INTRODUCTION TO ARTIFICIAL INTELLIGENCE - DEFINITION - GOALS OF AI - HISTORY - INTELLIGENT AGENTS - PROBLEM SOLVING - STATE SPACE SEARCH - UNINFORMED SEARCH STRATEGIES - INFORMED SEARCH STRATEGIES - GAME PLAYING", files: [
        { id: "ai-u1-1", title: "Unit 1 - Introduction to AI", fileName: "UNIT_1_-_AI.pdf", fileId: "1c8qMrnPzbVbLvmHkBbHMIBJ2_E9fU0b9", type: "pdf" }
      ] },
      2: { title: "Unit II", subtitle: "Knowledge Representation & Reasoning", syllabus: "KNOWLEDGE REPRESENTATION - LOGIC - PROPOSITIONAL LOGIC - PREDICATE LOGIC - SEMANTIC NETWORKS - FRAMES - SCRIPT - ONTOLOGIES - REASONING MECHANISMS - INFERENCE - EXPERT SYSTEMS AND KNOWLEDGE BASES", files: [
        { id: "ai-u2-1", title: "Unit 2 - Knowledge Representation", fileName: "UNIT_2_-_AI.pdf", fileId: "1ZYfcBytaNw3q4XoO1F-1bsR6UBFGGp03", type: "pdf" }
      ] },
      3: { title: "Unit III", subtitle: "Machine Learning & Neural Networks", syllabus: "MACHINE LEARNING - SUPERVISED LEARNING - UNSUPERVISED LEARNING - DECISION TREES - NEURAL NETWORKS - PERCEPTRON - BACKPROPAGATION - FUZZY LOGIC SYSTEMS - GENETIC ALGORITHMS", files: [
        { id: "ai-u3-1", title: "Unit 3 - Machine Learning & Neural Networks", fileName: "AI_UNIT_4.pdf", fileId: "1q-n-e4sl4VeM0N0duh5wxqgSDLVjQVmU", type: "pdf" }
      ] },
      4: { title: "Unit IV", subtitle: "Natural Language Processing", syllabus: "NATURAL LANGUAGE PROCESSING - NLP PIPELINE - TEXT PREPROCESSING - LANGUAGE ANALYSIS - TEXT REPRESENTATION - EMBEDDING TECHNIQUES - NATURAL LANGUAGE UNDERSTANDING (NLU) - NATURAL LANGUAGE GENERATION (NLG) - MODEL TRAINING - NLP APPLICATIONS", files: [
        { id: "ai-u4-1", title: "Unit 4 - Natural Language Processing", fileName: "AI_UNIT_4.pdf", fileId: "1cRtyzCu_BiuZVW-BioljtVKti8_G1CB7", type: "pdf" }
      ] },
      5: { title: "Unit V", subtitle: "Expert Systems & Applications", syllabus: "EXPERT SYSTEMS - ARCHITECTURE OF ES - KNOWLEDGE BASE - INFERENCE ENGINE - USER INTERFACE - KNOWLEDGE ACQUISITION - RULE-BASED SYSTEMS - FUZZY EXPERT SYSTEMS - AI APPLICATIONS - ROBOTICS - COMPUTER VISION - SPEECH RECOGNITION", files: [
        { id: "ai-u5-1", title: "Unit 5 - Expert Systems & AI Applications", fileName: "AI_UNIT_4.pdf", fileId: "1Xib1DCMMRPLp6lTkKdIyh8tpwmZuMHPx", type: "pdf" }
      ] }
    } },
 "SOFTWARE ENGINEERING": { units: {
      1: { title: "Unit I", subtitle: "Introduction to SE & Process Models", syllabus: "The Nature of Software - Definition: Software, Software Engineering - Prescriptive Process Models - The Waterfall Model - Incremental Process Model - Evolutionary Process Models - Concurrent Models", files: [
        { id: "se-u1-1", title: "Unit 1 - Prescriptive Process Models", fileName: "unit_1_SE.pdf", fileId: "1t9Q0y7C9b0ssDFjAysFAJQCP5y0qLvB1", type: "pdf" },
        { id: "se-u1-2", title: "Introduction to Software Engineering", fileName: "SE_Intro.pptx", fileId: "1wicoSwbV4stVGHfGuIsfDAtpGFksoKUM", type: "pptx" },
        { id: "se-u1-3", title: "Software Engineering Fundamentals", fileName: "SE_Fundamentals.pdf", fileId: "1nJQlMcGSQifbJzgB3w6h2Dlct3aFkcAf", type: "pdf" }
      ] },
      2: { title: "Unit II", subtitle: "Requirements Engineering & Analysis", syllabus: "Requirements Analysis - Scenario-Based Modeling - UML Models That Supplement the Use Case - Data Modeling Concepts - Class-Based Modeling - Requirements Modeling Strategies - Flow-Oriented Modeling - Creating a Behavioral Model", files: [
        { id: "se-u2-1", title: "Requirements Engineering", fileName: "SE_Requirements.pptx", fileId: "1AFt1x09wc9VXqe_MwpETYaZZUqLXIjiv", type: "pptx" },
        { id: "se-u2-2", title: "Requirements Analysis & SRS", fileName: "SE_SRS_Analysis.pptx", fileId: "1Aq81z1wJ5taTOGEjt_ce2gUPy3wdziG6", type: "pptx" },
        { id: "se-u2-3", title: "Requirements Engineering Notes", fileName: "SE_Requirements_Notes.pdf", fileId: "1_eqY6oM8MlLD3sw3eQdyhxE0pIckstHQ", type: "pdf" }
      ] },
      3: { title: "Unit III", subtitle: "Software Design Concepts", syllabus: "The Design Process - Design Concepts - The Design Model - Designing Class-Based Components: Basic Design Principles - Component-Level Design Guidelines - Cohesion Coupling - Designing Traditional Components - Graphical Design Notation - Tabular Design Notation - Program Design Language", files: [
        { id: "se-u3-1", title: "The Design Model", fileName: "The_Design_Model.docx", fileId: "1F7_LGo1Xprq5L5BqP-lEJXD6oKIWqFAF", type: "doc" }
      ] },
      4: { title: "Unit IV", subtitle: "Software Testing", syllabus: "Elements of Software Quality Assurance - SQA Tasks, goals, and metrics - Software Testing Strategies - Unit Testing - Integration Testing - Validation Testing - Alpha and Beta Testing - System Testing - The Debugging Process - White-Box Testing - Basis Path Testing - Control Structure Testing - Black-Box Testing", files: [
        { id: "se-u4-1", title: "Software Engineering - 2 Marks Question Bank", fileName: "SE_2Marks_Qn_Bank.docx", fileId: "1jU5UTZx-wbDYVV4amuG1MCna_XMkS3po", type: "doc" }
      ] },
      5: { title: "Unit V", subtitle: "SCM, Risk & Reverse Engineering", syllabus: "SOFTWARE CONFIGURATION MANAGEMENT - THE SCM REPOSITORY - THE SCM PROCESS - RISK MANAGEMENT - SOFTWARE RISKS - RISK IDENTIFICATION RISK PROJECTION - RISK REFINEMENT RISK MITIGATION, MONITORING, AND MANAGEMENT - THE RMMM PLAN - SOFTWARE MAINTENANCE - SOFTWARE SUPPORTABILITY - SOFTWARE REENGINEERING - REVERSE ENGINEERING", files: [
        { id: "se-u5-1", title: "Unit 5 - SCM & Risk Management", fileName: "UNIT_5_NOTES.pdf", fileId: "1bwKBwe7R8TLZI4amdOMTnzApwZY_yKVG", type: "pdf" },
        { id: "se-u5-2", title: "SCM - Software Configuration Management", fileName: "SE_SCM.pptx", fileId: "1UITgq6iVv2n2O9VVVYNvS_-SudztgAkl", type: "pptx" },
        { id: "se-u5-3", title: "Software Reverse Engineering - Part 1", fileName: "SE_Reverse_Eng_Part1.pptx", fileId: "12qX05WeVf2BOfgPxD-wu9atNwgdZbz9j", type: "pptx" },
        { id: "se-u5-4", title: "Software Reverse Engineering - Part 2", fileName: "SE_Reverse_Eng_Part2.pptx", fileId: "1ujkP43sKFI0vg5xhjyJ2qa8pxpb2d9h5", type: "pptx" },
        { id: "se-u5-5", title: "Software Reverse Engineering - Part 3", fileName: "SE_Reverse_Eng_Part3.pptx", fileId: "1HUJYtKFYEuWEkNzfFHXS5Dh8x-uoNahv", type: "pptx" },
        { id: "se-u5-6", title: "Software Reverse Engineering - Part 4", fileName: "SE_Reverse_Eng_Part4.pptx", fileId: "1ko8Gx4aMDkdg1nOQqY3Lb--aPmMAhc9k", type: "pptx" }
      ] }
    } },
  "WEB APPLICATION DEVELOPMENT USING ANGULARJS AND NODE.JS": { units: {
      1: {
        title: "Unit I",
        subtitle: "Introduction to AngularJS",
        syllabus: "Overview of AngularJS - Advantages and Features of AngularJS - MVC (Model-View-Controller) Architecture - Single Page Applications (SPA) - Installing and Setting up AngularJS - Creating the First AngularJS Application - AngularJS Directives (ng-app, ng-model, ng-bind, ng-repeat, etc.) - Expressions and Data Binding - Modules, Controllers, Scope, and View - Understanding $scope hierarchy",
        hrs: 12,
        co: "CO1",
        files: []
      },
      2: {
        title: "Unit II",
        subtitle: "AngularJS Forms and AJAX",
        syllabus: "AngularJS Filters: Uppercase, Lowercase, Date, Currency, Number, OrderBy, Filter - Creating Custom Filters - AngularJS Forms: Model Binding, Form Controller, Form Validation, CSS Classes and Form Events, Custom Model Update Triggers - AJAX using $http Service: HTTP Requests and Responses",
        hrs: 12,
        co: "CO2",
        files: []
      },
      3: {
        title: "Unit III",
        subtitle: "Introduction to Node.js",
        syllabus: "Overview of Node.js - Features of Node.js - Installing Node.js - Node.js Architecture - Traditional Web Server vs Node.js - Node.js Process Model - Node Package Manager (NPM) - Command Line Options - Core Modules, Local Modules, Third-party Modules - Creating a Simple Node.js Web Server",
        hrs: 12,
        co: "CO3",
        files: []
      },
      4: {
        title: "Unit IV",
        subtitle: "Express.js and Database Connectivity",
        syllabus: "Introduction to Express.js - Installing Express.js - Creating an Express Application - Routing in Express.js - HTTP Methods (GET, POST, PUT, DELETE) - Middleware - Serving Static Files - RESTful APIs - Database Connectivity (MongoDB/MySQL) - CRUD Operations",
        hrs: 12,
        co: "CO4",
        files: []
      },
      5: {
        title: "Unit V",
        subtitle: "Building Web Applications",
        syllabus: "Integrating AngularJS with Node.js - Client–Server Communication - Authentication and Session Management - File Upload and Download - Error Handling - Deploying Web Applications - Building a Complete CRUD Web Application - Mini Project using AngularJS and Node.js",
        hrs: 12,
        co: "CO5",
        files: []
      }
    }
  },
  "Advanced Design and Analysis of Algorithms": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction",
        syllabus: "Introduction: Notion of Algorithm – Fundamentals of the Analysis of Algorithmic Efficiency – Space complexity, Time complexity – Recursive Algorithms -Asymptotic Notations and their properties (O, Ω, Θ). Elementary Data Structures: Stacks and Queues – Trees – Graphs.",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Divide and conquer & Greedy Method",
        syllabus: "Divide and conquer: Quick sort- Selection sort – Merge sort-Strassen's matrix multiplication. Greedy Method: Knapsack problem- Prim‘s algorithm and Kruskal’s Algorithm – Tree Vertex Splitting – Job sequencing with deadline .",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Dynamic Programming & Search techniques",
        syllabus: "Dynamic Programming: Multistage graphs -Optimal Binary Search trees– All pairs shortest paths – Single source shortest paths – Search techniques for Graphs – DFS-BFS-Connected components – Biconnected components.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Back Tracking & Branch and Bound",
        syllabus: "Back Tracking: 8-Queens Problems – Sum of Subsets – Graph Coloring – Hamiltonian Cycles. Branch and Bound: 0/1 knapsack problem– Traveling Salesperson problem.",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Lower Bound Theory & NP Completeness",
        syllabus: "Lower Bound Theory: Comparison trees – NP-Hard and NP Complete Problems: Non-deterministic Algorithms- NP Hard Problem: Clique Decision Problem (CDP)-Chromatic number decision problem",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "ADVANCED DESIGN AND ANALYSIS OF ALGORITHMS": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction",
        syllabus: "Introduction: Notion of Algorithm – Fundamentals of the Analysis of Algorithmic Efficiency – Space complexity, Time complexity – Recursive Algorithms -Asymptotic Notations and their properties (O, Ω, Θ). Elementary Data Structures: Stacks and Queues – Trees – Graphs.",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Divide and conquer & Greedy Method",
        syllabus: "Divide and conquer: Quick sort- Selection sort – Merge sort-Strassen's matrix multiplication. Greedy Method: Knapsack problem- Prim‘s algorithm and Kruskal’s Algorithm – Tree Vertex Splitting – Job sequencing with deadline .",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Dynamic Programming & Search techniques",
        syllabus: "Dynamic Programming: Multistage graphs -Optimal Binary Search trees– All pairs shortest paths – Single source shortest paths – Search techniques for Graphs – DFS-BFS-Connected components – Biconnected components.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Back Tracking & Branch and Bound",
        syllabus: "Back Tracking: 8-Queens Problems – Sum of Subsets – Graph Coloring – Hamiltonian Cycles. Branch and Bound: 0/1 knapsack problem– Traveling Salesperson problem.",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Lower Bound Theory & NP Completeness",
        syllabus: "Lower Bound Theory: Comparison trees – NP-Hard and NP Complete Problems: Non-deterministic Algorithms- NP Hard Problem: Clique Decision Problem (CDP)-Chromatic number decision problem",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "Python for Data Science": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction to Python",
        syllabus: "Introduction to Python – Python Interpreter - Interactive mode- - Basic Programming concepts - Variables, Expressions and statements - Input/Output –Operators. – Conditional statements –loops",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Functions & Data Structures",
        syllabus: "Functions - Arguments - Return values – Keyword Argument function – Function with default values - Lambda function - Data Structures –Strings - Lists - Dictionaries - Tuples - Sets Sequences - Modules and Packages",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Introduction to NumPy",
        syllabus: "Introduction to NumPy-Standard Data Types-Basic Array Types - Indexing, Slicing, Reshaping, Concatenation. Ufuncs and its features. Aggregations",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Visualization with Matplotlib",
        syllabus: "Visualization with MatplotLib- Line Plots, Scatter Plots. Visualizing Error, Density & Contour plots, customizing color bar, visualization with seaborn.",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Introduction to Pandas",
        syllabus: "Introduction to Pandas-Creation of Series- Operations-Creation of Data Frames--Simple plot using pandasOperations-Import/Export of different types of Files-Slicing - Filtering- groupby-Aggregation- to check for missing values, outliers and imbalance in dataset – case study :real time dataset analysis",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "PYTHON FOR DATA SCIENCE": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction to Python",
        syllabus: "Introduction to Python – Python Interpreter - Interactive mode- - Basic Programming concepts - Variables, Expressions and statements - Input/Output –Operators. – Conditional statements –loops",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Functions & Data Structures",
        syllabus: "Functions - Arguments - Return values – Keyword Argument function – Function with default values - Lambda function - Data Structures –Strings - Lists - Dictionaries - Tuples - Sets Sequences - Modules and Packages",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Introduction to NumPy",
        syllabus: "Introduction to NumPy-Standard Data Types-Basic Array Types - Indexing, Slicing, Reshaping, Concatenation. Ufuncs and its features. Aggregations",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Visualization with Matplotlib",
        syllabus: "Visualization with MatplotLib- Line Plots, Scatter Plots. Visualizing Error, Density & Contour plots, customizing color bar, visualization with seaborn.",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Introduction to Pandas",
        syllabus: "Introduction to Pandas-Creation of Series- Operations-Creation of Data Frames--Simple plot using pandasOperations-Import/Export of different types of Files-Slicing - Filtering- groupby-Aggregation- to check for missing values, outliers and imbalance in dataset – case study :real time dataset analysis",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "Contemporary Web Technologies": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction to HTML & HTML5",
        syllabus: "Introduction to HTML -Anchor Tag – Hyperlink - Head and Body Section– Heading - Horizontal Ruler – Paragraphs – Tags - Images and Picture – Lists – Tables – Frames. HTML5: What is HTML5 - Features of HTML5 – Difference Between HTML and HTML5, Semantic Tags – New Input Elements and tags-Media tags (audio and video tags) – Designing Graphics using Canvas API - Drag and Drop features",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "DHTML and Style Sheets (CSS3)",
        syllabus: "DHTML and Style sheets (CSS3) - What is CSS3 –Features of CSS3 Defining styles - Elements of style - Linking a style sheet to a html documents - Inline style - External style sheets - Multiple styles- Implementation of border radius, box shadow, image border, custom web font, backgrounds - Advanced text effects(shadow) - 2D and 3D Transformations - Transitions to elements - Animations to text and elements",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Introduction to JavaScript",
        syllabus: "INTRODUCTION TO JAVASCRIPT : Introduction –Advantages of JavaScript - Variables – Data types -Operators – Control Statements – Looping statements - Functions –Dialog boxes-Array, Date and number related methods - Document Object Model - Event Handling –Browser Object Model - Windows and Documents - Form handling and validations. - Built in Object - User Defined Object.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Introduction to Node.js",
        syllabus: "INTRODUCTION TO NODE.js: Node.js runtime environment-Node.js architecture and event-driven programming-Core Modules and NPM-Using built-in modules like fs, http, and path-Managing packages with Node Package Manager (NPM)-Asynchronous ProgrammingCallbacks, Promises, and async/await-Handling asynchronous operations-Creating a Basic Web Server-Using the http module to create servers-Handling requests and responses",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Introduction to NoSQL Database – MongoDB",
        syllabus: "INTRODUCTION TO NOSQL DATABASE – MONGODB: What is NoSQL Database - Why to Use MongoDB - Difference between MongoDB & RDBMS - Download & Installation - Common Terms in MongoDB – Implementation of Basic CRUD Operations using MongoDB.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "CONTEMPORARY WEB TECHNOLOGIES": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction to HTML & HTML5",
        syllabus: "Introduction to HTML -Anchor Tag – Hyperlink - Head and Body Section– Heading - Horizontal Ruler – Paragraphs – Tags - Images and Picture – Lists – Tables – Frames. HTML5: What is HTML5 - Features of HTML5 – Difference Between HTML and HTML5, Semantic Tags – New Input Elements and tags-Media tags (audio and video tags) – Designing Graphics using Canvas API - Drag and Drop features",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "DHTML and Style Sheets (CSS3)",
        syllabus: "DHTML and Style sheets (CSS3) - What is CSS3 –Features of CSS3 Defining styles - Elements of style - Linking a style sheet to a html documents - Inline style - External style sheets - Multiple styles- Implementation of border radius, box shadow, image border, custom web font, backgrounds - Advanced text effects(shadow) - 2D and 3D Transformations - Transitions to elements - Animations to text and elements",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Introduction to JavaScript",
        syllabus: "INTRODUCTION TO JAVASCRIPT : Introduction –Advantages of JavaScript - Variables – Data types -Operators – Control Statements – Looping statements - Functions –Dialog boxes-Array, Date and number related methods - Document Object Model - Event Handling –Browser Object Model - Windows and Documents - Form handling and validations. - Built in Object - User Defined Object.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Introduction to Node.js",
        syllabus: "INTRODUCTION TO NODE.js: Node.js runtime environment-Node.js architecture and event-driven programming-Core Modules and NPM-Using built-in modules like fs, http, and path-Managing packages with Node Package Manager (NPM)-Asynchronous ProgrammingCallbacks, Promises, and async/await-Handling asynchronous operations-Creating a Basic Web Server-Using the http module to create servers-Handling requests and responses",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Introduction to NoSQL Database – MongoDB",
        syllabus: "INTRODUCTION TO NOSQL DATABASE – MONGODB: What is NoSQL Database - Why to Use MongoDB - Difference between MongoDB & RDBMS - Download & Installation - Common Terms in MongoDB – Implementation of Basic CRUD Operations using MongoDB.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "Data Communication and Networking": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction & Physical Layer",
        syllabus: "Introduction : Network Hardware – Software – Reference Models – OSI and TCP/IP models – Physical layer: Transmission media–Wireless Transmission–Narrowband ISDN.",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Telephones & Data Link Layer",
        syllabus: "Telephones structure –local loop– trunks and multiplexing, switching. Data link layer: Design issues – error detection and correction, Elementary data link protocols – Sliding window protocols.",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Medium Access Sub Layer",
        syllabus: "Medium Access Sub Layer: Channel Allocation Problem – Multiple Access Protocols: ALOHA– Carrier Sense MultipleAccess Protocols – Collision Free Protocols – Limited Contention Protocols Bridges – Transparent Bridges – Spanning Tree Bridges – Source Routing Bridges.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Network Layer & Routing Algorithms",
        syllabus: "Network layer – design issues – Routing Algorithms: Shortest Path Routing – Flooding – Distance Vector Routing – Link State Routing – Hierarchical Routing Congestion control algorithms: General Principles – Congestion Control in Virtual Circuit Subnets – Choke Packets – Load Shedding – Jitter Control– IP protocol – IP Address –Subnets – Internet Control Protocol.",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Transport & Application Layer",
        syllabus: "Transport layer –Elements– Connection management – Addressing, Establishing & Releasing a connection – Transport Control Protocol: TCP Protocol – TCP segment Header– Connection Management –Application Layer – Network Security-Traditional Cryptography - DNS-DNS Name Space -Electronic Mail - Message Formats.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "DATA COMMUNICATION AND NETWORKING": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction & Physical Layer",
        syllabus: "Introduction : Network Hardware – Software – Reference Models – OSI and TCP/IP models – Physical layer: Transmission media–Wireless Transmission–Narrowband ISDN.",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Telephones & Data Link Layer",
        syllabus: "Telephones structure –local loop– trunks and multiplexing, switching. Data link layer: Design issues – error detection and correction, Elementary data link protocols – Sliding window protocols.",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Medium Access Sub Layer",
        syllabus: "Medium Access Sub Layer: Channel Allocation Problem – Multiple Access Protocols: ALOHA– Carrier Sense MultipleAccess Protocols – Collision Free Protocols – Limited Contention Protocols Bridges – Transparent Bridges – Spanning Tree Bridges – Source Routing Bridges.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Network Layer & Routing Algorithms",
        syllabus: "Network layer – design issues – Routing Algorithms: Shortest Path Routing – Flooding – Distance Vector Routing – Link State Routing – Hierarchical Routing Congestion control algorithms: General Principles – Congestion Control in Virtual Circuit Subnets – Choke Packets – Load Shedding – Jitter Control– IP protocol – IP Address –Subnets – Internet Control Protocol.",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Transport & Application Layer",
        syllabus: "Transport layer –Elements– Connection management – Addressing, Establishing & Releasing a connection – Transport Control Protocol: TCP Protocol – TCP segment Header– Connection Management –Application Layer – Network Security-Traditional Cryptography - DNS-DNS Name Space -Electronic Mail - Message Formats.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "Advanced Software Engineering": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Software Life Cycle Models & Metrics",
        syllabus: "Software life cycle models: Waterfall, RAD,AGILE and Spiral model Process metric – Product metrics – Estimation – LOC, FP, COCOMO models – Project Management – Planning, Scheduling and Tracking Software Quality – Quality Standards, Quality Metrics.",
        hrs: 9,
        co: "CO1",
        files: [
          { id: "ase-pdf-3", title: "A Comprehensive Review of Software Development Life Cycle methodo.pdf", fileName: "A Comprehensive Review of Software Development Life Cycle methodo.pdf", fileId: "16KlqAVVsOO4pLkLNTD0fZTSe9lb-cQAP", type: "pdf", subtitle: "SDLC Methodologies Review Paper" },
          { id: "ase-pdf-2", title: "03Jul20151007419.pdf", fileName: "03Jul20151007419.pdf", fileId: "19IMRYMfMm9SAcR-8J6TbfzdcwKkVpx62", type: "pdf", subtitle: "Software Engineering Principles & Practice Guide" }
        ]
      },
      2: {
        title: "MODULE II",
        subtitle: "System Concepts for Object Modeling",
        syllabus: "System Concepts for Object Modeling – Abstraction, Inheritance, Polymorphism, Encapsulation, Message Sending, Association, Aggregation – Requirement Workflow Functional, Non-functional – Characteristics of Requirements – Requirement Elicitation Techniques – Requirement Documentation – Use case specification, Activity Diagram.",
        hrs: 9,
        co: "CO2",
        files: [
          { id: "ase-pdf-1", title: "03-11.pdf", fileName: "03-11.pdf", fileId: "1qDHHJw_SAlwPTr40NSA5vkFKl3DLg033", type: "pdf", subtitle: "Lecture Notes (Units 3 to 11)" }
        ]
      },
      3: {
        title: "MODULE III",
        subtitle: "Use-Case Modeling & Diagrams",
        syllabus: "Use-Case Modeling – Actors, Use Cases, Use Case Relationships. The Process of Requirements Use-Case – Identify Business Actors, Identify Business Requirements, Use Cases, Construct, Use Case Model Diagram – Class Diagrams and Object Diagrams – Package Diagrams – Sequence and Collaboration diagrams, State chart diagram.",
        hrs: 9,
        co: "CO3",
        files: [
          { id: "ase-pdf-5", title: "Sarabjeet-Kaur_-Comparative-Study-of-Effort-Estimation-Models-in-Software-Engineering_Paper.pdf", fileName: "Sarabjeet-Kaur_-Comparative-Study-of-Effort-Estimation-Models-in-Software-Engineering_Paper.pdf", fileId: "18TsmKjmiNG8tmT6PTwUb7_f4K0JGZ7sa", type: "pdf", subtitle: "Comparative Study of Effort Estimation Models" }
        ]
      },
      4: {
        title: "MODULE IV",
        subtitle: "Design Workflow & Testing",
        syllabus: "Design Workflow: System Design Concept – Coupling and Cohesion – Architectural Styles – Identifying Subsystems and Interfaces – Design Patterns Implementation Workflow – Mapping models to Code – Mapping Object Model to Database Schema Testing – Formal Technical Reviews – Walkthrough and Inspection.",
        hrs: 9,
        co: "CO4",
        files: [
          { id: "ase-pdf-4", title: "A3 - Arch Styles.pdf", fileName: "A3 - Arch Styles.pdf", fileId: "1Z7EWoRKlkBWx4533EdlY4eI5hpuAPq8b", type: "pdf", subtitle: "Software Architectural Styles & Patterns" }
        ]
      },
      5: {
        title: "MODULE V",
        subtitle: "Software Configuration Management & Maintenance",
        syllabus: "Software Configuration Management - Managing and controlling Changes – Managing and controlling versions Maintenance –Types of maintenance – Maintenance Log and defect reports – Reverse and re-engineering.",
        hrs: 9,
        co: "CO5",
        files: [
          { id: "ase-pdf-6", title: "SE_-UNIT-1-To-4-All.pptx.pdf", fileName: "SE_-UNIT-1-To-4-All.pptx.pdf", fileId: "1kYzAFuslGv6HtT2Q5qMK2BmDYO3wIeGA", type: "pdf", subtitle: "Software Engineering Units 1 to 4 Presentation Slides" }
        ]
      }
    }
  },
  "ADVANCED SOFTWARE ENGINEERING": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Software Life Cycle Models & Metrics",
        syllabus: "Software life cycle models: Waterfall, RAD,AGILE and Spiral model Process metric – Product metrics – Estimation – LOC, FP, COCOMO models – Project Management – Planning, Scheduling and Tracking Software Quality – Quality Standards, Quality Metrics.",
        hrs: 9,
        co: "CO1",
        files: [
          { id: "ase-pdf-3-alt", title: "A Comprehensive Review of Software Development Life Cycle methodo.pdf", fileName: "A Comprehensive Review of Software Development Life Cycle methodo.pdf", fileId: "16KlqAVVsOO4pLkLNTD0fZTSe9lb-cQAP", type: "pdf", subtitle: "SDLC Methodologies Review Paper" },
          { id: "ase-pdf-2-alt", title: "03Jul20151007419.pdf", fileName: "03Jul20151007419.pdf", fileId: "19IMRYMfMm9SAcR-8J6TbfzdcwKkVpx62", type: "pdf", subtitle: "Software Engineering Principles & Practice Guide" }
        ]
      },
      2: {
        title: "MODULE II",
        subtitle: "System Concepts for Object Modeling",
        syllabus: "System Concepts for Object Modeling – Abstraction, Inheritance, Polymorphism, Encapsulation, Message Sending, Association, Aggregation – Requirement Workflow Functional, Non-functional – Characteristics of Requirements – Requirement Elicitation Techniques – Requirement Documentation – Use case specification, Activity Diagram.",
        hrs: 9,
        co: "CO2",
        files: [
          { id: "ase-pdf-1-alt", title: "03-11.pdf", fileName: "03-11.pdf", fileId: "1qDHHJw_SAlwPTr40NSA5vkFKl3DLg033", type: "pdf", subtitle: "Lecture Notes (Units 3 to 11)" }
        ]
      },
      3: {
        title: "MODULE III",
        subtitle: "Use-Case Modeling & Diagrams",
        syllabus: "Use-Case Modeling – Actors, Use Cases, Use Case Relationships. The Process of Requirements Use-Case – Identify Business Actors, Identify Business Requirements, Use Cases, Construct, Use Case Model Diagram – Class Diagrams and Object Diagrams – Package Diagrams – Sequence and Collaboration diagrams, State chart diagram.",
        hrs: 9,
        co: "CO3",
        files: [
          { id: "ase-pdf-5-alt", title: "Sarabjeet-Kaur_-Comparative-Study-of-Effort-Estimation-Models-in-Software-Engineering_Paper.pdf", fileName: "Sarabjeet-Kaur_-Comparative-Study-of-Effort-Estimation-Models-in-Software-Engineering_Paper.pdf", fileId: "18TsmKjmiNG8tmT6PTwUb7_f4K0JGZ7sa", type: "pdf", subtitle: "Comparative Study of Effort Estimation Models" }
        ]
      },
      4: {
        title: "MODULE IV",
        subtitle: "Design Workflow & Testing",
        syllabus: "Design Workflow: System Design Concept – Coupling and Cohesion – Architectural Styles – Identifying Subsystems and Interfaces – Design Patterns Implementation Workflow – Mapping models to Code – Mapping Object Model to Database Schema Testing – Formal Technical Reviews – Walkthrough and Inspection.",
        hrs: 9,
        co: "CO4",
        files: [
          { id: "ase-pdf-4-alt", title: "A3 - Arch Styles.pdf", fileName: "A3 - Arch Styles.pdf", fileId: "1Z7EWoRKlkBWx4533EdlY4eI5hpuAPq8b", type: "pdf", subtitle: "Software Architectural Styles & Patterns" }
        ]
      },
      5: {
        title: "MODULE V",
        subtitle: "Software Configuration Management & Maintenance",
        syllabus: "Software Configuration Management - Managing and controlling Changes – Managing and controlling versions Maintenance –Types of maintenance – Maintenance Log and defect reports – Reverse and re-engineering.",
        hrs: 9,
        co: "CO5",
        files: [
          { id: "ase-pdf-6-alt", title: "SE_-UNIT-1-To-4-All.pptx.pdf", fileName: "SE_-UNIT-1-To-4-All.pptx.pdf", fileId: "1kYzAFuslGv6HtT2Q5qMK2BmDYO3wIeGA", type: "pdf", subtitle: "Software Engineering Units 1 to 4 Presentation Slides" }
        ]
      }
    }
  },
  "Mobile Network System": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "INTRODUCTION",
        syllabus: "Introduction to wireless, mobile and cellular mobile systems- cellular mobile telephone systems, analog and digital cellular systems- frequency reuse, co-channel interference.",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "MAC",
        syllabus: "Medium access control - MAC, SDMA, FDMA, TDMA, CDMA, Hand offs and dropped calls-initiation of handoff, power difference, mobile assisted cell-site and Intersystem handoff.",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "COMMUNICATION SYSTEMS",
        syllabus: "Mobile Telecommunication standards, GSM, DECT, TETRA, IMT-2000, CTEO, satellite systems – GEO, LEO and MEO, and broadcast systems –Digital audio and video broadcasting, IEEE 802.11, HIPERLAN, Bluetooth, Wireless ATM, WATM services.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "MOBILE NETWORK LAYER",
        syllabus: "Network support for mobile systems – Mobile IP- IP packet delivery- Agent discovery- tunneling and encapsulation, reverse tunneling, IPV6, DHCP.",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "MOBILE TRANSPORT LAYER",
        syllabus: "Mobile transport and application layer protocol - Review of traditional TCP, fast retransmit/fast recovery, transmission/timeout freezing, file systems, WWW, WAP.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "MOBILE NETWORK SYSTEM": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "INTRODUCTION",
        syllabus: "Introduction to wireless, mobile and cellular mobile systems- cellular mobile telephone systems, analog and digital cellular systems- frequency reuse, co-channel interference.",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "MAC",
        syllabus: "Medium access control - MAC, SDMA, FDMA, TDMA, CDMA, Hand offs and dropped calls-initiation of handoff, power difference, mobile assisted cell-site and Intersystem handoff.",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "COMMUNICATION SYSTEMS",
        syllabus: "Mobile Telecommunication standards, GSM, DECT, TETRA, IMT-2000, CTEO, satellite systems – GEO, LEO and MEO, and broadcast systems –Digital audio and video broadcasting, IEEE 802.11, HIPERLAN, Bluetooth, Wireless ATM, WATM services.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "MOBILE NETWORK LAYER",
        syllabus: "Network support for mobile systems – Mobile IP- IP packet delivery- Agent discovery- tunneling and encapsulation, reverse tunneling, IPV6, DHCP.",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "MOBILE TRANSPORT LAYER",
        syllabus: "Mobile transport and application layer protocol - Review of traditional TCP, fast retransmit/fast recovery, transmission/timeout freezing, file systems, WWW, WAP.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "Artificial Neural Network": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Review of Basic Neural Networks",
        syllabus: "Review of Basic Neural Networks-Introduction to Neural Networks-Perceptron, Activation Functions, Loss Functions-Backpropagation and Gradient Descent-Overfitting and Regularization Techniques",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Convolutional Neural Networks (CNNs)",
        syllabus: "Convolutional Neural Networks (CNNs)-CNN Architecture and Components-Convolution, Pooling, Flattening, Fully Connected Layers-Stride, Padding, Filter Sizes-Advanced CNN Techniques-Transfer Learning (Fine-Tuning Pretrained Networks)",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Generative Models",
        syllabus: "Generative Models-Generative Adversarial Networks (GANs)-GAN Architecture and Training Dynamics-Conditional GANs, CycleGANs, StyleGAN-Applications in Image Generation, Art, and Data Augmentation",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Advanced Topics in Neural Networks",
        syllabus: "Advanced Topics in Neural Networks-Meta-Learning and Few-Shot Learning-Model-Agnostic Meta-Learning (MAML)-Few-shot Learning Architectures-Self-Supervised Learning-Contrastive Learning, Pretext Tasks",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Real-World Applications",
        syllabus: "Real-World Applications-Computer Vision-Object Detection, Image Classification, Image Segmentation-Natural Language Processing (NLP)-Language Modeling, Text Generation, Question Answering",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "ARTIFICIAL NEURAL NETWORK": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Review of Basic Neural Networks",
        syllabus: "Review of Basic Neural Networks-Introduction to Neural Networks-Perceptron, Activation Functions, Loss Functions-Backpropagation and Gradient Descent-Overfitting and Regularization Techniques",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Convolutional Neural Networks (CNNs)",
        syllabus: "Convolutional Neural Networks (CNNs)-CNN Architecture and Components-Convolution, Pooling, Flattening, Fully Connected Layers-Stride, Padding, Filter Sizes-Advanced CNN Techniques-Transfer Learning (Fine-Tuning Pretrained Networks)",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Generative Models",
        syllabus: "Generative Models-Generative Adversarial Networks (GANs)-GAN Architecture and Training Dynamics-Conditional GANs, CycleGANs, StyleGAN-Applications in Image Generation, Art, and Data Augmentation",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Advanced Topics in Neural Networks",
        syllabus: "Advanced Topics in Neural Networks-Meta-Learning and Few-Shot Learning-Model-Agnostic Meta-Learning (MAML)-Few-shot Learning Architectures-Self-Supervised Learning-Contrastive Learning, Pretext Tasks",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Real-World Applications",
        syllabus: "Real-World Applications-Computer Vision-Object Detection, Image Classification, Image Segmentation-Natural Language Processing (NLP)-Language Modeling, Text Generation, Question Answering",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "Digital Image Processing": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction & Digital Image Fundamentals",
        syllabus: "Introduction: Fundamental steps in digital image processing, components of an image processing system. Image acquisition, sampling and quantization, spatial and intensity resolution, basic relationships between pixels. Color Image Fundamentals: Color models – RGB, CMY, HSV, HIS, basics of color image processing.",
        hrs: 9,
        co: "CO1",
        files: [{ id: "dip-u1-combined", title: "Digital Image Processing - Combined Notes (Module I to V)", fileName: "PG_Digital_Image_Processing_Complete.pdf", fileId: "1uG68TNwRWMzxwEVodI0tgb6oqmpU68zA", type: "pdf" }]
      },
      2: {
        title: "MODULE II",
        subtitle: "Image Enhancement in Spatial Domain",
        syllabus: "Spatial domain enhancement: Basic gray level intensity transformations (log, power law, contrast stretching). Histogram processing: Histogram equalization, histogram matching. Arithmetic and logic operations. Basics of spatial filtering: Smoothing spatial filters (mean, median), Sharpening spatial filters (Laplacian, Unsharp masking).",
        hrs: 9,
        co: "CO2",
        files: [{ id: "dip-u2-combined", title: "Digital Image Processing - Combined Notes (Module I to V)", fileName: "PG_Digital_Image_Processing_Complete.pdf", fileId: "1uG68TNwRWMzxwEVodI0tgb6oqmpU68zA", type: "pdf" }]
      },
      3: {
        title: "MODULE III",
        subtitle: "Image Enhancement in Frequency Domain",
        syllabus: "Frequency domain enhancement: 2D Discrete Fourier Transform (DFT) and its properties, Fast Fourier Transform (FFT). Filtering in frequency domain: Correspondence between spatial and frequency filtering. Smoothing frequency domain filters: Ideal, Butterworth, Gaussian lowpass. Sharpening filters: Highpass Butterworth and Gaussian.",
        hrs: 9,
        co: "CO3",
        files: [{ id: "dip-u3-combined", title: "Digital Image Processing - Combined Notes (Module I to V)", fileName: "PG_Digital_Image_Processing_Complete.pdf", fileId: "1uG68TNwRWMzxwEVodI0tgb6oqmpU68zA", type: "pdf" }]
      },
      4: {
        title: "MODULE IV",
        subtitle: "Image Restoration & Segmentation",
        syllabus: "Image Restoration: Model of image degradation/restoration process, Noise models (Gaussian, Rayleigh, Impulse). Restoration in presence of noise: Mean filters, Order-statistic filters, Inverse filtering, Wiener filtering. Image Segmentation: Point, line, and edge detection, Thresholding (Otsu's method), Region-based segmentation (Region growing, splitting and merging).",
        hrs: 9,
        co: "CO4",
        files: [{ id: "dip-u4-combined", title: "Digital Image Processing - Combined Notes (Module I to V)", fileName: "PG_Digital_Image_Processing_Complete.pdf", fileId: "1uG68TNwRWMzxwEVodI0tgb6oqmpU68zA", type: "pdf" }]
      },
      5: {
        title: "MODULE V",
        subtitle: "Image Compression & Wavelet Analysis",
        syllabus: "Image Compression: Fundamentals, Redundancy (Coding, Interpixel, Psychovisual). Fidelity criteria, Image compression models. Lossless Compression: Huffman coding, Run-length coding, Arithmetic coding. Lossy Compression: Predictive coding, Transform coding, JPEG compression standard. Wavelet Transform: Continuous and Discrete Wavelet Transform.",
        hrs: 9,
        co: "CO5",
        files: [{ id: "dip-u5-combined", title: "Digital Image Processing - Combined Notes (Module I to V)", fileName: "PG_Digital_Image_Processing_Complete.pdf", fileId: "1uG68TNwRWMzxwEVodI0tgb6oqmpU68zA", type: "pdf" }]
      }
    }
  },
  "Ethical Hacking": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction",
        syllabus: "Ethical Hacking Overview – Role of Security and Penetration Testers - Penetration-Testing Methodologies - Laws of the Land – Overview of TCP/IP - The Application Layer – The Transport Layer – The Internet Layer – IP Addressing - Network and Computer Attacks – Malware – Protecting Against Malware Attacks - Intruder Attacks – Addressing Physical Security.",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Footprinting, Reconnaissance and Scanning Networks",
        syllabus: "Footprinting Concepts – Footprinting through Search Engines, Web Services, Social Networking Sites, Website, Email – Competitive Intelligence – Footprinting through Social Engineering - Footprinting Tools – Network Scanning Concepts – Port-Scanning Tools – Scanning Techniques – Scanning Beyond IDS and Firewall.",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Enumeration and Vulnerability Analysis",
        syllabus: "Enumeration Concepts – NetBIOS Enumeration – SNMP, LDAP, NTP, SMTP and DNS Enumeration – Vulnerability Assessment Concepts – Desktop and Server OS Vulnerabilities - Windows OS Vulnerabilities – Tools for Identifying Vulnerabilities in Windows - Linux OS Vulnerabilities - Vulnerabilities of Embedded OSs.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "System Hacking",
        syllabus: "Hacking Web Servers – Web Application Components - Vulnerabilities – Tools for Web Attackers and Security Testers. Hacking Wireless Networks – Components of a Wireless Network – Wardriving Wireless Hacking – Tools of the Trade.",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Network Protection Systems",
        syllabus: "Access Control Lists – Cisco Adaptive Security Appliance Firewall – Configuration and Risk Analysis Tools for Firewalls and Routers – Intrusion Detection and Prevention Systems – Network-Based and Host-Based IDSs and IPSs – Web Filtering – Security Incident Response Teams – Honeypots.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "Java Enterprise Edition": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Need for Enterprise Programming & Architecture",
        syllabus: "Need for Enterprise Programming – J2EE Advantage – Enterprise Architecture types– Architecture of J2EE – J2EE Components – J2EE Containers – Introducing RMI – RMI Architecture – Application Development with RMI – RMI over IIOP.",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Introduction to Servlets & JDBC",
        syllabus: "Introduction to Servlets – Servlet Life Cycle – Servlet API Basics – HTTP Redirects –Cookies –State and Session Management –Hidden Fields – URL rewriting –Session Management with the Servlet API –Inter Servlet Communication – Server Side Includes and Request Forwarding –Data Base Access with JDBC.",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Javamail, JMS & EJB Fundamentals",
        syllabus: "Javamail: Working with Java Mail –Understanding Protocols for Javamail –Components –Javamail API –Understanding Java Messaging Services: JMS Components EJB Fundamentals – EJB Architecture – EJB Roles –Introduction to Session Beans, Entity Beans & Message Driven Beans.",
        hrs: 6,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Client / Server Concepts & Middleware",
        syllabus: "Client / Server Concepts: Client-Server - File server - Database server - Group server - Object server – Web server- Middleware - General middleware - Service specific middleware - Client / server building blocks - RPC - Messaging - Peer-to-Peer",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Spring Framework and Spring Boot",
        syllabus: "Introduction to Spring Framework and Spring Boot-Spring Initializer-Dependency Injection (Constructor/Setter-based) Inversion of Control -Building RESTful API with spring Boot-Data Access with Spring data JPA- Security-Testing and Deploying Spring Boot Applications.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "JAVA ENTERPRISE EDITION": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Need for Enterprise Programming & Architecture",
        syllabus: "Need for Enterprise Programming – J2EE Advantage – Enterprise Architecture types– Architecture of J2EE – J2EE Components – J2EE Containers – Introducing RMI – RMI Architecture – Application Development with RMI – RMI over IIOP.",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Introduction to Servlets & JDBC",
        syllabus: "Introduction to Servlets – Servlet Life Cycle – Servlet API Basics – HTTP Redirects –Cookies –State and Session Management –Hidden Fields – URL rewriting –Session Management with the Servlet API –Inter Servlet Communication – Server Side Includes and Request Forwarding –Data Base Access with JDBC.",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Javamail, JMS & EJB Fundamentals",
        syllabus: "Javamail: Working with Java Mail –Understanding Protocols for Javamail –Components –Javamail API –Understanding Java Messaging Services: JMS Components EJB Fundamentals – EJB Architecture – EJB Roles –Introduction to Session Beans, Entity Beans & Message Driven Beans.",
        hrs: 6,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Client / Server Concepts & Middleware",
        syllabus: "Client / Server Concepts: Client-Server - File server - Database server - Group server - Object server – Web server- Middleware - General middleware - Service specific middleware - Client / server building blocks - RPC - Messaging - Peer-to-Peer",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Spring Framework and Spring Boot",
        syllabus: "Introduction to Spring Framework and Spring Boot-Spring Initializer-Dependency Injection (Constructor/Setter-based) Inversion of Control -Building RESTful API with spring Boot-Data Access with Spring data JPA- Security-Testing and Deploying Spring Boot Applications.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "Data Mining Techniques": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction to Data Mining",
        syllabus: "What is Data Mining – What Kinds of Data can be mined- Kinds of Patterns that can be mined - Technologies used - Issues in Data Mining – Data Objects and Attribute Types- Basic Statistical Description of Data- Data Visualization.",
        hrs: 9,
        co: "CO1",
        files: [
          { id: "pg-dmt-u1-combined", title: "Data Mining Techniques - Combined Notes (Module I to V)", fileName: "PG_Data_Mining_Techniques_Complete.pdf", fileId: "1sHXJ3ynonZuQPow8iwt92n5u9ROEo3FX", type: "pdf" }
        ]
      },
      2: {
        title: "MODULE II",
        subtitle: "Data Preprocessing & Data Warehouse",
        syllabus: "Data Preprocessing: Why preprocess the data – Data cleaning – Data Integration – Data Transformation – Data Reduction – Data Discretization. Data Warehouse: Basic concepts-Data Warehouse Modelling:Data Cube and OLAP",
        hrs: 9,
        co: "CO2",
        files: [
          { id: "pg-dmt-u2-combined", title: "Data Mining Techniques - Combined Notes (Module I to V)", fileName: "PG_Data_Mining_Techniques_Complete.pdf", fileId: "1sHXJ3ynonZuQPow8iwt92n5u9ROEo3FX", type: "pdf" }
        ]
      },
      3: {
        title: "MODULE III",
        subtitle: "Data Mining Techniques & Association Rules",
        syllabus: "Data Mining Techniques: Association Rule Mining – The Apriori Algorithm – Multilevel Association Rules – Multidimensional Association Rules – Constraint Based Association Mining.",
        hrs: 9,
        co: "CO3",
        files: [
          { id: "pg-dmt-u3-combined", title: "Data Mining Techniques - Combined Notes (Module I to V)", fileName: "PG_Data_Mining_Techniques_Complete.pdf", fileId: "1sHXJ3ynonZuQPow8iwt92n5u9ROEo3FX", type: "pdf" }
        ]
      },
      4: {
        title: "MODULE IV",
        subtitle: "Classification and Prediction",
        syllabus: "Classification and Prediction: Issues regarding Classification and Prediction – Decision Tree induction – Bayesian Classification – Back Propagation – Classification Methods – Prediction – Classifiers accuracy.",
        hrs: 9,
        co: "CO4",
        files: [
          { id: "pg-dmt-u4-combined", title: "Data Mining Techniques - Combined Notes (Module I to V)", fileName: "PG_Data_Mining_Techniques_Complete.pdf", fileId: "1sHXJ3ynonZuQPow8iwt92n5u9ROEo3FX", type: "pdf" }
        ]
      },
      5: {
        title: "MODULE V",
        subtitle: "Clustering Techniques & Outlier Analysis",
        syllabus: "Clustering Techniques: cluster Analysis – Clustering Methods – Similarity and Distance Measures – Hierarchical Methods – Partitional Methods – Outlier Analysis",
        hrs: 9,
        co: "CO5",
        files: [
          { id: "pg-dmt-u5-combined", title: "Data Mining Techniques - Combined Notes (Module I to V)", fileName: "PG_Data_Mining_Techniques_Complete.pdf", fileId: "1sHXJ3ynonZuQPow8iwt92n5u9ROEo3FX", type: "pdf" }
        ]
      }
    }
  },
  "Advanced Database Management Systems / Distributed Databases / Cloud Web Services": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Database System Concepts And Architectures & ER Model",
        syllabus: "Database System Concepts And Architectures: Data Models – Schemas – Instances – Three Schema Architecture – Data Independence – Database Languages. E-R Model and EER Model: Entity Types – Entity Sets – Attributes – Key – Relationship Types – Relationship Sets – Weak Entity Types – ER Diagram – Naming Conventions – Subclasses – Super classes – Inheritance – Specialization And Generalization – Constraints and Characteristics Of Specialization and Generalization Hierarchies.",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Normalization & Functional Dependencies",
        syllabus: "Normalization: Basic Definitions – Functional Dependencies – Types of FD – Introduction to Normalization – Decomposition – Dependency Preservation – First, Second, Third Normal Forms – BCNF – Multivalued Dependencies and Fourth Normal Form – Join Dependency and Fifth Normal Form.",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Object And Object Relational Databases",
        syllabus: "Object And Object Relational Databases – Concepts for Object Databases: Object Identity – Object structure – Type Constructors – Encapsulation of Operations – Methods – Persistence – Type and Class Hierarchies – Inheritance – Complex Objects Object Database Standards and Languages: Overview of ODMG Model – ODL – OQL.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Data Warehousing And Distributed DBMS",
        syllabus: "Data Warehousing And Distributed DBMS – Data Warehousing – Characteristics Of Data Warehouses – Data Modeling For Data Warehouses – Typical Functionality Of A Data Warehouse – Distributed DBMS – Features – Factors Encouraging DDBMS – Advantages Of Distributed Data Bases – Distributed DBMS Architecture – Types Of Distributed Data Bases.",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Emerging Technologies",
        syllabus: "Emerging Technologies – Mobile Databases – Architecture and Data Management Issues – Multimedia Databases – Nature of Data, Data Management Issues and Applications.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "Advanced Database Management Systems/Distributed Databases/Cloud Web Services": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Database System Concepts And Architectures & ER Model",
        syllabus: "Database System Concepts And Architectures: Data Models – Schemas – Instances – Three Schema Architecture – Data Independence – Database Languages. E-R Model and EER Model: Entity Types – Entity Sets – Attributes – Key – Relationship Types – Relationship Sets – Weak Entity Types – ER Diagram – Naming Conventions – Subclasses – Super classes – Inheritance – Specialization And Generalization – Constraints and Characteristics Of Specialization and Generalization Hierarchies.",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Normalization & Functional Dependencies",
        syllabus: "Normalization: Basic Definitions – Functional Dependencies – Types of FD – Introduction to Normalization – Decomposition – Dependency Preservation – First, Second, Third Normal Forms – BCNF – Multivalued Dependencies and Fourth Normal Form – Join Dependency and Fifth Normal Form.",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Object And Object Relational Databases",
        syllabus: "Object And Object Relational Databases – Concepts for Object Databases: Object Identity – Object structure – Type Constructors – Encapsulation of Operations – Methods – Persistence – Type and Class Hierarchies – Inheritance – Complex Objects Object Database Standards and Languages: Overview of ODMG Model – ODL – OQL.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Data Warehousing And Distributed DBMS",
        syllabus: "Data Warehousing And Distributed DBMS – Data Warehousing – Characteristics Of Data Warehouses – Data Modeling For Data Warehouses – Typical Functionality Of A Data Warehouse – Distributed DBMS – Features – Factors Encouraging DDBMS – Advantages Of Distributed Data Bases – Distributed DBMS Architecture – Types Of Distributed Data Bases.",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Emerging Technologies",
        syllabus: "Emerging Technologies – Mobile Databases – Architecture and Data Management Issues – Multimedia Databases – Nature of Data, Data Management Issues and Applications.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "ADVANCED DATABASE MANAGEMENT SYSTEMS / DISTRIBUTED DATABASES / CLOUD WEB SERVICES": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Database System Concepts And Architectures & ER Model",
        syllabus: "Database System Concepts And Architectures: Data Models – Schemas – Instances – Three Schema Architecture – Data Independence – Database Languages. E-R Model and EER Model: Entity Types – Entity Sets – Attributes – Key – Relationship Types – Relationship Sets – Weak Entity Types – ER Diagram – Naming Conventions – Subclasses – Super classes – Inheritance – Specialization And Generalization – Constraints and Characteristics Of Specialization and Generalization Hierarchies.",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Normalization & Functional Dependencies",
        syllabus: "Normalization: Basic Definitions – Functional Dependencies – Types of FD – Introduction to Normalization – Decomposition – Dependency Preservation – First, Second, Third Normal Forms – BCNF – Multivalued Dependencies and Fourth Normal Form – Join Dependency and Fifth Normal Form.",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Object And Object Relational Databases",
        syllabus: "Object And Object Relational Databases – Concepts for Object Databases: Object Identity – Object structure – Type Constructors – Encapsulation of Operations – Methods – Persistence – Type and Class Hierarchies – Inheritance – Complex Objects Object Database Standards and Languages: Overview of ODMG Model – ODL – OQL.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Data Warehousing And Distributed DBMS",
        syllabus: "Data Warehousing And Distributed DBMS – Data Warehousing – Characteristics Of Data Warehouses – Data Modeling For Data Warehouses – Typical Functionality Of A Data Warehouse – Distributed DBMS – Features – Factors Encouraging DDBMS – Advantages Of Distributed Data Bases – Distributed DBMS Architecture – Types Of Distributed Data Bases.",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Emerging Technologies",
        syllabus: "Emerging Technologies – Mobile Databases – Architecture and Data Management Issues – Multimedia Databases – Nature of Data, Data Management Issues and Applications.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "Advanced Database Management System": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Database System Concepts And Architectures & ER Model",
        syllabus: "Database System Concepts And Architectures: Data Models – Schemas – Instances – Three Schema Architecture – Data Independence – Database Languages. E-R Model and EER Model: Entity Types – Entity Sets – Attributes – Key – Relationship Types – Relationship Sets – Weak Entity Types – ER Diagram – Naming Conventions – Subclasses – Super classes – Inheritance – Specialization And Generalization – Constraints and Characteristics Of Specialization and Generalization Hierarchies.",
        hrs: 9,
        co: "CO1",
        files: [{ id: "adbms-u1-combined", title: "Advanced Database Management System - Combined Notes (Module I to V)", fileName: "PG_Advanced_Database_Management_System_Complete.pdf", fileId: "1lb-w3FOfs1_EIiyTE4P3hXuZtQaTzkOJ", type: "pdf" }]
      },
      2: {
        title: "MODULE II",
        subtitle: "Normalization & Functional Dependencies",
        syllabus: "Normalization: Basic Definitions – Functional Dependencies – Types of FD – Introduction to Normalization – Decomposition – Dependency Preservation – First, Second, Third Normal Forms – BCNF – Multivalued Dependencies and Fourth Normal Form – Join Dependency and Fifth Normal Form.",
        hrs: 9,
        co: "CO2",
        files: [{ id: "adbms-u2-combined", title: "Advanced Database Management System - Combined Notes (Module I to V)", fileName: "PG_Advanced_Database_Management_System_Complete.pdf", fileId: "1lb-w3FOfs1_EIiyTE4P3hXuZtQaTzkOJ", type: "pdf" }]
      },
      3: {
        title: "MODULE III",
        subtitle: "Object And Object Relational Databases",
        syllabus: "Object And Object Relational Databases – Concepts for Object Databases: Object Identity – Object structure – Type Constructors – Encapsulation of Operations – Methods – Persistence – Type and Class Hierarchies – Inheritance – Complex Objects Object Database Standards and Languages: Overview of ODMG Model – ODL – OQL.",
        hrs: 9,
        co: "CO3",
        files: [{ id: "adbms-u3-combined", title: "Advanced Database Management System - Combined Notes (Module I to V)", fileName: "PG_Advanced_Database_Management_System_Complete.pdf", fileId: "1lb-w3FOfs1_EIiyTE4P3hXuZtQaTzkOJ", type: "pdf" }]
      },
      4: {
        title: "MODULE IV",
        subtitle: "Data Warehousing And Distributed DBMS",
        syllabus: "Data Warehousing And Distributed DBMS – Data Warehousing – Characteristics Of Data Warehouses – Data Modeling For Data Warehouses – Typical Functionality Of A Data Warehouse – Distributed DBMS – Features – Factors Encouraging DDBMS – Advantages Of Distributed Data Bases – Distributed DBMS Architecture – Types Of Distributed Data Bases.",
        hrs: 9,
        co: "CO4",
        files: [{ id: "adbms-u4-combined", title: "Advanced Database Management System - Combined Notes (Module I to V)", fileName: "PG_Advanced_Database_Management_System_Complete.pdf", fileId: "1lb-w3FOfs1_EIiyTE4P3hXuZtQaTzkOJ", type: "pdf" }]
      },
      5: {
        title: "MODULE V",
        subtitle: "Emerging Technologies",
        syllabus: "Emerging Technologies – Mobile Databases – Architecture and Data Management Issues – Multimedia Databases – Nature of Data, Data Management Issues and Applications.",
        hrs: 9,
        co: "CO5",
        files: [{ id: "adbms-u5-combined", title: "Advanced Database Management System - Combined Notes (Module I to V)", fileName: "PG_Advanced_Database_Management_System_Complete.pdf", fileId: "1lb-w3FOfs1_EIiyTE4P3hXuZtQaTzkOJ", type: "pdf" }]
      }
    }
  },
  "ADVANCED DATABASE MANAGEMENT SYSTEM": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Database System Concepts And Architectures & ER Model",
        syllabus: "Database System Concepts And Architectures: Data Models – Schemas – Instances – Three Schema Architecture – Data Independence – Database Languages. E-R Model and EER Model: Entity Types – Entity Sets – Attributes – Key – Relationship Types – Relationship Sets – Weak Entity Types – ER Diagram – Naming Conventions – Subclasses – Super classes – Inheritance – Specialization And Generalization – Constraints and Characteristics Of Specialization and Generalization Hierarchies.",
        hrs: 9,
        co: "CO1",
        files: [{ id: "adbms-u1-combined-alt", title: "Advanced Database Management System - Combined Notes (Module I to V)", fileName: "PG_Advanced_Database_Management_System_Complete.pdf", fileId: "1lb-w3FOfs1_EIiyTE4P3hXuZtQaTzkOJ", type: "pdf" }]
      },
      2: {
        title: "MODULE II",
        subtitle: "Normalization & Functional Dependencies",
        syllabus: "Normalization: Basic Definitions – Functional Dependencies – Types of FD – Introduction to Normalization – Decomposition – Dependency Preservation – First, Second, Third Normal Forms – BCNF – Multivalued Dependencies and Fourth Normal Form – Join Dependency and Fifth Normal Form.",
        hrs: 9,
        co: "CO2",
        files: [{ id: "adbms-u2-combined-alt", title: "Advanced Database Management System - Combined Notes (Module I to V)", fileName: "PG_Advanced_Database_Management_System_Complete.pdf", fileId: "1lb-w3FOfs1_EIiyTE4P3hXuZtQaTzkOJ", type: "pdf" }]
      },
      3: {
        title: "MODULE III",
        subtitle: "Object And Object Relational Databases",
        syllabus: "Object And Object Relational Databases – Concepts for Object Databases: Object Identity – Object structure – Type Constructors – Encapsulation of Operations – Methods – Persistence – Type and Class Hierarchies – Inheritance – Complex Objects Object Database Standards and Languages: Overview of ODMG Model – ODL – OQL.",
        hrs: 9,
        co: "CO3",
        files: [{ id: "adbms-u3-combined-alt", title: "Advanced Database Management System - Combined Notes (Module I to V)", fileName: "PG_Advanced_Database_Management_System_Complete.pdf", fileId: "1lb-w3FOfs1_EIiyTE4P3hXuZtQaTzkOJ", type: "pdf" }]
      },
      4: {
        title: "MODULE IV",
        subtitle: "Data Warehousing And Distributed DBMS",
        syllabus: "Data Warehousing And Distributed DBMS – Data Warehousing – Characteristics Of Data Warehouses – Data Modeling For Data Warehouses – Typical Functionality Of A Data Warehouse – Distributed DBMS – Features – Factors Encouraging DDBMS – Advantages Of Distributed Data Bases – Distributed DBMS Architecture – Types Of Distributed Data Bases.",
        hrs: 9,
        co: "CO4",
        files: [{ id: "adbms-u4-combined-alt", title: "Advanced Database Management System - Combined Notes (Module I to V)", fileName: "PG_Advanced_Database_Management_System_Complete.pdf", fileId: "1lb-w3FOfs1_EIiyTE4P3hXuZtQaTzkOJ", type: "pdf" }]
      },
      5: {
        title: "MODULE V",
        subtitle: "Emerging Technologies",
        syllabus: "Emerging Technologies – Mobile Databases – Architecture and Data Management Issues – Multimedia Databases – Nature of Data, Data Management Issues and Applications.",
        hrs: 9,
        co: "CO5",
        files: [{ id: "adbms-u5-combined-alt", title: "Advanced Database Management System - Combined Notes (Module I to V)", fileName: "PG_Advanced_Database_Management_System_Complete.pdf", fileId: "1lb-w3FOfs1_EIiyTE4P3hXuZtQaTzkOJ", type: "pdf" }]
      }
    }
  },
  "Distributed Databases": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction & Architecture of Distributed Systems",
        syllabus: "Introduction: Distributed Data Processing - Promises of DDBs - Complicating Factors and Problem Areas. Architecture of distributed systems: Homogeneous – Heterogeneous - Client/server - Distributed Databases versus Replicated Databases.",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Distributed Database Design & Access Control",
        syllabus: "Distributed Database Design: Alternative Design strategies - Distribution Design Issues – Fragmentation - Allocation. Data and Access Control: View management – Data security – Semantic Integrity Control",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Query Processing & Distributed Query Optimization",
        syllabus: "Query processing: Query processing objectives, characterization of query processors, layers of query processing, query decomposition, localization of distributed data. Distributed query Optimization: Query optimization, centralized query optimization, distributed query optimization algorithms.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Transaction Management & Concurrency Control",
        syllabus: "Transaction Management: Definition - Properties of transaction - Types of transactions - Distributed Concurrency Control: Serializability, Concurrency Control Mechanisms & Algorithms, Time - Stamped & Optimistic Concurrency Control Algorithms, Deadlock Management.",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Distributed DBMS Reliability & Parallel Databases",
        syllabus: "Distributed DBMS Reliability: Reliability Concepts and Measures - Fault-Tolerance in Distributed Systems - Failures in Distributed DBMS - Local & Distributed Reliability Protocols - Site Failures and Network Partitioning. Parallel Database Systems: Parallel Database System Architectures - Parallel Data Placement - Parallel Query Processing - Load Balancing - Database Clusters.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "DISTRIBUTED DATABASES": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction & Architecture of Distributed Systems",
        syllabus: "Introduction: Distributed Data Processing - Promises of DDBs - Complicating Factors and Problem Areas. Architecture of distributed systems: Homogeneous – Heterogeneous - Client/server - Distributed Databases versus Replicated Databases.",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Distributed Database Design & Access Control",
        syllabus: "Distributed Database Design: Alternative Design strategies - Distribution Design Issues – Fragmentation - Allocation. Data and Access Control: View management – Data security – Semantic Integrity Control",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Query Processing & Distributed Query Optimization",
        syllabus: "Query processing: Query processing objectives, characterization of query processors, layers of query processing, query decomposition, localization of distributed data. Distributed query Optimization: Query optimization, centralized query optimization, distributed query optimization algorithms.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Transaction Management & Concurrency Control",
        syllabus: "Transaction Management: Definition - Properties of transaction - Types of transactions - Distributed Concurrency Control: Serializability, Concurrency Control Mechanisms & Algorithms, Time - Stamped & Optimistic Concurrency Control Algorithms, Deadlock Management.",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Distributed DBMS Reliability & Parallel Databases",
        syllabus: "Distributed DBMS Reliability: Reliability Concepts and Measures - Fault-Tolerance in Distributed Systems - Failures in Distributed DBMS - Local & Distributed Reliability Protocols - Site Failures and Network Partitioning. Parallel Database Systems: Parallel Database System Architectures - Parallel Data Placement - Parallel Query Processing - Load Balancing - Database Clusters.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "Cloud Web Services": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction to Cloud Computing and Amazon Web Services",
        syllabus: "Introduction to Cloud Computing, Cloud Service Delivery Models (IAAS, PAAS, SAAS), Cloud Deployment Models (Private, Public, Hybrid and Community), Cloud Computing Security, Case Study-Introduction to Amazon Web Services, Why Amazon? Use Cases, AWS Storage Options, AWS Compute Options, AWS Database Options, AWS Workflow Automation and Orchestration Options, AWS Systems Management and Monitoring Options, AWS Virtual Private Cloud Introduction, Pricing Concepts",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Introduction to EC2",
        syllabus: "Introduction to EC2, Instance Types and Uses, Auto scaling Instances, Amazon Machine Images (AMIS), Modifying Existing Images, Creating New Images of Running Instances, converting an Instance Store AMI to an EBS AMI, Instances Backed by Storage Types, Elastic IPS, Elastic Load Balancing",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Web Applications and Security",
        syllabus: "Introduction to Elastic Beanstalk, Deploying Scalable Application On AWS, Selecting and Launching an Application Environment, Provisioning Application Resources with Cloud formation, Introduction to Cloud Lookout, Describe Amazon Cloud Watch metrics and alarms, AWS Messaging Services (SNS, SQS, SES). Introduction to AWS Security, Describe Amazon Identity and Access Management (IAM), AWS Directory Service, AWS Key Management Service, Securing Data at Rest and in Motion.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "AWS Storage",
        syllabus: "Amazon Storage, S3 Storage Basics, Buckets and Objects, Creating A Web Server Using S3 Endpoints, Managing Voluminous Information with EBS, Glacier Storage Service, Describe Amazon Dynamo, understand key aspects of Amazon RDS, Launch an Amazon RDS instance.",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "AWS Networking",
        syllabus: "Introduction to AWS Networking, Access Control Lists (ACLs), Setting Up a Security Group, Setting Up VPC and Internet Gateway, Setting Up A VPN, Setting Up a Customer Gateway for VPN, Setting Up Dedicated Hardware for VPC, Route53 for DNS System, Cloud front, Case Study.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "CLOUD WEB SERVICES": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction to Cloud Computing and Amazon Web Services",
        syllabus: "Introduction to Cloud Computing, Cloud Service Delivery Models (IAAS, PAAS, SAAS), Cloud Deployment Models (Private, Public, Hybrid and Community), Cloud Computing Security, Case Study-Introduction to Amazon Web Services, Why Amazon? Use Cases, AWS Storage Options, AWS Compute Options, AWS Database Options, AWS Workflow Automation and Orchestration Options, AWS Systems Management and Monitoring Options, AWS Virtual Private Cloud Introduction, Pricing Concepts",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Introduction to EC2",
        syllabus: "Introduction to EC2, Instance Types and Uses, Auto scaling Instances, Amazon Machine Images (AMIS), Modifying Existing Images, Creating New Images of Running Instances, converting an Instance Store AMI to an EBS AMI, Instances Backed by Storage Types, Elastic IPS, Elastic Load Balancing",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Web Applications and Security",
        syllabus: "Introduction to Elastic Beanstalk, Deploying Scalable Application On AWS, Selecting and Launching an Application Environment, Provisioning Application Resources with Cloud formation, Introduction to Cloud Lookout, Describe Amazon Cloud Watch metrics and alarms, AWS Messaging Services (SNS, SQS, SES). Introduction to AWS Security, Describe Amazon Identity and Access Management (IAM), AWS Directory Service, AWS Key Management Service, Securing Data at Rest and in Motion.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "AWS Storage",
        syllabus: "Amazon Storage, S3 Storage Basics, Buckets and Objects, Creating A Web Server Using S3 Endpoints, Managing Voluminous Information with EBS, Glacier Storage Service, Describe Amazon Dynamo, understand key aspects of Amazon RDS, Launch an Amazon RDS instance.",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "AWS Networking",
        syllabus: "Introduction to AWS Networking, Access Control Lists (ACLs), Setting Up a Security Group, Setting Up VPC and Internet Gateway, Setting Up A VPN, Setting Up a Customer Gateway for VPN, Setting Up Dedicated Hardware for VPC, Route53 for DNS System, Cloud front, Case Study.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "IoT and its Applications": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction to Internet of Things",
        syllabus: "Definition and characteristics of IoT- Physical design of IoT - Things in IoT - IoT Protocols - Logical Design of IoT - IoT functional blocks - IoT communication Models - IoT communication API’s - IoT enabling Technologies Wireless sensor networks - Cloud Computing - Big Data Analytics - Communication protocols - embedded systems. IoT Levels and Deployment templates",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Domain Specific IoT",
        syllabus: "Home Automation – IoT in Cities, Environment – IoT in smart grids, retails, logistics – IoT in agriculture, Industry, health & lifestyle",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "IoT and M2M",
        syllabus: "M2M - Difference between IoT and M2M - SDN and NFV for IoT- Software defined networking - network function virtualization .",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "IoT Platforms Design Methodology",
        syllabus: "IoT Design and Methodology- Purpose and requirements specification - Process specification - Domain model specification - Information model specification - service specification - IoT level specification - functional view specification - Operational view specification - Device and component integration - application development",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "IoT Physical Devices and Endpoints",
        syllabus: "IoT device - Basic Building blocks of an IoT Device. Exemplary Device: Raspberry Pi - About the Board - Linux on Raspberry Pi - Raspberry Pi Interfaces - Other IoT devices.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "High Speed Networks": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "High Speed Networks & ATM",
        syllabus: "High Speed Networks Frame Relay Networks – Asynchronous transfer mode – ATM Protocol Architecture, ATM logical Connection, ATM Cell – ATM Service Categories – AAL High Speed LAN’s: Fast Ethernet, Gigabit Ethernet, Fibre Channel – Wireless LAN’s: applications, requirements – Architecture of 802.11",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Congestion And Traffic Management",
        syllabus: "Queuing Analysis – Queuing Models – Single Server Queues – Effects of Congestion – Congestion Control – Traffic Management – Congestion Control in Packet Switching Networks – Frame Relay Congestion Control.",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "TCP And ATM Congestion Control",
        syllabus: "TCP Flow control – TCP Congestion Control – Retransmission – Timer Management – Exponential RTO backoff – KARN’s Algorithm – Window management – Performance of TCP over ATM Traffic and Congestion control in ATM – Requirements – Attributes – Traffic Management Frame work, Traffic Control – ABR traffic Management – ABR rate control, RM cell formats, ABR Capacity allocations – GFR traffic management.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Integrated And Differentiated Services",
        syllabus: "Integrated Services Architecture – Approach, Components, Services- Queuing Discipline, FQ, PS, BRFQ, GPS, WFQ – Random Early Detection, Differentiated Services.",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Protocols For QoS Support",
        syllabus: "RSVP – Goals & Characteristics, Data Flow, RSVP operations, Protocol Mechanisms – Multiprotocol Label Switching – Operations, Label Stacking, Protocol details – RTP – Protocol Architecture, Data Transfer Protocol, RTCP.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "Social Network Analysis": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction to Semantic Web & SNA",
        syllabus: "Introduction to Semantic Web: Limitations of current Web - Development of Semantic Web - Emergence of the Social Web - Social Network analysis: Development of Social Network Analysis - Key concepts and measures in network analysis - Electronic sources for network analysis: Electronic discussion networks, Blogs and online communities - Web-based networks - Applications of Social Network Analysis",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Modelling, Aggregating and Knowledge Representation",
        syllabus: "Ontology and their role in the Semantic Web: Ontology-based knowledge Representation - Ontology languages for the Semantic Web: Resource Description Framework - Web Ontology Language - Modelling and aggregating social network data: State-of-the-art in network data representation - Ontological representation of social individuals - Ontological representation of social relationships - Aggregating and reasoning with social network data",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Extraction and Mining Communities in Web Social Networks",
        syllabus: "Extracting evolution of Web Community from a Series of Web Archive - Detecting communities in social networks - Definition of community - Evaluating communities - Methods for community detection and mining - Applications of community mining algorithms - Tools for detecting communities social network infrastructures and communities - Decentralized online social networks",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Predicting Human Behaviour and Privacy Issues",
        syllabus: "Understanding and predicting human behaviour for social communities - User data management - Inference and Distribution - Enabling new human experiences - Reality mining - Context - Awareness - Privacy in online social networks - Trust in online environment - Trust models based on subjective logic - Trust network analysis - Trust transitivity analysis - Combining trust and reputation - Trust derivation based on trust comparisons.",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Visualization and Applications of Social Networks",
        syllabus: "Graph theory - Centrality - Clustering - Node-Edge Diagrams - Matrix representation - Visualizing online social networks, Visualizing social networks with matrix-based representations - Matrix and Node-Link Diagrams - Hybrid representations - Applications - Cover networks - Community welfare - Collaboration networks - Co-Citation networks.",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "Artificial Intelligence and Machine Learning Techniques": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction of Artificial Intelligence",
        syllabus: "Overview of Artificial Intelligence  Knowledge: General Concepts  Lisp and other AI Programming Languages. Knowledge Representation  Formalized Symbolic logics  Dealing with Inconsistencies and Uncertainties  Probabilistic Reasoning. Structured Knowledge : Graphs, Frames and Related Structures  Object  Oriented Representations",
        hrs: 9,
        co: "CO1",
        files: [{ id: "aiml-u1-combined", title: "Artificial Intelligence and Machine Learning Techniques - Combined Notes", fileName: "PG_Artificial_Intelligence_Machine_Learning_Complete.pdf", fileId: "1ncnBfiMy62gIvn0mOLI1wnsGxMsnuhc3", type: "pdf" }]
      },
      2: {
        title: "MODULE II",
        subtitle: "Knowledge Organization and Manipulation",
        syllabus: "Search and control Strategies - Matching Techniques - Knowledge Organization and Management. Perception and Communication: - Natural Language Processing - Pattern Recognition - visual Image Processing. Expert System Architecture: Rule-Based System Architecture - Non Production System Architecture.",
        hrs: 9,
        co: "CO2",
        files: [{ id: "aiml-u2-combined", title: "Artificial Intelligence and Machine Learning Techniques - Combined Notes", fileName: "PG_Artificial_Intelligence_Machine_Learning_Complete.pdf", fileId: "1ncnBfiMy62gIvn0mOLI1wnsGxMsnuhc3", type: "pdf" }]
      },
      3: {
        title: "MODULE III",
        subtitle: "The Machine Learning Landscape",
        syllabus: "Introduction - Types of Machine Learning Systems - Supervised/Unsupervised Learning, Batch and Online Learning, InstanceBased Versus Model-BasedLearning - Main Challenges of Machine Learning - Nonrepresentative Training Data, Poor-Quality Data - Underfitting the Training Data - Testing and Validating - Frame the Problem - Select a Performance Measure - Check the Assumptions - Create a Test Set - Visualizing Geographical Data- correlation - Prepare the Data for Machine Learning Algorithms.",
        hrs: 9,
        co: "CO3",
        files: [{ id: "aiml-u3-combined", title: "Artificial Intelligence and Machine Learning Techniques - Combined Notes", fileName: "PG_Artificial_Intelligence_Machine_Learning_Complete.pdf", fileId: "1ncnBfiMy62gIvn0mOLI1wnsGxMsnuhc3", type: "pdf" }]
      },
      4: {
        title: "MODULE IV",
        subtitle: "Data Cleaning & Classification",
        syllabus: "Data Cleaning - Handling Text and Categorical Attributes- Feature ScalingTransformation Pipelines- Select and Train a Model- Training and Evaluating on the Training Set- Fine-Tune Your Model- Grid Search- Randomized Search. Classification: MNIST- Training a Binary Classifier- Performance MeasuresMeasuring Accuracy Using Cross-Validation- Confusion Matrix- Precision and Recall Multiclass, multi-label and multi-output classification",
        hrs: 9,
        co: "CO4",
        files: [{ id: "aiml-u4-combined", title: "Artificial Intelligence and Machine Learning Techniques - Combined Notes", fileName: "PG_Artificial_Intelligence_Machine_Learning_Complete.pdf", fileId: "1ncnBfiMy62gIvn0mOLI1wnsGxMsnuhc3", type: "pdf" }]
      }
    }
  },
  "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING TECHNIQUES": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction of Artificial Intelligence",
        syllabus: "Overview of Artificial Intelligence  Knowledge: General Concepts  Lisp and other AI Programming Languages. Knowledge Representation  Formalized Symbolic logics  Dealing with Inconsistencies and Uncertainties  Probabilistic Reasoning. Structured Knowledge : Graphs, Frames and Related Structures  Object  Oriented Representations",
        hrs: 9,
        co: "CO1",
        files: [{ id: "aiml-u1-combined-alt", title: "Artificial Intelligence and Machine Learning Techniques - Combined Notes", fileName: "PG_Artificial_Intelligence_Machine_Learning_Complete.pdf", fileId: "1ncnBfiMy62gIvn0mOLI1wnsGxMsnuhc3", type: "pdf" }]
      },
      2: {
        title: "MODULE II",
        subtitle: "Knowledge Organization and Manipulation",
        syllabus: "Search and control Strategies - Matching Techniques - Knowledge Organization and Management. Perception and Communication: - Natural Language Processing - Pattern Recognition - visual Image Processing. Expert System Architecture: Rule-Based System Architecture - Non Production System Architecture.",
        hrs: 9,
        co: "CO2",
        files: [{ id: "aiml-u2-combined-alt", title: "Artificial Intelligence and Machine Learning Techniques - Combined Notes", fileName: "PG_Artificial_Intelligence_Machine_Learning_Complete.pdf", fileId: "1ncnBfiMy62gIvn0mOLI1wnsGxMsnuhc3", type: "pdf" }]
      },
      3: {
        title: "MODULE III",
        subtitle: "The Machine Learning Landscape",
        syllabus: "Introduction - Types of Machine Learning Systems - Supervised/Unsupervised Learning, Batch and Online Learning, InstanceBased Versus Model-BasedLearning - Main Challenges of Machine Learning - Nonrepresentative Training Data, Poor-Quality Data - Underfitting the Training Data - Testing and Validating - Frame the Problem - Select a Performance Measure - Check the Assumptions - Create a Test Set - Visualizing Geographical Data- correlation - Prepare the Data for Machine Learning Algorithms.",
        hrs: 9,
        co: "CO3",
        files: [{ id: "aiml-u3-combined-alt", title: "Artificial Intelligence and Machine Learning Techniques - Combined Notes", fileName: "PG_Artificial_Intelligence_Machine_Learning_Complete.pdf", fileId: "1ncnBfiMy62gIvn0mOLI1wnsGxMsnuhc3", type: "pdf" }]
      },
      4: {
        title: "MODULE IV",
        subtitle: "Data Cleaning & Classification",
        syllabus: "Data Cleaning - Handling Text and Categorical Attributes- Feature ScalingTransformation Pipelines- Select and Train a Model- Training and Evaluating on the Training Set- Fine-Tune Your Model- Grid Search- Randomized Search. Classification: MNIST- Training a Binary Classifier- Performance MeasuresMeasuring Accuracy Using Cross-Validation- Confusion Matrix- Precision and Recall Multiclass, multi-label and multi-output classification",
        hrs: 9,
        co: "CO4",
        files: [{ id: "aiml-u4-combined-alt", title: "Artificial Intelligence and Machine Learning Techniques - Combined Notes", fileName: "PG_Artificial_Intelligence_Machine_Learning_Complete.pdf", fileId: "1ncnBfiMy62gIvn0mOLI1wnsGxMsnuhc3", type: "pdf" }]
      }
    }
  },
  "DOT NET Technology": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction to .NET",
        syllabus: "Overview of C#, Literals, Variables, Data Types, Operators and Expressions, Branching, Looping, Methods, Arrays and Structures, Enumerations.",
        hrs: 9,
        co: "CO1",
        files: [{ id: "dotnet-u1-combined", title: "DOT NET Technology - Combined Notes (Module I to V)", fileName: "DOT_NET_Technology_Combined_Units_1-5.pdf", fileId: "1ciO7YAQZAwnSojejNUJ3Vo2_Gc1KmGut", type: "pdf" }]
      },
      2: {
        title: "MODULE II",
        subtitle: "Classes, Objects & Exceptions",
        syllabus: "Classes, Objects, Inheritance, Interfaces, Delegates, Events, Errors and Exceptions.",
        hrs: 9,
        co: "CO2",
        files: [{ id: "dotnet-u2-combined", title: "DOT NET Technology - Combined Notes (Module I to V)", fileName: "DOT_NET_Technology_Combined_Units_1-5.pdf", fileId: "1ciO7YAQZAwnSojejNUJ3Vo2_Gc1KmGut", type: "pdf" }]
      },
      3: {
        title: "MODULE III",
        subtitle: "Programming Web Applications with Web Forms",
        syllabus: "Standard Web server Controls Label, Textbox, Button, Link Button, Image, Image map, Links, Check & Radio button. Rich controls Calendar, Ad Rotator List Controls Check box list, Radio button list, Drop down list, List box, Data controls Data grid, Repeater Validation Controls.",
        hrs: 9,
        co: "CO3",
        files: [{ id: "dotnet-u3-combined", title: "DOT NET Technology - Combined Notes (Module I to V)", fileName: "DOT_NET_Technology_Combined_Units_1-5.pdf", fileId: "1ciO7YAQZAwnSojejNUJ3Vo2_Gc1KmGut", type: "pdf" }]
      },
      4: {
        title: "MODULE IV",
        subtitle: "Working with Data",
        syllabus: "OLEDB connection class, command class, data adaptor class, data reader data set class Web services.",
        hrs: 9,
        co: "CO4",
        files: [{ id: "dotnet-u4-combined", title: "DOT NET Technology - Combined Notes (Module I to V)", fileName: "DOT_NET_Technology_Combined_Units_1-5.pdf", fileId: "1ciO7YAQZAwnSojejNUJ3Vo2_Gc1KmGut", type: "pdf" }]
      },
      5: {
        title: "MODULE V",
        subtitle: "Session & Application Object",
        syllabus: "Application Object global.asa file, Webconfig files creating & reading application variables, Session object introduction, storing session-information, contents & identifying session, controlling when session ends, creating & reading cookies.",
        hrs: 9,
        co: "CO5, CO6",
        files: [{ id: "dotnet-u5-combined", title: "DOT NET Technology - Combined Notes (Module I to V)", fileName: "DOT_NET_Technology_Combined_Units_1-5.pdf", fileId: "1ciO7YAQZAwnSojejNUJ3Vo2_Gc1KmGut", type: "pdf" }]
      }
    }
  },
  "DOT NET TECHNOLOGY": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Introduction to .NET",
        syllabus: "Overview of C#, Literals, Variables, Data Types, Operators and Expressions, Branching, Looping, Methods, Arrays and Structures, Enumerations.",
        hrs: 9,
        co: "CO1",
        files: [{ id: "dotnet-u1-combined-alt", title: "DOT NET Technology - Combined Notes (Module I to V)", fileName: "DOT_NET_Technology_Combined_Units_1-5.pdf", fileId: "1ciO7YAQZAwnSojejNUJ3Vo2_Gc1KmGut", type: "pdf" }]
      },
      2: {
        title: "MODULE II",
        subtitle: "Classes, Objects & Exceptions",
        syllabus: "Classes, Objects, Inheritance, Interfaces, Delegates, Events, Errors and Exceptions.",
        hrs: 9,
        co: "CO2",
        files: [{ id: "dotnet-u2-combined-alt", title: "DOT NET Technology - Combined Notes (Module I to V)", fileName: "DOT_NET_Technology_Combined_Units_1-5.pdf", fileId: "1ciO7YAQZAwnSojejNUJ3Vo2_Gc1KmGut", type: "pdf" }]
      },
      3: {
        title: "MODULE III",
        subtitle: "Programming Web Applications with Web Forms",
        syllabus: "Standard Web server Controls Label, Textbox, Button, Link Button, Image, Image map, Links, Check & Radio button. Rich controls Calendar, Ad Rotator List Controls Check box list, Radio button list, Drop down list, List box, Data controls Data grid, Repeater Validation Controls.",
        hrs: 9,
        co: "CO3",
        files: [{ id: "dotnet-u3-combined-alt", title: "DOT NET Technology - Combined Notes (Module I to V)", fileName: "DOT_NET_Technology_Combined_Units_1-5.pdf", fileId: "1ciO7YAQZAwnSojejNUJ3Vo2_Gc1KmGut", type: "pdf" }]
      },
      4: {
        title: "MODULE IV",
        subtitle: "Working with Data",
        syllabus: "OLEDB connection class, command class, data adaptor class, data reader data set class Web services.",
        hrs: 9,
        co: "CO4",
        files: [{ id: "dotnet-u4-combined-alt", title: "DOT NET Technology - Combined Notes (Module I to V)", fileName: "DOT_NET_Technology_Combined_Units_1-5.pdf", fileId: "1ciO7YAQZAwnSojejNUJ3Vo2_Gc1KmGut", type: "pdf" }]
      },
      5: {
        title: "MODULE V",
        subtitle: "Session & Application Object",
        syllabus: "Application Object global.asa file, Webconfig files creating & reading application variables, Session object introduction, storing session-information, contents & identifying session, controlling when session ends, creating & reading cookies.",
        hrs: 9,
        co: "CO5, CO6",
        files: [{ id: "dotnet-u5-combined-alt", title: "DOT NET Technology - Combined Notes (Module I to V)", fileName: "DOT_NET_Technology_Combined_Units_1-5.pdf", fileId: "1ciO7YAQZAwnSojejNUJ3Vo2_Gc1KmGut", type: "pdf" }]
      }
    }
  },
  "Big Data Analytics": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Understanding Big Data",
        syllabus: "What is big data why big data convergence of key trends unstructured data industry examples of big data web analytics big data and marketing fraud and big data risk and big data credit risk management big data and algorithmic trading big data and healthcare big data in medicine.",
        hrs: 10,
        co: "CO1",
        files: [{ id: "bda-u1-combined", title: "Big Data Analytics - Combined Notes (Module I to V)", fileName: "PG_Big_Data_Analytics_Complete.pdf", fileId: "1y7twYBvt7QGLVybAOFxWw-LTlWBRAgpp", type: "pdf" }]
      },
      2: {
        title: "MODULE II",
        subtitle: "NoSQL Data Management",
        syllabus: "Introduction to NoSQL aggregate data models aggregates key-value and document data models relationships graph databases schemaless databases materialized views distribution models sharding master-slave replication peer-peer replication sharding and replication consistency relaxing consistency version stamps map-reduce partitioning and combining composing map-reduce calculations.",
        hrs: 10,
        co: "CO2",
        files: [{ id: "bda-u2-combined", title: "Big Data Analytics - Combined Notes (Module I to V)", fileName: "PG_Big_Data_Analytics_Complete.pdf", fileId: "1y7twYBvt7QGLVybAOFxWw-LTlWBRAgpp", type: "pdf" }]
      },
      3: {
        title: "MODULE III",
        subtitle: "Basics of Hadoop",
        syllabus: "Data format analyzing data with Hadoop scaling out Hadoop streaming Hadoop pipes design of Hadoop distributed file system (HDFS) HDFS concepts Java interface data flow Hadoop I/O data integrity compression serialization Avro file-based data structures.",
        hrs: 10,
        co: "CO3",
        files: [{ id: "bda-u3-combined", title: "Big Data Analytics - Combined Notes (Module I to V)", fileName: "PG_Big_Data_Analytics_Complete.pdf", fileId: "1y7twYBvt7QGLVybAOFxWw-LTlWBRAgpp", type: "pdf" }]
      },
      4: {
        title: "MODULE IV",
        subtitle: "MapReduce Applications",
        syllabus: "Mapreduce workflows unit tests with MRUnit test data and local tests anatomy of MapReduce job run classic Map-reduce YARN failures in classic Map-reduce and YARN job scheduling shuffle and sort task execution MapReduce types input formats output formats.",
        hrs: 10,
        co: "CO4",
        files: [{ id: "bda-u4-combined", title: "Big Data Analytics - Combined Notes (Module I to V)", fileName: "PG_Big_Data_Analytics_Complete.pdf", fileId: "1y7twYBvt7QGLVybAOFxWw-LTlWBRAgpp", type: "pdf" }]
      },
      5: {
        title: "MODULE V",
        subtitle: "Hadoop Related Tools",
        syllabus: "hbase data model and implementations Hbase clients Hbase examples praxis.Cassandra cassandra data model cassandra examples cassandra clients. Hadoop integration. Pig Grunt pig data model Pig Latin developing and testing Pig Latin scripts. Hive data types and file formats HiveQL data definition HiveQL data manipulation HiveQL queries.",
        hrs: 5,
        co: "CO5, CO6",
        files: [{ id: "bda-u5-combined", title: "Big Data Analytics - Combined Notes (Module I to V)", fileName: "PG_Big_Data_Analytics_Complete.pdf", fileId: "1y7twYBvt7QGLVybAOFxWw-LTlWBRAgpp", type: "pdf" }]
      }
    }
  },
  "BIG DATA ANALYTICS": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Understanding Big Data",
        syllabus: "What is big data why big data convergence of key trends unstructured data industry examples of big data web analytics big data and marketing fraud and big data risk and big data credit risk management big data and algorithmic trading big data and healthcare big data in medicine.",
        hrs: 10,
        co: "CO1",
        files: [{ id: "bda-u1-combined-alt", title: "Big Data Analytics - Combined Notes (Module I to V)", fileName: "PG_Big_Data_Analytics_Complete.pdf", fileId: "1y7twYBvt7QGLVybAOFxWw-LTlWBRAgpp", type: "pdf" }]
      },
      2: {
        title: "MODULE II",
        subtitle: "NoSQL Data Management",
        syllabus: "Introduction to NoSQL aggregate data models aggregates key-value and document data models relationships graph databases schemaless databases materialized views distribution models sharding master-slave replication peer-peer replication sharding and replication consistency relaxing consistency version stamps map-reduce partitioning and combining composing map-reduce calculations.",
        hrs: 10,
        co: "CO2",
        files: [{ id: "bda-u2-combined-alt", title: "Big Data Analytics - Combined Notes (Module I to V)", fileName: "PG_Big_Data_Analytics_Complete.pdf", fileId: "1y7twYBvt7QGLVybAOFxWw-LTlWBRAgpp", type: "pdf" }]
      },
      3: {
        title: "MODULE III",
        subtitle: "Basics of Hadoop",
        syllabus: "Data format analyzing data with Hadoop scaling out Hadoop streaming Hadoop pipes design of Hadoop distributed file system (HDFS) HDFS concepts Java interface data flow Hadoop I/O data integrity compression serialization Avro file-based data structures.",
        hrs: 10,
        co: "CO3",
        files: [{ id: "bda-u3-combined-alt", title: "Big Data Analytics - Combined Notes (Module I to V)", fileName: "PG_Big_Data_Analytics_Complete.pdf", fileId: "1y7twYBvt7QGLVybAOFxWw-LTlWBRAgpp", type: "pdf" }]
      },
      4: {
        title: "MODULE IV",
        subtitle: "MapReduce Applications",
        syllabus: "Mapreduce workflows unit tests with MRUnit test data and local tests anatomy of MapReduce job run classic Map-reduce YARN failures in classic Map-reduce and YARN job scheduling shuffle and sort task execution MapReduce types input formats output formats.",
        hrs: 10,
        co: "CO4",
        files: [{ id: "bda-u4-combined-alt", title: "Big Data Analytics - Combined Notes (Module I to V)", fileName: "PG_Big_Data_Analytics_Complete.pdf", fileId: "1y7twYBvt7QGLVybAOFxWw-LTlWBRAgpp", type: "pdf" }]
      },
      5: {
        title: "MODULE V",
        subtitle: "Hadoop Related Tools",
        syllabus: "hbase data model and implementations Hbase clients Hbase examples praxis.Cassandra cassandra data model cassandra examples cassandra clients. Hadoop integration. Pig Grunt pig data model Pig Latin developing and testing Pig Latin scripts. Hive data types and file formats HiveQL data definition HiveQL data manipulation HiveQL queries.",
        hrs: 5,
        co: "CO5, CO6",
        files: [{ id: "bda-u5-combined-alt", title: "Big Data Analytics - Combined Notes (Module I to V)", fileName: "PG_Big_Data_Analytics_Complete.pdf", fileId: "1y7twYBvt7QGLVybAOFxWw-LTlWBRAgpp", type: "pdf" }]
      }
    }
  },
  "Information Security": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Security Attacks, Services & Mechanisms",
        syllabus: "Security Attacks (Interruption, Interception, Modification and Fabrication), Security Services (Confidentiality, Authentication, Integrity, Non-repudiation, access Control and Availability) and Mechanisms.",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Public Key Cryptography & Key Management",
        syllabus: "Public key cryptography principles, public key cryptography algorithms, digital signatures, digital Certificates, Certificate Authority and key management Kerberos,X.509 Directory Authentication Service",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Email Privacy & IP Security",
        syllabus: "Email privacy: Pretty Good Privacy (PGP) and S/MIME.P Security Overview, IP Security Architecture, Authentication Header, Encapsulating Security Payload, Combining Security Associations and Key Management",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Web Security Requirements & Protocols",
        syllabus: "Web Security Requirements, Secure Socket Layer (SSL) and Transport Layer Security (TLS), Secure Electronic Transaction (SET",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "SNMP, Threats, Firewalls & IDS",
        syllabus: "Basic concepts of SNMP, SNMPv1 Community facility and SNMPv3, Intruders, Viruses and related threats Firewall Design principles, Trusted Systems, Intrusion Detection Systems",
        hrs: 9,
        co: "CO5, CO6",
        files: []
      }
    }
  },
  "INFORMATION SECURITY": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Security Attacks, Services & Mechanisms",
        syllabus: "Security Attacks (Interruption, Interception, Modification and Fabrication), Security Services (Confidentiality, Authentication, Integrity, Non-repudiation, access Control and Availability) and Mechanisms.",
        hrs: 9,
        co: "CO1",
        files: []
      },
      2: {
        title: "MODULE II",
        subtitle: "Public Key Cryptography & Key Management",
        syllabus: "Public key cryptography principles, public key cryptography algorithms, digital signatures, digital Certificates, Certificate Authority and key management Kerberos,X.509 Directory Authentication Service",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Email Privacy & IP Security",
        syllabus: "Email privacy: Pretty Good Privacy (PGP) and S/MIME.P Security Overview, IP Security Architecture, Authentication Header, Encapsulating Security Payload, Combining Security Associations and Key Management",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Web Security Requirements & Protocols",
        syllabus: "Web Security Requirements, Secure Socket Layer (SSL) and Transport Layer Security (TLS), Secure Electronic Transaction (SET",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "SNMP, Threats, Firewalls & IDS",
        syllabus: "Basic concepts of SNMP, SNMPv1 Community facility and SNMPv3, Intruders, Viruses and related threats Firewall Design principles, Trusted Systems, Intrusion Detection Systems",
        hrs: 9,
        co: "CO5, CO6",
        files: []
      }
    }
  },
  "Cyber Forensics": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Digital Investigation & Computer Crime",
        syllabus: "Digital Evidence and Computer Crime - History and Terminology of Computer Crime Investigation - Technology and Law - The Investigative Process - Investigative Reconstruction - Modus Operandi, Motive and Technology - Digital Evidence in the Courtroom.",
        hrs: 9,
        co: "CO1",
        files: [
          { id: "cf-notes-1", title: "Cyber Forensics - Complete Study Material & Lecture Notes", fileName: "Cyber_Forensics_Notes.pdf", fileId: "1pfhQ9xQ8nfoDqUPlVAQRxXk79Pc37qx2", type: "pdf" }
        ]
      },
      2: {
        title: "MODULE II",
        subtitle: "Understanding Information & Data Storage",
        syllabus: "Methods of storing data: number systems, character codes, record structures, file formats and file signatures - Word processing and graphic file formats - Structure and Analysis of Optical Media Disk Formats - Recognition of file formats and internal buffers used by the most common CD and DVD writing applications - Extraction of forensic artifacts with a view to establishing possible provenance of a CD or DVD",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Computer Basics for Digital Investigators",
        syllabus: "Computer Forensic Fundamentals - Applying Forensic Science to computers - Computer Forensic Services - Benefits of Professional Forensic Methodology - Steps taken by computer forensic specialists.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Types of Computer Forensics & Tools",
        syllabus: "Tools and Types of Military Computer Forensics Technology - Tools and Types of Law Enforcement Computer Forensic Technology - Tools and Types of Business Computer Forensic Technology",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Standards, Guidelines and Best Practices",
        syllabus: "Handling the Digital Crime Scene - Digital Evidence Examination Guidelines – ACPO – IOCE – SWGDE – DFRWS – IACIS – HTCIA - ISO 27037",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  },
  "CYBER FORENSICS": {
    units: {
      1: {
        title: "MODULE I",
        subtitle: "Digital Investigation & Computer Crime",
        syllabus: "Digital Evidence and Computer Crime - History and Terminology of Computer Crime Investigation - Technology and Law - The Investigative Process - Investigative Reconstruction - Modus Operandi, Motive and Technology - Digital Evidence in the Courtroom.",
        hrs: 9,
        co: "CO1",
        files: [
          { id: "cf-notes-1", title: "Cyber Forensics - Complete Study Material & Lecture Notes", fileName: "Cyber_Forensics_Notes.pdf", fileId: "1pfhQ9xQ8nfoDqUPlVAQRxXk79Pc37qx2", type: "pdf" }
        ]
      },
      2: {
        title: "MODULE II",
        subtitle: "Understanding Information & Data Storage",
        syllabus: "Methods of storing data: number systems, character codes, record structures, file formats and file signatures - Word processing and graphic file formats - Structure and Analysis of Optical Media Disk Formats - Recognition of file formats and internal buffers used by the most common CD and DVD writing applications - Extraction of forensic artifacts with a view to establishing possible provenance of a CD or DVD",
        hrs: 9,
        co: "CO2",
        files: []
      },
      3: {
        title: "MODULE III",
        subtitle: "Computer Basics for Digital Investigators",
        syllabus: "Computer Forensic Fundamentals - Applying Forensic Science to computers - Computer Forensic Services - Benefits of Professional Forensic Methodology - Steps taken by computer forensic specialists.",
        hrs: 9,
        co: "CO3",
        files: []
      },
      4: {
        title: "MODULE IV",
        subtitle: "Types of Computer Forensics & Tools",
        syllabus: "Tools and Types of Military Computer Forensics Technology - Tools and Types of Law Enforcement Computer Forensic Technology - Tools and Types of Business Computer Forensic Technology",
        hrs: 9,
        co: "CO4",
        files: []
      },
      5: {
        title: "MODULE V",
        subtitle: "Standards, Guidelines and Best Practices",
        syllabus: "Handling the Digital Crime Scene - Digital Evidence Examination Guidelines – ACPO – IOCE – SWGDE – DFRWS – IACIS – HTCIA - ISO 27037",
        hrs: 9,
        co: "CO5",
        files: []
      }
    }
  }
};

function getDrivePreviewUrl(fileId, type = "pdf") {
  if (fileId && (fileId.startsWith("/") || fileId.startsWith("http"))) return fileId;
  if (type === "doc") return `https://docs.google.com/document/d/${fileId}/preview`;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

function getDriveDownloadUrl(fileId, type = "pdf") {
  if (fileId && (fileId.startsWith("/") || fileId.startsWith("http"))) return fileId;
  if (type === "doc") return `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

function getDriveViewUrl(fileId) {
  if (!fileId) return "#";
  if (fileId.startsWith("/") || fileId.startsWith("http")) return fileId;
  return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
}

const unitColors = [
  { from: "bg-[#0F4C81]", to: "text-white", light: "bg-[#F0F4F8]" },
  { from: "bg-[#2E7D32]", to: "text-white", light: "bg-[#E8F5E9]" },
  { from: "bg-[#1E88E5]", to: "text-white", light: "bg-[#E8EAF6]" },
  { from: "bg-amber-600", to: "text-white", light: "bg-[#FFF3E0]" },
  { from: "bg-red-600", to: "text-white", light: "bg-[#FFEBEE]" },
];

export default function Notes() {
  const { user } = useAuth();
  const isFaculty = user?.type === "faculty";
  const [courseType, setCourseType] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(null);
  const [activePodcast, setActivePodcast] = useState(null);
  const [showLabModal, setShowLabModal] = useState(false);
  const [vivaSubject, setVivaSubject] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadFileObj, setUploadFileObj] = useState(null);

  async function handleUpload(e) {
    e.preventDefault();
    if (!uploadFileObj) {
      toast.error("Please select a file to upload");
      return;
    }
    if (!uploadTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }
    setUploading(true);
    try {
      const fileUrl = await uploadFile(STORAGE_PATHS.NOTES, uploadFileObj, setProgress);
      await noteService.create({
        title: uploadTitle.trim(),
        description: uploadDescription.trim(),
        subject: selectedSubject,
        semester: Number(selectedSemester),
        year: Number(selectedYear),
        fileUrl,
        facultyName: user.name || "Faculty",
        facultyId: user.uid || "faculty-id",
      });
      setUploadCompleted(true);
      toast.success("✅ Upload Completed!");

      setTimeout(() => {
        setUploadTitle("");
        setUploadDescription("");
        setUploadFileObj(null);
        setShowUploadForm(false);
        setUploading(false);
        setUploadCompleted(false);
        setProgress(0);
        refetch();
      }, 1500);
    } catch (err) {
      toast.error(err.message || "Failed to upload");
      setUploading(false);
      setProgress(0);
    }
  }

  const handleDeleteNote = async (note) => {
    try {
      await noteService.remove(note.id);
      toast.success(`Deleted "${note.title}" successfully!`);
      refetch();
    } catch (err) {
      toast.error("Failed to delete note: " + err.message);
    }
  };

  const activeCurriculum = courseType === "pg" ? CURRICULUM_PG : CURRICULUM;
  const yearData = selectedYear ? activeCurriculum[selectedYear] : null;
  const semesterData = selectedSemester && yearData ? yearData.semesters[selectedSemester] : null;
  const ys = selectedYear ? yearStyles[selectedYear] : yearStyles[1];
  const isPlaceholder = (selectedYear === 2 && selectedSubject && PLACEHOLDER_SUBJECTS.has(selectedSubject)) ||
    (NAME_ONLY_MAP[`${selectedYear}-${selectedSemester}`]?.has(selectedSubject));
  const subjectNotesData = !isPlaceholder && selectedSubject ? NOTES_DATA[selectedSubject] : null;

  const { items: uploadedNotes, refetch } = useFirestoreList(noteService);

  const currentLabRecords = useMemo(() => {
    if (!selectedYear || !selectedSemester || courseType === "pg") return [];
    return LAB_RECORDS_DATA[`${selectedYear}-${selectedSemester}`] || [];
  }, [selectedYear, selectedSemester, courseType]);

  const subjectLabRecords = useMemo(() => {
    if (!selectedYear || !selectedSemester || !selectedSubject) return [];
    const upperSub = selectedSubject.toUpperCase();
    return currentLabRecords.filter((lab) => {
      const labSub = lab.subject.toUpperCase();
      return labSub === upperSub || labSub.includes(upperSub) || upperSub.includes(labSub);
    });
  }, [selectedYear, selectedSemester, selectedSubject, currentLabRecords]);

  const activeLabRecords = selectedSubject ? subjectLabRecords : currentLabRecords;

  const uploadedSubjectNotes = useMemo(() => {
    if (!selectedSubject || isPlaceholder) return [];
    return uploadedNotes
      .filter((n) => n.subject?.toUpperCase() === selectedSubject)
      .map((n) => ({
        id: n.id,
        title: n.title,
        fileName: n.title,
        fileUrl: n.fileUrl,
        subject: n.subject,
        fromFirestore: true,
      }));
  }, [selectedSubject, uploadedNotes]);

  const syllabusData = useMemo(() => {
    if (!selectedSubject || isPlaceholder) return null;
    const subjectData = NOTES_DATA[selectedSubject];
    if (!subjectData || !subjectData.units) return null;
    const filter = SEMESTER_UNITS[`${selectedYear}-${selectedSemester}`]?.[selectedSubject];
    return Object.entries(subjectData.units)
      .filter(([key]) => !filter || filter.has(Number(key)))
      .map(([key, unit], idx) => ({
        sl: idx + 1,
        module: `${unit.title}${unit.subtitle ? ` - ${unit.subtitle}` : ""}: ${unit.syllabus || "Syllabus content to be updated."}`,
        hrs: unit.hrs || 15,
        co: unit.co || `CO${key}`,
      }));
  }, [selectedSubject, selectedYear, selectedSemester, isPlaceholder]);

  if (!courseType) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 bg-[#FAF0F2]">
        <NotesTopAiHeader />
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center flex flex-col items-center justify-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#011337] via-[#021C4F] to-[#7F011F] p-1.5 shadow-xl shadow-rose-950/20 ring-4 ring-amber-400/40 transition-transform hover:scale-105 duration-300">
            <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-[#021C4F] text-amber-300">
              <FiBookOpen size={48} className="text-amber-400 drop-shadow-md" />
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-md">
            <FiBookOpen size={14} /> LECTURE NOTES &amp; SYLLABUS
          </span>
          <h1 className="font-sans text-4xl font-extrabold text-[#021C4F]">Lecture Notes &amp; Syllabus</h1>
          <p className="mt-2 text-sm text-[#6B7280]">Select your degree program to browse faculty-curated PDF notes &amp; syllabus</p>
        </motion.div>

        {/* 2 Main Course Cards: B.Sc. CS (UG) & M.Sc. CS (PG) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
          {/* B.Sc. CS (UG) Card */}
          <motion.button
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 90 }}
            whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
            onClick={() => setCourseType("ug")}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#C50337] via-[#A0022B] to-[#7F011F] border-2 border-amber-400 text-white shadow-lg transition-all duration-300 hover:shadow-xl text-center flex flex-col justify-between"
          >
            <div className="relative p-6 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-2xl font-black text-amber-300 transition-all duration-300 group-hover:scale-110 shadow-md">
                UG
              </div>
              <span className="inline-block bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2 shadow-xs">
                3 Years · 6 Semesters
              </span>
              <h2 className="text-lg font-black text-white leading-snug">B.Sc. Computer Science</h2>
              <p className="mt-1 text-[11px] text-rose-100 font-medium">Undergraduate Notes &amp; Syllabus</p>
              <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-black text-amber-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                Browse UG <FiChevronRight size={12} />
              </div>
            </div>
          </motion.button>

          {/* M.Sc. CS (PG) Card */}
          <motion.button
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 90 }}
            whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
            onClick={() => setCourseType("pg")}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#C50337] via-[#A0022B] to-[#7F011F] border-2 border-amber-400 text-white shadow-lg transition-all duration-300 hover:shadow-xl text-center flex flex-col justify-between"
          >
            <div className="relative p-6 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-2xl font-black text-amber-300 transition-all duration-300 group-hover:scale-110 shadow-md">
                PG
              </div>
              <span className="inline-block bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2 shadow-xs">
                2 Years · 4 Semesters
              </span>
              <h2 className="text-lg font-black text-white leading-snug">M.Sc. Computer Science</h2>
              <p className="mt-1 text-[11px] text-rose-100 font-medium">Postgraduate Notes &amp; Syllabus</p>
              <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-black text-amber-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                Browse PG <FiChevronRight size={12} />
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    );
  }

  if (!selectedYear) {
    const yearsList = courseType === "pg" ? [1, 2] : [1, 2, 3];
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 bg-[#FAF0F2]">
        <NotesTopAiHeader />
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => { setCourseType(null); setSelectedYear(null); setSelectedSubject(null); }}
          className="mb-8 inline-flex items-center gap-2 rounded-xl border-2 border-[#D1D5DB] bg-white px-5 py-2.5 text-sm sm:text-base font-extrabold text-[#374151] shadow-md hover:bg-[#F3F4F6] hover:scale-105 transition-all"
        ><FiArrowLeft size={20} /> Back to Course</motion.button>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center flex flex-col items-center justify-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#021C4F] text-amber-300 shadow-md">
            <FiBookOpen size={28} />
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#021C4F] tracking-tight">{courseType.toUpperCase()} — Select Year</h1>
          <p className="mt-2 text-xs sm:text-sm font-medium text-[#6B7280]">Choose your academic year</p>
        </motion.div>
        <div className={`grid grid-cols-1 gap-6 ${courseType === "pg" ? "sm:grid-cols-2 max-w-2xl mx-auto" : "sm:grid-cols-3"}`}>
          {yearsList.map((year, i) => {
            return (
              <motion.button key={year}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, type: "spring", stiffness: 80 }}
                whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedYear(year)}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#C50337] via-[#A0022B] to-[#7F011F] border-2 border-amber-400 text-white shadow-xl transition-all duration-300 hover:shadow-2xl text-center flex flex-col justify-between"
              >
                <div className="relative p-8 text-center">
                  <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-3xl font-bold transition-all duration-300 group-hover:scale-110 shadow-md">
                    {activeCurriculum[year].icon}
                  </div>
                  <span className="inline-block bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2 shadow-sm">
                    {Object.keys(activeCurriculum[year].semesters).length} Semesters
                  </span>
                  <h2 className="text-xl font-black text-white">{activeCurriculum[year].label}</h2>
                  <p className="mt-1.5 text-xs text-rose-100 font-medium">Faculty-curated PDF Notes</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-black text-amber-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    Browse Notes <FiChevronRight size={12} />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  if (!selectedSemester) {
    const sems = Object.entries(yearData.semesters);
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <NotesTopAiHeader />
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => { setSelectedYear(null); setSelectedSemester(null); setSelectedSubject(null); }}
          className="mb-8 inline-flex items-center gap-2 rounded-xl border-2 border-[#D1D5DB] bg-white px-5 py-2.5 text-sm sm:text-base font-extrabold text-[#374151] shadow-md hover:bg-[#F3F4F6] hover:scale-105 transition-all"
        ><FiArrowLeft size={20} /> Back to Years</motion.button>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center flex flex-col items-center justify-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#011337] via-[#021C4F] to-[#7F011F] p-1.5 shadow-xl shadow-rose-950/20 ring-4 ring-amber-400/40 transition-transform hover:scale-105 duration-300">
            <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-[#021C4F] text-amber-300">
              <FiBookOpen size={48} className="text-amber-400 drop-shadow-md" />
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-md">
            <FiBookOpen size={14} /> LECTURE NOTES SEMESTER SELECTION
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#021C4F] tracking-tight">{yearData.label}</h1>
          <p className="mt-2 text-sm text-[#6B7280] font-medium">Choose a semester to view faculty-curated PDF notes &amp; syllabus</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {sems.map(([semKey, semData], i) => (
            <motion.button key={semKey}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSemester(Number(semKey))}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#C50337] via-[#A0022B] to-[#7F011F] border-2 border-amber-400 text-white shadow-xl transition-all duration-300 hover:shadow-2xl text-center flex flex-col justify-between"
            >
              <div className="relative p-8 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-2xl font-black text-amber-300 shadow-md">
                  {Number(semKey) === 1 ? "SEM I" : "SEM II"}
                </div>
                <h2 className="text-xl font-black text-white">{semData.label}</h2>
                <p className="mt-1.5 text-xs text-rose-100 font-medium">{semData.subjects.length} Subjects</p>
                <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-black text-amber-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  Explore Subjects <FiChevronRight size={12} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedSubject) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => setSelectedSemester(null)}
          className="mb-8 inline-flex items-center gap-2 rounded-xl border-2 border-[#D1D5DB] bg-white px-5 py-2.5 text-sm sm:text-base font-extrabold text-[#374151] shadow-md hover:bg-[#F3F4F6] hover:scale-105 transition-all"
        ><FiArrowLeft size={20} /> Back to Semesters</motion.button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-2">
              <span className="uppercase font-semibold text-[#6B7280]">{courseType.toUpperCase()}</span><FiChevronRight size={10} />
              <span className={ys.text}>{yearData.label}</span><FiChevronRight size={12} /><span className={ys.text}>{semesterData.label}</span>
            </div>
            <h1 className="font-sans text-2xl font-bold text-[#0F4C81]">Select Subject</h1>
            <p className="mt-1 text-xs text-[#6B7280]">
              {courseType === "pg" ? "Choose a subject to browse lecture notes" : "Choose a subject to browse lecture notes or access practical lab records"}
            </p>
          </div>

          {courseType !== "pg" && (
            <button
              onClick={() => setShowLabModal(true)}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7F011F] to-[#0F4C81] px-5 py-3 text-xs font-black text-white shadow-md hover:from-[#990227] hover:to-[#1E88E5] hover:shadow-lg transition-all active:scale-95 cursor-pointer shrink-0 border border-white/20"
            >
              <FiCode size={16} />
              🧪 Lab Record ({yearData.label} - {semesterData.label})
            </button>
          )}
        </motion.div>
        {semesterData.subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E5E7EB] bg-white py-20 shadow-sm">
            <FiBookOpen size={48} className="mb-3 text-slate-300" />
            <p className="text-sm font-medium text-[#4B5563]">Subjects will be added soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {semesterData.subjects.map((subject, i) => {
              const sc = subjectColors[i % subjectColors.length];
              const isNameOnly = (selectedYear === 2 && PLACEHOLDER_SUBJECTS.has(subject)) ||
                (NAME_ONLY_MAP[`${selectedYear}-${selectedSemester}`]?.has(subject));
              const subjectData = isNameOnly ? null : NOTES_DATA[subject];
              const hasNotes = (subjectData && Object.values(subjectData.units).some(u => u.files.length > 0)) || (courseType === "pg" && (subject.includes("Advanced Database Management System") || subject === "Advanced Design and Analysis of Algorithms" || subject === "DOT NET Technology" || subject === "DOT NET TECHNOLOGY" || subject === "Digital Image Processing" || subject === "Big Data Analytics" || subject === "BIG DATA ANALYTICS" || subject === "Artificial Intelligence and Machine Learning Techniques" || subject === "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING TECHNIQUES" || subject === "Data Mining Techniques" || subject === "Mobile Network System" || subject === "MOBILE NETWORK SYSTEM"));
              const semesterFilter = NAME_ONLY_MAP[`${selectedYear}-${selectedSemester}`]?.has(subject)
                ? null : SEMESTER_UNITS[`${selectedYear}-${selectedSemester}`]?.[subject];
              const filteredSubjectUnits = subjectData && semesterFilter
                ? Object.entries(subjectData.units).filter(([key]) => semesterFilter.has(Number(key)))
                : subjectData ? Object.entries(subjectData.units) : [];
              const isPgCombinedSubject = courseType === "pg" && (subject.includes("Advanced Database Management System") || subject === "Advanced Design and Analysis of Algorithms" || subject === "DOT NET Technology" || subject === "DOT NET TECHNOLOGY" || subject === "Digital Image Processing" || subject === "Big Data Analytics" || subject === "BIG DATA ANALYTICS" || subject === "Artificial Intelligence and Machine Learning Techniques" || subject === "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING TECHNIQUES" || subject === "Data Mining Techniques" || subject === "Mobile Network System" || subject === "MOBILE NETWORK SYSTEM");
              const totalFiles = isPgCombinedSubject ? 1 : (filteredSubjectUnits.length > 0
                ? filteredSubjectUnits.reduce((s, [, u]) => s + u.files.length, 0)
                : 0);
              const facultyName = courseType === "pg" && selectedYear === 1 && selectedSemester === 1
                ? PG_FIRST_YEAR_SEM1_FACULTY[subject]
                : selectedYear === 1 && selectedSemester === 1
                ? FIRST_YEAR_SEM1_FACULTY[subject]
                : selectedYear === 2 && selectedSemester === 1
                ? SECOND_YEAR_SEM1_FACULTY[subject]
                : isNameOnly ? null : FACULTY_MAP[subject];
              return (
                <motion.button key={subject}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSubject(subject)}
                  className="glass-card-hover group bg-white border border-[#E5E7EB] shadow-sm rounded-xl transition-all duration-300 hover:shadow-sm hover:border-[#1E88E5]/40 text-left"
                >
                  <div className="relative flex items-start gap-4 p-5 text-left">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#FAF7F2] border border-[#E6DAB8] shadow-sm transition-all duration-300 group-hover:scale-105">
                      {getSubjectIcon(subject, 26)}
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <h3 className="font-sans font-bold text-sm text-[#0F4C81] leading-snug">{subject}</h3>
                      {facultyName && <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-[#6B7280]">{facultyName}</p>}
                      <div className="mt-3 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] px-2.5 py-0.5 text-[10px] font-bold"><FiFileText size={10} /> VIEW NOTES</span>
                        {hasNotes && <span className="inline-flex items-center rounded-full bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-0.5 text-[9px] font-bold">{totalFiles} PDF{totalFiles !== 1 ? "s" : ""}</span>}
                        <FiChevronRight size={14} className="text-slate-400 group-hover:text-[#1E88E5] transition-colors ml-auto" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        <AnimatePresence>
          {showLabModal && (
            <motion.div key="lab-modal-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 text-left"
              onClick={() => setShowLabModal(false)}
            >
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] shadow-2xl"
              >
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#021C4F] via-[#0F4C81] to-[#C50337] text-white">
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <FiCode size={18} /> Laboratory Practical Records & Manuals
                    </h3>
                    <p className="text-xs text-white/80 mt-0.5">
                      {yearData?.label || "UG Course"} · {semesterData?.label || "Semester View"}
                    </p>
                  </div>
                  <button onClick={() => setShowLabModal(false)} className="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white transition-all">
                    <FiX size={16} />
                  </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-3 bg-[#F8FAFC]">
                  {activeLabRecords.length > 0 ? (
                    activeLabRecords.map((lab) => (
                      <div key={lab.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm hover:border-[#0F4C81]/40 transition-all">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs shadow-sm">
                            LAB
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-[#0F4C81] truncate">{lab.title}</h4>
                            <p className="text-[11px] text-[#6B7280]">{lab.subject} · {lab.fileName}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-auto">
                          <button
                            onClick={() => setViewingPdf({ ...lab, unit: "Lab Record" })}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white transition-all cursor-pointer"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => setVivaSubject(lab.subject)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7F011F] to-[#990227] px-3.5 py-1.5 text-xs font-black text-white shadow-md hover:from-[#990227] hover:to-[#021C4F] transition-all cursor-pointer"
                          >
                            <FiMic size={14} /> AI Voice Viva
                          </button>
                          <a
                            href={getDriveViewUrl(lab.fileId)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-[#0F4C81]/30 bg-white px-3 py-1.5 text-xs font-bold text-[#0F4C81] hover:bg-slate-100 transition-all cursor-pointer"
                          >
                            <FiExternalLink size={12} /> Drive
                          </a>
                          <button
                            onClick={() => downloadDriveFile(lab.fileId, lab.title)}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#0F4C81] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#1E88E5] transition-all cursor-pointer"
                          >
                            <FiDownload size={14} /> Download
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-slate-400">
                      <FiFileText size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-medium">No lab records uploaded for this semester yet.</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#E5E7EB] bg-white px-6 py-3 text-right">
                  <button onClick={() => setShowLabModal(false)} className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200">
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {viewingPdf && (
            <motion.div key="pdf-modal-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 text-left"
              onClick={() => setViewingPdf(null)}
            >
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="flex w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white border border-[#E5E7EB] shadow-2xl"
              >
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E7EB] bg-[#0F4C81] text-white">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-white">{viewingPdf.title}</h3>
                    <p className="text-[11px] text-white/80">{viewingPdf.subject} · {viewingPdf.unit}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={getDriveViewUrl(viewingPdf.fileId || viewingPdf.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-bold text-white border border-white/20 hover:bg-white hover:text-[#0F4C81] transition-all cursor-pointer"
                    >
                      <FiExternalLink size={14} /> Open in Drive
                    </a>
                    <button onClick={() => downloadDriveFile(viewingPdf.fileId || viewingPdf.url, viewingPdf.title)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F4C81] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#1E88E5] transition-all active:scale-95 cursor-pointer"
                    ><FiDownload size={14} /> Download</button>
                    <button onClick={() => setViewingPdf(null)}
                      className="rounded-full bg-white/10 p-1.5 text-white/70 hover:bg-white/20 hover:text-white transition-all">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </div>
                </div>
                <div className="aspect-[4/3] w-full bg-slate-900 sm:aspect-[16/10] lg:aspect-[16/9]">
                  <iframe src={getDrivePreviewUrl(viewingPdf.fileId, viewingPdf.type)} title={viewingPdf.title} className="h-full w-full" allowFullScreen />
                </div>
                <div className="border-t border-[#E5E7EB] px-5 py-2.5 flex items-center justify-between text-[11px] text-[#6B7280] bg-[#F8FAFC]">
                  <span className="truncate max-w-[60%]">{viewingPdf.fileName} · {viewingPdf.subject}</span>
                  <a
                    href={getDriveViewUrl(viewingPdf.fileId || viewingPdf.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#0F4C81] hover:underline inline-flex items-center gap-1 shrink-0"
                  >
                    <FiExternalLink size={12} /> View Full PDF in Google Drive ↗
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const sc = subjectColors[semesterData.subjects.indexOf(selectedSubject) % subjectColors.length];
  const allUnits = subjectNotesData ? Object.entries(subjectNotesData.units) : [];
  const semesterUnitFilter = selectedSubject && !isPlaceholder ? SEMESTER_UNITS[`${selectedYear}-${selectedSemester}`]?.[selectedSubject] : null;
  const filteredUnits = semesterUnitFilter ? allUnits.filter(([key]) => semesterUnitFilter.has(Number(key))) : allUnits;
  const units = filteredUnits;
  const totalFiles = units.reduce((s, [, u]) => s + u.files.length, 0);

  const isInfoSecurity = selectedSubject?.toUpperCase().includes("INFORMATION SECURITY");
  const isAdvancedSE = selectedSubject?.toUpperCase().includes("ADVANCED SOFTWARE ENGINEERING");

  const isEnglish = selectedSubject === "ENGLISH" || selectedSubject === "FOUNDATION ENGLISH - I" || selectedSubject === "Foundation English - III";
  const englishPdf = selectedSubject === "FOUNDATION ENGLISH - I"
    ? NOTES_DATA["FOUNDATION ENGLISH - I"]?.units?.[1]?.files?.[0]
    : selectedSubject === "Foundation English - III"
    ? NOTES_DATA["Foundation English - III"]?.units?.[1]?.files?.[0]
    : isEnglish && NOTES_DATA["ENGLISH"]?.units?.[selectedYear === 2 ? 2 : 1]?.files?.[0];

  const isPhp = selectedSubject === "PROGRAMMING IN PHP";
  const phpPdf = isPhp ? {
    id: "php-complete-pdf",
    title: "Programming in PHP — Unit 1 to Unit 5 Complete Notes",
    fileName: "Programming_in_PHP_Complete_Notes_Unit1_to_5.pdf",
    fileId: "1wfEGD7qYL7VgyGaXFct-ElXCgzH2L27x",
    type: "pdf"
  } : null;

  // PG Combined PDF — all 5 units in a single PDF
  const isPgCombined = courseType === "pg" && (selectedSubject.includes("Advanced Database Management System") || selectedSubject === "Advanced Design and Analysis of Algorithms" || selectedSubject === "DOT NET Technology" || selectedSubject === "DOT NET TECHNOLOGY" || selectedSubject === "Digital Image Processing" || selectedSubject === "Big Data Analytics" || selectedSubject === "BIG DATA ANALYTICS" || selectedSubject === "Artificial Intelligence and Machine Learning Techniques" || selectedSubject === "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING TECHNIQUES" || selectedSubject === "Data Mining Techniques" || selectedSubject === "Mobile Network System" || selectedSubject === "MOBILE NETWORK SYSTEM");
  const pgCombinedPdf = isPgCombined ? (
    selectedSubject === "Data Mining Techniques" ? {
      id: "pg-dmt-complete-pdf",
      title: "Data Mining Techniques — Complete Notes (Module I to V)",
      fileName: "PG_Data_Mining_Techniques_Complete.pdf",
      fileId: "1sHXJ3ynonZuQPow8iwt92n5u9ROEo3FX",
      type: "pdf",
      pageCount: "Combined 5 Modules",
    } : selectedSubject.includes("Advanced Database Management System") ? {
      id: "pg-adbms-complete-pdf",
      title: "Advanced Database Management System — Complete Notes (Module I to V)",
      fileName: "PG_Advanced_Database_Management_System_Complete.pdf",
      fileId: "1lb-w3FOfs1_EIiyTE4P3hXuZtQaTzkOJ",
      type: "pdf",
      pageCount: "Combined 5 Modules",
    } : (selectedSubject === "Artificial Intelligence and Machine Learning Techniques" || selectedSubject === "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING TECHNIQUES") ? {
      id: "pg-aiml-complete-pdf",
      title: "Artificial Intelligence and Machine Learning Techniques — Complete Notes",
      fileName: "PG_Artificial_Intelligence_Machine_Learning_Complete.pdf",
      fileId: "1ncnBfiMy62gIvn0mOLI1wnsGxMsnuhc3",
      type: "pdf",
      pageCount: "Combined Notes",
    } : (selectedSubject === "Big Data Analytics" || selectedSubject === "BIG DATA ANALYTICS") ? {
      id: "pg-bda-complete-pdf",
      title: "Big Data Analytics — Complete Notes (Module I to V)",
      fileName: "PG_Big_Data_Analytics_Complete.pdf",
      fileId: "1y7twYBvt7QGLVybAOFxWw-LTlWBRAgpp",
      type: "pdf",
      pageCount: "Combined 5 Modules",
    } : selectedSubject === "Digital Image Processing" ? {
      id: "pg-dip-complete-pdf",
      title: "Digital Image Processing — Complete Notes (Module I to V)",
      fileName: "PG_Digital_Image_Processing_Complete.pdf",
      fileId: "1uG68TNwRWMzxwEVodI0tgb6oqmpU68zA",
      type: "pdf",
      pageCount: "Combined 5 Modules",
    } : (selectedSubject === "DOT NET Technology" || selectedSubject === "DOT NET TECHNOLOGY") ? {
      id: "pg-dotnet-complete-pdf",
      title: "DOT NET Technology — Complete Notes (Module I to V)",
      fileName: "DOT_NET_Technology_Combined_Units_1-5.pdf",
      fileId: "1ciO7YAQZAwnSojejNUJ3Vo2_Gc1KmGut",
      type: "pdf",
      pageCount: "Combined 5 Units",
    } : (selectedSubject === "Mobile Network System" || selectedSubject === "MOBILE NETWORK SYSTEM") ? {
      id: "pg-mns-complete-pdf",
      title: "Mobile Network System — Complete Notes (Module I to V)",
      fileName: "Mobile Network System Complete.pdf",
      fileId: "/Mobile Network System Complete.pdf",
      type: "pdf",
      pageCount: "Combined 5 Modules",
    } : {
      id: "pg-adaa-complete-pdf",
      title: "Advanced Design and Analysis of Algorithms — Complete Notes (Module I to V)",
      fileName: "PG_Advanced_Design_Analysis_Algorithms_Complete.pdf",
      fileId: "1y2q8sXuc7g5ZV0YSiJ__duYoVfnJzURx",
      type: "pdf",
      pageCount: 348,
    }
  ) : null;

  // Determine the current subject's semester number for pre-filling upload form
  const currentSemesterNumber = selectedSemester;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen bg-[#FAF0F2] text-[#2D060E]">
      <NotesTopAiHeader />
      {/* ─── Faculty Upload Section ─── */}
      {isFaculty && selectedSubject && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          {!showUploadForm ? (
            <button
              onClick={() => setShowUploadForm(true)}
              className="group inline-flex items-center gap-2 rounded-lg bg-[#0F4C81] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#1E88E5] active:scale-[0.97]"
            >
              <FiUploadCloud size={18} />
              Upload Notes
            </button>
          ) : (
            <form onSubmit={handleUpload} className="space-y-4 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 mb-4">
                <h3 className="font-sans text-base font-bold text-[#0F4C81] flex items-center gap-2">
                  <FiUploadCloud size={18} className="text-[#0F4C81]" />
                  Upload Notes — {selectedSubject}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#6B7280] hover:bg-[#F8FAFC] transition-all"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Title</label>
                  <input
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    required
                    placeholder="e.g. Unit 1 Introduction"
                    className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F4C81] placeholder:text-[#6B7280]/60 outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]/15 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Description</label>
                  <textarea
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="Brief description of the note"
                    rows={2}
                    className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F4C81] placeholder:text-[#6B7280]/60 outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]/15 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Select File</label>
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-[#E5E7EB] bg-[#F8FAFC] px-4 py-6 text-center transition-all hover:border-[#1E88E5]/50 hover:bg-slate-100">
                    <FiUploadCloud size={24} className="text-[#0F4C81]" />
                    <span className="text-xs text-[#6B7280]">
                      {uploadFileObj ? uploadFileObj.name : "Choose a PDF, DOC, PPTX file..."}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.pptx,.ppt"
                      className="hidden"
                      onChange={(e) => setUploadFileObj(e.target.files?.[0] ?? null)}
                      required={!uploading}
                    />
                  </label>
                </div>

                {uploading && progress > 0 && progress < 100 && (
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-150">
                    <div className="h-full bg-[#0F4C81] transition-all" style={{ width: `${progress}%` }} />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading || uploadCompleted}
                  className={`w-full rounded-xl py-3.5 text-sm font-extrabold text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    uploadCompleted
                      ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/30 scale-[1.01]"
                      : "bg-[#0F4C81] hover:bg-[#1E88E5]"
                  }`}
                >
                  {uploadCompleted ? (
                    <>
                      <FiCheckCircle size={20} className="text-white animate-bounce" />
                      <span>✅ Upload Completed!</span>
                    </>
                  ) : uploading ? (
                    <>
                      <FiUploadCloud size={18} className="animate-pulse" />
                      <span>{progress >= 100 ? "Finalizing upload..." : `Uploading (${progress}%)...`}</span>
                    </>
                  ) : (
                    "Upload note"
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => { setSelectedSubject(null); setExpandedUnit(null); setViewingPdf(null); }}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border-2 border-[#D1D5DB] bg-white px-5 py-2.5 text-sm sm:text-base font-extrabold text-[#374151] shadow-md hover:bg-[#F3F4F6] hover:scale-105 transition-all"
        ><FiArrowLeft size={20} /> Back to Subjects</motion.button>
        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <span className={ys.text}>{yearData.label}</span><FiChevronRight size={10} /><span className={ys.text}>{semesterData.label}</span><FiChevronRight size={10} /><span className="text-[#0F4C81] font-semibold">{selectedSubject}</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#FAF7F2] border border-[#E6DAB8] shadow-sm p-1">
            {getSubjectIcon(selectedSubject, 32)}
          </div>
          <div>
            <h1 className="font-sans text-2xl font-bold text-[#0F4C81]">{selectedSubject}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-[#6B7280]">{yearData.label} · {semesterData.label}</span>
              {syllabusData && <span className="badge-primary">{syllabusData.length} modules</span>}
              {totalFiles > 0 && <span className="badge-success">{totalFiles} PDF{totalFiles !== 1 ? "s" : ""}</span>}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {subjectLabRecords.length > 0 && (
            <button
              onClick={() => setVivaSubject(selectedSubject)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#7F011F] to-[#990227] hover:from-[#990227] hover:to-[#021C4F] px-4 py-2.5 text-xs font-black text-white shadow-md hover:scale-105 transition-all cursor-pointer border border-white/20"
            >
              <FiMic size={16} /> 🎙️ AI Voice Viva
            </button>
          )}
          <button
            onClick={() =>
              setActivePodcast({
                title: "Complete Subject Revision",
                subtitle: "Overview & Exam Key Points",
                syllabus: syllabusData?.map((s) => s.module).join(". ") || "Core Computer Science concepts and exam revision points.",
                subject: selectedSubject,
                year: selectedYear,
                semester: selectedSemester,
              })
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-[#C50337] px-4 py-2.5 text-xs font-black text-white shadow-md hover:scale-105 transition-all cursor-pointer border border-amber-300/40 font-mono"
            title="Listen to AI Audio Podcast Overview"
          >
            🎙️ AI Audio Podcast (Quick Revision)
          </button>
        </div>
      </motion.div>

      {!isEnglish && syllabusData ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8 overflow-hidden rounded-xl bg-white border border-[#E5E7EB] shadow-sm"
        >
          <div className="bg-[#0F4C81] px-5 py-3.5 flex items-center gap-2 text-white">
            <FiBookOpen size={15} />
            <span className="text-xs font-bold uppercase tracking-wider">Syllabus</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#0F4C81]">
                  <th className="px-5 py-3 font-bold uppercase tracking-wider w-14">Sl No</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider">Contents of Module</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-center w-20">Hrs</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-center w-20">COs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {syllabusData.map((row) => (
                  <tr key={row.sl} className="hover:bg-[#F0F4F8] transition-colors">
                    <td className="px-5 py-3.5 font-bold text-[#0F4C81] align-top">{row.sl}</td>
                    <td className="px-5 py-3.5 text-[#4B5563] leading-relaxed font-medium">{row.module}</td>
                    <td className="px-5 py-3.5 text-center font-semibold text-[#0F4C81] align-top">{row.hrs}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-[#0F4C81] align-top">{row.co}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : !isEnglish ? (
        <div className="mb-8 rounded-xl border border-dashed border-[#E5E7EB] bg-white py-16 text-center shadow-sm">
          <FiBookOpen size={40} className="mx-auto mb-3 text-slate-350" />
          <p className="text-sm text-[#6B7280]">Syllabus not yet available</p>
        </div>
      ) : null}

      {/* Information Security PDF Notes List (rendered directly below Syllabus Table) */}
      {isInfoSecurity && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 mt-6">
          <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F4C81] text-white shadow-sm">
                <FiDownload size={18} />
              </div>
              <div>
                <h2 className="font-sans text-lg font-bold text-[#0F4C81]">
                  Information Security — Lecture Notes (Module I to V)
                </h2>
                <p className="text-[11px] text-[#6B7280]">
                  Faculty-curated study material PDFs for all 5 modules
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setActivePodcast({
                  title: "Information Security — Complete PG Revision",
                  subtitle: "Module I to V Complete Syllabus Revision",
                  syllabus: syllabusData?.map((s) => s.module).join(". ") || "Information Security PG syllabus concepts",
                  subject: selectedSubject,
                  year: selectedYear,
                  semester: selectedSemester,
                });
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-[#C50337] px-4 py-2 text-xs font-black text-white shadow-md hover:scale-105 transition-all cursor-pointer font-mono"
              title="Listen to AI Audio Podcast for all 5 Modules"
            >
              🎙️ AI Podcast
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INFO_SECURITY_PDFS.map((file, idx) => (
              <PdfFileCard
                key={file.id}
                file={{
                  ...file,
                  subject: selectedSubject,
                  year: Number(selectedYear),
                  semester: Number(selectedSemester),
                  unit: `Module ${idx + 1}`,
                }}
                onView={(fileToView) => setViewingPdf(fileToView)}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Advanced Software Engineering PDF Notes List (rendered directly below Syllabus Table) */}
      {isAdvancedSE && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 mt-6">
          <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F4C81] text-white shadow-sm">
                <FiDownload size={18} />
              </div>
              <div>
                <h2 className="font-sans text-lg font-bold text-[#0F4C81]">
                  Advanced Software Engineering — Lecture Notes & Reference PDFs
                </h2>
                <p className="text-[11px] text-[#6B7280]">
                  6 study material PDFs in exact order
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setActivePodcast({
                  title: "Advanced Software Engineering — Complete PG Revision",
                  subtitle: "Module I to V Complete Syllabus Revision",
                  syllabus: syllabusData?.map((s) => s.module).join(". ") || "Advanced Software Engineering PG syllabus concepts",
                  subject: selectedSubject,
                  year: selectedYear,
                  semester: selectedSemester,
                  files: ADVANCED_SE_PDFS,
                });
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-[#C50337] px-4 py-2 text-xs font-black text-white shadow-md hover:scale-105 transition-all cursor-pointer font-mono"
              title="Listen to AI Audio Podcast for all 5 Modules"
            >
              🎙️ AI Podcast
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ADVANCED_SE_PDFS.map((file, idx) => (
              <PdfFileCard
                key={file.id}
                file={{
                  ...file,
                  subject: selectedSubject,
                  year: Number(selectedYear),
                  semester: Number(selectedSemester),
                  unit: `PDF ${idx + 1}`,
                }}
                onView={(fileToView) => setViewingPdf(fileToView)}
              />
            ))}
          </div>
        </motion.div>
      )}

      {isEnglish && englishPdf && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F4C81] text-white shadow-sm"><FiDownload size={18} /></div>
            <div>
              <h2 className="font-sans text-lg font-bold text-[#0F4C81]">
                {selectedSubject === "FOUNDATION ENGLISH - I" ? "English Course Book" : "English - Complete Notes"}
              </h2>
              <p className="text-[11px] text-[#6B7280]">
                {selectedSubject === "FOUNDATION ENGLISH - I" ? "Course Book PDF for download & preview" : "Complete English notes PDF for download"}
              </p>
            </div>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
            <div className="p-5">
              <motion.button
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                onClick={() => setViewingPdf({ ...englishPdf, subject: selectedSubject, unit: selectedSubject === "FOUNDATION ENGLISH - I" ? "Course Book" : "Complete Notes" })}
                className="group flex w-full items-center gap-3 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-left transition-all hover:bg-[#F0F4F8] hover:border-[#1E88E5]/30 hover:shadow-sm"
              >
                <div className="flex h-14 w-12 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-650 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-[#0F4C81] group-hover:text-[#1E88E5] transition-colors">{englishPdf.title}</p>
                  <p className="text-xs text-[#6B7280]">
                    {selectedSubject === "FOUNDATION ENGLISH - I" ? "PDF · Semester I Course Book" : "PDF · Complete Notes"}
                  </p>
                </div>
                <div className="shrink-0 rounded-full bg-white border border-[#E5E7EB] p-2 text-[#4B5563] hover:bg-slate-100 hover:text-slate-900 transition-all">
                  <a href={getDriveDownloadUrl(englishPdf.fileId, englishPdf.type)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    <FiDownload size={16} />
                  </a>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {isPhp && phpPdf && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F4C81] text-white shadow-sm"><FiDownload size={18} /></div>
            <div>
              <h2 className="font-sans text-lg font-bold text-[#0F4C81]">
                Programming in PHP — Complete Notes (Unit 1 to Unit 5)
              </h2>
              <p className="text-[11px] text-[#6B7280]">
                Single complete notes PDF covering Unit 1, Unit 2, Unit 3, Unit 4 & Unit 5
              </p>
            </div>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
            <div className="p-5">
              <motion.button
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                onClick={() => setViewingPdf({ ...phpPdf, subject: selectedSubject, unit: "Unit 1 to Unit 5 Complete Notes" })}
                className="group flex w-full items-center gap-3 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-left transition-all hover:bg-[#F0F4F8] hover:border-[#1E88E5]/30 hover:shadow-sm"
              >
                <div className="flex h-14 w-12 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-650 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-[#0F4C81] group-hover:text-[#1E88E5] transition-colors">{phpPdf.title}</p>
                  <p className="text-xs text-[#6B7280]">PDF · Unit 1 to Unit 5 Complete Notes</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadDriveFile(phpPdf.fileId, phpPdf.title);
                    }}
                    className="rounded-full bg-[#0F4C81]/10 text-[#0F4C81] p-2 hover:bg-[#0F4C81] hover:text-white transition-all cursor-pointer"
                    title="Download file directly"
                  >
                    <FiDownload size={16} />
                  </button>
                  <div className="rounded-full bg-white border border-[#E5E7EB] p-2 text-[#4B5563] hover:bg-slate-100 hover:text-slate-900 transition-all"><FiExternalLink size={14} /></div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* PG Combined Notes — All Modules in 1 PDF */}
      {isPgCombined && pgCombinedPdf && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#0F4C81] to-[#7F011F] text-white shadow-sm"><FiLayers size={18} /></div>
            <div>
              <h2 className="font-sans text-lg font-bold text-[#0F4C81]">
                PG Complete Notes — Module I to V
              </h2>
              <p className="text-[11px] text-[#6B7280]">
                Single combined PDF · {pgCombinedPdf.pageCount} pages · All 5 modules in one document
              </p>
            </div>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
            <div className="p-5">
              <motion.button
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                onClick={() => setViewingPdf({ ...pgCombinedPdf, subject: selectedSubject, unit: "Module I to V Complete Notes" })}
                className="group flex w-full items-center gap-4 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-5 text-left transition-all hover:bg-[#F0F4F8] hover:border-[#1E88E5]/30 hover:shadow-sm"
              >
                <div className="flex h-16 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#7F011F] shadow-md">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-[#0F4C81] group-hover:text-[#1E88E5] transition-colors">{pgCombinedPdf.title}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">PDF · Module I to V Combined · {pgCombinedPdf.pageCount} pages</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center rounded-full bg-[#0F4C81]/10 text-[#0F4C81] px-2.5 py-0.5 text-[10px] font-bold">Module I</span>
                    <span className="inline-flex items-center rounded-full bg-[#0F4C81]/10 text-[#0F4C81] px-2.5 py-0.5 text-[10px] font-bold">Module II</span>
                    <span className="inline-flex items-center rounded-full bg-[#0F4C81]/10 text-[#0F4C81] px-2.5 py-0.5 text-[10px] font-bold">Module III</span>
                    <span className="inline-flex items-center rounded-full bg-[#0F4C81]/10 text-[#0F4C81] px-2.5 py-0.5 text-[10px] font-bold">Module IV</span>
                    <span className="inline-flex items-center rounded-full bg-[#0F4C81]/10 text-[#0F4C81] px-2.5 py-0.5 text-[10px] font-bold">Module V</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePodcast({
                        title: `${selectedSubject} — Complete PG Revision`,
                        subtitle: "Module I to V Complete Syllabus Revision",
                        syllabus: syllabusData?.map((s) => s.module).join(". ") || `${selectedSubject} PG syllabus concepts, algorithms, models, and exam revision points.`,
                        subject: selectedSubject,
                        year: selectedYear,
                        semester: selectedSemester,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-[#C50337] px-3.5 py-2 text-xs font-black text-white shadow-md hover:scale-105 transition-all cursor-pointer border border-amber-300/40 font-mono"
                    title="Listen to AI Audio Podcast for all 5 Modules"
                  >
                    🎙️ AI Podcast
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadDriveFile(pgCombinedPdf.fileId, pgCombinedPdf.title);
                    }}
                    className="rounded-full bg-[#0F4C81]/10 text-[#0F4C81] p-2.5 hover:bg-[#0F4C81] hover:text-white transition-all cursor-pointer"
                    title="Download complete PDF"
                  >
                    <FiDownload size={18} />
                  </button>
                  <div className="rounded-full bg-white border border-[#E5E7EB] p-2.5 text-[#4B5563] hover:bg-slate-100 hover:text-slate-900 transition-all">
                    <FiExternalLink size={16} />
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Uploaded Notes from Firestore */}
      {uploadedSubjectNotes.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F4C81] text-white shadow-sm"><FiDownload size={18} /></div>
            <div>
              <h2 className="font-sans text-lg font-bold text-[#0F4C81]">Uploaded Notes</h2>
              <p className="text-[11px] text-[#6B7280]">{uploadedSubjectNotes.length} note{uploadedSubjectNotes.length > 1 ? "s" : ""} uploaded by faculty</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {uploadedSubjectNotes.map((note) => (
              <a key={note.id}
                href={getDriveViewUrl(note.fileUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-lg border border-[#E5E7EB] bg-white p-4 transition-all hover:bg-[#F8FAFC] hover:border-[#1E88E5]/30 hover:shadow-sm"
              >
                <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-650 shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#0F4C81] truncate group-hover:text-[#1E88E5] transition-colors">{note.title}</p>
                  <p className="text-[10px] text-[#6B7280]">PDF · {note.subject}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 group-hover:text-[#1E88E5] shrink-0"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            ))}
          </div>
        </motion.div>
      )}

      {!isEnglish && !isPhp && !isPgCombined && !isInfoSecurity && subjectNotesData && units.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F4C81] text-white shadow-sm"><FiDownload size={18} /></div>
            <div>
              <h2 className="font-sans text-lg font-bold text-[#0F4C81]">Download Notes</h2>
              <p className="text-[11px] text-[#6B7280]">{totalFiles} PDFs available across {units.length} units</p>
            </div>
          </div>
          <div className="space-y-3">
            {units.map(([unitKey, unit], idx) => {
              const uc = unitColors[idx % unitColors.length];
              const isExpanded = expandedUnit === unitKey;
              const fileCount = unit.files.length;
              const unitProgressData = loadUnitProgress(selectedSubject, unit.title);
              const completedCount = unitProgressData?.completedTopics?.length || 0;

              return (
                <motion.div key={unitKey} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }}
                  className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden shadow-sm"
                >
                  <button onClick={() => setExpandedUnit(isExpanded ? null : unitKey)}
                    className={`flex w-full items-center justify-between px-5 py-4 text-left transition-all ${isExpanded ? `${uc.light} border-b border-[#E5E7EB]` : "hover:bg-[#F8FAFC]"}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${uc.from} ${uc.to} text-xs font-bold shadow-sm transition-transform duration-300 ${isExpanded ? 'scale-105' : ''}`}>{idx + 1}</div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-[#0F4C81]">{unit.title}</h3>
                          {completedCount > 0 && (
                            <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 text-[10px] font-black font-mono">
                              ✓ {completedCount} Taught
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#6B7280]">{unit.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePodcast({
                            title: unit.title,
                            subtitle: unit.subtitle,
                            syllabus: unit.syllabus,
                            files: unit.files,
                            subject: selectedSubject,
                            year: selectedYear,
                            semester: selectedSemester,
                          });
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#0F766E] text-white px-3 py-1 text-xs font-bold shadow-sm hover:scale-105 transition-all cursor-pointer font-mono"
                        title="Listen to AI Unit Podcast"
                      >
                        🎙️ AI Podcast
                      </button>
                      {fileCount > 0 && <span className="rounded-full bg-[#0F4C81]/10 text-[#0F4C81] px-3 py-0.5 text-[10px] font-bold">{fileCount} PDF{fileCount > 1 ? "s" : ""}</span>}
                      <FiChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden bg-[#F8FAFC]">
                        <div className="px-5 py-4">
                          {unit.syllabus && (
                            <div className="mb-4 rounded-lg bg-white px-4 py-3 border border-[#E5E7EB]">
                              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Topics Covered</p>
                              <p className="text-[11px] text-[#4B5563] leading-relaxed">{unit.syllabus}</p>
                            </div>
                          )}
                          {fileCount > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {unit.files.map((file) => (
                                <PdfFileCard
                                  key={file.id}
                                  file={{
                                    ...file,
                                    subject: selectedSubject,
                                    year: Number(selectedYear),
                                    semester: Number(selectedSemester),
                                    unit: unit.title,
                                  }}
                                  onView={(fileToView) => setViewingPdf(fileToView)}
                                  onDelete={isFaculty ? (n) => handleDeleteNote(n) : null}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center py-6 text-slate-400">
                              <FiFileText size={24} className="mb-1 opacity-40" />
                              <p className="text-xs font-medium">No PDFs uploaded yet</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {viewingPdf && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 text-left"
            onClick={() => setViewingPdf(null)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="flex w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white border border-[#E5E7EB] shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E7EB] bg-[#0F4C81] text-white">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-white">{viewingPdf.title}</h3>
                  <p className="text-[11px] text-white/80">{viewingPdf.subject} · {viewingPdf.unit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={getDriveViewUrl(viewingPdf.fileId || viewingPdf.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-bold text-white border border-white/20 hover:bg-white hover:text-[#0F4C81] transition-all cursor-pointer"
                  >
                    <FiExternalLink size={14} /> Open in Drive
                  </a>
                  <button onClick={() => downloadDriveFile(viewingPdf.fileId || viewingPdf.url, viewingPdf.title)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-[#0F4C81] border border-[#E5E7EB] hover:bg-[#F8FAFC] transition-all active:scale-95 cursor-pointer"
                  ><FiDownload size={14} /> Download</button>
                  <button onClick={() => setViewingPdf(null)}
                    className="rounded-full bg-white/10 p-1.5 text-white/70 hover:bg-white/20 hover:text-white transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              </div>
              <div className="aspect-[4/3] w-full bg-slate-900 sm:aspect-[16/10] lg:aspect-[16/9]">
                <iframe src={getDrivePreviewUrl(viewingPdf.fileId, viewingPdf.type)} title={viewingPdf.title} className="h-full w-full" allowFullScreen />
              </div>
              <div className="border-t border-[#E5E7EB] px-5 py-2.5 flex items-center justify-between text-[11px] text-[#6B7280] bg-[#F8FAFC]">
                <span className="truncate max-w-[60%]">{viewingPdf.fileName} · {viewingPdf.subject}</span>
                <a
                  href={getDriveViewUrl(viewingPdf.fileId || viewingPdf.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0F4C81] hover:underline inline-flex items-center gap-1 shrink-0"
                >
                  <FiExternalLink size={12} /> View Full PDF in Google Drive ↗
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
      {activePodcast && (
        <AudioPodcastPlayerModal
          unitData={activePodcast}
          subjectName={selectedSubject}
          onClose={() => setActivePodcast(null)}
        />
      )}
      {vivaSubject && (
        <AiVoiceVivaModule
          subjectName={vivaSubject}
          onClose={() => setVivaSubject(null)}
        />
      )}
    </div>
  );
}

export { CURRICULUM, NOTES_DATA, SEMESTER_UNITS, NAME_ONLY_MAP };
