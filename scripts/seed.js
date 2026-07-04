/**
 * CS Academic Portal — Seed Script
 * ===================================
 * Run with: node scripts/seed.js
 *
 * Prerequisites:
 * 1. Create a Firebase service account in Firebase Console → Project Settings → Service Accounts
 * 2. Download the JSON key and save it as serviceAccountKey.json in the project root
 * 3. Install: npm install firebase-admin dotenv
 * 4. Copy .env and fill in your Firebase credentials
 * 5. Run: node scripts/seed.js
 */

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

// Initialize Firebase Admin
let serviceAccount;
try {
  serviceAccount = require(path.resolve(__dirname, "..", "serviceAccountKey.json"));
} catch (e) {
  console.error("❌ Could not find serviceAccountKey.json in project root.");
  console.error("   Download it from Firebase Console → Project Settings → Service Accounts → Generate New Private Key");
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// ============================================================
// DATA
// ============================================================

const SUBJECTS = [
  "Programming in C", "C++", "Java", "Python",
  "Data Structures", "Algorithms",
  "Operating Systems", "Computer Networks",
  "Database Systems", "Software Engineering",
  "Artificial Intelligence", "Machine Learning",
  "Cloud Computing", "Compiler Design",
  "Web Technologies", "Data Mining",
  "Cyber Security", "Computer Graphics",
  "Internet of Things", "Mobile Computing",
];

const FACULTY = [
  "Dr. Ananya Rao", "Prof. Karthik Iyer", "Dr. Meera Nair",
  "Prof. Rohan Das", "Dr. Priya Sharma", "Prof. Arjun Menon",
];

const COMPANIES = [
  { name: "Google", role: "Software Engineer", pkg: 32, cgpa: "8.0", skills: "DSA, System Design, Go/Python" },
  { name: "Microsoft", role: "SDE", pkg: 28, cgpa: "7.5", skills: "C++, .NET, Azure" },
  { name: "Amazon", role: "SDE-1", pkg: 26, cgpa: "7.0", skills: "Java, DSA, OOP" },
  { name: "Zoho", role: "Full Stack Developer", pkg: 12, cgpa: "6.5", skills: "React, Java, SQL" },
  { name: "Infosys", role: "Systems Engineer", pkg: 8, cgpa: "6.0", skills: "Java, Python" },
  { name: "TCS", role: "Software Developer", pkg: 7, cgpa: "6.0", skills: "Any programming language" },
  { name: "Accenture", role: "Associate Software Engineer", pkg: 9, cgpa: "6.5", skills: "Java, SQL" },
  { name: "Wipro", role: "Project Engineer", pkg: 7.5, cgpa: "6.0", skills: "Java, Python" },
  { name: "Cognizant", role: "Programmer Analyst", pkg: 8, cgpa: "6.0", skills: "Java, SQL" },
  { name: "Capgemini", role: "Software Engineer", pkg: 8.5, cgpa: "6.5", skills: "Java, Python, SQL" },
  { name: "HCL", role: "Software Engineer", pkg: 7.5, cgpa: "6.0", skills: "Java, .NET" },
  { name: "Freshworks", role: "Product Engineer", pkg: 14, cgpa: "7.5", skills: "Ruby, React, SQL" },
  { name: "Oracle", role: "Application Developer", pkg: 18, cgpa: "7.5", skills: "Java, SQL, Cloud" },
  { name: "IBM", role: "Software Developer", pkg: 10, cgpa: "7.0", skills: "Java, Python, Cloud" },
  { name: "Deloitte", role: "Technology Analyst", pkg: 11, cgpa: "7.0", skills: "Java, SQL, Analytical Skills" },
];

// ============================================================
// HELPERS
// ============================================================

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedCollection(name, items) {
  const col = db.collection(name);
  console.log(`   → Seeding ${items.length} documents into "${name}"...`);

  let count = 0;
  for (const item of items) {
    await col.add({
      ...item,
      views: randomInt(10, 500),
      likes: randomInt(3, 80),
      createdAt: Timestamp.fromDate(new Date(Date.now() - randomInt(1, 180) * 24 * 60 * 60 * 1000)),
    });
    count++;
    if (count % 10 === 0) process.stdout.write(".");
  }
  console.log(` ✅ Done (${count} items)`);
}

// ============================================================
// SEED FUNCTIONS
// ============================================================

function generateVideos(count = 50) {
  const topics = {
    "Programming in C": ["Introduction to C", "Pointers & Memory Management", "File Handling in C", "Structures & Unions", "Dynamic Memory Allocation"],
    "C++": ["OOP Concepts in C++", "Templates & STL", "Inheritance & Polymorphism", "Operator Overloading", "Exception Handling"],
    "Java": ["Java Collections Framework", "Multithreading in Java", "JDBC & Database Connectivity", "Java Streams API", "JavaFX GUI"],
    "Python": ["Python Basics & Syntax", "OOP in Python", "NumPy & Pandas", "Flask Web Framework", "Web Scraping with Python"],
    "Data Structures": ["Arrays & Linked Lists", "Stacks & Queues", "Trees & Graphs", "Hash Tables", "Sorting Algorithms"],
    "Operating Systems": ["Process Management", "Memory Management", "File Systems", "Deadlocks", "CPU Scheduling"],
    "Computer Networks": ["OSI & TCP/IP Models", "Routing Protocols", "Network Security", "DNS & HTTP", "Wireless Networks"],
    "Database Systems": ["ER Diagrams & Normalization", "SQL Queries & Joins", "Transaction Management", "NoSQL Databases", "Query Optimization"],
    "Software Engineering": ["SDLC Models", "Agile & Scrum", "UML Diagrams", "Software Testing", "DevOps Basics"],
    "Artificial Intelligence": ["Search Algorithms", "Knowledge Representation", "Expert Systems", "Natural Language Processing", "Robotics"],
    "Machine Learning": ["Linear Regression", "Decision Trees & Random Forests", "Neural Networks", "Support Vector Machines", "Clustering Algorithms"],
    "Cloud Computing": ["AWS EC2 & S3", "Azure Fundamentals", "Google Cloud Platform", "Docker & Kubernetes", "Serverless Architecture"],
    "Compiler Design": ["Lexical Analysis", "Parsing Techniques", "Syntax-Directed Translation", "Code Optimization", "Code Generation"],
    "Web Technologies": ["HTML5 & CSS3", "JavaScript & DOM", "React.js Basics", "Node.js & Express", "RESTful APIs"],
    "Data Mining": ["Data Preprocessing", "Association Rules", "Classification Techniques", "Cluster Analysis", "Text Mining"],
    "Cyber Security": ["Cryptography Basics", "Network Security", "Ethical Hacking", "Web Application Security", "Digital Forensics"],
    "Computer Graphics": ["2D Transformations", "3D Graphics Pipeline", "OpenGL Basics", "Animation Techniques", "Image Processing"],
    "Internet of Things": ["IoT Architecture", "Sensor Networks", "Raspberry Pi Programming", "MQTT Protocol", "IoT Security"],
    "Mobile Computing": ["Android App Development", "iOS Basics", "Cross-Platform Development", "Mobile UI/UX", "Mobile Security"],
  };

  const videos = [];
  for (let i = 0; i < count; i++) {
    const subject = randomItem(SUBJECTS);
    const topic = randomItem(topics[subject] || ["Introduction", "Advanced Topics", "Practical Session"]);
    const faculty = randomItem(FACULTY);
    const semester = randomInt(1, 8);
    const courseType = semester <= 4 ? "ug" : randomItem(["ug", "pg"]);

    videos.push({
      title: `${topic} — Lecture ${randomInt(1, 12)}`,
      description: `Comprehensive lecture covering ${topic.toLowerCase()} with practical examples and problem-solving sessions. Suitable for semester ${semester} students.`,
      subject,
      semester,
      courseType,
      facultyName: faculty,
      thumbnailUrl: "",
      fileUrl: "",
      duration: `${randomInt(25, 90)}:${String(randomInt(0, 59)).padStart(2, "0")}`,
    });
  }
  return videos;
}

function generateNotes(count = 30) {
  const notes = [];
  for (let i = 0; i < count; i++) {
    const subject = randomItem(SUBJECTS);
    const faculty = randomItem(FACULTY);
    const semester = randomInt(1, 8);
    const courseType = semester <= 4 ? "ug" : randomItem(["ug", "pg"]);

    notes.push({
      title: `${subject} — Unit ${randomInt(1, 5)} Notes`,
      description: `Comprehensive notes covering unit ${randomInt(1, 5)} of ${subject}. Includes key concepts, examples, and practice questions.`,
      subject,
      semester,
      courseType,
      facultyName: faculty,
      fileUrl: "",
    });
  }
  return notes;
}

function generateQuestionPapers(count = 25) {
  const papers = [];
  const years = [2023, 2024, 2025];
  const regulations = ["R21", "R20", "R19"];

  for (let i = 0; i < count; i++) {
    const subject = randomItem(SUBJECTS);
    const semester = randomInt(1, 8);
    const courseType = semester <= 4 ? "ug" : randomItem(["ug", "pg"]);

    papers.push({
      title: `${subject} — ${randomItem(years)} ${randomItem(["Mid Semester", "End Semester", "Supply", "Model"])} Question Paper`,
      description: `Previous year question paper for ${subject}.`,
      subject,
      semester,
      courseType,
      year: randomItem(years),
      regulation: randomItem(regulations),
      facultyName: randomItem(FACULTY),
      fileUrl: "",
    });
  }
  return papers;
}

function generatePlacements() {
  return COMPANIES.map((c) => ({
    companyName: c.name,
    role: c.role,
    package: c.pkg,
    eligibility: c.cgpa,
    skillsRequired: c.skills,
    deadline: Timestamp.fromDate(new Date(Date.now() + randomInt(7, 60) * 24 * 60 * 60 * 1000)),
    applyLink: `https://careers.${c.name.toLowerCase().replace(/\s+/g, "")}.com/apply`,
    logoUrl: "",
  }));
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log("\n🚀 CS Academic Portal — Seed Script");
  console.log("=====================================\n");

  console.log("📹 Generating 50 sample lecture videos...");
  const videos = generateVideos(50);
  await seedCollection("videos", videos);

  console.log("\n📝 Generating 30 sample lecture notes...");
  const notes = generateNotes(30);
  await seedCollection("notes", notes);

  console.log("\n📄 Generating 25 sample question papers...");
  const papers = generateQuestionPapers(25);
  await seedCollection("questionPapers", papers);

  console.log("\n💼 Generating 15 sample placement drives...");
  const placements = generatePlacements();
  await seedCollection("placements", placements);

  console.log("\n\n✅ Seeding complete!");
  console.log(`   - 50 Videos`);
  console.log(`   - 30 Notes`);
  console.log(`   - 25 Question Papers`);
  console.log(`   - 15 Placements\n`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
