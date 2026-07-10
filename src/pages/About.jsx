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
  { value: "NBA Accredited", label: "Program Accreditation", emoji: "🏅", color: "from-indigo-600 to-violet-600" },
  { value: "A+ Grade", label: "NAAC Rating", emoji: "⭐", color: "from-emerald-500 to-teal-600" },
  { value: "50+", label: "Research Publications", emoji: "📚", color: "from-amber-500 to-orange-600" },
  { value: "₹32 LPA", label: "Highest Placement", emoji: "📈", color: "from-rose-500 to-pink-600" },
  { value: "30+", label: "Industry Partners", emoji: "🤝", color: "from-violet-500 to-purple-600" },
  { value: "100%", label: "Faculty Doctorates", emoji: "🎯", color: "from-cyan-500 to-sky-600" },
];

const labs = [
  { name: "AI & Machine Learning Lab", desc: "High-performance workstations for deep learning, NLP, and computer vision research.", icon: "🧠" },
  { name: "Cyber Security Lab", desc: "Dedicated environment for network security testing, ethical hacking, and digital forensics.", icon: "🔒" },
  { name: "Cloud Computing Lab", desc: "Access to AWS, Azure, and Google Cloud for hands-on cloud infrastructure training.", icon: "☁️" },
  { name: "IoT & Embedded Systems Lab", desc: "Arduino, Raspberry Pi, and sensor kits for building real-world IoT solutions.", icon: "🔧" },
  { name: "Software Development Lab", desc: "Agile development space with industry-standard tools for full-stack projects.", icon: "💻" },
  { name: "Data Science & Analytics Lab", desc: "Big data tools, visualization suites, and statistical analysis software.", icon: "📊" },
];

const faculty = [
  { name: "Dr. Ananya Rao", role: "Professor & Head", expertise: "Distributed Systems", initials: "AR", color: "from-indigo-600 to-violet-600" },
  { name: "Dr. Karthik Iyer", role: "Associate Professor", expertise: "Artificial Intelligence", initials: "KI", color: "from-emerald-500 to-teal-600" },
  { name: "Dr. Meera Nair", role: "Associate Professor", expertise: "Database Systems", initials: "MN", color: "from-amber-500 to-orange-600" },
  { name: "Prof. Rohan Das", role: "Assistant Professor", expertise: "Software Engineering", initials: "RD", color: "from-rose-500 to-pink-600" },
  { name: "Dr. Priya Sharma", role: "Assistant Professor", expertise: "Cyber Security", initials: "PS", color: "from-violet-500 to-purple-600" },
  { name: "Prof. Arjun Menon", role: "Assistant Professor", expertise: "Computer Networks", initials: "AM", color: "from-cyan-500 to-sky-600" },
];

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-[0_8px_32px_rgba(79,70,229,0.2)]"><FiBookOpen size={36} /></div>
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-4 py-1.5 text-xs font-bold text-indigo-300">About Us</span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
          Department of <span className="text-gradient-primary">Computer Science</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-white/50 leading-relaxed">
          The CS Academic Portal is the Department of Computer Science's single home for academic material — lecture videos, notes, question papers
          and placement information — built to replace scattered PDFs, shared drives and messaging groups with one searchable, organized system.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
        className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2"
      >
        <motion.div className="glass-card-strong p-8">
          <div className="relative">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg"><FiEye size={24} /></div>
            <h2 className="mb-4 font-display text-xl font-bold text-white">Our Vision</h2>
            <p className="text-sm text-white/60 leading-relaxed">{vision}</p>
          </div>
        </motion.div>
        <motion.div className="glass-card-strong p-8">
          <div className="relative">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg"><FiTarget size={24} /></div>
            <h2 className="mb-4 font-display text-xl font-bold text-white">Our Mission</h2>
            <ul className="space-y-3">
              {mission.map((m, i) => (
                <li key={i} className="flex gap-3 text-sm text-white/60 leading-relaxed">
                  <span className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 shadow-sm" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>

      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="mb-20">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-bold text-white">Department <span className="text-gradient-primary">Achievements</span></h2>
          <p className="mt-1 text-sm text-white/50">Milestones that define our commitment to excellence</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {achievements.map((a, i) => (
            <motion.div key={a.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="glass-card-hover p-5 text-center"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${a.color} opacity-[0.06]}`} />
              <div className="relative">
                <p className="text-2xl mb-2">{a.emoji}</p>
                <p className="font-display text-lg font-bold text-white">{a.value}</p>
                <p className="text-[11px] text-white/40 font-medium mt-0.5">{a.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <div className="mx-auto max-w-5xl mb-20"><div className="divider-gradient" /></div>

      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="mb-20" id="labs">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-bold text-white">Our <span className="text-gradient-primary">Laboratories</span></h2>
          <p className="mt-1 text-sm text-white/50">State-of-the-art labs equipped with modern tools and technologies</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {labs.map((lab, i) => (
            <motion.div key={lab.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="glass-card-hover p-5"
            >
              <p className="text-2xl mb-3">{lab.icon}</p>
              <h3 className="mb-1.5 font-display text-sm font-bold text-white">{lab.name}</h3>
              <p className="text-xs text-white/50 leading-relaxed">{lab.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="mb-20" id="faculty">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-bold text-white"><span className="text-gradient-primary">Faculty</span> Highlights</h2>
          <p className="mt-1 text-sm text-white/50">Meet our distinguished faculty members</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.map((f, i) => (
            <motion.div key={f.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="glass-card-hover p-5 text-center"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-[0.04]}`} />
              <div className="relative">
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${f.color} text-base font-bold text-white shadow-md transition-transform group-hover:scale-105`}>{f.initials}</div>
                <h3 className="font-display text-sm font-bold text-white">{f.name}</h3>
                <p className="text-xs text-white/50 mt-0.5">{f.role}</p>
                <span className={`mt-3 inline-block rounded-full bg-gradient-to-r ${f.color} px-3 py-1 text-[10px] font-bold text-white shadow-sm`}>{f.expertise}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}>
        <motion.div className="relative mx-auto max-w-2xl glass-card-strong p-8 text-center">
          <div className="relative">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg"><FiMail size={24} /></div>
            <h2 className="mb-6 font-display text-2xl font-bold text-white">Get in Touch</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="flex flex-col items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-4"><FiMapPin className="text-cyan-400" size={20} /><p className="text-xs text-white/50">CS Department, Chennai</p></div>
              <div className="flex flex-col items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-4"><FiMail className="text-cyan-400" size={20} /><p className="text-xs text-white/50">csdept@ddgdvc.edu.in</p></div>
              <div className="flex flex-col items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-4"><FiPhone className="text-cyan-400" size={20} /><p className="text-xs text-white/50">+91-44-1234-5678</p></div>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
