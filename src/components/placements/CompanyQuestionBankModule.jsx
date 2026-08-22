// src/components/placements/CompanyQuestionBankModule.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiBriefcase,
  FiCode,
  FiDatabase,
  FiHelpCircle,
  FiLayers,
  FiCheckCircle,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiAward,
  FiBookOpen,
  FiMessageSquare,
  FiCpu,
  FiUserCheck,
} from "react-icons/fi";

const COMPANY_QUESTION_BANK = [
  {
    id: "zoho",
    name: "Zoho Corporation",
    category: "Product & SaaS",
    logoText: "ZOHO",
    logoColor: "bg-red-600",
    packageRange: "₹5.5 - ₹12.0 LPA",
    description: "Multi-round technical recruitment focusing on C/C++ basics, matrix algorithms, system design, and advanced problem solving.",
    rounds: [
      {
        roundNumber: 1,
        title: "Round 1: Flowchart & Basic Programming",
        focus: "Flowcharts, Output Prediction, C/C++ Pointers, Loops & Conditionals",
        questionCount: 15,
      },
      {
        roundNumber: 2,
        title: "Round 2: Basic Programming & Pattern Printing",
        focus: "Matrix Rotation, Pattern Printing, String Reversal, Subarrays",
        questionCount: 8,
      },
      {
        roundNumber: 3,
        title: "Round 3: Advanced Data Structures & Algorithms",
        focus: "Recursion, Backtracking, Custom Data Structure Implementation",
        questionCount: 5,
      },
      {
        roundNumber: 4,
        title: "Round 4: System Design & LLD (Low Level Design)",
        focus: "Object-Oriented Design (e.g. Railway Reservation, Taxi Booking)",
        questionCount: 3,
      },
      {
        roundNumber: 5,
        title: "Round 5: HR & General Fitment",
        focus: "Company Culture, Willingness to Learn, Long-Term Goals",
        questionCount: 4,
      },
    ],
    questions: [
      {
        id: "z-1",
        round: 2,
        topic: "DSA",
        title: "Look-and-Say Sequence Generation",
        difficulty: "Medium",
        questionText: "Write a program to generate the n-th term of the Look-and-Say sequence (e.g., 1, 11, 21, 1211, 111221...).",
        solutionSnippet: `function countAndSay(n) {
  if (n === 1) return "1";
  let prev = countAndSay(n - 1);
  let res = "", count = 1;
  for (let i = 0; i < prev.length; i++) {
    if (prev[i] === prev[i + 1]) {
      count++;
    } else {
      res += count + prev[i];
      count = 1;
    }
  }
  return res;
}`,
        explanation: "Iterate through the previous term, count consecutive identical digits, and append the count followed by the digit.",
      },
      {
        id: "z-2",
        round: 3,
        topic: "DSA",
        title: "Print Matrix in Spiral Order without Extra Space",
        difficulty: "Medium",
        questionText: "Given an m x n 2D matrix, print all elements in spiral order starting from top-left.",
        solutionSnippet: `function spiralOrder(matrix) {
  let res = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  
  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) res.push(matrix[top][i]);
    top++;
    for (let i = top; i <= bottom; i++) res.push(matrix[i][right]);
    right--;
    if (top <= bottom) {
      for (let i = right; i >= left; i--) res.push(matrix[bottom][i]);
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) res.push(matrix[i][left]);
      left++;
    }
  }
  return res;
}`,
        explanation: "Maintain four pointers (top, bottom, left, right) to bound the current spiral layer.",
      },
      {
        id: "z-3",
        round: 4,
        topic: "OOPs",
        title: "Low-Level Design: Taxi Booking System",
        difficulty: "Hard",
        questionText: "Design a console-based Taxi Booking System with 6 points (A, B, C, D, E, F) spaced 15 km apart. Minimum fare is Rs 100 for first 5 km.",
        solutionSnippet: `class Taxi {
  constructor(id) {
    this.id = id;
    this.currentPoint = 'A';
    this.freeTime = 9;
    this.totalEarnings = 0;
    this.bookings = [];
  }
}`,
        explanation: "Find the nearest available taxi at the pickup point with the lowest earnings to maintain fair distribution.",
      },
    ],
  },
  {
    id: "tcs",
    name: "TCS (Ninja / Digital / Prime)",
    category: "IT Services Giant",
    logoText: "TCS",
    logoColor: "bg-blue-700",
    packageRange: "₹3.36 - ₹9.0 LPA",
    description: "National Qualifier Test (NQT) evaluating Quantitative Aptitude, Verbal, Logical, Automata Fix, and Coding.",
    rounds: [
      {
        roundNumber: 1,
        title: "Round 1: TCS NQT Cognitive & Tech Test",
        focus: "Numerical Ability, Verbal Ability, Reasoning, Foundation & Advanced Coding",
        questionCount: 65,
      },
      {
        roundNumber: 2,
        title: "Round 2: Technical Interview",
        focus: "C/Java/Python Basics, SQL Queries, Project Architecture, DBMS Normalization",
        questionCount: 10,
      },
      {
        roundNumber: 3,
        title: "Round 3: Managerial & HR Interview",
        focus: "Relocation, Night Shifts, Project Contributions, Stress Management",
        questionCount: 6,
      },
    ],
    questions: [
      {
        id: "tcs-1",
        round: 1,
        topic: "SQL",
        title: "Second Highest Salary Query in Employee Table",
        difficulty: "Easy",
        questionText: "Write an SQL query to find the 2nd highest salary from the Employee table without using TOP or LIMIT.",
        solutionSnippet: `SELECT MAX(salary) AS SecondHighestSalary 
FROM Employee 
WHERE salary < (SELECT MAX(salary) FROM Employee);`,
        explanation: "Selects the maximum salary strictly smaller than the overall highest salary.",
      },
      {
        id: "tcs-2",
        round: 1,
        topic: "DSA",
        title: "Check Armstrong Number in Python/Java",
        difficulty: "Easy",
        questionText: "Write a function to check if an n-digit number is equal to the sum of the n-th power of its digits.",
        solutionSnippet: `function isArmstrong(num) {
  const str = String(num);
  const power = str.length;
  const sum = str.split('').reduce((acc, d) => acc + Math.pow(Number(d), power), 0);
  return sum === num;
}`,
        explanation: "Extract each digit, raise it to the length power, sum them up, and compare with original number.",
      },
      {
        id: "tcs-3",
        round: 2,
        topic: "OOPs",
        title: "Difference between Abstract Class and Interface in Java",
        difficulty: "Medium",
        questionText: "Explain when to use an Abstract Class vs an Interface in enterprise Java applications.",
        solutionSnippet: `Abstract Class: Can have state (fields), constructors, and non-abstract methods.
Interface: Pure contract (prior to Java 8), supports multiple inheritance.`,
        explanation: "Use Abstract Classes for shared code among related classes ('IS-A'). Use Interfaces to define capability across unrelated classes ('CAN-DO').",
      },
    ],
  },
  {
    id: "cognizant",
    name: "Cognizant (GenC / GenC Next)",
    category: "IT Services",
    logoText: "CTSH",
    logoColor: "bg-[#0033A0]",
    packageRange: "₹4.0 - ₹6.75 LPA",
    description: "Evaluates Logical Reasoning, Automata Fix (Debugging), Hands-on Coding, and SQL queries.",
    rounds: [
      {
        roundNumber: 1,
        title: "Round 1: Communication & GenC Aptitude",
        focus: "Verbal Ability, Logical Reasoning, Quantitative Aptitude",
        questionCount: 45,
      },
      {
        roundNumber: 2,
        title: "Round 2: Automata Fix & Coding",
        focus: "Syntax & Logical Error Debugging in C++/Java, 2 Data Structure Problems",
        questionCount: 7,
      },
      {
        roundNumber: 3,
        title: "Round 3: Technical & HR Discussion",
        focus: "Resume Projects, SQL Joins, Basic Web Development, Academic Background",
        questionCount: 8,
      },
    ],
    questions: [
      {
        id: "cts-1",
        round: 2,
        topic: "SQL",
        title: "Find Duplicate Records in Table",
        difficulty: "Easy",
        questionText: "Write a query to identify duplicate email addresses in a Users table.",
        solutionSnippet: `SELECT email, COUNT(email) 
FROM Users 
GROUP BY email 
HAVING COUNT(email) > 1;`,
        explanation: "Group rows by email and use HAVING to filter counts greater than 1.",
      },
      {
        id: "cts-2",
        round: 2,
        topic: "DSA",
        title: "Find First Non-Repeating Character in String",
        difficulty: "Easy",
        questionText: "Given a string, find the first non-repeating character and return its index.",
        solutionSnippet: `function firstUniqChar(s) {
  const map = {};
  for (let char of s) map[char] = (map[char] || 0) + 1;
  for (let i = 0; i < s.length; i++) {
    if (map[s[i]] === 1) return i;
  }
  return -1;
}`,
        explanation: "Use a frequency hash map for O(N) lookup time.",
      },
    ],
  },
  {
    id: "accenture",
    name: "Accenture",
    category: "Consulting & Tech",
    logoText: "ACN",
    logoColor: "bg-[#A100FF]",
    packageRange: "₹4.5 - ₹6.5 LPA",
    description: "Assessment covering Cognitive Ability, Technical MCQs, Coding, Pseudocode, and Communication Test.",
    rounds: [
      {
        roundNumber: 1,
        title: "Round 1: Cognitive & Technical Assessment",
        focus: "Critical Reasoning, Abstract Reasoning, Pseudocode, Common Applications",
        questionCount: 90,
      },
      {
        roundNumber: 2,
        title: "Round 2: Coding Assessment",
        focus: "2 Hands-on Coding Problems (Arrays, Strings, Bit Manipulation)",
        questionCount: 2,
      },
      {
        roundNumber: 3,
        title: "Round 3: Communication Assessment",
        focus: "Reading, Listening, Repeat Sentences, Fluency & Pronunciation",
        questionCount: 30,
      },
      {
        roundNumber: 4,
        title: "Round 4: Technical & HR Discussion",
        focus: "Project Role, Scenario Handling, Technical Fundamentals",
        questionCount: 5,
      },
    ],
    questions: [
      {
        id: "acn-1",
        round: 2,
        topic: "DSA",
        title: "Bitwise Operation: Find Parity of a Number",
        difficulty: "Easy",
        questionText: "Write a function that calculates total set bits (1s) in the binary representation of a integer.",
        solutionSnippet: `function countSetBits(n) {
  let count = 0;
  while (n > 0) {
    n &= (n - 1); // clears lowest set bit
    count++;
  }
  return count;
}`,
        explanation: "Brian Kernighan's Algorithm: n & (n - 1) clears the lowest set bit in O(number of set bits).",
      },
      {
        id: "acn-2",
        round: 4,
        topic: "HR",
        title: "Describe a Time You Solved a Complex Bug",
        difficulty: "Easy",
        questionText: "How do you systematically approach debugging a production error under pressure?",
        solutionSnippet: "STAR Method: Situation, Task, Action (Reproduce, Inspect Logs, Isolate component), Result (Resolution & Preventative tests).",
        explanation: "Focus on systematic isolation, log inspection, and team collaboration rather than guessing code.",
      },
    ],
  },
];

export default function CompanyQuestionBankModule() {
  const [selectedCompanyId, setSelectedCompanyId] = useState("zoho");
  const [selectedRound, setSelectedRound] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQId, setExpandedQId] = useState(null);

  const selectedCompany =
    COMPANY_QUESTION_BANK.find((c) => c.id === selectedCompanyId) || COMPANY_QUESTION_BANK[0];

  const filteredQuestions = selectedCompany.questions.filter((q) => {
    const matchRound = selectedRound === "all" || q.round === Number(selectedRound);
    const matchTopic = selectedTopic === "all" || q.topic.toLowerCase() === selectedTopic.toLowerCase();
    const matchQuery =
      searchQuery === "" ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRound && matchTopic && matchQuery;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Module Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4A0014] via-[#7F011F] to-[#1E293B] p-6 sm:p-8 text-white shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-extrabold text-amber-300 border border-white/15 backdrop-blur-md">
              <FiAward size={14} className="text-amber-400" />
              <span>Corporate Recruitment Question Bank</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Company-Specific Round-by-Round Question Bank
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              Explore authentic interview patterns, round details, DSA coding problems, SQL queries &amp; HR scenarios for top CS recruiters.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/15 text-center shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-1">Coverage</span>
            <span className="text-xl font-black text-white">6 Top MNCs</span>
          </div>
        </div>
      </div>

      {/* Company Selector Pills */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
          Select Target Recruiter:
        </label>
        <div className="flex flex-wrap items-center gap-2.5">
          {COMPANY_QUESTION_BANK.map((comp) => {
            const isSelected = comp.id === selectedCompanyId;
            return (
              <button
                key={comp.id}
                onClick={() => {
                  setSelectedCompanyId(comp.id);
                  setSelectedRound("all");
                  setExpandedQId(null);
                }}
                className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-black transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#7F011F] text-white shadow-md"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#7F011F]"
                }`}
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-black text-white ${comp.logoColor}`}>
                  {comp.logoText.slice(0, 2)}
                </span>
                <span>{comp.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Company Overview & Recruitment Rounds */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 tracking-wider">
              {selectedCompany.category}
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {selectedCompany.name} Recruitment Process
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
              {selectedCompany.description}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20 px-3 py-1.5 text-xs font-black shrink-0">
            Package: {selectedCompany.packageRange}
          </span>
        </div>

        {/* Rounds Timeline Pills */}
        <div>
          <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3">
            Round-by-Round Structure ({selectedCompany.rounds.length} Rounds):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedCompany.rounds.map((r) => (
              <div
                key={r.roundNumber}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3.5 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#7F011F] dark:text-rose-400">
                    Round {r.roundNumber}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {r.questionCount} Qs
                  </span>
                </div>
                <h5 className="text-xs font-black text-slate-800 dark:text-slate-100">
                  {r.title}
                </h5>
                <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-snug">
                  {r.focus}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Round Filter */}
          <select
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Rounds</option>
            {selectedCompany.rounds.map((r) => (
              <option key={r.roundNumber} value={r.roundNumber}>
                Round {r.roundNumber}: {r.title}
              </option>
            ))}
          </select>

          {/* Topic Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {["all", "DSA", "SQL", "OOPs", "HR"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  selectedTopic.toLowerCase() === t.toLowerCase()
                    ? "bg-[#7F011F] text-white shadow-xs"
                    : "text-slate-700 dark:text-slate-300 hover:text-[#7F011F]"
                }`}
              >
                {t === "all" ? "All Topics" : t}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <FiSearch className="absolute left-3 top-2.5 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 py-2 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Questions Accordion List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center space-y-2">
            <FiHelpCircle size={32} className="mx-auto text-slate-400" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No questions found for the selected filters
            </h4>
            <p className="text-xs text-slate-500">
              Try clearing search queries or switching to "All Rounds" and "All Topics".
            </p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedQId === q.id;
            return (
              <motion.div
                key={q.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div
                  onClick={() => setExpandedQId(isExpanded ? null : q.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded-full bg-rose-500/10 text-[#7F011F] dark:text-rose-400 border border-rose-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase">
                        Round {q.round}
                      </span>
                      <span className="rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 text-[10px] font-bold">
                        {q.topic}
                      </span>
                      <span className="rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 text-[10px] font-bold">
                        {q.difficulty}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                      {q.title}
                    </h4>

                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-2">
                      {q.questionText}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedQId(isExpanded ? null : q.id);
                    }}
                    aria-label={isExpanded ? "Collapse question details" : "Expand question details"}
                    className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:bg-[#7F011F] hover:text-white transition-colors shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D97706]"
                  >
                    {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                  </button>
                </div>

                {/* Expanded Solution Panel */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-5 space-y-4 text-left">
                    <div>
                      <h5 className="text-[11px] font-black uppercase tracking-wider text-[#7F011F] dark:text-rose-400 mb-1">
                        Solution / Implementation
                      </h5>
                      <pre className="rounded-xl bg-slate-900 text-slate-100 p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                        <code>{q.solutionSnippet}</code>
                      </pre>
                    </div>

                    <div>
                      <h5 className="text-[11px] font-black uppercase tracking-wider text-[#7F011F] dark:text-rose-400 mb-1">
                        Recruiter Explanation &amp; Key Insight
                      </h5>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
