// src/pages/About.jsx
// Complete DG Vaishnav College (DGVC) Official Home Page Profile & Department Info
// Ultra-Decorative Dark Theme matching DGVC Official Colors (Navy #011337, Crimson #C50337, Gold #D4AF37)
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiTarget, FiEye, FiMail, FiPhone, FiMapPin,
  FiAward, FiBookOpen, FiUsers, FiShield, FiCheckCircle,
  FiFileText, FiGlobe, FiBell, FiChevronRight, FiStar, FiExternalLink, FiCompass
} from "react-icons/fi";
import collegeLogo from "../assets/college-logo.jpg";

// Official DGVC Images
const SECRETARY_IMG = "https://www.dgvaishnavcollege.edu.in/dgvaishnav-c/uploads/2020/01/secretary.jpg";
const PRINCIPAL_IMG = "https://www.dgvaishnavcollege.edu.in/dgvaishnav-c/uploads/2020/09/principal-image.jpg";
const COLLEGE_LOGO_ONLINE = "https://www.dgvaishnavcollege.edu.in/dgvaishnav-c/uploads/2022/09/College-Logo-New.jpg";

const vision = "To impart value based quality academia; to empower students with wisdom and to charge them with rich Indian traditions and culture; to invoke the self, to broaden the same towards nation building, harmony, and universal brotherhood.";

const mission = [
  "To impart knowledge, enable the students to acquire skills and imbibe values.",
  "Develop student personality and mould their character.",
  "Evoke a sense of empathy and social concern.",
  "Help students evolve into humane and responsible citizens."
];

const notices = [
  "🎓 59th Graduation Day — Eligible Candidate List & Download Photos",
  "📢 Circular: MCA Admission 2026 Through TANCET Counselling",
  "📰 DGVC Times January 2026 Edition Released",
  "🏆 NAAC Accredited 'A++' Grade (CGPA 3.54/4) Autonomous Institution",
  "📜 Scholarship Circular for Academic Year 2026-2027"
];

const authorities = [
  {
    name: "Shri. Ashok Kumar Mundhra",
    designation: "Secretary",
    image: SECRETARY_IMG,
    avatarText: "AM",
    quote: "“All our dreams can come true, if we have the courage to pursue them”— Walt Disney",
    message: "Dreams may seem to be far removed from reality. They may seem impossible and improbable. But little do we realize that all of us have in us the strength, patience and the passion to fulfill our dreams. The vision and dreams of a few kind-hearted philanthropists and educationists led to the founding of this institution. Dwaraka Doss Goverdhan Doss Vaishnav College was established with the sole purpose of imparting value-based quality education to build a bright future for generation after generation.",
  },
  {
    name: "Dr. S. Santhosh Baboo, M.Sc. Ph.D.",
    designation: "Principal",
    image: PRINCIPAL_IMG,
    avatarText: "SB",
    quote: "“Education is the most powerful weapon which you can use to change the world.”",
    message: "The meaning of education has transformed greatly in today’s technology driven and digitally connected world that we live in. An educator in the present times has to adopt a multi-dimensional approach having knowledge creation, confidence building and honing leadership skills at its core. While many of our students have been greatly contributing to various renowned and reputed organisations as exemplar leaders, the institution also focuses on nurturing ethical, social, and spiritual values.",
  }
];

const dgvcAllDepartments = [
  {
    id: "languages",
    category: "Languages",
    icon: "🗣️",
    badge: "Faculty of Languages",
    url: "https://www.dgvaishnavcollege.edu.in/programs/languages/",
    list: [
      { name: "Department of Tamil", desc: "Classical language studies, ancient literature & Tamil linguistic heritage." },
      { name: "Department of Hindi", desc: "National language literature, translation studies & modern prose." },
      { name: "Department of Sanskrit", desc: "Vedic literature, ancient manuscripts & Indian philosophical texts." },
      { name: "Department of English", desc: "World literature, communicative skills & advanced linguistics." },
      { name: "Department of Telugu", desc: "Regional literature, poetry & linguistic studies." },
    ]
  },
  {
    id: "arts",
    category: "Arts",
    icon: "🎭",
    badge: "Faculty of Arts",
    url: "https://www.dgvaishnavcollege.edu.in/programs/arts/",
    list: [
      { name: "Department of Economics", desc: "Macroeconomics, econometrics, public finance & policy analysis." },
      { name: "Department of History & Tourism", desc: "World history, archaeology, heritage conservation & travel management." },
      { name: "Department of Sociology", desc: "Social structures, community dynamics & human behavior studies." },
      { name: "Department of Social Work (BSW/MSW)", desc: "Community development, HR management & clinical social work." },
      { name: "Department of Criminology & Police Admin", desc: "Criminal justice system, forensic science basics & police administration." },
      { name: "Department of Defense & Strategic Studies", desc: "National security, strategic defense warfare & geopolitics." },
      { name: "Department of Journalism & Communication", desc: "Media production, broadcast journalism & digital reporting." }
    ]
  },
  {
    id: "commerce",
    category: "Commerce",
    icon: "📈",
    badge: "Faculty of Commerce",
    url: "https://www.dgvaishnavcollege.edu.in/programs/commerce/",
    list: [
      { name: "B.Com (General)", desc: "Foundational accounting, financial auditing, taxation & business law." },
      { name: "B.Com (Corporate Secretaryship)", desc: "Corporate governance, secretarial practice & company laws." },
      { name: "B.Com (Accounting & Finance)", desc: "Advanced corporate accounting, cost management & investment." },
      { name: "B.Com (Bank Management)", desc: "Banking operations, fintech systems & financial risk analysis." },
      { name: "B.Com (Marketing Management)", desc: "Consumer psychology, digital marketing & brand strategy." },
      { name: "B.Com (Computer Applications)", desc: "Business computing, ERP software & automated accounting." },
      { name: "B.Com (Honours)", desc: "Specialized professional accounting, research & corporate finance." }
    ]
  },
  {
    id: "science",
    category: "Science",
    icon: "🔬",
    badge: "Faculty of Science",
    url: "https://www.dgvaishnavcollege.edu.in/programs/science/",
    list: [
      { name: "Department of Computer Science", desc: "Software engineering, algorithms, AI, Web Dev & Database Systems.", highlighted: true },
      { name: "Department of Mathematics", desc: "Pure & applied mathematics, linear algebra, calculus & operations research." },
      { name: "Department of Statistics", desc: "Statistical modeling, data analytics, probability theory & biostatistics." },
      { name: "Department of Physics", desc: "Quantum mechanics, semiconductor physics, optics & electronics." },
      { name: "Department of Chemistry", desc: "Organic synthesis, inorganic chemistry, physical & analytical chemistry." },
      { name: "Department of Plant Biology & Biotech", desc: "Botany, plant genetics, tissue culture & bio-resource management." },
      { name: "Department of Biochemistry", desc: "Enzymology, clinical biochemistry & molecular biology techniques." },
      { name: "Department of Biotechnology", desc: "Genetic engineering, industrial biotechnology & bioinformatics." },
      { name: "Department of Psychology", desc: "Cognitive psychology, counseling skills, mental health & human behavior." },
      { name: "Department of Visual Communication", desc: "Graphic design, filmmaking, photography & digital media production." }
    ]
  },
  {
    id: "professional",
    category: "Professional Studies",
    icon: "💼",
    badge: "Faculty of Professional Studies",
    url: "https://www.dgvaishnavcollege.edu.in/programs/professionals/",
    list: [
      { name: "Department of Business Administration (BBA/MBA)", desc: "Executive leadership, strategic management, corporate HR & marketing." },
      { name: "Department of Computer Applications (BCA/MCA)", desc: "Full-stack application development, cloud systems & mobile apps." },
      { name: "Data Science & AI Cell", desc: "Machine learning engineering, big data analytics & artificial intelligence." }
    ]
  }
];

const pillars = [
  {
    title: "Vision",
    desc: "To impart value based quality academia; to empower students with wisdom...",
    icon: <FiEye size={22} className="text-amber-300" />,
    color: "from-[#C50337]/30 to-[#7F011F]/50 border-[#C50337]/50"
  },
  {
    title: "Mission",
    desc: "To impart knowledge, enable the students to acquire skills and imbibe values...",
    icon: <FiTarget size={22} className="text-cyan-400" />,
    color: "from-[#021C4F]/50 to-[#0A369D]/50 border-cyan-500/40"
  },
  {
    title: "Extra Curricular Activities",
    desc: "NSS, NCC, Sports, Youth Red Cross & Fine Arts promoting all-round student development...",
    icon: <FiAward size={22} className="text-amber-400" />,
    color: "from-amber-500/20 to-yellow-600/30 border-amber-500/40"
  },
  {
    title: "Placement Cell",
    desc: "Committed Career Guidance & Placement cell securing top industry job offers...",
    icon: <FiShield size={22} className="text-emerald-400" />,
    color: "from-emerald-500/20 to-teal-700/30 border-emerald-500/40"
  }
];

const committees = [
  {
    name: "Anti-Ragging Committee",
    desc: "Ensures a completely safe, welcoming, and ragging-free campus experience.",
    badge: "Student Safety",
    url: "https://www.dgvaishnavcollege.edu.in/anti-ragging-committee/"
  },
  {
    name: "Student Grievance Committee",
    desc: "Dedicated forum to address, evaluate, and resolve academic or campus concerns.",
    badge: "Support Forum",
    url: "https://www.dgvaishnavcollege.edu.in/student-grevienance-committee/"
  },
  {
    name: "College Day Committee",
    desc: "Organizes annual academic celebrations, student awards, and cultural events.",
    badge: "Campus Life",
    url: "https://www.dgvaishnavcollege.edu.in/college-day-committe/"
  },
  {
    name: "Vice President of Subject",
    desc: "Student body academic leadership coordinating subject association activities.",
    badge: "Academic Body",
    url: "https://www.dgvaishnavcollege.edu.in/vice-president-of-subject/"
  },
  {
    name: "Magazine Committee",
    desc: "Showcases student literature, research articles, and annual DGVC publications.",
    badge: "Publications",
    url: "https://www.dgvaishnavcollege.edu.in/magazine-committee/"
  },
  {
    name: "Educational Tour & Travel",
    desc: "Coordinates academic field visits, industrial tours, and educational travel excursions.",
    badge: "Academic Excursions",
    url: "https://www.dgvaishnavcollege.edu.in/educational-tour-travel/"
  },
  {
    name: "Newsletter Committee",
    desc: "Publishes regular campus newsletters highlighting department news & accomplishments.",
    badge: "Media & News",
    url: "https://www.dgvaishnavcollege.edu.in/newsletter-3/"
  },
  {
    name: "UGC Coordination Cell",
    desc: "Oversees UGC scheme implementations, institutional grants, and compliance standards.",
    badge: "UGC Compliance",
    url: "https://www.dgvaishnavcollege.edu.in/ugc-coordination-cell/"
  },
  {
    name: "Calendar Committee",
    desc: "Plans and releases the official academic calendar, exam schedules, and holiday almanac.",
    badge: "Academic Schedule",
    url: "https://www.dgvaishnavcollege.edu.in/calender-committee/"
  },
  {
    name: "Disciplinary Committee",
    desc: "Maintains code of conduct, campus decorum, and institutional discipline guidelines.",
    badge: "Campus Discipline",
    url: "https://www.dgvaishnavcollege.edu.in/disciplinary-committee/"
  },
  {
    name: "Sports Advisory Committee",
    desc: "Promotes athletic excellence, inter-collegiate tournaments, and sports development.",
    badge: "Sports & Athletics",
    url: "https://www.dgvaishnavcollege.edu.in/sports-advisory-committee/"
  },
  {
    name: "AICTE Committee",
    desc: "Ensures technical education standards, AICTE approvals, and program accreditations.",
    badge: "AICTE Approvals",
    url: "https://www.dgvaishnavcollege.edu.in/aicte/"
  },
  {
    name: "Ethics Committee",
    desc: "Monitors academic research integrity, ethical standards, and institutional values.",
    badge: "Research Ethics",
    url: "https://www.dgvaishnavcollege.edu.in/ethics-committee/"
  }
];

const facultyList = [
  { name: "Mrs. P. Suganya", designation: "Assistant Professor & Head", specialization: "Compiler Design & Computing" },
  { name: "Mrs. R. Lalitha", designation: "Associate Professor", specialization: "Data Mining & Data Warehousing" },
  { name: "Mrs. P. J. Rajam", designation: "Assistant Professor", specialization: "Digital Logic & Microprocessors" },
  { name: "Dr. K. Durgadevi", designation: "Assistant Professor", specialization: "Machine Learning & Neural Networks" },
  { name: "Mrs. Dharani", designation: "Assistant Professor", specialization: "Database Management Systems" },
  { name: "Mrs. P. Revathi", designation: "Assistant Professor", specialization: "Web Technology & UI Development" },
  { name: "Mrs. S. Karthika", designation: "Assistant Professor", specialization: "Data Structures & Algorithms" },
  { name: "Mrs. R. Saranya", designation: "Assistant Professor", specialization: "Cloud Computing & Networks" },
  { name: "Dr. M. P. Sudha", designation: "Assistant Professor", specialization: "Software Engineering & Testing" },
  { name: "Mrs. V. Ponnila", designation: "Assistant Professor", specialization: "Operating Systems & Shell Scripting" },
  { name: "Mrs. R. Poojitha Shree", designation: "Assistant Professor", specialization: "Python Programming & AI" },
  { name: "Mrs. S. Tamilarasi", designation: "Assistant Professor", specialization: "Object Oriented Programming" },
  { name: "Mrs. G. Srilakshmi", designation: "Assistant Professor", specialization: "Computer Networks & Security" },
  { name: "Mrs. M. Sangeetha", designation: "Assistant Professor", specialization: "Information Security" },
  { name: "Mrs. S. Gita", designation: "Assistant Professor", specialization: "C++ & Problem Solving" }
];

export default function About() {
  const [activeNoticeIdx, setActiveNoticeIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNoticeIdx((prev) => (prev + 1) % notices.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      
      {/* ── Top Announcement Ticker Bar ── */}
      <div className="bg-[#011337] border-b border-amber-400/30 text-white py-2 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="bg-[#C50337] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded shrink-0 flex items-center gap-1 shadow-sm">
              <FiBell className="animate-bounce" size={12} /> News Ticker
            </span>
            <motion.p
              key={activeNoticeIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-amber-200 font-bold truncate text-xs sm:text-sm"
            >
              {notices[activeNoticeIdx]}
            </motion.p>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-white/80 shrink-0">
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              NAAC A++ (CGPA 3.54)
            </span>
          </div>
        </div>
      </div>

      {/* ── Hero Banner Section with Glowing Background Accents ── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#011337] via-[#021C4F] to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-amber-400/30 shadow-2xl">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 9, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#C50337]/30 blur-[100px] pointer-events-none"
        />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <div className="p-3.5 bg-white rounded-3xl shadow-2xl border-2 border-amber-400/50 max-w-[340px]">
              <img
                src={COLLEGE_LOGO_ONLINE}
                onError={(e) => { e.target.src = collegeLogo; }}
                alt="DGVC Official Logo"
                className="h-20 sm:h-24 object-contain mx-auto"
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight font-serif">
              Dwaraka Doss Goverdhan Doss Vaishnav College
            </h1>
            <p className="text-amber-300 text-xs sm:text-sm font-extrabold tracking-widest uppercase mt-3">
              (Autonomous) — Linguistic Minority Institution
            </p>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto mt-2 font-medium">
              Established in 1964 | Affiliated to University of Madras | Accredited with 'A++' Grade by NAAC (CGPA 3.54/4)
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">

        {/* ── Welcome to DDGD Vaishnav College ── */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden backdrop-blur-xl"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C50337]/20 to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-4">
            <span className="h-8 w-1.5 bg-[#C50337] rounded-full" />
            <h2 className="text-xl sm:text-3xl font-extrabold text-white">
              Welcome to <span className="text-rose-400">DDGD Vaishnav College</span>
            </h2>
          </div>

          <div className="prose prose-invert max-w-none text-xs sm:text-sm sm:leading-relaxed text-white font-medium space-y-4 text-justify">
            <p className="text-white">
              <strong className="text-amber-300 font-extrabold">Dwaraka Doss Goverdhan Doss Vaishnav College</strong>, a linguistic minority institution established in the year 1964 by the Rajasthanis and Gujaratis settled in Chennai for the cause of higher education. DDGDVC is renowned as a premier institution with the sole purpose of imparting knowledge and value-based education.
            </p>
            <p className="text-white">
              The college saw its grand inception on <strong className="text-amber-300 font-extrabold">30th June 1964</strong> with one course in B.Sc. Mathematics under <strong className="text-amber-300 font-extrabold">Shri Totadri Iyengar</strong> (the revered teacher of Dr. APJ Abdul Kalam) as its first Principal. Dwaraka Doss Goverdhan Doss Vaishnav College has been a haven for generations of enthusiastic learners through five decades and more.
            </p>
            <p className="text-white">
              Founded on the principles of Vaishnavism, the college combines academic excellence with cultural heritage, empowering students to achieve intellectual growth, moral integrity, and social responsibility.
            </p>
          </div>
        </motion.section>

        {/* ── Core Pillars (Vision, Mission, Extra Curricular, Placement) ── */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-3xl font-extrabold text-white">Our Pillars of Excellence</h2>
            <p className="text-xs text-slate-400 font-medium">Core values guiding our academic &amp; holistic development</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((p, idx) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-3xl bg-gradient-to-b ${p.color} p-6 border shadow-lg flex flex-col justify-between hover:scale-105 transition-all backdrop-blur-md`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xs">{p.icon}</div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">DGVC Pillar</span>
                  </div>
                  <h3 className="font-extrabold text-base text-white">{p.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Vision & Mission Detailed Showcase ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/20 text-[#C50337] border border-rose-500/30">
                <FiEye size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">Vision Statement</h3>
                <p className="text-[11px] text-amber-300 font-semibold">Guiding light of the institution</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic border-l-4 border-[#C50337] pl-4 py-2 bg-rose-950/30 rounded-r-xl font-medium">
              "{vision}"
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20 text-cyan-400 border border-cyan-500/30">
                <FiTarget size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">Mission Objectives</h3>
                <p className="text-[11px] text-cyan-300 font-semibold">Our commitment to students</p>
              </div>
            </div>
            <ul className="space-y-2.5">
              {mission.map((m, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 font-medium">
                  <FiCheckCircle className="text-emerald-400 mt-0.5 shrink-0" size={16} />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ── Leadership Authorities Section ── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-3xl font-extrabold text-white">Our Authorities &amp; Leadership</h2>
            <p className="text-xs text-slate-400 font-medium">Distinguished governance inspiring academic excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {authorities.map((auth) => (
              <div
                key={auth.name}
                className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-5 backdrop-blur-xl hover:border-amber-400/40 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={auth.image}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                      alt={auth.name}
                      className="h-20 w-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                    />
                    <div className="hidden h-20 w-20 rounded-2xl bg-gradient-to-br from-[#021C4F] to-[#C50337] items-center justify-center text-white font-bold text-xl border-2 border-amber-400">
                      {auth.avatarText}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-white">{auth.name}</h3>
                    <span className="inline-block bg-[#C50337] text-white px-3 py-0.5 rounded-full text-xs font-black tracking-wider uppercase mt-1 shadow-sm">
                      {auth.designation}
                    </span>
                    <p className="text-xs text-amber-300 mt-1 font-semibold italic">{auth.quote}</p>
                  </div>
                </div>

                <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800">
                  <p className="text-xs text-slate-300 leading-relaxed text-justify font-medium">{auth.message}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── All Academic Departments & Programmes Showcase ── */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <span className="bg-rose-500/10 text-rose-400 text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full border border-rose-500/20">
              Full Institutional Spectrum
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white mt-2">DGVC Academic Departments</h2>
            <p className="text-xs text-slate-400 font-medium">Explore all 5 faculties and 34+ academic departments under DG Vaishnav College</p>
          </div>

          <div className="space-y-8">
            {dgvcAllDepartments.map((faculty) => (
              <div key={faculty.id} className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-5 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 bg-slate-950 rounded-2xl border border-slate-800">{faculty.icon}</span>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                        {faculty.badge}
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">{faculty.category} Departments</h3>
                    </div>
                  </div>
                  <a
                    href={faculty.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-amber-300 transition-colors self-start sm:self-auto"
                  >
                    <span>View Official Portal</span>
                    <FiExternalLink size={13} />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {faculty.list.map((dept) => (
                    <div
                      key={dept.name}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        dept.highlighted
                          ? "bg-gradient-to-br from-[#021C4F] to-[#7F011F] border-amber-400 ring-2 ring-amber-400/20 shadow-lg"
                          : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-extrabold text-xs sm:text-sm ${dept.highlighted ? "text-amber-300" : "text-white"}`}>
                            {dept.name}
                          </h4>
                          {dept.highlighted && (
                            <span className="text-[9px] font-black bg-[#C50337] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Current Portal
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed mt-1 font-medium">{dept.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Department of Computer Science & Faculty ── */}
        <section id="faculty" className="space-y-6 scroll-mt-24">
          <div className="text-center space-y-1">
            <span className="bg-[#C50337]/20 text-rose-300 text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full border border-[#C50337]/40">
              Department Profile
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white mt-2">Department of Computer Science</h2>
            <p className="text-xs text-slate-400 font-medium">Meet our dedicated faculty &amp; department leadership</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {facultyList.map((fac, idx) => (
              <div
                key={fac.name}
                className={`bg-slate-900/90 rounded-2xl p-5 border shadow-md hover:scale-105 transition-all text-center flex flex-col justify-between ${
                  idx === 0 ? "border-[#C50337] ring-2 ring-[#C50337]/30 bg-gradient-to-b from-[#C50337]/20 to-slate-900" : "border-slate-800"
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-white shadow-md mb-3 ${
                    idx === 0 ? "bg-[#C50337]" : "bg-[#021C4F]"
                  }`}>
                    {fac.name.split(" ").pop().charAt(0) || "F"}
                  </div>
                  <h3 className="font-black text-xs sm:text-sm text-white leading-tight">{fac.name}</h3>
                  <p className="text-[10px] font-extrabold text-amber-300 mt-1 uppercase tracking-wider">{fac.designation}</p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-800 text-[10px] text-slate-400 font-medium">
                  <span className="font-bold text-slate-200">Specialization:</span> {fac.specialization}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Our Reputed Recruiters & Industry Partners ── */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full border border-emerald-500/20">
              Placement &amp; Industry Partners
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white mt-2">Our Reputed Recruiters</h2>
            <p className="text-xs text-slate-400 font-medium">Top global IT giants &amp; corporate firms recruiting DGVC graduates</p>
          </div>

          {/* Official DGVC Recruiter Grid Showcase */}
          <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="overflow-hidden rounded-2xl border border-slate-800 shadow-md bg-slate-950">
                <img
                  src="https://www.dgvaishnavcollege.edu.in/dgvaishnav-c/uploads/2022/03/Reputed-Recruiters-IMAGE-1-768x576.jpg"
                  alt="DGVC Reputed Recruiters Showcase 1"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-800 shadow-md bg-slate-950">
                <img
                  src="https://www.dgvaishnavcollege.edu.in/dgvaishnav-c/uploads/2022/03/Reputed-Recruiters-IMAGE-2-768x576.jpg"
                  alt="DGVC Reputed Recruiters Showcase 2"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Recruiter Brand Badges */}
            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-center text-xs font-extrabold uppercase tracking-wider text-amber-300 mb-4">
                Key Recruiting Partners &amp; Corporate Alliances
              </h3>
              <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
                {[
                  "Tata Consultancy Services (TCS)", "Cognizant (CTS)", "Wipro", "Infosys", "HCL Technologies",
                  "Accenture", "Capgemini", "Deloitte", "Zoho Corporation", "Amazon",
                  "Larsen & Toubro (LTI)", "Tech Mahindra", "Mindtree", "BNY Mellon",
                  "Ford India", "ICICI Bank", "HDFC Bank", "Pickyourtrail"
                ].map((company) => (
                  <span
                    key={company}
                    className="bg-slate-950 border border-slate-800 text-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs hover:border-amber-400 hover:text-amber-300 transition-all cursor-default"
                  >
                    💼 {company}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Campus Committees & Support Cells ── */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-3xl font-extrabold text-white">Our Committees &amp; Support Cells</h2>
            <p className="text-xs text-slate-400 font-medium">
              13 Official DGVC Committees ensuring student welfare, academic governance, and campus safety
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {committees.map((c) => (
              <a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="group bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md hover:border-[#C50337] transition-all flex flex-col justify-between backdrop-blur-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold bg-[#021C4F] text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                      {c.badge}
                    </span>
                    <FiExternalLink size={13} className="text-slate-400 group-hover:text-[#C50337] transition-colors" />
                  </div>
                  <h3 className="font-extrabold text-sm text-white group-hover:text-[#C50337] transition-colors">{c.name}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-medium">{c.desc}</p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-bold text-cyan-400 group-hover:text-rose-400">
                  <span>Visit Committee Portal</span>
                  <FiChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── Get in Touch / Contact Cards ── */}
        <section className="bg-gradient-to-r from-[#011337] via-[#021C4F] to-slate-900 rounded-3xl border border-amber-400/30 p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-3xl font-extrabold text-white">Get in Touch with DGVC</h2>
            <p className="text-xs text-slate-300">Official campus contact details &amp; location</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 flex items-start gap-3">
              <FiMapPin size={20} className="text-[#C50337] shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-white block mb-1">Campus Address:</span>
                Dwaraka Doss Goverdhan Doss Vaishnav College<br />
                #833, E.V.R. Periyar High Road, Arumbakkam, Chennai – 600 106, Tamilnadu.
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 flex items-start gap-3">
              <FiPhone size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-white block mb-1">Contact Phone Lines:</span>
                +91 - 9498344201<br />
                +91 - 9498344202
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 flex items-start gap-3">
              <FiMail size={20} className="text-amber-300 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed overflow-hidden">
                <span className="font-bold text-white block mb-1">Official Emails:</span>
                <a href="mailto:principal@dgvaishnavcollege.edu.in" className="text-amber-300 hover:underline block truncate">
                  principal@dgvaishnavcollege.edu.in
                </a>
                <a href="mailto:coe@dgvaishnavcollege.edu.in" className="text-amber-300 hover:underline block truncate">
                  coe@dgvaishnavcollege.edu.in
                </a>
                <a href="mailto:helpdesk@dgvaishnavcollege.edu.in" className="text-amber-300 hover:underline block truncate">
                  helpdesk@dgvaishnavcollege.edu.in
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
