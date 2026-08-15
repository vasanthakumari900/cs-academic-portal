// src/utils/placementAssessmentEngine.js

// Dynamic Captcha-Style Question Bank per Programming Language
const LANGUAGE_QUESTION_POOLS = {
  java: [
    {
      question: "Which keyword in Java is used to prevent method overriding?",
      options: ["static", "final", "abstract", "protected"],
      correct: 1,
      explanation: "The 'final' keyword on a method prevents subclasses from overriding it.",
    },
    {
      question: "What is the size of 'char' data type in Java?",
      options: ["8 bits", "16 bits", "32 bits", "Depends on OS"],
      correct: 1,
      explanation: "Java uses 16-bit Unicode character encoding for 'char'.",
    },
    {
      question: "Which collection class in Java allows key-value pairs with null keys?",
      options: ["Hashtable", "HashMap", "TreeMap", "ConcurrentHashMap"],
      correct: 1,
      explanation: "HashMap permits one null key and multiple null values, unlike Hashtable.",
    },
    {
      question: "What is Garbage Collection in Java primarily responsible for?",
      options: ["Freeing unreferenced memory", "Deleting unused class files", "Optimizing CPU loops", "Managing thread stacks"],
      correct: 0,
      explanation: "JVM Garbage Collector automatically reclaims memory occupied by objects that are no longer reachable.",
    },
    {
      question: "Which interface must a class implement to enable object serialization?",
      options: ["Cloneable", "Serializable", "Runnable", "Comparable"],
      correct: 1,
      explanation: "java.io.Serializable marker interface indicates that objects of the class can be serialized.",
    },
    {
      question: "What happens if a static method accesses a non-static variable directly?",
      options: ["Compile-time error", "Runtime exception", "Returns null", "Works normally"],
      correct: 0,
      explanation: "Static methods belong to the class and cannot access instance variables without an object reference.",
    },
  ],
  python: [
    {
      question: "What is the output of `bool([])` in Python?",
      options: ["True", "False", "None", "TypeError"],
      correct: 1,
      explanation: "An empty list evaluate to False in a boolean context.",
    },
    {
      question: "Which built-in Python data type is immutable?",
      options: ["List", "Dictionary", "Set", "Tuple"],
      correct: 3,
      explanation: "Tuples are immutable sequences in Python; their elements cannot be modified after creation.",
    },
    {
      question: "What does the `pass` statement do in Python?",
      options: ["Skips loop iteration", "Null statement / placeholder", "Exits program", "Throws exception"],
      correct: 1,
      explanation: "'pass' is a syntactic placeholder used when a statement is required syntactically but no code needs to execute.",
    },
    {
      question: "How do you create a shallow copy of list `a` in Python?",
      options: ["b = a[:]", "b = copy(a)", "b = list(a)", "All of the above"],
      correct: 3,
      explanation: "Slicing `a[:]`, `list(a)`, and `copy.copy(a)` all create shallow copies of a list.",
    },
    {
      question: "Which keyword is used for exception handling cleanup in Python?",
      options: ["except", "finally", "catch", "defer"],
      correct: 1,
      explanation: "The 'finally' block executes regardless of whether an exception occurred or was caught.",
    },
    {
      question: "What is a Python decorator?",
      options: ["CSS styling function", "Function that modifies another function", "Class constructor", "Module import statement"],
      correct: 1,
      explanation: "Decorators are functions that take another function as an argument and extend its behavior without modifying it explicitly.",
    },
  ],
  cpp: [
    {
      question: "Which feature in C++ allows a function to have the same name with different parameters?",
      options: ["Method Overriding", "Function Overloading", "Virtual Dispatch", "Template Specialization"],
      correct: 1,
      explanation: "Function Overloading allows multiple functions in the same scope to share a name if signatures differ.",
    },
    {
      question: "What is the purpose of the `virtual` destructor in C++?",
      options: ["Speed up deletion", "Ensure proper cleanup of derived class objects", "Prevent memory leak in base class", "Make destructor private"],
      correct: 1,
      explanation: "A virtual destructor ensures that calling `delete` on a base class pointer properly invokes derived destructors.",
    },
    {
      question: "Which memory area in C++ is allocated using the `new` operator?",
      options: ["Stack", "Heap / Free Store", "Static Data Segment", "Code Segment"],
      correct: 1,
      explanation: "Dynamic memory allocated via `new` resides in the Heap / Free Store.",
    },
    {
      question: "What is an abstract class in C++?",
      options: ["Class with no variables", "Class containing at least one pure virtual function", "Class with private constructors", "Friend class"],
      correct: 1,
      explanation: "A class with at least one pure virtual function (`virtual void func() = 0;`) cannot be instantiated and is abstract.",
    },
  ],
  c: [
    {
      question: "What does the `static` keyword mean when applied to a global variable in C?",
      options: ["Stored in heap", "Limits scope to the defining translation unit (file)", "Cannot be modified", "Shared across processes"],
      correct: 1,
      explanation: "A static global variable has internal linkage and is visible only within the C file where it is declared.",
    },
    {
      question: "What is the result of dereferencing a NULL pointer in C?",
      options: ["Returns 0", "Undefined behavior / Segmentation fault", "Returns Garbage Value", "Compile-time Warning"],
      correct: 1,
      explanation: "Dereferencing a NULL pointer causes undefined behavior, typically terminating with a Segmentation Fault.",
    },
    {
      question: "Which function in C is used to reallocate memory dynamically?",
      options: ["malloc()", "calloc()", "realloc()", "free()"],
      correct: 2,
      explanation: "realloc() alters the size of previously allocated memory block.",
    },
  ],
  sql: [
    {
      question: "Which SQL clause is used to filter aggregated group records?",
      options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
      correct: 1,
      explanation: "HAVING filters records after aggregation (GROUP BY), whereas WHERE filters individual rows before grouping.",
    },
    {
      question: "What type of JOIN returns all records from the left table and matched records from the right table?",
      options: ["INNER JOIN", "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "FULL OUTER JOIN"],
      correct: 1,
      explanation: "LEFT JOIN retrieves all rows from the left table and matching rows from the right table (with NULL for un-matched).",
    },
    {
      question: "Which SQL command is used to permanently remove a table structure and its data?",
      options: ["DELETE TABLE", "DROP TABLE", "TRUNCATE TABLE", "REMOVE TABLE"],
      correct: 1,
      explanation: "DROP TABLE destroys the table definition and all rows, whereas TRUNCATE removes all rows keeping the table schema.",
    },
    {
      question: "What does ACID stand for in DBMS?",
      options: ["Atomicity, Consistency, Isolation, Durability", "Access, Control, Index, Data", "Array, Column, Index, Database", "Automatic, Concurrent, Isolated, Durable"],
      correct: 0,
      explanation: "ACID properties ensure reliable processing of database transactions.",
    },
  ],
  js: [
    {
      question: "What is the output of `typeof NaN` in JavaScript?",
      options: ["number", "NaN", "undefined", "object"],
      correct: 0,
      explanation: "In JS specification, NaN (Not-a-Number) is of numeric type `typeof NaN === 'number'`.",
    },
    {
      question: "Which keyword declares a block-scoped variable that cannot be re-declared in the same scope?",
      options: ["var", "let", "global", "static"],
      correct: 1,
      explanation: "'let' and 'const' provide block scoping in ES6 JavaScript.",
    },
    {
      question: "What is Closure in JavaScript?",
      options: ["DOM close event", "Function bundled with references to its surrounding lexical environment", "Database disconnect", "Loop termination"],
      correct: 1,
      explanation: "A closure gives an inner function access to an outer function's scope even after the outer function has returned.",
    },
    {
      question: "What method converts a JavaScript object into a JSON string?",
      options: ["JSON.parse()", "JSON.stringify()", "Object.toString()", "String.toJSON()"],
      correct: 1,
      explanation: "JSON.stringify() serializes a JS value or object into a JSON formatted string.",
    },
  ],
};

/**
 * Generate a Captcha-Style Unique Randomized Question Set for a Student Session
 */
export function generateUniqueMcqSet(language = "java", count = 5) {
  const pool = LANGUAGE_QUESTION_POOLS[language] || LANGUAGE_QUESTION_POOLS.java;
  // Shuffle array copy using Fisher-Yates
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  // Return top N items with session-based captcha IDs
  return shuffled.slice(0, Math.min(count, shuffled.length)).map((q, idx) => ({
    ...q,
    captchaId: `CAPTCHA-${language.toUpperCase()}-${Date.now().toString(36)}-${idx + 1}`,
  }));
}

/**
 * Evaluate Candidate Worthiness based on CGPA, Skills, Resume & Portfolio
 */
export function evaluateCandidateWorthiness(candidateData, companyDrive) {
  let score = 50; // baseline
  const minCgpa = companyDrive.minCgpa || 6.0;
  const candCgpa = parseFloat(candidateData.cgpa || "0");

  // CGPA check
  if (candCgpa >= minCgpa + 1.0) score += 20;
  else if (candCgpa >= minCgpa) score += 12;
  else score -= 15;

  // Portfolio check
  if (candidateData.portfolio && candidateData.portfolio.trim().length > 8) {
    score += 15;
  }

  // Resume attachment
  if (candidateData.resumeName && candidateData.resumeName.endsWith(".pdf")) {
    score += 10;
  }

  // Skills overlap check
  const companySkills = Array.isArray(companyDrive.skills)
    ? companyDrive.skills.map((s) => s.toLowerCase())
    : (companyDrive.skills || "").toLowerCase().split(",");

  const studentSkills = candidateData.skills || [];
  const overlap = studentSkills.filter((s) =>
    companySkills.some((cs) => cs.includes(s.toLowerCase()))
  ).length;

  score += Math.min(overlap * 5, 15);

  const finalScore = Math.min(Math.max(score, 45), 98);
  const isWorthy = finalScore >= 65 && candCgpa >= minCgpa;

  return {
    score: finalScore,
    isWorthy,
    matchTier: finalScore >= 85 ? "High Match Candidate" : finalScore >= 65 ? "Qualified Candidate" : "Under Review",
    summary: isWorthy
      ? `Candidate credentials verified (${candCgpa} CGPA, Portfolio & Skill overlap). Qualified for Technical Screening.`
      : `CGPA (${candCgpa}) or Portfolio requirements under minimum threshold for ${companyDrive.companyName}.`,
  };
}

/**
 * Role & Resume Tailored AI Interview Questions Generator
 */
export function getInterviewQuestionsForRole(companyName, roleName, candidateSkills = [], chosenLang = "Java") {
  return [
    {
      id: "q-intro",
      type: "intro",
      question: `Hello! Welcome to the technical interview for ${companyName}. Please introduce yourself and highlight your Computer Science academic projects and key strengths.`,
      expectedKeywords: ["computer science", "project", "b.sc", "bca", "m.sc", "developer", "skills", "passion"],
    },
    {
      id: "q-tech-core",
      type: "technical",
      question: `Since you chose ${chosenLang.toUpperCase()} for your assessment, explain a core concept in ${chosenLang} that you utilized in a recent project and how you handled errors or optimization.`,
      expectedKeywords: [chosenLang.toLowerCase(), "class", "object", "database", "function", "logic", "error", "array", "data", "optimization"],
    },
    {
      id: "q-scenario",
      type: "scenario",
      question: `If selected as a ${roleName} at ${companyName}, how would you approach learning a new enterprise framework or working under a tight deadline?`,
      expectedKeywords: ["documentation", "learning", "teamwork", "deadline", "debugging", "problem solving", "practice", "consistency"],
    },
  ];
}

/**
 * AI Audio/Text Response Validator
 */
export function evaluateSpokenAnswer(spokenTranscript, questionObj) {
  if (!spokenTranscript || spokenTranscript.trim().length < 5) {
    return {
      passed: false,
      score: 0,
      feedback: "No clear spoken audio response detected. Please speak clearly into your microphone.",
    };
  }

  const text = spokenTranscript.toLowerCase();
  const wordCount = text.split(/\s+/).length;
  const keywords = questionObj.expectedKeywords || [];

  let matched = 0;
  keywords.forEach((kw) => {
    if (text.includes(kw.toLowerCase())) matched++;
  });

  const keywordScore = Math.min((matched / Math.max(keywords.length, 3)) * 60, 60);
  const lengthScore = Math.min((wordCount / 20) * 40, 40);

  const totalScore = Math.round(keywordScore + lengthScore);
  const passed = totalScore >= 40 || wordCount >= 10;

  return {
    passed,
    score: totalScore,
    feedback: passed
      ? `Strong answer! Articulated clear points (${wordCount} words spoken).`
      : `Response was brief (${wordCount} words). Try elaborating more on technical details next time.`,
  };
}
