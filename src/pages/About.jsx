// src/pages/About.jsx
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiTarget, FiEye,
  FiMail, FiPhone, FiMapPin,
} from "react-icons/fi";
import collegeLogo from "../assets/college-logo.jpg";

const vision = "To impart value based quality academia; to empower students with wisdom and to charge them with rich Indian traditions and culture; to invoke the self, to broaden the same towards nation building, harmony, and universal brotherhood.";

const mission = [
  "To impart knowledge, enable the students to acquire skills and imbibe values.",
  "Develop student personality and mould their character.",
  "Evoke a sense of empathy and social concern.",
  "Help students evolve into humane and responsible citizens."
];

const authorities = [
  {
    name: "Shri. Ashok Kumar Mundhra",
    designation: "Secretary",
    message: "“All our dreams can come true, if we have the courage to pursue them” — Walt Disney. Dreams may seem to be far removed from reality. They may seem impossible and improbable. But little do we realize that all of us have in us the strength, patience and the passion to fulfill our dreams. The vision and dreams of a few kind hearted philanthropists and educationists led to the founding of this institution. We strive to continue rendering value-based quality education to build a bright future.",
    avatarText: "AM",
  },
  {
    name: "Dr. S. Santhosh Baboo, M.Sc. Ph.D.",
    designation: "Principal",
    message: "The meaning of education has transformed greatly in today’s technology driven and digitally connected world that we live in. An educator in the present times has to adopt a multi-dimensional approach having knowledge creation, confidence building and honing leadership skills at its core. While many of our students have been greatly contributing to various renowned and reputed organisations as exemplar leaders, the institution also focuses on nurturing ethical, social, and spiritual values.",
    avatarText: "SB",
  }
];

const categories = [
  { name: "Languages", desc: "Foundation courses in English, Tamil, Hindi, Sanskrit, and French.", icon: "✍️" },
  { name: "Arts", desc: "Degrees in Economics, English Literature, Criminology, and Historical Studies.", icon: "🎭" },
  { name: "Commerce", desc: "Professional degrees in B.Com (General, Corporate, Finance, Honours, and Bank Management).", icon: "📈" },
  { name: "Science", desc: "Specializations in Mathematics, Physics, Chemistry, Computer Science, and Biotechnology.", icon: "🔬" },
  { name: "Professional", desc: "Postgraduate programs including MCA, MBA, and MSW streams.", icon: "💼" },
];

const committees = [
  { name: "Anti-Ragging Committee", desc: "Ensures a completely safe, welcoming, and ragging-free campus experience.", linkText: "Anti-Ragging Policies" },
  { name: "Student Grievance Cell", desc: "Dedicated forum to address, evaluate, and resolve academic or campus concerns.", linkText: "Grievance Portal" },
  { name: "Magazine Committee", desc: "Showcases student creativity, literature, and achievements through college publications.", linkText: "Read DGVC Times" },
  { name: "College Day Committee", desc: "Organizes annual academic celebrations, student awards, and cultural events.", linkText: "Events Schedule" },
];

// Suganya is Head of Department; all teachers listed below
const facultyList = [
  { name: "Mrs. P. Suganya", designation: "Assistant Professor & Head", specialization: "Compiler Design" },
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
  { name: "Mrs. A. Kavitha", designation: "Assistant Professor", specialization: "Mobile Application Development" }
];

export default function About() {
  useEffect(() => {
    // Listen for deep link smooth scroll to #faculty
    if (window.location.hash === "#faculty") {
      const el = document.getElementById("faculty");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 bg-[#F8FAFC] text-left">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
        <div className="mx-auto mb-6 flex justify-center max-w-[280px]">
          <img src={collegeLogo} alt="DGVC College Logo" className="h-16 object-contain" />
        </div>
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0F4C81]/10 px-4 py-1.5 text-xs font-bold text-[#0F4C81]">
          College Profile
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl font-bold text-[#0F4C81]">
          Welcome to <span className="text-[#0F4C81]">DDGD Vaishnav College</span>
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-sm text-[#6B7280] leading-relaxed">
          Dwaraka Doss Goverdhan Doss Vaishnav College, a linguistic minority institution established in the year 1964 by the Rajasthanis and Gujaratis settled in Chennai for the cause of higher education. Imparting value-based quality education, the college saw its grand inception on 30th June 1964 with a single course in B.Sc. Mathematics under Shri Totadri Iyengar (revered teacher of Dr. APJ Abdul Kalam) as its first Principal. Today, the college stands as a premier autonomous institution affiliated with the University of Madras, recently accredited with an A++ grade (CGPA 3.54/4) by NAAC.
        </p>
      </motion.div>

      {/* ── Vision & Mission ── */}
      <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border border-[#E5E7EB] bg-white p-8 shadow-sm"
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-[#0F4C81]/10 text-[#0F4C81]">
            <FiEye size={24} />
          </div>
          <h2 className="mb-4 font-sans text-xl font-bold text-[#0F4C81]">Our Vision</h2>
          <p className="text-sm text-[#4B5563] leading-relaxed">{vision}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border border-[#E5E7EB] bg-white p-8 shadow-sm"
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <FiTarget size={24} />
          </div>
          <h2 className="mb-4 font-sans text-xl font-bold text-[#0F4C81]">Our Mission</h2>
          <ul className="space-y-3">
            {mission.map((m, i) => (
              <li key={i} className="flex gap-3 text-sm text-[#4B5563] leading-relaxed animate-fade-in">
                <span className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-[#0F4C81]" />
                {m}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* ── College Administration / Authorities ── */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-20">
        <div className="mb-8 text-center">
          <h2 className="font-sans text-2xl font-bold text-[#0F4C81]">Our Administration & Leadership</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Inspiring vision and governance guiding our institution</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {authorities.map((auth, i) => (
            <div key={auth.name} className="flex flex-col rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F4C81] font-sans font-bold text-white shadow-sm">
                  {auth.avatarText}
                </div>
                <div>
                  <h3 className="font-sans text-sm font-bold text-[#0F4C81]">{auth.name}</h3>
                  <span className="text-xs font-semibold text-[#0F4C81]">{auth.designation}</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-[#4B5563] italic">
                {auth.message}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Academic Programmes ── */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-20">
        <div className="mb-8 text-center">
          <h2 className="font-sans text-2xl font-bold text-[#0F4C81]">Academic Programmes</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Comprehensive educational streams offered under Shift I & Shift II</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((cat, i) => (
            <div key={cat.name} className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm hover:shadow-md transition-all">
              <p className="text-2xl mb-3">{cat.icon}</p>
              <h3 className="mb-1 font-sans text-sm font-bold text-[#0F4C81]">{cat.name}</h3>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Faculty Grid Section (All cards centered) ── */}
      <motion.section 
        id="faculty" 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        viewport={{ once: true }} 
        className="mb-20 scroll-mt-24"
      >
        <div className="mb-8 text-center">
          <h2 className="font-sans text-2xl font-bold text-[#0F4C81]">Faculty Members</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Meet our distinguished Department of Computer Science educators</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {facultyList.map((fac, i) => (
            <div 
              key={fac.name} 
              className="flex flex-col items-center text-center justify-between rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm hover:shadow-md hover:border-[#1E88E5]/40 transition-all duration-300"
            >
              <div className="flex flex-col items-center w-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4C81] font-sans font-bold text-white shadow-sm mb-4">
                  {fac.name.split(" ").pop().charAt(0) || "F"}
                </div>
                <h3 className="font-sans text-sm font-bold text-[#0F4C81] mb-1">{fac.name}</h3>
                <p className="text-[11px] font-bold text-[#1E88E5] uppercase tracking-wider mb-3 leading-none">{fac.designation}</p>
                <p className="text-[11px] text-[#6B7280] leading-relaxed">
                  <span className="font-semibold text-[#0F4C81]">Specialization:</span> {fac.specialization}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Campus Committees ── */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-20">
        <div className="mb-8 text-center">
          <h2 className="font-sans text-2xl font-bold text-[#0F4C81]">Campus Committees & Welfare</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Active student support cells promoting equity, safety, and engagement</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {committees.map((c, i) => (
            <div key={c.name} className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <h3 className="mb-1.5 font-sans text-sm font-bold text-[#0F4C81]">{c.name}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed mb-4">{c.desc}</p>
              </div>
              <span className="text-[11px] font-bold text-[#1E88E5]">{c.linkText}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Contact Info Cards (Equal-height alignments & uniform size) ── */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <div className="mx-auto max-w-4xl rounded-xl border border-[#E5E7EB] bg-white p-8 text-center shadow-sm">
          <h2 className="mb-6 font-sans text-2xl font-bold text-[#0F4C81]">Get in Touch</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center justify-between rounded-lg bg-[#F8FAFC] border border-[#E5E7EB] p-6 text-[#4B5563] hover:shadow-sm transition-all min-h-[160px]">
              <div className="flex flex-col items-center">
                <FiMapPin className="text-[#0F4C81] mb-3" size={24} />
                <h3 className="text-xs font-bold text-[#0F4C81] uppercase tracking-wider mb-2">Address</h3>
                <p className="text-xs text-[#6B7280] font-semibold leading-relaxed">Gokul Bagh, 833 Poonamallee High Rd, Arumbakkam, Chennai, TN 600106</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between rounded-lg bg-[#F8FAFC] border border-[#E5E7EB] p-6 text-[#4B5563] hover:shadow-sm transition-all min-h-[160px]">
              <div className="flex flex-col items-center">
                <FiMail className="text-[#0F4C81] mb-3" size={24} />
                <h3 className="text-xs font-bold text-[#0F4C81] uppercase tracking-wider mb-2">Email</h3>
                <p className="text-xs text-[#6B7280] font-semibold leading-relaxed break-all">principal@dgvaishnavcollege.edu.in</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between rounded-lg bg-[#F8FAFC] border border-[#E5E7EB] p-6 text-[#4B5563] hover:shadow-sm transition-all min-h-[160px]">
              <div className="flex flex-col items-center">
                <FiPhone className="text-[#0F4C81] mb-3" size={24} />
                <h3 className="text-xs font-bold text-[#0F4C81] uppercase tracking-wider mb-2">Phone</h3>
                <p className="text-xs text-[#6B7280] font-semibold leading-relaxed">044-23625855</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
