import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiCpu,
  FiDatabase,
  FiGlobe,
  FiShield,
  FiCode,
  FiZap,
  FiX,
  FiZoomIn,
  FiZoomOut,
  FiMaximize2,
  FiBookOpen,
  FiFileText,
  FiArrowRight,
  FiLayers,
  FiSearch,
  FiCalendar,
  FiCheckCircle,
  FiServer,
  FiPieChart,
  FiLayout,
  FiCompass,
} from "react-icons/fi";

const GRAPH_NODES = [
  // ─────────────────────────────────────────────────────────────
  // ── 1ST YEAR SUBJECTS (Sem 1 & Sem 2) ────────────────────────
  // ─────────────────────────────────────────────────────────────
  {
    id: "py",
    year: 1,
    label: "Python Programming Essentials",
    code: "CS101",
    semester: "Sem 1",
    category: "Core",
    icon: FiCode,
    x: 200,
    y: 130,
    color: "#0284C7",
    glow: "#38BDF8",
    topics: ["Variables & Control Flow", "Functions & Modules", "File I/O Handling", "Lists, Tuples & Dictionaries"],
    aiTakeaway: "Python list comprehensions and generator functions enable memory-efficient data processing.",
    link: "/notes?search=Python",
  },
  {
    id: "math1",
    year: 1,
    label: "Mathematics Paper I",
    code: "CS102",
    semester: "Sem 1",
    category: "Math",
    icon: FiPieChart,
    x: 570,
    y: 130,
    color: "#D97706",
    glow: "#F4C266",
    topics: ["Matrices & Eigenvalues", "Calculus & Derivatives", "Trigonometry", "Analytical Geometry"],
    aiTakeaway: "Eigenvalues and Matrix Diagonalization form the mathematical backbone of ML dimensionality reduction.",
    link: "/notes?search=Mathematics",
  },
  {
    id: "ds_y1",
    year: 1,
    label: "Data Structures",
    code: "CS103",
    semester: "Sem 1",
    category: "Core",
    icon: FiCode,
    x: 940,
    y: 130,
    color: "#C50337",
    glow: "#F4C266",
    topics: ["Arrays & Stacks", "Queues & Linked Lists", "Searching (Binary Search)", "Sorting Algorithms"],
    aiTakeaway: "Choosing between Arrays and Linked Lists depends on search frequency vs dynamic insertion needs.",
    link: "/notes?search=Data+Structures",
  },
  {
    id: "cpp",
    year: 1,
    label: "OOP using C++",
    code: "CS104",
    semester: "Sem 2",
    category: "Core",
    icon: FiCode,
    x: 200,
    y: 380,
    color: "#7E2238",
    glow: "#E08813",
    topics: ["Classes & Objects", "Inheritance & Polymorphism", "Operator Overloading", "Constructors & Destructors"],
    aiTakeaway: "Virtual functions enable runtime polymorphism through dynamic vtable dispatch in memory.",
    link: "/notes?search=C%2B%2B",
  },
  {
    id: "web_tech_y1",
    year: 1,
    label: "Web Technology",
    code: "CS105",
    semester: "Sem 2",
    category: "Web",
    icon: FiGlobe,
    x: 570,
    y: 380,
    color: "#0EA5E9",
    glow: "#38BDF8",
    topics: ["HTML5 & CSS3 Layouts", "JavaScript DOM Manipulation", "Responsive UI", "Form Validation"],
    aiTakeaway: "DOM event delegation optimizes event listener memory footprint across dynamic web elements.",
    link: "/notes?search=Web+Technology",
  },
  {
    id: "math2",
    year: 1,
    label: "Mathematics Paper II",
    code: "CS106",
    semester: "Sem 2",
    category: "Math",
    icon: FiPieChart,
    x: 940,
    y: 380,
    color: "#B45309",
    glow: "#F59E0B",
    topics: ["Differential Equations", "Fourier Series", "Vector Calculus", "Integral Calculus"],
    aiTakeaway: "Fourier transforms convert time-domain signals into frequency components essential for computer graphics.",
    link: "/notes?search=Mathematics",
  },

  // ─────────────────────────────────────────────────────────────
  // ── 2ND YEAR SUBJECTS (Sem 1 & Sem 2 - STAGGERED LAYOUT) ─────
  // ─────────────────────────────────────────────────────────────
  {
    id: "java",
    year: 2,
    label: "OOP Concepts using JAVA",
    code: "CS201",
    semester: "Sem 1",
    category: "Core",
    icon: FiCode,
    x: 180,
    y: 110,
    color: "#EA580C",
    glow: "#F97316",
    topics: ["JVM Architecture & Bytecode", "Multithreading & Synchronization", "Exception Handling", "Java Collections Framework"],
    aiTakeaway: "The Java Garbage Collector manages heap memory automatically using generational mark-and-sweep.",
    link: "/notes?search=JAVA",
  },
  {
    id: "web_dev_angular",
    year: 2,
    label: "Web Dev (AngularJS & Node.js)",
    code: "CS202",
    semester: "Sem 1",
    category: "Web",
    icon: FiGlobe,
    x: 570,
    y: 110,
    color: "#DD1B16",
    glow: "#F87171",
    topics: ["Angular Directives & Controllers", "Node.js REST Services", "Two-way Data Binding", "Express Middleware"],
    aiTakeaway: "Two-way data binding synchronizes the view model and DOM state automatically in real time.",
    link: "/notes?search=Angular",
  },
  {
    id: "stat1",
    year: 2,
    label: "Statistical Methods for CS - I",
    code: "CS203",
    semester: "Sem 1",
    category: "Math",
    icon: FiPieChart,
    x: 950,
    y: 110,
    color: "#4A5568",
    glow: "#CBD5E0",
    topics: ["Probability Distributions", "Measures of Central Tendency", "Correlation & Regression", "Sampling Theory"],
    aiTakeaway: "Linear Regression models quantitative target variables by minimizing squared residual errors.",
    link: "/notes?search=Statistical",
  },
  {
    id: "os_y2",
    year: 2,
    label: "Principles of Operating Systems",
    code: "CS204",
    semester: "Sem 1",
    category: "Systems",
    icon: FiCpu,
    x: 375,
    y: 240,
    color: "#D97706",
    glow: "#F4C266",
    topics: ["CPU Scheduling Algorithms", "Deadlock Prevention & Banker's Alg", "Semaphores & Mutexes", "Virtual Memory & Paging"],
    aiTakeaway: "Process Synchronization prevents race conditions when accessing shared kernel memory spaces.",
    link: "/notes?search=Operating+Systems",
  },
  {
    id: "web_dev_react",
    year: 2,
    label: "Web Dev (ReactJS & Node.js)",
    code: "CS205",
    semester: "Sem 1",
    category: "Web",
    icon: FiGlobe,
    x: 760,
    y: 240,
    color: "#0D9488",
    glow: "#2DD4BF",
    topics: ["React Components & JSX", "Hooks (useState, useEffect)", "Context API & Redux", "Node.js Async I/O"],
    aiTakeaway: "React Virtual DOM diffing minimizes browser reflows by calculating optimal DOM patch operations.",
    link: "/notes?search=React",
  },
  {
    id: "android",
    year: 2,
    label: "Android App Development",
    code: "CS206",
    semester: "Sem 2",
    category: "Mobile",
    icon: FiGlobe,
    x: 200,
    y: 390,
    color: "#16A34A",
    glow: "#4ADE80",
    topics: ["Android Activity Lifecycle", "UI XML Layouts & Adapters", "Intents & Broadcast Receivers", "SQLite & Room DB"],
    aiTakeaway: "Activity lifecycle methods (onCreate, onResume) manage background memory consumption effectively.",
    link: "/notes?search=ANDROID",
  },
  {
    id: "se",
    year: 2,
    label: "Software Engineering",
    code: "CS207",
    semester: "Sem 2",
    category: "Core",
    icon: FiLayers,
    x: 570,
    y: 390,
    color: "#8B5CF6",
    glow: "#C084FC",
    topics: ["Agile & SDLC Frameworks", "Software Requirement Specification (SRS)", "Blackbox & Whitebox Testing", "Design Patterns"],
    aiTakeaway: "Agile sprints and Continuous Integration build resilient software through frequent deployment iterations.",
    link: "/notes?search=SOFTWARE+ENGINEERING",
  },
  {
    id: "ai_expert",
    year: 2,
    label: "Artificial Intelligence & Expert Systems",
    code: "CS208",
    semester: "Sem 2",
    category: "AI/ML",
    icon: FiZap,
    x: 940,
    y: 390,
    color: "#9333EA",
    glow: "#C084FC",
    topics: ["Heuristic Search (A*, Alpha-Beta)", "Knowledge Representation & Logic", "Expert System Rules & Inference Engine", "Fuzzy Logic"],
    aiTakeaway: "Inference engines use forward and backward chaining rules to deduce conclusions from expert knowledge bases.",
    link: "/notes?search=ARTIFICIAL+INTELLIGENCE",
  },

  // ─────────────────────────────────────────────────────────────
  // ── 3RD YEAR SUBJECTS (PERFECT SPACING & DBMS VISIBLE) ───────
  // ─────────────────────────────────────────────────────────────
  {
    id: "os_y3",
    year: 3,
    label: "Operating System",
    code: "CS301",
    semester: "Sem 1",
    category: "Systems",
    icon: FiCpu,
    x: 160,
    y: 120,
    color: "#D97706",
    glow: "#F4C266",
    topics: ["Process CPU Scheduling", "Deadlocks & Resource Allocation", "Virtual Memory & Page Replacement", "File Systems & I/O"],
    aiTakeaway: "Page replacement algorithms (LRU, FIFO) optimize cache hit rates in virtual memory systems.",
    link: "/notes?search=OPERATING+SYSTEM",
  },
  {
    id: "data_mining_y3",
    year: 3,
    label: "Data Mining Techniques",
    code: "CS302",
    semester: "Sem 1",
    category: "AI/ML",
    icon: FiZap,
    x: 420,
    y: 120,
    color: "#8B5CF6",
    glow: "#C084FC",
    topics: ["Data Preprocessing & ETL", "Decision Tree Classification", "K-Means Clustering", "Apriori Association Mining"],
    aiTakeaway: "Apriori algorithm discovers hidden frequent itemsets and market basket relationships in massive data warehouses.",
    link: "/notes?search=DATA+MINING",
  },
  {
    id: "asp_net_y3",
    year: 3,
    label: "ASP.NET",
    code: "CS303",
    semester: "Sem 1",
    category: "Web",
    icon: FiServer,
    x: 680,
    y: 120,
    color: "#2563EB",
    glow: "#60A5FA",
    topics: ["ASP.NET Web Forms & MVC", "C# Server Side Scripts", "ADO.NET Database Access", "ViewState & Session State"],
    aiTakeaway: "ASP.NET MVC architecture decouples business logic, data models, and dynamic UI rendering.",
    link: "/notes?search=ASP.NET",
  },
  {
    id: "dbms_y3",
    year: 3,
    label: "Database Management System",
    code: "CS304",
    semester: "Sem 1",
    category: "Core",
    icon: FiDatabase,
    x: 940,
    y: 120,
    color: "#7E2238",
    glow: "#E08813",
    topics: ["ER Models & Relational Schema", "Complex SQL Queries & Joins", "Normalization (1NF to BCNF)", "ACID Transactions & Locks"],
    aiTakeaway: "B-Tree indexing drastically reduces disk I/O seek overhead for relational queries.",
    link: "/notes?search=DATABASE",
  },
  // Semester 2 - Staggered Row 2A (y = 270px)
  {
    id: "php_y3",
    year: 3,
    label: "Programming in PHP",
    code: "CS305",
    semester: "Sem 2",
    category: "Web",
    icon: FiCode,
    x: 230,
    y: 270,
    color: "#4F46E5",
    glow: "#818CF8",
    topics: ["PHP Syntax & Form Handling", "MySQL Database Integration", "Sessions & Cookie Management", "REST API Endpoint Design"],
    aiTakeaway: "Prepared statements in PHP PDO eliminate SQL injection attack vectors.",
    link: "/notes?search=PHP",
  },
  {
    id: "cloud_y3",
    year: 3,
    label: "Cloud Computing",
    code: "CS306",
    semester: "Sem 2",
    category: "Cloud",
    icon: FiGlobe,
    x: 570,
    y: 270,
    color: "#0284C7",
    glow: "#38BDF8",
    topics: ["Virtualization & Hypervisors", "IaaS, PaaS, SaaS Cloud Models", "AWS & Azure Infrastructure", "Serverless Microservices"],
    aiTakeaway: "Elastic auto-scaling dynamically provisions cloud instances based on real-time traffic spikes.",
    link: "/notes?search=CLOUD",
  },
  {
    id: "cn_y3",
    year: 3,
    label: "Computer Networks",
    code: "CS307",
    semester: "Sem 2",
    category: "Networks",
    icon: FiGlobe,
    x: 910,
    y: 270,
    color: "#0EA5E9",
    glow: "#38BDF8",
    topics: ["OSI & TCP/IP 7 Layers", "IP Subnetting & CIDR", "Routing Protocols (OSPF, BGP)", "TCP vs UDP Flow Control"],
    aiTakeaway: "Understanding the TCP 3-way handshake and sliding window congestion control is vital for high-speed systems.",
    link: "/notes?search=NETWORKS",
  },
  // Semester 2 - Staggered Row 2B (y = 410px)
  {
    id: "data_sci_y3",
    year: 3,
    label: "Intro to Data Science",
    code: "CS308",
    semester: "Sem 2",
    category: "AI/ML",
    icon: FiPieChart,
    x: 230,
    y: 410,
    color: "#059669",
    glow: "#34D399",
    topics: ["Data Wrangling with Pandas", "Exploratory Data Analysis (EDA)", "Data Visualization (Matplotlib, Seaborn)", "Predictive Modeling"],
    aiTakeaway: "Feature scaling (Standardization/Normalization) prevents feature dominance during model training.",
    link: "/notes?search=DATA+SCIENCE",
  },
  {
    id: "dip_y3",
    year: 3,
    label: "Digital Image Processing",
    code: "CS309",
    semester: "Sem 2",
    category: "Core",
    icon: FiLayout,
    x: 570,
    y: 410,
    color: "#9333EA",
    glow: "#C084FC",
    topics: ["Image Enhancement & Histogram Equalization", "Spatial Filtering & Convolution", "Edge Detection (Sobel, Canny)", "Image Compression Standards"],
    aiTakeaway: "Spatial convolution kernels extract high-frequency edge features crucial for Computer Vision models.",
    link: "/notes?search=DIGITAL+IMAGE",
  },
  {
    id: "uml_y3",
    year: 3,
    label: "UML Modeling Language",
    code: "CS310",
    semester: "Sem 2",
    category: "Core",
    icon: FiCompass,
    x: 910,
    y: 410,
    color: "#B45309",
    glow: "#F59E0B",
    topics: ["Use Case & Class Diagrams", "Sequence & State Diagrams", "Component & Deployment Diagrams", "Object-Oriented Analysis"],
    aiTakeaway: "Sequence diagrams visualize synchronous and asynchronous message passing between object lifelines.",
    link: "/notes?search=UNIFIED+MODELING",
  },
];

const GRAPH_EDGES = [
  // Year 1 Edges
  { from: "py", to: "ds_y1" },
  { from: "py", to: "cpp" },
  { from: "math1", to: "math2" },
  { from: "cpp", to: "web_tech_y1" },

  // Year 2 Edges
  { from: "java", to: "web_dev_angular" },
  { from: "java", to: "web_dev_react" },
  { from: "java", to: "android" },
  { from: "os_y2", to: "se" },
  { from: "stat1", to: "ai_expert" },

  // Year 3 Edges
  { from: "os_y3", to: "cn_y3" },
  { from: "dbms_y3", to: "data_mining_y3" },
  { from: "asp_net_y3", to: "dbms_y3" },
  { from: "asp_net_y3", to: "php_y3" },
  { from: "cn_y3", to: "cloud_y3" },
  { from: "data_mining_y3", to: "data_sci_y3" },
  { from: "dbms_y3", to: "uml_y3" },
];

export default function InteractiveKnowledgeGraph() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const studentYear = user?.year ? Number(user.year) : 1;

  const [selectedYear, setSelectedYear] = useState(studentYear);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeCategory, setActiveCategory] = useState("All");

  const yearTabs = [
    { value: 1, label: "1st Year (Sem 1 & 2)" },
    { value: 2, label: "2nd Year (Sem 3 & 4)" },
    { value: 3, label: "3rd Year (Sem 5 & 6)" },
    { value: 0, label: "All Years Curriculum" },
  ];

  const categories = ["All", "Core", "Systems", "Networks", "Web", "AI/ML", "Math", "Cloud"];

  const filteredNodes = GRAPH_NODES.filter((node) => {
    const matchesYear = selectedYear === 0 || node.year === selectedYear;
    const matchesSearch =
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === "All" || node.category === activeCategory;
    return matchesYear && matchesSearch && matchesCat;
  });

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#1E0B16] via-[#14070D] to-[#0A0307] border border-[#F4C266]/30 shadow-2xl p-4 sm:p-6 overflow-hidden font-sans text-white">
      
      {/* ── Background Grid Dots ── */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#F4C266_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* ── Header Toolbar ── */}
      <div className="relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-[#C50337] to-[#7F011F] text-[#F4C266]">
              <FiLayers size={18} />
            </span>
            <div>
              <h3 className="text-lg font-black font-heading text-white tracking-wide flex items-center gap-2">
                <span>Interactive Subject Knowledge Graph</span>
                {user?.year && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F4C266]/15 border border-[#F4C266]/40 px-2.5 py-0.5 text-[10px] font-extrabold text-[#F4C266] uppercase">
                    <FiCheckCircle size={12} /> Auto-Filtered: Year {user.year}
                  </span>
                )}
              </h3>
              <p className="text-xs text-[#D9C2CA] mt-0.5">
                Staggered, non-overlapping subject node grid with laser connection paths
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-60">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D9C2CA]" size={14} />
          <input
            type="text"
            placeholder="Search subjects (e.g. ASP.NET)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/15 pl-9 pr-3 py-2 text-xs text-white placeholder-[#D9C2CA]/60 focus:outline-none focus:border-[#F4C266]"
          />
        </div>
      </div>

      {/* ── Year Selection Tabs ── */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-1.5 bg-white/5 p-1.5 rounded-2xl border border-white/10">
          {yearTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setSelectedYear(tab.value);
                setSelectedNode(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all font-heading ${
                selectedYear === tab.value
                  ? "bg-gradient-to-r from-[#C50337] to-[#7F011F] text-white shadow-lg border border-[#F4C266]/40"
                  : "text-[#D9C2CA] hover:bg-white/10 hover:text-white"
              }`}
            >
              <FiCalendar size={13} className={selectedYear === tab.value ? "text-[#F4C266]" : ""} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Zoom & Category Controls */}
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  activeCategory === cat
                    ? "bg-[#D97706] text-white shadow-sm"
                    : "text-[#D9C2CA] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.4))}
              className="p-1.5 text-[#D9C2CA] hover:text-white transition-colors"
              title="Zoom In"
            >
              <FiZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.7))}
              className="p-1.5 text-[#D9C2CA] hover:text-white transition-colors"
              title="Zoom Out"
            >
              <FiZoomOut size={14} />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 text-[#D9C2CA] hover:text-white transition-colors"
              title="Reset View"
            >
              <FiMaximize2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Interactive SVG/Canvas Graph Area (Scrollable container for small screens) ── */}
      <div className="relative w-full h-[520px] overflow-x-auto overflow-y-hidden rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center scrollbar-thin">
        <motion.div
          animate={{ scale: zoomLevel }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="relative min-w-[1150px] w-[1150px] h-[500px] shrink-0"
        >
          {/* Semester Labels Dividers */}
          <div className="absolute top-3 left-6 pointer-events-none z-10 flex items-center gap-2">
            <span className="rounded-full bg-[#C50337]/30 border border-[#C50337] px-3 py-1 text-[10px] font-black uppercase text-[#F4C266]">
              Semester 1 Subjects (Top Row)
            </span>
          </div>
          <div className="absolute bottom-3 left-6 pointer-events-none z-10 flex items-center gap-2">
            <span className="rounded-full bg-[#D97706]/30 border border-[#D97706] px-3 py-1 text-[10px] font-black uppercase text-[#F4C266]">
              Semester 2 Subjects (Bottom Staggered Rows)
            </span>
          </div>

          {/* SVG Connection Laser Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F4C266" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#C50337" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {GRAPH_EDGES.map((edge, idx) => {
              const sourceNode = filteredNodes.find((n) => n.id === edge.from);
              const targetNode = filteredNodes.find((n) => n.id === edge.to);
              if (!sourceNode || !targetNode) return null;

              const isHighlighted =
                selectedNode && (selectedNode.id === edge.from || selectedNode.id === edge.to);

              return (
                <line
                  key={idx}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isHighlighted ? "#F4C266" : "url(#lineGrad)"}
                  strokeWidth={isHighlighted ? 3 : 1.5}
                  strokeDasharray={isHighlighted ? "6 6" : "none"}
                  className={isHighlighted ? "animate-pulse" : "opacity-40"}
                />
              );
            })}
          </svg>

          {/* Render Nodes with Staggered Non-Overlapping Coordinates */}
          {filteredNodes.map((node) => {
            const Icon = node.icon;
            const isSelected = selectedNode?.id === node.id;

            return (
              <motion.button
                key={node.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedNode(node)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 border shadow-2xl transition-all duration-300 max-w-[220px] ${
                  isSelected
                    ? "bg-gradient-to-r from-[#C50337] to-[#7F011F] border-[#F4C266] shadow-[0_0_30px_rgba(244,194,102,0.4)] z-30"
                    : "bg-[#22101A]/95 border-white/20 hover:border-[#F4C266]/70 z-20"
                }`}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md shrink-0"
                  style={{ backgroundColor: node.color }}
                >
                  <Icon size={18} />
                </div>

                <div className="text-left overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#F4C266] font-mono">
                      {node.code}
                    </span>
                    <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[8px] text-[#D9C2CA] font-medium">
                      {node.semester}
                    </span>
                  </div>
                  <h4 className="text-[11px] font-extrabold text-white font-heading truncate leading-tight mt-0.5">
                    {node.label}
                  </h4>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* ── Slide-Out Node Details Drawer ── */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute top-4 right-4 bottom-4 w-80 sm:w-96 rounded-2xl bg-[#1D0A14]/95 border border-[#F4C266]/40 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl z-40 overflow-y-auto flex flex-col justify-between"
          >
            <div>
              {/* Drawer Top */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-white font-bold shrink-0"
                    style={{ backgroundColor: selectedNode.color }}
                  >
                    <selectedNode.icon size={18} />
                  </span>
                  <div>
                    <h4 className="text-sm font-extrabold font-heading text-white">{selectedNode.label}</h4>
                    <p className="text-[10px] text-[#F4C266] font-mono">{selectedNode.code} • {selectedNode.semester} ({selectedNode.year}st/nd/rd Year)</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedNode(null)}
                  className="rounded-lg p-1 text-[#D9C2CA] hover:bg-white/10 hover:text-white"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Core Topics */}
              <div className="space-y-3 mb-5">
                <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-[#F4C266] flex items-center gap-1.5">
                  <FiBookOpen size={12} /> Key Syllabus Topics
                </h5>
                <ul className="space-y-1.5">
                  {selectedNode.topics.map((topic, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 rounded-xl bg-white/5 p-2 text-xs text-[#E5D2D8] border border-white/5"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F4C266]" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Key Takeaway */}
              <div className="rounded-2xl bg-gradient-to-r from-[#C50337]/20 to-[#D97706]/20 border border-[#F4C266]/30 p-3.5 mb-5 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#F4C266] uppercase tracking-wider">
                  <FiZap size={12} /> AI Exam Key Takeaway
                </div>
                <p className="text-xs text-[#F3E4E8] leading-relaxed italic">
                  "{selectedNode.aiTakeaway}"
                </p>
              </div>
            </div>

            {/* Action Link Button */}
            <button
              onClick={() => navigate(selectedNode.link)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C50337] to-[#7F011F] px-4 py-3 text-xs font-extrabold text-white shadow-lg hover:scale-105 transition-all font-heading cursor-pointer"
            >
              <FiFileText size={16} />
              <span>Explore {selectedNode.code} Lecture Notes</span>
              <FiArrowRight size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
