// src/pages/About.jsx
// Premium glassmorphism About page — Vision, Mission, Achievements, Labs, Faculty, Contact
import { motion } from "framer-motion";
import {
  FiTarget, FiEye, FiAward,
  FiMail, FiPhone, FiMapPin, FiBookOpen,
  FiUsers, FiStar, FiTrendingUp,
} from "react-icons/fi";

const vision = "To be a center of excellence in Computer Science education, research, and innovation, producing globally competitive professionals who drive technological transformation.";
const mission = [
  "Provide a rigorous, industry-aligned curriculum that fosters analytical thinking and problem-solving skills.",
  "Promote cutting-edge research in emerging areas such as AI, Machine Learning, Cybersecurity, and Cloud Computing.",
  "Cultivate an ecosystem of innovation through industry partnerships, hackathons, and entrepreneurial initiatives.",
  "Nurture ethical, socially responsible technologists who contribute meaningfully to society.",
];

const achievements = [
  { value: "NBA Accredited", label: "Program Accreditation", icon: FiAward, color: "from-blue-500 to-indigo-600" },
  { value: "A+ Grade", label: "NAAC Rating", icon: FiStar, color: "from-emerald-500 to-teal-600" },
  { value: "50+", label: "Research Publications", icon: FiBookOpen, color: "from-amber-500 to-orange-600" },
  { value: "₹32 LPA", label: "Highest Placement", icon: FiTrendingUp, color: "from-rose-500 to-pink-600" },
  { value: "30+", label: "Industry Partners", icon: FiUsers, color: "from-violet-500 to-purple-600" },
  { value: "100%", label: "Faculty Doctorates", icon: FiAward, color: "from-cyan-500 to-sky-600" },
];

const labs = [
  { name: "AI & Machine Learning Lab", desc: "Equipped with high-performance workstations for deep learning, NLP, and computer vision research.", icon: "🧠" },
  { name: "Cyber Security Lab", desc: "Dedicated environment for network security testing, ethical hacking, and digital forensics.", icon: "🔒" },
  { name: "Cloud Computing Lab", desc: "Access to AWS, Azure, and Google Cloud platforms for hands-on cloud infrastructure training.", icon: "☁️" },
  { name: "IoT & Embedded Systems Lab", desc: "Arduino, Raspberry Pi, and sensor kits for building real-world IoT solutions.", icon: "🔧" },
  { name: "Software Development Lab", desc: "Agile development space with industry-standard tools for full-stack and mobile projects.", icon: "💻" },
  { name: "Data Science & Analytics Lab", desc: "Big data tools, visualization suites, and statistical analysis software for data-driven projects.", icon: "📊" },
];

const faculty = [
  { name: "Dr. Ananya Rao", role: "Professor & Head of Department", expertise: "Distributed Systems", initials: "AR", color: "from-blue-500 to-indigo-600" },
  { name: "Dr. Karthik Iyer", role: "Associate Professor", expertise: "Artificial Intelligence", initials: "KI", color: "from-emerald-500 to-teal-600" },
  { name: "Dr. Meera Nair", role: "Associate Professor", expertise: "Database Systems", initials: "MN", color: "from-amber-500 to-orange-600" },
  { name: "Prof. Rohan Das", role: "Assistant Professor", expertise: "Software Engineering", initials: "RD", color: "from-rose-500 to-pink-600" },
  { name: "Dr. Priya Sharma", role: "Assistant Professor", expertise: "Cyber Security", initials: "PS", color: "from-violet-500 to-purple-600" },
  { name: "Prof. Arjun Menon", role: "Assistant Professor", expertise: "Computer Networks", initials: "AM", color: "from-cyan-500 to-sky-600" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-premium-lg">
          <FiBookOpen size={36} />
        </div>
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700">
          About Us
        </span>
        <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
          Department of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Computer Science</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-500 leading-relaxed">
          The CS Academic Portal is the Department of Computer Science's single home for academic material — lecture videos, notes, question papers
          and placement information — built to replace scattered PDFs, shared drives and messaging groups with one searchable, organized system.
        </p>
      </motion.div>

      {/* Vision & Mission */}
      <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
        className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2"
      >
        <motion.div variants={itemVariants}
          className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass p-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50" />
          <div className="relative">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
              <FiEye size={24} />
            </div>
            <h2 className="mb-4 font-display text-xl font-bold text-gray-900">Our Vision</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{vision}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}
          className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass p-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-50" />
          <div className="relative">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
              <FiTarget size={24} />
            </div>
            <h2 className="mb-4 font-display text-xl font-bold text-gray-900">Our Mission</h2>
            <ul className="space-y-3">
              {mission.map((m, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                  <span className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 shadow-sm" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>

      {/* Achievements */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants} className="mb-20"
      >
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900">
            Department <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Achievements</span>
          </h2>
          <p className="mt-1 text-sm text-gray-500">Milestones that define our commitment to excellence</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {achievements.map((a, i) => (
            <motion.div key={a.label} variants={itemVariants}>
              <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass p-5 text-center transition-all duration-300 hover:shadow-glass-lg">
                <div className={`absolute inset-0 bg-gradient-to-br ${a.color} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity`} />
                <div className="relative">
                  <p className="text-2xl mb-2">{a.icon === FiAward ? "🏅" : a.icon === FiStar ? "⭐" : a.icon === FiBookOpen ? "📚" : a.icon === FiTrendingUp ? "📈" : a.icon === FiUsers ? "👥" : "🎯"}</p>
                  <p className="font-display text-lg font-bold text-gray-900">{a.value}</p>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">{a.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Laboratories */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants} className="mb-20"
      >
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Laboratories</span>
          </h2>
          <p className="mt-1 text-sm text-gray-500">State-of-the-art labs equipped with modern tools and technologies</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {labs.map((lab, i) => (
            <motion.div key={lab.name} variants={itemVariants}>
              <div className="group relative h-full overflow-hidden rounded-2xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass p-5 transition-all duration-300 hover:shadow-glass-lg">
                <p className="text-2xl mb-3">{lab.icon}</p>
                <h3 className="mb-1.5 font-display text-sm font-bold text-gray-900">{lab.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{lab.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Faculty */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants} className="mb-20"
      >
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Faculty</span> Highlights
          </h2>
          <p className="mt-1 text-sm text-gray-500">Meet our distinguished faculty members</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.map((f, i) => (
            <motion.div key={f.name} variants={itemVariants}>
              <div className="group relative h-full overflow-hidden rounded-2xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass p-5 text-center transition-all duration-300 hover:shadow-glass-lg">
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-[0.02] group-hover:opacity-[0.04] transition-opacity`} />
                <div className="relative">
                  <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${f.color} text-base font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-105`}>
                    {f.initials}
                  </div>
                  <h3 className="font-display text-sm font-bold text-gray-900">{f.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{f.role}</p>
                  <span className={`mt-3 inline-block rounded-full bg-gradient-to-r ${f.color} px-3 py-1 text-[10px] font-bold text-white shadow-sm`}>
                    {f.expertise}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}
          className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass p-8 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50" />
          <div className="relative">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
              <FiMail size={24} />
            </div>
            <h2 className="mb-6 font-display text-2xl font-bold text-gray-900">Get in Touch</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="flex flex-col items-center gap-2 rounded-xl bg-white/60 p-4 border border-gray-100">
                <FiMapPin className="text-blue-600" size={20} />
                <p className="text-xs text-gray-500">CS Department, University Campus</p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl bg-white/60 p-4 border border-gray-100">
                <FiMail className="text-blue-600" size={20} />
                <p className="text-xs text-gray-500">csdept@university.edu</p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl bg-white/60 p-4 border border-gray-100">
                <FiPhone className="text-blue-600" size={20} />
                <p className="text-xs text-gray-500">+91-12345-67890</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
